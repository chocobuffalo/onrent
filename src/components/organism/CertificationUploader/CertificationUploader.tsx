import React, { useState, useEffect } from 'react';
// IMPORTAMOS LOS ÁTOMOS
import InputFile from '@/components/atoms/InputFile/InputFile';
import ActionButton from '@/components/atoms/Button/ActionButton';
import StatusMessage from '@/components/atoms/StatusMessage/StatusMessage';

type StatusType = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

interface UploadUrlResponse {
  upload_url: string;
  public_url: string;
}

interface SubmitResponse {
  request_id: number;
}

interface StatusResponse {
  request_id: number;
  state?: string;
  level_obtained?: string;
  score?: number;
  resolution_note?: string;
  [k: string]: any;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_ORIGIN || '';

const CertificationUploader = ({ machineId, token }: { machineId: number; token: string }) => {
  const authToken = token ?? (typeof window !== 'undefined' ? localStorage.getItem('access_token') || '' : '');

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<StatusType>('idle');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return () => {
      try {
        const fn = (window as any).__cert_poll_cleanup;
        if (typeof fn === 'function') fn();
      } catch {}
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (!e.target.files[0].type.startsWith('video/')) {
        setMessage('Solo se permiten archivos de video.');
        setVideoFile(null);
        return;
      }
      setVideoFile(e.target.files[0]);
      setMessage('');
      setStatus('idle');
      setProgress(0);
    }
  };

  const pollStatus = (requestId: number, timeoutMs = 5 * 60_000) => {
    return new Promise<void>((resolve, reject) => {
      const start = Date.now();
      const intervalMs = 3000; // feedback más rápido
      let interval = 0 as unknown as number;

      const mapToTerminal = (state?: string) => {
        if (!state) return null;
        const s = state.toString().toLowerCase().trim();
        if (['approved', 'approved_by_system', 'certified', 'done', 'onrent_black', 'onrent_black_certified', 'onrentx_black', 'standard', 'certified_standard'].includes(s)) return 'approved';
        if (['rejected', 'declined', 'not_certified', 'failed'].includes(s)) return 'rejected';
        return 'pending';
      };

      const check = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/machinery/certification/status/${requestId}`, {
            headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
          });

          console.debug('[pollStatus] HTTP', res.status, res.statusText);
          if (!res.ok) {
            console.warn('[pollStatus] response not ok', res.status);
            return;
          }

          const json = (await res.json().catch((e) => {
            console.error('[pollStatus] invalid-json', e);
            return null;
          })) as StatusResponse | null;

          console.debug('[pollStatus] body', json);

          if (!json) return;

          const state = json.state ?? json.status ?? json.result?.state ?? json.data?.state;
          // Si backend devuelve under_review pero incluye level/score -> considerarlo terminal
          const hasResultInfo = !!(json.level_obtained || (typeof json.score === 'number' && !Number.isNaN(json.score)));
          const mapped = mapToTerminal(state);

          if (mapped === 'pending') {
            // handle under_review but with result info as terminal approved
            if ((state && state.toString().toLowerCase().includes('under_review')) && hasResultInfo) {
              // interpretar como aprobado si level/score presente
              if (interval) clearInterval(interval);
              setStatus('success');
              const level = json.level_obtained ?? 'N/A';
              const score = typeof json.score === 'number' ? Math.round(json.score * 100) + '%' : 'N/A';
              setMessage(`✅ Análisis completado. Nivel: ${level}. Puntaje: ${score}`);
              resolve();
              return;
            }

            setStatus('processing');
            setMessage(`Análisis en progreso (estado: ${state}).`);
            return;
          }

          if (mapped === 'approved' || mapped === 'rejected') {
            if (interval) clearInterval(interval);
            const isApproved = mapped === 'approved';
            setStatus(isApproved ? 'success' : 'error');

            const level = json.level_obtained ?? 'N/A';
            const score = typeof json.score === 'number' ? Math.round(json.score * 100) + '%' : 'N/A';
            const note = json.resolution_note ?? '';

            const finalMessage = isApproved
              ? `✅ Análisis completado. Nivel: ${level}. Puntaje: ${score}`
              : `❌ Análisis rechazado. Razón: ${note || 'Sin nota de revisión.'}`;

            setMessage(finalMessage);
            resolve();
            return;
          }

          if (Date.now() - start > timeoutMs) {
            if (interval) clearInterval(interval);
            setStatus('error');
            setMessage('Timeout: el análisis tardó demasiado. Intenta nuevamente más tarde.');
            reject(new Error('Polling timeout'));
          }
        } catch (err) {
          console.error('[pollStatus] unexpected error', err);
        }
      };

      check().catch(() => {});
      interval = window.setInterval(check, intervalMs);
      (window as any).__cert_poll_cleanup = () => {
        if (interval) clearInterval(interval);
      };
    });
  };

  const handleSubmit = async () => {
    if (!videoFile || status !== 'idle') {
      setMessage('Por favor, selecciona un video o espera a que termine el proceso.');
      return;
    }

    if (!authToken) {
      setStatus('error');
      setMessage('No autorizado: falta token de sesión. Inicia sesión y vuelve a intentar.');
      return;
    }

    setStatus('uploading');
    setMessage('1/4: Obteniendo URL de subida de FastAPI...');
    setProgress(0);

    try {
      const urlResponse = await fetch(`${API_BASE_URL}/api/machinery/certification/get_upload_url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({
          filename: videoFile.name,
          mime_type: videoFile.type,
          machine_id: machineId,
        }),
      });

      if (!urlResponse.ok) throw new Error('Fallo al obtener la URL de subida de FastAPI.');

      const { upload_url, public_url }: UploadUrlResponse = await urlResponse.json();

      setMessage('2/4: Subiendo video... (Esto puede tardar)');
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', upload_url);
      xhr.setRequestHeader('Content-Type', videoFile.type);

      await new Promise<void>((resolve, reject) => {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Fallo en subir el video. Estado HTTP: ${xhr.status} ${xhr.statusText}`));
          }
        };
        xhr.onerror = () => reject(new Error('Error de red al intentar subir el video.'));
        xhr.send(videoFile);
      });
      setProgress(100);

      setStatus('processing');
      setMessage('3/4: Subida completa. Iniciando análisis para certificación...');

      const submitResponse = await fetch(`${API_BASE_URL}/api/machinery/certification/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({
          machine_id: machineId,
          requested_level: 'black',
          video_url: public_url,
        }),
      });

      if (!submitResponse.ok) throw new Error('Fallo al iniciar el análisis en Odoo.');

      const { request_id }: SubmitResponse = await submitResponse.json();

      setMessage('4/4: Solicitud creada. Análisis en progreso. Consultando estado...');
      await pollStatus(request_id);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Ocurrió un error desconocido durante la certificación.');
    }
  };

  const isActionDisabled = !videoFile || status !== 'idle';
  const isLoading = status === 'uploading' || status === 'processing';

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h4 className="card-title">Certifica tu maquinaria</h4>

        <InputFile
          label="La maquinaria certificada recibe una etiqueta distintiva y prioridad en el algoritmo de asignación de rentas (Video máx. 500MB)"
          onChange={handleFileChange}
          disabled={status !== 'idle'}
        />

        <ActionButton onClick={handleSubmit} isLoading={isLoading} disabled={isActionDisabled}>
          Iniciar Certificación
        </ActionButton>

        <StatusMessage status={status} message={message} progress={progress} />
      </div>
    </div>
  );
};

export default CertificationUploader;

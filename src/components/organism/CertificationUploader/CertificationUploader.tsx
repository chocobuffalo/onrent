// components/organisms/CertificationUploader/CertificationUploader.tsx

import React, { useState } from 'react';
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
  state: 'draft' | 'under_review' | 'approved' | 'rejected';
  level_obtained: string;
  score: number;
  resolution_note: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_ORIGIN || '';

const CertificationUploader = ({ machineId, token }: { machineId: number; token: string }) => {
  // authToken: usamos el token pasado por prop, con fallback a localStorage si por alguna razón no llegó
  const authToken = token ?? (typeof window !== 'undefined' ? localStorage.getItem('access_token') || '' : '');

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<StatusType>('idle');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

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
    }
  };

  const pollStatus = (requestId: number) => {
    return new Promise<void>((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          // ✅ USO DEL authToken Y URL BASE PARA POLLING
          const statusResponse = await fetch(`${API_BASE_URL}/api/machinery/certification/status/${requestId}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (!statusResponse.ok) {
            console.error('Fallo en polling. Respuesta no OK.', statusResponse.status);
            return;
          }

          const result: StatusResponse = await statusResponse.json();

          if (result.state === 'approved' || result.state === 'rejected') {
            clearInterval(interval);

            const isApproved = result.state === 'approved';
            setStatus(isApproved ? 'success' : 'error');

            const finalMessage = isApproved
              ? `✅ Análisis completado. Nivel: ${result.level_obtained || 'N/A'}. Puntaje: ${Math.round(result.score * 100)}%.`
              : `❌ Análisis rechazado. Razón: ${result.resolution_note || 'Sin nota de revisión.'}`;

            setMessage(finalMessage);
            resolve();
          }
        } catch (err) {
          console.error('Fallo en polling, reintentando...', err);
        }
      }, 10000);
    });
  };

  const handleSubmit = async () => {
    if (!videoFile || status !== 'idle') {
      setMessage('Por favor, selecciona un video o espera a que termine el proceso.');
      return;
    }

    // Validación temprana del token
    if (!authToken) {
      setStatus('error');
      setMessage('No autorizado: falta token de sesión. Inicia sesión y vuelve a intentar.');
      return;
    }

    setStatus('uploading');
    setMessage('1/4: Obteniendo URL de subida de FastAPI...');
    setProgress(0);

    try {
      // 1. Obtener la URL prefirmada de FastAPI
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

      // 2. Subir el video directamente a S3 (con seguimiento de progreso)
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

      // 3. Notificar a FastAPI/Odoo para iniciar el análisis
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

      // 4. Iniciar el "Polling" para ver el estado
      setMessage('4/4: Solicitud creada. Análisis en progreso. Consultando estado...');
      await pollStatus(request_id);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Ocurrió un error desconocido durante la certificación.');
    }
  };

  const isActionDisabled = !videoFile || status !== 'idle';

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h4 className="card-title">Certifica tu maquinaria</h4>

        {/* ÁTOMO 1: InputFile */}
        <InputFile label="La maquinaria certificada recibe una etiqueta distintiva y prioridad en el algoritmo de asignación de rentas (Video máx. 500MB)" onChange={handleFileChange} disabled={status !== 'idle'} />

        {/* ÁTOMO 2: ActionButton */}
        <ActionButton onClick={handleSubmit} isLoading={status !== 'idle'} disabled={isActionDisabled}>
          Iniciar Certificación
        </ActionButton>

        {/* ÁTOMO 3: StatusMessage */}
        <StatusMessage status={status} message={message} progress={progress} />
      </div>
    </div>
  );
};

export default CertificationUploader;

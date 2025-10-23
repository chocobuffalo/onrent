"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import useOperatorDetail from "@/hooks/backend/useOperatorDetail";
import { OperatorDetailResponse } from "@/types/operator";
import "./OperatorDetailModal.scss";
import { ImSpinner8 } from "react-icons/im";

interface OperatorDetailModalProps {
  operatorId: number;
  onClose: () => void;
  refetch?: () => Promise<void>;
}

export default function OperatorDetailModal({ 
  operatorId,
  onClose,
  refetch 
}: OperatorDetailModalProps) {
  const { operator, loading, error } = useOperatorDetail(operatorId);

  useEffect(() => {
    if (operatorId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [operatorId]);

  if (!operatorId || !operator) return null;

  const formatAvailability = (availability: string) => {
    const availabilityMap: { [key: string]: string } = {
      'available': 'Disponible',
      'unavailable': 'No disponible',
      'busy': 'Ocupado'
    };
    return availabilityMap[availability] || availability;
  };

  const formatExperienceLevel = (level: string) => {
    const levelMap: { [key: string]: string } = {
      'beginner': 'Principiante',
      'intermediate': 'Intermedio',
      'expert': 'Experto'
    };
    return levelMap[level] || level;
  };

  const getAvailabilityClass = (availability: string) => {
    const classMap: { [key: string]: string } = {
      'available': 'operator-detail-modal__status--available',
      'unavailable': 'operator-detail-modal__status--unavailable',
      'busy': 'operator-detail-modal__status--busy'
    };
    return `operator-detail-modal__status ${classMap[availability] || 'operator-detail-modal__status--unavailable'}`;
  };

  const modalContent = (
    <div 
      className="operator-detail-modal__overlay"
      onClick={onClose}
    >
      <div 
        className="operator-detail-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="operator-detail-modal__header">
          <div className="operator-detail-modal__header-info">
            <h2>Detalle del Operador #{operator.operator_id}</h2>
          </div>
          <button 
            className="operator-detail-modal__header-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>
        
        {/* Body */}
        <div className="operator-detail-modal__body">
          
          {loading && (
            <div className="flex justify-center items-center py-16">
              <ImSpinner8 className="h-8 w-8 animate-spin text-[#EA6300]" />
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && operator && (
            <>
              {/* Información principal */}
              <div className="operator-detail-modal__main-info">
                <div className="operator-detail-modal__main-info-item">
                  <div className="label">Nombre</div>
                  <p className="value">{operator.name || 'No especificado'}</p>
                </div>
                <div className="operator-detail-modal__main-info-item">
                  <div className="label">Disponibilidad</div>
                  <span className={getAvailabilityClass(operator.availability)}>
                    {formatAvailability(operator.availability)}
                  </span>
                </div>
                <div className="operator-detail-modal__main-info-item">
                  <div className="label">Estado</div>
                  <span className={`operator-detail-modal__status ${
                    operator.active 
                      ? 'operator-detail-modal__status--active' 
                      : 'operator-detail-modal__status--inactive'
                  }`}>
                    {operator.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="operator-detail-modal__main-info-item">
                  <div className="label">Experiencia</div>
                  <p className="value value--large value--accent">
                    {operator.experience_years || 0} años
                  </p>
                </div>
              </div>

              {/* Información Personal */}
              <div className="operator-detail-modal__section">
                <h3 className="operator-detail-modal__section-title">
                  Información Personal
                </h3>
                <div className="operator-detail-modal__personal-info">
                  <div className="operator-detail-modal__personal-info-grid">
                    <div className="operator-detail-modal__personal-info-item">
                      <div className="field-label">Correo</div>
                      <p className="field-value">
                        {operator.email || 'No especificado'}
                      </p>
                    </div>
                    <div className="operator-detail-modal__personal-info-item">
                      <div className="field-label">Teléfono</div>
                      <p className="field-value">
                        {operator.phone || 'No especificado'}
                      </p>
                    </div>
                    <div className="operator-detail-modal__personal-info-item">
                      <div className="field-label">CURP</div>
                      <p className="field-value">
                        {operator.curp || 'No especificado'}
                      </p>
                    </div>
                    <div className="operator-detail-modal__personal-info-item">
                      <div className="field-label">Región</div>
                      <p className="field-value">
                        {operator.region?.name || 'No especificada'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificaciones y Licencias */}
              <div className="operator-detail-modal__section">
                <h3 className="operator-detail-modal__section-title">
                  Certificaciones y Licencias
                </h3>
                <div className="operator-detail-modal__certifications-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Tipo de Licencia</th>
                        <th>Número de Licencia</th>
                        <th>Nivel de Experiencia</th>
                        <th>Estado de Capacitación</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{operator.license_type || 'No especificado'}</td>
                        <td>{operator.license_number || 'No especificado'}</td>
                        <td>{formatExperienceLevel(operator.experience_level || '')}</td>
                        <td>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            operator.training_status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {operator.training_status === 'completed' ? 'Completada' : 'Pendiente'}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Maquinaria Compatible */}
              {operator.compatible_machines && operator.compatible_machines.length > 0 && (
                <div className="operator-detail-modal__section">
                  <h3 className="operator-detail-modal__section-title">
                    Maquinaria Compatible
                  </h3>
                  <div className="operator-detail-modal__machines-table">
                    <table>
                      <thead>
                        <tr>
                          <th>ID Maquinaria</th>
                          <th>Nombre</th>
                        </tr>
                      </thead>
                      <tbody>
                        {operator.compatible_machines.map((machine, index) => (
                          <tr key={machine.machine_id || index}>
                            <td>{machine.machine_id}</td>
                            <td>{machine.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Notas Adicionales */}
              {operator.notes && (
                <div className="operator-detail-modal__section">
                  <h3 className="operator-detail-modal__section-title">
                    Notas Adicionales
                  </h3>
                  <div className="operator-detail-modal__notes">
                    <p>{operator.notes}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
}

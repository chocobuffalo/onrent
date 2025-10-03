// src/components/organism/AddMoreMachinesModal/AddMoreMachinesModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useUIAppSelector } from '@/libs/redux/hooks';
import { FiX, FiSearch, FiCalendar, FiMapPin } from 'react-icons/fi';
import Catalogue from '@/components/organism/Catalogue/CatalogueContainer';

interface AddMoreMachinesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectMachine: (machine: any) => void;
}

export const AddMoreMachinesModal = ({
    isOpen,
    onClose,
    onSelectMachine
}: AddMoreMachinesModalProps) => {
    const bookingSession = useUIAppSelector(state => state.bookingSession);
    const [search, setSearch] = useState('');

    useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => {
        document.body.style.overflow = 'unset';
    };
    }, [isOpen]);

    if (!isOpen) return null;

    const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    });
    };

    const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
            <div className="p-4 md:p-6 border-b">
            <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Agregar más máquinas
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                Selecciona otra máquina para agregar a tu reserva con las mismas condiciones
                </p>
                
              {/* Info de la sesión */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                    <FiCalendar className="text-orange-500" size={16} />
                    <span className="font-medium">
                    {formatDate(bookingSession.startDate)} - {formatDate(bookingSession.endDate)}
                    </span>
                </div>
                
                {bookingSession.location?.address && (
                    <div className="flex items-center gap-2 text-gray-700">
                    <FiMapPin className="text-orange-500" size={16} />
                    <span className="font-medium truncate max-w-xs">
                        {bookingSession.location.address}
                    </span>
                    </div>
                )}
                
                    {bookingSession.items.length > 0 && (
                    <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {bookingSession.items.length} máquina(s) agregada(s)
                    </span>
                        </div>
                )}
                </div>
            </div>
            
            <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0"
                aria-label="Cerrar"
            >
                <FiX size={24} />
            </button>
            </div>
        </div>

        {/* Search */}
        <div className="p-4 md:p-6 border-b bg-gray-50">
            <div className="flex items-center px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm">
            <FiSearch className="text-gray-400 mr-3" size={18} />
            <input
                type="text"
                placeholder="Buscar por nombre de máquina..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none text-sm"
                autoFocus
            />
            </div>
        </div>

        {/* Catalogue Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <Catalogue 
            searchValue={search}
            selectionMode={true}
            onSelectMachine={onSelectMachine}
            />
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-3">
            <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold"
            >
                Cancelar
            </button>
            <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-secondary text-white rounded-lg hover:bg-orange-600 transition font-semibold"
            >
                Continuar con la reserva
            </button>
            </div>
        </div>
        </div>
    </div>
    );

    return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
};
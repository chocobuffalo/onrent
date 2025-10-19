'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useUIAppSelector } from '@/libs/redux/hooks';
import { FiX, FiSearch, FiMapPin } from 'react-icons/fi';
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

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-start lg:items-center justify-center bg-black bg-opacity-50 pt-16 lg:pt-0 overflow-x-hidden overflow-y-auto">
            {/* ✅ Contenedor con margin-top en móviles para bajar todo el contenido */}
            <div className="bg-white w-full max-w-full lg:max-w-6xl h-auto lg:rounded-lg lg:max-h-[90vh] flex flex-col shadow-xl mx-0 lg:mx-4 mt-4 sm:mt-0">
                
                {/* Header */}
                <div className="flex-shrink-0 p-4 lg:p-6 lg:mt-8 border-b bg-white lg:rounded-t-lg">
                    <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xs sm:text-sm lg:text-xl xl:text-2xl font-bold text-gray-900 mb-2 pt-2 lg:pt-0 leading-tight">
                                AGREGAR MÁS MÁQUINAS
                            </h2>
                            <p className="text-[11px] sm:text-xs md:text-sm lg:text-sm text-gray-600 mb-3 lg:mb-4 leading-snug">
                                Selecciona otra máquina para agregar a tu reserva con las mismas condiciones
                            </p>
                            
                            <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-col gap-2 md:gap-x-4 md:gap-y-2 lg:gap-2 text-[10px] sm:text-xs md:text-sm lg:text-sm">
                                {bookingSession.location?.address && (
                                    <div className="flex items-center gap-2 text-gray-700 min-w-0">
                                        <FiMapPin className="text-orange-500 flex-shrink-0" size={16} />
                                        <span className="font-medium truncate lg:line-clamp-2 lg:break-words">
                                            {bookingSession.location.address}
                                        </span>
                                    </div>
                                )}
                                
                                {bookingSession.items.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
                                            {bookingSession.items.length} máquina(s) agregada(s)
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0 mt-2 lg:mt-0"
                            aria-label="Cerrar"
                        >
                            <FiX size={24} />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="flex-shrink-0 p-4 lg:p-6 border-b bg-gray-50">
                    <div className="flex items-center px-3 lg:px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg bg-white shadow-sm">
                        <FiSearch className="text-gray-400 mr-3 flex-shrink-0" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre de máquina..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full outline-none text-sm"
                        />
                    </div>
                </div>

                {/* Catalogue Grid - Con overflow-y-scroll */}
                <div className="flex-1 overflow-y-scroll overflow-x-hidden p-4 lg:p-6">
                    <Catalogue 
                        searchValue={search}
                        selectionMode={true}
                        onSelectMachine={onSelectMachine}
                    />
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-4 lg:p-6 border-t bg-gray-50 lg:rounded-b-lg">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onClose}
                            className="w-full sm:flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold text-sm lg:text-base"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full sm:flex-1 px-6 py-3 bg-secondary text-white rounded-lg hover:bg-orange-600 transition font-semibold text-sm lg:text-base"
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

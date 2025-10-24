'use client';
import { useState, useRef, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { MdKeyboardArrowDown } from 'react-icons/md';

interface Option {
  id: number;
  name: string;
}

interface MultiSelectCheckboxProps {
  options: Option[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

export default function MultiSelectCheckbox({
  options,
  selectedIds,
  onChange,
  placeholder = 'Seleccionar opciones',
  label,
  error
}: MultiSelectCheckboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const removeOption = (id: number) => {
    onChange(selectedIds.filter(selectedId => selectedId !== id));
  };

  const getSelectedOptions = () => {
    return options.filter(option => selectedIds.includes(option.id));
  };

  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      
      <div ref={dropdownRef} style={{ position: 'relative' }}>
        {/* Campo principal que muestra las selecciones */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            minHeight: '55px',
            padding: '0.75rem 0.90rem',
            borderRadius: '1rem',
            border: `2px solid ${error ? '#dc3545' : '#e5e7eb'}`,
            backgroundColor: '#fff',
            cursor: 'pointer',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {/* Tags de las opciones seleccionadas */}
          {getSelectedOptions().length > 0 ? (
            getSelectedOptions().map(option => (
              <div
                key={option.id}
                style={{
                  backgroundColor: '#ff6b35',
                  color: '#fff',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(option.id);
                }}
              >
                <span>{option.name}</span>
                <IoMdClose size={16} style={{ cursor: 'pointer' }} />
              </div>
            ))
          ) : (
            <span style={{ color: '#6c757d', fontSize: '14px' }}>
              {placeholder}
            </span>
          )}
          
          {/* Icono de flecha */}
          <MdKeyboardArrowDown
            size={20}
            style={{
              position: 'absolute',
              right: '0.90rem',
              color: '#6c757d',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}
          />
        </div>

        {/* Dropdown con checkboxes */}
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              border: '2px solid #e5e7eb',
              borderRadius: '1rem',
              maxHeight: '240px',
              overflowY: 'auto',
              zIndex: 1000,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            {options.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#6c757d' }}>
                No hay opciones disponibles
              </div>
            ) : (
              options.map(option => (
                <div
                  key={option.id}
                  onClick={() => toggleOption(option.id)}
                  style={{
                    padding: '0.75rem 0.90rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    backgroundColor: selectedIds.includes(option.id) ? '#fff5f2' : 'transparent',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedIds.includes(option.id)) {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedIds.includes(option.id)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {/* Checkbox personalizado */}
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      border: '2px solid #ff6b35',
                      backgroundColor: selectedIds.includes(option.id) ? '#ff6b35' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {selectedIds.includes(option.id) && (
                      <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                    )}
                  </div>
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    {option.name}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {error && <span className="text-danger" style={{ fontSize: '14px', marginTop: '0.25rem', display: 'block' }}>{error}</span>}
      
      {!error && (
        <small className="form-text text-muted" style={{ marginTop: '0.25rem', display: 'block' }}>
          Selecciona una o más máquinas compatibles
        </small>
      )}
    </div>
  );
}

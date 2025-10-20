import usePersonalForm from "@/hooks/backend/usePersonalForm";
import { ImSpinner8 } from "react-icons/im";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";

interface PersonalFormProps {
    showOperatorForm: boolean;
    onOperatorFormReset: () => void;
}

export default function PersonalForm({ showOperatorForm, onOperatorFormReset }: PersonalFormProps) {
    const {
        onSubmit,
        errors,
        handleSubmit,
        register,
        isValid,
        isLoading,
        authEmail,
        regions,
        isLoadingRegions,
        selectedRegion,
        setSelectedRegion,
        hasChanges,
        locationStatus,
        cityError,
        setCityError,
    } = usePersonalForm({ showOperatorForm, onOperatorFormReset });
    
    return (
        <div className="">
            <h2 className="form-title mb-2">Información Personal</h2>
            <form 
                onSubmit={handleSubmit(
                    (data) => {
                        // Si llegó aquí, la validación de Yup pasó
                        // Ahora validar ciudad manualmente
                        if (!selectedRegion) {
                            setCityError(true);
                            toast.error('El campo ciudad es obligatorio');
                            return;
                        }
                        setCityError(false);
                        onSubmit(data);
                    }, 
                    (validationErrors) => {
                        // Esta función se ejecuta cuando la validación de Yup falla
                        const missingFields: string[] = [];
                        
                        if (validationErrors.fullName) {
                            missingFields.push('nombre completo');
                        }
                        
                        if (validationErrors.telephone) {
                            missingFields.push('teléfono');
                        }
                        
                        if (!selectedRegion) {
                            setCityError(true);
                            missingFields.push('ciudad');
                        }
                        
                        if (missingFields.length > 0) {
                            let errorMessage = '';
                            if (missingFields.length === 1) {
                                errorMessage = `El campo ${missingFields[0]} es obligatorio`;
                            } else if (missingFields.length === 2) {
                                errorMessage = `Los campos ${missingFields[0]} y ${missingFields[1]} son obligatorios`;
                            } else {
                                errorMessage = `Los campos ${missingFields[0]}, ${missingFields[1]} y ${missingFields[2]} son obligatorios`;
                            }
                            toast.error(errorMessage);
                        }
                    }
                )} 
                className=""
            >
                <div className="profile-personal">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="fullName">Nombre Completo</label>
                                <input
                                    {...register('fullName')}
                                    type="text"
                                    className="form-control"
                                    placeholder="Tu nombre"
                                />
                                {errors.fullName && (
                                    <span className="text-danger">{errors.fullName.message}</span>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="telephone">Teléfono</label>
                                <input
                                    {...register('telephone')}
                                    type="text"
                                    className="form-control"
                                    placeholder="Tu teléfono"
                                />
                                {errors.telephone && (
                                    <span className="text-danger">{errors.telephone.message}</span>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="email">Correo Electrónico</label>
                                <input
                                    disabled
                                    type="text"
                                    className="form-control disabled"
                                    placeholder="Tu correo electrónico"
                                    value={authEmail}
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="region">Ciudad (Región)</label>
                                {isLoadingRegions ? (
                                    <div className="form-control d-flex align-items-center">
                                        <ImSpinner8 color="#6c757d" size={16} className="animate-spin me-2" />
                                        <span>Cargando regiones...</span>
                                    </div>
                                ) : (
                                    <>
                                        <select
                                            className="form-control placeholder:text-gray-400"
                                            value={selectedRegion || ""}
                                            onChange={(e) => {
                                                setSelectedRegion(e.target.value ? Number(e.target.value) : null);
                                                setCityError(false);
                                            }}
                                            style={{ 
                                                fontSize: '14px', 
                                                color: selectedRegion ? '#212529' : '#6c757d',
                                                borderRadius: '1rem',
                                                padding: '0.75rem 0.90rem',
                                                height: 'auto',
                                                minHeight: '55px'
                                            }}
                                        >
                                            <option value="" disabled style={{ color: '#6c757d' }}>Selecciona tu región</option>
                                            {regions.map((region) => (
                                                <option key={region.id} value={region.id} className="text-gray-900">
                                                    {region.name}
                                                </option>
                                            ))}
                                        </select>
                                        {cityError && (
                                            <span className="text-danger">La ciudad es obligatoria</span>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {showOperatorForm && (
                        <div className="mt-4">
                            <h2 className="form-title mb-2">Información de Operador</h2>
                            
                            <div className="mb-4">
                                {locationStatus === 'loading' && (
                                    <div className="alert alert-info d-flex align-items-center" style={{ borderRadius: '0.5rem' }}>
                                        <ImSpinner8 size={20} className="animate-spin me-2" />
                                        <span>Obteniendo tu ubicación...</span>
                                    </div>
                                )}
                                {locationStatus === 'success' && (
                                    <div className="alert alert-success d-flex align-items-center" style={{ borderRadius: '0.5rem' }}>
                                        <FaCheckCircle size={20} className="me-2" />
                                        <span>✓ Ubicación obtenida correctamente</span>
                                    </div>
                                )}
                                {locationStatus === 'error' && (
                                    <div className="alert alert-warning d-flex align-items-center" style={{ borderRadius: '0.5rem' }}>
                                        <FaExclamationTriangle size={20} className="me-2" />
                                        <span>No se pudo obtener la ubicación. Por favor, permite el acceso a tu ubicación en el navegador.</span>
                                    </div>
                                )}
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="curp">CURP</label>
                                        <input
                                            {...register('curp')}
                                            type="text"
                                            className="form-control"
                                            placeholder="CURP (18 caracteres)"
                                            maxLength={18}
                                        />
                                        {errors.curp && (
                                            <span className="text-danger">{errors.curp.message}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="licenseNumber">Número de Licencia</label>
                                        <input
                                            {...register('licenseNumber')}
                                            type="text"
                                            className="form-control"
                                            placeholder="Número de licencia"
                                        />
                                        {errors.licenseNumber && (
                                            <span className="text-danger">{errors.licenseNumber.message}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="licenseType">Tipo de Licencia</label>
                                        <input
                                            {...register('licenseType')}
                                            type="text"
                                            className="form-control"
                                            placeholder="Tipo de licencia (Ej: A, B, C, D, E)"
                                        />
                                        {errors.licenseType && (
                                            <span className="text-danger">{errors.licenseType.message}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="experienceYears">Años de Experiencia</label>
                                        <input
                                            {...register('experienceYears')}
                                            type="number"
                                            className="form-control"
                                            placeholder="Años de experiencia"
                                            min="0"
                                        />
                                        {errors.experienceYears && (
                                            <span className="text-danger">{errors.experienceYears.message}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="experienceLevel">Nivel de Experiencia</label>
                                        <input
                                            {...register('experienceLevel')}
                                            type="text"
                                            className="form-control"
                                            placeholder="Nivel de experiencia (Ej: Principiante, Intermedio, Avanzado)"
                                        />
                                        {errors.experienceLevel && (
                                            <span className="text-danger">{errors.experienceLevel.message}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="trainingStatus">Estado de Capacitación</label>
                                        <input
                                            {...register('trainingStatus')}
                                            type="text"
                                            className="form-control"
                                            placeholder="Estado de capacitación (Ej: Sin capacitación, Capacitado)"
                                        />
                                        {errors.trainingStatus && (
                                            <span className="text-danger">{errors.trainingStatus.message}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="availability">Disponibilidad</label>
                                        <input
                                            {...register('availability')}
                                            type="text"
                                            className="form-control"
                                            placeholder="Disponibilidad (Ej: Disponible, No disponible)"
                                        />
                                        {errors.availability && (
                                            <span className="text-danger">{errors.availability.message}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group d-flex align-items-center" style={{ marginTop: '32px' }}>
                                        <input
                                            {...register('hasEpp')}
                                            type="checkbox"
                                            id="hasEpp"
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                marginRight: '10px',
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <label htmlFor="hasEpp" style={{ marginBottom: 0, cursor: 'pointer' }}>
                                            ¿Cuenta con EPP (Equipo de Protección Personal)?
                                        </label>
                                    </div>
                                </div>
                                
                                <input {...register('gpsLat')} type="hidden" />
                                <input {...register('gpsLng')} type="hidden" />
                            </div>
                        </div>
                    )}

                    <div className="group-button-submit left mb-0">
                        <button className="pre-btn" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <ImSpinner8 color="#ffffff" size={20} className="animate-spin mx-auto" />
                            ) : (
                                <span>Actualizar</span>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

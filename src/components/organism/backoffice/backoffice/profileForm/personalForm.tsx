import usePersonalForm from "@/hooks/backend/usePersonalForm";
import { ImSpinner8 } from "react-icons/im";

export default function PersonalForm() {
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
    } = usePersonalForm();
    
    return (
        <div className="">
             <h2 className="form-title mb-2">Información Personal</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="profile-personal">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="listing_title">Nombre Completo</label>
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
                                <label htmlFor="listing_title">Teléfono</label>
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
                                <label htmlFor="listing_title">Correo Electrónico</label>
                                <input
                                    disabled
                                    type="text"
                                    className="form-control disabled"
                                    name="listing_title"
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
                                    <select
                                        className="form-control placeholder:text-gray-400"
                                        value={selectedRegion || ""}
                                        onChange={(e) => setSelectedRegion(e.target.value ? Number(e.target.value) : null)}
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
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="group-button-submit left mb-0">
                        <button className="pre-btn" type="submit" disabled={!isValid && !isLoading}>
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
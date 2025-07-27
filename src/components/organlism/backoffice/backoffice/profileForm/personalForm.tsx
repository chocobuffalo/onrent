import usePersonalForm from "@/hooks/backend/usePersonalForm";
import { ImSpinner8 } from "react-icons/im";

export default function PersonalForm(){
    const {
        onSubmit,
        errors,
        handleSubmit,
        register,
        isValid,
        isLoading,
        authEmail
    } = usePersonalForm();

    return (
        <div className="mb-4">
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
                    </div>
                    <div className="group-button-submit left mb-0">
                        <button className="pre-btn" type="submit" disabled={!isValid && !isLoading}>
                            {isLoading ? (
                                <ImSpinner8 color="#ffffff" size={20} className="animate-spin mx-auto" />
                            ) : (
                                <span>Actualizar Perfil</span>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
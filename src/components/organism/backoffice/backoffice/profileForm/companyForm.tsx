import Input from "@/components/atoms/Input/Input";
import useCompanyInfo from "@/hooks/backend/useCompanyInfo";
import { ImSpinner8 } from "react-icons/im";

export default function CompanyForm(){
    const {
        onSubmit,
        errors,
        handleSubmit,
        register,
        isValid,
        isLoading
    } = useCompanyInfo();

    return(
          <div className="mb-4 tfcl-add-listing">
             <h2 className="form-title mb-2">Información Empresa</h2>
             <h4 className="mb-2">Datos Generales de la Empresa</h4>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="profile-personal">
                    <div className="row">
                        <div className="col-12">
                            <Input
                                label="Razón Social (obligatorio)"
                                type="text"
                                name="empresa"
                                placeHolder="Nombre fiscal completo de la empresa."
                                register={register}
                                errors={errors}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Input
                                label="RFC (obligatorio)"
                                type="text"
                                name="rfc_empresa"
                                placeHolder="Para facturación electrónica (CFDI)."
                                register={register}
                                errors={errors}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Input
                                label="Dirección (obligatorio)"
                                type="text"
                                name="direccion_empresa"
                                placeHolder="Dirección fiscal de la empresa."
                                register={register}
                                errors={errors}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Input
                                label="Contacto Fiscal (obligatorio)"
                                type="text"
                                name="contacto_fiscal"
                                placeHolder="Nombre del contacto fiscal."
                                register={register}
                                errors={errors}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Input
                                label="Teléfono de Contacto (obligatorio)"
                                type="text"
                                name="telefono_contacto"
                                placeHolder="Teléfono del contacto fiscal."
                                register={register}
                                errors={errors}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Input
                                label="Representante Legal (obligatorio)"
                                type="text"
                                name="representante_legal"
                                placeHolder="Nombre del representante legal."
                                register={register}
                                errors={errors}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Input
                                label="Número de Empleados (obligatorio)"
                                type="number"
                                name="empleados"
                                placeHolder="Número total de empleados."
                                register={register}
                                errors={errors}
                            />
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
    )
}
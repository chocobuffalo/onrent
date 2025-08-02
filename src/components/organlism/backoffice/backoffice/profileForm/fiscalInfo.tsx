import FileInput from "@/components/atoms/FileInput/FileInput";
import Input from "@/components/atoms/Input/Input";
import useFiscalInfo from "@/hooks/backend/useFiscalInfo";
import { ImSpinner8 } from "react-icons/im";

export default function FiscalInfo() {
  

    const {  isLoading,
        register,
        handleSubmit,
        submit,
        errors,
        isValid } = useFiscalInfo();

        
    return (
        <div className="fiscal-info  tfcl-add-listing">
            <h2 className="form-title mb-2">Datos fiscales</h2>
            <form className="fiscal-form" onSubmit={handleSubmit(submit)}>
                {/* Add form fields for fiscal information here */}
                <div className="row">
                    <div className="col-12">
                        <Input
                            label="RFC obligatorio para CFDI"
                            name="rfc"
                            type="text"
                            placeHolder=""
                            register={register}
                            errors={errors}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Input
                            label="Razón social"
                            name="razon_social"
                            type="text"
                            placeHolder=""
                            register={register}
                            errors={errors}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Input
                            label="Dirección fiscal"
                            name="direccion_fiscal"
                            type="text"
                            placeHolder=""
                            register={register}
                            errors={errors}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <FileInput name="certificado" placeHolder="Subir archivo PDF" label="Constancia de situación fiscal (PDF):" register={register} />
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
            </form>
            
        </div>
    );
}
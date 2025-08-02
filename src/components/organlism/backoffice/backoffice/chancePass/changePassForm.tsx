'use client';
import { ImSpinner8 } from "react-icons/im";
import useChangePass from "@/hooks/backend/useChangePass";
import SecretInput from "@/components/atoms/secretInput/secretInput";




export default function ChangePassForm() {
    
    const {
       onSubmit,
        errors,
        handleSubmit,
        register,
        isValid,
        isLoading
    } = useChangePass();

    return(
        
            <>
                <h1 className="admin-title">Cambiar Contraseña</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="tfcl-add-listing profile-inner">
                  <div className="tfcl-add-listing profile-password">
                    <SecretInput 
                        register={register} 
                        errors={errors} 
                        label="Contraseña anterior" 
                        placeHolder="Contraseña anterior" 
                        id={'oldPassword'}
                        classWrapper="form-group relative" 
                        inputClass="" />
                    <SecretInput 
                        register={register}
                        errors={errors}
                        label="Nueva contraseña"
                        placeHolder="Nueva contraseña"
                        id={'newPassword'}
                        classWrapper="form-group relative"
                        inputClass="" />
                    <SecretInput
                        register={register}
                        errors={errors}
                        label="Confirmar contraseña"
                        placeHolder="Confirmar contraseña"
                        id={'confirmPassword'}
                        classWrapper="form-group relative"
                        inputClass="" />
                    <div className="group-button-submit left mb-0">
                      <button className="pre-btn" type="submit"  disabled={!isValid && !isLoading}>
                         {isLoading ?<ImSpinner8 color="#ffffff" size={20} className="animate-spin mx-auto" />: <span>Cambiar contraseña</span>}
                      </button>
                    </div>
                  </div>
                </form>
            
            </>
    )
}
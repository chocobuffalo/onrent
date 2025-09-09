import SelectInput from "@/components/atoms/selectInput/selectInput";
import { userRoles } from "@/constants/user";
import useRoleForm from "@/hooks/backend/useRoleForm";
import { ImSpinner8 } from "react-icons/im";

export default function RoleForm(){
    const {register, handleSubmit, onSubmit, errors, isValid, isSubmitting, isLoading, roleOption} = useRoleForm();
   // console.log(roleOption)
    return(
           <div className="">
                     <h2 className="form-title mb-2">Tipo de usuario</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="">
                        <div className="profile-personal">
                            <div className="row">
                               
                                    <div className="col-md-12">
                                        <SelectInput 
                                        errors={errors}
                                        name="new_role"
                                        options={userRoles}
                                        register={register}
                                        defaultValue={roleOption}
                                        label=""
                                        />
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
    )
}
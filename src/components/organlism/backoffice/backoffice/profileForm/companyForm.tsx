import useCompanyInfo from "@/hooks/backend/useCompanyInfo";

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
          <div className="mb-4">
             <h2 className="form-title mb-2">Información de la Empresa</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="profile-personal">
                    <div className="row"></div>
                </div>
            </form>
            <hr />
            </div>
    )
}
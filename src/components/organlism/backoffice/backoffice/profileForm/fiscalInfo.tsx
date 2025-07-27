import useFiscalInfo from "@/hooks/backend/useFiscalInfo";

export default function FiscalInfo() {
    // This component can be used to display and manage fiscal information
    // It can include fields for tax ID, business registration, etc.
    // Here we can return any necessary JSX elements or hooks
    const { isLoading } = useFiscalInfo();
    return (
        <div className="fiscal-info">
            <h2 className="form-title mb-2">Datos Fiscales</h2>
            <form className="fiscal-form">
                {/* Add form fields for fiscal information here */}
                <div className="row">
                    <div className="col-12">

                    </div>
                </div>
            </form>
            <hr />
        </div>
    );
}
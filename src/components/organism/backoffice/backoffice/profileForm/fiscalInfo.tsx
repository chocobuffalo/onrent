import FileInput from "@/components/atoms/FileInput/FileInput";
import Input from "@/components/atoms/Input/Input";
import useFiscalInfo from "@/hooks/backend/useFiscalInfo";
import { ImSpinner8 } from "react-icons/im";

export default function FiscalInfo() {
    const {  
        isLoading,
        register,
        handleSubmit,
        submit,
        errors,
        isValid,
        handleFileChange,
        pdfFile
    } = useFiscalInfo();

    return (
        <div className="fiscal-info  tfcl-add-listing">
            <h2 className="form-title mb-2">Datos fiscales</h2>
            <form className="fiscal-form" onSubmit={handleSubmit(submit)}>
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
                        <div className="form-group">
                            <label 
                                htmlFor="pdf-upload" 
                                className="form-label"
                                style={{ 
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    color: '#374151'
                                }}
                            >
                                Constancia de situación fiscal (PDF):
                            </label>
                            
                            <label 
                                htmlFor="pdf-upload" 
                                className="file-upload-btn"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '12px 24px',
                                    border: '2px solid #ff6b35',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: 'white',
                                    color: pdfFile ? '#ff6b35' : '#374151',
                                    transition: 'all 0.3s ease',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                <svg 
                                    width="20" 
                                    height="20" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke={pdfFile ? '#ff6b35' : 'currentColor'}
                                    strokeWidth="2"
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="12" y1="18" x2="12" y2="12" />
                                    <line x1="9" y1="15" x2="15" y2="15" />
                                </svg>
                                {pdfFile ? '✓ PDF cargado correctamente' : 'Subir archivo PDF'}
                            </label>
                            
                            <input
                                type="file"
                                id="pdf-upload"
                                accept="application/pdf,.pdf"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>
                </div>

                <div className="group-button-submit left mb-0">
                    <button 
                        className="pre-btn" 
                        type="submit" 
                        disabled={!isValid || isLoading}
                    >
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
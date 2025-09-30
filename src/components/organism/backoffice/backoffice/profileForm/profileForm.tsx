// src/components/organism/profile/profileForm.tsx
'use client';
import { useState, useRef } from "react";
import PersonalForm from "./personalForm";
import CompanyForm from "./companyForm";
import FiscalInfo from "./fiscalInfo";
import RoleForm from "./roleForm";

export default function ProfileForm() {
    const [showRoleForm, setShowRoleForm] = useState(false);
    const [showBillingInfo, setShowBillingInfo] = useState(false);
    const [showOperatorForm, setShowOperatorForm] = useState(false);
    const roleFormRef = useRef<HTMLDivElement>(null);
    const billingInfoRef = useRef<HTMLDivElement>(null);
    const operatorFormRef = useRef<HTMLDivElement>(null);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setShowRoleForm(isChecked);
        
        if (isChecked) {
            setTimeout(() => {
                roleFormRef.current?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    };

    const handleBillingCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setShowBillingInfo(isChecked);
        
        if (isChecked) {
            setTimeout(() => {
                billingInfoRef.current?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    };

    const handleOperatorCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setShowOperatorForm(isChecked);
        
        if (isChecked) {
            setTimeout(() => {
                operatorFormRef.current?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    };

    const handleOperatorFormReset = () => {
        setShowOperatorForm(false);
    };

    return (
        <div className="">
            <div className="tfcl-add-listing">
                <PersonalForm 
                    showOperatorForm={showOperatorForm} 
                    onOperatorFormReset={handleOperatorFormReset}
                />
            </div>
            
            {/* Checkbox para información fiscal y empresarial */}
            <div style={{ paddingTop: '20px', paddingBottom: '20px', paddingLeft: '25px', marginBottom: '12px' }}>
                <div className="flex items-center relative">
                    <input
                        type="checkbox"
                        id="billingInfo"
                        checked={showBillingInfo}
                        onChange={handleBillingCheckboxChange}
                        style={{
                            appearance: 'none',
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            border: '2px solid #ff6b35',
                            backgroundColor: showBillingInfo ? '#ff6b35' : 'transparent',
                            marginRight: '32px',
                            cursor: 'pointer',
                            flexShrink: 0
                        }}
                    />
                    {showBillingInfo && (
                        <div style={{
                            position: 'absolute',
                            left: '6px',
                            top: '2px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            pointerEvents: 'none'
                        }}>
                            ✓
                        </div>
                    )}
                    <label 
                        htmlFor="billingInfo"
                        style={{
                            fontSize: '18px',
                            fontWeight: '500',
                            color: '#374151',
                            cursor: 'pointer'
                        }}
                    >
                        ¿Necesita factura con datos fiscales?
                    </label>
                </div>
            </div>

            {showBillingInfo && (
                <div ref={billingInfoRef}>
                    <FiscalInfo/>
                    <CompanyForm/>
                </div>
            )}

            {/* Checkbox para información de operador */}
            <div style={{ paddingTop: '20px', paddingBottom: '20px', paddingLeft: '25px', marginBottom: '12px' }} ref={operatorFormRef}>
                <div className="flex items-center relative">
                    <input
                        type="checkbox"
                        id="operatorInfo"
                        checked={showOperatorForm}
                        onChange={handleOperatorCheckboxChange}
                        style={{
                            appearance: 'none',
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            border: '2px solid #ff6b35',
                            backgroundColor: showOperatorForm ? '#ff6b35' : 'transparent',
                            marginRight: '32px',
                            cursor: 'pointer',
                            flexShrink: 0
                        }}
                    />
                    {showOperatorForm && (
                        <div style={{
                            position: 'absolute',
                            left: '6px',
                            top: '2px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            pointerEvents: 'none'
                        }}>
                            ✓
                        </div>
                    )}
                    <label 
                        htmlFor="operatorInfo"
                        style={{
                            fontSize: '18px',
                            fontWeight: '500',
                            color: '#374151',
                            cursor: 'pointer'
                        }}
                    >
                        ¿Deseas participar en las ofertas como operario? ¡Completa tu perfil!
                    </label>
                </div>
            </div>
            
            {/* Checkbox para rentar maquinaria */}
            <div style={{ paddingTop: '20px', paddingBottom: '20px', paddingLeft: '25px', marginBottom: '12px' }}>
                <div className="flex items-center relative">
                    <input
                        type="checkbox"
                        id="rentMachinery"
                        checked={showRoleForm}
                        onChange={handleCheckboxChange}
                        style={{
                            appearance: 'none',
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            border: '2px solid #ff6b35',
                            backgroundColor: showRoleForm ? '#ff6b35' : 'transparent',
                            marginRight: '32px',
                            cursor: 'pointer',
                            flexShrink: 0
                        }}
                    />
                    {showRoleForm && (
                        <div style={{
                            position: 'absolute',
                            left: '6px',
                            top: '2px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            pointerEvents: 'none'
                        }}>
                            ✓
                        </div>
                    )}
                    <label 
                        htmlFor="rentMachinery"
                        style={{
                            fontSize: '18px',
                            fontWeight: '500',
                            color: '#374151',
                            cursor: 'pointer'
                        }}
                    >
                        ¿Te gustaría rentar tu maquinaria?
                    </label>
                </div>
            </div>

            {showRoleForm && (
                <div className="tfcl-add-listing" ref={roleFormRef}>
                    <RoleForm />
                </div>
            )}
        </div>
    );
}
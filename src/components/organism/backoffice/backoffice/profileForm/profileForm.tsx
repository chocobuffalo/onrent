'use client';
import { useState, useRef } from "react";
import PersonalForm from "./personalForm";
import CompanyForm from "./companyForm";
import FiscalInfo from "./fiscalInfo";
import useRoleForm from "@/hooks/backend/useRoleForm";

export default function ProfileForm() {
  const [showBillingInfo, setShowBillingInfo] = useState(false);
  const [showOperatorForm, setShowOperatorForm] = useState(false);
  const billingInfoRef = useRef<HTMLDivElement>(null);
  const operatorFormRef = useRef<HTMLDivElement>(null);

  const { roleOption } = useRoleForm();

  const handleBillingCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setShowBillingInfo(isChecked);
    if (isChecked) {
      setTimeout(() => {
        billingInfoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const handleOperatorCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setShowOperatorForm(isChecked);
    if (isChecked) {
      setTimeout(() => {
        operatorFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const handleOperatorFormReset = () => {
    setShowOperatorForm(false);
  };

  // 👇 extrae el valor seguro del rol (puede ser undefined)
  const currentRole = roleOption?.value; // e.g. "operator" | "client" | "provider" | undefined
  const isOperator = currentRole === "operador";

  return (
    <div className="">
      <div className="tfcl-add-listing">
        <PersonalForm
          showOperatorForm={showOperatorForm}
          onOperatorFormReset={handleOperatorFormReset}
        />
      </div>

      {/* Checkbox para información fiscal */}
      <div style={{ paddingTop: "20px", paddingBottom: "20px", paddingLeft: "25px", marginBottom: "12px" }}>
        <div className="flex items-center relative">
          <input
            type="checkbox"
            id="billingInfo"
            checked={showBillingInfo}
            onChange={handleBillingCheckboxChange}
            style={{
              appearance: "none",
              width: "24px",
              height: "24px",
              borderRadius: "4px",
              border: "2px solid #ff6b35",
              backgroundColor: showBillingInfo ? "#ff6b35" : "transparent",
              marginRight: "32px",
              cursor: "pointer",
              flexShrink: 0
            }}
          />
          {showBillingInfo && (
            <div style={{
              position: "absolute",
              left: "6px",
              top: "2px",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              pointerEvents: "none"
            }}>
              ✓
            </div>
          )}
          <label
            htmlFor="billingInfo"
            style={{
              fontSize: "18px",
              fontWeight: "500",
              color: "#374151",
              cursor: "pointer"
            }}
          >
            ¿Necesita factura con datos fiscales?
          </label>
        </div>
      </div>

      {showBillingInfo && (
        <div ref={billingInfoRef}>
          <FiscalInfo />
          <CompanyForm />
        </div>
      )}

      {/* 👇 Solo mostrar si el rol es operador */}
      {isOperator && (
        <div style={{ paddingTop: "20px", paddingBottom: "20px", paddingLeft: "25px", marginBottom: "12px" }} ref={operatorFormRef}>
          <div className="flex items-center relative">
            <input
              type="checkbox"
              id="operatorInfo"
              checked={showOperatorForm}
              onChange={handleOperatorCheckboxChange}
              style={{
                appearance: "none",
                width: "24px",
                height: "24px",
                borderRadius: "4px",
                border: "2px solid #ff6b35",
                backgroundColor: showOperatorForm ? "#ff6b35" : "transparent",
                marginRight: "32px",
                cursor: "pointer",
                flexShrink: 0
              }}
            />
            {showOperatorForm && (
              <div style={{
                position: "absolute",
                left: "6px",
                top: "2px",
                color: "white",
                fontSize: "14px",
                fontWeight: "bold",
                pointerEvents: "none"
              }}>
                ✓
              </div>
            )}
            <label
              htmlFor="operatorInfo"
              style={{
                fontSize: "18px",
                fontWeight: "500",
                color: "#374151",
                cursor: "pointer"
              }}
            >
              ¿Deseas participar en las ofertas como operario? ¡Completa tu perfil!
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';
import { ImSpinner8 } from "react-icons/im";
import ChangeAvatar from "./changeAvatar";
import usePersonalForm from "@/hooks/backend/usePersonalForm";
import PersonalForm from "./personalForm";
import CompanyForm from "./companyForm";

export default function ProfileForm() {
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
        <div className="tfcl-add-listing profile-inner">
                  
                    <ChangeAvatar />
                    <PersonalForm />
                    <CompanyForm/>
                  
        </div>
    );
}

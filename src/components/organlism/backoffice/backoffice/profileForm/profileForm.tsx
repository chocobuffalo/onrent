'use client';

import ChangeAvatar from "./changeAvatar/changeAvatar";

import PersonalForm from "./personalForm";
import CompanyForm from "./companyForm";
import FiscalInfo from "./fiscalInfo";

export default function ProfileForm() {
    return (
        <div className="">
            <div className="tfcl-add-listing">
                <ChangeAvatar />
                <PersonalForm />
            </div>
            <FiscalInfo/>
            <CompanyForm/>         
        </div>
    );
}

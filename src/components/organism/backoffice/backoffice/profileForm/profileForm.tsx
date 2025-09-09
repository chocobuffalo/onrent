'use client';

import ChangeAvatar from "./changeAvatar/changeAvatar";

import PersonalForm from "./personalForm";
import CompanyForm from "./companyForm";
import FiscalInfo from "./fiscalInfo";
import RoleForm from "./roleForm";

export default function ProfileForm() {

   
    return (
        <div className="">
            <div className="tfcl-add-listing">
                <ChangeAvatar  />
                <PersonalForm  />
            </div>
            <div className="tfcl-add-listing">
                <RoleForm />
            </div>
            <FiscalInfo/>
            <CompanyForm/>
        </div>
    );
}

'use client'

import useNewProjectForm from "@/hooks/frontend/buyProcess/useNewProjectForm";

export default function NewProjectForm() {
    
    const { userID } = useNewProjectForm()
      console.log(userID);
    return  (
       <>hola</>
    ) ;
}

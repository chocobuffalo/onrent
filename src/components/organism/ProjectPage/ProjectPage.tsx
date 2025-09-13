'use client';

import AddProject from "@/components/atoms/AddProyect/AddProyect";
import useProjectPage from "@/hooks/backend/useProjectPage";
import NewProjectForm from "../NewProjectForm/NewProjectForm";
import './projectForm.scss';
import DynamicTable from "@/components/atoms/DynamicTable/DynamicTable";
import Table from "@/components/molecule/tableProject/tableProject";



export default function ProjectPage() {
    //const
    const {projects,handleAddProject,createModalOpen,handleCloseCreateModal,columns,projectID,closeProjectForm,isLoading} = useProjectPage();
    console.log(projects)
    return(
        <div className="machine-table-container p-6">
              <div className="machine-table-header">
                <h1 className="machine-table-title">Mis Proyectos</h1>
                <div className="machine-table-add-button mt-10 flex justify-end">
                    <AddProject active={createModalOpen} func={handleAddProject} /> 
                </div>
              </div>
              <div className="machine-table-content pt-6" style={{paddingTop: '3rem'}}>
               <Table columns={columns} data={projects} isLoading={isLoading} />
              </div>
         {createModalOpen && (
        <div className="w-full modal-overlay py-10 px-4 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10000 ">
          <div className="overflow-hidden p-4 rounded-2xl modal-form max-h-[90vh] min-w-[90vw] bg-white shadow-lg w-full max-w-2xl relative" >
            <div className="modal-header flex items-center  justify-between mb-4">
              <h2>NUEVO PROYECTO</h2>
              <button 
                className="modal-close-btn"
                onClick={handleCloseCreateModal}
              >
                ×
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto modal-bodies">
                <NewProjectForm projectID={projectID} projectAct={closeProjectForm}  />
            </div>
          </div>
        </div>
      )}
        </div>
    )
}
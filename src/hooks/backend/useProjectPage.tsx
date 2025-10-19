'use client';

import { toggleModal } from "@/libs/redux/features/ui/modalSlicer";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import getProjects from "@/services/getProjects";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import useProjectList from "../frontend/ui/useProjectList";

export default function useProjectPage(){
    const {data:session} = useSession();
    const active = useUIAppSelector((state) => state.modal.isOpen);
    const dispatch = useUIAppDispatch();
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState<any | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [projectID, setProjectID] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
     
    const getProjectList = useCallback(()=>{
        setIsLoading(true);
        getProjects(session?.user?.access_token || "").then((data)=>{
           console.log(data)
           //añadir a cada objeto un campo actions con el botón de editar
           data.forEach((item:any)=>{
              item.actions = (
                  <div>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-500 hover:underline mr-2 p-2"
                    >
                      Editar
                    </button>
                  </div>
                )
           })
            setProjects(data || []);
            setIsLoading(false);
        })
    },[session])

    useEffect(()=>{
        getProjectList();
    },[session]);

    // Estado para detectar cuando se acaba de crear exitosamente
    const [wasCreatedSuccessfully, setWasCreatedSuccessfully] = useState(false);
    
    const handleCloseCreateModal = () => {
        setOpenModal(false);
    };
      
    // Función para editar
    const handleEdit = (item: any): void => {
        if (active) {
          dispatch(toggleModal());
        }
        setProjectID(item.id);
        console.log(item)
        setEditData(item);
        setOpenModal(true);
        setShowEditModal(true);
    }

    const closeProjectForm = () => {
        setOpenModal(false);
        setEditData(null);
        setProjectID('');
        //aqui procedemos a recargar la lista de proyectos
        getProjectList();
    }

    const handleAddProject = () => {
        setShowEditModal(false);
        setEditData(null);
        setOpenModal(!openModal);
    };

    const columns = [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Nombre', accessor: 'name' },
        { Header: 'Ubicación', accessor: 'location' },
        { Header: 'Estado', accessor: 'state' },
        { Header: 'Acciones', accessor: 'actions', disableSortBy: true, Cell: ({ row }: any) => (
            <div>
              <button
                onClick={() => handleEdit(row.original)}
                className="text-blue-500 hover:underline mr-2"
              >
                Editar
              </button>
            </div>
          )}
    ];

    return{
    createModalOpen: openModal,
    projects,
    handleAddProject,
    columns,
    projectID, 
    setProjectID,
    isLoading,
    closeProjectForm,
    handleCloseCreateModal
    }
}

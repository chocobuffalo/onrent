'use client';

import getProjects from "@/services/getProjects";
import { ActionButton, TableColumn } from "@/types/machinary";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

interface UseProjectListProps {
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onCreate?: (item: any) => void;
}


export default function useProjectList(props:UseProjectListProps){
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState<string | null>(null);
     const [searchValue, setSearchValue] = useState('');
    const {data: session} = useSession();
   
  const getProjectList = useCallback(()=>{
      setIsLoading(true);
      getProjects(session?.user?.access_token || "").then((data)=>{
         console.log(data)
          setProjects(data || []);
          setIsLoading(false);
      })
  },[session])

  // Example: If you want to use handleSearch, define it here at the top level
  // const [searchValue, setSearchValue] = useState('');
  
   const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);
    useEffect(()=>{
        getProjectList();
    },[session]);


     const columns: TableColumn[] = [
        {
          key: 'name',
          label: 'Nombre',
          render: (value: any) => (
            <div className="text-sm font-medium text-gray-700">
              {value || 'N/A'}
            </div>
          ),
        },
        {
          key: 'location',
          label: 'Ubicación',
          render: (value: any) => (
            <div className="text-sm font-medium capitalize text-gray-700">
              {value || 'N/A'}
            </div>
          ),
        },
      ];

      
        const actionButtons: ActionButton[] = [
          {
            label: "Editar",
            className: "px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded hover:bg-yellow-600 transition-colors",
            onClick: (item?: any) => {
              if (props?.onEdit && item) props.onEdit(item);
            },
          },
          {
            label: "Eliminar",
            className: "px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition-colors",
            onClick: (item?: any) => {
              if (item && props?.onDelete) props.onDelete(item);
            },
          },
        ];
    return{
        isLoading,
        error,
        actionButtons,
        columns,
         handleSearch,
         searchValue,
        projects
    }
};
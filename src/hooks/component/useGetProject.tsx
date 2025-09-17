'use client';

import getProjectDetail from "@/services/getProjectDetail";
import getProjects from "@/services/getProjects";
import { ProjectResponseItem } from "@/types/projects";
import { useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";

export const useGetProject = ({projectName}:{projectName:string})=>{
    const [project, setProject] = useState<ProjectResponseItem | null>(null);
    const [projects, setProjects] = useState<{label:string, value:string}[] | null>(null);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [openProjects, setOpenProjects] = useState(false); 
    const [filteredProjects, setFilteredProjects] = useState<{label:string, value:string}[] | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {data:session} = useSession();
    const token = session?.user?.access_token;

    const getAllProjects = async () => {
       const projectsFetched = await getProjects(token as string) as ProjectResponseItem[];

       const proj = projectsFetched.map(project=>({label:project.name, value:project.id.toString()}))
       setProjects(proj);
    }

    const getProjectById =  (id: string) => {
        if(!id) return;
        setLoading(true);
    
        getProjectDetail(id,token as string).then(res=>{
            setProject(res);
        }).catch(err=>{
            setError(err);
        }).finally(()=>{
            setLoading(false);
        })
      
    }

    useEffect(() => {
        getAllProjects();
    }, []);


    const filteredProjectsLis = ()=>{
        if(projects && projectName.length > 0){
            setFilteredProjects(projects.filter(project =>
                project.label.toLowerCase().includes(projectName.toLowerCase())
            ));
        }

    }

    useEffect(() => {
        filteredProjectsLis();
        if(projects && projectName.length === 0){
            setFilteredProjects(projects);
        }
    }, [projectName]);

    useEffect(() => {
        if(selectedProject && projects){
            const proj = projects.find(project=>project.label === selectedProject);
            if(proj){
                getProjectById(proj.value);
            }
        }
    },[selectedProject])

    return {
        project,
        projects:filteredProjects || projects,
        loadingProject:isLoading,
        setLoadingProject:setLoading,
        error,
        setSelectedProject,
        getAllProjects,
        getProjectById,
        openProjects,
        setOpenProjects
    }

}
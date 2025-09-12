import { useState, useEffect } from 'react';
import { UseProjectInfoReturn, ProjectInfo } from '@/types/checkout';

export function useProjectInfo(): UseProjectInfoReturn {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Datos mock temporales - México
    const mockData: ProjectInfo = {
      responsibleName: "Carlos Hernández Morales",
      projectName: "Torre Corporativa Polanco",
      workLocation: "Ciudad de México, CDMX"
    };
    setProjectInfo(mockData);
  }, []);

  return { projectInfo, isLoading, error };
}
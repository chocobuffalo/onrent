import { useProjectInfo } from '@/hooks/frontend/buyProcess/useProjectInfo';

const ProjectInfoTable = ({project_name,responsible_name,project_location}:{project_name?:string,responsible_name?:string,project_location?:string}) => {
  //const { projectInfo, isLoading, error } = useProjectInfo();

  // if (isLoading) {
  //   return (
  //     <div className="border border-gray-300 rounded-lg p-5 bg-white">
  //       <div className="animate-pulse space-y-3">
  //         <div className="h-4 bg-gray-200 rounded w-1/3"></div>
  //         <div className="space-y-2">
  //           <div className="h-3 bg-gray-200 rounded"></div>
  //           <div className="h-3 bg-gray-200 rounded"></div>
  //           <div className="h-3 bg-gray-200 rounded"></div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="border border-gray-300 rounded-lg p-5 bg-white">
  //       <p className="text-red-500 text-sm">{error}</p>
  //     </div>
  //   );
  // }

  

  return (
    <div className="border border-gray-300 rounded-lg p-5 bg-white space-y-3">
      <div className="space-y-3">
        <div className="flex flex-col py-2 border-b border-gray-100">
          <p className="text-lg font-light lato-font mb-1">Nombre del responsable:</p>
          <p className="text-gray-600 text-[16px] lato-font">
            {responsible_name || "N/A"}
          </p>
        </div>
        
        <div className="flex flex-col py-2 border-b border-gray-100">
          <p className="text-lg font-light lato-font mb-1">Nombre del proyecto:</p>
          <p className="text-gray-600 text-[16px] lato-font">
            {project_name || "N/A"}
          </p>
        </div>
        
        <div className="flex flex-col py-2">
          <p className="text-lg font-light lato-font mb-1">Ubicación de la obra:</p>
          <p className="text-gray-600 text-[16px] lato-font">
            {project_location || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoTable;
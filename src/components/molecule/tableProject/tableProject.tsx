import { ImSpinner8 } from "react-icons/im";

const Table = ({ columns, data, isLoading }: { columns: any[], data: any[], isLoading: boolean }) => {
  return (
    <div className="overflow-x-auto">
       <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  className="py-2 px-4 border-b border-gray-200 text-left text-gray-600"
                >
                  {column.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
      {isLoading && (
          <tr>
            <td colSpan={columns.length}>
              <div className="flex justify-center items-center p-2">
                <ImSpinner8  size={20}
                color="#FF7101"
              className="animate-spin mx-auto " />
              </div>
            </td>
          </tr>
        )}
      {!isLoading && data.length === 0 && (
        <tr>
          <td colSpan={columns.length}>
            <div className="flex justify-center items-center p-2">
              <h2 className="text-center">No hay proyectos creados</h2>
            </div>
          </td>
        </tr>
      )}
      {
        !isLoading && data.length > 0 && (
         <>
         
         
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="even:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.accessor}
                    className="py-2 px-4 border-b border-gray-200 text-gray-800"
                  >
                    {row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          
         </>
          
        
      )
      }
      </tbody>
      </table>
    </div>
  );
};

export default Table;
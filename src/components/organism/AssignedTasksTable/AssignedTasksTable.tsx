'use client';

import TransferDetailModal from '@/components/molecule/TransferDetailModal/TransferDetailModal';
import DynamicTable from '@/components/atoms/DynamicTable/DynamicTable';
import useAssignedTasksUI from '@/hooks/frontend/ui/useAssignedTasksUI';

const AssignedTasksTable = () => {
  const {
    transfers,
    loading,
    error,
    selectedTransferId,
    columns,
    actionButtons,
    handleCloseDetail,
    refreshTransfers,
    searchValue,
    onSearch,
  } = useAssignedTasksUI();

  return (
    <>
      {/* ✅ VERIFICA QUE ESTA CLASE ESTÉ AQUÍ */}
      <div className="dynamic-table-container tasks-table">
        <DynamicTable
          title="Tareas asignadas de hoy"
          items={transfers}
          isLoading={loading}
          error={error}
          searchValue={searchValue}
          columns={columns}
          actionButtons={actionButtons as any}
          onSearch={onSearch}
        />
      </div>

      {selectedTransferId && (
        <TransferDetailModal
          transferId={selectedTransferId}
          onClose={handleCloseDetail}
          onSuccess={refreshTransfers}
        />
      )}
    </>
  );
};

export default AssignedTasksTable;

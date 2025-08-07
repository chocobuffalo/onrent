'use client';

import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import './modalForm.scss';
import { closeModal } from "@/libs/redux/features/ui/modalSlicer";
import MachineForm from "../machineForm/machineForm";

export default function ModalForm() {
    const isModalOpen = useUIAppSelector((state) => state.modal.isOpen);
    const dispatch = useUIAppDispatch();

    const handleClose = () => {
      dispatch(closeModal());    
    }
    return isModalOpen && (
    <div className="modal fade show" style={{display:'block'}} id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5" id="staticBackdropLabel">Nueva maquinaria</h2>
            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={handleClose} aria-label="Close"></button>
          </div>
              <MachineForm />
        </div>
      </div>
    </div>
    )
}
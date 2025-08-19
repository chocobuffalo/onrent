"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/libs/redux/uistore";

export default function Modal({ children }: { children: React.ReactNode }) {
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

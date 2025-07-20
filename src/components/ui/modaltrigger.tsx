import * as React from "react";
import { useState } from "react";
import { Modal } from "./modal"; // Asegúrate que la ruta sea correcta

export interface ModalTriggerProps {
  triggerText: string;
  children: React.ReactNode;
  triggerClassName?: string;
}

export const ModalTrigger: React.FC<ModalTriggerProps> = ({
  triggerText,
  children,
  triggerClassName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        type="button"
        className={triggerClassName || "rounded-full bg-transparent border"}
      >
        {triggerText}
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {children} {/* Aquí dentro va tu JoinForm */}
      </Modal>
    </>
  );
};

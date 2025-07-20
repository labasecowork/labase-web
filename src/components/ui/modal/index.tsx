import * as React from "react";
import { useState } from "react";
import { cn } from "@/utilities";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, children, className }, ref) => {
    if (!isOpen) return null;
    React.useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    return (
      <div
        ref={ref}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <div
          className={cn(
            "relative w-full max-w-md p-8 bg-stone-900 border border-stone-700 rounded-lg shadow-lg text-stone-100",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-100"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";

export interface ModalTriggerProps {
  triggerText: string;
  children: React.ReactNode;
  triggerClassName?: string;
}

const ModalTrigger: React.FC<ModalTriggerProps> = ({
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
        {children}
      </Modal>
    </>
  );
};

export { Modal, ModalTrigger };

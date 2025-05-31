// frontend/src/presentation/ui/Modal.tsx
import React, { type ReactNode } from 'react';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {children}
      </div>
    </div>
  );
};

export default Modal;

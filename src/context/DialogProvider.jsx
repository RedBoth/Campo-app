import { createContext, useContext, useState, useCallback } from "react";
import Modal from "../components/ui/Modal";

const DialogContext = createContext();

export function useDialog() {
  return useContext(DialogContext);
}

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "confirm",
    resolve: null,
  });

  const openDialog = useCallback((options) => {
    return new Promise((resolve) => {
      setDialog({ ...options, isOpen: true, resolve });
    });
  }, []);

  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = (value) => {
    if (dialog.resolve) dialog.resolve(value);
    closeDialog();
  };

  const handleCancel = () => {
    if (dialog.resolve) dialog.resolve(false);
    closeDialog();
  };

  const showConfirm = async (title, message) => {
    return await openDialog({ title, message, type: "danger", confirmText: "Eliminar" });
  };

  const showPrompt = async (title, message) => {
    return await openDialog({ title, message, type: "prompt", confirmText: "Guardar" });
  };

  return (
    <DialogContext.Provider value={{ showConfirm, showPrompt }}>
      {children}
      
      <Modal
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        confirmText={dialog.confirmText || "Aceptar"}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </DialogContext.Provider>
  );
}
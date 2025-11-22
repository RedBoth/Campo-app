import { createContext, useContext, useState, useEffect } from "react";

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null); 

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const closeToast = () => setToast(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        closeToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce-in">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded shadow-lg text-white ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <span className="material-icons-outlined">
              {toast.type === "success" ? "check_circle" : "error"}
            </span>
            <span className="font-medium">{toast.message}</span>
            <button onClick={closeToast} className="ml-2 opacity-70 hover:opacity-100">
                ✕
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}
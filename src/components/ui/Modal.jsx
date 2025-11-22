import { useEffect, useState, useRef } from "react";

export default function Modal({ isOpen, title, message, type = "confirm", onConfirm, onCancel, confirmText = "Aceptar", cancelText = "Cancelar" }) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && type === "prompt") {
      setInputValue("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, type]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") onCancel();
  };

  const handleConfirm = () => {
    if (type === "prompt" && !inputValue.trim()) return;
    onConfirm(type === "prompt" ? inputValue : true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        
        <div className="bg-neutral-gray50 px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-neutral-gray900">{title}</h3>
        </div>

        <div className="p-6">
          <p className="text-neutral-gray700 mb-4">{message}</p>
          
          {type === "prompt" && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Escribí aquí..."
            />
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-gray-600 font-medium hover:bg-gray-200 transition"
          >
            {cancelText}
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={type === "prompt" && !inputValue.trim()}
            className={`px-4 py-2 rounded-md text-white font-medium shadow-sm transition
              ${type === "prompt" && !inputValue.trim() ? "bg-gray-300 cursor-not-allowed" : "bg-primary hover:bg-primary/90"}
              ${type === "danger" ? "bg-red-600 hover:bg-red-700" : ""}
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
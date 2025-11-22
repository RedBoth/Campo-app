import { useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function HistoryInput({ onGuardar, isSaving }){
    const [texto, setTexto] = useState("");

    const handleSubmit = () => {
        if (!texto.trim()) return;
        onGuardar(texto.trim());
        setTexto("");
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe la información del lote aquí..."
                disabled={isSaving}
                className="border p-2 w-full rounded min-h-[60px] resize-none text-neutral-gray700 bg-neutral-gray100 border-neutral-dark placeholder:text-neutral-gray500 placeholder:italic focus:outline-none focus:border-black"
            />
            
            <button
                type="submit"
                disabled={isSaving || !texto.trim()}
                className={`text-neutral-white px-4 py-2 rounded-md flex items-center justify-center font-semibold w-full gap-2 transition-all
                    ${isSaving || !texto.trim() 
                        ? "bg-neutral-gray300 cursor-not-allowed" 
                        : "bg-primary hover:bg-primary/90 shadow-sm active:scale-95"
                    }`}
            >
                {isSaving ? (
                    <>
                        <LoadingSpinner size="sm" color="border-white" />
                        <span>...</span>
                    </>
                ) : (
                    <>
                        <span className="material-icons-outlined text-sm">send</span>
                        <span>Guardar</span>
                    </>
                )}
            </button>
        </form>
    );
}
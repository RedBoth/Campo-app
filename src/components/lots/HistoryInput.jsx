import { useState } from "react";

export default function HistoryInput({ onGuardar }){
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
            className="border p-2 w-full rounded min-h-[60px] resize-none text-neutral-light bg-secondary border-neutral-dark placeholder:text-neutral-light focus:outline-none focus:border-black"
        />
        
        <button
            type="submit"
            className="bg-primary text-neutral-light px-4 py-2 rounded hover:bg-primary/60 font-semibold w-full mt-2"
        >
            Guardar
        </button>
    </form>
  );
}
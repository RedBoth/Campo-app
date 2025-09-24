import { useState, useEffect, useRef } from "react";

export default function HistoryPanel({ loteSeleccionado, onAgregarRegistro, hojaActiva }) {
    const [texto, setTexto] = useState("");
    const historialRef = useRef(null);

    useEffect(() => {
        setTexto("");
    }, [loteSeleccionado]);

    useEffect(() => {
        if (historialRef.current) {
            historialRef.current.scrollTop = historialRef.current.scrollHeight;
        }
    }, [loteSeleccionado?.info]);

    const handleGuardar = () => {
        if (!texto.trim()) return;

        const nuevoRegistro = {
            texto: texto.trim(),
            fecha: new Date().toLocaleString(),
        };

        onAgregarRegistro(nuevoRegistro);
        setTexto("");
    };

    if (!loteSeleccionado) {
        return (
            <div className="p-4 bg-secondary/60 rounded shadow">
                <p className="text-neutral-light text-lg">Selecciona un lote para ver su historial.</p>
            </div>
        );
    }
    
    return (
        <div className="p-4 bg-secondary/60 rounded shadow flex flex-col gap-4">
            <h2 className="text-lg font-bold text-neutral-light">{hojaActiva.nombre} - Historial - {loteSeleccionado.nombre}</h2>

            {/* Lista de registros */}
            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto border border-neutral-dark p-2 rounded bg-secondary" ref={historialRef}>
                {Array.isArray(loteSeleccionado.info) && loteSeleccionado.info.length > 0 ? (
                    [...loteSeleccionado.info].map((reg, i) => (
                        <div key={i} className="p-2 bg-secondary rounded shadow-sm">
                            <p className="text-sm text-neutral-light/60">{reg.fecha}</p>
                            <p className="text-neutral-light">{reg.texto}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-neutral-light italic">No hay registros todavía.</p>
                )}
            </div>

            {/* Campo para agregar nuevo registro */}
            <textarea 
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Escribe la información del lote aquí..."
                className="border p-2 w-full rounded min-h-[60px] resize-none text-neutral-light bg-secondary border-neutral-dark placeholder:text-neutral-light focus:outline-none focus:border-black" />
            
            <button
                onClick={handleGuardar}
                className="bg-primary text-neutral-light px-4 py-2 rounded hover:bg-primary/60 font-semibold"
            >
                Guardar
            </button>
        </div>
    );
}
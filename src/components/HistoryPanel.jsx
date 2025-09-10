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
            <div className="p-4 bg-white border rounded shadow">
                <p className="text-gray-500">Selecciona un lote para ver su historial.</p>
            </div>
        );
    }
    
    return (
        <div className="p-4 bg-white border rounded shadow flex flex-col gap-4">
            <h2 className="text-lg font-bold">{hojaActiva.nombre} - Historial - {loteSeleccionado.nombre}</h2>

            {/* Lista de registros */}
            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto border p-2 rounded bg-gray-50" ref={historialRef}>
                {Array.isArray(loteSeleccionado.info) && loteSeleccionado.info.length > 0 ? (
                    [...loteSeleccionado.info].map((reg, i) => (
                        <div key={i} className="p-2 bg-white border rounded shadow-sm">
                            <p className="text-sm text-gray-500">{reg.fecha}</p>
                            <p>{reg.texto}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 italic">No hay registros todavía.</p>
                )}
            </div>

            {/* Campo para agregar nuevo registro */}
            <textarea 
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Escribe la información del lote aquí..."
                className="border p-2 w-full rounded min-h-[60px] resize-none" />
            
            <button
                onClick={handleGuardar}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Guardar
            </button>
        </div>
    );
}
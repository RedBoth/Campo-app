import { confirmAction } from "../../services/confirmationService";
import { agregarLote, eliminarLote } from "../../api/camposApi";

export default function LotActions({ setCampos, campoActivoId, loteSeleccionado, setLoteSeleccionado }) {
    
    const handleAgregarLote = async () => {
        const nombre = prompt("Nombre del nuevo lote:");
        if (!nombre) return;

        await agregarLote(campoActivoId, nombre);

        const nuevoLote = { id: Date.now(), nombre: nombre.trim(), info: [] };
        setCampos(camposAnteriores => 
            camposAnteriores.map(c => 
                c.id === campoActivoId ? { ...c, lotes: [...c.lotes, nuevoLote] } : c
            )
        );
    };

    const handleEliminarLote = async () => {
        if (!loteSeleccionado) return;
        
        const mensaje = `¿Seguro que querés eliminar el lote "${loteSeleccionado.nombre}"? Esta acción no se puede deshacer.`;
        if (confirmAction(mensaje)) {
            await eliminarLote(campoActivoId, loteSeleccionado);
            
            setCampos(camposAnteriores => 
                camposAnteriores.map(c => 
                    c.id === campoActivoId ? { ...c, lotes: c.lotes.filter(l => l.id !== loteSeleccionado.id) } : c
                )
            );
            setLoteSeleccionado(null);
        }
    };

    return (
        <div className="mt-4 flex gap-2">
            <button onClick={handleAgregarLote} className="bg-primary text-neutral-light px-4 py-2 rounded hover:bg-primary/80">
                ➕ Agregar Lote
            </button>
            <button onClick={handleEliminarLote} disabled={!loteSeleccionado} className={`px-4 py-2 rounded ${loteSeleccionado ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-300 text-neutral-light"}`}>
                🗑️ Borrar Lote
            </button>
        </div>
    )
}
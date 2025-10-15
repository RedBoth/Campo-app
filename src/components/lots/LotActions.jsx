import { confirmAction } from "../../services/ConfirmationService";
import { agregarLote, eliminarLote } from "../../api/camposApi";

export default function LotActions({ campos, setCampos, campoActivo, loteSeleccionado, setLoteSeleccionado }) {
    
    const handleAgregarLote = () => {
        const nombre = prompt("Nombre del nuevo lote:");
        if (!nombre) return;

        const nuevosCampos = agregarLote(campos, campoActivo.id, nombre);
        setCampos(nuevosCampos);
    };

    const handleEliminarLote = () => {
        if (!loteSeleccionado) return;
        
        const mensaje = `¿Seguro que querés eliminar el lote "${loteSeleccionado.nombre}"? Esta acción no se puede deshacer.`;
        if (confirmAction(mensaje)) {
            const nuevosCampos = eliminarLote(campos, campoActivo.id, loteSeleccionado.id);
            setCampos(nuevosCampos);
            setLoteSeleccionado(null);
        }
    };

    return (
        <div className="mt-4 flex gap-2">
            <button onClick={handleAgregarLote} className="bg-primary text-neutral-light px-4 py-2 rounded hover:bg-primary/80">
                ➕ Agregar Lote
            </button>
            <button onClick={handleEliminarLote} disabled={!loteSeleccionado} className={`px-4 py-2 rounded ${loteSeleccionado ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
                🗑️ Borrar Lote
            </button>
        </div>
    )
}
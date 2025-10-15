import { confirmAction } from "../../services/ConfirmationService";
import { eliminarCampo } from "../../api/camposApi";

export default function PageActions({ campos, setCampos, campoActivo, setCampoActivoId, setLoteSeleccionado }) {
    
    const handleEliminarCampo = () => {
        if (campos.length <= 1) {
            alert("Debe haber al menos un campo.");
            return;
        }

        const mensaje = `¿Seguro que querés eliminar el campo "${campoActivo.nombre}"? Se borrarán todos sus lotes y registros.`;
        if (confirmAction(mensaje)) {
            const nuevosCampos = eliminarCampo(campos, campoActivo.id);
            setCampos(nuevosCampos);
            // localStorage.setItem("campos", JSON.stringify(nuevosCampos)); // Considerar mover esto a un servicio de storage
            setCampoActivoId(nuevosCampos[0].id);
            setLoteSeleccionado(null);
        }
    };
    
    return (
        <div className="flex justify-end mt-6">
            <button onClick={handleEliminarCampo} className="bg-danger text-white px-4 py-2 rounded hover:bg-red-700">
                🗑️ Eliminar Campo
            </button>
        </div>
    )
}
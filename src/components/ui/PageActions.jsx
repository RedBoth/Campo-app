import { eliminarCampo } from "../../api/camposApi";
import { useToast } from "../../context/ToastProvider";
import { useDialog } from "../../context/DialogProvider";

export default function PageActions({ campos, setCampos, campoActivoId, setCampoActivoId, setLoteSeleccionado }) {
    
    const { showToast } = useToast();
    const { showConfirm } = useDialog();

    const handleEliminarCampo = async () => {
        if (campos.length <= 1) {
            showToast("Debe haber al menos un campo.", "error");
            return;
        }

        const campoActivo = campos.find(c => c.id === campoActivoId);
        if (!campoActivo) return;

        const confirmado = await showConfirm(
            "Eliminar Campo",
            `¿Seguro que querés eliminar el campo "${campoActivo.nombre}"? Se borrarán todos sus lotes y registros.` // Mensaje
        );
        
        if (confirmado) {
            try{
                await eliminarCampo(campoActivo.id);
                
                setCampos(camposAnteriores => {
                    const nuevosCampos = camposAnteriores.filter(c => c.id !== campoActivo.id);
                    setCampoActivoId(nuevosCampos[0]?.id || null);
                    return nuevosCampos;
                });
    
                setLoteSeleccionado(null);
                showToast("Campo eliminado correctamente", "success");
            } catch(error){
                console.error("Error al eliminar el campo:", error);
                showToast("Error al eliminar el campo", "error");
            }
        }
    };
    
    return (
        <div className="flex justify-end mt-6">
            <button onClick={handleEliminarCampo} className="bg-danger text-white font-medium px-4 py-2 rounded hover:bg-red-700">
                Eliminar campo
            </button>
        </div>
    )
}
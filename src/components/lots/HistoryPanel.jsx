import useAutoScroll from "../hooks/useAutoScroll";
import HistoryInput from "./HistoryInput";

export default function HistoryPanel({ loteSeleccionado, onAgregarRegistro, campoActivo }) {
    const historialRef = useAutoScroll(loteSeleccionado?.info);

    const handleAgregarRegistro = (textoRecibido) => {
        const nuevoRegistro = {
            texto: textoRecibido,
            fecha: new Date().toLocaleString('es-AR'),
        };

        onAgregarRegistro(nuevoRegistro);
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
            <h2 className="text-lg font-bold text-neutral-light">{campoActivo.nombre} - Historial - {loteSeleccionado.nombre}</h2>

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
            <HistoryInput onGuardar={handleAgregarRegistro} />
        </div>
    );
}
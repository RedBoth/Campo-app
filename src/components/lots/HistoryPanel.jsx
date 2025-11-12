import useAutoScroll from "../../hooks/useAutoScroll";
import HistoryInput from "./HistoryInput";

export default function HistoryPanel({ loteSeleccionado, onAgregarRegistro}) {
    const historialRef = useAutoScroll(loteSeleccionado?.info);

    if (!loteSeleccionado) {
        return (
            <div className="p-4 bg-neutral-white rounded-xl shadow border border-neutral-gray300">
                <p className="text-neutral-light text-lg">Selecciona un lote para ver su historial.</p>
            </div>
        );
    }
    
    return (
        <div className="p-4 bg-neutral-white rounded-xl shadow-sm flex flex-col gap-2 border border-neutral-gray300">
            <h2 className="text-lg font-semibold text-neutral-gray900 mb-3">Información del {loteSeleccionado.nombre}</h2>

            <h2 className="font-semibold text-neutral-gray700">Historial</h2>
            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto border border-neutral-dark p-2 rounded bg-neutral-gray100" ref={historialRef}>
                {Array.isArray(loteSeleccionado.info) && loteSeleccionado.info.length > 0 ? (
                    [...loteSeleccionado.info].map((reg, i) => (
                        <div key={i} className="p-2 bg-neutral-gray50 rounded shadow-sm border border-neutral-gray300">
                            <p className="text-sm text-neutral-gray700">{reg.fecha}</p>
                            <p className="text-neutral-gray900">{reg.texto}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-neutral-gray500 italic">No hay registros todavía.</p>
                )}
            </div>
            <h2 className="font-semibold text-neutral-gray700">Añadir nueva nota</h2>
            <HistoryInput onGuardar={onAgregarRegistro} />
        </div>
    );
}
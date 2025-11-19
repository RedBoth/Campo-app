import { confirmAction } from "../../services/confirmationService";
import { agregarLote, eliminarLote } from "../../api/camposApi";

export default function LotManager({
  lotes,
  campoActivoId,
  loteSeleccionado,
  setCampos,
  setLoteSeleccionado,
  onLoteClick,
  campos,
}) {
  const handleAgregarLote = async () => {
    const nombre = prompt("Nombre del nuevo lote:");
    if (!nombre) return;


    await agregarLote(campoActivoId, nombre);

    const nuevoLote = { id: Date.now(), nombre: nombre.trim(), info: [] };
    setCampos((camposPrev) =>
      camposPrev.map((c) =>
        c.id === campoActivoId
          ? { ...c, lotes: [...c.lotes, nuevoLote] }
          : c
      )
    );
  };

  const handleEliminarLote = async () => {
    if (!loteSeleccionado) return;

    const mensaje = `¿Seguro que querés eliminar el lote "${loteSeleccionado.nombre}"? Esta acción no se puede deshacer.`;
    if (confirmAction(mensaje)) {
      await eliminarLote(campoActivoId, loteSeleccionado);

      setCampos((camposPrev) =>
        camposPrev.map((c) =>
          c.id === campoActivoId
            ? {
                ...c,
                lotes: c.lotes.filter((l) => l.id !== loteSeleccionado.id),
              }
            : c
        )
      );
      setLoteSeleccionado(null);
    }
  };

  const campoActivo = campos.find(c => c.id === campoActivoId);

  return (
    <div className="border border-neutral-gray300 rounded-xl p-4 bg-neutral-white shadow-sm flex flex-col h-full">
      <h2 className="text-lg font-semibold text-neutral-gray900 mb-3">
        Lotes en "{campoActivo?.nombre}"
      </h2>

      <div className="flex flex-col gap-2 mb-4">
        {lotes.map((lote) => {
          const isSelected = loteSeleccionado?.id === lote.id;
          return (
            <button
              key={lote.id}
              onClick={() => onLoteClick(lote)}
              className={`w-full text-left px-4 py-2 rounded-md font-medium border transition
                ${
                  isSelected
                    ? "bg-green-100 border-primary text-primary"
                    : "bg-neutral-gray50 border-neutral-gray300 text-neutral-gray700 hover:bg-aqua-light"
                }`}
            >
              {lote.nombre}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={handleAgregarLote}
          className="flex items-center justify-center gap-1 px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition"
        >
          <span className="material-icons-outlined text-base">add</span> Agregar lote
        </button>

        <button
          onClick={handleEliminarLote}
          disabled={!loteSeleccionado}
          className={`flex items-center justify-center gap-1 px-4 py-2 rounded-md font-medium transition ${
            loteSeleccionado
              ? "bg-softdanger text-danger hover:bg-red-300"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <span className="material-icons-outlined text-base">delete</span> Borrar
        </button>
      </div>
    </div>
  );
}

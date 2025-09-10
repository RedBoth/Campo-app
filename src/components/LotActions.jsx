export default function LotActions({ hojas, setHojas, hojaActiva, loteSeleccionado, setLoteSeleccionado}) {
return (
        <div className="mt-4 flex gap-2">
            <button onClick={() => {
              const nombre = prompt("Nombre del nuevo lote:");
              if (!nombre) return;

              const nuevoLote = {
                id: Date.now(),
                nombre: nombre.trim()
              };

              const nuevasHojas = hojas.map((hoja) => 
                hoja.id === hojaActiva.id ? { ...hoja, lotes: [...hoja.lotes, nuevoLote] } : hoja
              );
              setHojas(nuevasHojas);
            }} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              ➕ Agregar Lote
            </button>

            <button onClick={() => {
              if (!loteSeleccionado) return;

              const confirmacion = window.confirm(`¿Seguro que querés eliminar ${loteSeleccionado.nombre}? Esta acción no se puede deshacer.`);
              if (confirmacion){
                const nuevasHojas = hojas.map((hoja) => 
                  hoja.id === hojaActiva.id
                  ? {
                    ...hoja,
                    lotes: hoja.lotes.filter((l) => l.id !== loteSeleccionado.id),
                  } : hoja
                );
                setHojas(nuevasHojas);
                setLoteSeleccionado(null);
              }
              }}
              disabled={!loteSeleccionado}
              className={`px-4 py-2 rounded ${
                loteSeleccionado
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              🗑️ Borrar Lote
            </button>
        </div>
    )
}
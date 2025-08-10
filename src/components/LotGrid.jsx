export default function LotGrid({ lotes, onLoteClick, loteSeleccionado }) {
    return (
        <div className="grid grid-cols-2 gap-4 p-4 bg-green-100 rounded-lg">
            {lotes.map((lote) => {
                const isSelected = loteSeleccionado?.id === lote.id;
                return (
                    <button key={lote.id} onClick={() => onLoteClick(lote)} className={`p-4 text-center rounded shadow  transition ${isSelected ? "bg-green-600 text-white" : "bg-green-300 hover:bg-green-400 text-black"}`}>
                        <button onClick={() => onLoteClick(lote)} className="w-full text-center font-semibold">
                            {lote.nombre}
                        </button>
                    </button>
                );
            })}
        </div>
    );
}
export default function Tabs({ hojas, hojaActivaId, setHojaActivaId, onNuevaHoja }) {
    return (
        <div className="flex gap-2 mb-6">
            {hojas.map((hoja) => (
                <button key={hoja.id} onClick={() => {
                setHojaActivaId(hoja.id);
                }} className={`px-4 py-2 rounded-t ${hoja.id === hojaActivaId ? "bg-white border border-b-0 font-semibold" : "bg-gray-300 hover:bg-gray-400"}`}>
                {hoja.nombre}
                </button>
            ))}
            <button onClick={onNuevaHoja} className="px-4 py-2 rounded-t bg-blue-500 text-white hover:bg-blue-600">
                +
            </button>
        </div>
    )
}
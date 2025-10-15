export default function Tabs({ campos, campoActivoId, setcampoActivoId, onNuevoCampo }) {
    return (
        <div className="flex gap-2 mb-6">
            {campos.map((campo) => (
                <button key={campo.id} onClick={() => {
                setcampoActivoId(campo.id);
                }} className={`px-4 py-2 rounded-t ${campo.id === campoActivoId ? "bg-white border border-b-0 font-semibold" : "bg-gray-300 hover:bg-gray-400"}`}>
                {campo.nombre}
                </button>
            ))}
            <button onClick={onNuevoCampo} className="px-4 py-2 rounded-t bg-blue-500 text-white hover:bg-blue-600">
                +
            </button>
        </div>
    )
}
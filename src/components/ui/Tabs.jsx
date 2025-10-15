export default function Tabs({ campos, campoActivoId, setCampoActivoId, onNuevoCampo, setLoteSeleccionado }) {
    
    const handleTabClick = (id) => {
        setCampoActivoId(id);
        setLoteSeleccionado(null);
    };

    return (
        <div className="flex items-center gap-2">
            {campos.map((campo) => {
                const isSelected = campo.id === campoActivoId;
                return (
                    <button
                        key={campo.id}
                        onClick={() => handleTabClick(campo.id)} 
                        className={`px-4 py-2 rounded transition font-semibold ${
                            isSelected
                                ? "bg-primary text-white"
                                : "bg-secondary/60 text-neutral-light hover:bg-secondary"
                        }`}
                    >
                        {campo.nombre}
                    </button>
                );
            })}
            <button onClick={onNuevoCampo} className="px-4 py-2 rounded-t bg-blue-500 text-white hover:bg-blue-600">
                +
            </button>
        </div>
    );
}
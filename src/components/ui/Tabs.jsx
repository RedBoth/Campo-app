export default function Tabs({ campos, campoActivoId, onNuevoCampo, onTabClick }) {
    
    return (
        <div className="flex items-center gap-2">
            {campos.map((campo) => {
                const isSelected = campo.id === campoActivoId;
                return (
                    <button
                        key={campo.id}
                        onClick={() => onTabClick(campo.id)} 
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
            <button onClick={onNuevoCampo} className="px-4 py-2 rounded bg-primary text-white font-bold hover:bg-primary/80">
                +
            </button>
        </div>
    );
}
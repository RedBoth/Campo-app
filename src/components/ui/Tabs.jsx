export default function Tabs({ campos, campoActivoId, onNuevoCampo, onTabClick }) {
  return (
    <div className="border border-neutral-gray300 rounded-xl p-4 bg-neutral-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-neutral-gray900 mb-3">Seleccionar campo</h2>
        <button
          onClick={onNuevoCampo}
          className="px-4 py-2 rounded-md border border-gray-300 bg-neutral-gray50 text-neutral-gray700 font-medium hover:bg-aqua-light transition flex items-center gap-1"
        >
          <span className="text-lg leading-none">+</span>
          Agregar campo
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {campos.map((campo) => {
          const isSelected = campo.id === campoActivoId;
          return (
            <button
              key={campo.id}
              onClick={() => onTabClick(campo.id)}
              className={`px-4 py-2 rounded-md font-medium transition
                border
                ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-neutral-gray50 text-gray-700 border-gray-300 hover:bg-aqua-light"
                }`}
            >
              {campo.nombre}
            </button>
          );
        })}
      </div>
    </div>
  );
}
export default function Header({ activePage, onLogout }) {
  
  // Obtenemos la fecha actual para mostrarla en el Inicio
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString('es-AR', dateOptions);
  // Capitalizamos la primera letra (ej: "lunes..." -> "Lunes...")
  const fechaFormateada = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <header className="flex justify-between items-center bg-neutral-white shadow-sm p-6 border-b-2 border-neutral-gray300 sticky top-0 z-20">
      
      {/* Lado Izquierdo: Títulos Dinámicos */}
      <div>
        {activePage === "inicio" && (
          <div className="animate-fade-in flex flex-col gap-1">
            {/* Mismo estilo visual que en 'campos' */}
            <h2 className="text-3xl font-bold text-neutral-gray900 tracking-tight">
              Panel de Inicio
            </h2>
            <div className="flex items-center gap-2 text-neutral-gray500">
              <span className="material-icons-outlined text-sm">calendar_today</span>
              <p className="text-sm font-medium">{fechaFormateada}</p>
            </div>
          </div>
        )}

        {activePage === "campos" && (
          <div className="animate-fade-in flex flex-col gap-1">
            <h2 className="text-3xl font-bold text-neutral-gray900 tracking-tight">
              Gestión de Campos
            </h2>
            <p className="text-neutral-gray500 text-sm">
              Administra tus lotes, historiales y registros.
            </p>
          </div>
        )}

        {activePage === "configuracion" && (
          <div className="animate-fade-in flex flex-col gap-1">
            <h2 className="text-3xl font-bold text-neutral-gray900 tracking-tight">
              Configuración de Cuenta
            </h2>
            <p className="text-neutral-gray500 text-sm">
              Actualizá tu perfil y preferencias de seguridad.
            </p>
          </div>
        )}
      </div>

      {/* Lado Derecho: Acciones */}
      <div>
        <button
          onClick={onLogout}
          className="group flex items-center gap-2 px-4 py-2 font-medium rounded-lg bg-white text-neutral-gray600 border border-neutral-gray300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 shadow-sm active:scale-95"
          title="Cerrar Sesión"
        >
          <span className="material-icons-outlined text-xl group-hover:animate-pulse">logout</span>
          <span className="hidden md:inline">Salir</span>
        </button>
      </div>
    </header>
  );
}
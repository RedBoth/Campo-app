export default function Sidebar({ onNavigate }) {
  return (
    <aside className="w-64 bg-neutral-dark p-4 hidden md:block">
      <nav>
        <p className="font-semibold text-neutral-light mb-4">Navegación</p>
        <ul className="space-y-2">
          <li>
            <button onClick={() => onNavigate("inicio")} className="w-full text-left px-2 py-1 rounded hover:bg-neutral-brown text-sm text-neutral-light">
              Inicio
            </button>
          </li>
          <li>
            <button onClick={() => onNavigate("campos")} className="w-full text-left px-2 py-1 rounded hover:bg-neutral-brown text-sm text-neutral-light">
              Campos
            </button>
          </li>
          <li>
            <button className="w-full text-left px-2 py-1 rounded hover:bg-neutral-brown text-sm text-neutral-light">
              Configuración
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

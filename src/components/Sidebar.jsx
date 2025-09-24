export default function Sidebar() {
  return (
    <aside className="w-64 bg-neutral-dark p-4 hidden md:block">
      <nav>
        <p className="font-semibold text-neutral-light mb-4">Navegación</p>
        <ul className="space-y-2">
          <li>
            <button className="w-full text-left px-2 py-1 rounded hover:bg-neutral-brown text-sm text-neutral-light">
              Campos
            </button>
          </li>
          <li>
            <button className="w-full text-left px-2 py-1 rounded hover:bg-neutral-brown text-sm text-neutral-light">
              Configuración
            </button>
          </li>
          <li>
            <button className="w-full text-left px-2 py-1 rounded hover:bg-neutral-brown text-sm text-neutral-light">
              Usuarios
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

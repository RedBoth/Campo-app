import { useState } from "react";

export default function Sidebar({ onNavigate, currentUser }) {
  const [activeItem, setActiveItem] = useState("inicio");

  const navItems = [
    { id: "inicio", label: "Inicio", icon: "home" },
    { id: "campos", label: "Campos", icon: "grass" },
    { id: "configuracion", label: "Configuración", icon: "settings" },
  ];

  const handleClick = (id) => {
    setActiveItem(id);
    onNavigate(id);
  };

  return (
    <aside className="fixed top-0 left-0 w-64 bg-neutral-dark text-neutral-light flex flex-col h-screen border-r-2 border-neutral-gray300">
      
      {/* Logo y título */}
      <div className="p-6">
        <h1 className="text-4xl font-bold text-neutral-gray900">
          Lote<span className="text-primary">Pro</span>
        </h1>
        <p className="text-lg text-neutral-gray500">Gestión de campos</p>
      </div>

      {/* Navegación */}
      <nav className="flex-grow px-4">
        <p className="px-2 pt-4 pb-2 text-sm text-neutral-gray500 uppercase tracking-wider">
          Navegacion
        </p>
        <ul className="space-y-2 font-medium">
          {navItems.map((item) => {
            const isActive = item.id === activeItem;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-md border transition
                    ${
                      isActive
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-transparent text-neutral-gray500 border-transparent hover:bg-aqua-light hover:text-neutral-gray900"
                    }`}
                >
                  <span className="material-icons-outlined mr-3 text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Usuario */}
      <div className="p-4 border-t border-neutral-gray300">
        <div className="flex items-center">
          <img
            alt="Admin user avatar"
            className="h-10 w-10 rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHDJ7_nHNk8YOYX3P0tPQ3lS5fp4oAE2miU0y4goO36HZew3uAg-U3qthUAoyT5aSrw82bnhEw1FtchGCkGNsCOj6BfKE1st0Tr4veMlVisPlimDzatYMTYCaUu5H3iGK-DHEn-XDyysbYGuI0iePJyD2tRxtqd-1CgFCa0IUD2XXViou4YsC2MBgJNUlMDsNCWBgTJwlX3Xxr0mwt_STtn-5NrmyVjOrgnj8Ppy8AAQIayqOkeCBBTFtXS8jsHf4oZ_1X17rJi0A"
          />
          <p className="text-sm font-semibold text-neutral-gray900 ml-3">
            {currentUser?.nombre} {currentUser?.apellido}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-xs text-neutral-gray500/70 border-t border-neutral-gray300">
        © 2025 Mauro Kolman
      </div>
    </aside>
  );
}

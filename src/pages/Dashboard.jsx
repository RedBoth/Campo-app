import { useState } from "react";
import Sidebar from "../components/ui/Sidebar";
import CamposPage from "./CamposPage";

export default function Dashboard({ onLogout, currentUser }) {
  const [activePage, setActivePage] = useState("campos");

  return (
    <div className="min-h-screen flex flex-col bg-neutral-brown">
      <header className="flex justify-between items-center bg-neutral-dark/40 shadow px-6 py-4">
        <h1 className="text-xl font-bold text-neutral-light">
            Gestión de Lotes{" "}
            {currentUser && <span className="text-gray-400">({currentUser})</span>}
        </h1>
        <button onClick={onLogout} className="px-4 py-2 bg-black/30 text-white rounded">
            Cerrar sesión
        </button>
      </header>

      <main className="flex flex-1">
        <Sidebar onNavigate={setActivePage} />

        <section className="flex-1 p-6">
            {activePage === "inicio" && <p className="text-neutral-light">⚙️ Inicio</p>}
            
            {activePage === "campos" && <CamposPage />}
        </section>
      </main>
    </div>
  );
}
import { useState } from "react";
import Sidebar from "../components/ui/Sidebar";
import CamposPage from "./CamposPage";
import Home from "./Home";

export default function Dashboard({ onLogout, currentUser }) {
  const [activePage, setActivePage] = useState("campos");

  return (
    <div className="min-h-screen flex bg-neutral-gray ml-64">
      {/* Sidebar fija a la izquierda */}
      <Sidebar onNavigate={setActivePage} currentUser={currentUser}/>

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col">
        {/* Header dentro del área principal */}
        <header className="flex justify-between items-center bg-neutral-white shadow-sm p-6 border-b-2 border-neutral-gray300">
          {activePage === "inicio" && "Inicio"}
          {activePage === "campos" && (
            <div>
              <h2 class="text-3xl font-bold text-neutral-gray900">Gestión de campos y lotes</h2>
              <p class="text-neutral-gray500">Seleccione un campo para ver y editar sus lotes.</p>
            </div>
          )}

          <button
            onClick={onLogout}
            className="px-4 py-2 font-medium rounded-lg bg-neutral-gray50 text-neutral-gray700 border border-neutral-gray300 hover:bg-softdanger transition"
          >
            Cerrar sesion
          </button>
        </header>

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto p-6 bg-neutral-gray100">
          {activePage === "inicio" && <Home />}
          {activePage === "campos" && <CamposPage />}
        </main>
      </div>
    </div>
  );
}

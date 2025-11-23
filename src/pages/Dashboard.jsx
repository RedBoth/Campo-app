import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import CamposPage from "./CamposPage";
import Home from "./Home";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("inicio");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        await logout();
        navigate("/login"); 
    } catch (error) {
        console.error("Error al salir", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-neutral-gray ml-64">
      <Sidebar onNavigate={setActivePage} currentUser={currentUser}/>

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-neutral-white shadow-sm p-6 border-b-2 border-neutral-gray300">
          {activePage === "inicio" &&  (
              <div className="flex items-center gap-2 text-neutral-gray500">
                  <span className="material-icons-outlined">home</span>
                  <span className="text-sm font-medium"> Inicio</span>
              </div>
          )}
          {activePage === "campos" && (
            <div>
              <h2 className="text-3xl font-bold text-neutral-gray900">Gestión de campos y lotes</h2>
              <p className="text-neutral-gray500">Seleccione un campo para ver y editar sus lotes.</p>
            </div>
          )}

          <button
            onClick={handleLogout}
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

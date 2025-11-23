import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import CamposPage from "./CamposPage";
import Home from "./Home";
import SettingsPage from "./SettingsPage";

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

      <div className="flex-1 flex flex-col h-screen">
        <Header activePage={activePage} onLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto p-6 bg-neutral-gray100">
          {activePage === "inicio" && <Home />}
          {activePage === "campos" && <CamposPage />}
          {activePage === "configuracion" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

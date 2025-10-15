import { useState, useEffect } from "react";
import Sidebar from "../components/ui/Sidebar";
import CamposPage from "./CamposPage";

export default function Dashboard({ onLogout, currentUser }) {
  // Estado de navegación
  const [activePage, setActivePage] = useState("campos");

  // Estado y lógica de hojas/lotes (pueden quedar aquí o moverse a CamposPage si solo ahí se usan)
  const defaultHojas = [
    { id: 1, nombre: "Campo 1", lotes: [{ id: 1, nombre: "Lote 1" }] },
  ];
  const [hojas, setHojas] = useState(() => {
    const dataGuardada = localStorage.getItem("hojas");
    return dataGuardada ? JSON.parse(dataGuardada) : defaultHojas;
  });
  useEffect(() => {
    localStorage.setItem("hojas", JSON.stringify(hojas));
  }, [hojas]);

  const [hojaActivaId, setHojaActivaId] = useState(1);
  const [loteSeleccionado, setLoteSeleccionado] = useState(null);
  const hojaActiva = hojas.find((h) => h.id === hojaActivaId);

  // Handlers (los podés pasar a CamposPage como props)
  const handleLoteClick = (lote) => {
    setLoteSeleccionado(loteSeleccionado?.id === lote.id ? null : lote);
  };
  const handleNuevaHoja = () => {
    const nuevaId = hojas.length + 1;
    setHojas([...hojas, { id: nuevaId, nombre: `Campo ${nuevaId}`, lotes: [] }]);
    setHojaActivaId(nuevaId);
    setLoteSeleccionado(null);
  };
  const handleAgregarRegistro = (nuevoRegistro) => {
    if (!loteSeleccionado) return;
    setHojas((prev) => 
      prev.map((hoja) => 
        hoja.id === hojaActiva.id 
          ? { 
            ...hoja,
            lotes: hoja.lotes.map((l) => 
              l.id === loteSeleccionado.id
                ? { ...l, info: [...(l.info || []), nuevoRegistro] } 
                : l
            ),
        } : hoja 
      ) 
    ); 
          
          setLoteSeleccionado((prev) => ({
            ...prev,
            info: [...(prev.info || []), nuevoRegistro],
          }));
  };
  const handleImageChange = (base64) => { 
    setHojas((prev) => prev.map((hoja) => 
      hoja.id === hojaActiva.id ? { ...hoja, imagen: base64 } : hoja 
      ) 
    ); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-brown">
      {/* Topbar */}
      <header className="flex justify-between items-center bg-neutral-dark/40 shadow px-6 py-4">
        <h1 className="text-xl font-bold text-neutral-light">
          Gestión de Lotes{" "}
          {currentUser && <span className="text-gray-400">({currentUser})</span>}
        </h1>
        <button onClick={onLogout} className="px-4 py-2 bg-black/30 text-white rounded">
          Cerrar sesión
        </button>
      </header>

      {/* Layout principal */}
      <main className="flex flex-1">
        <Sidebar onNavigate={setActivePage} />

        <section className="flex-1 p-6">
          {activePage === "inicio" && <p className="text-neutral-light">⚙️ Inicio</p>}

          {activePage === "campos" && (
            <CamposPage
              hojas={hojas}
              setHojas={setHojas}
              hojaActiva={hojaActiva}
              hojaActivaId={hojaActivaId}
              setHojaActivaId={setHojaActivaId}
              loteSeleccionado={loteSeleccionado}
              setLoteSeleccionado={setLoteSeleccionado}
              handleNuevaHoja={handleNuevaHoja}
              handleLoteClick={handleLoteClick}
              handleAgregarRegistro={handleAgregarRegistro}
              handleImageChange={handleImageChange}
            />
          )}
        </section>
      </main>
    </div>
  );
}
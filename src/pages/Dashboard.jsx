import { useState, useEffect } from "react";
import Sidebar from "../components/ui/Sidebar";
import CamposPage from "./CamposPage";

export default function Dashboard({ onLogout, currentUser }) {
  // Estado de navegación
  const [activePage, setActivePage] = useState("campos");

  // Estado y lógica de campos/lotes (pueden quedar aquí o moverse a CamposPage si solo ahí se usan)
  const defaultCampos = [
    { id: 1, nombre: "Campo 1", lotes: [{ id: 1, nombre: "Lote 1" }] },
  ];
  const [campos, setCampos] = useState(() => {
    const dataGuardada = localStorage.getItem("campos");
    return dataGuardada ? JSON.parse(dataGuardada) : defaultCampos;
  });
  useEffect(() => {
    localStorage.setItem("campos", JSON.stringify(campos));
  }, [campos]);

  const [campoActivoId, setCampoActivoId] = useState(1);
  const [loteSeleccionado, setLoteSeleccionado] = useState(null);
  const campoActivo = campos.find((campo) => campo.id === campoActivoId);

  // Handlers (los podés pasar a CamposPage como props)
  const handleLoteClick = (lote) => {
    setLoteSeleccionado(loteSeleccionado?.id === lote.id ? null : lote);
  };
  const handleNuevoCampo = () => {
    const nuevaId = campos.length + 1;
    setCampos([...campos, { id: nuevaId, nombre: `Campo ${nuevaId}`, lotes: [] }]);
    setCampoActivoId(nuevaId);
    setLoteSeleccionado(null);
  };
  const handleAgregarRegistro = (nuevoRegistro) => {
    if (!loteSeleccionado) return;
    setCampos((prev) => 
      prev.map((campo) => 
        campo.id === campoActivo.id 
          ? { 
            ...campo,
            lotes: campo.lotes.map((l) => 
              l.id === loteSeleccionado.id
                ? { ...l, info: [...(l.info || []), nuevoRegistro] } 
                : l
            ),
        } : campo 
      ) 
    ); 
          
          setLoteSeleccionado((prev) => ({
            ...prev,
            info: [...(prev.info || []), nuevoRegistro],
          }));
  };
  const handleImageChange = (base64) => { 
    setCampos((prev) => prev.map((campo) => 
      campo.id === campoActivo.id ? { ...campo, imagen: base64 } : campo 
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
              campos={campos}
              setCampos={setCampos}
              campoActivo={campoActivo}
              campoActivoId={campoActivoId}
              setCampoActivoId={setCampoActivoId}
              loteSeleccionado={loteSeleccionado}
              setLoteSeleccionado={setLoteSeleccionado}
              handleNuevoCampo={handleNuevoCampo}
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
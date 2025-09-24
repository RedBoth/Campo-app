import { useState, useEffect } from "react";
import LotGrid from "./components/LotGrid";
import HistoryPanel from "./components/HistoryPanel";
import LotActions from "./components/LotActions";
import Tabs from "./components/Tabs";
import PageActions from "./components/PageActions";
import ImageUploader from "./components/ImageUploader";
import Sidebar from "./components/Sidebar";

export default function Dashboard({ onLogout, currentUser }) {
  // Datos iniciales
  const defaultHojas = [
    {
      id: 1,
      nombre: "Campo 1",
      lotes: [
        { id: 1, nombre: "Lote 1" },
        { id: 2, nombre: "Lote 2" },
        { id: 3, nombre: "Lote 3" },
        { id: 4, nombre: "Lote 4" },
        { id: 5, nombre: "Lote 5" },
      ],
    },
  ];

  // Lista de campos (hojas)
  const [hojas, setHojas] = useState(() => {
    const dataGuardada = localStorage.getItem("hojas");
    return dataGuardada ? JSON.parse(dataGuardada) : defaultHojas;
  });

  // Cada que cambian los campos, se actualiza el localStorage
  useEffect(() => {
    localStorage.setItem("hojas", JSON.stringify(hojas));
  }, [hojas]);

  // Estado de hoja y lote activo
  const [hojaActivaId, setHojaActivaId] = useState(1);
  const [loteSeleccionado, setLoteSeleccionado] = useState(null);
  const hojaActiva = hojas.find((h) => h.id === hojaActivaId);

  // Handlers
  const handleLoteClick = (lote) => {
    if (loteSeleccionado?.id === lote.id) {
      setLoteSeleccionado(null);
    } else {
      setLoteSeleccionado(lote);
    }
  };

  const handleNuevaHoja = () => {
    const nuevaId = hojas.length + 1;
    const nuevaHoja = {
      id: nuevaId,
      nombre: `Campo ${nuevaId}`,
      lotes: [],
    };
    setHojas([...hojas, nuevaHoja]);
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
            }
          : hoja
      )
    );

    setLoteSeleccionado((prev) => ({
      ...prev,
      info: [...(prev.info || []), nuevoRegistro],
    }));
  };

  const handleImageChange = (base64) => {
    setHojas((prev) =>
      prev.map((hoja) =>
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
          {currentUser && (
            <span className="text-gray-600 text-lg">({currentUser})</span>
          )}
        </h1>
        <button
          onClick={onLogout}
          className="px-4 py-2 font-semibold bg-black/30 text-white rounded hover:bg-black/90"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Contenido principal */}
      <main className="flex flex-1">
        {/* Sidebar (por ahora vacío, para el futuro) */}
        <Sidebar />

        {/* Área de trabajo */}
        <section className="flex-1 p-6">
          {/* Tabs de campos */}
          <Tabs
            hojas={hojas}
            hojaActivaId={hojaActivaId}
            setHojaActivaId={setHojaActivaId}
            onNuevaHoja={handleNuevaHoja}
          />

          {/* Layout de contenido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Grid de lotes + acciones */}
            <div>
              <LotGrid
                lotes={hojaActiva?.lotes || []}
                onLoteClick={handleLoteClick}
                loteSeleccionado={loteSeleccionado}
              />

              <LotActions
                hojas={hojas}
                setHojas={setHojas}
                hojaActiva={hojaActiva}
                loteSeleccionado={loteSeleccionado}
                setLoteSeleccionado={setLoteSeleccionado}
              />
            </div>

            {/* Panel de historial */}
            <HistoryPanel
              loteSeleccionado={loteSeleccionado}
              onAgregarRegistro={handleAgregarRegistro}
              hojaActiva={hojaActiva}
            />
          </div>

          {/* Imagen del campo */}
          <div className="mt-6">
            <ImageUploader
              image={hojaActiva?.imagen}
              onImageChange={handleImageChange}
            />
          </div>

          {/* Acciones de página */}
          <div className="mt-6">
            <PageActions
              hojas={hojas}
              setHojas={setHojas}
              hojaActiva={hojaActiva}
              setHojaActivaId={setHojaActivaId}
              setLoteSeleccionado={setLoteSeleccionado}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

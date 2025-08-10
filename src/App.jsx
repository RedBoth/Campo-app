import LotGrid from "./components/LotGrid"
import HistoryPanel from "./components/HistoryPanel"
import LotActions from "./components/LotActions"
import Tabs from "./components/Tabs";
import PageActions from "./components/PageActions";
import { useState, useEffect, use } from "react";

export default function App() {
  const defaultHojas = [
    {
      id: 1,
      nombre: "Hoja 1",
      lotes: [
        { id: 1, nombre: "Lote 1" },
        { id: 2, nombre: "Lote 2" },
        { id: 3, nombre: "Lote 3" },
        { id: 4, nombre: "Lote 4" },
        { id: 5, nombre: "Lote 5" },
      ]
    }
  ];
  
  const [hojas, setHojas] = useState(() => {
    const dataGuardada = localStorage.getItem("hojas");
    return dataGuardada ? JSON.parse(dataGuardada) : defaultHojas;
  });

  const [hojasActiva, setHojaActiva] = useState(() => {
    const dataGuardada = localStorage.getItem("hojas");
    const hojasParseadas = dataGuardada ? JSON.parse(dataGuardada) : defaultHojas;
    return hojasParseadas.length > 0 ? hojasParseadas[0] : null;
  });

  useEffect(() => {
    localStorage.setItem("hojas", JSON.stringify(hojas));
  }, [hojas]);

  const [hojaActivaId, setHojaActivaId] = useState(1);
  const [loteSeleccionado, setLoteSeleccionado] = useState(null);

  const hojaActiva = hojas.find((h) => h.id === hojaActivaId);

  const handleLoteClick = (lote) => {
     if (loteSeleccionado?.id === lote.id) {
      setLoteSeleccionado(null);
    } else {
      setLoteSeleccionado(lote)
    }
  };

  const handleNuevaHoja = () => {
    const nuevaId = hojas.length + 1;
    const nuevaHoja = {
      id: nuevaId,
      nombre: `Hoja ${nuevaId}`,
      lotes: [],
    };
    setHojas([...hojas, nuevaHoja]);
    setHojaActivaId(nuevaId);
    setLoteSeleccionado(null);
  };

  const handleAgregarRegistro = (nuevoRegistro) => {
    if (!loteSeleccionado) return;

    setHojas(prev =>
      prev.map(hoja =>
        hoja.id === hojaActiva.id
          ? {
              ...hoja,
              lotes: hoja.lotes.map(l =>
                l.id === loteSeleccionado.id
                  ? { ...l, info: [...(l.info || []), nuevoRegistro] }
                  : l
              )
            }
          : hoja
      )
    );

    setLoteSeleccionado(prev => ({
      ...prev,
      info: [...(prev.info || []), nuevoRegistro]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Lotes</h1>

      {/* Pestañas */}
      <Tabs hojas={hojas} hojaActivaId={hojaActivaId} setHojaActivaId={setHojaActivaId} onNuevaHoja={handleNuevaHoja} />

      {/* Panel de contenido */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <LotGrid 
          lotes={hojaActiva?.lotes || []} 
          onLoteClick={handleLoteClick} 
          loteSeleccionado={loteSeleccionado}
          />

          {/* Controles de acción */}
          <LotActions hojas={hojas} setHojas={setHojas} hojaActiva={hojaActiva} loteSeleccionado={loteSeleccionado} setLoteSeleccionado={setLoteSeleccionado} />
        </div>
        <HistoryPanel
          loteSeleccionado={loteSeleccionado}
          onAgregarRegistro={handleAgregarRegistro}
        />
      </div>

      <PageActions hojas={hojas} setHojas={setHojas} hojaActiva={hojaActiva} setHojaActivaId={setHojaActivaId} setLoteSeleccionado={setLoteSeleccionado} />
    </div>
  );
}
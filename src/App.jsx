import LotGrid from "./components/LotGrid"
import HistoryPanel from "./components/HistoryPanel"
import LotActions from "./components/LotActions"
import Tabs from "./components/Tabs";
import PageActions from "./components/PageActions";
import ImageUploader from "./components/ImageUploader";
import Login from "./components/Login";
import { useState, useEffect } from "react";

export default function App() {
  // Inicialización de datos
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
      ]
    }
  ];

  //Lista de campos y sus lotes - Si hay datos guardados en localStorage, se usan esos, sino los por defecto
  const [hojas, setHojas] = useState(() => {
    const dataGuardada = localStorage.getItem("hojas");
    return dataGuardada ? JSON.parse(dataGuardada) : defaultHojas;
  });
  //Cada que cambian los campos, se actualiza el localStorage
  useEffect(() => {
    localStorage.setItem("hojas", JSON.stringify(hojas));
  }, [hojas]);

  const [hojaActivaId, setHojaActivaId] = useState(1);            //Id del campo activo
  const [loteSeleccionado, setLoteSeleccionado] = useState(null); //Lote sobre el que el usuario hizo clic
  const hojaActiva = hojas.find((h) => h.id === hojaActivaId);    //Busca el campo activo en la lista de campos
  //Si haces click en un lote, se selecciona o deselecciona
  const handleLoteClick = (lote) => {
    if (loteSeleccionado?.id === lote.id) {
      setLoteSeleccionado(null);
    } else {
      setLoteSeleccionado(lote)
    }
  };
  //Crea un nuevo campo, lo agrega a la lista y lo selecciona, resetea el lote seleccionado
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
  //Agrega un registro nuevo al lote seleccionado, actualiza la lista de campos y el lote seleccionado
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

  //Agregar estado para la imagen activa
  const handleImageChange = (base64) => {
    setHojas(prev =>
      prev.map(hoja =>
        hoja.id === hojaActiva.id
          ? { ...hoja, imagen: base64 }
          : hoja
      )
    );
  };

  //Login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true";
    const user = localStorage.getItem("currentUser");
    setIsLoggedIn(logged);
    setCurrentUser(user);
  }, []);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Gestión de Lotes {currentUser && <span className="text-gray-600 text-lg">({currentUser})</span>}
        </h1>
        <button
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("currentUser");
            setIsLoggedIn(false);
            setCurrentUser(null);
          }}
          className="px-4 py-2 font-semibold bg-black/55 text-white rounded hover:bg-black/90"
        >
          Cerrar sesión
        </button>
      </div>

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
          hojaActiva={hojaActiva}
        />
      </div>
      <ImageUploader 
        image={hojaActiva?.imagen} 
        onImageChange={handleImageChange} 
      />
      <PageActions hojas={hojas} setHojas={setHojas} hojaActiva={hojaActiva} setHojaActivaId={setHojaActivaId} setLoteSeleccionado={setLoteSeleccionado} />
    </div>
  );
}
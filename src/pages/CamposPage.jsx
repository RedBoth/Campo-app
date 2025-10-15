import Tabs from "../components/ui/Tabs";
import LotGrid from "../components/lots/LotGrid";
import LotActions from "../components/lots/LotActions";
import HistoryPanel from "../components/lots/HistoryPanel";
import ImageUploader from "../components/ImageUploader";
import PageActions from "../components/ui/PageActions";

export default function CamposPage({
  hojas,
  setHojas,
  hojaActiva,
  hojaActivaId,
  setHojaActivaId,
  loteSeleccionado,
  setLoteSeleccionado,
  handleNuevaHoja,
  handleLoteClick,
  handleAgregarRegistro,
  handleImageChange,
}) {
  return (
    <>
      <Tabs
        hojas={hojas}
        hojaActivaId={hojaActivaId}
        setHojaActivaId={setHojaActivaId}
        onNuevaHoja={handleNuevaHoja}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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

        <HistoryPanel
          loteSeleccionado={loteSeleccionado}
          onAgregarRegistro={handleAgregarRegistro}
          hojaActiva={hojaActiva}
        />
      </div>

      <div className="mt-6">
        <ImageUploader
          image={hojaActiva?.imagen}
          onImageChange={handleImageChange}
        />
      </div>

      <div className="mt-6">
        <PageActions
          hojas={hojas}
          setHojas={setHojas}
          hojaActiva={hojaActiva}
          setHojaActivaId={setHojaActivaId}
          setLoteSeleccionado={setLoteSeleccionado}
        />
      </div>
    </>
  );
}

import Tabs from "../components/ui/Tabs";
import LotGrid from "../components/lots/LotGrid";
import LotActions from "../components/lots/LotActions";
import HistoryPanel from "../components/lots/HistoryPanel";
import ImageUploader from "../components/ImageUploader";
import PageActions from "../components/ui/PageActions";

export default function CamposPage({
  campos,
  setCampos,
  campoActivo,
  campoActivoId,
  setCampoActivoId,
  loteSeleccionado,
  setLoteSeleccionado,
  handleNuevoCampo,
  handleLoteClick,
  handleAgregarRegistro,
  handleImageChange,
}) {
  return (
    <>
      <Tabs
        campos={campos}
        campoActivoId={campoActivoId}
        setCampoActivoId={setCampoActivoId}
        onNuevoCampo={handleNuevoCampo}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <LotGrid
            lotes={campoActivo?.lotes || []}
            onLoteClick={handleLoteClick}
            loteSeleccionado={loteSeleccionado}
          />
          <LotActions
            campos={campos}
            setCampos={setCampos}
            campoActivo={campoActivo}
            loteSeleccionado={loteSeleccionado}
            setLoteSeleccionado={setLoteSeleccionado}
          />
        </div>

        <HistoryPanel
          loteSeleccionado={loteSeleccionado}
          onAgregarRegistro={handleAgregarRegistro}
          campoActivo={campoActivo}
        />
      </div>

      <div className="mt-6">
        <ImageUploader
          image={campoActivo?.imagen}
          onImageChange={handleImageChange}
        />
      </div>

      <div className="mt-6">
        <PageActions
          campos={campos}
          setCampos={setCampos}
          campoActivo={campoActivo}
          setCampoActivoId={setCampoActivoId}
          setLoteSeleccionado={setLoteSeleccionado}
        />
      </div>
    </>
  );
}
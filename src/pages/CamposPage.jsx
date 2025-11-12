import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { agregarCampo, agregarRegistro, actualizarImagenCampo } from "../api/camposApi";
import Tabs from "../components/ui/Tabs";
import LotManager from "../components/lots/LotManager";
import HistoryPanel from "../components/lots/HistoryPanel";
import ImageUploader from "../components/ImageUploader";
import PageActions from "../components/ui/PageActions";

export default function CamposPage() {
    const [campos, setCampos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [campoActivoId, setCampoActivoId] = useState(null);
    const [loteSeleccionado, setLoteSeleccionado] = useState(null);

    useEffect(() => {
        const obtenerCampos = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "campos"));
                const camposData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCampos(camposData);
                if (camposData.length > 0 && !campoActivoId) {
                    setCampoActivoId(camposData[0].id);
                }
            } catch (error) {
                console.error("Error al obtener los campos:", error);
            } finally {
                setLoading(false);
            }
        };
        obtenerCampos();
    }, [campoActivoId]);

    const handleLoteClick = (lote) => {
        setLoteSeleccionado(prev => (prev?.id === lote.id ? null : lote));
    };
    
    const handleSeleccionarCampo = (id) => {
        setCampoActivoId(id);
        setLoteSeleccionado(null);
    };

    const handleNuevoCampo = async () => {
        const nombre = `Campo ${campos.length + 1}`;
        const nuevoDocRef = await agregarCampo(nombre);
        const nuevoCampo = { id: nuevoDocRef.id, nombre, lotes: [] };
        setCampos(anteriores => [...anteriores, nuevoCampo]);
        setCampoActivoId(nuevoDocRef.id);
        setLoteSeleccionado(null);
    };

    const handleAgregarRegistro = async (textoRecibido) => {
        if (!loteSeleccionado || !campoActivoId) return;
        
        const nuevoRegistro = {
            texto: textoRecibido,
            fecha: new Date().toLocaleString('es-AR'),
        };
        await agregarRegistro(campoActivoId, loteSeleccionado, nuevoRegistro);
        
        const loteActualizado = { ...loteSeleccionado, info: [...(loteSeleccionado.info || []), nuevoRegistro] };
        setLoteSeleccionado(loteActualizado);
        setCampos(anteriores => anteriores.map(c => 
            c.id === campoActivoId ? {
                ...c,
                lotes: c.lotes.map(l => l.id === loteSeleccionado.id ? loteActualizado : l)
            } : c
        ));
    };

    const handleImageChange = async (base64) => {
        if (!campoActivoId) return;
        await actualizarImagenCampo(campoActivoId, base64);
        setCampos(anteriores => anteriores.map(c => 
            c.id === campoActivoId ? { ...c, imagen: base64 } : c
        ));
    };

    if (loading) {
        return <p className="text-neutral-gray700 text-center mt-10 text-lg">Cargando campos...</p>;
    }

    const campoActivo = campos.find(c => c.id === campoActivoId);

    return (
        <>
            <Tabs
                campos={campos}
                campoActivoId={campoActivoId}
                onTabClick={handleSeleccionarCampo}
                onNuevoCampo={handleNuevoCampo}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <LotManager
                    lotes={campoActivo?.lotes || []}
                    campoActivoId={campoActivoId}
                    loteSeleccionado={loteSeleccionado}
                    setCampos={setCampos}
                    setLoteSeleccionado={setLoteSeleccionado}
                    onLoteClick={handleLoteClick}
                    campos={campos}
                />
                <HistoryPanel
                    key={loteSeleccionado ? loteSeleccionado.id : 'ninguno'}
                    loteSeleccionado={loteSeleccionado}
                    onAgregarRegistro={handleAgregarRegistro}
                />
            </div>

            <div className="mt-6">
                <ImageUploader
                    key={campoActivoId}
                    image={campoActivo?.imagen}
                    onImageChange={handleImageChange}
                />
            </div>

            <div className="mt-6">
                <PageActions
                    campos={campos}
                    setCampos={setCampos}
                    campoActivoId={campoActivoId}
                    setCampoActivoId={setCampoActivoId}
                    setLoteSeleccionado={setLoteSeleccionado}
                />
            </div>
        </>
    );
}
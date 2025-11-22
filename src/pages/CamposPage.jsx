import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { agregarCampo, agregarRegistro, actualizarImagenCampo } from "../api/camposApi";
import { useToast } from "../context/ToastProvider";
import Tabs from "../components/ui/Tabs";
import LotManager from "../components/lots/LotManager";
import HistoryPanel from "../components/lots/HistoryPanel";
import ImageUploader from "../components/ImageUploader";
import PageActions from "../components/ui/PageActions";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function CamposPage() {
    const [campos, setCampos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [campoActivoId, setCampoActivoId] = useState(null);
    const [loteSeleccionado, setLoteSeleccionado] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const obtenerCampos = async () => {
            setLoading(true);
            try {
                const user = auth.currentUser;
                if (!user) return;

                const camposQuery = query(
                    collection(db, "campos"),
                    where("userId", "==", user.uid),
                    orderBy("createdAt", "asc")
                );
                const querySnapshot = await getDocs(camposQuery);
                const camposData = querySnapshot.docs.map(doc => {
                    const data = doc.data();

                    return {
                        id: doc.id,
                        ...data,
                        lotes: (data.lotes || []).map(l => ({
                            ...l,
                            id: l.id.toString()
                        }))
                    };
                });
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
        try {
            const nombre = `Campo ${campos.length + 1}`;
            const nuevoDocRef = await agregarCampo(nombre);
            const nuevoCampo = { id: nuevoDocRef.id, nombre, lotes: [] };
            setCampos(anteriores => [...anteriores, nuevoCampo]);
            setCampoActivoId(nuevoDocRef.id);
            setLoteSeleccionado(null);
            showToast("Campo creado correctamente", "success");
        } catch (error) {
            console.error(error);
            showToast("Error al crear el campo", "error");
        }
    };

    const handleAgregarRegistro = async (textoRecibido) => {
        if (!textoRecibido || !loteSeleccionado || !campoActivoId) return;
        
        const nuevoRegistro = {
            texto: textoRecibido,
            fecha: new Date().toLocaleString('es-AR'),
        };

        setIsSaving(true);

        try {
            await agregarRegistro(campoActivoId, loteSeleccionado.id, nuevoRegistro);

            const loteActualizado = { 
                ...loteSeleccionado, 
                info: [...(loteSeleccionado.info || []), nuevoRegistro] 
            };
            setLoteSeleccionado(loteActualizado);

            setCampos(prevCampos => 
                prevCampos.map(campo => {
                    if (campo.id !== campoActivoId) return campo;

                    const lotesActualizados = campo.lotes.map(lote => 
                        lote.id.toString() === loteSeleccionado.id.toString() 
                            ? loteActualizado 
                            : lote
                    );

                    return { ...campo, lotes: lotesActualizados };
                })
            );
            showToast("Registro guardado correctamente", "success");
        } catch (error) {
            console.error("Error al guardar registro:", error);
            showToast("Error al guardar el registro", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageChange = async (base64) => {
        if (!campoActivoId) return;
        try {
            await actualizarImagenCampo(campoActivoId, base64);
            setCampos(anteriores => anteriores.map(c => 
                c.id === campoActivoId ? { ...c, imagen: base64 } : c
            ));
            showToast("Imagen actualizada", "success");
        } catch (error) {
            console.error(error);
            showToast("Error al subir imagen", "error");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <LoadingSpinner size="lg" color="border-primary" />
                <p className="text-neutral-gray500 mt-4 animate-pulse">Cargando tus campos...</p>
            </div>
        );
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
                    isSaving={isSaving}
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
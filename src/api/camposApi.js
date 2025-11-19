import { db, auth } from "../firebase-config";
import { collection, doc, addDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove, serverTimestamp } from "firebase/firestore";


/**
 * Agrega un nuevo campo a la colección "campos".
 * @param {string} nombreCampo El nombre para el nuevo campo.
 * @returns {Promise<DocumentReference>} La referencia al nuevo documento creado.
 */
export const agregarCampo = async (nombreCampo) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No hay un usuario autenticado.");
    }

    const nuevoCampo = {
        nombre: nombreCampo,
        lotes: [],
        userId: user.uid,
        createdAt: serverTimestamp(),
    };
    return await addDoc(collection(db, "campos"), nuevoCampo);
};

/**
 * Agrega un nuevo lote a una campo específica.
 * @param {Array} campos El array actual de campos.
 * @param {number} campoActivoId El ID de la campo a la que se agregará el lote.
 * @param {string} nombreLote El nombre para el nuevo lote.
 * @returns {Array} Un nuevo array de campos con el lote agregado.
 */
export const agregarLote = async (campoId, nombreLote) => {
    const nuevoLote = {
        id: Date.now(),
        nombre: nombreLote.trim(),
        info: [],
    };

    const camposRef = doc(db, "campos", campoId);
    await updateDoc(camposRef, {
        lotes: arrayUnion(nuevoLote)
    });
};

/**
 * Elimina un lote de una campo específica.
 * @param {Array} campos El array actual de campos.
 * @param {number} campoActivoId El ID de la campo de la que se eliminará el lote.
 * @param {number} loteId El ID del lote a eliminar.
 * @returns {Array} Un nuevo array de campos sin el lote eliminado.
 */
export const eliminarLote = async (campoId, loteParaEliminar) => {
    const camposRef = doc(db, "campos", campoId);
    await updateDoc(camposRef, {
        lotes: arrayRemove(loteParaEliminar)
    });
};


/**
 * Elimina una campo completa.
 * @param {Array} campos El array actual de campos.
 * @param {number} campoId El ID de la campo a eliminar.
 * @returns {Array} Un nuevo array sin la campo eliminada.
 */
export const eliminarCampo = async (campoId) => {
    const camposRef = doc(db, "campos", campoId);
    await deleteDoc(camposRef);
};

/**
 * Agrega un nuevo registro de historial al array 'info' de un lote.
 * @param {string} campoId El ID del campo que contiene el lote.
 * @param {object} lote El objeto completo del lote a actualizar.
 * @param {object} nuevoRegistro El nuevo objeto de registro a agregar.
 */
export const agregarRegistro = async (campoId, lote, nuevoRegistro) => {
    // Para actualizar un elemento dentro de un array, necesitamos quitar el viejo y poner el nuevo.
    const loteSinRegistro = { ...lote };
    delete loteSinRegistro.info; // Firestore no nos deja usar arrayRemove y arrayUnion al mismo tiempo.
    
    const loteActualizado = { ...lote, info: [...(lote.info || []), nuevoRegistro] };

    const campoRef = doc(db, "campos", campoId);
    // Quitamos el lote viejo
    await updateDoc(campoRef, { lotes: arrayRemove(lote) });
    // Agregamos el lote con la nueva info
    await updateDoc(campoRef, { lotes: arrayUnion(loteActualizado) });
};

/**
 * Actualiza la imagen de un campo específico.
 * @param {string} campoId El ID del campo a actualizar.
 * @param {string} imagenBase64 La nueva imagen en formato base64.
 */
export const actualizarImagenCampo = async (campoId, imagenBase64) => {
    const campoRef = doc(db, "campos", campoId);
    await updateDoc(campoRef, { imagen: imagenBase64 });
};
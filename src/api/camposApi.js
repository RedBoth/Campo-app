import { db, auth } from "../firebase-config";
import { collection, doc, getDoc, addDoc, updateDoc, deleteDoc, runTransaction, arrayRemove, serverTimestamp } from "firebase/firestore";


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
    const camposRef = doc(db, "campos", campoId);
    const campoSnap = await getDoc(camposRef);

    if (!campoSnap.exists()) throw new Error("Campo no encontrado");

    const datos = campoSnap.data();
    const nuevosLotes = datos.lotes || [];

    const loteId = Date.now().toString(); 

    const nuevoLote = {
        id: loteId,
        nombre: nombreLote.trim(),
        info: []
    };

    await updateDoc(camposRef, {
        lotes: [...nuevosLotes, nuevoLote]
    });

    return loteId;
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
export const agregarRegistro = async (campoId, loteId, nuevoRegistro) => {
    const campoRef = doc(db, "campos", campoId);

    await runTransaction(db, async (transaction) => {
        const campoDoc = await transaction.get(campoRef);
        if (!campoDoc.exists()) throw new Error("Campo no encontrado");

        const datos = campoDoc.data();
        const lotes = datos.lotes || [];

        const index = lotes.findIndex(l => l.id.toString() === loteId.toString());
        
        if (index === -1) throw new Error("Lote no encontrado para agregar registro");

        const nuevosLotes = [...lotes];
        
        nuevosLotes[index] = {
            ...nuevosLotes[index],
            info: [...(nuevosLotes[index].info || []), nuevoRegistro]
        };

        transaction.update(campoRef, { lotes: nuevosLotes });
    });
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
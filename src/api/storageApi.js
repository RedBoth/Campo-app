import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const storage = getStorage();

/**
 * Sube una imagen para un campo específico a Firebase Storage.
 * @param {File} file El archivo de imagen a subir.
 * @param {string} campoId El ID del campo para organizar la imagen.
 * @returns {Promise<string>} La URL pública de la imagen subida.
 */
export const uploadCampoImage = async (file, campoId) => {
    // Creamos una referencia única para el archivo, ej: campos/ID_DEL_CAMPO/nombre_archivo.jpg
    const storageRef = ref(storage, `campos/${campoId}/${file.name}`);
    
    // Subimos el archivo
    await uploadBytes(storageRef, file);
    
    // Obtenemos la URL de descarga
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
};

/**
 * Elimina una imagen de Firebase Storage usando su URL.
 * @param {string} imageUrl La URL de la imagen a eliminar.
 */
export const deleteCampoImage = async (imageUrl) => {
    if (!imageUrl) return;
    try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
    } catch (error) {
        // Si el archivo no existe, Firebase da un error. Podemos ignorarlo.
        console.warn("Error al eliminar la imagen (puede que ya no exista):", error);
    }
};
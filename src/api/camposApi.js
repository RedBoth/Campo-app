// Este archivo contendrá funciones "puras" para manipular el estado de las hojas.
// No modifican el estado directamente, solo reciben datos y devuelven datos nuevos.

/**
 * Agrega un nuevo lote a una campo específica.
 * @param {Array} campos El array actual de campos.
 * @param {number} campoActivoId El ID de la campo a la que se agregará el lote.
 * @param {string} nombreLote El nombre para el nuevo lote.
 * @returns {Array} Un nuevo array de campos con el lote agregado.
 */
export const agregarLote = (campos, campoActivoId, nombreLote) => {
    const nuevoLote = {
        id: Date.now(),
        nombre: nombreLote.trim()
    };

    return campos.map((campo) =>
        campo.id === campoActivoId
            ? { ...campo, lotes: [...campo.lotes, nuevoLote] }
            : campo
    );
};

/**
 * Elimina un lote de una campo específica.
 * @param {Array} campos El array actual de campos.
 * @param {number} campoActivoId El ID de la campo de la que se eliminará el lote.
 * @param {number} loteId El ID del lote a eliminar.
 * @returns {Array} Un nuevo array de campos sin el lote eliminado.
 */
export const eliminarLote = (campos, campoActivoId, loteId) => {
    return campos.map((campo) =>
        campo.id === campoActivoId
            ? { ...campo, lotes: campo.lotes.filter((l) => l.id !== loteId) }
            : campo
    );
};


/**
 * Elimina una campo completa.
 * @param {Array} campos El array actual de campos.
 * @param {number} campoId El ID de la campo a eliminar.
 * @returns {Array} Un nuevo array sin la campo eliminada.
 */
export const eliminarCampo = (campos, campoId) => {
    return campos.filter((campo) => campo.id !== campoId);
};
export default function PageActions({ hojas, setHojas, hojaActiva, setHojaActivaId, setLoteSeleccionado}) {
    return (
        <div className="flex justify-end mt-6">
            <button onClick={() => {
                if (hojas.length <= 1) {
                    alert("Debe haber al menos un campo.");
                    return;
                }

                const confirmacion = window.confirm(`¿Seguro que querés eliminar ${hojaActiva.nombre}? Esta acción no se puede deshacer.`);

                if (confirmacion) {
                    const nuevasHojas = hojas.filter((h) => h.id !== hojaActiva.id);
                    setHojas(nuevasHojas);
                    localStorage.setItem("hojas", JSON.stringify(nuevasHojas));
                    setHojaActivaId(nuevasHojas[0].id);
                    setLoteSeleccionado(null);
                }
            }} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                🗑️ Eliminar {hojaActiva.nombre}
            </button>
        </div>
    )
}
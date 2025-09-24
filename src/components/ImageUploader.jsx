
export default function ImageUploader({ image, onImageChange }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Solo permitir imágenes pequeñas (ej: < 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("La imagen es demasiado pesada. Máximo 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mt-6 bg-secondary/60 shadow rounded-lg p-4">
      <p className="font-semibold text-neutral-light mb-4 text-lg">Imagen del campo</p>
      {image ? (
        <div className="flex flex-col items-center">
          <img
            src={image}
            alt="Campo"
            className="
              w-full 
              h-48 sm:h-56 md:h-64 lg:h-auto 
              max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl 
              object-cover rounded-lg shadow mb-4
            "
          />
          <div className="flex gap-3">
            <label className="px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/80">
              Cambiar imagen
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            <button
              onClick={() => onImageChange(null)}
              className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/80"
            >
              Quitar imagen
            </button>
          </div>
        </div>
      ) : (
        <label className="px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/80">
          Subir imagen
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      )}
    </div>
  );
}
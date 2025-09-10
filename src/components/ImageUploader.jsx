import { useRef } from "react";

export default function ImageUploader({ image, onImageChange }) {
  const fileInputRef = useRef(null);

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
      onImageChange(reader.result); // Base64
    };
    reader.readAsDataURL(file);
  };
  // Función para eliminar la imagen
  const handleRemove = () => {
    onImageChange(null); // eliminamos la imagen
  };

  return (
    <div className="mt-6">
      <button
        onClick={() => fileInputRef.current.click()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Importar Imagen
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {image && (
        <div className="mt-4">
          <img
            src={image}
            alt="Vista del campo"
            className="max-w-full h-auto rounded-lg shadow"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Quitar imagen
          </button>
        </div>
      )}
    </div>
  );
}
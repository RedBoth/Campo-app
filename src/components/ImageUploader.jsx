import { useState } from 'react';
import { uploadCampoImage } from '../api/storageApi';

export default function ImageUploader({ image, onImageChange, campoActivoId }) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("La imagen es demasiado pesada. Máximo 2MB.");
            return;
        }

        setIsUploading(true);
        try {
            const imageUrl = await uploadCampoImage(file, campoActivoId);
            onImageChange(imageUrl);
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            alert("Hubo un error al subir la imagen.");
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleRemoveImage = () => {
        onImageChange(null);
    }

    return (
        <div className="mt-6 bg-neutral-white shadow rounded-lg p-4">
            <p className="font-semibold text-neutral-gray900 mb-4 text-lg">Imagen del campo</p>
            
            {isUploading && <p className="text-center text-neutral-gray700">Subiendo imagen...</p>}

            {!isUploading && image && (
                <div className="flex flex-col items-center">
                    <img src={image} alt="Campo" className="w-full max-w-xl object-cover rounded-lg shadow mb-4" />
                    <div className="flex gap-3">
                        <label className="px-4 py-2 bg-primary text-neutral-white rounded-lg cursor-pointer hover:bg-primary/90">
                            Cambiar imagen
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                        <button onClick={handleRemoveImage} className="px-4 py-2 bg-softdanger text-danger rounded-lg hover:bg-red-300">
                            Quitar imagen
                        </button>
                    </div>
                </div>
            )}
            
            {!isUploading && !image && (
                <label className="px-4 py-2 bg-primary text-neutral-white rounded-lg cursor-pointer hover:bg-primary/90">
                    Subir imagen
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={!campoActivoId} />
                </label>
            )}
        </div>
    );
}
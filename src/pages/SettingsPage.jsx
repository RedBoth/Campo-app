import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useToast } from "../context/ToastProvider";
import { getUserProfile, updateUserProfile, resetUserPassword } from "../api/usersApi";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const names = (currentUser.displayName || "").split(" ");
        setNombre(prev => prev || names[0] || ""); 
        setApellido(prev => prev || names.slice(1).join(" ") || "");

        try {
            const userData = await getUserProfile(currentUser.uid);
            if (userData) {
                setNombre(userData.nombre);
                setApellido(userData.apellido);
            }
        } catch (e) {
            console.error(e);
            console.log("No se pudieron cargar datos extendidos");
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !apellido.trim()) {
        showToast("Nombre y apellido son obligatorios", "error");
        return;
    }

    setLoading(true);
    try {
      await updateUserProfile(currentUser, nombre, apellido);
      showToast("Perfil actualizado correctamente", "success");
    } catch (error) {
      console.error(error);
      showToast("Error al actualizar perfil", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
        await resetUserPassword(currentUser.email);
        setResetSent(true);
        showToast("Correo de recuperación enviado", "success");
    } catch (error) {
        console.error(error);
        showToast("Error al enviar correo", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-gray300 overflow-hidden">
        <div className="p-6 border-b border-neutral-gray200 bg-neutral-gray50">
          <h3 className="text-lg font-bold text-neutral-gray900">Información Personal</h3>
          <p className="text-sm text-neutral-gray500">Actualizá tus datos de identificación.</p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full bg-neutral-gray200 border-4 border-white shadow-md flex items-center justify-center overflow-hidden relative group cursor-pointer">
                    {currentUser?.photoURL ? (
                        <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span className="material-icons-outlined text-6xl text-neutral-gray400">person</span>
                    )}
                    
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-icons-outlined text-white">camera_alt</span>
                    </div>
                </div>
                <p className="text-xs text-neutral-gray500 text-center">
                    Para cambiar tu foto, usá un servicio como Gravatar o implementaremos subida pronto.
                </p>
            </div>

            <form onSubmit={handleSaveProfile} className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-gray700 mb-1">Nombre</label>
                        <input 
                            type="text" 
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full p-2 border border-neutral-gray300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-gray700 mb-1">Apellido</label>
                        <input 
                            type="text" 
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            className="w-full p-2 border border-neutral-gray300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-gray700 mb-1">Email</label>
                    <input 
                        type="email" 
                        value={currentUser?.email} 
                        disabled 
                        className="w-full p-2 border border-neutral-gray300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition flex items-center gap-2 disabled:bg-gray-400"
                    >
                        {loading && <LoadingSpinner size="sm" color="border-white"/>}
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-gray300 overflow-hidden">
        <div className="p-6 border-b border-neutral-gray200 bg-neutral-gray50">
          <h3 className="text-lg font-bold text-neutral-gray900 flex items-center gap-2">
            <span className="material-icons-outlined text-neutral-gray500">lock</span> Seguridad
          </h3>
        </div>
        <div className="p-6 flex items-center justify-between">
            <div>
                <p className="font-medium text-neutral-gray900">Contraseña</p>
                <p className="text-sm text-neutral-gray500">Te enviaremos un email para que puedas restablecerla de forma segura.</p>
            </div>
            <button 
                onClick={handlePasswordReset}
                disabled={resetSent}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition
                    ${resetSent 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : "bg-white text-neutral-gray700 border-neutral-gray300 hover:bg-gray-50"
                    }`}
            >
                {resetSent ? "Correo Enviado" : "Cambiar contraseña"}
            </button>
        </div>
      </div>
    </div>
  );
}
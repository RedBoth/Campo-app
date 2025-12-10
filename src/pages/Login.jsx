import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useToast } from "../context/ToastProvider";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import campoImg from "../assets/campo-login.webp";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      setError("Email o contraseña incorrectos");
      showToast("Error al iniciar sesión", "error");
      setLoading(false);
    }
  };

  return (
    // CAMBIO 1: Contenedor principal de dos columnas
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      {/* Columna Estética (oculta en móvil, visible en escritorio) */}
      <div className="hidden lg:flex items-center justify-center bg-neutral-gray300 relative overflow-hidden">
        <img 
          src={campoImg} 
          alt="Campo LotePro" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 z-0" 
        />
        <div className="text-center relative z-10 p-8 bg-neutral-white/30 backdrop-blur-sm rounded-xl border border-neutral-white/20 shadow-lg">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-sm">
            <span className="text-neutral-gray700">Lote</span>
            <span className="text-primary">Pro</span>
          </h1>
          <p className="text-xl text-gray-500 font-semibold drop-shadow-sm">
            Tu gestión de campos, simplificada.
          </p>
        </div>
      </div>

      {/* Columna del Formulario */}
      <div className="flex items-center justify-center relative p-4 bg-neutral-white">
        
        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <LoadingSpinner size="lg" color="border-primary" />
          </div>
        )}

        <div className="w-full max-w-md p-8 sm:p-10 bg-neutral-white rounded-2xl shadow-xl border border-neutral-gray300">
          
          {/* CAMBIO 3: Logo en móvil y encabezado */}
          <h1 className="text-5xl font-extrabold mb-2 text-center lg:hidden">
            <span className="text-neutral-gray700">Lote</span>
            <span className="text-primary">Pro</span>
          </h1>
          <h2 className="text-2xl font-semibold mb-6 text-center text-neutral-gray700">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleLogin}>
            {error && (
              <p className="text-danger text-sm mb-4 p-2 bg-softdanger rounded-lg border border-red-200">
                {error}
              </p>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-gray700 mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="ejemplo@lote.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full p-3 border border-neutral-gray300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-150"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-gray700 mb-1" htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full p-3 border border-neutral-gray300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-150"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              // CAMBIO 4: Botón con color principal y efecto de elevación
              className={`w-full py-3 rounded-lg text-neutral-white font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-md 
                ${
                  loading || !email || !password
                    ? "bg-neutral-gray300 cursor-not-allowed"
                    : "bg-primary hover:bg-secondary active:scale-[0.98] shadow-primary/50"
                }`}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="border-neutral-white" />
                  <span>Entrando...</span>
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
          
          <p className="text-center mt-6 text-neutral-gray700">
            ¿No tenés cuenta?{" "}
            <Link to="/signup" className="text-primary hover:text-secondary font-bold transition duration-150">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
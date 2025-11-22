import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useToast } from "../context/ToastProvider";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(email, password, nombre, apellido);
      navigate("/campos");

    } catch (err) {
      console.error(err);
      let mensajeError = "Error al registrarse.";

      if (err.code === "auth/email-already-in-use") {
        mensajeError = "El email ya está registrado.";
      } else if (err.code === "auth/weak-password") {
        mensajeError = "La contraseña debe tener al menos 6 caracteres.";
      }

      setError(mensajeError);
      showToast(mensajeError, "error");
      setLoading(false);
    }
  };

  const isFormValid = email && password && nombre && apellido;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-gray100">
      <form
        onSubmit={handleRegister}
        className="bg-neutral-white p-6 rounded-xl shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center text-neutral-gray900">
          Crear cuenta
        </h2>

        {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={loading}
            className="w-full p-2 border border-neutral-gray300 rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
          />

          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            disabled={loading}
            className="w-full p-2 border border-neutral-gray300 rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full p-2 border border-neutral-gray300 rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full p-2 border border-neutral-gray300 rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
          />

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className={`w-full py-2 rounded text-neutral-white font-medium flex items-center justify-center gap-2 transition-all
              ${
                loading || !isFormValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-blue-700 shadow-md active:scale-95"
              }`}
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" color="border-white" />
                <span>Registrando...</span>
              </>
            ) : (
              "Registrarse"
            )}
          </button>
        </div>

        <p className="text-sm text-center mt-4 text-neutral-gray700">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Iniciar Sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
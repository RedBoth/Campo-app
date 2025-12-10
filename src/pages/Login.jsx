import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useToast } from "../context/ToastProvider";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import campoImg from "../assets/campo-login.webp";

export default function Login() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const validate = (fieldValues = { email, password }) => {
    let tempErrors = { ...errors };

    if ("email" in fieldValues) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      tempErrors.email = emailRegex.test(fieldValues.email) 
        ? "" 
        : "Formato de email inválido";
      if (fieldValues.email === "") tempErrors.email = "El email es requerido";
    }

    if ("password" in fieldValues) {
      tempErrors.password = fieldValues.password ? "" : "La contraseña es requerida";
    }

    setErrors({ ...tempErrors });

    if (fieldValues === email && fieldValues === password){
        return Object.values(tempErrors).every((x) => x === "");
    }
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "email") setEmail(value);
    if (id === "password") setPassword(value);

    validate({ [id]: value });
  };

  const handleBlur = (e) => {
    const { id } = e.target;
    setTouched({ ...touched, [id]: true });
    if (id === "email") validate({ email });
    if (id === "password") validate({ password });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setGlobalError("");
    
    setTouched({
      email: true,
      password: true
    });

    const formValues = { email, password };
    const isValid = validate(formValues) && Object.values(errors).every(x => x === "");

    if (!isValid) {
      return; 
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      let mensajeError = "Error al iniciar sesión.";
      
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        mensajeError = "Email o contraseña incorrectos.";
      } else if (err.code === "auth/too-many-requests") {
        mensajeError = "Demasiados intentos. Intenta más tarde.";
      }

      setGlobalError(mensajeError);
      showToast(mensajeError, "error");
      setLoading(false);
    }
  };

  const getInputClass = (fieldName) => {
    const hasError = errors[fieldName] && touched[fieldName];
    const baseClass = "w-full p-3 border rounded-lg transition duration-150 focus:outline-none focus:ring-2";
    
    if (hasError) {
        return `${baseClass} border-red-500 bg-red-50 focus:ring-red-500 text-red-900 placeholder-red-300`;
    }
    return `${baseClass} border-neutral-gray300 focus:ring-primary focus:border-primary`;
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
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
          <p className="text-xl text-neutral-gray700 font-semibold drop-shadow-sm">
            Tu gestión de campos, simplificada.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center relative p-4 bg-neutral-white">
        
        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <LoadingSpinner size="lg" color="border-neutral-white" />
          </div>
        )}

        <div className="w-full max-w-md p-8 sm:p-10 bg-neutral-white rounded-2xl shadow-xl border border-neutral-gray300">
          
          <h1 className="text-5xl font-extrabold mb-2 text-center lg:hidden">
            <span className="text-neutral-gray700">Lote</span>
            <span className="text-primary">Pro</span>
          </h1>
          <h2 className="text-2xl font-semibold mb-6 text-center text-neutral-gray700">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleLogin}>
            
            {globalError && (
              <p className="text-danger text-sm mb-4 p-2 bg-softdanger rounded-lg border border-red-200 animate-pulse">
                {globalError}
              </p>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-gray700 mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="ejemplo@lote.com"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                className={getInputClass("email")}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-gray700 mb-1" htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                className={getInputClass("password")}
              />
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-neutral-white font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-md 
                ${
                  loading
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
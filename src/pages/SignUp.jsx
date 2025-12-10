import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useToast } from "../context/ToastProvider";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import campoImg from "../assets/campo-login.webp";

export default function SignUp() {
  const { signup, currentUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const validate = (fieldValues = { nombre, apellido, email, password }) => {
    let tempErrors = { ...errors };

    if ("nombre" in fieldValues)
      tempErrors.nombre = fieldValues.nombre.trim().length >= 2 ? "" : "Mínimo 2 letras";
    
    if ("apellido" in fieldValues)
      tempErrors.apellido = fieldValues.apellido.trim().length >= 2 ? "" : "Mínimo 2 letras";

    if ("email" in fieldValues) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      tempErrors.email = emailRegex.test(fieldValues.email) ? "" : "Formato de email inválido (ej: usuario@mail.com)";
      if(fieldValues.email === "") tempErrors.email = "El email es requerido";
    }

    if ("password" in fieldValues) {
        tempErrors.password = fieldValues.password.length >= 6 ? "" : "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors({
      ...tempErrors
    });

    const isValid = Object.values(tempErrors).every((x) => x === "");
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "nombre") setNombre(value);
    if (name === "apellido") setApellido(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);

    validate({ [name]: value });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setGlobalError("");
    
    setTouched({
        nombre: true,
        apellido: true,
        email: true,
        password: true
    });

    const formValues = { nombre, apellido, email, password };
    
    const isFormValid = validate(formValues); 

    if (!isFormValid) {
      showToast("Por favor corrige los errores en el formulario.", "error");
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, nombre, apellido);
    } catch (err) {
      console.error(err);
      let mensajeError = "Error al registrarse.";

      if (err.code === "auth/email-already-in-use") {
        mensajeError = "El email ya está registrado.";
        setErrors(prev => ({...prev, email: "Este email ya está en uso."}));
      } else if (err.code === "auth/weak-password") {
        mensajeError = "La contraseña es muy débil.";
      } else if (err.code === "auth/invalid-email") {
        mensajeError = "El formato del email no es válido.";
      }

      setGlobalError(mensajeError);
      showToast(mensajeError, "error");
      setLoading(false);
    }
  };

  const isFormValid = 
    nombre.length >= 2 && 
    apellido.length >= 2 && 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && 
    password.length >= 6;

  const getInputClass = (fieldName) => {
    const hasError = errors[fieldName] && touched[fieldName];
    const baseClass = "w-full p-3 border rounded-lg transition duration-150 focus:ring-2 focus:outline-none";
    if (hasError) {
        return `${baseClass} border-red-500 bg-red-50 focus:ring-red-500 text-red-900 placeholder-red-300`;
    }
    return `${baseClass} border-neutral-gray300 focus:ring-primary focus:border-primary`;
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      <div className="flex items-center justify-center p-4 bg-neutral-white relative">
        
        {loading && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <LoadingSpinner size="lg" color="border-primary" /> 
            </div>
        )}

        <div className="w-full max-w-md p-8 bg-neutral-white rounded-2xl shadow-xl border border-neutral-gray100">
          
          <h1 className="text-5xl font-extrabold mb-2 text-center lg:hidden">
            <span className="text-neutral-gray700">Lote</span>
            <span className="text-primary">Pro</span>
          </h1>
          
          <h2 className="text-2xl font-semibold mb-6 text-center text-neutral-gray700">
            Crear cuenta
          </h2>

          {globalError && (
            <div className="bg-red-50 border border-softdanger text-danger px-3 py-2 rounded text-sm mb-4 animate-pulse">
              {globalError}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-gray700 mb-1">Nombre</label>
                    <input
                        name="nombre"
                        type="text"
                        placeholder="Juan"
                        value={nombre}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                        className={getInputClass("nombre")}
                    />
                    {errors.nombre && touched.nombre && (
                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.nombre}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                    <input
                        name="apellido"
                        type="text"
                        placeholder="Pérez"
                        value={apellido}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                        className={getInputClass("apellido")}
                    />
                    {errors.apellido && touched.apellido && (
                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.apellido}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-gray700 mb-1">Email</label>
                <input
                    name="email"
                    type="email"
                    placeholder="juan@ejemplo.com"
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

            <div>
                <label className="block text-sm font-medium text-neutral-gray700 mb-1">Contraseña</label>
                <input
                    name="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
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
              disabled={loading || !isFormValid}
              className={`w-full py-3 mt-2 rounded-lg text-neutral-white font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-md
                ${
                  loading || !isFormValid
                    ? "bg-neutral-gray300 cursor-not-allowed"
                    : "bg-primary hover:bg-secondary active:scale-[0.98] shadow-primary/50"
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
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" className="text-primary hover:text-secondary font-medium hover:underline transition duration-150">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center bg-neutral-gray100 relative overflow-hidden">
        <img 
            src={campoImg} 
            alt="Campo LotePro" 
            className="absolute inset-0 w-full h-full object-cover opacity-90 z-0" 
        />
        <div className="text-center relative z-10 p-8 bg-neutral-white/30 backdrop-blur-sm rounded-xl border border-neutral-white/20 shadow-lg m-12">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-sm">
            <span className="text-neutral-gray700">Únete a </span>
            <span className="text-primary">Lote</span>
            <span className="text-neutral-gray700">Pro</span>
          </h1>
          <p className="text-xl text-neutral-gray700 font-semibold drop-shadow-sm">
            Empieza a gestionar tus lotes de forma inteligente hoy mismo
          </p>
        </div>
      </div>
    </div>
  );
}
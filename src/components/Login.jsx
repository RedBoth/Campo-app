import { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // credenciales "hardcodeadas"
  const USERS = [
    { user: "admin", pass: "1234" },
    { user: "leometal_80", pass: "abcd" }
  ]

  const handleSubmit = (e) => {
    e.preventDefault();

    const found = USERS.find(
      (u) => u.user === username && u.pass === password
    );

    if (found) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", found.user); // guardamos quién entró
      onLogin();
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4">Iniciar Sesión</h2>

        {error && (
          <p className="text-red-600 text-sm mb-2">{error}</p>
        )}

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
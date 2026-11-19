import { useState } from "react";
import { login } from "./api.js";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Ingrese usuario y contraseña.");
      return;
    }
    setCargando(true);
    setError("");
    try {
      const r = await login(username.trim(), password);
      onLogin({ usuario: r.usuario, rol: r.rol });
    } catch (err) {
      setError(err.status === 401 ? "Usuario o contraseña incorrectos." : err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="login">
      <form onSubmit={enviar} className="panel">
        <h1>Taller de Motos</h1>
        <p className="sub">Inicie sesión para administrar los clientes.</p>
        <label>Usuario
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
        </label>
        <label>Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="msg error">{error}</p>}
        <button disabled={cargando}>{cargando ? "Verificando..." : "Ingresar"}</button>
      </form>
    </main>
  );
}

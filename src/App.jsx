import { useState } from "react";
import Login from "./Login.jsx";
import Clientes from "./Clientes.jsx";

export default function App() {
  const [sesion, setSesion] = useState(null); // { usuario, rol }

  if (!sesion) return <Login onLogin={setSesion} />;

  return (
    <>
      <header className="top">
        <h1>Taller de Motos</h1>
        <div>
          <span>{sesion.usuario} ({sesion.rol})</span>
          <button className="ghost" onClick={() => setSesion(null)}>Cerrar sesión</button>
        </div>
      </header>
      <Clientes />
    </>
  );
}

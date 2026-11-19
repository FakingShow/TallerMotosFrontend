import { useState } from "react";
import Login from "./Login.jsx";
import Clientes from "./Clientes.jsx";
import CrudEntidad from "./CrudEntidad.jsx";
import { ENTIDADES } from "./entidades.js";
import "./tabs.css";

const TABS = [
  { id: "clientes", label: "Clientes" },
  { id: "motocicletas", label: "Motocicletas" },
  { id: "reparaciones", label: "Reparaciones" },
  { id: "repuestos", label: "Repuestos" },
];

export default function App() {
  const [sesion, setSesion] = useState(null); // { usuario, rol }
  const [tab, setTab] = useState("clientes");

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
      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className="tab"
            aria-current={tab === t.id ? "page" : undefined}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
      {tab === "clientes" ? <Clientes /> : <CrudEntidad key={tab} config={ENTIDADES[tab]} />}
    </>
  );
}
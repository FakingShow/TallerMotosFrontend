import { Fragment, useEffect, useState } from "react";
import { listar, obtener, crear, actualizar, eliminar } from "./api.js";

// Misma estructura y clases CSS que Clientes.jsx, dirigida por configuración.
export default function CrudEntidad({ config }) {
  const { recurso, singular, plural, fem, etiqueta, campos } = config;
  const Sing = singular[0].toUpperCase() + singular.slice(1);
  const art = fem ? "La" : "El";
  const fin = fem ? "a" : "o";

  const vacio = () =>
    Object.fromEntries(campos.map((c) => [c.name, c.defecto ? c.defecto() : ""]));

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [encontrado, setEncontrado] = useState(null);
  const [msg, setMsg] = useState(null);

  const ok = (texto) => setMsg({ tipo: "ok", texto });
  const fallo = (texto) => setMsg({ tipo: "error", texto });

  async function cargar() {
    try {
      setItems(await listar(recurso));
    } catch (err) {
      fallo(err.message);
    }
  }
  useEffect(() => { cargar(); }, []);

  const mostrar = (c, v) => {
    if (v === null || v === undefined) return "";
    if (c.tipo === "fechahora") {
      const d = new Date(v);
      return isNaN(d) ? String(v) : d.toLocaleString();
    }
    return String(v);
  };

  // Valida y convierte el formulario a los tipos que espera la API
  function construir() {
    const datos = {};
    for (const c of campos) {
      const v = String(form[c.name] ?? "").trim();
      if (!v) return { error: `Complete el campo "${c.label}".` };
      if (c.tipo === "entero") {
        if (!/^-?\d+$/.test(v)) return { error: `"${c.label}" debe ser un número entero.` };
        datos[c.name] = Number(v);
      } else if (c.tipo === "decimal") {
        const n = Number(v.replace(",", "."));
        if (!Number.isFinite(n) || n < 0) return { error: `"${c.label}" debe ser un número válido (0 o mayor).` };
        datos[c.name] = n;
      } else if (c.tipo === "fechahora") {
        datos[c.name] = v.length === 16 ? v + ":00" : v;
      } else {
        datos[c.name] = v;
      }
    }
    return { datos };
  }

  async function buscar(e) {
    e.preventDefault();
    setEncontrado(null);
    if (!/^\d+$/.test(busqueda.trim())) return fallo("Ingrese un identificador numérico.");
    try {
      setEncontrado(await obtener(recurso, busqueda.trim()));
      setMsg(null);
    } catch (err) {
      fallo(err.status === 404 ? `No existe ${fem ? "una" : "un"} ${singular} con el identificador ${busqueda}.` : err.message);
    }
  }

  async function guardar(e) {
    e.preventDefault();
    const { datos, error } = construir();
    if (error) return fallo(error);
    try {
      if (editandoId) {
        await actualizar(recurso, editandoId, datos);
        ok(`${Sing} actualizad${fin} correctamente.`);
      } else {
        await crear(recurso, datos);
        ok(`${Sing} agregad${fin} correctamente.`);
      }
      cancelar();
      setEncontrado(null);
      cargar();
    } catch (err) {
      fallo(err.status === 404 ? `${art} ${singular} ya no existe.` : err.message);
    }
  }

  function editar(r) {
    setEditandoId(r.id);
    setForm(Object.fromEntries(campos.map((c) => [
      c.name,
      c.tipo === "fechahora" ? String(r[c.name] ?? "").slice(0, 16) : String(r[c.name] ?? ""),
    ])));
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelar() {
    setEditandoId(null);
    setForm(vacio());
  }

  async function borrar(r) {
    if (!window.confirm(`¿Eliminar ${fem ? "la" : "el"} ${singular} "${etiqueta(r)}"? Esta acción no se puede deshacer.`)) return;
    try {
      await eliminar(recurso, r.id);
      ok(`${Sing} eliminad${fin} correctamente.`);
      if (editandoId === r.id) cancelar();
      setEncontrado(null);
      cargar();
    } catch (err) {
      fallo(err.status === 404 ? `${art} ${singular} ya no existe.` : err.message);
      cargar();
    }
  }

  const cambio = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });
  const inputType = (c) => (c.tipo === "fechahora" ? "datetime-local" : "text");

  return (
    <main className="grid">
      {msg && <p className={`msg ${msg.tipo} full`}>{msg.texto}</p>}

      <section className="panel">
        <h2>{editandoId ? `Editar ${singular} #${editandoId}` : `Agregar ${singular}`}</h2>
        <form onSubmit={guardar}>
          {campos.map((c) => (
            <label key={c.name}>{c.label}
              <input
                type={inputType(c)}
                inputMode={c.tipo === "entero" ? "numeric" : c.tipo === "decimal" ? "decimal" : undefined}
                value={form[c.name]}
                onChange={cambio(c.name)}
              />
            </label>
          ))}
          <div className="row">
            <button>{editandoId ? "Guardar cambios" : "Agregar"}</button>
            {editandoId && <button type="button" className="ghost" onClick={cancelar}>Cancelar</button>}
          </div>
        </form>
      </section>

      <section className="panel">
        <h2>Consultar por identificador</h2>
        <form onSubmit={buscar} className="row">
          <input placeholder="Ej: 1" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <button>Buscar</button>
        </form>
        {encontrado && (
          <dl className="resultado">
            <dt>ID</dt><dd>{encontrado.id}</dd>
            {campos.map((c) => (
              <Fragment key={c.name}>
                <dt>{c.label}</dt><dd>{mostrar(c, encontrado[c.name])}</dd>
              </Fragment>
            ))}
          </dl>
        )}
      </section>

      <section className="panel full">
        <h2>{plural[0].toUpperCase() + plural.slice(1)} registrad{fin}s</h2>
        {items.length === 0 ? (
          <p className="sub">No hay {plural} registrad{fin}s. Agregue {fem ? "la primera" : "el primero"} con el formulario.</p>
        ) : (
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  {campos.map((c) => <th key={c.name}>{c.label}</th>)}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    {campos.map((c) => <td key={c.name}>{mostrar(c, r[c.name])}</td>)}
                    <td className="acciones">
                      <button className="ghost" onClick={() => editar(r)}>Editar</button>
                      <button className="danger" onClick={() => borrar(r)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
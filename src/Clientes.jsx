import { useEffect, useState } from "react";
import {
  listarClientes, obtenerCliente, crearCliente, actualizarCliente, eliminarCliente,
} from "./api.js";

const VACIO = { nombre: "", telefono: "", correo: "" };

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [encontrado, setEncontrado] = useState(null);
  const [msg, setMsg] = useState(null); // { tipo: "ok" | "error", texto }

  const ok = (texto) => setMsg({ tipo: "ok", texto });
  const fallo = (texto) => setMsg({ tipo: "error", texto });

  async function cargar() {
    try {
      setClientes(await listarClientes());
    } catch (err) {
      fallo(err.message);
    }
  }
  useEffect(() => { cargar(); }, []);

  // ---- Consultar por id ----
  async function buscar(e) {
    e.preventDefault();
    setEncontrado(null);
    if (!/^\d+$/.test(busqueda.trim())) return fallo("Ingrese un identificador numérico.");
    try {
      setEncontrado(await obtenerCliente(busqueda.trim()));
      setMsg(null);
    } catch (err) {
      fallo(err.status === 404 ? `No existe un cliente con el identificador ${busqueda}.` : err.message);
    }
  }

  // ---- Agregar / actualizar ----
  async function guardar(e) {
    e.preventDefault();
    const datos = {
      nombre: form.nombre.trim(), telefono: form.telefono.trim(), correo: form.correo.trim(),
    };
    if (!datos.nombre || !datos.telefono || !datos.correo) return fallo("Complete todos los campos.");
    if (!/^\S+@\S+\.\S+$/.test(datos.correo)) return fallo("El correo no tiene un formato válido.");
    try {
      if (editandoId) {
        await actualizarCliente(editandoId, datos);
        ok("Cliente actualizado correctamente.");
      } else {
        await crearCliente(datos);
        ok("Cliente agregado correctamente.");
      }
      cancelar();
      setEncontrado(null);
      cargar();
    } catch (err) {
      fallo(err.status === 404 ? "El cliente ya no existe." : err.message);
    }
  }

  function editar(c) {
    setEditandoId(c.id);
    setForm({ nombre: c.nombre, telefono: c.telefono, correo: c.correo });
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelar() {
    setEditandoId(null);
    setForm(VACIO);
  }

  // ---- Eliminar ----
  async function borrar(c) {
    if (!window.confirm(`¿Eliminar al cliente "${c.nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await eliminarCliente(c.id);
      ok("Cliente eliminado correctamente.");
      if (editandoId === c.id) cancelar();
      setEncontrado(null);
      cargar();
    } catch (err) {
      fallo(err.status === 404 ? "El cliente ya no existe." : err.message);
      cargar();
    }
  }

  const cambio = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  return (
    <main className="grid">
      {msg && <p className={`msg ${msg.tipo} full`}>{msg.texto}</p>}

      <section className="panel">
        <h2>{editandoId ? `Editar cliente #${editandoId}` : "Agregar cliente"}</h2>
        <form onSubmit={guardar}>
          <label>Nombre <input value={form.nombre} onChange={cambio("nombre")} /></label>
          <label>Teléfono <input value={form.telefono} onChange={cambio("telefono")} /></label>
          <label>Correo <input value={form.correo} onChange={cambio("correo")} /></label>
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
            <dt>Nombre</dt><dd>{encontrado.nombre}</dd>
            <dt>Teléfono</dt><dd>{encontrado.telefono}</dd>
            <dt>Correo</dt><dd>{encontrado.correo}</dd>
          </dl>
        )}
      </section>

      <section className="panel full">
        <h2>Clientes registrados</h2>
        {clientes.length === 0 ? (
          <p className="sub">No hay clientes registrados. Agregue el primero con el formulario.</p>
        ) : (
          <div className="scroll">
            <table>
              <thead>
                <tr><th>ID</th><th>Nombre</th><th>Teléfono</th><th>Correo</th><th></th></tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td><td>{c.nombre}</td><td>{c.telefono}</td><td>{c.correo}</td>
                    <td className="acciones">
                      <button className="ghost" onClick={() => editar(c)}>Editar</button>
                      <button className="danger" onClick={() => borrar(c)}>Eliminar</button>
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

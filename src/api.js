// URL base de la API (se define en .env -> VITE_API_URL)
const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw { status: 0, message: "No se pudo conectar con la API. Verifique la URL o su conexión." };
  }
  if (!res.ok) {
    throw { status: res.status, message: `La API respondió con error ${res.status}.` };
  }
  const text = await res.text(); // PUT devuelve 204 sin cuerpo
  return text ? JSON.parse(text) : null;
}

// POST /api/auth/login  -> 200 { mensaje, usuario, rol } | 401
export const login = (username, password) =>
  request("/api/auth/login", { method: "POST", body: JSON.stringify({ username, password }) });

// Clientes
export const listarClientes = () => request("/api/clientes");
export const obtenerCliente = (id) => request(`/api/clientes/${id}`);
export const crearCliente = (c) => request("/api/clientes", { method: "POST", body: JSON.stringify(c) });
export const actualizarCliente = (id, c) =>
  request(`/api/clientes/${id}`, { method: "PUT", body: JSON.stringify({ id, ...c }) });
export const eliminarCliente = (id) => request(`/api/clientes/${id}`, { method: "DELETE" });

// Genéricas para las demás entidades: recurso = "motocicletas" | "reparaciones" | "repuestos"
export const listar = (recurso) => request(`/api/${recurso}`);
export const obtener = (recurso, id) => request(`/api/${recurso}/${id}`);
export const crear = (recurso, d) => request(`/api/${recurso}`, { method: "POST", body: JSON.stringify(d) });
export const actualizar = (recurso, id, d) =>
  request(`/api/${recurso}/${id}`, { method: "PUT", body: JSON.stringify({ id, ...d }) });
export const eliminar = (recurso, id) => request(`/api/${recurso}/${id}`, { method: "DELETE" });
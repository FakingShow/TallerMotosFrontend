// Configuración de las entidades. Los nombres de recurso y de propiedades
// tipo: texto | entero | decimal | fechahora
const ahora = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm (hora local)
};

export const ENTIDADES = {
  motocicletas: {
    recurso: "motocicletas", singular: "motocicleta", plural: "motocicletas", fem: true,
    etiqueta: (r) => r.placa,
    campos: [
      { name: "placa", label: "Placa", tipo: "texto" },
      { name: "marca", label: "Marca", tipo: "texto" },
      { name: "modelo", label: "Modelo", tipo: "texto" },
      { name: "anio", label: "Año", tipo: "entero" },
      { name: "clienteId", label: "ID del cliente", tipo: "entero" },
    ],
  },
  reparaciones: {
    recurso: "reparaciones", singular: "reparación", plural: "reparaciones", fem: true,
    etiqueta: (r) => r.descripcion,
    campos: [
      { name: "descripcion", label: "Descripción", tipo: "texto" },
      { name: "costo", label: "Costo", tipo: "decimal" },
      { name: "estado", label: "Estado", tipo: "texto", defecto: () => "Pendiente" },
      { name: "fecha", label: "Fecha", tipo: "fechahora", defecto: ahora },
      { name: "motocicletaId", label: "ID de la motocicleta", tipo: "entero" },
    ],
  },
  repuestos: {
    recurso: "repuestos", singular: "repuesto", plural: "repuestos", fem: false,
    etiqueta: (r) => r.nombre,
    campos: [
      { name: "nombre", label: "Nombre", tipo: "texto" },
      { name: "codigo", label: "Código", tipo: "texto" },
      { name: "precio", label: "Precio", tipo: "decimal" },
      { name: "stock", label: "Stock", tipo: "entero" },
    ],
  },
};
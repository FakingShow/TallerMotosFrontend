# Taller de Motos – Cliente React (Proyecto 2)

Aplicación React que consume la API TallerMotosAPI (ASP.NET Core minimal API + SQLite).
Entidad administrada: **Clientes** (`/api/clientes`).

## Ejecutar localmente
1. `npm install`
2. Copie `.env.example` a `.env` y ponga la URL pública de la API en `VITE_API_URL`.
3. `npm run dev` y abra http://localhost:5173

> Requisito: la API debe tener CORS habilitado (ver `CORS_PATCH_API.md`).

## Credenciales de prueba
Usuario `admin` / contraseña `admin123` 
.

## Endpoints usados
| Función | Método y ruta |
|---|---|
| Login | POST /api/auth/login |
| Listar | GET /api/clientes |
| Consultar por id | GET /api/clientes/{id} |
| Agregar | POST /api/clientes |
| Actualizar | PUT /api/clientes/{id} |
| Eliminar | DELETE /api/clientes/{id} |

## Publicar (Netlify / Vercel / Render Static Site)
- Build command: `npm run build` — Publish directory: `dist`
- Variable de entorno: `VITE_API_URL` = URL pública de la API

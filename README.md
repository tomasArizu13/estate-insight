# Estate Insight

Sistema de administración de bienes raíces.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Configuración de Base de Datos

Este proyecto requiere PostgreSQL. Necesitas configurar la variable de entorno `DATABASE_URL`.

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` y configura tu conexión a PostgreSQL:
   ```
   DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_base_datos
   ```

   **Ejemplo para PostgreSQL local:**
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/estate_insight
   ```

3. Asegúrate de que PostgreSQL esté corriendo y que la base de datos exista.

### Ejecutar en Desarrollo

```bash
npm run dev
```

Este comando inicia el servidor en modo desarrollo.

### Otros Comandos Disponibles

- `npm run build` - Construir el proyecto para producción
- `npm run start` - Ejecutar en modo producción
- `npm run check` - Verificar tipos de TypeScript
- `npm run db:push` - Sincronizar esquema de base de datos

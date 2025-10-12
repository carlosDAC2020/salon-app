# ⚡ Inicio Rápido - SalonApp

Guía rápida para poner en marcha el proyecto completo en menos de 10 minutos.

---

## 🎯 Objetivo

Tener el frontend y backend funcionando localmente con datos de prueba.

---

## 📋 Prerrequisitos

Asegúrate de tener instalado:
- ✅ Node.js 18+ ([Descargar](https://nodejs.org/))
- ✅ MongoDB 6+ o cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- ✅ Git

---

## 🚀 Paso 1: Frontend (Angular)

### Ya está listo! ✅

El frontend ya está completamente funcional con datos mock.

```bash
# Instalar dependencias (si no lo has hecho)
npm install

# Iniciar servidor de desarrollo
ng serve
```

**Acceder:** http://localhost:4200

**Credenciales:** Cualquier email/password (datos mock)

---

## 🔧 Paso 2: Backend (Node.js + Express + MongoDB)

### 2.1 Crear Proyecto Backend

```bash
# Ir a la carpeta padre
cd ..

# Crear carpeta del backend
mkdir salon-app-backend
cd salon-app-backend

# Inicializar proyecto
npm init -y
```

### 2.2 Instalar Dependencias

```bash
npm install express mongoose jsonwebtoken bcrypt cors dotenv express-validator helmet morgan cookie-parser

npm install --save-dev nodemon
```

### 2.3 Crear Estructura de Carpetas

```bash
# Windows (PowerShell)
New-Item -ItemType Directory -Path src\config, src\models, src\controllers, src\routes, src\middlewares, src\validators, src\utils

# macOS/Linux
mkdir -p src/{config,models,controllers,routes,middlewares,validators,utils}
```

### 2.4 Configurar Variables de Entorno

Crear archivo `.env` en la raíz:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/salon-app
JWT_SECRET=mi-clave-secreta-super-segura-12345
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=otra-clave-secreta-67890
REFRESH_TOKEN_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:4200
```

**Si usas MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/salon-app?retryWrites=true&w=majority
```

### 2.5 Actualizar package.json

Agregar scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 2.6 Copiar Archivos Base

Ahora necesitas crear los archivos siguiendo la documentación:

**Archivos mínimos para empezar:**
1. `src/config/database.js` - Conexión a MongoDB
2. `src/app.js` - Configuración de Express
3. `server.js` - Punto de entrada

**Ver código completo en:** [docs/BACKEND_SETUP.md](./docs/BACKEND_SETUP.md)

### 2.7 Iniciar Backend

```bash
# Asegúrate de que MongoDB esté corriendo
# Windows: El servicio debería estar activo
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Iniciar servidor
npm run dev
```

**Acceder:** http://localhost:3000

---

## 🔗 Paso 3: Conectar Frontend con Backend

### 3.1 Crear Archivos de Entorno en Angular

**Archivo:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  tokenKey: 'salon_app_token',
  refreshTokenKey: 'salon_app_refresh_token'
};
```

### 3.2 Configurar HttpClient

**Archivo:** `src/app/app.config.ts`

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
```

### 3.3 Crear Interceptor

**Ver código completo en:** [docs/FRONTEND_INTEGRATION.md](./docs/FRONTEND_INTEGRATION.md)

---

## 📚 Documentación Completa

Para implementar el backend completo, sigue estas guías en orden:

### 1. [docs/BACKEND_SETUP.md](./docs/BACKEND_SETUP.md)
Configuración inicial completa del backend

### 2. [docs/BACKEND_MODELS.md](./docs/BACKEND_MODELS.md)
Todos los modelos de Mongoose con validaciones

### 3. [docs/BACKEND_API.md](./docs/BACKEND_API.md)
Endpoints REST completos con ejemplos

### 4. [docs/BACKEND_AUTH.md](./docs/BACKEND_AUTH.md)
Autenticación JWT y seguridad

### 5. [docs/FRONTEND_INTEGRATION.md](./docs/FRONTEND_INTEGRATION.md)
Integración completa Angular + Backend

---

## 🧪 Probar la Aplicación

### Con Datos Mock (Frontend Solo)

1. Iniciar frontend: `ng serve`
2. Ir a http://localhost:4200
3. Login con cualquier email/password
4. Explorar todas las funcionalidades

### Con Backend Real

1. Iniciar backend: `npm run dev` (en salon-app-backend)
2. Iniciar frontend: `ng serve` (en salon-app)
3. Registrar usuario en http://localhost:3000/api/auth/register (Postman)
4. Login en la aplicación Angular
5. Usar funcionalidades reales

---

## 🎯 Próximos Pasos

### Nivel 1: Básico (1-2 días)
- ✅ Configurar backend básico
- ✅ Crear modelos de datos
- ✅ Implementar autenticación

### Nivel 2: Intermedio (3-4 días)
- ✅ Implementar todos los endpoints
- ✅ Agregar validaciones
- ✅ Conectar frontend con backend

### Nivel 3: Avanzado (5-7 días)
- ✅ Agregar tests
- ✅ Optimizar consultas
- ✅ Implementar caché
- ✅ Preparar para producción

---

## 🐛 Problemas Comunes

### Frontend no se conecta al backend

**Solución:**
1. Verifica que el backend esté corriendo en puerto 3000
2. Verifica CORS en `src/config/corsOptions.js`
3. Revisa la consola del navegador

### MongoDB no conecta

**Solución:**
1. Verifica que MongoDB esté corriendo: `mongosh`
2. Verifica la URL en `.env`
3. Si usas Atlas, verifica whitelist de IPs

### Error: Cannot find module

**Solución:**
```bash
npm install
```

---

## 📞 Recursos

- **Documentación completa:** [docs/README.md](./docs/README.md)
- **Código del frontend:** Este repositorio
- **Ejemplos de API:** [docs/BACKEND_API.md](./docs/BACKEND_API.md)

---

## ✅ Checklist Rápido

- [ ] Node.js instalado
- [ ] MongoDB configurado
- [ ] Frontend corriendo (ng serve)
- [ ] Backend creado
- [ ] Dependencias instaladas
- [ ] Variables de entorno configuradas
- [ ] Backend corriendo (npm run dev)
- [ ] Probado en Postman
- [ ] Frontend conectado al backend

---

**¡Listo para empezar!** 🚀

Si tienes dudas, revisa la [documentación completa](./docs/README.md).

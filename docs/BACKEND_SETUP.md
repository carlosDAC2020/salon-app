# 🛠️ Configuración Inicial del Backend - SalonApp

Esta guía te llevará paso a paso para configurar el backend completo del sistema SalonApp usando Node.js, Express y MongoDB.

---

## 📋 Tabla de Contenidos

1. [Prerrequisitos](#prerrequisitos)
2. [Instalación de Herramientas](#instalación-de-herramientas)
3. [Crear Proyecto Backend](#crear-proyecto-backend)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Configuración de Dependencias](#configuración-de-dependencias)
6. [Variables de Entorno](#variables-de-entorno)
7. [Configuración de Base de Datos](#configuración-de-base-de-datos)
8. [Servidor Principal](#servidor-principal)
9. [Probar el Backend](#probar-el-backend)

---

## 🔧 Prerrequisitos

### Software Necesario

- **Node.js** v18 o superior ([Descargar](https://nodejs.org/))
- **npm** v9 o superior (incluido con Node.js)
- **MongoDB** v6 o superior
- **Git** para control de versiones
- **Postman** o **Insomnia** para probar APIs (opcional pero recomendado)
- **MongoDB Compass** para visualizar la base de datos (opcional)

### Verificar Instalaciones

```bash
# Verificar Node.js
node --version
# Debe mostrar: v18.x.x o superior

# Verificar npm
npm --version
# Debe mostrar: 9.x.x o superior

# Verificar MongoDB (si está instalado localmente)
mongod --version
# Debe mostrar: db version v6.x.x o superior
```

---

## 📥 Instalación de Herramientas

### Opción 1: MongoDB Local

#### Windows

1. Descargar MongoDB Community Server desde [mongodb.com](https://www.mongodb.com/try/download/community)
2. Ejecutar el instalador
3. Seleccionar "Complete" installation
4. Marcar "Install MongoDB as a Service"
5. Verificar instalación:

```bash
mongod --version
```

#### macOS (usando Homebrew)

```bash
# Instalar MongoDB
brew tap mongodb/brew
brew install mongodb-community@6.0

# Iniciar MongoDB
brew services start mongodb-community@6.0

# Verificar
mongosh
```

#### Linux (Ubuntu/Debian)

```bash
# Importar clave pública
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Crear archivo de lista
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Actualizar e instalar
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar servicio
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Opción 2: MongoDB Atlas (Cloud - Recomendado para principiantes)

1. Crear cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster gratuito (M0)
3. Configurar usuario de base de datos
4. Whitelist tu IP (o permitir acceso desde cualquier lugar: 0.0.0.0/0)
5. Obtener connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/salon-app?retryWrites=true&w=majority
   ```

---

## 🚀 Crear Proyecto Backend

### Paso 1: Crear Directorio del Proyecto

```bash
# Navegar a tu carpeta de proyectos
cd C:\Users\Carlos Agamez\Documents\CA_dev

# Crear carpeta del backend
mkdir salon-app-backend
cd salon-app-backend
```

### Paso 2: Inicializar Proyecto Node.js

```bash
npm init -y
```

Esto creará un archivo `package.json` básico.

### Paso 3: Instalar Dependencias Principales

```bash
# Dependencias de producción
npm install express mongoose jsonwebtoken bcrypt cors dotenv express-validator helmet morgan cookie-parser

# Dependencias de desarrollo
npm install --save-dev nodemon
```

#### Explicación de Dependencias

| Paquete | Propósito |
|---------|-----------|
| `express` | Framework web para Node.js |
| `mongoose` | ODM para MongoDB |
| `jsonwebtoken` | Crear y verificar tokens JWT |
| `bcrypt` | Encriptar contraseñas |
| `cors` | Permitir peticiones desde el frontend |
| `dotenv` | Cargar variables de entorno |
| `express-validator` | Validar datos de entrada |
| `helmet` | Seguridad HTTP headers |
| `morgan` | Logger de peticiones HTTP |
| `cookie-parser` | Parsear cookies |
| `nodemon` | Auto-reiniciar servidor en desarrollo |

---

## 📁 Estructura de Carpetas

### Crear Estructura Completa

```bash
# Crear todas las carpetas necesarias
mkdir src
cd src
mkdir config models controllers routes middlewares validators utils
cd ..
```

### Estructura Final

```
salon-app-backend/
├── src/
│   ├── config/              # Configuraciones
│   │   ├── database.js
│   │   ├── jwt.js
│   │   └── corsOptions.js
│   │
│   ├── models/              # Modelos de Mongoose
│   │   ├── User.js
│   │   ├── Client.js
│   │   ├── Employee.js
│   │   ├── Service.js
│   │   └── Appointment.js
│   │
│   ├── controllers/         # Lógica de negocio
│   │   ├── authController.js
│   │   ├── clientsController.js
│   │   ├── employeesController.js
│   │   ├── servicesController.js
│   │   ├── appointmentsController.js
│   │   └── dashboardController.js
│   │
│   ├── routes/              # Rutas de la API
│   │   ├── auth.routes.js
│   │   ├── clients.routes.js
│   │   ├── employees.routes.js
│   │   ├── services.routes.js
│   │   ├── appointments.routes.js
│   │   └── dashboard.routes.js
│   │
│   ├── middlewares/         # Middlewares personalizados
│   │   ├── auth.middleware.js
│   │   ├── errorHandler.middleware.js
│   │   └── validation.middleware.js
│   │
│   ├── validators/          # Validaciones con express-validator
│   │   ├── authValidator.js
│   │   ├── clientValidator.js
│   │   ├── employeeValidator.js
│   │   ├── serviceValidator.js
│   │   └── appointmentValidator.js
│   │
│   ├── utils/               # Funciones utilitarias
│   │   ├── responseHandler.js
│   │   └── dateUtils.js
│   │
│   └── app.js               # Configuración de Express
│
├── .env                     # Variables de entorno (NO subir a Git)
├── .env.example            # Ejemplo de variables de entorno
├── .gitignore              # Archivos a ignorar en Git
├── package.json            # Dependencias y scripts
├── server.js               # Punto de entrada
└── README.md               # Documentación del backend
```

---

## ⚙️ Configuración de Dependencias

### Actualizar package.json

Edita el archivo `package.json` y agrega los scripts:

```json
{
  "name": "salon-app-backend",
  "version": "1.0.0",
  "description": "Backend API para SalonApp - Sistema de gestión de salones de belleza",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["salon", "api", "backend", "express", "mongodb"],
  "author": "Carlos Agamez",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.6.0",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "cookie-parser": "^1.4.6"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

## 🔐 Variables de Entorno

### Crear archivo .env

Crea el archivo `.env` en la raíz del proyecto:

```env
# ========================================
# CONFIGURACIÓN DEL SERVIDOR
# ========================================
NODE_ENV=development
PORT=3000

# ========================================
# CONFIGURACIÓN DE BASE DE DATOS
# ========================================
# Opción 1: MongoDB Local
MONGODB_URI=mongodb://localhost:27017/salon-app

# Opción 2: MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/salon-app?retryWrites=true&w=majority

# ========================================
# CONFIGURACIÓN DE JWT
# ========================================
JWT_SECRET=tu-clave-secreta-super-segura-cambiala-en-produccion-12345
JWT_EXPIRES_IN=24h

REFRESH_TOKEN_SECRET=otra-clave-secreta-diferente-para-refresh-token-67890
REFRESH_TOKEN_EXPIRES_IN=7d

# ========================================
# CONFIGURACIÓN DE CORS
# ========================================
FRONTEND_URL=http://localhost:4200

# ========================================
# CONFIGURACIÓN DE EMAIL (Opcional)
# ========================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-password-de-aplicacion

# ========================================
# CLOUDINARY (Opcional - para subir imágenes)
# ========================================
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
```

### Crear archivo .env.example

Crea `.env.example` (este SÍ se sube a Git):

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/salon-app
JWT_SECRET=change-this-secret-key
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=change-this-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:4200
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Crear archivo .gitignore

```
# Dependencias
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Variables de entorno
.env
.env.local
.env.production

# Logs
logs/
*.log

# Sistema operativo
.DS_Store
Thumbs.db

# IDEs
.vscode/
.idea/
*.swp
*.swo

# Archivos temporales
temp/
tmp/
*.tmp

# Coverage
coverage/
.nyc_output/
```

---

## 🗄️ Configuración de Base de Datos

### Crear src/config/database.js

```javascript
const mongoose = require('mongoose');

/**
 * Conectar a MongoDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    
    // Eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB desconectado');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
    });

    // Cerrar conexión cuando la app se cierra
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 MongoDB conexión cerrada por terminación de la app');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error al conectar MongoDB:', error.message);
    process.exit(1); // Salir con error
  }
};

module.exports = connectDB;
```

### Crear src/config/jwt.js

```javascript
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

/**
 * Generar Access Token
 * @param {string} userId - ID del usuario
 * @param {string} role - Rol del usuario
 * @returns {string} Token JWT
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { 
      userId, 
      role,
      type: 'access'
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Generar Refresh Token
 * @param {string} userId - ID del usuario
 * @returns {string} Refresh Token JWT
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { 
      userId,
      type: 'refresh'
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
};

/**
 * Verificar Access Token
 * @param {string} token - Token a verificar
 * @returns {object|null} Payload del token o null si es inválido
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Verificar Refresh Token
 * @param {string} token - Refresh token a verificar
 * @returns {object|null} Payload del token o null si es inválido
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  JWT_SECRET,
  REFRESH_TOKEN_SECRET
};
```

### Crear src/config/corsOptions.js

```javascript
/**
 * Configuración de CORS
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de orígenes permitidos
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:4200',
      'http://localhost:4200',
      'http://127.0.0.1:4200',
      'http://localhost:3000', // Para pruebas con Postman
    ];

    // Permitir requests sin origin (como Postman, apps móviles)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true, // Permitir cookies
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

module.exports = corsOptions;
```

---

## 🖥️ Servidor Principal

### Crear src/app.js

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');

// Crear aplicación Express
const app = express();

// ========================================
// MIDDLEWARES GLOBALES
// ========================================

// Seguridad HTTP headers
app.use(helmet());

// CORS
app.use(cors(corsOptions));

// Logger de peticiones (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Parsear JSON
app.use(express.json());

// Parsear URL-encoded
app.use(express.urlencoded({ extended: true }));

// Parsear cookies
app.use(cookieParser());

// ========================================
// RUTAS
// ========================================

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SalonApp API - Backend funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      clients: '/api/clients',
      employees: '/api/employees',
      services: '/api/services',
      appointments: '/api/appointments',
      dashboard: '/api/dashboard'
    }
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Importar rutas (se crearán después)
// const authRoutes = require('./routes/auth.routes');
// const clientsRoutes = require('./routes/clients.routes');
// const employeesRoutes = require('./routes/employees.routes');
// const servicesRoutes = require('./routes/services.routes');
// const appointmentsRoutes = require('./routes/appointments.routes');
// const dashboardRoutes = require('./routes/dashboard.routes');

// Usar rutas
// app.use('/api/auth', authRoutes);
// app.use('/api/clients', clientsRoutes);
// app.use('/api/employees', employeesRoutes);
// app.use('/api/services', servicesRoutes);
// app.use('/api/appointments', appointmentsRoutes);
// app.use('/api/dashboard', dashboardRoutes);

// ========================================
// MANEJO DE ERRORES
// ========================================

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
```

### Crear server.js

```javascript
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

// Puerto del servidor
const PORT = process.env.PORT || 3000;

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('========================================');
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}/api`);
      console.log('========================================');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();
```

---

## ✅ Probar el Backend

### Paso 1: Iniciar MongoDB

#### Si usas MongoDB Local:

```bash
# Windows (si no está como servicio)
mongod

# macOS/Linux
sudo systemctl start mongod
```

#### Si usas MongoDB Atlas:
No necesitas hacer nada, ya está en la nube.

### Paso 2: Iniciar el Servidor

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

Deberías ver algo como:

```
✅ MongoDB Conectado: localhost
📊 Base de datos: salon-app
========================================
🚀 Servidor corriendo en puerto 3000
🌍 Entorno: development
📍 URL: http://localhost:3000
📍 API: http://localhost:3000/api
========================================
```

### Paso 3: Probar con el Navegador

Abre tu navegador y ve a:
- http://localhost:3000/
- http://localhost:3000/health

Deberías ver respuestas JSON.

### Paso 4: Probar con Postman

1. Abre Postman
2. Crea una nueva petición GET
3. URL: `http://localhost:3000/`
4. Enviar

Deberías recibir:

```json
{
  "success": true,
  "message": "SalonApp API - Backend funcionando correctamente",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "clients": "/api/clients",
    "employees": "/api/employees",
    "services": "/api/services",
    "appointments": "/api/appointments",
    "dashboard": "/api/dashboard"
  }
}
```

---

## 🎉 ¡Configuración Completa!

Has completado la configuración inicial del backend. Ahora puedes continuar con:

1. **[BACKEND_MODELS.md](./BACKEND_MODELS.md)** - Crear los modelos de datos
2. **[BACKEND_API.md](./BACKEND_API.md)** - Implementar los endpoints
3. **[BACKEND_AUTH.md](./BACKEND_AUTH.md)** - Agregar autenticación

---

## 🐛 Solución de Problemas

### Error: Cannot find module 'dotenv'

```bash
npm install dotenv
```

### Error: EADDRINUSE (Puerto en uso)

Cambia el puerto en `.env`:
```env
PORT=3001
```

### Error de conexión a MongoDB

- Verifica que MongoDB esté corriendo
- Verifica la URL de conexión en `.env`
- Si usas Atlas, verifica que tu IP esté en la whitelist

### Error: JWT_SECRET is undefined

Verifica que el archivo `.env` esté en la raíz del proyecto y que contenga `JWT_SECRET`.

---

**¡Listo para continuar con los modelos de datos!** 🚀

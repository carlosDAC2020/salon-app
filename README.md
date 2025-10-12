# SalonApp - Sistema de Gestión para Salones de Belleza

Sistema completo de gestión para salones de belleza desarrollado con **Angular 20**. Incluye administración de citas, clientes, empleados, servicios y reportes en tiempo real.

---

## Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Documentación del Backend](#documentación-del-backend)
- [Integración Frontend-Backend](#integración-frontend-backend)

---

## Características

- **Autenticación** - Login/Logout con gestión de sesiones
- **Dashboard** - Estadísticas en tiempo real, gráficos de ingresos
- **Gestión de Citas** - CRUD completo con 6 estados
- **Gestión de Clientes** - Registro, historial, preferencias
- **Gestión de Empleados** - Perfiles, especialidades, horarios
- **Gestión de Servicios** - Categorías, precios, duración
- **Reportes** - Análisis de servicios y clientes

---

## Instalación

### Prerrequisitos

- Node.js 18+
- npm 9+
- Angular CLI 20.3.4

### Pasos

```bash
# 1. Clonar repositorio
git clone <url-del-repositorio>
cd salon-app

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
ng serve
```

La aplicación estará en: **http://localhost:4200/**

### Compilar para Producción

```bash
ng build
```

---

## Arquitectura del Proyecto

```
src/app/
├── core/                    # Núcleo de la aplicación
│   ├── models/             # Interfaces TypeScript
│   ├── services/           # Servicios de datos
│   └── guards/             # Guards de autenticación
│
├── features/               # Módulos de funcionalidades
│   ├── auth/              # Autenticación
│   ├── dashboard/         # Panel principal
│   ├── citas/            # Gestión de citas
│   ├── clients/          # Gestión de clientes
│   ├── employees/        # Gestión de empleados
│   ├── services/         # Gestión de servicios
│   └── reports/          # Reportes
│
└── shared/                # Componentes compartidos
```

---

## Documentación del Backend

Para implementar el backend completo, consulta estas guías detalladas:

### Guías Disponibles

1. **[docs/BACKEND_SETUP.md](./docs/BACKEND_SETUP.md)** 
   - Configuración inicial (Node.js, Express, MongoDB)
   - Estructura de carpetas
   - Variables de entorno

2. **[docs/BACKEND_MODELS.md](./docs/BACKEND_MODELS.md)**
   - Modelos de datos completos (Mongoose)
   - Validaciones y relaciones
   - Índices de base de datos

3. **[docs/BACKEND_API.md](./docs/BACKEND_API.md)**
   - Endpoints REST completos
   - Controladores con lógica de negocio
   - Ejemplos de Request/Response

4. **[docs/BACKEND_AUTH.md](./docs/BACKEND_AUTH.md)**
   - Implementación de JWT
   - Middlewares de autenticación
   - Roles y permisos

5. **[docs/FRONTEND_INTEGRATION.md](./docs/FRONTEND_INTEGRATION.md)**
   - Integración completa Angular + Backend
   - HttpClient y servicios
   - Interceptors y Guards

---

## Integración Frontend-Backend

### Inicio Rápido del Backend

```bash
# Crear proyecto backend
mkdir salon-app-backend
cd salon-app-backend

# Inicializar
npm init -y

# Instalar dependencias
npm install express mongoose jsonwebtoken bcrypt cors dotenv express-validator

# Ver guía completa en docs/BACKEND_SETUP.md
```

### Configurar Angular para API

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

**Ver guía completa:** [docs/FRONTEND_INTEGRATION.md](./docs/FRONTEND_INTEGRATION.md)

---

## Estado del Proyecto

- **Frontend:** Completamente funcional con datos mock
- **Backend:** Por implementar (ver `/docs`)
- **Integración:** Requiere actualizar servicios

### Próximos Pasos

1. Implementar backend → [BACKEND_SETUP.md](./docs/BACKEND_SETUP.md)
2. Crear modelos → [BACKEND_MODELS.md](./docs/BACKEND_MODELS.md)
3. Desarrollar API → [BACKEND_API.md](./docs/BACKEND_API.md)
4. Integrar frontend → [FRONTEND_INTEGRATION.md](./docs/FRONTEND_INTEGRATION.md)

---

## Licencia

MIT License

---

**Desarrollado con ❤️ por Carlos Agamez**
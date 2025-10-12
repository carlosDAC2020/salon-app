# 📚 Documentación Completa del Backend - SalonApp

Bienvenido a la documentación completa para implementar el backend de SalonApp.

---

## 🎯 Objetivo

Esta documentación te guiará paso a paso para crear un backend completo con Node.js, Express y MongoDB que se integre perfectamente con el frontend Angular de SalonApp.

---

## 📖 Guías Disponibles

### 1️⃣ [BACKEND_SETUP.md](./BACKEND_SETUP.md)
**Configuración Inicial del Backend**

Aprenderás a:
- ✅ Instalar Node.js, MongoDB y dependencias
- ✅ Crear la estructura de carpetas del proyecto
- ✅ Configurar variables de entorno
- ✅ Conectar a MongoDB (local o Atlas)
- ✅ Configurar Express y middlewares
- ✅ Crear el servidor principal

**Tiempo estimado:** 30-45 minutos

---

### 2️⃣ [BACKEND_MODELS.md](./BACKEND_MODELS.md)
**Modelos de Datos con Mongoose**

Aprenderás a:
- ✅ Crear modelo User (usuarios del sistema)
- ✅ Crear modelo Client (clientes del salón)
- ✅ Crear modelo Employee (empleados)
- ✅ Crear modelo Service (servicios)
- ✅ Crear modelo Appointment (citas)
- ✅ Implementar validaciones y relaciones
- ✅ Crear índices para optimización

**Tiempo estimado:** 1-2 horas

---

### 3️⃣ [BACKEND_API.md](./BACKEND_API.md)
**Endpoints y Controladores**

Aprenderás a:
- ✅ Crear controladores con lógica de negocio
- ✅ Implementar endpoints REST completos
- ✅ Manejar peticiones y respuestas
- ✅ Implementar paginación
- ✅ Crear validadores con express-validator
- ✅ Documentar la API

**Tiempo estimado:** 2-3 horas

---

### 4️⃣ [BACKEND_AUTH.md](./BACKEND_AUTH.md)
**Autenticación y Seguridad**

Aprenderás a:
- ✅ Implementar autenticación con JWT
- ✅ Crear middleware de autenticación
- ✅ Implementar refresh tokens
- ✅ Crear sistema de roles (admin, manager, employee)
- ✅ Implementar recuperación de contraseña
- ✅ Agregar seguridad con Helmet y Rate Limiting

**Tiempo estimado:** 1-2 horas

---

### 5️⃣ [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)
**Integración Frontend-Backend**

Aprenderás a:
- ✅ Configurar HttpClient en Angular
- ✅ Crear interceptores HTTP
- ✅ Implementar servicio de autenticación
- ✅ Crear guards de rutas
- ✅ Actualizar servicios para usar la API
- ✅ Manejar errores correctamente
- ✅ Probar la integración completa

**Tiempo estimado:** 2-3 horas

---

## 🚀 Ruta de Aprendizaje Recomendada

### Fase 1: Fundamentos (Día 1)
1. Leer [BACKEND_SETUP.md](./BACKEND_SETUP.md)
2. Configurar el proyecto backend
3. Conectar a MongoDB
4. Probar que el servidor funcione

### Fase 2: Base de Datos (Día 2)
1. Leer [BACKEND_MODELS.md](./BACKEND_MODELS.md)
2. Crear todos los modelos
3. Probar conexiones y validaciones
4. Insertar datos de prueba

### Fase 3: API REST (Día 3-4)
1. Leer [BACKEND_API.md](./BACKEND_API.md)
2. Crear controladores
3. Implementar rutas
4. Probar endpoints con Postman

### Fase 4: Seguridad (Día 5)
1. Leer [BACKEND_AUTH.md](./BACKEND_AUTH.md)
2. Implementar autenticación JWT
3. Crear middlewares de autorización
4. Probar flujo de login/logout

### Fase 5: Integración (Día 6-7)
1. Leer [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)
2. Configurar Angular para usar la API
3. Actualizar servicios
4. Probar aplicación completa

---

## 📋 Requisitos Previos

### Conocimientos
- JavaScript básico/intermedio
- Node.js básico
- Conceptos de APIs REST
- MongoDB básico (opcional)
- Angular básico (para la integración)

### Software
- Node.js 18+
- MongoDB 6+ (local o Atlas)
- Visual Studio Code
- Postman o Insomnia
- Git

---

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcrypt** - Encriptación de contraseñas

### Frontend
- **Angular 20** - Framework frontend
- **TypeScript** - Lenguaje
- **RxJS** - Programación reactiva

---

## 📁 Estructura Final del Proyecto

```
salon-app-backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── jwt.js
│   │   └── corsOptions.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Client.js
│   │   ├── Employee.js
│   │   ├── Service.js
│   │   └── Appointment.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── clientsController.js
│   │   ├── employeesController.js
│   │   ├── servicesController.js
│   │   ├── appointmentsController.js
│   │   └── dashboardController.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── clients.routes.js
│   │   ├── employees.routes.js
│   │   ├── services.routes.js
│   │   ├── appointments.routes.js
│   │   └── dashboard.routes.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── errorHandler.middleware.js
│   │   └── validation.middleware.js
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── clientValidator.js
│   │   ├── employeeValidator.js
│   │   ├── serviceValidator.js
│   │   └── appointmentValidator.js
│   ├── utils/
│   │   ├── responseHandler.js
│   │   └── dateUtils.js
│   └── app.js
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md
```

---

## 🎓 Recursos Adicionales

### Documentación Oficial
- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [Mongoose Docs](https://mongoosejs.com/docs/guide.html)
- [JWT.io](https://jwt.io/introduction)

### Tutoriales Recomendados
- [REST API Best Practices](https://restfulapi.net/)
- [MongoDB University](https://university.mongodb.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🐛 Solución de Problemas Comunes

### Error: Cannot find module
```bash
npm install
```

### Error: MongoDB connection failed
- Verifica que MongoDB esté corriendo
- Verifica la URL de conexión en `.env`
- Si usas Atlas, verifica la whitelist de IPs

### Error: Port already in use
Cambia el puerto en `.env`:
```env
PORT=3001
```

### Error: JWT_SECRET is undefined
Verifica que el archivo `.env` exista y contenga `JWT_SECRET`

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa la documentación específica
2. Verifica los logs del servidor
3. Usa Postman para probar endpoints
4. Revisa la consola del navegador (frontend)

---

## ✅ Checklist Completo

### Backend Setup
- [ ] Node.js instalado
- [ ] MongoDB configurado
- [ ] Proyecto inicializado
- [ ] Dependencias instaladas
- [ ] Variables de entorno configuradas
- [ ] Servidor corriendo

### Modelos
- [ ] Modelo User creado
- [ ] Modelo Client creado
- [ ] Modelo Employee creado
- [ ] Modelo Service creado
- [ ] Modelo Appointment creado
- [ ] Validaciones implementadas

### API
- [ ] Controladores creados
- [ ] Rutas configuradas
- [ ] Validadores implementados
- [ ] Endpoints probados con Postman

### Autenticación
- [ ] JWT configurado
- [ ] Middleware de auth creado
- [ ] Login/Register funcionando
- [ ] Refresh token implementado
- [ ] Roles configurados

### Integración
- [ ] HttpClient configurado en Angular
- [ ] Interceptores creados
- [ ] Servicio de auth actualizado
- [ ] Guards implementados
- [ ] Servicios actualizados
- [ ] Aplicación funcionando end-to-end

---

## 🎉 ¡Comienza Ahora!

Empieza con **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** y sigue las guías en orden.

**¡Éxito en tu proyecto!** 🚀

---

**Desarrollado con ❤️ para SalonApp**

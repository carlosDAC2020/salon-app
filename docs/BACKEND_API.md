# 🔌 API REST Endpoints - SalonApp Backend

Documentación completa de todos los endpoints de la API REST.

---

## 📋 Base URL

```
http://localhost:3000/api
```

---

## 🔐 1. Autenticación (`/api/auth`)

### POST /api/auth/register
Registrar nuevo usuario del sistema.

**Request Body:**
```json
{
  "email": "admin@salon.com",
  "password": "password123",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "admin@salon.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Usuario registrado exitosamente"
}
```

### POST /api/auth/login
Iniciar sesión.

**Request Body:**
```json
{
  "email": "admin@salon.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "admin@salon.com",
      "fullName": "Admin User",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login exitoso"
}
```

### GET /api/auth/me
Obtener usuario actual (requiere autenticación).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@salon.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin",
    "lastLogin": "2024-10-12T17:49:12.000Z"
  }
}
```

---

## 👥 2. Clientes (`/api/clients`)

### GET /api/clients
Obtener todos los clientes.

**Query Params:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Límite por página (default: 10)
- `isActive` (opcional): Filtrar por estado (true/false)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "clients": [
      {
        "id": "507f1f77bcf86cd799439011",
        "firstName": "María",
        "lastName": "García",
        "email": "maria@email.com",
        "phone": "3001234567",
        "isActive": true,
        "totalVisits": 15,
        "totalSpent": 450000
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 5,
      "limit": 10
    }
  }
}
```

### GET /api/clients/:id
Obtener cliente por ID.

### POST /api/clients
Crear nuevo cliente.

**Request Body:**
```json
{
  "firstName": "María",
  "lastName": "García",
  "email": "maria@email.com",
  "phone": "3001234567",
  "birthDate": "1990-05-15",
  "address": "Calle 123 #45-67",
  "notes": "Cliente VIP"
}
```

### PUT /api/clients/:id
Actualizar cliente.

### DELETE /api/clients/:id
Eliminar cliente.

### GET /api/clients/search?q=term
Buscar clientes por nombre, email o teléfono.

---

## 👨‍💼 3. Empleados (`/api/employees`)

### GET /api/employees
Obtener todos los empleados.

### GET /api/employees/:id
Obtener empleado por ID.

### POST /api/employees
Crear nuevo empleado (solo admin).

**Request Body:**
```json
{
  "firstName": "Carlos",
  "lastName": "Ramírez",
  "email": "carlos@salon.com",
  "phone": "3009876543",
  "position": "Estilista Senior",
  "specialties": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
  "hireDate": "2022-01-15",
  "schedule": {
    "monday": { "isWorking": true, "startTime": "09:00", "endTime": "18:00" },
    "tuesday": { "isWorking": true, "startTime": "09:00", "endTime": "18:00" }
  }
}
```

### PUT /api/employees/:id
Actualizar empleado.

### GET /api/employees/:id/availability?date=2024-10-12
Verificar disponibilidad de un empleado en una fecha.

---

## 💼 4. Servicios (`/api/services`)

### GET /api/services
Obtener todos los servicios.

### GET /api/services/categories
Obtener categorías de servicios.

**Response (200):**
```json
{
  "success": true,
  "data": ["Cabello", "Uñas", "Facial", "Maquillaje", "Masajes", "Otros"]
}
```

### GET /api/services/category/:category
Obtener servicios por categoría.

### POST /api/services
Crear nuevo servicio (solo admin).

**Request Body:**
```json
{
  "name": "Corte de Cabello",
  "description": "Corte profesional con estilo personalizado",
  "duration": 30,
  "price": 25000,
  "category": "Cabello"
}
```

---

## 📅 5. Citas (`/api/appointments`)

### GET /api/appointments
Obtener todas las citas.

**Query Params:**
- `date`: Filtrar por fecha (YYYY-MM-DD)
- `status`: Filtrar por estado
- `clientId`: Filtrar por cliente
- `employeeId`: Filtrar por empleado

### GET /api/appointments/today
Obtener citas de hoy.

### GET /api/appointments/upcoming
Obtener próximas citas.

### POST /api/appointments
Crear nueva cita.

**Request Body:**
```json
{
  "clientId": "507f1f77bcf86cd799439011",
  "employeeId": "507f1f77bcf86cd799439012",
  "serviceId": "507f1f77bcf86cd799439013",
  "date": "2024-10-15",
  "startTime": "10:00",
  "endTime": "10:30",
  "notes": "Primera visita"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "client": {
      "id": "507f1f77bcf86cd799439011",
      "fullName": "María García"
    },
    "employee": {
      "id": "507f1f77bcf86cd799439012",
      "fullName": "Carlos Ramírez"
    },
    "service": {
      "id": "507f1f77bcf86cd799439013",
      "name": "Corte de Cabello",
      "price": 25000
    },
    "date": "2024-10-15T00:00:00.000Z",
    "startTime": "10:00",
    "endTime": "10:30",
    "status": "pending",
    "price": 25000
  },
  "message": "Cita creada exitosamente"
}
```

### PATCH /api/appointments/:id/status
Actualizar estado de la cita.

**Request Body:**
```json
{
  "status": "confirmed"
}
```

### POST /api/appointments/check-availability
Verificar disponibilidad antes de crear cita.

**Request Body:**
```json
{
  "employeeId": "507f1f77bcf86cd799439012",
  "date": "2024-10-15",
  "startTime": "10:00",
  "endTime": "10:30"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "available": true
  }
}
```

---

## 📊 6. Dashboard (`/api/dashboard`)

### GET /api/dashboard/stats
Obtener estadísticas generales.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "todayAppointments": 12,
    "todayRevenue": 450000,
    "monthRevenue": 5600000,
    "activeClients": 156,
    "pendingAppointments": 8,
    "completedToday": 7
  }
}
```

### GET /api/dashboard/revenue?days=7
Obtener ingresos de los últimos N días.

### GET /api/dashboard/top-services?limit=5
Obtener servicios más populares.

### GET /api/dashboard/top-clients?limit=10
Obtener mejores clientes.

---

## 🔒 Autenticación

Todas las rutas excepto `/api/auth/login` y `/api/auth/register` requieren autenticación.

**Header requerido:**
```
Authorization: Bearer <token>
```

**Roles:**
- `admin`: Acceso completo
- `manager`: Acceso a lectura y escritura
- `employee`: Acceso limitado

---

## ❌ Códigos de Error

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

**Formato de Error:**
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    {
      "field": "email",
      "message": "El email ya está registrado"
    }
  ]
}
```

---

Ver implementación completa en:
- **[BACKEND_AUTH.md](./BACKEND_AUTH.md)** - Autenticación
- **[FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)** - Integración con Angular

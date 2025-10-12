# 🗄️ Modelos de Datos del Backend - SalonApp

Esta guía contiene todos los modelos de Mongoose necesarios para el backend, con validaciones, relaciones y métodos personalizados.

---

## 📋 Tabla de Contenidos

1. [Modelo User (Usuario)](#1-modelo-user-usuario)
2. [Modelo Client (Cliente)](#2-modelo-client-cliente)
3. [Modelo Employee (Empleado)](#3-modelo-employee-empleado)
4. [Modelo Service (Servicio)](#4-modelo-service-servicio)
5. [Modelo Appointment (Cita)](#5-modelo-appointment-cita)
6. [Relaciones entre Modelos](#relaciones-entre-modelos)
7. [Índices y Optimización](#índices-y-optimización)

---

## 1. Modelo User (Usuario)

**Archivo:** `src/models/User.js`

Este modelo maneja la autenticación y autorización de usuarios del sistema.

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingrese un email válido'
    ]
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false // No incluir password en queries por defecto
  },
  firstName: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres']
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true,
    minlength: [2, 'El apellido debe tener al menos 2 caracteres']
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'manager', 'employee'],
      message: '{VALUE} no es un rol válido'
    },
    default: 'employee'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  refreshToken: {
    type: String,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  }
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ========================================
// VIRTUALS
// ========================================

// Virtual para nombre completo
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// ========================================
// ÍNDICES
// ========================================

userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });

// ========================================
// MIDDLEWARES
// ========================================

// Middleware: Encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
  // Solo encriptar si la contraseña fue modificada
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ========================================
// MÉTODOS DE INSTANCIA
// ========================================

// Método: Comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error al comparar contraseñas');
  }
};

// Método: Generar token de reseteo de contraseña
userSchema.methods.createPasswordResetToken = function() {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
  
  return resetToken;
};

// Método: Convertir a JSON seguro (sin datos sensibles)
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  delete obj.__v;
  return obj;
};

// Método: Actualizar último login
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
```

---

## 2. Modelo Client (Cliente)

**Archivo:** `src/models/Client.js`

Maneja la información de los clientes del salón.

```javascript
const mongoose = require('mongoose');

// Sub-esquema para preferencias del cliente
const clientPreferencesSchema = new mongoose.Schema({
  preferredEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  preferredServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  allergies: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true
  }
}, { _id: false });

const clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true,
    minlength: [2, 'El apellido debe tener al menos 2 caracteres'],
    maxlength: [50, 'El apellido no puede exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingrese un email válido'
    ]
  },
  phone: {
    type: String,
    required: [true, 'El teléfono es requerido'],
    trim: true,
    match: [/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos']
  },
  birthDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value < new Date();
      },
      message: 'La fecha de nacimiento no puede ser en el futuro'
    }
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'La dirección no puede exceder 200 caracteres']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Las notas no pueden exceder 500 caracteres']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  lastVisit: {
    type: Date
  },
  totalVisits: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  preferences: {
    type: clientPreferencesSchema,
    default: () => ({})
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ========================================
// VIRTUALS
// ========================================

// Virtual para nombre completo
clientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual para edad
clientSchema.virtual('age').get(function() {
  if (!this.birthDate) return null;
  const today = new Date();
  const birthDate = new Date(this.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Virtual para promedio de gasto por visita
clientSchema.virtual('averageSpentPerVisit').get(function() {
  if (this.totalVisits === 0) return 0;
  return Math.round(this.totalSpent / this.totalVisits);
});

// ========================================
// ÍNDICES
// ========================================

clientSchema.index({ email: 1 });
clientSchema.index({ phone: 1 });
clientSchema.index({ firstName: 1, lastName: 1 });
clientSchema.index({ isActive: 1 });
clientSchema.index({ registeredAt: -1 });
clientSchema.index({ totalSpent: -1 });

// ========================================
// MÉTODOS DE INSTANCIA
// ========================================

// Método: Actualizar estadísticas después de una visita
clientSchema.methods.updateVisitStats = async function(appointmentPrice) {
  this.lastVisit = new Date();
  this.totalVisits += 1;
  this.totalSpent += appointmentPrice;
  await this.save();
};

// Método: Verificar si el cliente es VIP (más de 10 visitas o más de $500,000 gastados)
clientSchema.methods.isVIP = function() {
  return this.totalVisits >= 10 || this.totalSpent >= 500000;
};

// ========================================
// MÉTODOS ESTÁTICOS
// ========================================

// Método estático: Buscar clientes por término
clientSchema.statics.searchClients = function(searchTerm) {
  const regex = new RegExp(searchTerm, 'i');
  return this.find({
    $or: [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { phone: regex }
    ]
  });
};

// Método estático: Obtener clientes VIP
clientSchema.statics.getVIPClients = function() {
  return this.find({
    $or: [
      { totalVisits: { $gte: 10 } },
      { totalSpent: { $gte: 500000 } }
    ],
    isActive: true
  }).sort({ totalSpent: -1 });
};

module.exports = mongoose.model('Client', clientSchema);
```

---

## 3. Modelo Employee (Empleado)

**Archivo:** `src/models/Employee.js`

Maneja la información de los empleados del salón.

```javascript
const mongoose = require('mongoose');

// Sub-esquema para horario de un día
const dayScheduleSchema = new mongoose.Schema({
  isWorking: {
    type: Boolean,
    default: true
  },
  startTime: {
    type: String,
    default: '09:00',
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  },
  endTime: {
    type: String,
    default: '18:00',
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  }
}, { _id: false });

// Sub-esquema para horario semanal
const employeeScheduleSchema = new mongoose.Schema({
  monday: { type: dayScheduleSchema, default: () => ({}) },
  tuesday: { type: dayScheduleSchema, default: () => ({}) },
  wednesday: { type: dayScheduleSchema, default: () => ({}) },
  thursday: { type: dayScheduleSchema, default: () => ({}) },
  friday: { type: dayScheduleSchema, default: () => ({}) },
  saturday: { 
    type: dayScheduleSchema, 
    default: () => ({ isWorking: false, startTime: '09:00', endTime: '14:00' })
  },
  sunday: { 
    type: dayScheduleSchema, 
    default: () => ({ isWorking: false, startTime: '09:00', endTime: '14:00' })
  }
}, { _id: false });

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres']
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true,
    minlength: [2, 'El apellido debe tener al menos 2 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingrese un email válido'
    ]
  },
  phone: {
    type: String,
    required: [true, 'El teléfono es requerido'],
    trim: true,
    match: [/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos']
  },
  position: {
    type: String,
    required: [true, 'El cargo es requerido'],
    trim: true
  },
  specialties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  hireDate: {
    type: Date,
    required: [true, 'La fecha de contratación es requerida'],
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'La fecha de contratación no puede ser en el futuro'
    }
  },
  photoUrl: {
    type: String,
    trim: true,
    default: 'https://i.pravatar.cc/150'
  },
  schedule: {
    type: employeeScheduleSchema,
    default: () => ({})
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ========================================
// VIRTUALS
// ========================================

// Virtual para nombre completo
employeeSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual para años de servicio
employeeSchema.virtual('yearsOfService').get(function() {
  if (!this.hireDate) return 0;
  const today = new Date();
  const hireDate = new Date(this.hireDate);
  return Math.floor((today - hireDate) / (365.25 * 24 * 60 * 60 * 1000));
});

// ========================================
// ÍNDICES
// ========================================

employeeSchema.index({ email: 1 });
employeeSchema.index({ isActive: 1 });
employeeSchema.index({ userId: 1 });
employeeSchema.index({ position: 1 });

// ========================================
// MÉTODOS DE INSTANCIA
// ========================================

// Método: Verificar si el empleado trabaja en un día específico
employeeSchema.methods.isWorkingOn = function(dayName) {
  const day = dayName.toLowerCase();
  return this.schedule && this.schedule[day] && this.schedule[day].isWorking;
};

// Método: Obtener horario de un día específico
employeeSchema.methods.getScheduleForDay = function(dayName) {
  const day = dayName.toLowerCase();
  return this.schedule && this.schedule[day] ? this.schedule[day] : null;
};

// Método: Verificar si tiene una especialidad específica
employeeSchema.methods.hasSpecialty = function(serviceId) {
  return this.specialties.some(s => s.toString() === serviceId.toString());
};

// ========================================
// MÉTODOS ESTÁTICOS
// ========================================

// Método estático: Obtener empleados disponibles para un servicio
employeeSchema.statics.getAvailableForService = function(serviceId) {
  return this.find({
    specialties: serviceId,
    isActive: true
  }).populate('specialties');
};

module.exports = mongoose.model('Employee', employeeSchema);
```

---

## 4. Modelo Service (Servicio)

**Archivo:** `src/models/Service.js`

Maneja los servicios ofrecidos por el salón.

```javascript
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del servicio es requerido'],
    trim: true,
    unique: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  duration: {
    type: Number,
    required: [true, 'La duración es requerida'],
    min: [15, 'La duración mínima es 15 minutos'],
    max: [480, 'La duración máxima es 480 minutos (8 horas)'],
    validate: {
      validator: function(value) {
        return value % 15 === 0; // Debe ser múltiplo de 15
      },
      message: 'La duración debe ser múltiplo de 15 minutos'
    }
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo'],
    max: [10000000, 'El precio no puede exceder $10,000,000']
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: {
      values: ['Cabello', 'Uñas', 'Facial', 'Maquillaje', 'Masajes', 'Otros'],
      message: '{VALUE} no es una categoría válida'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// ========================================
// ÍNDICES
// ========================================

serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ name: 1 });
serviceSchema.index({ price: 1 });

// ========================================
// MÉTODOS ESTÁTICOS
// ========================================

// Método estático: Obtener categorías disponibles
serviceSchema.statics.getCategories = function() {
  return ['Cabello', 'Uñas', 'Facial', 'Maquillaje', 'Masajes', 'Otros'];
};

// Método estático: Obtener servicios por categoría
serviceSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ name: 1 });
};

// Método estático: Obtener servicios más populares
serviceSchema.statics.getPopular = async function(limit = 5) {
  const Appointment = mongoose.model('Appointment');
  
  const popular = await Appointment.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: '$service', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
  
  const serviceIds = popular.map(p => p._id);
  return this.find({ _id: { $in: serviceIds } });
};

module.exports = mongoose.model('Service', serviceSchema);
```

---

## 5. Modelo Appointment (Cita)

**Archivo:** `src/models/Appointment.js`

Maneja las citas del salón.

```javascript
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'El cliente es requerido']
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'El empleado es requerido']
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'El servicio es requerido']
  },
  date: {
    type: Date,
    required: [true, 'La fecha es requerida']
  },
  startTime: {
    type: String,
    required: [true, 'La hora de inicio es requerida'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'La hora de fin es requerida'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
      message: '{VALUE} no es un estado válido'
    },
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Las notas no pueden exceder 500 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// ========================================
// ÍNDICES COMPUESTOS
// ========================================

appointmentSchema.index({ date: 1, employee: 1 });
appointmentSchema.index({ date: 1, status: 1 });
appointmentSchema.index({ client: 1, date: -1 });
appointmentSchema.index({ employee: 1, date: 1, startTime: 1 });

// ========================================
// MIDDLEWARES
// ========================================

// Validación: La fecha no puede ser en el pasado
appointmentSchema.pre('save', function(next) {
  if (this.isNew) {
    const appointmentDate = new Date(this.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      return next(new Error('La fecha de la cita no puede ser en el pasado'));
    }
  }
  next();
});

// Validación: endTime debe ser mayor que startTime
appointmentSchema.pre('save', function(next) {
  const [startHour, startMin] = this.startTime.split(':').map(Number);
  const [endHour, endMin] = this.endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  if (endMinutes <= startMinutes) {
    return next(new Error('La hora de fin debe ser mayor que la hora de inicio'));
  }
  next();
});

// Middleware: Actualizar estadísticas del cliente cuando se completa
appointmentSchema.post('save', async function(doc) {
  if (doc.status === 'completed' && doc.isModified('status')) {
    const Client = mongoose.model('Client');
    const client = await Client.findById(doc.client);
    if (client) {
      await client.updateVisitStats(doc.price);
    }
  }
});

// ========================================
// MÉTODOS ESTÁTICOS
// ========================================

// Método estático: Verificar conflicto de horario
appointmentSchema.statics.checkConflict = async function(employeeId, date, startTime, endTime, excludeId = null) {
  const query = {
    employee: employeeId,
    date: date,
    status: { $nin: ['cancelled', 'no_show'] }
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  const appointments = await this.find(query);
  
  const [newStartHour, newStartMin] = startTime.split(':').map(Number);
  const [newEndHour, newEndMin] = endTime.split(':').map(Number);
  const newStartMinutes = newStartHour * 60 + newStartMin;
  const newEndMinutes = newEndHour * 60 + newEndMin;
  
  for (const apt of appointments) {
    const [aptStartHour, aptStartMin] = apt.startTime.split(':').map(Number);
    const [aptEndHour, aptEndMin] = apt.endTime.split(':').map(Number);
    const aptStartMinutes = aptStartHour * 60 + aptStartMin;
    const aptEndMinutes = aptEndHour * 60 + aptEndMin;
    
    // Verificar solapamiento
    if (
      (newStartMinutes >= aptStartMinutes && newStartMinutes < aptEndMinutes) ||
      (newEndMinutes > aptStartMinutes && newEndMinutes <= aptEndMinutes) ||
      (newStartMinutes <= aptStartMinutes && newEndMinutes >= aptEndMinutes)
    ) {
      return true; // Hay conflicto
    }
  }
  
  return false; // No hay conflicto
};

// Método estático: Obtener citas del día
appointmentSchema.statics.getTodayAppointments = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.find({
    date: { $gte: today, $lt: tomorrow }
  })
  .populate('client', 'firstName lastName phone')
  .populate('employee', 'firstName lastName')
  .populate('service', 'name duration')
  .sort({ startTime: 1 });
};

module.exports = mongoose.model('Appointment', appointmentSchema);
```

---

## Relaciones entre Modelos

```
User (Usuario del Sistema)
  └── 1:1 → Employee (puede estar vinculado a un empleado)

Client (Cliente)
  ├── 1:N → Appointment (tiene muchas citas)
  └── N:M → Service (servicios preferidos)

Employee (Empleado)
  ├── 1:N → Appointment (atiende muchas citas)
  ├── N:M → Service (especialidades)
  └── 1:1 → User (vinculado a un usuario del sistema)

Service (Servicio)
  ├── 1:N → Appointment (usado en muchas citas)
  └── N:M → Employee (empleados que lo ofrecen)

Appointment (Cita)
  ├── N:1 → Client (pertenece a un cliente)
  ├── N:1 → Employee (atendida por un empleado)
  ├── N:1 → Service (usa un servicio)
  └── N:1 → User (creada por un usuario)
```

---

## Índices y Optimización

### Índices Creados

**User:**
- `email` (único)
- `role + isActive` (compuesto)

**Client:**
- `email` (único)
- `phone`
- `firstName + lastName` (compuesto)
- `isActive`
- `registeredAt` (descendente)
- `totalSpent` (descendente)

**Employee:**
- `email` (único)
- `isActive`
- `userId`
- `position`

**Service:**
- `category + isActive` (compuesto)
- `name` (único)
- `price`

**Appointment:**
- `date + employee` (compuesto)
- `date + status` (compuesto)
- `client + date` (compuesto, date descendente)
- `employee + date + startTime` (compuesto)

---

## Próximos Pasos

Continúa con:
- **[BACKEND_API.md](./BACKEND_API.md)** - Implementar controladores y rutas
- **[BACKEND_AUTH.md](./BACKEND_AUTH.md)** - Agregar autenticación

---

**¡Modelos completados!** 🎉

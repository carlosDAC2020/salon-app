# 🔐 Autenticación y Seguridad - SalonApp Backend

Guía completa para implementar autenticación JWT, middlewares de seguridad y autorización basada en roles.

---

## 📋 Contenido

1. [Controlador de Autenticación](#controlador-de-autenticación)
2. [Middleware de Autenticación](#middleware-de-autenticación)
3. [Validadores](#validadores)
4. [Rutas de Autenticación](#rutas-de-autenticación)
5. [Manejo de Tokens](#manejo-de-tokens)

---

## 1. Controlador de Autenticación

**Archivo:** `src/controllers/authController.js`

```javascript
const User = require('../models/User');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../config/jwt');

/**
 * Registrar nuevo usuario
 */
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Crear nuevo usuario
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || 'employee'
    });

    await user.save();

    // Generar tokens
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Guardar refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      data: {
        user: user.toSafeObject(),
        token,
        refreshToken
      },
      message: 'Usuario registrado exitosamente'
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

/**
 * Iniciar sesión
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario (incluir password)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Usuario desactivado'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar tokens
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Actualizar refresh token y último login
    user.refreshToken = refreshToken;
    await user.updateLastLogin();

    res.json({
      success: true,
      data: {
        user: user.toSafeObject(),
        token,
        refreshToken
      },
      message: 'Login exitoso'
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

/**
 * Obtener usuario actual
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: user.toSafeObject()
    });
  } catch (error) {
    console.error('Error en getCurrentUser:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

/**
 * Cerrar sesión
 */
exports.logout = async (req, res) => {
  try {
    // Eliminar refresh token
    await User.findByIdAndUpdate(req.userId, {
      refreshToken: null
    });

    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cerrar sesión',
      error: error.message
    });
  }
};

/**
 * Refrescar token
 */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token requerido'
      });
    }

    // Verificar refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido'
      });
    }

    // Buscar usuario
    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido'
      });
    }

    // Generar nuevo access token
    const newToken = generateToken(user._id, user.role);

    res.json({
      success: true,
      data: {
        token: newToken
      },
      message: 'Token refrescado exitosamente'
    });
  } catch (error) {
    console.error('Error en refreshToken:', error);
    res.status(500).json({
      success: false,
      message: 'Error al refrescar token',
      error: error.message
    });
  }
};

/**
 * Solicitar reseteo de contraseña
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Por seguridad, no revelar si el email existe
      return res.json({
        success: true,
        message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña'
      });
    }

    // Generar token de reseteo
    const resetToken = user.createPasswordResetToken();
    await user.save();

    // TODO: Enviar email con el token
    // Por ahora, solo devolver el token (en producción, enviar por email)
    console.log('Reset token:', resetToken);

    res.json({
      success: true,
      message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña',
      // Solo para desarrollo:
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar solicitud',
      error: error.message
    });
  }
};

/**
 * Resetear contraseña
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Hash del token
    const crypto = require('crypto');
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Buscar usuario con token válido
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // Actualizar contraseña
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Error al resetear contraseña',
      error: error.message
    });
  }
};
```

---

## 2. Middleware de Autenticación

**Archivo:** `src/middlewares/auth.middleware.js`

```javascript
const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

/**
 * Middleware: Verificar autenticación
 */
exports.authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // Verificar que el usuario existe y está activo
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autorizado'
      });
    }

    // Agregar userId y role al request
    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    console.error('Error en authMiddleware:', error);
    res.status(500).json({
      success: false,
      message: 'Error de autenticación',
      error: error.message
    });
  }
};

/**
 * Middleware: Verificar rol de administrador
 */
exports.isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de administrador'
    });
  }
  next();
};

/**
 * Middleware: Verificar rol de manager o superior
 */
exports.isManagerOrAdmin = (req, res, next) => {
  if (req.userRole !== 'admin' && req.userRole !== 'manager') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de manager o administrador'
    });
  }
  next();
};

/**
 * Middleware: Verificar múltiples roles
 */
exports.hasRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Permisos insuficientes'
      });
    }
    next();
  };
};
```

---

## 3. Validadores

**Archivo:** `src/validators/authValidator.js`

```javascript
const { body, validationResult } = require('express-validator');

/**
 * Validación para registro
 */
exports.validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/\d/)
    .withMessage('La contraseña debe contener al menos un número'),
  
  body('firstName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('El apellido debe tener al menos 2 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras'),
  
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'employee'])
    .withMessage('Rol inválido'),
  
  // Middleware para manejar errores de validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      });
    }
    next();
  }
];

/**
 * Validación para login
 */
exports.validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      });
    }
    next();
  }
];

/**
 * Validación para reseteo de contraseña
 */
exports.validateResetPassword = [
  body('token')
    .notEmpty()
    .withMessage('Token requerido'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/\d/)
    .withMessage('La contraseña debe contener al menos un número'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      });
    }
    next();
  }
];
```

---

## 4. Rutas de Autenticación

**Archivo:** `src/routes/auth.routes.js`

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { 
  validateRegister, 
  validateLogin, 
  validateResetPassword 
} = require('../validators/authValidator');

// Rutas públicas
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', validateResetPassword, authController.resetPassword);

// Rutas protegidas
router.get('/me', authMiddleware, authController.getCurrentUser);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
```

---

## 5. Actualizar app.js

Agregar las rutas de autenticación en `src/app.js`:

```javascript
// Importar rutas
const authRoutes = require('./routes/auth.routes');

// Usar rutas
app.use('/api/auth', authRoutes);
```

---

## 🧪 Probar Autenticación

### 1. Registrar Usuario

```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "admin@salon.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin"
}
```

### 2. Iniciar Sesión

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@salon.com",
  "password": "admin123"
}
```

### 3. Obtener Usuario Actual

```bash
GET http://localhost:3000/api/auth/me
Authorization: Bearer <tu-token-aqui>
```

---

## 🔒 Seguridad Adicional

### Rate Limiting

Instalar:
```bash
npm install express-rate-limit
```

Agregar en `src/app.js`:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por ventana
});

app.use('/api/', limiter);
```

### Helmet (ya incluido)

Protege contra vulnerabilidades comunes.

---

**¡Autenticación completada!** 🔐

Continúa con: **[FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)**

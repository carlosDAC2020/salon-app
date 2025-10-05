# 💈 SalonApp - Sistema de Gestión para Peluquerías

## 📋 Descripción del Proyecto

**SalonApp** es una aplicación web moderna diseñada para la gestión integral de salones de belleza y peluquerías. La plataforma permite administrar de manera eficiente todos los aspectos operativos del negocio, desde el control de citas y empleados hasta el seguimiento de ingresos y análisis de rendimiento.

### 🎯 Concepto Principal

La aplicación se centra en tres pilares fundamentales:

1. **Gestión Operativa**: Control completo de citas, clientes, servicios y empleados
2. **Registro de Servicios**: Documentación detallada de cada servicio prestado con información de peluquero, cliente, costo y productos utilizados
3. **Análisis y Reportes**: Generación de informes de desempeño, tendencias de ingresos y servicios populares

---

## 🎨 Características Principales

### ✨ Funcionalidades Core

- **Panel de Control (Dashboard)**: Vista general con métricas clave del negocio
- **Gestión de Citas**: Programación y seguimiento de citas
- **Gestión de Clientes**: Base de datos completa de clientes
- **Gestión de Peluqueros/Empleados**: Administración de personal con tarifas, horarios y comisiones
- **Catálogo de Servicios**: Registro de todos los servicios ofrecidos
- **Registro de Servicios Realizados**: Documentación de cada servicio prestado
- **Sistema de Reportes**: Análisis de desempeño por peluquero, servicios populares y tendencias de ingresos
- **Modo Oscuro**: Soporte completo para tema claro y oscuro

### 🎨 Diseño y UX

- **Framework CSS**: TailwindCSS para un diseño moderno y responsivo
- **Tipografía**: Plus Jakarta Sans e Inter para una apariencia profesional
- **Iconografía**: Material Symbols Outlined
- **Color Principal**: `#13a4ec` (azul vibrante)
- **Diseño Responsivo**: Adaptable a diferentes dispositivos

---

## 🔄 Flujo de Navegación entre Pantallas

### 1️⃣ **Panel de Control (Dashboard)**
**Ruta**: `/dashboard` o `/`

**Propósito**: Pantalla principal que muestra un resumen ejecutivo del salón

**Elementos Clave**:
- 📊 Métricas principales:
  - Citas de hoy
  - Ingresos de la semana
  - Total de citas semanales
- 📈 Tabla de rendimiento del equipo con:
  - Nombre del empleado
  - Número de citas
  - Ingresos generados
  - Valoración promedio

**Navegación desde aquí**:
- → Citas
- → Clientes
- → Servicios
- → Empleados/Peluqueros
- → Configuración

---

### 2️⃣ **Gestión de Peluqueros**
**Ruta**: `/peluqueros` o `/empleados`

**Propósito**: Administrar el personal del salón

**Elementos Clave**:
- 🔍 Barra de búsqueda de peluqueros
- ➕ Botón "Añadir peluquero"
- 📋 Tabla detallada con:
  - Foto y nombre del peluquero
  - Servicios que ofrece
  - Horario de trabajo
  - Tarifa por hora
  - Porcentaje de comisión
  - Acciones: Editar ✏️ y Eliminar 🗑️

**Flujo de Acciones**:
1. **Añadir Peluquero**: Abre formulario modal/nueva página
2. **Editar**: Modifica información del peluquero
3. **Eliminar**: Confirma y elimina registro

**Navegación desde aquí**:
- → Panel de Control
- → Citas
- → Clientes
- → Servicios

---

### 3️⃣ **Registro de Servicios Realizados**
**Ruta**: `/servicios/registrar` o `/citas/registrar`

**Propósito**: Documentar cada servicio prestado a un cliente

**Elementos Clave**:
- 📝 Formulario con campos:
  - **Peluquero**: Selector dropdown
  - **Servicio**: Selector dropdown (Corte de Dama, Corte de Caballero, Tinte, Manicura, etc.)
  - **Cliente**: Campo de búsqueda con opción de añadir nuevo cliente
  - **Costo**: Campo numérico con símbolo de moneda
  - **Fecha y Hora**: Selector datetime
  - **Productos Utilizados**: Multi-selector opcional (Shampoo, Acondicionador, Cera, Aceite de Argán, etc.)
- 💾 Botón "Guardar Registro"

**Flujo del Proceso**:
1. Seleccionar peluquero que realizó el servicio
2. Elegir tipo de servicio
3. Buscar o añadir cliente
4. Ingresar costo del servicio
5. Registrar fecha y hora
6. (Opcional) Seleccionar productos utilizados
7. Guardar registro

**Navegación desde aquí**:
- → Inicio/Dashboard
- → Citas
- → Clientes
- → Servicios
- → Productos
- → Reportes

---

### 4️⃣ **Reportes y Estadísticas**
**Ruta**: `/reportes`

**Propósito**: Análisis de desempeño y generación de informes

**Elementos Clave**:
- 📑 Pestañas de navegación:
  - **Desempeño del Peluquero** (activa)
  - Servicios Populares
  - Tendencias de Ingresos
  
- 🔧 Filtros de búsqueda:
  - Selector de peluquero (individual o todos)
  - Fecha de inicio
  - Fecha de fin
  - Botón "Generar Informe"

- 📊 Visualización de datos:
  - **Tabla de desempeño**:
    - Peluquero
    - Servicios realizados
    - Ingresos generados
    - Total general
  - **Gráfico de barras**: Comparativa visual de ingresos por peluquero
  - **Métricas destacadas**: Total de ingresos con porcentaje de crecimiento

**Flujo de Uso**:
1. Seleccionar tipo de reporte (pestaña)
2. Aplicar filtros (peluquero, fechas)
3. Generar informe
4. Analizar datos en tabla y gráficos
5. (Opcional) Exportar o imprimir reporte

**Navegación desde aquí**:
- → Dashboard
- → Citas
- → Clientes
- → Servicios
- → Empleados

---

## 🗺️ Mapa de Flujo Completo

```
┌─────────────────────────────────────────────────────────────┐
│                    INICIO DE SESIÓN                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              📊 PANEL DE CONTROL (Dashboard)                │
│  • Métricas del día/semana                                  │
│  • Rendimiento del equipo                                   │
└──┬────────┬─────────┬──────────┬──────────┬────────────────┘
   │        │         │          │          │
   ▼        ▼         ▼          ▼          ▼
┌──────┐ ┌──────┐ ┌────────┐ ┌────────┐ ┌──────────┐
│Citas │ │Clien │ │Servi   │ │Peluque │ │Reportes  │
│      │ │tes   │ │cios    │ │ros     │ │          │
└──┬───┘ └──┬───┘ └───┬────┘ └───┬────┘ └────┬─────┘
   │        │         │          │           │
   │        │         │          │           │
   └────────┴─────────┴──────────┴───────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  📝 REGISTRO DE SERVICIOS    │
        │  • Seleccionar peluquero     │
        │  • Elegir servicio           │
        │  • Buscar/añadir cliente     │
        │  • Ingresar costo            │
        │  • Productos utilizados      │
        └──────────────────────────────┘
```

---

## 🔐 Roles y Permisos

### Administrador
- Acceso completo a todas las funcionalidades
- Gestión de empleados
- Visualización de todos los reportes
- Configuración del sistema

### Peluquero/Empleado
- Registro de servicios propios
- Visualización de citas asignadas
- Consulta de clientes
- Visualización de reportes personales

---

## 🛠️ Stack Tecnológico

### Frontend
- **HTML5**: Estructura semántica
- **TailwindCSS**: Framework CSS utility-first
- **JavaScript**: Interactividad (a implementar)
- **Material Symbols**: Iconografía

### Características Técnicas
- ✅ Diseño responsivo (mobile-first)
- ✅ Modo oscuro nativo
- ✅ Componentes reutilizables
- ✅ Accesibilidad (ARIA labels)

---

## 📱 Pantallas Disponibles

| Pantalla | Archivo | Estado |
|----------|---------|--------|
| Panel de Control | `panel_de_control_de_peluquería/code.html` | ✅ Diseñado |
| Gestión de Peluqueros | `gestión_de_peluqueros/code.html` | ✅ Diseñado |
| Registro de Servicios | `registro_de_servicios_y_clientes/code.html` | ✅ Diseñado |
| Reportes | `code.html` (raíz) | ✅ Diseñado |

---

## 🚀 Próximos Pasos de Desarrollo

### Fase 1: Backend
- [ ] Implementar API REST
- [ ] Base de datos (PostgreSQL/MySQL)
- [ ] Sistema de autenticación
- [ ] CRUD completo para todas las entidades

### Fase 2: Funcionalidades
- [ ] Sistema de citas con calendario interactivo
- [ ] Notificaciones push/email
- [ ] Gestión de inventario de productos
- [ ] Sistema de pagos integrado
- [ ] Exportación de reportes (PDF/Excel)

### Fase 3: Optimización
- [ ] PWA (Progressive Web App)
- [ ] Optimización de rendimiento
- [ ] Tests unitarios y de integración
- [ ] Documentación API

---

## 📄 Licencia

Este proyecto es propiedad de [Tu Empresa/Nombre]. Todos los derechos reservados.

---

## 👥 Contacto

Para más información sobre el proyecto, contacta a: [tu-email@ejemplo.com]

---

**Versión**: 1.0.0  
**Última actualización**: Octubre 2025

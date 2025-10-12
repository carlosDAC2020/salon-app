# 🔗 Integración Frontend-Backend - SalonApp

Guía completa para conectar el frontend Angular con el backend Node.js/Express.

---

## 📋 Contenido

1. [Configuración de Entornos](#1-configuración-de-entornos)
2. [Configuración de HttpClient](#2-configuración-de-httpclient)
3. [Interceptor de Autenticación](#3-interceptor-de-autenticación)
4. [Servicio de Autenticación](#4-servicio-de-autenticación)
5. [Guards de Autenticación](#5-guards-de-autenticación)
6. [Actualizar Servicios](#6-actualizar-servicios)
7. [Manejo de Errores](#7-manejo-de-errores)

---

## 1. Configuración de Entornos

### Crear Archivos de Entorno

**Archivo:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  tokenKey: 'salon_app_token',
  refreshTokenKey: 'salon_app_refresh_token'
};
```

**Archivo:** `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-api-produccion.com/api',
  tokenKey: 'salon_app_token',
  refreshTokenKey: 'salon_app_refresh_token'
};
```

---

## 2. Configuración de HttpClient

### Actualizar app.config.ts

**Archivo:** `src/app/app.config.ts`

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor
      ])
    )
  ]
};
```

---

## 3. Interceptor de Autenticación

### Crear Interceptor

**Archivo:** `src/app/core/interceptors/auth.interceptor.ts`

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener token del localStorage
  const token = localStorage.getItem(environment.tokenKey);

  // Si hay token, agregarlo al header
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
```

### Crear Interceptor de Errores

**Archivo:** `src/app/core/interceptors/error.interceptor.ts`

```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error desconocido';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        if (error.status === 401) {
          // Token inválido o expirado
          localStorage.clear();
          router.navigate(['/']);
          errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
        } else if (error.status === 403) {
          errorMessage = 'No tienes permisos para realizar esta acción.';
        } else if (error.status === 404) {
          errorMessage = 'Recurso no encontrado.';
        } else if (error.status === 500) {
          errorMessage = 'Error del servidor. Intenta nuevamente más tarde.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
      }

      console.error('Error HTTP:', errorMessage);
      
      // Mostrar notificación al usuario (puedes usar un servicio de notificaciones)
      alert(errorMessage);

      return throwError(() => new Error(errorMessage));
    })
  );
};
```

---

## 4. Servicio de Autenticación

### Crear Servicio de Auth

**Archivo:** `src/app/core/services/auth.service.ts`

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Estado del usuario actual
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Signal para el estado de autenticación
  public isAuthenticated = signal(false);

  constructor() {
    // Verificar si hay token al iniciar
    this.checkAuthStatus();
  }

  /**
   * Verificar estado de autenticación
   */
  private checkAuthStatus(): void {
    const token = localStorage.getItem(environment.tokenKey);
    if (token) {
      this.getCurrentUser().subscribe({
        next: (response) => {
          this.currentUserSubject.next(response.data);
          this.isAuthenticated.set(true);
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  /**
   * Iniciar sesión
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success) {
            // Guardar tokens
            localStorage.setItem(environment.tokenKey, response.data.token);
            localStorage.setItem(environment.refreshTokenKey, response.data.refreshToken);
            
            // Actualizar estado
            this.currentUserSubject.next(response.data.user);
            this.isAuthenticated.set(true);
          }
        })
      );
  }

  /**
   * Registrar usuario
   */
  register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          if (response.success) {
            localStorage.setItem(environment.tokenKey, response.data.token);
            localStorage.setItem(environment.refreshTokenKey, response.data.refreshToken);
            this.currentUserSubject.next(response.data.user);
            this.isAuthenticated.set(true);
          }
        })
      );
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): Observable<{ success: boolean; data: User }> {
    return this.http.get<{ success: boolean; data: User }>(`${this.apiUrl}/me`);
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      complete: () => {
        this.clearSession();
      },
      error: () => {
        this.clearSession();
      }
    });
  }

  /**
   * Limpiar sesión
   */
  private clearSession(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  /**
   * Refrescar token
   */
  refreshToken(): Observable<{ success: boolean; data: { token: string } }> {
    const refreshToken = localStorage.getItem(environment.refreshTokenKey);
    return this.http.post<{ success: boolean; data: { token: string } }>(
      `${this.apiUrl}/refresh`,
      { refreshToken }
    ).pipe(
      tap(response => {
        if (response.success) {
          localStorage.setItem(environment.tokenKey, response.data.token);
        }
      })
    );
  }

  /**
   * Obtener token actual
   */
  getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  /**
   * Verificar si el usuario es admin
   */
  isAdmin(): boolean {
    return this.hasRole('admin');
  }
}
```

---

## 5. Guards de Autenticación

### Auth Guard

**Archivo:** `src/app/core/guards/auth.guard.ts`

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirigir al login
  router.navigate(['/'], { queryParams: { returnUrl: state.url } });
  return false;
};
```

### Admin Guard

**Archivo:** `src/app/core/guards/admin.guard.ts`

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  // Redirigir al dashboard o mostrar error
  router.navigate(['/home/dashboard']);
  alert('No tienes permisos de administrador');
  return false;
};
```

### Actualizar Rutas

**Archivo:** `src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { Auth } from './features/auth/auth';
import { Home } from './shared/layouts/home/home';
import { Dashboard } from './features/dashboard/dashboard';
import { Citas } from './features/citas/citas';
import { Employees } from './features/employees/employees';
import { Clients } from './features/clients/clients';
import { Services } from './features/services/services';
import { Reports } from './features/reports/reports';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: Auth
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard], // Proteger todas las rutas hijas
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'citas',
        component: Citas
      },
      {
        path: 'empleados',
        component: Employees,
        canActivate: [adminGuard] // Solo admin
      },
      {
        path: 'clientes',
        component: Clients
      },
      {
        path: 'servicios',
        component: Services,
        canActivate: [adminGuard] // Solo admin
      },
      {
        path: 'reportes',
        component: Reports
      }
    ]
  }
];
```

---

## 6. Actualizar Servicios

### Ejemplo: Clients Service

**Archivo:** `src/app/core/services/clients.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Client } from '../models/client.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: {
    clients: T[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clients`;

  /**
   * Obtener todos los clientes
   */
  getAll(page: number = 1, limit: number = 10): Observable<Client[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<Client>>(this.apiUrl, { params })
      .pipe(
        map(response => response.data.clients)
      );
  }

  /**
   * Obtener clientes activos
   */
  getActive(): Observable<Client[]> {
    return this.http.get<ApiResponse<Client[]>>(`${this.apiUrl}?isActive=true`)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Obtener cliente por ID
   */
  getById(id: string): Observable<Client> {
    return this.http.get<ApiResponse<Client>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Crear nuevo cliente
   */
  create(client: Partial<Client>): Observable<Client> {
    return this.http.post<ApiResponse<Client>>(this.apiUrl, client)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Actualizar cliente
   */
  update(id: string, client: Partial<Client>): Observable<Client> {
    return this.http.put<ApiResponse<Client>>(`${this.apiUrl}/${id}`, client)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Eliminar cliente
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Buscar clientes
   */
  searchClients(term: string): Observable<Client[]> {
    return this.http.get<ApiResponse<Client[]>>(`${this.apiUrl}/search?q=${term}`)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Activar/Desactivar cliente
   */
  toggleActive(id: string): Observable<Client> {
    return this.http.patch<ApiResponse<Client>>(`${this.apiUrl}/${id}/toggle-active`, {})
      .pipe(
        map(response => response.data)
      );
  }
}
```

### Ejemplo: Appointments Service

**Archivo:** `src/app/core/services/appointments.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Appointment, AppointmentStatus } from '../models/appointment.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/appointments`;

  getAll(): Observable<Appointment[]> {
    return this.http.get<ApiResponse<Appointment[]>>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  getById(id: string): Observable<Appointment> {
    return this.http.get<ApiResponse<Appointment>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  getToday(): Observable<Appointment[]> {
    return this.http.get<ApiResponse<Appointment[]>>(`${this.apiUrl}/today`)
      .pipe(map(response => response.data));
  }

  getUpcoming(): Observable<Appointment[]> {
    return this.http.get<ApiResponse<Appointment[]>>(`${this.apiUrl}/upcoming`)
      .pipe(map(response => response.data));
  }

  getByDate(date: Date): Observable<Appointment[]> {
    const dateStr = date.toISOString().split('T')[0];
    return this.http.get<ApiResponse<Appointment[]>>(`${this.apiUrl}/date/${dateStr}`)
      .pipe(map(response => response.data));
  }

  create(appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http.post<ApiResponse<Appointment>>(this.apiUrl, appointment)
      .pipe(map(response => response.data));
  }

  update(id: string, appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http.put<ApiResponse<Appointment>>(`${this.apiUrl}/${id}`, appointment)
      .pipe(map(response => response.data));
  }

  updateStatus(id: string, status: AppointmentStatus): Observable<Appointment> {
    return this.http.patch<ApiResponse<Appointment>>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(map(response => response.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkAvailability(data: {
    employeeId: string;
    date: string;
    startTime: string;
    endTime: string;
  }): Observable<{ available: boolean }> {
    return this.http.post<ApiResponse<{ available: boolean }>>(
      `${this.apiUrl}/check-availability`,
      data
    ).pipe(map(response => response.data));
  }
}
```

---

## 7. Manejo de Errores

### Servicio de Notificaciones (Opcional)

**Archivo:** `src/app/core/services/notification.service.ts`

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  success(message: string): void {
    // Implementar con tu librería de notificaciones preferida
    // Por ejemplo: ngx-toastr, angular-notifier, etc.
    console.log('✅ Success:', message);
    alert(message);
  }

  error(message: string): void {
    console.error('❌ Error:', message);
    alert(message);
  }

  info(message: string): void {
    console.log('ℹ️ Info:', message);
    alert(message);
  }

  warning(message: string): void {
    console.warn('⚠️ Warning:', message);
    alert(message);
  }
}
```

---

## 8. Actualizar Componente de Login

**Archivo:** `src/app/features/auth/auth.ts`

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  onLogin(event: Event) {
    event.preventDefault();
    
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.errorMessage = error.message || 'Error al iniciar sesión';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
```

---

## ✅ Checklist de Integración

- [ ] Crear archivos de entorno
- [ ] Configurar HttpClient en app.config.ts
- [ ] Crear interceptor de autenticación
- [ ] Crear interceptor de errores
- [ ] Crear servicio de autenticación
- [ ] Crear guards (auth y admin)
- [ ] Actualizar rutas con guards
- [ ] Actualizar todos los servicios para usar HttpClient
- [ ] Actualizar componente de login
- [ ] Probar flujo completo de autenticación
- [ ] Probar CRUD de cada módulo
- [ ] Manejar errores correctamente

---

## 🚀 Iniciar Aplicación Completa

### Terminal 1 - Backend:
```bash
cd salon-app-backend
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd salon-app
ng serve
```

### Acceder:
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api

---

**¡Integración completada!** 🎉

Tu aplicación ahora está completamente conectada con el backend.

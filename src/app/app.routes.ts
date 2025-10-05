import { Routes } from '@angular/router';
import { Auth } from './features/auth/auth';
import { Home } from './shared/layouts/home/home';
import { Dashboard } from './features/dashboard/dashboard';
import { Citas } from './features/citas/citas';
import { Employees } from './features/employees/employees';
import { Clients } from './features/clients/clients';
import { Services } from './features/services/services';
import { Reports } from './features/reports/reports';

export const routes: Routes = [
    {
        path: '',
        component: Auth
    },
    {
        path: 'home',
        component: Home,
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
                component: Employees
            },
            {
                path: 'clientes',
                component: Clients
            },
            {
                path: 'servicios',
                component: Services
            },
            {
                path: 'reportes',
                component: Reports
            }
        ]
    }
];

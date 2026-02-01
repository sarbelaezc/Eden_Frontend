import { Routes } from '@angular/router'
import { LoginComponent } from './features/auth/components/login/login.component'
import { authGuard } from './core/guards/auth.guard'
import { ForbiddenComponent } from './features/auth/components/forbidden/forbidden.component'
import { permissionGuard } from './core/guards/permission.guard'

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: '403',
    component: ForbiddenComponent,
    title: 'Acceso Denegado'
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    canActivate: [authGuard, permissionGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'settings',
    canActivate: [authGuard, permissionGuard],
    loadChildren: () => import('./features/settings/settings.routes').then(m => m.SETTINGS_ROUTES)
  }
]

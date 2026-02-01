import { Routes } from '@angular/router'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { ProductsComponent } from './components/products/products.component'
import { MachineryComponent } from './components/machinery/machinery.component'
import { PersonnelComponent } from './components/personnel/personnel.component'

import { permissionGuard } from '../../core/guards/permission.guard'

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: DashboardComponent,
        canActivate: [permissionGuard]
    },
    {
        path: 'products',
        component: ProductsComponent,
        canActivate: [permissionGuard]
    },
    {
        path: 'machinery',
        component: MachineryComponent,
        canActivate: [permissionGuard]
    },
    {
        path: 'personnel',
        component: PersonnelComponent,
        canActivate: [permissionGuard]
    }
]

import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsComponent } from './components/products/products.component';
import { MachineryComponent } from './components/machinery/machinery.component';
import { PersonnelComponent } from './components/personnel/personnel.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: 'machinery',
    component: MachineryComponent
  },
  {
    path: 'personnel',
    component: PersonnelComponent
  }
];

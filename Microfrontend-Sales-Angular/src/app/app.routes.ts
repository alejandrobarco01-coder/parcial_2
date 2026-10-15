import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/sales/sales.page').then((m) => m.SalesPage) },
];
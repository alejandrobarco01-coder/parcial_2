import { Routes } from '@angular/router';
import { ProductsPage } from './pages/products/products.page';

/**
 * Definición de las rutas principales de la aplicación.
 *
 * @remarks
 * Este archivo contiene la configuración de enrutamiento
 * utilizada por Angular Router para mapear las URLs
 * a los componentes correspondientes.
 *
 * Incluye:
 * - Rutas de navegación principales
 * - Redirección por defecto para rutas no existentes
 *
 * @see {@link ProductsPage}
 */
export const routes: Routes = [
  /**
   * Ruta de usuarios.
   *
   * @remarks
   * Renderiza el componente `ProductsPage`, encargado
   * de mostrar y gestionar el listado de usuarios.
   */
  { path: '', loadComponent: () => import('./pages/products/products.page').then((m) => m.ProductsPage)},
];
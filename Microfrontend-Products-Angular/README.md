# Microfrontend de Productos

Aplicación remota Angular 20 expuesta por Module Federation como `./ProductsPage` en `http://localhost:4202/remoteEntry.js`. Se integra desde el host en la ruta `/products` y consume el microservicio de productos en el puerto `3002`.

## Arquitectura

- `app/services/products/products.service.ts`: adaptador HTTP hacia la API REST.
- `app/pages/products/products.page.ts`: caso de uso de presentación para listar productos.
- `app/components/products-table/products-table.component.ts`: tabla de visualización.
- `app/components/alert/alert.component.ts`: alertas de estado (`loading`, `error`, `success`).
- `app/interfaces/`: tipos del dominio y estado del componente.

## Ejecutar

```powershell
npm install --legacy-peer-deps
npm run start -- --port 4202
```

La aplicación queda disponible en `http://localhost:4202` y se integra desde el host por `remoteEntry.js`.

## Pruebas unitarias y cobertura

```powershell
npm run test:coverage -- --runInBand
```

Jest exige cobertura global mínima del 90 % en ramas, funciones, líneas y sentencias.

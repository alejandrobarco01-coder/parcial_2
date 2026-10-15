# Microfrontend de Ventas

Aplicación remota Angular 20 expuesta por Module Federation como `./SalesPage` en `http://localhost:4203/remoteEntry.js`. Se integra desde el host en la ruta `/sales` y consume el microservicio de ventas en el puerto `3003`.

## Arquitectura

- `app/services/sales/sales.service.ts`: adaptador HTTP hacia la API REST.
- `app/pages/sales/sales.page.ts`: caso de uso de presentación para listar ventas.
- `app/components/sales-table/sales-table.component.ts`: tabla de visualización.
- `app/components/alert/alert.component.ts`: alertas de estado (`loading`, `error`, `success`).
- `app/interfaces/`: tipos del dominio y estado del componente.

## Ejecutar

```powershell
npm install --legacy-peer-deps
npm run start -- --port 4203
```

La aplicación queda disponible en `http://localhost:4203` y se integra desde el host por `remoteEntry.js`.

## Pruebas unitarias y cobertura

```powershell
npm run test:coverage -- --runInBand
```

Jest exige cobertura global mínima del 90 % en ramas, funciones, líneas y sentencias.

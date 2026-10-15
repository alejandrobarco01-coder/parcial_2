# Microservicio de Ventas

API REST en Node.js/Express que expone la funcionalidad de gestión de ventas. Atiende en el puerto `3003` y publica Swagger UI en `/api/docs`.

## Ejecutar

```powershell
npm ci
npm run start
```

## Endpoints

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/sales?limit=10` | Lista ventas con límite válido |
| GET | `/api/sales/{id}` | Consulta una venta por ID |
| POST | `/api/sales` | Crea una venta |
| GET | `/api/docs` | Swagger UI |

## Validaciones

- `customer`: requerido y no vacío.
- `item`: requerido y no vacío.
- `quantity`: debe ser numérico y mayor a cero.
- `total`: debe ser numérico y mayor a cero.
- `status`: debe ser uno de `Pendiente`, `Pagada` o `Entregada`.

## Clean Architecture

- `domain/interfaces`: entidades y contratos del dominio.
- `presentation/modules/sales`: controladores y rutas HTTP.
- `presentation/modules/sales/sales.service.ts`: lógica de negocio del catálogo de ventas.

## Pruebas

```powershell
npm test
```

El script compila TypeScript y ejecuta pruebas para listar, consultar y crear ventas.

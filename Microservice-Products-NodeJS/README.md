# Microservicio de Productos

API REST en Node.js/Express que expone la funcionalidad de catálogo de productos. Atiende en el puerto `3002` y publica Swagger UI en `/api/docs`.

## Ejecutar

```powershell
npm ci
npm run start
```

## Endpoints

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/products?limit=10` | Lista productos con límite válido |
| GET | `/api/products/{id}` | Consulta un producto por ID |
| POST | `/api/products` | Crea un producto |
| GET | `/api/docs` | Swagger UI |

## Validaciones

- `name`: requerido y no vacío.
- `category`: debe ser una de `Lacteos`, `Carnes`, `Frutas` o `Verduras`.
- `price`: debe ser numérico y mayor a cero.

## Clean Architecture

- `domain/interfaces`: entidades y contratos del dominio.
- `presentation/modules/products`: controladores y rutas HTTP.
- `presentation/modules/products/products.service.ts`: lógica de negocio del catálogo.

## Pruebas

```powershell
npm test
```

El script compila TypeScript y ejecuta pruebas para listar, consultar y crear productos.

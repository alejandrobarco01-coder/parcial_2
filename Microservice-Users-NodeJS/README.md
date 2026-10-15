# Microservicio de Usuarios

API REST en Node.js/Express con documentación OpenAPI. Atiende en el puerto `3001` por defecto (configurable con `PORT`) y publica Swagger UI en `/api/docs`.

## Ejecutar

```powershell
npm ci
npm run start
```

## Endpoints

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/users?limit=10` | Lista de 1 a 100 usuarios |
| GET | `/api/users/{id}` | Consulta un usuario |
| POST | `/api/users` | Crea un usuario |
| GET | `/api/docs` | Swagger UI |

El cuerpo de creación requiere `name`, `lastName`, `age`, `email` y `engineering`. La edad debe estar entre 18 y 100; las ingenierías válidas son `Sistemas`, `Electronica`, `Biomedica`, `Industrial` y `Ambiental`.

## Clean Architecture

- `domain`: modelo de usuario y errores de dominio.
- `application/ports`: interfaz de persistencia.
- `application/use-cases`: listar, consultar por id y crear.
- `infrastructure/repositories`: adaptador en memoria con datos de demostración.
- `presentation`: API Express, controladores y rutas.

## Pruebas

```powershell
npm test
```

El script compila TypeScript y ejecuta las pruebas unitarias con `node:test`.

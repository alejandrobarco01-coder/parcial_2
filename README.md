# Parcial II - Microfrontends y Clean Architecture

Monorepositorio basado en Angular + Module Federation y microservicios Node.js. El repositorio integra tres verticales funcionales: Usuarios, Productos y Ventas.

## Alcance actual

La solución en este monorepositorio incluye:

- Host Angular para navegación entre remotos.
- Microfrontend de Usuarios en `4201` con acceso a la API REST de usuarios.
- Microfrontend de Productos en `4202` con acceso a la API REST de productos.
- Microfrontend de Ventas en `4203` con acceso a la API REST de ventas.
- Microservicio de Usuarios en `3001`.
- Microservicio de Productos en `3002`.
- Microservicio de Ventas en `3003`.

## Puertos y responsabilidades

| Aplicación | Puerto | Responsabilidad |
| --- | ---: | --- |
| `Client-Host-Angular` | 4200 | Host Angular y navegación entre microfrontends |
| `Microfrontend-Users-Angular` | 4201 | Listado, consulta y registro de usuarios |
| `Microservice-Users-NodeJS` | 3001 | API REST de usuarios; Swagger en `/api/docs` |
| `Microfrontend-Products-Angular` | 4202 | Listado de productos |
| `Microservice-Products-NodeJS` | 3002 | API REST de productos; Swagger en `/api/docs` |
| `Microfrontend-Sales-Angular` | 4203 | Listado y seguimiento de ventas |
| `Microservice-Sales-NodeJS` | 3003 | API REST de ventas; Swagger en `/api/docs` |

Los remotos se cargan desde:

- `http://localhost:4201/remoteEntry.js`
- `http://localhost:4202/remoteEntry.js`
- `http://localhost:4203/remoteEntry.js`

El host del proyecto navega hacia `/users`, `/products` y `/sales` usando Module Federation.

## Ejecutar el sistema completo

Requiere Node.js 20+.

```powershell
cd Microservice-Users-NodeJS
npm ci
npm run start
```

```powershell
cd Microservice-Products-NodeJS
npm ci
npm run start
```

```powershell
cd Microservice-Sales-NodeJS
npm ci
npm run start
```

En terminales separadas:

```powershell
cd Microfrontend-Users-Angular
npm install --legacy-peer-deps
npm run start -- --port 4201
```

```powershell
cd Microfrontend-Products-Angular
npm install --legacy-peer-deps
npm run start -- --port 4202
```

```powershell
cd Microfrontend-Sales-Angular
npm install --legacy-peer-deps
npm run start -- --port 4203
```

```powershell
cd Client-Host-Angular
npm install --legacy-peer-deps
npm run start -- --port 4200
```

## Verificación rápida

Abre:

- `http://localhost:4200/users`
- `http://localhost:4200/products`
- `http://localhost:4200/sales`
- `http://localhost:3001/api/docs`
- `http://localhost:3002/api/docs`
- `http://localhost:3003/api/docs`

## API de Usuarios

- `GET /api/users?limit=10`: lista de 1 a 100 usuarios.
- `GET /api/users/{id}`: consulta un usuario por ID.
- `POST /api/users`: crea un usuario con `name`, `lastName`, `age`, `email` y `engineering`.
- `GET /api/docs`: documentación Swagger/OpenAPI.

## API de Productos

- `GET /api/products?limit=10`: lista de productos con límite válido entre 1 y 100.
- `GET /api/products/{id}`: consulta un producto por ID.
- `POST /api/products`: crea un producto con `name`, `category` y `price` positivos.
- `GET /api/docs`: documentación Swagger/OpenAPI.

## API de Ventas

- `GET /api/sales?limit=10`: lista de ventas con límite válido entre 1 y 100.
- `GET /api/sales/{id}`: consulta una venta por su ID.
- `POST /api/sales`: crea una venta con `customer`, `item`, `quantity`, `total` y `status` válido.
- `GET /api/docs`: documentación Swagger/OpenAPI.

## Pruebas y cobertura

### Usuarios - frontend

```powershell
cd Microfrontend-Users-Angular
npm run test:coverage
```

### Usuarios - backend

```powershell
cd Microservice-Users-NodeJS
npm test
```

### Productos - frontend

```powershell
cd Microfrontend-Products-Angular
npm run test:coverage -- --runInBand
```

### Productos - backend

```powershell
cd Microservice-Products-NodeJS
npm test
```

### Ventas - frontend

```powershell
cd Microfrontend-Sales-Angular
npm run test:coverage -- --runInBand
```

### Ventas - backend

```powershell
cd Microservice-Sales-NodeJS
npm test
```

Jest exige cobertura global mínima del 90 % en ramas, funciones, líneas y sentencias.

## Arquitectura aplicada

Cada aplicación respeta separación por capas:

- `domain`: entidades, errores y contratos de negocio.
- `application`: casos de uso y puertos.
- `infrastructure`: adaptadores HTTP, persistencia en memoria y servicios de acceso a API.
- `presentation`: componentes, controladores, rutas y vistas.

## Estándar de commits

Se respetan mensajes breves con prefijo convencional, por ejemplo:

- `feat(users): add user registration use case`
- `feat(sales): complete sales vertical integration`
- `test(products): cover frontend coverage gate`
- `docs: document local execution`

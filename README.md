# Parcial II - Microfrontends y Clean Architecture

Monorepositorio basado en Angular + Module Federation y microservicios Node.js. El repositorio implementa la integración de dos verticales independientes: Usuarios y Productos.

## Alcance actual

La solución en este monorepositorio incluye:

- Host Angular para navegación entre remotos.
- Microfrontend de Usuarios en `4201` con acceso a la API REST de usuarios.
- Microfrontend de Productos en `4202` con acceso a la API REST de productos.
- Microservicio de Usuarios en `3001`.
- Microservicio de Productos en `3002`.

El tercer vertical solicitado por el PDF queda fuera del alcance de esta entrega porque el entorno disponible no incluye la infraestructura Java/Maven necesaria para verificar un servicio Spring Boot de forma responsable. La implementación actual conserva el alcance funcional que sí fue validado en este repositorio.

## Puertos y responsabilidades

| Aplicación | Puerto | Responsabilidad |
| --- | ---: | --- |
| `Client-Host-Angular` | 4200 | Host Angular y navegación entre microfrontends |
| `Microfrontend-Users-Angular` | 4201 | Listado, consulta y registro de usuarios |
| `Microservice-Users-NodeJS` | 3001 | API REST de usuarios; Swagger en `/api/docs` |
| `Microfrontend-Products-Angular` | 4202 | Listado de productos |
| `Microservice-Products-NodeJS` | 3002 | API REST de productos; Swagger en `/api/docs` |

Los remotos se cargan desde:

- `http://localhost:4201/remoteEntry.js`
- `http://localhost:4202/remoteEntry.js`

El host del proyecto navega hacia `/users` y `/products` usando Module Federation.

## Ejecutar el sistema completo

Requiere Node.js 20+.

```powershell
cd Microservice-Users-NodeJS
npm ci
npm run start
```

En una segunda terminal:

```powershell
cd Microservice-Products-NodeJS
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
cd Client-Host-Angular
npm install --legacy-peer-deps
npm run start -- --port 4200
```

## Verificación rápida

Abre:

- `http://localhost:4200/users`
- `http://localhost:4200/products`
- `http://localhost:3001/api/docs`
- `http://localhost:3002/api/docs`

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

## Pruebas y cobertura

### Usuarios - frontend

```powershell
cd Microfrontend-Users-Angular
npm run test:coverage
```

Jest exige cobertura global mínima del 90 % en ramas, funciones, líneas y sentencias.

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

Las pruebas del repositorio se ejecutan y validan con los umbrales requeridos por el parcial.

## Arquitectura aplicada

Cada aplicación respeta separación por capas:

- `domain`: entidades, errores y contratos de negocio.
- `application`: casos de uso y puertos.
- `infrastructure`: adaptadores HTTP, persistencia en memoria y servicios de acceso a API.
- `presentation`: componentes, controladores, rutas y vistas.

## Estándar de commits

Se respetan mensajes breves con prefijo convencional, por ejemplo:

- `feat(users): add user registration use case`
- `test(products): cover frontend coverage gate`
- `docs: document local execution`

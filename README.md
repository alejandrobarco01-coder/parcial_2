# Parcial II - Microfrontends y Clean Architecture

Monorepositorio basado en Angular + Module Federation y microservicios Node.js/TypeScript. El repositorio integra tres verticales funcionales completas: Usuarios, Productos y Ventas, implementando estrictamente Clean Architecture tanto en el frontend como en el backend.

## Alcance actual

La solución en este monorepositorio incluye:

- **Host Angular** en `4200` para navegación y orquestación de remotos con Module Federation.
- **Microfrontend de Usuarios** en `4201` con Clean Architecture (Listado, consulta por ID y registro).
- **Microfrontend de Productos** en `4202` con Clean Architecture (Listado, consulta por ID y registro).
- **Microfrontend de Ventas** en `4203` con Clean Architecture (Listado, consulta por ID y registro).
- **Microservicio de Usuarios** en `3001` con Clean Architecture y Swagger en `/api/docs`.
- **Microservicio de Productos** en `3002` con Clean Architecture y Swagger en `/api/docs`.
- **Microservicio de Ventas** en `3003` con Clean Architecture y Swagger en `/api/docs`.

## Puertos y responsabilidades

| Aplicación | Puerto | Responsabilidad |
| --- | ---: | --- |
| `Client-Host-Angular` | 4200 | Host Angular, Navbar global y navegación entre microfrontends |
| `Microfrontend-Users-Angular` | 4201 | Listado, consulta por ID y registro de usuarios |
| `Microservice-Users-NodeJS` | 3001 | API REST de usuarios; Swagger en `/api/docs` |
| `Microfrontend-Products-Angular` | 4202 | Listado, consulta por ID y registro de productos |
| `Microservice-Products-NodeJS` | 3002 | API REST de productos; Swagger en `/api/docs` |
| `Microfrontend-Sales-Angular` | 4203 | Listado, consulta por ID y registro de ventas |
| `Microservice-Sales-NodeJS` | 3003 | API REST de ventas; Swagger en `/api/docs` |

Los remotos se cargan desde:

- `http://localhost:4201/remoteEntry.js`
- `http://localhost:4202/remoteEntry.js`
- `http://localhost:4203/remoteEntry.js`

El host del proyecto navega hacia `/users`, `/products` y `/sales` usando Module Federation.

## Arquitectura aplicada

Cada vertical funcional (Usuarios, Productos, Ventas) respeta el patrón de arquitectura limpia establecido en el diagrama oficial del parcial:

```
[ MICROFRONT N ]
   ├── UseCase 1 (Listar)
   ├── UseCase 2 (Consultar por ID)
   └── UseCase 3 (Crear)
           │
           ▼
[ API GATEWAY / REPOSITORY ] (Http Repository)
           │
           ▼ (HTTP REST)
[ MICROSERVICE N ]
   ├── UseCase 1 (Listar)
   ├── UseCase 2 (Consultar por ID)
   └── UseCase 3 (Crear)
           │
           ▼
   [ REPOSITORY ] (InMemory Repository)
```

### Separación por capas:
- `domain`: entidades, modelos, tipos y contratos de negocio.
- `application`: puertos de repositorio (`*Repository`) y casos de uso independientes (`*UseCase`).
- `infrastructure`: adaptadores HTTP (`Http*Repository`) en frontend y persistencia (`InMemory*Repository`) en backend.
- `presentation`: componentes, controladores, páginas, rutas y plantillas.

## Ejecutar el sistema completo

Requiere Node.js 20+.

### Microservicios Backend

En terminales independientes:

```bash
cd Microservice-Users-NodeJS
npm start
```

```bash
cd Microservice-Products-NodeJS
npm start
```

```bash
cd Microservice-Sales-NodeJS
npm start
```

### Microfrontends Frontend y Host

En terminales independientes:

```bash
cd Microfrontend-Users-Angular
npm run start -- --port 4201
```

```bash
cd Microfrontend-Products-Angular
npm run start -- --port 4202
```

```bash
cd Microfrontend-Sales-Angular
npm run start -- --port 4203
```

```bash
cd Client-Host-Angular
npm run start -- --port 4200
```

## Verificación rápida

Navegador:
- `http://localhost:4200/users`
- `http://localhost:4200/products`
- `http://localhost:4200/sales`

Swagger / OpenAPI:
- `http://localhost:3001/api/docs`
- `http://localhost:3002/api/docs`
- `http://localhost:3003/api/docs`

## Documentación Técnica (Compodoc)

Para generar la documentación HTML con Compodoc en cualquiera de los proyectos Angular:

```bash
cd Client-Host-Angular && npm run compodoc
cd Microfrontend-Users-Angular && npm run compodoc
cd Microfrontend-Products-Angular && npm run compodoc
cd Microfrontend-Sales-Angular && npm run compodoc
```

## Pruebas y Cobertura (100%)

Todas las aplicaciones frontend y backend cuentan con cobertura total de pruebas unitarias cumpliendo los umbrales exigidos.

### Usuarios
```bash
# Frontend
cd Microfrontend-Users-Angular && npm test
# Backend
cd Microservice-Users-NodeJS && npm test
```

### Productos
```bash
# Frontend
cd Microfrontend-Products-Angular && npm test
# Backend
cd Microservice-Products-NodeJS && npm test
```

### Ventas
```bash
# Frontend
cd Microfrontend-Sales-Angular && npm test
# Backend
cd Microservice-Sales-NodeJS && npm test
```

### Client Host
```bash
cd Client-Host-Angular && npm test
```

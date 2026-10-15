# Parcial II - Microfrontends y Clean Architecture

Monorepositorio basado en el taller Angular/Module Federation y Node.js. La solución se divide en aplicaciones independientes; cada proceso se ejecuta desde la carpeta de su módulo.

## Componentes y puertos

| Aplicación | Puerto | Responsabilidad |
| --- | ---: | --- |
| `Client-Host-Angular` | 4200 | Host Angular y navegación de los remotos |
| `Microfrontend-Users-Angular` | 4201 | Listar, consultar y registrar usuarios |
| `Microservice-Users-NodeJS` | 3001 | API REST de usuarios; Swagger en `/api/docs` |
| `Microfrontend-Products-Angular` | 4202 | Listar productos mediante el API de Productos |
| `Microservice-Products-NodeJS` | 3002 | API REST de Productos; Swagger en `/api/docs` |
| Tercer microfrontend y microservicio | Por definir | Pendiente: el enunciado exige un tercer vertical y uno de los servicios en Spring Boot |

El microfrontend de Usuarios consume `http://localhost:3001/api/users`. El de Productos consume `http://localhost:3002/api/products?limit=10`. El host carga los remotos mediante Module Federation: Usuarios desde `http://localhost:4201/remoteEntry.js` y Productos desde `http://localhost:4202/remoteEntry.js`.

## Ejecutar el sistema integrado

Use Node.js 20+ y abra una terminal por proceso. Instale las dependencias de cada proyecto antes de iniciar. En las aplicaciones Angular, por la restricción transitiva de `jest-preset-angular`, use `npm install --legacy-peer-deps` (el lockfile conserva esa resolución).

```powershell
cd Microservice-Users-NodeJS; npm ci; npm run start
cd Microservice-Products-NodeJS; npm ci; npm run start
cd Microfrontend-Users-Angular; npm install --legacy-peer-deps; npm run start
cd Microfrontend-Products-Angular; npm install --legacy-peer-deps; npm run start
cd Client-Host-Angular; npm install --legacy-peer-deps; npm run start
```

Abra `http://localhost:4200/users` o `http://localhost:4200/products`. Verifique las APIs en `http://localhost:3001/api/docs` y `http://localhost:3002/api/docs`.

## Ejecutar la parte de Usuarios

Instala las dependencias una vez dentro de cada aplicación:

```powershell
cd Microservice-Users-NodeJS
npm ci
npm run start
```

En terminales separadas:

```powershell
cd Microfrontend-Users-Angular
npm ci
npm run start
```

```powershell
cd Client-Host-Angular
npm ci
npm run start
```

Abre `http://localhost:4200/users`. El microservicio de usuarios usa el puerto 3001 por defecto; se puede cambiar con la variable `PORT`.

## API de Usuarios

- `GET /api/users?limit=10`: lista de 1 a 100 usuarios.
- `GET /api/users/{id}`: consulta por identificador.
- `POST /api/users`: registra un usuario con nombre, apellido, edad (18-100), correo e ingeniería.
- `GET /api/docs`: documentación Swagger/OpenAPI.

El adaptador de persistencia actual es en memoria y carga tres registros de demostración al iniciar el servicio. Los registros creados se conservan mientras el proceso siga activo.

## Arquitectura de Usuarios

- `domain`: modelo `User` y datos de creación.
- `application/ports`: contrato del repositorio.
- `application/use-cases`: listar, consultar por id y registrar.
- `infrastructure`: repositorio en memoria (Node) y adaptador HTTP (Angular).
- `presentation`: rutas, controladores y componentes Angular.

## API de Productos

- `GET /api/products?limit=10`: lista de 1 a 100 productos.
- `GET /api/products/{id}`: consulta un producto por identificador.
- `POST /api/products`: crea un producto con `name`, `category` (`Lacteos`, `Carnes`, `Frutas` o `Verduras`) y `price` positivo.
- `GET /api/docs`: documentación Swagger/OpenAPI.

El repositorio de Productos mantiene el catálogo en memoria durante la ejecución. El microfrontend separa el adaptador HTTP (`services`), el caso de presentación (`ProductsPage`) y los componentes de visualización (`ProductsTableComponent` y `AlertComponent`). En backend, controlador y rutas son adaptadores de entrada y `ProductsService` concentra los tres casos de uso.

## Pruebas

En `Microfrontend-Users-Angular`:

```powershell
npm run test:coverage
```

Jest aplica umbrales mínimos del 90 % para ramas, funciones, líneas y sentencias en la lógica y presentación de Usuarios.

En `Microservice-Users-NodeJS`:

```powershell
npm test
```

El comando compila TypeScript y ejecuta pruebas unitarias con el runner integrado de Node.js.

En `Microfrontend-Products-Angular`:

```powershell
npm run test:coverage -- --runInBand
```

Jest exige al menos 90 % global en ramas, funciones, líneas y sentencias. En `Microservice-Products-NodeJS`, ejecute `npm test`; compila y prueba los casos de listar, consultar y crear.

## División de trabajo propuesta

Usuarios se conserva como implementación independiente. Productos queda integrado con sus operaciones de listar, consultar y crear en la API, y el listado en el microfrontend. Falta el tercer vertical solicitado por el enunciado (microfrontend, microservicio y su integración en el host), incluyendo un microservicio Spring Boot. No se incluyó aquí porque el entorno no cuenta con Java/Maven para construir y verificar responsablemente ese servicio.

> Nota de integración: `Microfrontend-Users-Angular/angular.json` conserva `src\\index.html`, que falla en sistemas tipo Unix al compilar. No se modificó por respetar la propiedad del módulo de Usuarios; debe coordinarse el mismo cambio a `src/index.html` con su responsable.

## Estándar de commits

Usar mensajes breves con prefijo convencional, según el historial del repositorio, por ejemplo: `feat(users): add user registration use case`, `test(users): cover user application flows` y `docs: document local execution`.

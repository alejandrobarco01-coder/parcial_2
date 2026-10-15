# Parcial II - Microfrontends y Clean Architecture

Monorepositorio basado en el taller Angular/Module Federation y Node.js. La solución se divide en aplicaciones independientes; cada proceso se ejecuta desde la carpeta de su módulo.

## Componentes y puertos

| Aplicación | Puerto | Responsabilidad |
| --- | ---: | --- |
| `Client-Host-Angular` | 4200 | Host Angular y navegación de los remotos |
| `Microfrontend-Users-Angular` | 4201 | Listar, consultar y registrar usuarios |
| `Microservice-Users-NodeJS` | 3001 | API REST de usuarios; Swagger en `/api/docs` |
| `Microfrontend-Products-Angular` | 4202 | Microfrontend existente de productos |
| `Microservice-Products-NodeJS` | 3002 | Microservicio existente de productos |
| Tercer microfrontend y microservicio | Por definir | Pendiente de completar en la otra parte del grupo; el servicio debe usar Spring Boot |

El microfrontend de Usuarios consume `http://localhost:3001/api/users`. Productos conserva la conexión de su taller base al servicio de Productos. El host carga los remotos de Usuarios y Productos mediante Module Federation.

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

## División de trabajo propuesta

Esta rama desarrolla el vertical de Usuarios con sus tres casos de uso en frontend y backend, además de pruebas, validación y documentación del servicio. La otra parte del grupo debe completar Productos con los tres casos de uso solicitados, agregar el tercer microfrontend y microservicio (uno debe ser Spring Boot), y revisar la integración final, los puertos y la documentación global antes de entregar.

## Estándar de commits

Usar mensajes breves con prefijo convencional, según el historial del repositorio, por ejemplo: `feat(users): add user registration use case`, `test(users): cover user application flows` y `docs: document local execution`.

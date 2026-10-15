# Microfrontend de Usuarios

Aplicación remota Angular 20 expuesta por Module Federation como `./UsersPage` en `http://localhost:4201/remoteEntry.js`. Se integra desde el host en la ruta `/users` y consume `Microservice-Users-NodeJS` en el puerto 3001.

## Arquitectura

- `domain/user.model.ts`: entidad y datos de registro.
- `application/ports/users.repository.ts`: contrato del repositorio.
- `application/use-cases/`: listar, consultar por id y registrar usuarios.
- `infrastructure/http-users.repository.ts`: adaptador HTTP.
- `pages/` y `components/`: interfaz de la aplicación.

## Ejecutar

```powershell
npm ci
npm run start
```

El servidor de desarrollo escucha en `http://localhost:4201`. Para compilar: `npm run build`.

## Pruebas unitarias y cobertura

```powershell
npm run test:coverage
```

Jest exige una cobertura global mínima del 90 % en ramas, funciones, líneas y sentencias de la lógica y presentación de esta aplicación.

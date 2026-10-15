# Host Angular

Aplicación central del monorepositorio que integra los microfrontends mediante Module Federation. El host escucha en `http://localhost:4200` y expone navegación hacia `/users` y `/products`.

## Ejecutar

```powershell
npm install --legacy-peer-deps
npm run start -- --port 4200
```

## Configuración de integración

El archivo `src/app/app.routes.ts` carga los remotos en tiempo de ejecución desde:

- `http://localhost:4201/remoteEntry.js` → `./UsersPage`
- `http://localhost:4202/remoteEntry.js` → `./ProductsPage`

## Verificación

Abre:

- `http://localhost:4200/users`
- `http://localhost:4200/products`

La navegación debe renderizar el contenido de cada microfrontend sin errores de carga remota.

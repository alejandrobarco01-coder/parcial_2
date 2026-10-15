# Guia para Crear Microfrontends

## 1 - Crear Proyecto de Angular

Vamos a crear un proyecto de angular en la versión 20.3.14 debido a que en esa version tenemos todos nuestros microfronteds

```
npx -p @angular/cli@20.3.14 ng new Microfrontend-Test-Angular
```

## 2 - Escoger Prepocesador de CSS

Escoger el sistema de CSS a gusto, recomendación SCSS/SASS

## 3 - ¿Trabajar con SSR?

Escogemos que NO vamos a trabajar con SSG/SSR

## 4 - ¿Trabajar con Zoneless?

Escogemos que NO vamos a trabajar con una App Zoneless

## 5 - Configurar Webpack Module Federation - Classic Version

Configuramos Webpack Module Federation para este Microfrontend

```
ng add @angular-architects/module-federation@20.0.0 --project Microfrontend-Test-Angular --port 4203
```

## 6 - Configuración del WebpackConfig

- Agregamos el nombre del Microfrontend en este caso va ser mf-test
- Configurar el filename con remoteEntry.js
- Configuramos la ruta de la pagina para exponer

## 7 - Verificar el remoteEntry.js

En la url donde se ejecuta el Microfrontend buscar el archivo /remoteEntry.js

## 8 - Configurar el Navbar y Routes del Host para el nuevo Microfrontend
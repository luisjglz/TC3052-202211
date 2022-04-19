# Introducción a React

## Agregar React a través de un CDN

Agregar React a un archivo HTML es muy simple, si consideramos que tenemos el siguiente archivo `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>This is my first website</title>
</head>
<body>
  <h1>This is my first website</h1>
  <p>Hi! My I'm Luis and this is my website. I like a lot of stuff like: </p>
  <ul>
    <li>Tennis</li>
    <li>Programming</li>
    <li>Soccer</li>
    <li>Guitar</li>
  </ul>
</body>
</html>
```

Para agregar React solo tenemos que importarlo de algún CDN como:

```
https://unpkg.com/react@16/umd/react.development.js
https://unpkg.com/react-dom@16/umd/react-dom.development.js
```

De tal forma que nuestro `index.html` quedaría de la siguiente manera:

```html
<!-- Después de la etiqueta </ul> -->
  <div id="react-app"></div>
  <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <script>
    window.onload = function() {
      class HelloWorld extends React.Component {
        render() {
          return React.createElement('p', null, 'Hello world');
        }
      }
      ReactDOM.render(React.createElement(HelloWorld), document.getElementById('react-app'));
    }
  </script>
<!-- Antes de la etiqueta </body> -->
```

Con esto es suficiente para tener React dentro de un archivo, sin embargo este acercamiento es el menos común y es el que más problema nos traera a futuro.

## Agregar React a través de Webpack

La otra forma de utilizar React es a través de un sistema de empaquetación de recursos como Webpack.

El primer paso será crear un nuevo proyecto y hacer:

```bash
npm init -y
```

Posteriormente agregamos a nuestro proyecto webpack.

```bash
npm install webpack webpack-cli
```

Modificamos nuestro archivo `package.json` para que considere un nuevo comando de tareas en npm.

```json
{
  // ...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --mode production"
  }
  // ...
}
```

Agregamos Babel a nuestro proyecto

```bash
npm i @babel/core babel-loader @babel/preset-env @babel/preset-react
```

Creamos el archivo `.babelrc` con el contenido de presets que indican cuales son las librerías que se van a cargar de babel:

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

Creamos un nuevo archivo de configuraciones para webpack, este es `webpack.config.js`  con el contenido:

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
```

Agregamos React al proyecto

```bash
npm i react react-dom
```

Agregamos un Loader de HTML a Webpack

```bash
npm i html-webpack-plugin html-loader
```

Posteriormente volvemos a modificar el `webpack.config.js` para que considere el nuevo loader:

```javascript
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};
```

Creamos nuestros archivos iniciales `src/index.html` y `src/index.js` con el siguiente contenido:

```html
<!-- src/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>This is my first website</title>
</head>
<body>
  <h1>This is my first website</h1>
  <p>Hi! My I'm Luis and this is my website. I like a lot of stuff like: </p>
  <ul>
    <li>Tennis</li>
    <li>Programming</li>
    <li>Soccer</li>
    <li>Guitar</li>
  </ul>
</body>
</html>
```

```javascript
// src/index.js
// no lleva contenido
```

Ejecutamos webpack:

```bash
npm run build
```

Nota que se esta ejecutando el `script` que corresponde a `build` indicado anteriormente. 

Este proceso nos genera un conjunto de archivos en una nueva carpeta `dest`.

Ahora sigue agregar nuestro componente de React.

Creamos un nuevo archivo en `src/js/components/HelloWorld.js` con el siguiente contenido:

```javascript
import React, { Component } from 'react';

class HelloWorld extends Component {
  render() {
    return (
      <p>Hello World!</p>
    )
  }
}

export default HelloWorld;
```

Después modificamos nuestro archivo `src/index.js`

```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';

import HelloWorld from './js/components/HelloWorld';

const appContainer = document.getElementById('react-app');
ReactDOM.render(<HelloWorld />, appContainer);
```

Por último en nuestro archivo `src/index.html` agregamos el nodo en donde se va a montar React.

```html
<!-- Después de la etiqueta </ul> -->
<div id="react-app"></div>
<!-- Antes de la etiqueta </body> -->
```

Ejecutamos webpack:

```bash
npm run build
```

Ahora verás el componente Hello World dentro del nodo donde se monto React.

Vamos a crear un nuevo componente `src/js/components/Hobbies.js` con el siguiente contenido:

```javascript
import React, { Component } from 'react';

class Hobbies extends Component {
  render() {
    return (
      <ul>
        {this.props.hobbies.map((hobby, i) => {
          return (
            <li key={i}>
              {hobby}
            </li>
          )
        })}
      </ul>
    )
  }
}

export default Hobbies;
```

Modificamos nuestro archivo `src/index.js` para que importe los hobbies y lo monte sobre un nuevo nodo.

```javascript
// ...
// import HelloWorld from './js/components/HelloWorld';

import Hobbies from './js/components/Hobbies';

// const appContainer = document.getElementById('react-app');
// ReactDOM.render(<HelloWorld />, appContainer);

const hobbiesContainer = document.getElementById('hobbies');
ReactDOM.render(<Hobbies hobbies={["Tennis","Programming","Soccer","Guitar"Reac]} />, hobbiesContainer);
```

Finalmente modificamos `src/index.html`:

```html
<!-- src/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>This is my first website</title>
</head>
<body>
 <h1>This is my first website</h1>
 <p>Hi! My I'm Luis and this is my website. I like a lot of stuff like: </p>
 <div id="hobbies"></div>
 <div id="react-app"></div>
</body>
</html>
```

## Agregar React a través de Create React Application

Como puedes ver hay muchas formas de utilizar React, sin embargo la forma "oficial" es utilizar `Create React Application`.

El primer paso es ejecutar `npx create-react-app {nombre_de_la_app}`, en este caso:

```bash
npx create-react-app hello-cra
```

Este archivo nos va agregar todas las referencias que necesitamos en el proyecto.

Modificamos el archivo `src/App.js` para que coincida con nuestras necesidades:

```javascript
import React from 'react';
import logo from './logo.svg';

function App() {
  return (
    <>
      <h1>This is my first website</h1>
      <p>Hi! My I'm Luis and this is my website. I like a lot of stuff like: </p>
      <ul>
        <li>Tennis</li>
        <li>Programming</li>
        <li>Soccer</li>
        <li>Guitar</li>
      </ul>
    </>
  );
}

export default App;
```

También modificamos el archivo `src/index.css` para que no tengamos estilos adicionales

```css
/* src/index.css se encuentra vacío */
```

Creamos un nuevo componente `src/Components/HelloWorld.js`:

```javascript
import React from 'react';

const HelloWorld = () => {
  return (
    <p>Hello World</p>
  );
}

export default HelloWorld;
```

Modificamos nuestro `App.js` para que utilice el componente:

```javascript
import React from 'react';
import logo from './logo.svg';
import HelloWorld from './Components/HelloWorld';

function App() {
  return (
    <>
      <h1>This is my first website</h1>
      <p>Hi! My I'm Luis and this is my website. I like a lot of stuff like: </p>
      <ul>
        <li>Tennis</li>
        <li>Programming</li>
        <li>Soccer</li>
        <li>Guitar</li>
      </ul>
      <HelloWorld />
    </>
  );
}
```

Podemos probar nuestra aplicación con `npm run start`.

Ahora vamos agregar el componente Hobbies `src/Components/Hobbies.js`.

```javascript
import React from 'react';

const Hobbies = (props) => {
  return (
    <ul>
      {props.hobbies.map((hobby, i) => {
        return <li key={i}>{hobby}</li>
      })}
    </ul>
  );
}

export default Hobbies;
```

Modificamos nuestro `App.js` para que contenga el componente `Hobbies`:

```javascript
import React from 'react';
import logo from './logo.svg';
import HelloWorld from './Components/HelloWorld';
import Hobbies from './Components/Hobbies';

function App() {
  return (
    <>
      <h1>This is my first website</h1>
      <p>Hi! My I'm Luis and this is my website. I like a lot of stuff like: </p>
      <HelloWorld />
      <Hobbies hobbies={["Tennis", "Programming", "Soccer", "Guitar"]} />
    </>
  );
}

export default App;
```


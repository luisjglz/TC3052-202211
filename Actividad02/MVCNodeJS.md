# Hello MVC en Node.js

## Iniciar tu proyecto

Crea una nueva carpeta para tu proyecto y dentro de la carpeta ejecuta el siguiente comando en tu terminal.

```bash
npm init -y
```

Después de ejecutar el comando se va a generar dentro de la carpeta el archivo `package.json` este archivo es el que utiliza `npm` para identificar los paquetes necesarios de tu proyecto.

El contenido de `package.json` será:

```json
{
  "name": "{El nombre de tu carpeta}",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

El argumento `-y` en el comando `npm init` llena los campos anteriores de forma automática. Si lo ejecutas sin el argumento `-y` se te pedirá que llenes cada uno de los campos.

## Agrega el paquete de Express.js a tu proyecto

[Express.js](https://expressjs.com/es/) es un paquete de _npm_ que nos provee de infraestructura para crear aplicaciones web con _Node.js_.

Para agregar el paquete de Express.js ejecuta el siguiente comando en tu terminal:

```bash
npm i express
```

Si ahora exploras tu archivo `package.json` vas a notar que tiene el paquete de `express` como parte de las dependencias de tu proyecto.

```json
{
  "name": "_03-hello-world-express",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "express": "^4.17.1" // <--- Dependencia de express.js
  }
}
```

Además de esta modificación vas a ver que en tu carpeta tienes la siguiente estructura de archivos.

```
- node_modules/
- package-lock.json
- package.json
```

La carpeta `node_modules` almacena todos los paquetes necesarios para ejecutar tu aplicación, es decir los paquetes indicados en las dependencias. 

El archivo `package-lock.json` es un archivo que se genera de forma automática al ejecutar algún comando de `npm` que modifique el archivo `package.json` (como `npm install express`). En este archivo podemos encontrar una representación actual de los paquetes que se encuentran en `node_modules`.

## Crea una web app

Para crear una web app en node tenemos que crear primero el archivo `index.js` dentro de este archivo coloca lo siguiente:

```js
// index.js
// Importa el paquete de express
let express = require('express');
// Obtiene una instancia de express
let app = express();
// Establece que al hacer una petición GET a la ruta / se conteste
// con las palabras "Hello World!"
app.get('/', (req, res) => {
  res.send('Hello World!');
});
// Comienza el servidor en el puerto 3000 de localhost
// para ver el sistema 
app.listen(3000,() => {
  console.log('App listening on port 3000! (http://localhost:3000)');
});
```

Una vez que tengas estás modificaciones ejecuta el comando:

```shell
node index.js
```

Verás el siguiente resultado en la línea de comandos:

```bash
# node index.js
App listening on port 3000! (http://localhost:3000)
```

Si entras en tu navegador a la dirección `http://localhost:3000` podrás ver tu web app en ejecución.

## Manejo de rutas y controladores

El siguiente paso será agregar el [manejo de rutas de Express.js](https://expressjs.com/es/guide/routing.html) con el fin de direccionar al usuario a los recursos que requiere de nuestra aplicación.

El flujo que tendremos en nuestra aplicación será:

1. El usuario realiza una petición.

2. El sistema identifica la ruta asociada a la petición.

3. La ruta reenvía la petición al controlador.

4. El controlador responde con el resultado de la petición (página web, objeto JSON, etcétera).

### Identificación de las rutas

El primer paso será agregar un archivo en donde vamos a guardar nuestras rutas. Crea una nueva carpeta con el nombre de routes y adentro crea el archivo `app.js`. El contenido del archivo será:

```js
// routes/app.js
// De express obtiene una instancia del componente Router
let router = require('express').Router();

// Establece que al hacer una petición GET a la ruta / se conteste
// con las palabras "Hello World!"
router.get('/', (req, res) => {
  res.send('Hello World!');
});

// Identifica la ruta "/about" y la respuesta de la ruta
router.get('/about', (req, res) => {
  res.send('About us');
});

// Exporta las configuraciones
module.exports = router;
```

Ahora modifica el archivo `index.js` para que las peticiones sean gestionadas por el `routes/app.js`.

```js
// index.js
// Importa el paquete de express
let express = require('express');
// Obtiene una instancia de express
let app = express();

// Importa las configuraciones
let appRoutes = require('./routes/app');

// Define que configuraciones de rutas se van a utilizar para la ruta
app.use('/', appRoutes);

// Comienza el servidor en el puerto 3000 de localhost
// para ver el sistema
app.listen(3000,() => {
  console.log('App listening on port 3000! (http://localhost:3000)');
});
```

### Uso de los controladores

Además de definir la respuesta de una petición como una función en la ruta, también se puede crear un componente conocido como un controlador, de esta manera. La ruta envía la petición a un controlador que implementa las reglas de negocio y contesta con una respuesta a la petición.

El siguiente paso es crear una carpeta `controllers` y dentro de ella crearemos el archivo `PagesController.js`.

```js
// controllers/PagesController.js

// Reglas para la respuesta para la petición "/"
exports.homepage = (req, res) => {
  res.send('Hello World!');
}

// Reglas para la respuesta para la petición "/about"
exports.about = (req, res) => {
  res.send('About us');
}
```

Ahora modifica el archivo `routes/app.js` para que utilice el controlador

```js
// routes/app.js
// De express obtiene una instancia del componente Router
let router = require('express').Router();
// Importa el controlador que creamos
let PagesController = require('../controllers/PagesController');

// Establece que al hacer una petición GET a la ruta / se conteste
// con las palabras "Hello World!"
router.get('/', PagesController.homepage);

// Identifica la ruta "/about" y la respuesta de la ruta
router.get('/about', PagesController.about);

// Exporta las configuraciones
module.exports = router;
```

## Manejo de las vistas

Hasta ahora nuestras peticiones han contestado texto simple, sin embargo la creación de las páginas web requiere no solo de texto, sino de imágenes, links, videos, etcétera. Para tener este tipo de respuestas lo más recomendable es utilizar un `motor de vistas` (en inglés, _view engine_). 

En Express.js puedes utilizar muchos motores de vistas, puedes [ver un listado de los motores aquí](https://expressjs.com/es/guide/using-template-engines.html). Para este ejemplo utilizaremos [Handlebars](https://www.npmjs.com/package/express-handlebars).

El primer paso que tenemos que hacer es indicarle a `node.js` que vamos a utilizar el paquete `express-handlebars`. Ejecuta en tu línea de comandos:

```bash
npm i express-handlebars
```

Nota que no escribimos `npm install *` sino `npm i *` los dos comandos ejecutan las mismas acciones y la única diferencia esta en la forma en que se escriben. Toma en cuenta esto por que en muchas referencias lo podrás encontrar expresado de distintas maneras para distintos comandos.

Ahora modifica `index.js` para indicarle a Express.js que se va a utilizar Handlebars como nuestro motor de vistas.

```js
// index.js
// Importa el paquete de express
let express = require('express');
// Obtiene una instancia de express
let app = express();

// Importa las configuraciones
let appRoutes = require('./routes/app');

// Define que configuraciones de rutas se van a utilizar para la ruta
app.use('/', appRoutes);

// Configuraciones de las vistas
let exphbs = require('express-handlebars');
// Define la extensión que se va a utilizar para los archivos que representan
// las vistas
const extNameHbs = 'hbs';
// Crea una instancia de hbs con las conifugraciones definidas
let hbs = exphbs.create({extname: extNameHbs});
// Establece el uso de handlebars dentro de express.js
app.engine(extNameHbs, hbs.engine);
app.set('view engine', extNameHbs);

// Comienza el servidor en el puerto 3000 de localhost
// para ver el sistema
app.listen(3000,() => {
  console.log('App listening on port 3000! (http://localhost:3000)');
});
```

Handlebars requiere que exista un archivo conocido como el _layout_ en donde se va a colocar el contenido del sitio, por lo general el _layout_ establece los elementos que son comunes entre todas las vistas del sitio.

Crea una carpeta `views/layouts` y adentro coloca el archivo `main.hbs` nota que la extensión del archivo `.hbs` y está fue definida en el archivo `index.js`.

```handlebars
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Página de ejemplo</title>
</head>
<body>
    {{{body}}}
</body>
</html>
```

Todas las vistas que maneja Handlebars tendrán la extensión `.hbs` esto es por definición nuestra. En convención podrás encontrar que lo manejan como `.hbs` y `.handlebars`.

Recuerda que lo que queremos lograr es que nuestro controlador responda una respuesta en `html` por lo tanto tenemos que crear la vista que va a responder nuestro controlador.

Crea dentro de la carpeta `views` una nueva carpeta que se llame `pages`, dentro de esta carpeta crea un archivo llamado `homepage.hbs`

```handlebars
<!-- views/pages/homepage.js -->
<h1>Hello MVC</h1>
<p>This is my first page</p>
```

Ahora modifica tu controlador `controllers/PagesController.js` para que su respuesta sea el archivo `homepage` nota que no es necesario definir la extensión del archivo en la respuesta. 

```js
// controllers/PagesController.js

// Reglas para la respuesta para la petición "/"
exports.homepage = (req, res) => {
  // Definimos la vista a responder. Nota que se usa la función "render" y no "send".
  res.render('pages/homepage');
}

// Reglas para la respuesta para la petición "/about"
exports.about = (req, res) => {
  res.send('About us');
}
```

Si exploras el código fuente de la respuesta que te dio al visitar el sitio podrás notar que la etiqueta `{{{body}}}`dentro del `views/layouts/main.hbs` fue sustituida por el contenido de `homepage.hbs`.

Modifica la función `PagesController.about` para que también responda una vista de Handlebars.

## Uso de modelos dentro de Express

Por último incluiremos modelos dentro de nuestro pequeño sistema, los modelos son representaciones de las entidades que tiene nuestro sistema. Por ejemplo si tenemos un sistema de registro veterinario probablemente tengamos los siguientes modelos:

* Doctores

* Mascotas

* Dueños

* Medicinas

Los datos de los modelos por lo general están almacenados en una base de datos relacional la cual puede ser manejada a través de MySQL, PostgreSQL, SQL Server etcétera. O bien, utilizando una base de datos no relacional como MongoDB, Cassandra, Redis, etcétera.

Este primer acercamiento utilizará una base de datos relacional a través de MySQL.

### Integración de Knex.js

Para realizar la conexión con MySQL utilizaremos el paquete de [Knex.js](http://knexjs.org/). Knex.js es un Query Builder que nos facilita la construcción de nuestros _queries_ y el manejo de la base de datos. A parte de poder utilizar este _query builder_, Node también cuenta con ORM (_Object Relational Mapping_), los cuales a parte de ser un _query builder_ nos ayudan a transformar las respuestas de nuestros _queries_ en objetos que podemos usar en nuestro sistema. 

Para utilizar Knex.js primero utilizaremos un paquete conocido como [dotenv](https://www.npmjs.com/package/dotenv). Con este paquete podemos manejar las variables de entorno que utilizará nuestro sistema.

#### Integración de dotenv

Importa el paquete `dotenv` a tu proyecto:

```bash
npm i dotenv
```

Crea dentro de la carpeta raíz de tu proyecto el archivo `.env`.

```bash
# .env
# Define el ambiente en el cual se esta ejecutando node. Recuerda que los ambientes
# más comuns son:
#   * development: por lo general es tu computadora local, es tu ambiente de desarrollo.
#   * production: es el ambiente donde los usuarios interactúan con el sistema.
#   * staging: es el ambiente en donde se hacen pruebas por usuarios que no son los desarrolladores
#   * testing: es un ambiente de pruebas que es utilizado por desarrolladores QA
NODE_ENV=development

# Define el puerto en dónde se va a ejecutar Express.js
EXPRESS_PORT=3000
```

En este archivo puedes notar que hemos definido dos variables `NODE_ENV` y `EXPRESS_PORT`. Como este archivo puede cambiar de desarrollador a desarrollador o de ambiente a ambiente se recomienda no subir este archivo a tu carpeta del repositorio (colocarlo en un `.gitignore`) sin embargo es una buena práctica subir un ejemplo de las variables que se tienen que definir en un archivo `.env.example`.

Para usar las variables de ambiente es recomendable definir una carpeta de configuraciones. Crea una carpeta `configs` y dentro de ella crea el archivo `app.js`.

```js
// configs/app.js
// Importa el paquete dotenv
const dotenv = require('dotenv');

// Carga la configuración del ambiente
dotenv.config();

// Crea un objecto con la información de la configuración
const appConfig = {
  // Establecemos valores por defecto
  // Como ninguna versión de Node soporta _nullish coalescing operator (??)_ tenemos
  // que usar una operación lógica.
  env: process.env.NODE_ENV || 'development',
  express_port: process.env.EXPRESS_PORT || 3306
}

module.exports = appConfig;
```

Ahora importa las configuraciones de la app dentro de tu archivo `index.js`:

```js
// index.js

// ... Otro código que habíamos escrito ...

// Importa la configuración de la app
let appConfig = require('./configs/app');

// Comienza el servidor en el puerto 3000 de localhost
// para ver el sistema
app.listen(appConfig.express_port,() => {
  let show = 'App listening on port ' + appConfig.express_port + '! (http://localhost:' + appConfig.express_port +')';
  console.log(show);
});
```

### Uso de MySQL en Express

Ahora que ya tenemos `dotenv` en nuestra aplicación utilizaremos los paquetes necesarios para la base de datos.

Primero debemos de instalar [Knex.js](http://knexjs.org/) de forma global. Cuando instalas un paquete de forma global este estará disponible en cualquier ubicación de tu computadora y solo tiene que ser instalado una vez.

Para instalar knex de forma global usa:

```bash
npm i knex -g
```

El argumento `-g` en el comando `npm i` indica que el paquete se va a instalar de forma global.

Prueba que knex este instalado ejecutando el siguiente comando:

```bash
knex --version
# Imprime:
# Knex CLI version: 0.20.8
# Knex Local version: 0.20.9
```

Ahora define dentro de las dependencias los paquetes de [Knex.js](http://knexjs.org/) y [MySQL2](https://www.npmjs.com/package/mysql2).

```bash
npm i mysql2 knex
```

Si revisas tu archivo `package.json` puedes ver que ahora las dependencias tiene la aplicación son:

```js
// package.json
{
  // ... otra porción de código ...
  // Dependencias de tu aplicación web
  "dependencies": {
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "express-handlebars": "^3.1.0",
    "knex": "^0.20.9",
    "mysql2": "^2.1.0"
  }
}
```

Una vez que tengamos los paquetes definidos en nuestro sistema ahora procederemos a generar el archivo `knexfile.js` en nuestro proyecto. Ejecuta:

```bash
knex init
# Created ./knexfile.js
```

Lo primero que vamos hacer es definir las variables de ambiente que usará. Agrega en  el archivo `.env` las siguientes variables de ambiente:

```bash
DB_DEVELOPMENT_HOST=
DB_DEVELOPMENT_PORT=
DB_DEVELOPMENT_NAME=
DB_DEVELOPMENT_USER=
DB_DEVELOPMENT_PASSWORD=

DB_PRODUCTION_HOST=
DB_PRODUCTION_PORT=
DB_PRODUCTION_NAME=
DB_PRODUCTION_USER=
DB_PRODUCTION_PASSWORD=
```

Cada variable de ambiente tendrá los valores que tu webapp necesite para conectarse a la base de datos, de forma particular mi webapp necesita los siguientes valores:

```bash
# .env
# ... Otras variables de ambiente ...
DB_DEVELOPMENT_HOST=127.0.0.1
DB_DEVELOPMENT_PORT=3306
DB_DEVELOPMENT_NAME=hello_mvc
DB_DEVELOPMENT_USER=root
DB_DEVELOPMENT_PASSWORD=

DB_PRODUCTION_HOST=127.0.0.1
DB_PRODUCTION_PORT=3306
DB_PRODUCTION_NAME=hello_mvc
DB_PRODUCTION_USER=root
DB_PRODUCTION_PASSWORD=
```

*Importante*: La base de datos definida en el ambiente (`DB_DEVELOPMENT_NAME`  o `DB_PRODUCTION_NAME`) ya tiene que existir en la base de datos.

Después de definir estas variables procederemos a cargar estas variables dentro del `knexfile.js`:

```js
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_DEVELOPMENT_HOST || 'localhost',
      port: process.env.DB_DEVELOPMENT_PORT || '3306',
      database: process.env.DB_DEVELOPMENT_NAME || 'my_database',
      user:  process.env.DB_DEVELOPMENT_USER || 'root',
      password: process.env.DB_DEVELOPMENT_PASSWORD || ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_PRODUCTION_HOST || 'localhost',
      port: process.env.DB_PRODUCTION_PORT || '3306',
      database: process.env.DB_PRODUCTION_NAME || 'my_database',
      user:  process.env.DB_PRODUCTION_USER || 'root',
      password: process.env.DB_PRODUCTION_PASSWORD || ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
```

Ahora crearemos el archivo que contiene el objeto que usaremos para nuestras conexiones. Crea la carpeta `database` y crea el archivo `connection.js`:

```js
// database/connection.js
// Obtiene las configuraciones del sistema
let appConfig = require('../configs/app');

// Importa el archivo knexfile.js
const knexfile = require('../knexfile');

// Obtiene los datos de configuración dependiendo del ambiente de la aplicación
// con esos datos de configuración crea una instancia de knex
const knex = require('knex')(knexfile[appConfig.env]);

module.exports = knex
```

Una vez que ya tenemos las configuraciones y el archivo de conexión vamos a crear nuestra primera migración. La migración es un archivo que indica cuales son las operaciones que se tienen ejecutar para crear la base de datos.

```bash
knex migrate:make create_products_table
# Using environment: development
# Using environment: development
# Using environment: development
# Created Migration: ../migrations/20200209233025_create_products_table.js
```

Puedes ver que este comando nos generó un archivo `migrations/*create_products_table.js`. Dentro de este archivo puedes encontrar dos funciones `up` y `down`. La función `up`define cuales son todas las operaciones que quieres realizar en tu base de datos y la función `down` define las operaciones necesarias para dejar la base de datos en el estado anterior a ejecutar `up`.

Dentro de `create_products_table.js`coloca:

```js
exports.up = function(knex) {
  return knex.schema
    .createTable('products', (table) => {
      table.increments('id');
      table.string('name', 255).notNullable();
      table.string('description', 512).notNullable();
      table.float('price');
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('products');
};
```

Ahora ejecuta:

```bash
knex migrate:latest
# Using environment: development
# Batch 1 run: 1 migrations
```

Si queremos colocar datos dentro de nuestra base de datos podemos utilizar las semillas (_seeds_) para colocar información inicial dentro de nuestra plataforma. Para hacer esto primero tenemos que generar la semilla (_seed_).

```bash
knex seed:make 01_products
# Using environment: development
# Using environment: development
# Using environment: development
# Created seed file: .../seeds/01_products.js
```

Dentro de `seeds/01_products.js` podemos generar nuestros productos:

```js
// seeds/01_products.js
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('products').del()
    .then(function () {
      // Inserts seed entries
      return knex('products').insert([
        { name: 'T-800', description: 'Hasta la vista baby!', price: 100 },
        { name: 'T-850', description: 'A little better than T-800 mode.', price: 200 },
        { name: 'T-800', description: 'Exterminates all life on earth.', price: 300 },
      ]);
    });
};
```

Para ejecutar el seed utilizamos el comando:

```bash
knex seed:run
# Using environment: development
# Ran 1 seed files
```

Si vemos nuestra base de datos notaremos que ya tenemos productos creados en nuestra base.

### Creación del model Products

Nuestra base de datos contiene la tabla `products` que representan los productos dentro del sistema sin embargo no tenemos aún una forma de accederlos desde nuestros controladores. Para lograr esta interacción usaremos modelos. 

Crea una carpeta de nombre `models` y crea el archivo `Product.js`.

```js
// models/Product.js
// Obtiene la conexión con la base de datos
const knex = require('../database/connection');

// Crea un nuevo Producto (pero no lo almacena en la base)
exports.factory = (name, description, price) => {
  return {
    name: name,
    description: description,
    price: price
  }
}

// Obtiene todos los productos en la base
exports.all = () => {
  // Realiza la consulta dentro de knex
  return knex
    .select('*')
    .from('products');
}
```

Modifica el archivo `PagesController` para que en la función `homepage` busque los productos en el sistema:

```js
// controllers/PagesController.js
// Importa el modelo de productos
let ProductModel = require('../models/Product')

// Reglas para la respuesta para la petición "/"
exports.homepage = (req, res) => {
  // Nota que la consulta a los productos utiliza "promesas"
  // conoce más en: 
  // https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Promise
  ProductModel.all()
    .then((data) => {
      // Guardamos los productos en una variable
      let products = data;
      // Enviamos los datos a la vista
      res.render('pages/homepage', { products: products });
    });
}

// Reglas para la respuesta para la petición "/about"
exports.about = (req, res) => {
  res.send('About us');
}
```

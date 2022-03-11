# Autenticación en Node.js

## Requisitos

Descarga el repositorio: [https://github.com/luisjglz/TC3052-202211/Actividad04/CRUD-bicicletas-start.zip](https://github.com/luisjglz/TC3052-202211/Actividad04/CRUD-bicicletas-start.zip)

Instala el proyecto en tu sistema:

```bash
npm init
```

Ejecuta el proyecto en tu sistema

```bash
node server.js
```

Algunos cambios a otros proyectos que habíamos manejado:

* Estamos ejecutando Node.js sobre el archivo `server.js` anteriormente lo hacíamos a través de un archivo `app.js`. El nombre del archivo es a tu discreción.

* Las rutas ahora están almacenadas en `routes/web.js` en vez de `routes/app.js`

* Se está utilizando el paquete [Handlebars Helpers](https://github.com/helpers/handlebars-helpers) para facilitar algunas funciones dentro de las vistas de `handlebars` en particular el año que aparece en el pie de página en las páginas de _login_ y _register_.

## Almacenar un usuario

Para manejar la autenticación primero tenemos que registrar un usuario. Los datos de nuestros usuarios son: 

* Nombre

* Correo

* Contraseña

Por lo cual las primeras acciones que tenemos que realizar son:

1. Configurar nuestro sistema para el uso de knex.js

2. Crear la migración de los usuarios.

3. Ejecutar la migración.

4. Almacenar los datos de los usuarios.

### Configuraciones de la base de datos

El primer paso es configurar Knex.js en nuestro proyecto. Si ya tenemos knex instalado de forma global el siguiente paso es importarlo e importa nuestra librería para conectarse a la base de datos.

```shell
npm i mysql2 knex
```

Posteriormente nos apoyamos del comando `knex init` para crear el archivo `knexfile.js`.

Ahora modificamos nuestro archivo `knexfile.js` para que use nuestras variables de entorno.

```javascript
// knexfile.js
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

A continuación creamos nuestro archivo de conexión `database/connection.js`.

```javascript
let appConfig = require('../configs/app');
const knexfile = require('../knexfile');
const knex = require('knex')(knexfile[appConfig.env]);
module.exports = knex;
```

### Crear la migración de los usuarios

El siguiente paso es crear la migración que almacene los datos del usuario, considera que los datos que vamos almacenar son el nombre, correo y contraseña.

```bash
knex migrate:make create_users_table
# Created Migration: ...._create_users_table.js
```

Mientras que nuestro archivo `create_users_table.js` cuenta con:

```javascript
exports.up = function(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id');
      table.string('name', 255).notNullable();
      table.string('email', 255).notNullable();
      table.string('password', 512).notNullable();
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('users');
};
```

Finalmente ejecutamos la migración:

```bash
knex migrate:latest
# Using environment: development
# Batch 1 run: 1 migrations
```

*Nota*: si quisieras ejecutar el comando en el ambiente de producción sería: `knex migrate:latest --env=production`. 

## Almacenar los datos del usuario

El almacenamiento de un usuario vendrá cuando este se registre, por lo tanto debemos de realizar modificaciones en nuestro formulario de registro y el controlador que procesa esta petición.

Crea en el archivo de rutas una nueva ruta que responda a una petición `POST /register` y crea la función que la va a procesar en el controlador.

```javascript
// routes/web.js
// ...
router.post('/register', authController.store);
```

```javascript
// controllers/AuthController.
// ...
exports.store = (req, res) => {
  res.send('Registrar usuario');
}
```

Para obtener los datos del formulario debemos de agregar la configuración del body-parser en el sistema.

```javascript
// server.js
// ...
app.use(express.urlencoded({ extended: true }))
```

Finalmente nuestra modificación en HTML quedaría:

```html
<form class="form-signin" method="POST" action="/register">
  <div class="text-center mb-4">
    <h1 class="h3 mb-3 font-weight-normal">Register</h1>
    <p>
      Template source:
        <a href="https://getbootstrap.com/docs/4.0/examples/" target="_blank">
          https://getbootstrap.com/docs/4.0/examples/
        </a>
    </p>
    <p>
      Already have an account? <a href="/login">Login</a>
    </p>
  </div>

  <div class="form-label-group">
    <input type="text" name="name" id="inputName" class="form-control" placeholder="Name">
    <label for="inputName">Name</label>
  </div>

  <div class="form-label-group">
    <input type="email" name="email" id="inputEmail" class="form-control" placeholder="Email address">
    <label for="inputEmail">Email address</label>
  </div>

  <div class="form-label-group">
    <input type="password" name="password" id="inputPassword" class="form-control" placeholder="Password">
    <label for="inputPassword">Password</label>
  </div>

  <div class="form-label-group">
    <input type="password" name="confirm_password" id="inputConfirmPassword" class="form-control" placeholder="Password">
    <label for="inputConfirmPassword">Confirm password</label>
  </div>

  <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
  <p class="mt-5 mb-3 text-muted text-center">© {{year}}</p>
</form>
```

El siguiente paso será validar que el usuario nos este dando la infomación correcta, para esto usaremos [express-validator](https://express-validator.github.io/docs/).

```shell
npm i express-validator
```

Ahora creamos una nueva carpeta que se llame `validators` y dentro de ella colocaremos un archivo nuevo que se llame `AuthValidator.js`.

Dentro de este archivo definiremos nuestras reglas de validación. La primera de ellas será que el nombre no puede estar vacío.

```js
// validators/AuthValidator.js
// Importamos express-validators para ayudarnos a implementar las reglas
// de validación
const { check } = require('express-validator');

// Escribimos las reglas de validación para la acción register
exports.store = [
  // Revisa que el nombre no sea vacío
  check('name').notEmpty()
];
```

Después en tu archivo de rutas `routes/web.js` , modifica la función que se encarga del registro del usuario para que implemente las reglas de validación:

```js
// routes/web.js
let authValidator = require('../validators/AuthValidators');
// ...
router.post('/register', authValidator.store, authController.store);
// ...
```

Finalmente modifica el controlador para que pueda manejar cuando sucede un error de este tipo:

```js
// controllers/AuthController
const { validationResult } = require('express-validator');
// ...
exports.store = (req, res) => {
  // Identifica si hubieron errores en el request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Si los hubieron entonces regresa a la petición anterior
    return res.status(422).json({ errors: errors.array() });
  }
  res.send('Registrar usuario');
}
```

Nota que cuando sucede el error se muestra una respuesta en formato JSON, este tipo de respuesta no es muy útil para el usuario por lo cual haremos que el usuario sea redireccionado al formulario de registro y este le indique cual fue el problema que hubo.

Para lograr esto usaremos las variables de sesión flash, estas variables de sesión tienen como particularidad que una vez que son consultadas entonces son "limpiadas".

Si queremos utilizar variables de sesión flash en express tenemos que importar los siguientes paquetes:

```shell
npm i cookie-parser express-session express-flash
```

Los configuramos en nuestra aplicación en `server.js`.

```js
// server.js
let cookieParser = require('cookie-parser');
let session = require('express-session');
let flash = require('express-flash');
let sessionStore = new session.MemoryStore;

// Configurations
// app.use(express.urlencoded({ extended: true }))

app.use(cookieParser());
app.use(session({
  cookie: { maxAge: 60000 },
  store: sessionStore,
  saveUninitialized: true,
  resave: 'true',
  secret: appConfig.secret
}));
app.use(flash());
```

Modificamos `config/app.js` para que tenga el atributo secret y este dependa de una variable de ambiente.

```javascript
// config/app.js
// ...
const appConfig = {
  env: process.env.APP_ENV || 'development',
  expressPort: process.env.EXPRESS_PORT || 3306,
  secret: process.env.APP_SECRET || 'YOU_SHOULD_NOT_USE_THIS_SECRET',
}
// ...
```

Después hacemos la modificación en `AuthController.js` para que guarde los errores en una variable flash y que esa variable flash sea envíada a la vista.

```js
// controllers/AuthController.js
exports.register = (req, res) => {
  res.render('auth/register', {
    layout: 'auth',
    errors: req.flash('errors')
  });
}

exports.store = (req, res) => {
  // Identifica si hubieron errores en el request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('errors', errors.array());
    return res.redirect('back');
  }
  res.send('Registrar usuario');
}
```

Por último desplegamos los errores dentro de nuestro formulario:

```handlebars
  <!-- views/auth/register.hbs -->
  <!-- <p> -->
  <!--  Already have an account? <a href="/login">Login</a> -->
  <!-- </p> -->
  <!-- </div> -->

  {{#if errors.length}}
    <div class="alert alert-danger">
      Oops! the following errors were found:
      <ul>
        {{#each errors}}
          <li>[{{param}}]: {{msg}}</li>
        {{/each}}
      </ul>
    </div>
  {{/if}}

  <!-- <div class="form-label-group"> -->
  <!--  <input type="text" name="name" id="inputName" class="form-control" placeholder="Name"> -->
  <!--    <label for="inputName">Name</label> -->
  <!-- </div> -->
```

Por último terminamos de escribir las reglas para los otros campos:

```js
// Escribimos las reglas de validación para la acción register
exports.store = [
  // Revisa que el nombre no sea vacío
  check('name').notEmpty(),
  // Revisa que el correo sea un mail
  check('email').isEmail(),
  // Revisa que el password este definido
  check('password').notEmpty(),
  // Revisa que el password sea el mismo
  check('password').custom((value, {req, loc, path}) => {
    if (value !== req.body.confirm_password) {
      throw new Error("Passwords don't match");
    } else {
      return value;
    }
  })
];
```

Una vez que ya hemos realizado la validación, el siguiente paso será almacenar nuestro usuario en la base de datos.

Creamos nuestro modelo de Usuario dentro de `models/Users.js`:

```js
// models/Users.js
const knex = require('../database/connection');

exports.create = (user) => {
  return knex('users')
    .insert({ name: user.name, email: user.email, password: user.password });
}
```

Esta instrucción nos permite almacenar el usuario sin embargo su contraseña no estará protegida y podría ser leída facilmente en el caso de que alguien vea la base de datos. Para evitar este problema podemos utilizar un paquete que nos facilite la encriptación de la contraseña.

Importa dentro de tu sistema le paquete: [Bcryptjs](https://www.npmjs.com/package/bcryptjs).

```bash
npm i bcryptjs
```

Ahora modifica la función de crear un usuario para que la contraseña se almacene encriptada.

```js
// models/Users.js
const knex = require('../database/connection');
const bcrypt = require('bcryptjs')

exports.create = (user) => {
  // Obtiene la contraseña definida por el usuario
  let pass = user.password;
  // Encripta la contraseña
  pass = bcrypt.hashSync(pass, 10);
  return knex('users')
    .insert({ name: user.name, email: user.email, password: pass });
}
```

Por último nuestro controlador quedaría de la siguiente forma:

```js
// controllers/AuthController.js
exports.store = (req, res) => {
  // Identifica si hubieron errores en el request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('errors', errors.array());
    return res.redirect('back');
  }
  // Crea el usuario
  userModel.create({ name: req.body.name, email: req.body.email, password: req.body.password })
    .then((data) => {
      // Indica que el usuario fue creado con éxito
      return res.send('Usuario registrado con éxito');
    })
    .catch((error) => console.log(error));
}
```

## Inicio de sesión

Una vez que ya hemos registrado al usuario vamos a iniciar sesión con el nuevo usuario.

Para implementar el inicio de sesión vamos a utilizar el paquete de [Passport.js](http://www.passportjs.org/), así como un paquete complementario de Passport.js que es Passport-Local.

```bash
npm i passport passport-local
```

En nuestro archivo de `server.js`, importamos `passport` y lo inicializamos.

```js
// server.js
let passport = require('passport');
```

Después creamos un archivo de configuración de passport: `configs/passport.js`.

```js
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let UserModel = require('../models/User');
let bcrypt = require('bcryptjs');

const userTableFields = {
  usernameField: 'email',
  passwordField: 'password'
};

const verifyCallback = (email, password, done) => {
  UserModel.findByEmail(email)
    .then((user) => {
      // Si no encuentra un usuario entonces regresa falso
      if (!user) {
        return done(null, false);
      }
      // Si encuentra un usuario y coincide con la contraseña entonces
      // inicia la sesión
      let isValid = bcrypt.compareSync(password, user.password);
      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => {
      done(err);
    });
}

const strategy  = new LocalStrategy(userTableFields, verifyCallback);

passport.use(strategy);

// Guarda en las variables de sesión el id del usuario loggeado
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Cierra la sesión del usuario
passport.deserializeUser((id, done) => {
  UserModel.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch(err => done(err))
});
```

Finalmente regresamos a `server.js` para incluir este archivo de configuraciones:

```js
// server.js
// ...
// Configuraciones de passport
require('./configs/passport');
app.use(passport.initialize());
app.use(passport.session());
```

Para verificar que el usuario tiene una sesión exitosa agrega en las rutas:

```js
// routes/web.js
let passport = require('passport');
// ...
router.get('/protected', (req, res) => {
  res.send('Usuario logueado con éxito');
});
router.get('/login-fail', (req, res) => {
  res.send('El usuario no tiene una sesión válida');
});
```

# 

## Conoce más en:

* [https://levelup.gitconnected.com/everything-you-need-to-know-about-the-passport-local-passport-js-strategy-633bbab6195](https://levelup.gitconnected.com/everything-you-need-to-know-about-the-passport-local-passport-js-strategy-633bbab6195)

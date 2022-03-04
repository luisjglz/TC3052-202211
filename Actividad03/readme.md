# CRUD en Node.js

## Insertar

### Vista de crear un producto

Agrega un link a una vista nueva que muestra un formulario de productos, recuerda que el proceso es:

1. Crear un controlador.

2. Crear la función dentro del controlador.

3. Crear la ruta dentro de nuestro archivo de rutas.

4. En la función del controlador crear la vista que vamos a regresar.

La información que vamos a capturar es nombre y precio, nuestro archivo tendrá un código similar a:

```handlebars
<!-- views/products/create.hbs -->
<h1>Add a new product</h1>
<form method="POST" action="/products">
    <div>
        <label for="name">Name: </label>
        <input type="text" id="name" name="name">
    </div>
    <div>
        <label for="price">Price: </label>
        <input type="text" id="price" name="price">
    </div>
    <div>
        <input type="submit" value="Store">
    </div>
</form> 
```

Nota que lo estamos enviando a la ruta `/products` a través del método `POST`. Por lo tanto en nuestras rutas debemos de manejar esta petición. 

```js
// routes/app.js

// ...

// Identifica la ruta /products/create y la envía al controlador
router.get('/products/create', ProductsController.create);
// Almacena el producto
router.post('/products', ProductsController.store);

// ...
```

### Leer el input del usuario

Para leer el input del usuario primero debemos de importar el módulo de [body-parser](https://www.npmjs.com/package/body-parser) (incluído en express.js).

```js
// index.js

// Importa el paquete de express
let express = require('express');
// Obtiene una instancia de express
let app = express();

// Importa el modulo para leer el input del usuario
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// ...
```

Después en nuestra función de almacenamiento en nuestro `ProductsController.js` podemos imprimir el contenido del `input` del usuario usando `console.log(req.body)`.

```js
// controllers/ProductsController.js
// Reglas para la respuesta para la petición "/products/create"
exports.create = (req, res) => {
  res.render('products/create');
}

// Almacena el producto
exports.store = (req, res) => {
  console.log(req.body);
  res.send('Producto almacenado');
}
```

```bash
node index.js
# App listening on port 3000! (http://localhost:3000)
# { name: 'iPad XI', price: '2500' }
```

### Almacenar el producto

Ya que tenemos la información del usuario en nuestro `req.body` podemos almacenar el producto en nuestra base de datos.

El primer paso será modificar nuestro modelo de Producto para agregar la función `create`, en la cual enviaremos los datos del producto y esta función se encargará de almacenarlo en la base de datos.

```js
// models/Products.js
// ...
// Almacen en la base de datos el producto
exports.create = (product) => {
  return knex('products')
    .insert({
      name: product.name,
      price: product.price,
      description: product.description
    });
}
```

Después de crear la función de almacenamiento en el modelo, modificaremos la lógica de nuestro controlador para que haga el `parsing` correcto del input del usuario y almacene el producto.

```js
// controllers/ProductsController.js
// Importa el modelo de productos
let ProductModel = require('../models/Product')
// ...
// Almacena el producto
exports.store = (req, res) => {
  // Crea un objeto con la información del usuario
  let product = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description
  };
  // Crea el producto
  ProductModel.create(product)
    .then((id) => {
      // Al finalizar la creación, reenvía al usuario a la página
      // inicial
      res.redirect('/');
    });
}
```

## Mostrar

Al igual que para insertar un producto, para mostrar el producto debemos de:

1. Crear una función dentro del controlador para que muestre el producto.

2. Crear la ruta a la función de nuestro controlador.

3. En la función del controlador crear la vista que vamos a regresar con la información del producto.

### Mostrar un producto

Para mostrar un producto, primero debemos de modificar nuestro modelo de `models/Product.js` para que pueda obtener la información del producto de nuestra base de datos.

Esto lo puedes lograr con la función `select` de Knex.

```js
// models/Product.js

// ...

// Obtiene la información de un producto por su id
exports.find = (id) => {
  return knex
    .select('*')
    .from('products')
    .where('id', id)
    .first();
}
```

Ahora que tenemos la función `find` dentro de nuestro modelo, debemos de modificar nuestro controlador para que muestre el producto indicado.

```js
// controllers/ProductsController.js

// ...

// Muestra el producto
exports.show = (req, res) => {
  // Obtiene el id que viene en la url
  let id = req.params.id;
  // Busca dentro de la base de datos el producto con el id indicado
  ProductModel.find(id).then((product) => {
    // Si el producto no existe entonces
    if (product == null) {
      // Regresa el error 404
      res.status(404).send('Not found');
      return;
    }
    // Si el producto existe entonces muestra la vista products/show.hbs
    // con la información del producto
    res.render('products/show', {product: product});
  });
}
```

En la vista `views/products/show.hbs`  utilizamos la información del producto:

```handlebars
<h1>Product</h1>
<table>
    <tr>
        <th>Name</th>
        <td>{{product.name}}</td>
    </tr>
    <tr>
        <th>Price</th>
        <td>{{product.price}}</td>
    </tr>
</table>
```

Finalmente modificamos nuestro archivo de rutas para que incluya la ruta para mostrar el producto.

```js
// routes/app.js

// router.get('/products/create', ProductsController.create);

// Implementa ver el detalle de un producto
router.get('/products/:id', ProductsController.show);

// router.post('/products', ProductsController.store);
```

## Actualizar

La actualización se divide en dos procesos:

1. Formulario de actualización

2. Actualizar los campos

### Formulario de actualización

En el formulario de actualización nos enfocamos en darle al usuario una ventana para que pueda actualizar los datos del producto, esto significa que tenemos que generar nuevas rutas y funciones en el controlador.

En el controlador se agregó la función `edit` para manejar la vista del formulario

```js
// controllers/ProductsController.js

// ...

exports.edit = (req, res) => {
  // Obtiene el id que viene en la url
  let id = req.params.id;
  // Busca dentro de la base de datos el producto con el id indicado
  ProductModel.find(id).then((product) => {
    // Si el producto no existe entonces
    if (product == null) {
      // Regresa el error 404
      res.status(404).send('Not found');
      return;
    }
    // Si el producto existe entonces muestra la vista products/edit.hbs
    // con la información del producto
    res.render('products/edit', {product: product});
  });
}

// ...
```

En el controlador se agregó la ruta para ver el formulario

```js
// routes/app.js

// router.get('/products/:id', ProductsController.show);

// Implementa editar un producto
router.get('/products/:id/edit', ProductsController.edit);

// router.post('/products', ProductsController.store);
```

Se creó la vista que muestra el formulario con los datos del producto

```handlebars
<!-- views/products/edit.hbs -->
<h1>Edit product</h1>
<form method="" action="">
    <div>
        <label for="name">Name: </label>
        <input type="text" id="name" name="name" value="{{ product.name }}">
    </div>
    <div>
        <label for="price">Price: </label>
        <input type="text" id="price" name="price" value="{{ product.price }}">
    </div>
    <div>
        <label for="description">Description: </label>
        <input type="text" id="description" name="description" value="{{ product.description }}">
    </div>
    <div>
        <input type="submit" value="Edit">
    </div>
</form>
```

### Actualizar los campos

Es común asociar la actualización con el método `PUT` o `PATCH` de la petición, sin embargo estas peticiones no se pueden hacer desde el navegador ya que la etiqueta `<form method="">` solo reconoce `GET` y `POST` por lo cual se tiene que hacer una sobreescritura de este método.

Para realizar la sobreescritura podemos usar el paquete [method-override](https://www.npmjs.com/package/method-override). En consola ejecuta:

```bash
npm i method-override
```

Después modifica tu archivo `index.js` para que se haga la sobreescitura:

```js
// index.js

// let app = express();

// Sobreescribe el método de envío
let methodOverride = require('method-override')
// sobreescribe el método POST
app.use(methodOverride('_method'))
```

Con esto ya hemos hecho la sobreescritura del método  de envío, es decir, nuestro `<form>` enviará una petición `POST` pero Express.js la tratará como una petición `PUT`. Para hacer el envío del método `PUT` modificamos nuestro formulario para que se muestren los atributos correctos del `<form>`.

```handlebars
<!-- views/products/edit.hbs -->
<form method="POST" action="/products/{{ product.id }}?_method=PUT">
```

Mientras que en nuestro archivo de rutas `app.js` definiremos la ruta de la siguiente forma:

```js
// routes/app.js

// ...

// Maneja la actualización del producto
router.put('/products/:id', ProductsController.update);

// ...
```

Puedes notar que la ruta está envíando a la función `update` del controlador `ProductsController` esta función se va a encargar de realizar la actualización:

```js
// controllers/ProductsController.js

// ...

exports.update = (req, res) => {
  // Obtiene el id que viene en la url
  let id = req.params.id;
  // Busca dentro de la base de datos el producto con el id indicado
  ProductModel.find(id).then((product) => {
    // Si el producto no existe entonces
    if (product == null) {
      // Regresa el error 404
      res.status(404).send('Not found');
      return;
    }

    // Define los datos del producto actualizado
    let updateProduct = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description
    }

    // Actualiza los datos del producto
    ProductModel.update(product.id, updateProduct)
      .then((id) => {
        // Al terminar redirige el índice
        res.redirect('/');
      });
  });
}

// ...
```

En esta función sobresale la función `ProductModel.update` pues esta es la función que se encarga de actualizar la información del producto.

```js
// models/Product.js

// ...

// Actualiza el producto con el id dado con la información definida en product
exports.update = (id, product) => {
  return knex('products')
    .update(product)
    .update('updated_at', knex.fn.now())
    .where('id', id);
}
```

## Borrar

La última función por implementar sería la de eliminar un producto. Las actividades que vamos a realizar son:

1. Agregar la ruta de eliminar.

2. Mostrar el botón para eliminar en la vista (en el detalle del producto).

3. Manejar la eliminación en el controlador y en el modelo.

Para agregar la ruta de eliminar, modificamos nuestro archivo `routes/app.js`:

```js
// router/app.js
// ...
// router.put('/products/:id', ProductsController.update);

// Elimina el producto
router.delete('/products/:id', ProductsController.delete);
// ...
```

Después agregamos el botón de eliminar a la vista:

```handlebars
<!-- views/products/show.hbs -->
<h1>Product</h1>
<table>
    <tr>
        <th>Name</th>
        <td>{{product.name}}</td>
    </tr>
    <tr>
        <th>Price</th>
        <td>{{product.price}}</td>
    </tr>
    <tr>
        <th></th>
        <td>
            <form method="POST" action="/products/{{ product.id }}?_method=DELETE">
                <input type="submit" value="DELETE ?">
            </form>
        </td>
    </tr>
</table>
```

Agregamos la función delete a nuestro modelo y después hacemos uso de esta función en nuestro controlador.

```js
// models/Products.js

// ...

// Elimina el producto con el id dado
exports.delete = (id) => {
  return knex('products')
    .delete()
    .where('id', id);
}

// ...
```

Mientras que en el controlador:

```js
// controllers/ProductsController.js

// Maneja la eliminación del producto
exports.delete = (req, res) => {
  // Obtiene el id que viene en la url
  let id = req.params.id;
  // Busca dentro de la base de datos el producto con el id indicado
  ProductModel.find(id).then((product) => {
    // Si el producto no existe entonces
    if (product == null) {
      // Regresa el error 404
      res.status(404).send('Not found');
      return;
    }
    // Elimina los datos del producto
    ProductModel.delete(product.id)
      .then((id) => {
        // Al terminar redirige el índice
        res.redirect('/');
      });
  });
}

```


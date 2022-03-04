# Node.js

Node.js is a free, open-sourced, cross-platform JavaScript run-time environment that lets developers write command line tools and server-side scripts outside of a browser.

Paso 1. Revisar si se tiene node instalado

Abrir la línea de comandos y ejecutar

`node --version`

Al momento de escribir este documento, la versión actual es la 17:

[https://nodejs.dev/download](https://nodejs.dev/download)

### Hello World en Node.js

Crear una carpeta de trabajo

`mkdir helloWorldNodeJS`

entrar a la carpeta

`cd helloWorldNodeJS`

crear un nuevo archivo

`touch app.js`

abrirlo con cualquier editor de código y añadir lo siguiente:

<pre>
const http = require('http')
const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('ContentType', 'text/plain')
    res.end('Hola mundo')
})

server.listen(port, hostname, () => {
    console.log(`Server running in http://${hostname}:${port}`)
})
</pre>

Desde la terminal, en la carpeta de nuestro proyecto, ejecutar:

`node app.js`

Deberíamos de obener un mensaje indicando que el servidor está ejecutándose:

`Server running in http://127.0.0.1:3000`

Si abrimos un navegador en esa URL debemos ver nuestro mensaje.



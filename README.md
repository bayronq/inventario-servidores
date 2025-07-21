# INVENTARIO SERVIDORES

[![dockeri.co](https://dockerico.blankenship.io/image/node)](https://hub.docker.com/_/node)

## Cómo Ejecutar el Proyecto

Ahora, sigue estos pasos para poner en marcha tu inventario de servidores:

1.  Abre una terminal y navega al directorio del proyecto:

`cd /Users/bayronq/inventario-servidores`

2.  Instala las dependencias de Node.js (Express y CORS):

`npm install`

3.  Inicia el servidor:

`npm start`

4.  Abre tu navegador y visita http://localhost:3000.

Verás la interfaz del inventario de servidores y podrás empezar a añadir, editar y eliminar servidores. Los datos se guardarán en el archivo servers.json.

## Correr en Docker

Crear Imagen

`docker build -t inventario-servidores . `

Correr Contenedor

`docker run -d -p 3000:3000 --mount type=bind,source=/work/volumes/is-data,target=/app --name inventario-servidores inventario-servidores`

Asegurarse de contar con el directorio local del host de docker: /work/volumes/is-data

| El proyecto corre sobre node v.24.4.1

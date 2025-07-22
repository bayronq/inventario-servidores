# Usa la imagen oficial de Node.js 22 con Alpine Linux
FROM node:22-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto en el que corre la aplicación
EXPOSE 3000

# Declara el volumen para el archivo de datos, que será montado en tiempo de ejecución
VOLUME /app/servers.json

# Comando para iniciar la aplicación
CMD [ "npm", "start" ]

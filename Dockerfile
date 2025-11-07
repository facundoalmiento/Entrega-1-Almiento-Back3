FROM node:18-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos dependencias (solo producción)
RUN npm ci --only=production || npm i --production

# Copiamos el código fuente
COPY src ./src

# Variable de entorno
ENV NODE_ENV=production

# Exponemos el puerto que usa Express
EXPOSE 3000

# Comando que inicia tu app
CMD ["node", "src/app.js"]

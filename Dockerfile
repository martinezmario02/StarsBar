FROM node:alpine

# Configurar el directorio de trabajo para el backend
WORKDIR /usr/src/backend

# Copiar los archivos necesarios del backend
COPY backend/package.json backend/package-lock.json ./ 

# Instalar las dependencias del backend
RUN npm install --production

# Copiar el resto de los archivos del backend
COPY backend ./ 

# Configurar el directorio de trabajo para el frontend
WORKDIR /usr/src/frontend

# Copiar los archivos necesarios del frontend
COPY app/package.json app/package-lock.json ./ 

# Instalar las dependencias del frontend
RUN npm install --production

# Copiar el resto de los archivos del frontend
COPY app ./ 

# Exponer los puertos para backend y frontend
EXPOSE 3000 5173

# Variables de entorno para el backend
ENV LOGSTASH_HOST=logstash
ENV LOGSTASH_PORT=5044

# Ejecutar backend y frontend en paralelo
CMD ["sh", "-c", "node /usr/src/backend/server.js & npm --prefix /usr/src/frontend run dev"]

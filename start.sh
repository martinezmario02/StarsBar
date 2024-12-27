#!/bin/sh

# Iniciar el backend
node /usr/src/backend/server.js &

# Iniciar el frontend
npm --prefix /usr/src/frontend run dev

# Esperar a que los procesos terminen
wait

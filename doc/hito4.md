# Hito 4: Composición de servicios

## Documentación y justificación de la estructura del clúster de contenedores

El clúster de contenedores de este proyecto se ha configurado utilizando **Docker Compose** para facilitar la orquestación de múltiples contenedores que componen la aplicación. Este clúster incluye los siguientes servicios:

1. **Backend**: Contenedor que ejecuta el servidor del backend, donde se manejan las operaciones lógicas y de negocio.
2. **Frontend**: Contenedor que ejecuta el servidor del frontend, donde los usuarios interactúan con la interfaz gráfica.
3. **Base de datos (DB)**: Contenedor que proporciona la base de datos MySQL, donde se almacenan los datos de la aplicación.
4. **Elasticsearch**: Contenedor que proporciona el servicio de Elasticsearch para indexar y buscar datos de manera eficiente.
5. **Logstash**: Contenedor que maneja la recolección y procesamiento de logs.
6. **Kibana**: Contenedor que proporciona una interfaz gráfica para interactuar con los datos de Elasticsearch y visualizar los logs.

Esta estructura de contenedores es adecuada para aplicaciones modernas basadas en arquitectura de microservicios, ya que permite la separación de responsabilidades y la escalabilidad independiente de cada servicio. Además, la integración con Elasticsearch y Logstash permite un manejo y visualización avanzada de logs y métricas.

## Documentación y justificación de la configuración de cada uno de los contenedores

### Backend
- **Contenedor base**: `node:alpine`. Se utiliza **Node.js** con una imagen ligera basada en Alpine Linux, lo que proporciona un entorno eficiente y rápido para ejecutar aplicaciones de backend en JavaScript.
- **Configuración**:
  - Se expone el puerto `3000`, ya que es el puerto en el que el servidor de Node.js escucha las solicitudes.
  - Se establece la variable de entorno para la conexión a la base de datos MySQL, configurando `DB_HOST`, `DB_USER`, `DB_PASSWORD` y `DB_DATABASE` para asegurar la conexión entre el backend y la base de datos.

### Frontend
- **Contenedor base**: `node:alpine`. Similar al backend, se utiliza **Node.js** con la misma base Alpine para mantener la eficiencia y minimizar el tamaño de la imagen.
- **Configuración**:
  - Se expone el puerto `5173` para la interfaz del frontend.
  - Se establece la variable de entorno `VITE_API_URL` para que el frontend se conecte al backend de forma correcta.

### Base de datos (DB)
- **Contenedor base**: `mysql:8.0`. Se utiliza una imagen oficial de MySQL, garantizando compatibilidad con la versión 8.0 de MySQL.
- **Configuración**:
  - Se establecen las credenciales de acceso (`MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`) para permitir que el backend acceda a la base de datos.
  - Se utiliza un volumen persistente `db_data` para garantizar que los datos de la base de datos se mantengan entre reinicios de contenedor.

### Elasticsearch
- **Contenedor base**: `docker.elastic.co/elasticsearch/elasticsearch:8.10.0`. Se utiliza la imagen oficial de Elasticsearch para asegurar una integración fácil y consistente.
- **Configuración**:
  - Se configuran variables de entorno como `discovery.type` y `xpack.security.enabled` para el funcionamiento básico del clúster de Elasticsearch.
  - Se expone el puerto `9201` para acceder a Elasticsearch desde el contenedor o desde fuera del clúster.

### Logstash
- **Contenedor base**: `docker.elastic.co/logstash/logstash:8.10.0`. Se utiliza la imagen oficial de Logstash, una herramienta poderosa para la recolección y procesamiento de logs.
- **Configuración**:
  - Se monta el archivo de configuración `logstash.conf`, que se adapta a las necesidades específicas de este proyecto.
  - Se expone el puerto `5044`, que es utilizado para recibir logs de diferentes servicios.

### Kibana
- **Contenedor base**: `docker.elastic.co/kibana/kibana:8.9.0`. Se utiliza la imagen oficial de Kibana para proporcionar una interfaz gráfica para interactuar con los datos de Elasticsearch.
- **Configuración**:
  - Se expone el puerto `5601`, que es el puerto de acceso a la interfaz de Kibana.
  - Se establece la variable de entorno `ELASTICSEARCH_HOSTS` para indicar a Kibana el servidor de Elasticsearch al que debe conectarse.

## Documentación del Dockerfile del contenedor con la lógica de la aplicación

En este proyecto se utilizan dos Dockerfile distintos con el objetivo de conseguir una separación clara de responsabilidades, optimización de recursos y flexibilidad para gestionar y escalar tanto el frontend como el backend de manera independiente. De este modo, encontramos los siguientes Dockerfile.

### Dockerfile.backend

- **Base**: Usa `node:alpine` para una imagen ligera con Node.js.
- **Instalación de dependencias**: Instala herramientas para compilar dependencias nativas de Node.js (`build-base`, `python3`).
- **Copia de código**: Copia el código del backend al contenedor.
- **Instalación de dependencias**: Ejecuta `npm install` para instalar las dependencias de la aplicación.
- **Optimización**: Elimina las herramientas de compilación para reducir el tamaño de la imagen.
- **Comando de ejecución**: Ejecuta el servidor con `npm start`.

### Dockerfile.frontend

- **Base**: Usa `node:alpine` para mantener una imagen ligera y consistente con el backend.
- **Copia de código**: Copia el código del frontend al contenedor.
- **Instalación de dependencias**: Ejecuta `npm install` para instalar las dependencias del frontend.
- **Comando de ejecución**: Inicia el servidor de desarrollo con `npm run dev`.

## Contenedor subido correctamente a GitHUb Packages y documentación de la actualización automática


## Documentación del fichero de composición del clúster de contenedores compose.yaml


## Correcta implementación y ejecución del test para validar el funcionamiento del clúster de contenedores

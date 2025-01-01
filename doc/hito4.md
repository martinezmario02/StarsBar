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

## Contenedor subido correctamente a GitHub Packages y documentación de la actualización automática
Este proyecto utiliza **GitHub Actions** para la actualización automática y publicación del contenedor Docker en **GitHub Packages**. Cada vez que se realice un cambio en la rama principal (`main`), el contenedor se reconstruirá y se subirá automáticamente a GitHub Container Registry.

### Workflow de GitHub Actions

1. **Reconstrucción y Publicación Automática**: Cada vez que se haga un `push` a la rama `main`, el flujo de trabajo de **GitHub Actions** se activará automáticamente para reconstruir las imágenes Docker del frontend y backend del proyecto, y las subirá a **GitHub Container Registry**.
   
2. **Uso de Dockerfiles Específicos**: Existen dos archivos `Dockerfile` en el proyecto:
   - `Dockerfile.frontend` para la construcción de la imagen Docker del **frontend**.
   - `Dockerfile.backend` para la construcción de la imagen Docker del **backend**.

### Proceso de Construcción y Publicación

**Acciones de GitHub**:
   - El archivo de configuración `.github/workflows/docker-publish.yml` contiene las instrucciones de cómo se ejecuta el flujo de trabajo.
   - En este flujo de trabajo se realiza lo siguiente:
     - **Login** a **GitHub Container Registry** con el token de acceso.
     - **Construcción** de las imágenes Docker para el frontend y el backend usando los respectivos `Dockerfile`.
     - **Publicación** de las imágenes Docker en **GitHub Container Registry**.

## Documentación del fichero de composición del clúster de contenedores compose.yaml
El archivo `docker-compose.yml` configura un clúster de contenedores para ejecutar una aplicación completa con un backend, frontend, base de datos MySQL, Elasticsearch, Logstash y Kibana. A continuación, se presenta un resumen de los servicios definidos:

### 1. **Backend**
- Construido desde `Dockerfile.backend`.
- Expone el puerto `3000` para la comunicación.
- Conecta con la base de datos MySQL y Logstash.
- Usa una red interna `app_network`.

### 2. **Frontend**
- Construido desde `Dockerfile.frontend`.
- Expone el puerto `5173`.
- Conecta con el backend a través de la URL definida en el entorno `VITE_API_URL`.
- Tiene un límite de memoria de 512 MB.

### 3. **Base de Datos (MySQL)**
- Usa la imagen `mysql:8.0`.
- Expone el puerto `3306`.
- Configurado con variables de entorno para el acceso a la base de datos.

### 4. **Elasticsearch**
- Usa la imagen `docker.elastic.co/elasticsearch/elasticsearch:8.10.0`.
- Expone el puerto `9201` para la conexión.
- Configurado en un nodo único con seguridad desactivada.

### 5. **Logstash**
- Usa la imagen `docker.elastic.co/logstash/logstash:8.10.0`.
- Conecta con Elasticsearch y procesa los logs del backend.
- Expone el puerto `5044`.

### 6. **Kibana**
- Usa la imagen `docker.elastic.co/kibana/kibana:8.9.0`.
- Expone el puerto `5601` para la visualización de datos de Elasticsearch.

### Volúmenes y Redes:
- **Volúmenes**: `db_data` para MySQL y `es_data` para Elasticsearch.
- **Red**: `app_network` para comunicación interna entre los servicios.

## Correcta implementación y ejecución del test para validar el funcionamiento del clúster de contenedores

Para garantizar que todos los servicios del clúster de contenedores están funcionando correctamente, se ha implementado una serie de pruebas automatizadas utilizando **Jest**. Estas pruebas verifican que cada componente del clúster, tanto el backend como el frontend, así como los servicios asociados como la base de datos, Kibana, Elasticsearch y Logstash, están operativos y respondiendo correctamente.

#### Los tests incluyen:

1. **API del Backend**: Verifica que la API REST del backend esté accesible y que la respuesta sea válida (en este caso, se espera un array).
2. **Frontend accesible**: Se incluye un test que comprueba que el contenedor que sirve el frontend esté operativo y responda correctamente a las solicitudes HTTP.
3. **Conexión a la Base de Datos MySQL**: Comprueba que el contenedor de MySQL esté funcionando y respondiendo a las solicitudes.
4. **Acceso a Kibana**: Valida que el servicio de Kibana esté accesible para realizar visualización y monitoreo de los logs.
5. **Acceso a Elasticsearch**: Asegura que Elasticsearch esté operando correctamente y disponible para búsquedas.
6. **Logstash en ejecución**: Verifica que el servicio de Logstash esté funcionando y procesando logs como se espera.

#### Ejecución de las pruebas

Las pruebas pueden ejecutarse mediante **Jest**, lo cual permite validar de manera rápida y eficiente el estado de todos los servicios del clúster. 

# Hito 3: Diseño de microservicios

## Elección del framework utilizado para los logs
<p align="justify">
  Winston es un popular framework de registro de logs en Node.js que se ha convertido en un estándar por diversos motivos. 
  Por un lado, permite una configuración sencilla y flexible, facilitando su uso tanto en proyectos simples como en aplicaciones complejas.
  Además, la capacidad de personalizar el formato de los logs hace que sea adaptable a las necesidades de desarrollo y producción.
  Por otro lado, soporta diferentes transportes de forma nativa. En nuestro caso, se han impreso los logs tanto en la consola como en un archivo auxiliar denominado app.log.
</p>

<p align="justify">
  En conclusión, la elección de Winston como framework de logs, junto con la decisión de almacenar los logs en un archivo local, proporciona una solución balanceada entre simplicidad,
  flexibilidad y capacidad de escalado. Esta herramienta se adapta bien a entornos de desarrollo y producción, además de ofrecer la opción de extender su funcionalidad conforme las necesidades
  de la app crezcan.
</p>

## Pruebas de la API
<p align="justify">
  En el caso de nuestro proyecto, ya se había testeado la API en el hito anterior. 
  De este modo, recordamos que se utilizaron herramientas como npm o jest, además de GitHub Actions como sistema online de prueba.
</p>

<img src="https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white"> <img src="https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white"> <img src="https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white">

<p align="justify">
  A continuación, se aporta una captura como demostración de que se siguen pasando los tests de forma correcta.
</p>

![Actions](https://github.com/user-attachments/assets/a6e6b27c-0834-4906-ada0-14851c6248c8)

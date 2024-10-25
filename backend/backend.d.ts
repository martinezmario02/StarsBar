declare module '../backend/server' {
  import { Application } from 'express';
  const app: Application;
  export default app;
}

declare module '../backend/db' {
  import { Connection } from 'mysql2';
  const connection: Connection;
  export default connection;
}
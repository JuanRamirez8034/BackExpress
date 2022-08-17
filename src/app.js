/**
 * Configuracion de express
*/
import express from "express";
import cors from 'cors';
import morgan from "morgan";

const app = express();
app.use(express.json());//permitir pasar datos por archivos json
app.use(cors());
app.use(morgan('dev'));
app.use(require('./routes'));

/* utilizar las rutas */

export default app;
//module.exports = app;
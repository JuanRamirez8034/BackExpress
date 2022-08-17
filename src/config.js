/**
 * configuracion de la base de datos
 */
import { config as dotenv } from "dotenv";
dotenv();

export const config = {
    host: process.env.SERVIDOR || 'localhost',
    user: process.env.USUARIO || 'root',
    password: process.env.CONTRASENA || '',
    database: process.env.BASEDATOS || 'test'
}

/**
 * conexion a la base de datos
 */
import mysql from 'mysql2/promise';
import { config } from './config';

// conexion
export const conexion = async ()=>{
    const conexion_ = await mysql.createConnection(config);
    return conexion_;
}
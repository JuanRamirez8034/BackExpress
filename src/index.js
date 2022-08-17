/**
 * escuchando al servidor en el puerto indicado
 */
import app from "./app";
//const app = require('./app.js');
var port = 2000;
app.listen(port);
console.log(`Server on port ${port}\nhttp://localhost:${port}`);

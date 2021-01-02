'use strict'

var mongoose = require('mongoose');/* CON ESTO ES UNA FUNCION PARA CARGAR EL MODULO */
var app = require('./app');// LLAMAMOS AL MODULO APP QUE CONTIENE EL SERVIDOR
var port = 3700;

mongoose.Promise = global.Promise; /* CONEXION A LA BASE DE DATOS  */
mongoose.set("useFindAndModify", false); //NO ES OBLIGATORIO SOLO SI HAY ERROR
mongoose.connect('mongodb://localhost:27017/portafolio') // { useNewUrlParser: true, useUnifiedTopology: true } -> SE SOLIA USAR, NO SOPORTADO EN NUEVA VERSION
	.then(() => {
		console.log("Conexión a la base de datos establecida satisfactoriamente...");

		// Creacion del servidor
		app.listen(port, () => {
			console.log("Servidor corriendo correctamente en la url: " + port);
		});

	})
	.catch(err => console.log(err)
	);


/*

CREAMOS EL DOCUMENTO INDEX.JS
creamos "start":"nodemon index.js"   CREAMOS EL SCRIPT PARA QUE EJECUTE EN AUTOMATICO NODEMON

var mongoose = require('mongoose');  ---> Importamos el módulo de mongoose
mongoose.Promise = global.Promise;   ---> Conexión a la base de datos mediante una Promesa
mongoose.connect("URL",{})              ---> Creamos una conexión a la base de datos
.then ( ()=>{})                  ---> Al ser una promesa NO se usa this sino .then y es callback
.catch( (err)=>{})               ---> Con el .catch captamos el error

Arreglar advertencia de NodeJs ---> mongoose.connect("URL", { useNewUrlParser:true, useUnifiedTopology: true })

GENERAMOS CONEXION CON EL SERVIDOR
app.listen(VarPuerto, ()=>{}); --> Abstraemos el servidor hacia al puerto VarPuerto y la función de callback, arroja la información



LANZAMOS EL SCRIPT EN LINEA DE COMANDO LINUX MEDIANTE --> npm start [recuerda que start esta asociado a nodemon]



*/
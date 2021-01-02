'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = Schema({
	name: String,
	description: String,
	category: String,
	year: Number,
	langs: String,
	image: String
});

module.exports = mongoose.model('Project', ProjectSchema);
// projects  --> guarda los documents en la coleccion

/* 
************************** MODELO VISTA CONTROLADOR ************************** 

1) CREAMOS EL MODELO - ES UNA PLANTILLA DE REFERENCIA PARA CREAR LUEGO UNA BD  
1.1.) Creamos la carpeta models --> project.ts
var mongoose = require("mongoose");         --> Define el esquema de datos mediante NoSQL (es decir MongoDB)
var Schema = mongoose.Schema;               --> Es la propiedad obligatoria de mongoose para generar objetos NoSQL
var ProjectSchema = Schema({});             --> Genera un JSON de tipo Schema con lo que integra dentro del JSON

module.exports = mongoose.model("Project", ProjectSchema); --> exportamos un módulo de tipo ProjectSchema con el nombre de Project
"Project" --> Segun mongoose se adaptara a singular y plural al crear la BD es decir : projects, el cual creamos en Robo3T

2) LA VISTA SE GENERARA POR EL FRONT-END; DE MOMENTO NO LO VEREMOS

3) CREAMOS EL CONTROLADOR
3.1.) Creamos la carpeta controllers --> project.ts

4) CREAMOS EL DOCUMENTO DE RUTAS
4.1.) Creamos la carpeta routes --> project.js

*/
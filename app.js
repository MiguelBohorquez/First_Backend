'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar archivos rutas
var project_routes = require('./routes/project');

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// RUTAS GENERADAS DESDE MODELO-VISTA-CONTROLADOR
app.use('/api', project_routes);

// RUTAS SENCILLAS
app.get("/", (req, res) => {
    res.status(200).send("<h1>Pagina de inicio</h1>");
    console.log("Saludos GET -> desde http://localhost:3700");
    console.log("Saludos GET -> desde http://localhost:3700/");

});

app.get("/test", (req, res) => {
    res.status(200).send("<h2>Pagina de Test</h2>");
    console.log("Saludos GET -> desde http://localhost:3700/test");
});
app.post("/test", (req, res) => {
    console.log("Saludos POST -> desde http://localhost:3700/test");
    /* SE VA A TOMAR TODO LO ANADIDO DEL BODY -> URLENCODED */
    console.log(req.body.nombre);
    res.status(200).send("Respuesta correcta en test");
    console.log(req.query.web);
    console.log("Saludos POST -> desde http://localhost:3700/test?web=www.hotmail.com")
});
app.post("/test/:id", (req, res) => {
    console.log("Saludos POST -> desde http://localhost:3700/testNumeroID");
    console.log("El ID asignado es: " + req.params.id);
    res.status(200).send("Respuesta correcta con ID");

});

app.get("/web", (req, res) => {
    req.status(200).send("Respuesta correcta con Get -> Web");
    console.log("Saludos desde GET -> http://localhost:3700/web");
    console.log(req.query.web)
});



// exportar
module.exports = app; // exportamos el módulo express de app a index.js para ejecutar el servidor


/*
************************** GENERAR VARIABLES **************************
var express = require("express");           --> Importamos el módulo de express
var bodyParser = require("body-parser");    --> Importamos el módulo de bodyParser
var app = expres()                          --> llamamos al objeto del módulo de express
--- GENERAR CONEXION ---
app.use(bodyparser.urlencoded({extended:false}));   --> Genera que las peticiones que lleguen pase por body-parser y se conviertan en código URL sin extension, es obligatorio
app.use(bodyParser.json());                         --> Hace que la devuelva los resultados en archivos .json, es obligatorio

************************** CREAR RUTAS SENCILLAS **************************
1) METODO GET : SOLO ENVIA INFORMACION

app.get("/",(req,res) =>{ res.status(200).send("<h1>Pagina de inicio</h1>"); });

NombreModuloExpress.get("URL",(request,response)=>{}); --> Genera la petición http GET con el comando de pregunta (request o req para POST) o (response o res para GET)
response.status(200).send("texto")                     --> Cuando la respuesta tenga status ok [200 por peticion http] envia texto

2) METODO POST: GUARDA INFORMACION

app.post("/test",(req,res)=>{});      --> Generamos la peticion POST en el hipervinculo "localhost:3700/test"
console.log(req.body.nombre);         --> Genera la petición dentro del body de postman apartado x-www-form-urlencoded
console.log(req.query.web);           --> Cuando se añade a la peticion información EJ /test?web=google.es; .query la captura

app.post("/test/:id",(req,res)=>{});  --> Con el apartado :id generamos un parametro obligatorio, lo capturamos con .params
console.log(req.params.id)            --> Genera la captura de la respuesta del parametro

************************** CREAR RUTAS MODELO VISTA CONTROLADOR **************************
1) Creamos rutas mediante el módulo-vista-controlador [En models -> project.ts]
2) Una vez se ha creado importamos el módulo de routes en el equipo []
    var project_routes = require("./routes/project"); --> Importamos el módulo de rutas --> project.ts
3) Generamos el enrutamiento
    app.use("/api", project_routes); --> usamos .use("Url",VarImportada-MVC)

************************** CREAR RUTAS CORS ************************** 
1) Sirve para hacer peticiones AJAX con jQuery o Angular a un backend o un API REST 
2) res.header('Access-Control-Allow-Origin', '*'); ---> debemos de cambiar * por el URL de la página en producción
3) siempre se utilizara la misma nomenclatura
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-All
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



************************** EXPORTAR MODULO **************************
module.exports = app; --> Creamos un módulo de export en app

*/
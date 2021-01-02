'use strict'

var express = require('express');
var ProjectController = require('../controllers/project');

var router = express.Router();
// UTILIZAMOS EL MIDDLEWARE PARA INVOCAR AL CONECT-MULTIPARTY PARA SUBIR IMAGENES
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './uploads' });

router.get('/home', ProjectController.home);
router.post('/test', ProjectController.test);
router.post('/save-project', ProjectController.saveProject);
router.get('/project/:id?', ProjectController.getProject); // :id => ID obligatorio -- :id? => ID opcional
router.get('/projects', ProjectController.getProjects);
router.put('/project/:id', ProjectController.updateProject); //UTILIZAMOS PUT
router.delete('/project/:id', ProjectController.deleteProject);
router.post('/upload-image/:id', multipartMiddleware, ProjectController.uploadImage);
router.get('/get-image/:image', ProjectController.getImageFile);

module.exports = router;

/*
--- GENERAMOS LAS RUTAS ---
1) Para generar rutas es necesario el módulo MONGOOSE
    var mongoose = require("mongoose");
2) Importamos el controlador que tiene las rutas y creamos una variable
    var ProjectController = require("../controllers/project");
3) Llamamos al apartado del módulo de express encargado del router
    var router = express.router();
4) Generamos las rutas mediante el protocolo HTTP
    router.get("/home",ProjectController.home);     --> El .home hace referencia al array del controlador
    router.post("/test",ProjectController.test);    --> El .home hace referencia al array del controlador
5) Una vez creada la ruta se tiene que exportar a app.js 
*/
'use strict'

var Project = require('../models/project'); // PARA METODOS PERSONALIZADOS 
var fs = require('fs');
var path = require('path');

var controller = {

	home: function (req, res) {
		return res.status(200).send({
			message: ["Soy Home", "www.localhost:3700/api/home"]
		});
	},

	test: function (req, res) {
		return res.status(200).send({
			message: "Soy el metodo o accion test del controlador de project"
		});
	},
	// MODELO PARA GUARDAR DOCUMENTOS NUEVOS DESDE POST 
	saveProject: function (req, res) {
		var project = new Project();
		var params = req.body;

		project.name = params.name;
		project.description = params.description;
		project.category = params.category;
		project.year = params.year;
		project.langs = params.langs;
		project.image = null;

		project.save((err, projectStored) => {
			if (err) return res.status(500).send({ message: 'Error al guardar el documento.' });
			if (!projectStored) return res.status(404).send({ message: 'No se ha podido guardar el proyecto.' });
			return res.status(200).send({ project: projectStored });
		});
	},
	// METODO PARA BUSCAR OBJETO POR ID
	getProject: function (req, res) {
		var projectId = req.params.id;

		if (projectId == null) return res.status(404).send({ message: "No se ha puesto ID" });

		Project.findById(projectId, (err, project) => {

			if (err) return res.status(500).send({ message: 'Error al devolver los datos.' });
			if (!project) return res.status(404).send({ message: 'El proyecto no existe.' });
			return res.status(200).send({ project });

		});
	},

	// METODO PARA BUSCAR OBJETO POR UN CRITERIO Y ORDENAR
	getProjects: function (req, res) {

		Project.find({}).sort('-year').exec((err, projects) => { // .exec --> ejecuta la funcion de callback

			if (err) return res.status(500).send({ message: 'Error al devolver los datos.' });
			if (!projects) return res.status(404).send({ message: 'No hay projectos que mostrar.' });
			return res.status(200).send({ projects });
		});

	},
	// METODO PARA BUSCAR Y REEMPLAZAR POR CRITERIO

	updateProject: function (req, res) {
		var projectId = req.params.id;
		var update = req.body;

		Project.findByIdAndUpdate(projectId, update, { new: true }, (err, projectUpdated) => {
			if (err) return res.status(500).send({ message: 'Error al actualizar' });
			if (!projectUpdated) return res.status(404).send({ message: 'No existe el proyecto para actualizar' });
			return res.status(200).send({ project: projectUpdated });
		});

	},
	// METODO PARA BUSCAR Y BORRAR POR ID
	deleteProject: function (req, res) {
		var projectId = req.params.id;

		Project.findByIdAndRemove(projectId, (err, projectRemoved) => {
			if (err) return res.status(500).send({ message: 'No se ha podido borrar el proyecto' });
			if (!projectRemoved) return res.status(404).send({ message: "No se puede eliminar ese proyecto." });
			return res.status(200).send({ project: projectRemoved });
		});
	},
	// METODO PARA SUBIR ARCHIVOS [CON EL METODO YA UTILIZADO CONECTOR-MULTIPARTY]
	uploadImage: function (req, res) {
		var projectId = req.params.id;
		var fileName = 'Imagen no subida...'; // ES EL TEXTO LUEGO SE REEMPLAZARA MEDIANTE POSTMAN

		if (req.files) {
			var filePath = req.files.image.path;
			var fileSplit = filePath.split('\\');
			var fileName = fileSplit[1];
			var extSplit = fileName.split('\.');
			var fileExt = extSplit[1];

			if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {

				Project.findByIdAndUpdate(projectId, { image: fileName }, { new: true }, (err, projectUpdated) => {
					if (err) return res.status(500).send({ message: 'La imagen no se ha subido' });
					if (!projectUpdated) return res.status(404).send({ message: 'El proyecto no existe y no se ha asignado la imagen' });
					return res.status(200).send({ project: projectUpdated });
				});

			} else {
				fs.unlink(filePath, (err) => {
					return res.status(200).send({ message: 'La extensión no es válida' });
				});
			}

		} else {
			return res.status(200).send({ message: fileName });
		}

	},

	getImageFile: function (req, res) {
		var file = req.params.image;
		var path_file = './uploads/' + file;

		fs.exists(path_file, (exists) => {
			if (exists) {
				return res.sendFile(path.resolve(path_file));
			} else {
				return res.status(200).send({
					message: "No existe la imagen..."
				});
			}
		});
	}

};

module.exports = controller;


/*

**** IMPORTANTE SE DEBE DE TENER MONGOD ACTIVO ****
--- CONTROLADOR ---

Es el encargado de generar el control de las rutas mediante un achivo JSON, con este nosotros vamos a ver el STATUS en cada gestión que se realice
1) va a ser una variable que la exportaremos al documento principal app.js
2) cada ruta del controlador sigue el mismo patrón
NombreRuta: funcion(request,response){};        --> Generamos el nombre de cada ruta
return res.status(200).send({message:"hola"})   --> Generamos mensaje de respuesta segun status
3) generamos el export y lo importamos a las rutas para definir el link

--- //MODELO PARA GUARDAR DOCUMENTOS NUEVOS DESDE POST// ---
1) Para guardar un documento necesitamos un modelo, lo extraemos de models -> project.ts
    var Project = require("../models/project");
2) Creamos la función SaveProject: function (request, response)=>{};
3) Llamamos al método y creamos un nuevo objeto
    var project = new Project();
4) Creamos una variable Params, la cual es la respuesta del mensaje generado en POSTMAN por body
    var params = req.body;
5) Reemplazamos los métodos del modelo
    project.name = params.name;
    project.description = params.description;
    project.category = params.category;
    project.year = params.year;
    project.langs = params.langs;
    project.image = params.image;
6) Guardamos el proyecto, anteriormente solo habiamos capturado los datos
    project.save((err, projectStored) => {});
7) Mediante protocolo HTTP si se genera algún error lo identificamos con .send(500) y .send(404)
    if (err) return res.status(500).send({ message: "Mensaje" });
    if (!projectStored) return res.status(404).send({ message: "Mensaje" });
    return res.status(200).send({ send({ message: "Mensaje" });
8) En Routes --> Project.ts, creamos la ruta para poder comprobarlo en postman
    router.post("/save-project",ProjectController.SaveProject);
9) Lo visualizamos en POSTMAN con el url http://localhost:3700/api/save-project
    Dentro de x-www-form-urlencoded sirve se añade la información del body que anadiremos a la base de datos

--- //MODELO PARA BUSCAR OBJETO POR ID // ---

1) Para buscar un objeto dentro de la basa de datos NoSQL necesitamos saber su ID
2) Desde routes --> project.ts generamos la ruta
    router.get("/getProject/:id?", ProjectController.getProject);
    :id => ID obligatorio
    :id? => ID opcional
3) Generamos el método
    getProject: function(req,res){}
4) Generamos la variable que genere el ID, el cual esta dentro del parámetro del URL
    var projectId = req.params.id;
5) Generamos la condicional IF si tiene ID o no
    if(projectId == null) return res.status(404).send({message: "No se ha puesto ID"});
6) Generamos el método BuscarPorId  [.findById]
        Project.findById(projectId, (err, project) => {                             --> .findById(ParamsId,(Error,ProjectSuccess)=>{});
            if (err) return res.status(500).send({ message: "Error 500" });
            if (!project) return res.status(404).send({ message: "Error 404" });
            return res.status(200).send({ project });
        });
7) En Routes --> Project.ts, creamos una ruta para comprobarlo en postman
    router.get("/getProject/:id?", ProjectController.getProject);       --> Generamos el metodo .GET para solo visualizar

--- //MODELO PARA BUSCAR POR CRITERIO Y ORDENAR // ---
1) Podemos buscar un objeto dentro de una base de datos NoSQL a través de un criterio, en vez de un ID
2) Generamos el método
    findProject: function(req,res){},
3) Generamos el método .find({"Variable a buscar en JSON"}.sort("+year").exec(()=>{});
        .find({key: "value"}) --> Nos permite encontrar objetos --> SE VE MAS INFO EN DOCUMENTACION MONGOOSE
        .sort("-year") --> [-year] Ordenada de mayor a menor    --> [year o +year] sin signo de menor a mayor
        .exec(err,ProjectSuccess()=>{});                        --> Método indispensable para ejecutar la búsqueda
4) Generamos protocolo HTTP
    if (err) return res.status(500).send({ message: "Error 500" });
    if (!projects) return res.status(404).send({ message: "Error 404" });
    return res.status(200).send({ projects });


--- //MODELO PARA BUSCAR Y REEMPLAZAR // ---
1) Generamos un método que sirva para buscar y reeemplazar por postman Body-->x-www-form-urlencoded --> body
2) Generamos una busqueda por ID y reemplazo por body
    var projectId = req.params.id;
    var update = req.body;
3) Generamos el método .findByIdAndUpdate
    Project.findByIdAndUpdate(projectId, update, (err, projectUpdate) => {});
    projectId --> Es el parámetro ID obligatorio para localizar el objeto
    update --> Es la variable que va a modificar el modelo Project-->Models por la información del body de Postman
4) Generamos protocolo HTTP
    if (err) return res.status(500).send({ message: "Error al actualizar" });
    if (!projectUpdate) return res.status(404).send({ message: "No existe proyecto para actualizar" });
    return res.status(200).send({ project: projectUpdate });

--- //MODELO PARA BUSCAR Y BORRAR POR ID // ---
1) Generamos un método que sirva para buscar por ID y borrarlo dentro del URL
2) Generamos la ruta en Routes --> project.ts
    router.delete("/removeProject",ProjectController.deleteProject);
3) Creamos el método para buscar-borrar por ID
    deleteProject: function(request,response){}
4) Creamos la variable necesaria para localizar el ID
    var projectId = req.params.id;
5) Generamos el método .findByIdAndRemove(projectId,(err,ProjectDelete)=>{});
    projectId       --> Es el parámetro ID obligatorio para localizar el objeto
    err             --> Genera la variable si se genera el error
    ProjectDelete   --> Genera la variable si hay éxito
6) Generamos protocolo HTTP
    if (err) return res.status(500).send({ message: "No se ha podido borrar el proyecto" });
    if (!ProjectDelete) return res.status(404).send({ message: "No existe proyecto para " });
    return res.status(200).send({ project: ProjectDelete });


--- //METODO PARA SUBIR ARCHIVOS [UTILIZANDO CONNECT-MULTIPARTY]// ---
1) Generamos un modelo que servirá para añadir imagen a la base de datos
2) Generamos la ruta en Routes --> project.ts y utilizamos la variable del Middleware antes del método
    router.post("/upload-image/:id",connectMultipartyMiddleware, ProjectController.uploadImage);
3) Para subir imagenes necesitamos invocar al connect-multiparty, lo invocamos desde las las rutas Routes -->project.ts
    var connectMultiparty = require("connect-multiparty");
4) Para cargar los documentos necesitamos crear una carpeta [./uploads]
5) Creamos un Middleware para cargar las imagenes
    var connectMultipartyMiddleware = connectMultiparty({uploadDir: "./uploads"});
6) Creamos el método para cargar una imagen
    uploadImage: function (request, response){}
7) Creamos las variables definidas para localizar las imagenes
    var projectId = req.params.id;          --> Es el parámetro ID obligatorio para localizar el objeto
    var fileName = "Imagen no subida...";   --> Es la variable que contendra la imagen, al no cargar da mensaje predeterminado
8) Generamos el primer condicional si carga o no la imagen if(req.file){}else {}
    if (req.files) {                 --> Generamos condicion SI la request captura un documento "file", con requisito del connector-multiparty
    } else {                        --> Generamos el condicional Sino
     return res.status(200).send({  --> Si la respuesta es "correcta" .status(200) envia mensaje
         message: fileName          --> Envia mensaje variable fileName
     });
    }
9) Si se cumple la primera condicional se genera lo siguiente
    var filePath = req.files.image.path;       --> Genera la variable de la ruta donde sube la imagen
    var fileSplit = filePath.split("\\");       --> .split("\\") Genera cortar parte del nombre que se preasigna
    var fileName = fileSplit[1];                --> Genera el array[1] con la ruta cortada
    var extSplit = fileName.split('\.');         --> Volvemos a cortar la ruta con el nombre del archivo
    var fileExt = extSplit[1];                  --> Volvemos a quedarnos con la ruta cortada

10) Volvemos a generar la condicional para comprobar si lo que se sube es en formato imagen
 if (fileExt == "png" || fileExt == "jpg" || fileExt == "gif" || fileExt == "jpeg") {
    }else{ }
10.1 ) Si el condicional es correcto se genera los siguientes métodos
    Project.findByIdAndUpdate(projectId, { image: fileName }, { new: true }, (err, projectUpdated) => {});
    Project.findByIdAndUpdate --> Generamos la opción que encuentre por ID y añada la imagen
    projectId                 --> Es el parámetro ID obligatorio para localizar el objeto
    {image: fileName}         --> Generamos como parámetro la variable y tipo:image para cargar
    {new:true}                --> Esta opción genera que reemplace en caso de sobrescribir una nueva imagen
    (err,projectUpdated)      --> Son las variables por parte del callback, genera el error y el success
10.2) Generamos protocolo HTTP en caso de éxito
    if (err) return res.status(500).send({ message: "La imagen no se ha subido" });
    if (!projectUpdated) return res.status(404).send({ message: "El proyecto no existe y no se ha asignado imagen" });
    return res.status(200).send({ project: projectUpdated });
11) Generamos la condicional en caso de que el documento adjunto no sea en formato imagen
11.1) Llamamos al inicio del archivo a la extension File-system; para poder borrar las imagenes en caso de no cargar correctamente
    var fs = require("fs");
11.2) Generamos la función dentro del método
 fs.unlink(filePath, (err) => { return res.status(200).send({ message: "extension no valida" })  }
 fs.unlink()            --> Genera mediante la librería fileSystem en caso de que capture un "unlink " es una promesa se puede continuar con .then()
    .then(()=>{});      --> Es opcional por parte de unlink
 fs.unlinkSync()        --> Genera que se genere el error y espera que finalice todo el proceso, también es promesa
 (filePath,(err)=>{})   --> Generamos la variable ruta y solo captamos el error, ya que no se va a generar success
return res.status(200).send({ message: "extension no valida" --> Generamos el mensaje

12)Lo comprobamos, nos vamos a postman con el URL y ponemos en body--> form data --> key: imagen type document y lo anadimos
*/

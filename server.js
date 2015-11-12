var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {

	res.send('Todo API Root');
});


//GET /todos
/*app.get('/todos', function(req, res){

	  res.json(todos);

});*/

//Get /todos filtered
app.get('/todos', function(req, res) {

	var queryParams = req.query;
	var where = {};

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {

		where.completed = true;
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		where.completed = false;
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		where.description = {
			$like: '%' + queryParams.q + '%'
		};
	}
	console.log(where);

	db.todo.findAll({
		where
	}).then(function(todos) {
		res.json(todos);
	}).catch(function(e) {

		res.status(500).send(e);
	});


});


//Get /todos/1
app.get('/todos/:id', function(req, res) {

	var idTodo = parseInt(req.params.id, 10);

	db.todo.findById(idTodo).then(function(todoFound) {
		res.json(todoFound.toJSON());
	}).catch(function(e) {
		res.status(404).send('Not record matching found');
	});

});

//POST /todos

app.post('/todos', function(req, res) {

	var body = _.pick(req.body, 'description', 'completed');


	db.todo.create(body).then(function(newTodo) {
		res.json(newTodo.toJSON());
	}).catch(function(e) {
		res.status(400).json(e);
	});


});


app.delete('/todos/delete/:id', function(req, res) {

	var idTodo = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {

			id: idTodo
		}
	}).then(function(rowsDelete){
		if(rowsDelete > 0){
			res.send('Rows deleted successfully: ' + rowsDelete);
		}else{
			res.status(204).send('Not record matching found');
		}
	}).catch(function(e){
		res.status(500).json(e);
	});

});

app.put('/todos/:id', function(req, res) {

	var idTodo = parseInt(req.params.id, 10);
	
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	} 

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	db.todo.findById(idTodo).then(function(todo){

		  if (todo){
		  	return todo.update(attributes).then(function(todo){
						res.json(todo.toJSON());
					}, function(e){
						res.status(400).json(e);
					});;
		  }else{
		  	res.status(404).send();
		  }
	}, function(){
		 res.status(500).send();
	})

});

db.sequelize.sync().then(function() {

	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT);
	});
});
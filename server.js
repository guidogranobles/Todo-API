var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){

    res.send('Todo API Root');
});


//GET /todos
/*app.get('/todos', function(req, res){

	  res.json(todos);

});*/

//Get /todos filtered
app.get('/todos', function(req, res){

	  var queryParams = req.query;
	  var filteredTodos = todos;

	   if(queryParams.completed && queryParams.completed === 'true'){
	   	   filteredTodos = _.where(todos, {completed: true});
	   }else if(queryParams.completed && queryParams.completed === 'false'){
	   		filteredTodos = _.where(todos, {completed: false});
	   } 	  

	  res.send(filteredTodos);

});


//Get /todos/1
app.get('/todos/:id', function(req, res){

	  var idTodo = parseInt(req.params.id, 10);
	  var matchedTodo = _.findWhere(todos, {id: idTodo});
	  console.log(matchedTodo + ' ');

	  if(matchedTodo === null){
	  	 res.status(404).send();
	  	 return;
	  }

	  res.send(matchedTodo);

});

//POST /todos

app.post('/todos', function(req, res){

	var body = _.pick(req.body, 'description', 'completed');

	  if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length ===0){
	  	 return res.status(400).send();
	  }

	  var todo = {"id" : todoNextId, 
	  			   "description": body.description.trim(),
	  			   "completed" : body.completed
	  			 }


	  todos.push(todo);

	  todoNextId = todoNextId + 1; 

	  res.json(todo);
});


app.delete('/todos/delete/:id', function(req, res){

	  var idTodo = parseInt(req.params.id, 10);
	  var matchedTodo = _.findWhere(todos, {id: idTodo});

 		console.log(matchedTodo + ' ');	 

	   if(matchedTodo === null){
	  	 res.status(404).send();
	  	 return;
	  }

	  var resultTodos = _.without(todos, matchedTodo);

	  todos = resultTodos;

	  console.log(todos + ' ');	 

	  res.send(matchedTodo);

});

app.put('/todos/:id', function(req, res){
	
	var idTodo = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: idTodo});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttribute = {};

	if(matchedTodo === null){
	  	 res.status(404).send();
	  	 return;
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttribute.completed = body.completed;
	}else if(body.hasOwnProperty('completed')){
		return res.status(400).send();
	}else if(body.hasOwnProperty('description') && 
				_.isString(body.description)  &&
				body.description.trim().length > 0){
		validAttribute.description = body.description;

	}else if(body.hasOwnProperty('description')){
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttribute);

	res.json(matchedTodo);

});

app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT);
});










var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){

    res.send('Todo API Root');
});


//GET /todos
app.get('/todos', function(req, res){

	  res.json(todos);

});


//Get /todos/1
app.get('/todos/:id', function(req, res){

	  var idTodo = req.params.id;
	  var todoMatch = null;

	  todos.forEach(function(todo){
 	  	  if(todo.id == idTodo){
	  	  	 todoMatch = todo;
	  	  	  console.log('todoMatch: ' + todoMatch);
	  	  }

	  });

	  if(todoMatch === null){
	  	 res.status(404).send();
	  	 return;
	  }

	  res.send(todoMatch);

});

//POST /todos

app.post('/todos', function(req, res){

	  var body = req.body;

	  var todo = {"id" : todoNextId, 
	  			   "description": body.description,
	  			   "completed" : body.completed
	  			 }

	  todos.push(todo);

	  todoNextId = todoNextId + 1; 

	  res.json(todo);
});




app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT);
});










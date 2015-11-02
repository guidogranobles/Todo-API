var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
		id: 1,
		description: 'Meet mom for lunch',
		completed: false
	},{
		id: 2,
		description: 'Go to market',
		completed: false
	},{
		id: 3,
		description: 'Buy new Books',
		completed: true
	}
];

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



app.listen(PORT, function(){

	console.log('Express listening on port ' + PORT);
});










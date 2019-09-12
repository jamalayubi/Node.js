'use strict';

// TODO: Write the homework code in this file
const uuid = require('uuid');
const express = require('express');
const app = express();
app.use(express.json());
const fs = require('fs');
app.get('/todos/:id', (request, response) => {
  response.send(request.params.id);
});

// createTodo (POST /todos)//
app.post('/todos', (request, response) => {
  readFile('./store.json', (todoslist) => {
    const activitiy = {
      id: uuid(),
      description: request.body.todo.description,
      done:false
    };
    todoslist.push(activitiy);

    writeFile('./store.json', todoslist, () => {});
    response.send(activitiy);
  });
});
app.get('/todos', (request, response) => {
  readFile('./store.json', (todolist) => {
    response.send(todolist);
  });
});

app.delete('/todos', (request, response) => {
  readFile('./store.json', (todolist) => {
    todolist.splice(0, todolist.length);
    writeFile('./store.json', todolist, () => {});
    response.status(204).send(todolist);
  });
});

app.delete('/todos/:id', (request, response) => {
  readFile('./store.json', (todolist) => {
    const activitiy = todolist.find(todo => todo.id === request.params.id);
    if (!activitiy) {
      return response.status(404).send('the todo task with the given ID is not found');
    };
    const index = todolist.indexOf(activitiy);
    todolist.splice(index, 1);
    writeFile('./store.json', todolist, () => { });
    response.status(204).send(activitiy);
  });
});

app.put('/todos/:id', (request, response) => {
  readFile('./store.json', (todolist) => {
    const task = todolist.find(todo => todo.id === request.params.id);
    if (!task) {
      return response.status(404).send('the todo task with the given ID is not found');
    };
    // update
    task.description = request.body.todo.description;
    const index = todolist.indexOf(task);
    todolist.splice(index, 1, task);
    writeFile('./store.json', todolist, () => { });
    response.status(200).send(task);
  });
});
app.listen(3000, () => console.log('server is listening to 3000 port'));

function readFile(filename, callback) {
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) throw err;
    const parsed = JSON.parse(data);
    const todoListArray = parsed.todo;
    callback(todoListArray);
  });
}
function writeFile(filename, data, callback) {
  const todoWrapper = {
    todo: data
  };
  const stringifiedWrapper = JSON.stringify(todoWrapper);
  fs.writeFile(filename, stringifiedWrapper, (err) => {
    if (err) throw err;
    callback();
  });
}

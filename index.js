const express = require('express');

const server = express();

server.use(express.json()); //Setando o express para trabalhar com JSON

// localhost:3000/users

// Tipo de Parametros
// Query params = ?nome=1
// Route params = /users/1
// Request body = { "name": "Breno", "email": "brenoq@yahoo.com.br" }
// CRUD = Create, Read, Update, Delete

const users = ['Breno', 'Luciana', 'Enzo'];

// Midleware Global de interceptação e log
server.use((req, res, next) => {
  console.time('Request');
  console.log(`O método foi: ${req.method} e a URL foi: ${req.url}`);

  next();
  console.timeEnd('Request');
});

// Midleware local
function checkUserExists (req, res, next){
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name required!'});
  }

  return next();
};

// Midleware local com alteração do parametro req
function checkUserInArray (req, res, next){
  const user = users[req.params.index];
  
  if (!user) {
    return res.status(400).json({ error: 'User does not exist'});
  }

  req.user = user;

  return next();
};

// Rota de todos os usuários
server.get('/users', (req, res) => {
  return res.json(users);
})

// Rota de apenas um usuário
server.get('/users/:index', checkUserInArray, (req, res) => {
  // const name = req.query.name; //Query params
  // const { index } = req.params;
  
  // return res.json({ message: `Hello ${name}` }); //Query params
  return res.json(req.user); //Query params
});

// Rota para criar usuários
server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;
  
  users.push(name);

  return res.json(users);
});

// Rota para alterar usuários já cadastrado
server.put('/users/:index', checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

// Rota para deletar usuário
server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
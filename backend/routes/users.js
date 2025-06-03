const express = require('express');
const router = express.Router();
const { readJSON, writeJSON } = require('./fileHandler');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'smartcommunity123';

const FILE = 'db_users.json';


router.post('/', (req, res) => {
  const users = readJSON(FILE);
  const { nome, email, senha, perfil = 'comum' } = req.body;

  // Validação básica
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  // Verifica se email já está cadastrado
  if (users.some(u => u.email === email)) {
    return res.status(409).json({ erro: 'Email já cadastrado' });
  }

  const novoUsuario = {
    id: Date.now(),
    nome,
    email,
    senha,
    perfil
  };

  users.push(novoUsuario);
  writeJSON(FILE, users);

  res.status(201).json({ sucesso: true, usuario: novoUsuario });
});

router.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const users = readJSON(FILE);
  const user = users.find(u => u.email === email && u.senha === senha);

  if (!user) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ id: user.id, perfil: user.perfil }, SECRET_KEY, { expiresIn: '2h' });

  res.status(200).json({
    token,
    usuario: { id: user.id, nome: user.nome, perfil: user.perfil }
  });
});


module.exports = router;

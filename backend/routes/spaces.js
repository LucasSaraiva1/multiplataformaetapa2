const express = require('express');
const router = express.Router();
const { readJSON, writeJSON } = require('./fileHandler');
const jwt = require('jsonwebtoken');
const SECRET = 'smartcommunity123';

const FILE = 'db_spaces.json';

// GET /spaces
router.get('/', (req, res) => {
  const spaces = readJSON(FILE);
  res.json(spaces);
});

// POST /spaces
router.post('/', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, SECRET);
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }

  const users = readJSON('db_users.json');
  const usuario = users.find(u => u.id == decoded.id);

  if (!usuario || usuario.perfil !== 'admin') {
    return res.status(403).json({ erro: 'Apenas administradores podem criar espaços.' });
  }

  const spaces = readJSON(FILE);
  const { nome, capacidade } = req.body;

  const newSpace = {
    id: Date.now(),
    nome,
    capacidade,
    ocupacoes: []
  };

  spaces.push(newSpace);
  writeJSON(FILE, spaces);
  res.status(201).json(newSpace);
});

router.post('/registrar-ocupacao', (req, res) => {
  const { espacoId, data, usuarioId, eventoId } = req.body;

  if (!espacoId || !data || !usuarioId || !eventoId) {
    return res.status(400).json({ erro: 'espacoId, data, usuarioId e eventoId são obrigatórios' });
  }

  const spaces = readJSON(FILE);
  const index = spaces.findIndex(s => s.id === espacoId);
  if (index === -1) {
    return res.status(404).json({ erro: 'Espaço não encontrado' });
  }

  // Garante estrutura consistente
  if (!spaces[index].ocupacoes) spaces[index].ocupacoes = [];

  // Verifica se a data já está ocupada
  const ocupado = Array.isArray(spaces[index].ocupacoes) && spaces[index].ocupacoes.length > 0;
  if (ocupado) {
    return res.status(409).json({ erro: 'Espaço já ocupado nessa data' });
  }

  // Adiciona ocupação
  spaces[index].ocupacoes.push({ data, usuarioId, eventoId });

  writeJSON(FILE, spaces);
  res.status(200).json({ sucesso: true });
});




module.exports = router;

const express = require('express');
const router = express.Router();
const { readJSON, writeJSON } = require('./fileHandler');

const FILE = 'db_events.json';
const SPACES_FILE = 'db_spaces.json';
const USERS_FILE = 'db_users.json';

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'smartcommunity123';

// GET /events
router.get('/', (req, res) => {
  const events = readJSON(FILE);
  res.json(events);
});

// POST /events
router.post('/', (req, res) => {
  const events = readJSON(FILE);
  const users = readJSON(USERS_FILE);

  const { nome, data, descricao, espacoId = null, status = 'pendente', usuarioId } = req.body;

  if (!usuarioId) {
    return res.status(400).json({ erro: 'usuarioId é obrigatório' });
  }

  const usuario = users.find(u => u.id == usuarioId);

  const newEvent = {
    id: Date.now(),
    nome,
    data,
    descricao,
    espacoId,
    status,
    usuarioId,
    usuarioNome: usuario ? usuario.nome : 'Desconhecido'
  };

  events.push(newEvent);
  writeJSON(FILE, events);
  res.status(201).json(newEvent);
});


// POST /events/aprovar
router.post('/aprovar', (req, res) => {
  const { eventId, espacoId, adminId } = req.body;

  if (!eventId || !espacoId || !adminId) {
    return res.status(400).json({ erro: 'eventId, espacoId e adminId são obrigatórios' });
  }

  const users = readJSON(USERS_FILE);
  const admin = users.find(u => u.id === adminId);

  if (!admin || admin.perfil !== 'admin') {
    return res.status(403).json({ erro: 'Usuário não autorizado' });
  }

  const events = readJSON(FILE);
  const eventIndex = events.findIndex(e => e.id === eventId);
  if (eventIndex === -1) {
    return res.status(404).json({ erro: 'Evento não encontrado' });
  }

  const event = events[eventIndex];

  const spaces = readSpaces(SPACES_FILE);
  const spaceIndex = spaces.findIndex(s => s.id === espacoId);
  if (spaceIndex === -1) {
    return res.status(404).json({ erro: 'Espaço não encontrado' });
  }

  // Verifica se o espaço já está ocupado na data do evento
  const jaOcupado = (spaces[spaceIndex].ocupacoes || []).some(o => o.data === event.data);
  if (jaOcupado) {
    return res.status(409).json({ erro: 'Espaço já está ocupado nessa data' });
  }

  // Aprova o evento
  event.status = 'aprovado';
  event.espacoId = espacoId;
  events[eventIndex] = event;
  writeJSON(FILE, events);

  // Registra a ocupação do espaço
  if (!spaces[spaceIndex].ocupacoes) spaces[spaceIndex].ocupacoes = [];
  spaces[spaceIndex].ocupacoes.push({
    data: event.data,
    usuarioId: event.usuarioId,
    eventoId: event.id
  });
  writeSpaces(SPACES_FILE, spaces);

  res.status(200).json({ sucesso: true, evento: event });
});

// DELETE /events/:id (apenas admin)
router.delete('/:id', (req, res) => {
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

  const users = readJSON(USERS_FILE);
  const usuario = users.find(u => u.id == decoded.id);

  if (!usuario || usuario.perfil !== 'admin') {
    return res.status(403).json({ erro: 'Apenas administradores podem remover eventos.' });
  }

  const events = readJSON(FILE);
  const eventId = parseInt(req.params.id);
  const index = events.findIndex(e => e.id === eventId);

  if (index === -1) {
    return res.status(404).json({ erro: 'Evento não encontrado' });
  }

  events.splice(index, 1);
  writeJSON(FILE, events);

  res.status(200).json({ sucesso: true });
});

module.exports = router;

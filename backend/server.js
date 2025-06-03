const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', require('./routes/users'));
app.use('/spaces', require('./routes/spaces'));
app.use('/events', require('./routes/events'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));

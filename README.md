
# SmartCommunity

Sistema simples e funcional para gestão de eventos e espaços em comunidades, organizações ou instituições.

---

Objetivo

O projeto SmartCommunity tem como objetivo:

- Permitir que usuários registrem eventos com data e título
- Permitir que usuários aloquem um espaço para seus eventos (caso esteja disponível)
- Restringir certas ações apenas a usuários administradores
- Visualizar eventos alocados por espaço, por data e por usuário
- Tudo isso de forma leve, usando Node.js + HTML + JSON como banco de dados

---

Tecnologias utilizadas

- Node.js (Express)
- HTML + CSS (Bootstrap)
- JavaScript (Fetch API)
- JSON como banco de dados local

---

Estrutura do Projeto


smartcommunity/
├── backend/
│   ├── fileHandler.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── events.js
│   │   └── spaces.js
│   ├── db_users.json
│   ├── db_events.json
│   └── db_spaces.json
├── frontend/
│   ├── index.html
│   ├── eventos.html
│   ├── espacos.html
│   ├── aprovacao.html
│   └── login.html
└── server.js


---

Como rodar localmente

1. Pré-requisitos

- Node.js 18+
- npm

2. Clonar o repositório


git clone https://github.com/seuusuario/smartcommunity.git
cd smartcommunity

3. Instalar as dependências

npm install


4. Rodar o servidor

node server.js

O backend será executado em: `http://localhost:3000`

---

Autenticação

- O sistema usa login simples com token JWT.
- Após o login, o `token`, `userId` e `perfil` são salvos no `localStorage`.


localStorage.setItem('token', token);
localStorage.setItem('userId', user.id);
localStorage.setItem('perfil', user.perfil); // "admin" ou "usuario"

---

Perfis de usuário

| Permissão                     | Usuário Comum | Admin |
|------------------------------|---------------|-------|
| Login                        | ✅            | ✅    |
| Criar evento                 | ✅            | ✅    |
| Alocar espaço (se livre)     | ✅            | ✅    |
| Criar espaço                 | ❌            | ✅    |
| Remover evento               | ❌            | ✅    |
| Aprovar evento / espaço      | ❌            | ✅    |

---

Funcionalidades principais

🔹 Login (`login.html`)
- Acesso via e-mail e senha
- Redirecionamento para home após login

🔹 Dashboard (`index.html`)
- Mostra nome do usuário e opções de navegação

🔹 Eventos (`eventos.html`)
- Criar novo evento (data + nome)
- Listar eventos cadastrados
- Botão de "Remover" (apenas admin)
- Botão "Alocar Espaço" se evento estiver aprovado

🔹 Espaços (`espacos.html`)
- Lista todos os espaços
- Mostra ocupações (data + nome do evento)
- Permite criar novo espaço (apenas admin)
- Permite alocar espaço caso ainda esteja disponível

---

Banco de Dados (Arquivos JSON)

Os dados são armazenados localmente nos seguintes arquivos:

- `db_users.json`
- `db_events.json`
- `db_spaces.json`

Exemplo de `db_events.json`


[
  {
    "id": 123456789,
    "nome": "Reunião Mensal",
    "data": "2025-07-10",
    "descricao": "",
    "status": "pendente",
    "usuarioId": "1",
    "usuarioNome": "Lucas",
    "espacoId": null
  }
]

Usuário do PROFESSOR

  {
    "id": 1748913136085,
    "nome": "profmiqueias",
    "email": "profmiqueias@gmail.com",
    "senha": "123",
    "perfil": "admin"
  }

---
Rotas disponíveis (API REST)

`/auth/login` `POST`
- Faz login e retorna token JWT

 `/users/me` `GET`
- Retorna dados do usuário autenticado

`/events` `GET / POST`
- Lista todos os eventos ou cria novo evento

`/events/:id` `DELETE`
- Remove evento (apenas se admin)

`/spaces` `GET / POST`
- Lista ou cria espaços (criação apenas se admin)

`/spaces/registrar-ocupacao` `POST`
- Aloca evento a espaço (se ainda estiver livre)

---

Autor

Desenvolvido por Lucas Saraiva (2124631) e Antônia Clares (2318524)

---

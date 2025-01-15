import express from 'express'
import cors from 'cors'

import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express()
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: true, // Permitir qualquer origem
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true, // Permitir credenciais
  },
});

let messages = []; // Lista em memória para armazenar mensagens enquanto o servidor está ativo


app.use(express.json())


// Middleware para resolver erro CORS

app.use(cors({
  origin: true, // Permitir qualquer origem
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true, // Permitir credenciais
}));




// Configuração do Socket.IO
io.on('connection', (socket) => {
  console.log(`Novo cliente conectado: ${socket.id}`);

  // Envia mensagens anteriores para o novo cliente
  socket.emit('previousMessages', messages);

  // Ouve novas mensagens enviadas pelos clientes
  socket.on('sendMessage', (data) => {
    messages.push(data); // Adiciona mensagem à lista em memória
    io.emit('receiveMessage', data); // Envia a mensagem para todos os clientes conectados
  });

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});


app.get('/', (req, res) => {
    res.status(200).json("SERVIDOR OK")
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {console.log(`Servidor rodando na porta ${PORT}`)})

export default app
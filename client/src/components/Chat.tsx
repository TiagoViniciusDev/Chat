"use client"
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message {
  username: string;
  message: string;
}

let socket: Socket;

export default function Chat() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Conecta ao Socket.IO
    socket = io("http://localhost:5000");

    // Receber mensagens anteriores
    socket.on('previousMessages', (msgs: Message[]) => {
      setMessages(msgs);
    });

    // Receber novas mensagens em tempo real
    socket.on('receiveMessage', (msg: Message) => {
      setMessages((prev) => [...prev, msg]); //Salva mensagens no state
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (username && message) { //Verifica se tem nome e msg no campo
      const newMessage = { username, message };
      socket.emit('sendMessage', newMessage); //Emitindo msg
      setMessage('');
    }
  };


  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Chat em Tempo Real</h1>
        </div>
        <div className="p-4 overflow-y-auto max-h-96 space-y-2">
          {messages.map((msg, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded-md">
              <span className="text-blue-500 font-bold">{msg.username}: </span>
              <span className="text-gray-700">{msg.message}</span>
            </div>
          ))}
        </div>
        <form className="p-4 border-t flex flex-col space-y-2" onSubmit={(e) => {e.preventDefault(); handleSendMessage()}}>
          <input
            type="text"
            placeholder="Seu nome"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Sua mensagem"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required  
          />
          <button
            type='submit'
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );  
}
  
'use strict';

require('dotenv').config();
const { createServer } = require('http');
const { Server } = require('socket.io');

const registerUserHandlers = require('./handlers/userHandlers');

const PORT = PORT || 3000;
const httpServer = createServer();
const server = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

httpServer.listen(PORT);

const onConnection = (socket) => {
  console.log(`New user connected with ${socket.id}`);
  socket.data = {
    name: null,
    room: null,
    pass: null,
  };

  socket.on('disconnect', () => {
    console.log(`User disconnected ${socket.id}`);
    console.log(socket.data);
  });

  // EVENT LOGGING
  socket.onAny((event, eventPayload = 'eventPayload null') => {
    const eventNotification = {
      event,
      date: Date(),
      eventPayload,
    };
    console.log(eventNotification);  // Can swap for saved logs
  });

  // HANDLERS
  registerUserHandlers(server, socket);
  messageHandlers(server, socket);
};

server.on('connection', onConnection);


const messageHandlers = (server, socket) => {
  // --- MESSAGE HANDLERS --- 

  const sendMessage = (message) => {
    const newMessage = {
      MID: `${socket.id}${Date.now()}`,
      SID: socket.id,
      message,
    };
    server.emit('MESSAGE:ADD', newMessage);
  };

  const deleteMessage = (MID) => {
    server.emit('MESSAGE:DELETE', MID);
  };

  const messageReply = (originMID, message) => {
    const replyMessage = {
      originMID,
      MID: `${socket.id}${Date.now()}`,
      SID: socket.id,
      message,
    };
    server.emit('MESSAGE:REPLY', replyMessage);
  };

  const messageReaction = (originMID, reaction) => {
    const messageReaction = {
      originMID,
      MID: `${socket.id}${Date.now()}`, // can remove if one reaction per originMID
      SID: socket.id,
      reaction, // provided by the client, reference library kept in channel, send UID for any reaction to find reaction
    };
    server.emit('MESSAGE:REACTION', messageReaction);
  };

  // --- LISTENERS - USER:(EVENT_NAME) --- 

  socket.on('MESSAGE:ADD', sendMessage);
  socket.on('MESSAGE:DELETE', deleteMessage);
  socket.on('MESSAGE:REPLY', messageReply);
  socket.on('MESSAGE:REACTION', messageReaction);
};
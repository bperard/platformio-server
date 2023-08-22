'use strict';

require('dotenv').config();
const { createServer } = require('http');
const { Server } = require('socket.io');

const registerUserHandlers = require('./handlers/userHandlers');

const PORT = 3000;
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
};

server.on('connection', onConnection);

'use strict'

require('dotenv').config();
const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = 3000;
const httpServer = createServer();
const server = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});

httpServer.listen(PORT);

const onConnection = (socket) => {
  console.log(`New user connected with ${socket.id}`);
  socket.data = {
    name: null,
    room: null,
    pass: null,
  };

  socket.onAny((event, eventPayload = 'eventPayload null') => {
    const eventNotification = {
      event,
      date: Date(),
      eventPayload
    }
    console.log(eventNotification);
  });
  
  socket.on('disconnect', () => {
    console.log(`User disconnected ${socket.id}`);
    console.log(socket.data);
  });

  // HANDLERS
  registerUserHandlers(server, socket);
}

server.on('connection', onConnection);

const registerRoomHandlers = (server, socket) => {
  const stringGenerator = (length, charSetString) => {
    let outputString = '';
    let chars = '';

    chars += charSetString.indexOf('a') > -1 ? 'abcdefghijklmnopqrstuvwxyz' : '';
    chars += charSetString.indexOf('A') > -1 ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '';
    chars += charSetString.indexOf('1') > -1 ? '1234567890' :
    '';
    chars += charSetString.indexOf('!') > -1 ? '!@#$%^&*()_+-=' : '';

    for (let i = 0; i < length; i++) {
      
    }

    return outputString;
  }
  const createRoom = (userName) => {

  }

  // LISTENERS - ROOM_(EVENT)
  socket.on('ROOM_CREATE', )
}

const registerUserHandlers = (server, socket) => {
  const nameUser = (userName) => {
    socket.data.name = userName;
    let nameHash = 0;
    for (let char of userName) {
      nameHash += char.charCodeAt(0);
    }
    console.log(nameHash);
    console.log(`${socket.id} is ${userName}`);
  }

  // LISTENERS  USER_(EVENT)
  socket.on('USER_NAME', nameUser)
}

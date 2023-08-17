'use strict';

require('dotenv').config();
const { createServer } = require('http');
const { Server } = require('socket.io');

const Hashbucket = require('./hashbucket');

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

const registerUserHandlers = (server, socket) => {
  const stringGenerator = (length, charSetString) => {
    let outputString = '';
    let chars = '';

    chars += charSetString.indexOf('a') > -1 ? 'abcdefghijklmnopqrstuvwxyz' : '';
    chars += charSetString.indexOf('A') > -1 ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '';
    chars += charSetString.indexOf('1') > -1 ? '1234567890' :
      '';
    chars += charSetString.indexOf('!') > -1 ? '!@#$%^&*()_+-=' : '';

    for (let i = 0; i < length; i++) {
      outputString += chars[Math.floor(Math.random() * chars.length)];
    }

    return outputString;
  };

  // MOVE ABOVE TO OWN MODULES
  const roomDirectory = new Hashbucket(1024);

  const createRoom = () => {
    let roomName = stringGenerator(5, 'A1');
    
    for (let i = 0; i < 10; i++) {
      console.log(`Room: ${roomName} (ATTEMPT)`);
      if (!roomDirectory.getItem(roomName)) {
        i = 10;
        console.log(`Room: ${roomName} (SUCCESS)`);
      } else if (i > 8) {
        // NAME FAILED, TRY AGAIN SOCKET EVENT
      } else {
        roomName = stringGenerator(5, 'A1');
      }
    }
    roomDirectory.setItem({ key: roomName, occupancy: 1 });

    // ROOM CREATED/JOINED SOCKET EVENT
  };

  const nameUser = (userName) => {
    socket.data.name = userName;
    // let nameHash = 0;
    // for (let i = 0; i < userName.length; i++) {
    //   nameHash += userName.charCodeAt(i) + i;
    // }
    // console.log('nameHash', nameHash);
    console.log(`${socket.id} is ${socket.data.name}`);
  };

  // LISTENERS  USER_(EVENT)
  socket.on('USER:ROOM_CREATE', createRoom);
  socket.on('USER:NAME_ADD', nameUser);
};

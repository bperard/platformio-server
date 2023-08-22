'use strict';

const userHandlers = (server, socket) => {
  const roomDirectory = new Hashbucket(1024);

  const createRoom = () => {
    // let roomName = stringGenerator(5, 'A1');

    
  };

  const getRoomNames = () => {
    const roomNames = roomDirectory.getKeys();
    // RETURN ROOM NAMES SOCKET EVENT
  };

  const getRoomInfo = (roomName) => {
    const roomInfo = roomDirectory.getItem(roomName);
    // RETURN ROOM INFO
  };

  const nameUser = (userName) => {
    socket.data.name = userName;
    // CHECK FOR UNIQUE NAME
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
  socket.on('USER:GET_ROOMS', getRoomNames);
};

module.exports = userHandlers;

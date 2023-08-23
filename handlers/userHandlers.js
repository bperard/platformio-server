'use strict';

const { RoomDirectory } = require('../utils/hashbucket/hashbucket');

const userHandlers = (server, socket) => {
  const roomDirectory = new RoomDirectory(881);

  const createRoom = (roomName = null) => {
    const roomCreated = roomDirectory.addRoom(roomName);
    if (roomCreated) {
      socket.join(roomCreated);
      socket.data.room = roomCreated;
      socket.emit('USER:ROOM_CREATED', roomCreated);

    } else {
      socket.emit('USER:ROOM_NOT_CREATED');  // Can attach error message to roomDirectoy.addRoom() false return
    }
  };

  const getRoomNames = () => {
    const roomNames = roomDirectory.getKeys();
    socket.emit('USER:RECEIVE_ROOM_NAMES', roomNames);
  };

  const getRoomInfo = (roomName) => {
    const roomInfo = roomDirectory.getRoomInfo(roomName);
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

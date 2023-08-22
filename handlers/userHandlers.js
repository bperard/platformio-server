'use strict';

const { RoomDirectory } = require('../utils/hashbucket/hashbucket');

const userHandlers = (server, socket) => {
  const roomDirectory = new RoomDirectory(881);

  const createRoom = (roomName = null) => {
    const roomCreated = roomDirectory.addRoom(roomName);

    if (roomCreated) {
      socket.join(roomCreated);
      socket.data.room = roomCreated;
    }

    socket.emit('USER:ROOM_CREATE_RESULT', roomCreated);  // Can attach error message to roomDirectoy.addRoom() false return
  };

  const getRoomNames = () => {
    const roomNames = roomDirectory.getKeys();
    socket.emit('USER:RECEIVE_ROOM_NAMES', roomNames);
  };

  const getRoomInfo = (roomName) => {
    const roomInfo = roomDirectory.getRoomInfo(roomName);
    socket.emit('USER:RECEIVE_ROOM_INFO', roomInfo);
  };

  const getAllRoomInfo = () => {
    const allRoomInfo = roomDirectory.getAllRoomInfo();
    socket.emit('USER:RECEIVE_ALL_ROOM_INFO', allRoomInfo);
  };

  const nameUser = (userName) => {
    socket.data.name = userName;
    const userInfo = {
      SID: socket.id,
      userName: userName,
    };
    // CHECK FOR UNIQUE NAME
    // Decide if check performed locally, or on client (superuser point of truth?)
    // let nameHash = 0;
    // for (let i = 0; i < userName.length; i++) {
    //   nameHash += userName.charCodeAt(i) + i;
    // }
    // console.log('nameHash', nameHash);
    console.log(`${socket.id} is ${socket.data.name}`);
    server.to(socket.data.room).emit('USER:NAME_ADDED', userInfo);
  };

  // LISTENERS - USER:(EVENT_NAME)
  socket.on('USER:ROOM_CREATE', createRoom);
  socket.on('USER:GET_ROOM_NAMES', getRoomNames);
  socket.on('USER:GET_ROOM_INFO', getRoomInfo);
  socket.on('USER:GET_ALL_ROOM_INFO', getAllRoomInfo);
  socket.on('USER:NAME_ADD', nameUser);
};

module.exports = userHandlers;

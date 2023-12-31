'use strict';

const { RoomDirectory } = require('../utils/hashbucket/hashbucket');

const userHandlers = (server, socket) => {
  const roomDirectory = new RoomDirectory(881);

  // --- ROOM MANAGEMENT HANDLERS ---

  const createRoom = (roomName = null) => {
    let roomCreated = roomDirectory.addRoom(socket.id, roomName);

    if (roomCreated) {
      socket.join(roomCreated);
      socket.data.room = roomCreated;
      roomCreated = {
        key: roomName,
        occupancy: 1,
        superuser: socket.id,
      };
    }

    socket.emit('USER:ROOM_CREATE_RESULT', roomCreated);  // Can attach error message to roomDirectoy.addRoom() false return
  };

  const deleteRoom = () => {
    // Can user superuser in roomDirectory to check SID to authorize delete
    // Fail message if not superuser?
    // If chosen, transfer superuser on leave?
    const roomRemoved = roomDirectory.removeRoom(socket.data.room);

    if (roomRemoved) {
      server.in(socket.data.room).emit('USER:ROOM_DELETED');
    }
  };

  const joinRoom = (roomName) => {
    const roomInfo = roomDirectory.joinRoom(roomName);

    if (roomInfo) {
      // Should probably set userName in this flow and send to room with SID
      socket.join(roomInfo.key);
      socket.data.room = roomInfo.key;
      socket.to(socket.data.room).emit('USER:NEW_USER', socket.id);
    }

    socket.emit('USER:ROOM_JOINED', roomInfo);
  };

  const leaveRoom = () => {
    const roomInfo = roomDirectory.leaveRoom(socket.data.room);

    if (roomInfo) {
      socket.leave(socket.data.room);
      
      if (!roomInfo.removed) {
        server.in(socket.data.room).emit('USER:ROOM_LEFT', socket.id);
      }
      
      socket.data.room = null;
    }

    socket.emit('USER:ROOM_LEFT', roomInfo);
  };

  // --- ROOM INFORMATION HANDLERS --- 

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

  // --- USER MANAGEMENT HANDLERS --- 

  const addUserName = (userName) => {
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
    server.in(socket.data.room).emit('USER:NAME_ADDED', userInfo);
  };

  const removeUserName = () => {
    socket.data.name = null;
    server.in(socket.data.room).emit('USER:NAME_REMOVED',socket.id);
  };

  const updateUserName = (userName) => {
    socket.data.name = userName;
    const userInfo = {
      SID: socket.id,
      userName: userName,
    };
    server.in(socket.data.room).emit('USER:NAME_UPDATED', userInfo);
  };

  // Get socket.data.name from specific socket.id
  // Get usernames object
  // - from superuser?
  // - names = [{socket.id = name},...{}]
  // Get all SIDs in room

  // --- LISTENERS - USER:(EVENT_NAME) --- 

  socket.on('USER:ROOM_CREATE', createRoom);
  socket.on('USER:ROOM_DELETE', deleteRoom);
  socket.on('USER:JOIN_ROOM', joinRoom);
  socket.on('USER:LEAVE_ROOM', leaveRoom);

  socket.on('USER:GET_ROOM_NAMES', getRoomNames);
  socket.on('USER:GET_ROOM_INFO', getRoomInfo);
  socket.on('USER:GET_ALL_ROOM_INFO', getAllRoomInfo);

  socket.on('USER:NAME_ADDED', addUserName);
  socket.on('USER:NAME_REMOVED', removeUserName);
  socket.on('USER:NAME_UPDATED', updateUserName);
};

module.exports = userHandlers;

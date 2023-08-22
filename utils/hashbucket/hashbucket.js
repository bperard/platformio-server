'use strict';

const { stringGenerator } = require('../utils');

class Hashbucket {
  constructor(size) {
    this.size = size;
    this.buckets = new Array(size);
  }

  hashKey(key) {
    let hashed = 0;
    const keyString = key.toString();

    for (let i = 0; i < keyString.length; i++) {
      hashed += +`${keyString.charCodeAt(i)}${i}`;
    }

    const hashedKey = (hashed * 983) % this.size;
    return hashedKey;
  }

  setItem(item) {
    const { key } = item;
    let { bucket, index, hashedKey } = this.hasItem(key);

    if (index < 0) {
      if (!bucket) {
        this.buckets[hashedKey] = [];
        bucket = this.buckets[hashedKey];
      }

      bucket.push(item);
    }
  }

  getItem(key) {
    const { index, bucket } = this.hasItem(key);

    return index > -1 ? bucket[index] : false;
  }

  removeItem(key) {
    let { bucket, index } = this.hasItem(key);

    if (bucket && (index > -1)) {
      bucket.splice(index, 1);
    }
  }

  updateItem(itemUpdates) {
    const { bucket, index } = this.hasItem(itemUpdates.key);

    if (bucket && (index > -1)) {
      const item = bucket[index];

      for (let property in itemUpdates) {
        const prevValue = item[property];

        if (typeof itemUpdates[property] === 'function') {
          item[property] = itemUpdates[property](prevValue);
        } else {
          item[property] = itemUpdates[property];
        }
      }
      return bucket[index];

    } else {
      return false;
    }
  }

  hasItem(key) {
    const hashedKey = this.hashKey(key);
    const bucket = this.buckets[hashedKey];
    const bucketIndexAndHashedKey = { bucket, index: -1, hashedKey };

    if (bucket) {
      for (let i = 0; i < bucket.length; i++) {
        if (bucket[i].key === key) {
          bucketIndexAndHashedKey.index = i;
          i = bucket.length;
        }
      }
    }

    return bucketIndexAndHashedKey;
  }

  getKeys() {
    const keys = [];

    for (let bucket of this.buckets) {
      if (bucket) {
        for (let item of bucket) {
          keys.push(item.key);
        }
      }
    }

    return keys;
  }
}


class RoomDirectory extends Hashbucket {
  constructor(size) {
    super(size);
  }

  addRoom(roomName = null) {
    let attempts = 1;

    if (!roomName) {
      roomName = stringGenerator(5, 'A1');
      attempts = 10;
    }

    for (let i = 0; i < attempts; i++) {
      console.log(`Room: ${roomName} (ATTEMPT)`);

      if (!this.getItem(roomName)) {
        this.setItem({
          key: roomName,
          occupancy: 1,
        });
        i = attempts;
        console.log(`Room: ${roomName} (SUCCESS)`);
        return roomName;

      } else if (i >= attempts - 1) {
        console.log(`Room: ${roomName} (FAILURE)`);
        return false;

      } else {
        roomName = stringGenerator(5, 'A1');
      }
    }
  }

  removeRoom(roomName) {
    this.removeItem(roomName);
    return this.getItem(roomName) ? false : true;
  }

  joinRoom(roomName) {
    const joinedRoom = this.updateItem({
      key: roomName,
      occupancy: function (prev) {
        return prev + 1;
      },
    });

    return joinedRoom;
  }

  leaveRoom(roomName) {
    const leftRoom = this.updateItem({
      key: roomName,
      occupancy: function (prev) {
        return prev - 1;
      },
    });

    if (leftRoom.occupancy < 1) {
      leftRoom.removed = this.removeRoom(roomName);
    }

    return leftRoom;
  }

  getRoomInfo(roomName) {
    return this.getItem(roomName);
  }

  getRoomDirectory() {
    const roomNames = this.getKeys();
    return roomNames.map(roomName => this.getItem(roomName));
  }
}

module.exports = {
  Hashbucket,
  RoomDirectory,
};

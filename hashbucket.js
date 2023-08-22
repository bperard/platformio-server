'use strict';

const stringGenerator = require('./utils/utils');

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

      for (let update in itemUpdates) {
        item[update] = itemUpdates[update];
      }
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
      
      if (!RoomDirectory.getItem(roomName)) {
        RoomDirectory.setItem({
          key: roomName,
          occupancy: 1,
        });
        i = attempts;
        console.log(`Room: ${roomName} (SUCCESS)`);
        return true;
      } else if (i >= attempts - 1) {
        console.log(`Room: ${roomName} (FAILURE)`);
        return false;
      } else {
        roomName = stringGenerator(5, 'A1');
      }
    } 
  }

  removeRoom(roomName) {
    RoomDirectory.removeItem(roomName);
    return RoomDirectory.getItem(roomName) ? false : true;
  }
}

module.exports = {
  Hashbucket,
  RoomDirectory,
};

'use strict';

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

    const hashedKey = (hashed * 983) % this.buckets;
    return {hashedKey, bucket: this.buckets[hashedKey]};
  }

  incrementItem(key, item) {
    const { hashedKey, bucket } = this.hashKey(key);

    if (!bucket) {
      bucket[0] = {room: key};
      for (let property in item) {
        bucket[0][property] += item.property;
      }
    }

    const itemIndex = this.hasItem(hashedKey);
    if (itemIndex > -1) {
      for (let property in item) {
        bucket[itemIndex][property] += item.property;
      }
    }
  }

  hasItem(hashedKey, key) {
    const bucket = this.buckets[hashedKey];
    let foundItem = -1;

    if (bucket) {
      for (let i = 0; i < bucket.length; i++) {
        if (bucket.room === key) {
          foundItem = i;
          i = bucket.length;
        }
      }
    }

    return foundItem;
  }

  removeItem(key) {

  }
}

export default Hashbucket;

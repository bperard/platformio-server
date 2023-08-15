'use strict';

class Hashbuckets {
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
    return hashedKey;
  }

  addItem(key, value) {
    const hashedKey = this.hashKey(key);

    if (!this.buckets[hashedKey]) {
      this.buckets[hashedKey] = [];
    }

    this.buckets[hashedKey].push([key, value]);
  }

  hasItem(key) {
    const hashedKey = this.hashKey(key);
    const bucket = this.buckets[hashedKey];
    let foundItem = false;

    if (bucket) {
      for (let i = 0; i < bucket.length; i++) {
        if (bucket[i][0] === key) {
          foundItem = true;
          i = bucket.length;
        }
      }
    }

    return foundItem;
  }

  removeItem(key) {

  }
}
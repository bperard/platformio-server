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

    const hashedKey = (hashed * 983) % this.size;
    return hashedKey;
  }

  setItem(item) {
    const { key } = item;
    let { bucket, index, hashedKey } = this.hasItem(key);

    if (!bucket || bucket.length < 1) {
      this.buckets[hashedKey] = [];
      bucket = this.buckets[hashedKey];
    }

    if (index < 0) {
      bucket.push(item);
      // } else {
      //   Item already present, decide if error response, or silent fail
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
      // } else {
      //   Item not present decide if error response, or silent fail
    }
  }

  updateItem(itemUpdates) {
    const { bucket, index } = this.hasItem(itemUpdates.key);

    if (bucket && (index > -1)) {
      const item = bucket[index];
      for (let update in itemUpdates) {
        item[update] = itemUpdates[update];
      }
      // } else {
      //     Item not present decide if error response, or silent fail;
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

module.exports = Hashbucket;

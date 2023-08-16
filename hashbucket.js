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
    return hashedKey;
  }

  addItem(key, item) {
    const { bucket, index } = this.hasItem(key);

    if (!bucket) {
      bucket[0] = {key};
    } 
    
    if (index < 0) {
      for (let property in item) {
        bucket[0][property] = item.property;
      }
    } else {
      // Item already present, decide if error response, or silent fail
    }
  }

  hasItem(key) {
    const hashedKey = this.hashKey(key);
    const bucket = this.buckets[hashedKey];
    const bucketAndIndex = {bucket, index: -1};

    if (bucket) {
      for (let i = 0; i < bucket.length; i++) {
        if (bucket[i].key === key) {
          bucketAndIndex.index = i;
          i = bucket.length;
        }
      }
    }

    return bucketAndIndex;
  }

  removeItem(key) {

  }
}

export default Hashbucket;

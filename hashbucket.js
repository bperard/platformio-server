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

  hasItem(key) {
    const hashedKey = this.hashKey(key);
    const bucket = this.buckets[hashedKey];
    const bucketAndIndex = { bucket, index: -1 };

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

  addItem(key, item) {
    const { bucket, index } = this.hasItem(key);

    if (!bucket) {
      bucket[0] = { key };
    }

    if (index < 0) {
      for (let property in item) {
        bucket[0][property] = item.property;
      }
      // } else {
      //   Item already present, decide if error response, or silent fail
    }
  }

  removeItem(key) {
    const { bucket, index } = this.hasItem(key);

    if (bucket && (index > -1)) {
      bucket.splice(index, 1);
      // } else {
      //   Item not present decide if error response, or silent fail
    }
  }

  updateItem(key, itemUpdates) {
    const { bucket, index } = this.hasItem(key);

    if (bucket && (index > -1)) {
      const item = bucket[index];
      for (let update in itemUpdates) {
        item[update] = itemUpdates[update];
      }
    // } else {
    //     Item not present decide if error response, or silent fail;
    }
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

export default Hashbucket;

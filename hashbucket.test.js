'use strict';

const Hashbucket = require('./hashbucket');

describe('Hashbucket', () => {
  it('Creates Hashbucket of given size', () => {
    const size = 20;
    const newHashbucket = new Hashbucket(size);

    expect(newHashbucket.size).toEqual(size);
  });

  it('Returns a hashkey in range 0 to this.size - 1', () => {
    const size = 20;
    const testBucket = new Hashbucket(size);
    const hashedKey = testBucket.hashKey('this is my key');

    expect(hashedKey).toBeGreaterThanOrEqual(0);
    expect(hashedKey).toBeLessThan(testBucket.size);
  });

  it('Adds item to bucket of hashed index', () => {
    const size = 20;
    const testBucket = new Hashbucket(size);
    const item = {
      key: 'this is my key',
      value: 42,
    };

    testBucket.setItem(item);
    const currentBucket = testBucket.buckets[testBucket.hashKey(item.key)];

    expect(currentBucket).toEqual([item]);
  });

  it('Returns item object or false if item not present', () => {
    const testBucket = new Hashbucket(20);
    const item = {
      key: 'this is my key',
      value: 42,
    };
    const meti = {
      key: 'yek ym si siht',
      value: 24,
    };

    testBucket.setItem(item);
    const itemReturned = testBucket.getItem(item.key);
    const itemNotFound = testBucket.getItem(meti.key);

    expect(itemReturned).toEqual(item);
    expect(itemNotFound).toEqual(false);
  });

  it('Removes item from bucket of hashed index', () => {
    const singleBucket = new Hashbucket(1);
    const item0 = {
      key: 'this is my key',
      value: 42,
    };
    const item1 = {
      key: 'this is also my key',
      value: 101,
    };

    singleBucket.setItem(item0);
    const currentBucket = singleBucket.buckets[0];
    expect(currentBucket).toEqual([item0]);

    singleBucket.setItem(item1);
    expect(currentBucket).toEqual([item0, item1]);

    singleBucket.removeItem(item0.key);
    expect(currentBucket).toEqual([item1]);
  });

  it('Updates provided item properties', () => {
    const testBucket = new Hashbucket(20);
    const item = {
      key: 'this is my key',
      value: 42,
      slogan: 'this is my slogan',
    };
    const itemUpdate = {
      key: 'this is my key',
      slogan: 'this is now my slogan',
    };
    const itemFinal = {
      key: 'this is my key',
      value: 42,
      slogan: 'this is now my slogan',
    };

    testBucket.setItem(item);
    const currentBucket = testBucket.buckets[testBucket.hashKey(item.key)];
    expect(currentBucket).toEqual([item]);

    testBucket.updateItem(itemUpdate);
    expect(currentBucket).toEqual([itemFinal]);
  });

  it('Returns response object containing bucket, index, and hashkey of provided item; index will be -1 if item not present', () => {
    const testBucket = new Hashbucket(20);
    const item = {
      key: 'this is my key',
      value: 42,
    };
    const meti = {
      key: 'yek ym si siht',
      value: 24,
    };

    testBucket.setItem(item);
    const itemResponse = testBucket.hasItem(item.key);
    expect(itemResponse).toEqual({bucket: testBucket.buckets[13], index: 0, hashedKey: 13});

    const metiResponse = testBucket.hasItem(meti.key);
    expect(metiResponse).toEqual({bucket: undefined, index: -1, hashedKey: 3});
  });

  it('Returns an array containing the keys for every item', () => {
    const testBucket = new Hashbucket(20);
    const item = {
      key: 'this is my key',
      value: 42,
    };
    const meti = {
      key: 'yek ym si siht',
      value: 24,
    };
    const item1 = {
      key: 'this is also my key',
      value: 101,
    };

    testBucket.setItem(item);
    testBucket.setItem(meti);
    testBucket.setItem(item1);
    const keys = testBucket.getKeys();

    expect(keys).toEqual(['yek ym si siht', 'this is also my key', 'this is my key']);
  });
});

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

    testBucket.addItem(item);
    const currentBucket = testBucket.buckets[testBucket.hashKey(item.key)];

    expect(currentBucket).toEqual([item]);
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

    singleBucket.addItem(item0);
    const currentBucket = singleBucket.buckets[0];
    expect(currentBucket).toEqual([item0]);

    singleBucket.addItem(item1);
    expect(currentBucket).toEqual([item0, item1]);

    singleBucket.removeItem(item0.key);
    expect(currentBucket).toEqual([item1]);
  });
});

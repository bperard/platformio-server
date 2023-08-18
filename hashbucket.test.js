'use strict';

const Hashbucket = require('./hashbucket');

describe('Hashbucket', () => {
  it('Creates Hashbucket of given size', () => {
    const size = 20;
    const newHashbucket = new Hashbucket(size);

    expect(newHashbucket.size).toEqual(size);
  });

  const size = 20;
  const testBucket = new Hashbucket(size);

  it('Returns a hashkey in range 0 to this.size - 1', () => {
    const hashedKey = testBucket.hashKey('this is my key');

    expect(hashedKey).toBeGreaterThanOrEqual(0);
    expect(hashedKey).toBeLessThan(testBucket.size);
  });

  it('Adds item to bucket of hashed index', () => {
    const item = {
      key: 'this is my key',
      value: 42,
    };

    testBucket.addItem(item.key, item);
    const currentBucket = testBucket.buckets[testBucket.hashKey(item.key)];
    expect(currentBucket).toEqual([item]);
  });
});

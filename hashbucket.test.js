'use strict';

const Hashbucket = require('./hashbucket');

describe('Hashbucket', () => {
  it('Creates Hashbucket of given size', () => {
    const size = 20;
    const newHashbucket = new Hashbucket(size);

    expect(newHashbucket.size).toEqual(size);
  });
});

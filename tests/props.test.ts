/* eslint-disable prefer-promise-reject-errors */
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { delay, props } from '../src';

const test = suite('props');

const mapper = async (val: number | Promise<number>) => (await val) * 2;
const deferredMapper = async (val: number | Promise<number>) => {
  await delay(1);
  return (await val) * 2;
};

test('should reject undefined', async () => {
  try {
      // @ts-expect-error
    await props(undefined);
    assert.unreachable('Should have thrown TypeError');
  } catch (error) {
    assert.instance(error, TypeError);
  }
});

test('should reject string', async () => {
  try {
      // @ts-expect-error
    await props('string');
    assert.unreachable('Should have thrown TypeError');
  } catch (error) {
    assert.instance(error, TypeError);
  }
});

test('using mapper', async () => {
  const input = { one: 1, two: 2, three: 3 };
  const results = await props(input, mapper);
  assert.equal(results, { one: 2, two: 4, three: 6 });
});

test('using deferredMapper', async () => {
  const input = { one: 1, two: 2, three: 3 };
  const results = await props(input, deferredMapper);
  assert.equal(results, { one: 2, two: 4, three: 6 });
});

test('should resolve to new object', async () => {
  const input = {};
  const results = await props(input);
  assert.equal(input === results, false);
  assert.equal(results, input);
});

test('should resolve value properties', async () => {
  const input = { one: 1, two: 2, three: 3 };
  const results = await props(input);
  assert.equal(input === results, false);
  assert.equal(results, input);
});

test('should resolve immediate properties', async () => {
  const input = {
    one: Promise.resolve(1),
    two: Promise.resolve(2),
    three: Promise.resolve(3),
  };
  const results = await props(input);
  assert.equal(results, { one: 1, two: 2, three: 3 });
});

test('should resolve mix properties', async () => {
  const input = {
    one: 1,
    two: Promise.resolve(2),
    three: 3,
  };
  const results = await props(input);
  assert.equal(results, { one: 1, two: 2, three: 3 });
});

test('treats arrays for their properties', async () => {
  const input = [1, 2, 3];
  const results = await props(input);
  assert.equal(results, { 0: 1, 1: 2, 2: 3 });
});

test('works with es6 maps', async () => {
  const input = new Map([
    ['one', 1],
    ['two', 2],
    ['three', 3],
  ]);
  const results = await props(input);
  assert.equal(results.get('one'), 1);
  assert.equal(results.get('two'), 2);
  assert.equal(results.get('three'), 3);
});

test('works with es6 maps promise', async () => {
  const input = new Map([
    ['one', Promise.resolve(1)],
    ['two', Promise.resolve(2)],
    ['three', Promise.resolve(3)],
  ]);
  const results = await props(input);
  assert.equal(results.get('one'), 1);
  assert.equal(results.get('two'), 2);
  assert.equal(results.get('three'), 3);
});

test.run();

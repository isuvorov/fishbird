/* eslint-disable import/no-extraneous-dependencies */
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { delay, mapSeries } from '../src';

const test = suite('mapSeries – test');

const mapper = async (val: number | Promise<number>) => (await val) * 2;
const deferredMapper = async (val: number | Promise<number>) => {
  await delay(1);
  return (await val) * 2;
};

test('hello', () => {
  assert.is(1, 1);
});

test('should map input values array', async () => {
  const input = [1, 2, 3];
  const results = await mapSeries(input, mapper);
  assert.equal(results, [2, 4, 6]);
});

test('should map input promises array', async () => {
  const input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
  const results = await mapSeries(input, mapper);
  assert.equal(results, [2, 4, 6]);
});

test('should map mixed input array', async () => {
  const input = [1, Promise.resolve(2), 3];
  const results = await mapSeries(input, mapper);
  assert.equal(results, [2, 4, 6]);
});

test('should map input when mapper returns a promise', async () => {
  const input = [1, 2, 3];
  const results = await mapSeries(input, deferredMapper);
  assert.equal(results, [2, 4, 6]);
});

test('should map input promises when mapper returns a promise', async () => {
  const input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
  const results = await mapSeries(input, deferredMapper);
  assert.equal(results, [2, 4, 6]);
});

test('should accept a promise for an array', async () => {
  const input = [1, Promise.resolve(2), 3];
  const results = await mapSeries(input, deferredMapper);
  assert.equal(results, [2, 4, 6]);
});

test('should throw a TypeError when input promise does not resolve to an array', async () => {
  const input = Promise.resolve(123);
  try {
    // @ts-expect-error
    await mapSeries(input, mapper);
    assert.unreachable('Should have thrown TypeError');
  } catch (error) {
    assert.instance(error, TypeError);
  }
});

test('should reject when input contains rejection', async () => {
  const input = [Promise.resolve(1), Promise.reject(2), Promise.resolve(3)];
  try {
    await mapSeries(input, mapper);
    assert.unreachable('Should have rejected with value 2');
  } catch (error) {
    assert.is(error, 2);
  }
});

test('should call mapper asynchronously on values array', async () => {
  const input = [1, 2, 3];
  let calls = 0;
  const counterMapper = () => calls++;
  await mapSeries(input, counterMapper);
  assert.is(calls, 3);
});

test('should call mapper asynchronously on mixed array', async () => {
  const input = [1, Promise.resolve(2), 3];
  let calls = 0;
  const counterMapper = () => calls++;
  await mapSeries(input, counterMapper);
  assert.is(calls, 3);
});

test.run();

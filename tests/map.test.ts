/* eslint-disable import/no-extraneous-dependencies */
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { delay, map } from '../src';

const test = suite('map – test');

const mapper = async (val: number | Promise<number>) => (await val) * 2;
const deferredMapper = async (val: number | Promise<number>) => {
  await delay(1);
  return (await val) * 2;
};

test('should map input values array', async () => {
  const input = [1, 2, 3];
  const results = await map(input, mapper);
  assert.equal(results, [2, 4, 6]);
});

test('should map input promises array', async () => {
  const input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
  const results = await map(input, mapper);
  assert.equal(results, [2, 4, 6]);
});

test('should map mixed input array', async () => {
  const input = [1, Promise.resolve(2), 3];
  const results = await map(input, mapper);
  assert.equal(results, [2, 4, 6]);
});

test('should map input when mapper returns a promise', async () => {
  const input = [1, 2, 3];
  const results = await map(input, deferredMapper);
  assert.equal(results, [2, 4, 6]);
});

test('should map input promises when mapper returns a promise', async () => {
  const input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
  const results = await map(input, deferredMapper);
  assert.equal(results, [2, 4, 6]);
});

test('should accept a promise for an array', async () => {
  const input = [1, Promise.resolve(2), 3];
  const results = await map(input, deferredMapper);
  assert.equal(results, [2, 4, 6]);
});

test('should throw a TypeError when input promise does not resolve to an array', async () => {
  const input = Promise.resolve(123);
  try {
    // @ts-expect-error
    await map(input, mapper);
    assert.unreachable('Should have thrown TypeError');
  } catch (error) {
    assert.instance(error, TypeError);
  }
});

test('should reject when input contains rejection', async () => {
  const input = [Promise.resolve(1), Promise.reject(2), Promise.resolve(3)];
  try {
    await map(input, mapper);
    assert.unreachable('Should have rejected with value 2');
  } catch (error) {
    assert.is(error, 2);
  }
});

test('should call mapper asynchronously on values array', async () => {
  const input = [1, 2, 3];
  let calls = 0;
  const counterMapper = () => calls++;
  await map(input, counterMapper);
  assert.is(calls, 3);
});

test('should call mapper asynchronously on mixed array', async () => {
  const input = [1, Promise.resolve(2), 3];
  let calls = 0;
  const counterMapper = () => calls++;
  await map(input, counterMapper);
  assert.is(calls, 3);
});

test.run();



const concurrency = { concurrency: 2 };

const test2 = suite('map – test with concurrency');

test2('wrong concurrency', async () => {
  const input = [1, 2, 3];
  try {
    // @ts-expect-error
    await map(input, mapper, { concurrency: '3' });
    assert.unreachable('Should have thrown TypeError');
  } catch (error) {
    assert.instance(error, TypeError);
  }
});

test2('empty options', async () => {
  const input = [1, 2, 3];
  const results = await map(input, mapper);
  assert.equal(results, [2, 4, 6]);
});

test2('empty option concurrency', async () => {
  const input = [1, 2, 3];
  const results = await map(input, mapper, {});
  assert.equal(results, [2, 4, 6]);
});

test2('should map input values array with concurrency', async () => {
  const input = [1, 2, 3];
  const results = await map(input, mapper, concurrency);
  assert.equal(results, [2, 4, 6]);
});

test2('should map input promises array with concurrency', async () => {
  const input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
  const results = await map(input, mapper, concurrency);
  assert.equal(results, [2, 4, 6]);
});

test2('should map mixed input array with concurrency', async () => {
  const input = [1, Promise.resolve(2), 3];
  const results = await map(input, mapper, concurrency);
  assert.equal(results, [2, 4, 6]);
});

test2('should map input when mapper returns a promise with concurrency', async () => {
  const input = [1, 2, 3];
  const results = await map(input, deferredMapper, concurrency);
  assert.equal(results, [2, 4, 6]);
});

test2('should map input promises when mapper returns a promise with concurrency', async () => {
  const input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
  const results = await map(input, deferredMapper, concurrency);
  assert.equal(results, [2, 4, 6]);
});

test2('should accept a promise for an array with concurrency', async () => {
  const input = [1, Promise.resolve(2), 3];
  const results = await map(input, deferredMapper, concurrency);
  assert.equal(results, [2, 4, 6]);
});

test2('should reject when input contains rejection with concurrency', async () => {
  const input = [Promise.resolve(1), Promise.reject(2), Promise.resolve(3)];
  try {
    await map(input, mapper, concurrency);
    assert.unreachable('Should have rejected with value 2');
  } catch (error) {
    assert.is(error, 2);
  }
});

test2('should not have more than {concurrency} promises in flight', async () => {
  const input = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const immediates: any[] = [];
  function immediate(index: number) {
    let resolve;
    const promise = new Promise((res) => {
      resolve = res;
    });
    immediates.push({ promise, resolve, index });
    return promise;
  }

  const lates: any[] = [];
  function late(index: number) {
    let resolve;
    const promise = new Promise((res) => {
      resolve = res;
    });
    lates.push({ promise, resolve, index });
    return promise;
  }

  function promiseByIndex(index: number) {
    return index < 5 ? immediate(index) : late(index);
  }

  const tempResults: any[] = [];
  const ret1 = map(
    input,
    (value: any, index: number) => {
      return promiseByIndex(index).then(() => {
        tempResults.push(value);
      });
    },
    { concurrency: 5 },
  );

  const ret2 = delay(100)
    .then(() => {
      assert.equal(tempResults.length, 0);
      immediates.forEach((item) => item.resolve(item.index));
      return Promise.all(immediates.map((item) => item.promise));
    })
    .then(() => delay(100))
    .then(() => {
      assert.equal(tempResults, [0, 1, 2, 3, 4]);
      lates.forEach((item) => item.resolve(item.index));
    })
    .then(() => delay(100))
    .then(() => {
      assert.equal(tempResults, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      lates.forEach((item) => item.resolve(item.index));
    })
    .then(() => ret1)
    .then(() => {
      assert.equal(tempResults, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

  await Promise.all([ret1, ret2]);
});

test2.run();

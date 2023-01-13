/* eslint-disable prefer-promise-reject-errors */
/*
Based on When.js tests

Open Source Initiative OSI - The MIT License

http://www.opensource.org/licenses/mit-license.php

Copyright (c) 2011 Brian Cavalier

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */

import { delay, PromiseMap } from '../src';

describe('map – test', () => {
  const mapper = async (val: number | Promise<number>) => (await val) * 2;
  const deferredMapper = async (val: number | Promise<number>) => {
    await delay(1);
    return (await val) * 2;
  };

  test('hello', () => {
    expect(1).toBe(1);
  });

  test('should map input values array', async () => {
    const input = [1, 2, 3];
    const results = await map(input, mapper);
    expect(results).toEqual([2, 4, 6]);
  });

  test('should map input promises array', async () => {
    const input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
    const results = await map(input, mapper);
    expect(results).toEqual([2, 4, 6]);
  });

  test('should map mixed input array', async () => {
    const input = [1, Promise.resolve(2), 3];
    const results = await map(input, mapper);
    expect(results).toEqual([2, 4, 6]);
  });

  test('should map input when mapper returns a promise', async () => {
    const input = [1, 2, 3];
    const results = await map(input, deferredMapper);
    expect(results).toEqual([2, 4, 6]);
  });

  test('should map input promises when mapper returns a promise', async () => {
    const input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
    const results = await map(input, deferredMapper);
    expect(results).toEqual([2, 4, 6]);
  });

  test('should accept a promise for an array', async () => {
    const input = [1, Promise.resolve(2), 3];
    const results = await map(input, deferredMapper);
    expect(results).toEqual([2, 4, 6]);
  });

  test('should throw a TypeError when input promise does not resolve to an array', async () => {
    const input = Promise.resolve(123);
    const run = async () => {
      // @ts-expect-error
      const results = await map(input, mapper);
      return results;
    };
    await expect(run).rejects.toThrow(TypeError);
  });

  test('should reject when input contains rejection', async () => {
    const input = [Promise.resolve(1), Promise.reject(2), Promise.resolve(3)];
    const run = async () => {
      const results = await map(input, mapper);
      return results;
    };
    await expect(run).rejects.toEqual(2);
  });

  test('should call mapper asynchronously on values array', async () => {
    const input = [1, 2, 3];
    let calls = 0;
    const counterMapper = () => calls++;
    expect(calls).toEqual(0);
    await map(input, counterMapper);
    expect(calls).toEqual(3);
  });

  test('should call mapper asynchronously on mixed array', async () => {
    const input = [1, Promise.resolve(2), 3];
    let calls = 0;
    const counterMapper = () => calls++;
    expect(calls).toEqual(0);
    await map(input, counterMapper);
    expect(calls).toEqual(3);
  });
});

describe('map – test with concurrency', () => {
  const concurrency = { concurrency: 2 };
  const mapper = async (val: number | Promise<number>) => (await val) * 2;
  const deferredMapper = async (val: number | Promise<number>) => {
    await delay(1);
    return (await val) * 2;
  };

  test('wrong concurrency', async () => {
    const input = [1, 2, 3];
    const run = async () => {
      // @ts-expect-error
      const results = await map(input, mapper, { concurrency: '3' });
      return results;
    };
    await expect(run).rejects.toThrow(TypeError);
  });

  // test('empty mapper', async () => {
  //   const input = [1, 2, 3];
  //   const results = await map(input, undefined);
  //   expect(results).toEqual([2, 4, 6]);
  // });

  test('empty options', async () => {
    const input = [1, 2, 3];
    const results = await map(input, mapper);
    expect(results).toEqual([2, 4, 6]);
  });

  test('empty option concurrency', async () => {
    const input = [1, 2, 3];
    const results = await map(input, mapper, {});
    expect(results).toEqual([2, 4, 6]);
  });

  test('should map input values array with concurrency', async () => {
    const input = [1, 2, 3];
    const results = await map(input, mapper, concurrency);
    expect(results).toEqual([2, 4, 6]);
  });

  test('should map input promises array with concurrency', async () => {
    const input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
    const results = await map(input, mapper, concurrency);
    expect(results).toEqual([2, 4, 6]);
  });

  test('should map mixed input array with concurrency', async () => {
    const input = [1, Promise.resolve(2), 3];
    const results = await map(input, mapper, concurrency);
    expect(results).toEqual([2, 4, 6]);
  });

  test('should map input when mapper returns a promise with concurrency', async () => {
    const input = [1, 2, 3];
    const results = await map(input, deferredMapper, concurrency);
    expect(results).toEqual([2, 4, 6]);
  });

  test('should map input promises when mapper returns a promise with concurrency', async () => {
    const input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
    const results = await map(input, deferredMapper, concurrency);
    expect(results).toEqual([2, 4, 6]);
  });

  test('should accept a promise for an array with concurrency', async () => {
    const input = [1, Promise.resolve(2), 3];
    const results = await map(input, deferredMapper, concurrency);
    expect(results).toEqual([2, 4, 6]);
  });

  test('should resolve to empty array when input promise does not resolve to an array with concurrency', async () => {
    const input = Promise.resolve(123);
    const run = async () => {
      // @ts-expect-error
      const results = await map(input, mapper, concurrency);
      return results;
    };
    await expect(run).rejects.toThrow(TypeError);
  });

  test('should reject when input contains rejection with concurrency', async () => {
    // eslint-disable-next-line prefer-promise-reject-errors
    const input = [Promise.resolve(1), Promise.reject(2), Promise.resolve(3)];
    const run = async () => {
      const results = await map(input, mapper, concurrency);
      return results;
    };
    await expect(run).rejects.toEqual(2);
  });

  test('should not have more than {concurrency} promises in flight', async () => {
    const input = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const immediates: any[] = [];
    function immediate(index: number) {
      let topResolve;
      const ret = new Promise((localResolve) => {
        topResolve = localResolve;
      });
      immediates.push([ret, topResolve, index]);
      return ret;
    }

    const lates: any[] = [];
    function late(index: number) {
      let topResolve;
      const ret = new Promise((localResolve) => {
        topResolve = localResolve;
      });
      lates.push([ret, topResolve, index]);
      return ret;
    }

    function promiseByIndex(index: number) {
      return index < 5 ? immediate(index) : late(index);
    }
    function resolve(item: any) {
      item[1](item[2]);
    }

    const tempResults: number[] = [];
    const ret1 = map(
      input,
      (value, index) =>
        promiseByIndex(index).then(() => {
          // @ts-ignore
          tempResults.push(value);
        }),
      { concurrency: 5 }
    );

    const ret2 = delay(100)
      .then(() => {
        expect(tempResults.length).toEqual(0);
        immediates.forEach(resolve);
        return immediates.map((item) => item[0]);
      })
      .then(() => delay(100))
      .then(() => {
        expect(tempResults).toEqual([0, 1, 2, 3, 4]);
        lates.forEach(resolve);
      })
      .then(() => delay(100))
      .then(() => {
        expect(tempResults).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        lates.forEach(resolve);
      })
      .then(() => ret1)
      .then(() => {
        expect(tempResults).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });
    return Promise.all([ret1, ret2]);
  });
});

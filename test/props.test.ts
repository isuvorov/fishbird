/* eslint-disable prefer-promise-reject-errors */
import { delay, props } from '../src';

describe('props', () => {
  const mapper = async (val: number | Promise<number>) => (await val) * 2;
  const deferredMapper = async (val: number | Promise<number>) => {
    await delay(1);
    return (await val) * 2;
  };

  test('should reject undefined', async () => {
    const run = async () => {
      // @ts-expect-error
      const results = await props(undefined);
      return results;
    };
    await expect(run).rejects.toThrow(TypeError);
  });
  test('should reject undefined', async () => {
    const run = async () => {
      // @ts-expect-error
      const results = await props('string');
      return results;
    };
    await expect(run).rejects.toThrow(TypeError);
  });

  test('using mapper', async () => {
    const input = {
      one: 1,
      two: 2,
      three: 3,
    };
    const results = await props(input, mapper);
    expect(results).toEqual({ one: 2, two: 4, three: 6 });
  });
  test('using mapper', async () => {
    const input = {
      one: 1,
      two: 2,
      three: 3,
    };
    const results = await props(input, mapper);
    expect(results).toEqual({ one: 2, two: 4, three: 6 });
  });
  test('using deferredMapper', async () => {
    const input = {
      one: 1,
      two: 2,
      three: 3,
    };
    const results = await props(input, deferredMapper);
    expect(results).toEqual({ one: 2, two: 4, three: 6 });
  });

  test('should resolve to new object', async () => {
    const input = {};
    const results = await props(input);
    expect(input === results).toEqual(false);
    expect(results).toEqual(input);
  });

  test('should resolve value properties', async () => {
    const input = {
      one: 1,
      two: 2,
      three: 3,
    };
    const results = await props(input);
    expect(input === results).toEqual(false);
    expect(results).toEqual(input);
  });
  test('should resolve immediate properties', async () => {
    const input: Record<string, Promise<number>> = {
      one: Promise.resolve(1),
      two: Promise.resolve(2),
      three: Promise.resolve(3),
    };
    const results = await props(input);
    expect(results).toEqual({
      one: 1,
      two: 2,
      three: 3,
    });
  });
  test('should resolve mix properties', async () => {
    const input: Record<string, number | Promise<number>> = {
      one: 1,
      two: Promise.resolve(2),
      three: 3,
    };
    const results = await props(input);
    expect(results).toEqual({
      one: 1,
      two: 2,
      three: 3,
    });
  });

  //   test('should resolve eventual properties', () => {
  //     const d1 = Promise.defer();
  //     const d2 = Promise.defer();
  //     const d3 = Promise.defer();
  //     const o = {
  //       one: d1.promise,
  //       two: d2.promise,
  //       three: d3.promise,
  //     };

  //     setTimeout(() => {
  //       d1.fulfill(1);
  //       d2.fulfill(2);
  //       d3.fulfill(3);
  //     }, 1);

  //     return props(o).then((v) => {
  //       assert.deepEqual(
  //         {
  //           one: 1,
  //           two: 2,
  //           three: 3,
  //         },
  //         v
  //       );
  //     });
  //   });

  // test('should reject if any input promise rejects', async () => {
  //   // eslint-disable-next-line prefer-promise-reject-errors
  //   const input: Record<string, Promise<number>> = {
  //     one: Promise.resolve(1),
  //     two: Promise.reject(2),
  //     three: Promise.resolve(3),
  //   };
  //   const run = async () => {
  //     const results = await props(input);
  //     return results;
  //   };
  //   await expect(run).rejects.toEqual(2);
  // });

  //   test('should accept a promise for an object', () => {
  //     const o = {
  //       one: Promise.resolve(1),
  //       two: Promise.resolve(2),
  //       three: Promise.resolve(3),
  //     };
  //     const d1 = Promise.defer();
  //     setTimeout(() => {
  //       d1.fulfill(o);
  //     }, 1);
  //     return props(d1.promise).then((v) => {
  //       assert.deepEqual(
  //         {
  //           one: 1,
  //           two: 2,
  //           three: 3,
  //         },
  //         v
  //       );
  //     });
  //   });

  //   test('should reject a promise for a primitive', () => {
  //     const d1 = Promise.defer();
  //     setTimeout(() => {
  //       d1.fulfill('text');
  //     }, 1);
  //     return props(d1.promise).caught(TypeError, () => {});
  //   });

  //   test('should accept thenables in properties', () => {
  //     const t1 = {
  //       then(cb) {
  //         cb(1);
  //       },
  //     };
  //     const t2 = {
  //       then(cb) {
  //         cb(2);
  //       },
  //     };
  //     const t3 = {
  //       then(cb) {
  //         cb(3);
  //       },
  //     };
  //     const o = {
  //       one: t1,
  //       two: t2,
  //       three: t3,
  //     };
  //     return props(o).then((v) => {
  //       assert.deepEqual(
  //         {
  //           one: 1,
  //           two: 2,
  //           three: 3,
  //         },
  //         v
  //       );
  //     });
  //   });

  //   test('should accept a thenable for thenables in properties', () => {
  //     const o = {
  //       then(f) {
  //         f({
  //           one: {
  //             then(cb) {
  //               cb(1);
  //             },
  //           },
  //           two: {
  //             then(cb) {
  //               cb(2);
  //             },
  //           },
  //           three: {
  //             then(cb) {
  //               cb(3);
  //             },
  //           },
  //         });
  //       },
  //     };
  //     return props(o).then((v) => {
  //       assert.deepEqual(
  //         {
  //           one: 1,
  //           two: 2,
  //           three: 3,
  //         },
  //         v
  //       );
  //     });
  //   });

  test('treats arrays for their properties', async () => {
    const input = [1, 2, 3];
    const results = await props(input);
    expect(results).toEqual({
      0: 1,
      1: 2,
      2: 3,
    });
  });

  //   if (typeof Map !== 'undefined') {
  test('works with es6 maps', async () => {
    const input = new Map([
      ['one', 1],
      ['two', 2],
      ['three', 3],
    ]);
    const results = await props(input);
    expect(results.get('one')).toEqual(1);
    expect(results.get('two')).toEqual(2);
    expect(results.get('three')).toEqual(3);
  });

  test('works with es6 maps promice', async () => {
    const input = new Map([
      ['one', Promise.resolve(1)],
      ['two', Promise.resolve(2)],
      ['three', Promise.resolve(3)],
    ]);
    const results = await props(input);
    expect(results.get('one')).toEqual(1);
    expect(results.get('two')).toEqual(2);
    expect(results.get('three')).toEqual(3);
  });

  //     test("doesn't await promise keys in es6 maps", () => {
  //       const a = new Promise(() => {});
  //       const b = new Promise(() => {});
  //       const c = new Promise(() => {});

  //       return props(
  //         new Map([
  //           [a, Promise.resolve(1)],
  //           [b, Promise.resolve(2)],
  //           [c, Promise.resolve(3)],
  //         ])
  //       ).then((result) => {
  //         assert.strictEqual(result.get(a), 1);
  //         assert.strictEqual(result.get(b), 2);
  //         assert.strictEqual(result.get(c), 3);
  //       });
  //     });

  //     test('empty map should resolve to empty map', () =>
  //       props(new Map()).then((result) => {
  //         assert(result instanceof Map);
  //       })
  //     );
  //   }
});

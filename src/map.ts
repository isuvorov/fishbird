/**
 * Promise.map(arr, fn, concurrency) in Bluebird
 * code take from caolan/async
 */

import type { Options, PromiseOrValue } from './types.js';

export function map<IN, OUT = Awaited<IN>>(
  arr: IN[],
  fn?: (item: Awaited<IN>, index?: number, array?: IN[]) => OUT,
  { concurrency = Infinity }: Options = { concurrency: Infinity },
): Promise<Awaited<OUT>[]> {
  if (typeof concurrency !== 'number') {
    throw new TypeError(`${String(concurrency)} is not a number`);
  }
  if (!Array.isArray(arr)) {
    throw new TypeError(`arr must be collection, but got ${typeof arr}`);
  }
  const fn2 = fn || ((item: PromiseOrValue<IN>): OUT => item as OUT);
  return new Promise((resolve, reject) => {
    let completed = 0;
    let started = 0;
    let running = 0;
    const results = new Array(arr.length).fill(undefined);
    let rejected = false;

    function start(index: number) {
      const cur = arr[index];
      // @ts-ignore
      Promise.resolve(fn2.call(cur, cur, index, arr))
        .then((result) => {
          running--;
          completed++;
          results[index] = result;
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          replenish();
        })
        .catch((err) => {
          rejected = true;
          reject(err);
        });
    }

    function replenish() {
      // if any previous item rejected, do not start others
      if (rejected) return;

      if (completed >= arr.length) {
        resolve(results);
        return;
      }

      while (running < concurrency && started < arr.length) {
        start(started);
        running++;
        started++;
      }
    }

    replenish();
  });
}

export default map;

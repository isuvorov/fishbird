/**
 * Promise.map(arr, fn, concurrency) in Bluebird
 * code take from caolan/async
 */

import { IterateFunction, MapOptions, PromiseOrValue } from './types';

export function map<IN, OUT>(
  arr: PromiseOrValue<IN>[],
  fn?: IterateFunction<PromiseOrValue<IN>, OUT>,
  { concurrency = Infinity }: MapOptions = { concurrency: Infinity }
): Promise<OUT[]> {
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

// export function map(arr, fn, { concurrency = Infinity } = {}) {
//   if (typeof concurrency !== 'number') {
//     throw new TypeError(`${String(concurrency)} is not a number`);
//   }

//   return new Promise((resolve, reject) => {
//     let completed = 0;
//     let started = 0;
//     let running = 0;
//     const results = new Array(arr.length).fill(undefined);
//     let rejected = false;

//     function start(index) {
//       const cur = arr[index];
//       Promise.resolve(fn.call(cur, cur, index, arr))
//         .then((result) => {
//           running--;
//           completed++;
//           results[index] = result;

//           replenish();
//         })
//         .catch((err) => {
//           rejected = true;
//           reject(err);
//         });
//     }

//     function replenish() {
//       // if any previous item rejected, do not start others
//       if (rejected) return;

//       if (completed >= arr.length) {
//         return resolve(results);
//       }

//       while (running < concurrency && started < arr.length) {
//         start(started);
//         running++;
//         started++;
//       }
//     }

//     replenish();
//   });
// }

// // module.exports = function (
// //   Promise,
// //   PromiseArray,
// //   apiRejection,
// //   tryConvertToPromise,
// //   INTERNAL,
// //   debug
// // ) {
// // let ASSERT = require("./assert");
// // let util = require("./util");
// //   let {tryCatch} = util;
// //   let {errorObj} = util;
// //   let async = Promise._async;

// //   function MappingPromiseArray(promises, fn, limit, _filter) {
// //     this.constructor$(promises);
// //     this._promise._captureStackTrace();
// //     let context = Promise._getContext();
// //     this._callback = util.contextBind(context, fn);
// //     this._preservedValues =
// //       _filter === INTERNAL ? new Array(this.length()) : null;
// //     this._limit = limit;
// //     this._inFlight = 0;
// //     this._queue = [];
// //     async.invoke(this._asyncInit, this, undefined);
// //     if (util.isArray(promises)) {
// //       for (let i = 0; i < promises.length; ++i) {
// //         let maybePromise = promises[i];
// //         if (maybePromise instanceof Promise) {
// //           maybePromise.suppressUnhandledRejections();
// //         }
// //       }
// //     }
// //   }
// //   util.inherits(MappingPromiseArray, PromiseArray);

// //   MappingPromiseArray.prototype._asyncInit = function () {
// //     this._init$(undefined, RESOLVE_ARRAY);
// //   };

// //   // The following hack is required because the super constructor
// //   // might call promiseFulfilled before this.callback = fn is set
// //   //
// //   // The super constructor call must always be first so that fields
// //   // are initialized in the same order so that the sub-class instances
// //   // will share same memory layout as the super class instances

// //   // Override
// //   MappingPromiseArray.prototype._init = function () {};

// //   // Override
// //   MappingPromiseArray.prototype._promiseFulfilled = function (value, index) {
// //     ASSERT(!this._isResolved());
// //     var values = this._values;
// //     var length = this.length();
// //     var preservedValues = this._preservedValues;
// //     var limit = this._limit;

// //     // Callback has been called for this index if it's negative
// //     if (index < 0) {
// //         // Restore the actual index value
// //         index = (index * -1) - 1;
// //         values[index] = value;
// //         if (limit >= 1) {
// //             this._inFlight--;
// //             this._drainQueue();
// //             if (this._isResolved()) return true;
// //         }
// //     } else {
// //         if (limit >= 1 && this._inFlight >= limit) {
// //             values[index] = value;
// //             this._queue.push(index);
// //             return false;
// //         }
// //         if (preservedValues !== null) preservedValues[index] = value;

// //         var promise = this._promise;
// //         var callback = this._callback;
// //         var receiver = promise._boundValue();
// //         promise._pushContext();
// //         var ret = tryCatch(callback).call(receiver, value, index, length);
// //         var promiseCreated = promise._popContext();
// //         debug.checkForgottenReturns(
// //             ret,
// //             promiseCreated,
// //             preservedValues !== null ? "Promise.filter" : "Promise.map",
// //             promise
// //         );
// //         if (ret === errorObj) {
// //             this._reject(ret.e);
// //             return true;
// //         }

// //         // If the mapper function returned a promise we simply reuse
// //         // The MappingPromiseArray as a PromiseArray for round 2.
// //         // To mark an index as "round 2" its inverted by adding +1 and
// //         // multiplying by -1
// //         var maybePromise = tryConvertToPromise(ret, this._promise);
// //         if (maybePromise instanceof Promise) {
// //             maybePromise = maybePromise._target();
// //             var bitField = maybePromise._bitField;
// //             USE(bitField);
// //             if (BIT_FIELD_CHECK(IS_PENDING_AND_WAITING_NEG)) {
// //                 if (limit >= 1) this._inFlight++;
// //                 values[index] = maybePromise;
// //                 maybePromise._proxy(this, (index + 1) * -1);
// //                 return false;
// //             } if (BIT_FIELD_CHECK(IS_FULFILLED)) {
// //                 ret = maybePromise._value();
// //             } else if (BIT_FIELD_CHECK(IS_REJECTED)) {
// //                 this._reject(maybePromise._reason());
// //                 return true;
// //             } else {
// //                 this._cancel();
// //                 return true;
// //             }
// //         }
// //         values[index] = ret;
// //     }
// //     var totalResolved = ++this._totalResolved;
// //     if (totalResolved >= length) {
// //         if (preservedValues !== null) {
// //             this._filter(values, preservedValues);
// //         } else {
// //             this._resolve(values);
// //         }
// //         return true;
// //     }
// //     return false;
// // };

// //   MappingPromiseArray.prototype._drainQueue = function () {
// //     let queue = this._queue;
// //     let limit = this._limit;
// //     let values = this._values;
// //     while (queue.length > 0 && this._inFlight < limit) {
// //       if (this._isResolved()) return;
// //       let index = queue.pop();
// //       this._promiseFulfilled(values[index], index);
// //     }
// //   };

// //   MappingPromiseArray.prototype._filter = function (booleans, values) {
// //     let len = values.length;
// //     let ret = new Array(len);
// //     let j = 0;
// //     for (let i = 0; i < len; ++i) {
// //       if (booleans[i]) ret[j++] = values[i];
// //     }
// //     ret.length = j;
// //     this._resolve(ret);
// //   };

// //   MappingPromiseArray.prototype.preservedValues = function () {
// //     return this._preservedValues;
// //   };

// //   function map(promises, fn, options, _filter) {
// //     if (typeof fn !== 'function') {
// //       return apiRejection(FUNCTION_ERROR + util.classString(fn));
// //     }

// //     let limit = 0;
// //     if (options !== undefined) {
// //       if (typeof options === 'object' && options !== null) {
// //         if (typeof options.concurrency !== 'number') {
// //           return Promise.reject(
// //             new TypeError(
// //               `'concurrency' must be a number but it is ${
// //                                     util.classString(options.concurrency)}`));
// //           );
// //         }
// //         limit = options.concurrency;
// //       } else {
// //         return Promise.reject(
// //           new TypeError(
// //             'options argument must be an object but it is ' +
// //               util.classString(options)
// //           )
// //         );
// //       }
// //     }
// //     limit =
// //       typeof limit === 'number' && isFinite(limit) && limit >= 1 ? limit : 0;
// //     return new MappingPromiseArray(promises, fn, limit, _filter).promise();
// //   }

// //   Promise.prototype.map = function (fn, options) {
// //     return map(this, fn, options, null);
// //   };

// //   Promise.map = function (promises, fn, options, _filter) {
// //     return map(promises, fn, options, _filter);
// //   };
// };

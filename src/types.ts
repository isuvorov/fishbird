export type PromiseOrValue<T> = T | Promise<T>;

export type MapIterateFunction<IN, OUT> = (
  item: IN,
  index: number,
  array: IN[]
) => PromiseOrValue<OUT>;

export type PropIterateFunction<IN, OUT> = (
  item: IN,
  index: string,
  obj: IN[] | Record<string, IN>
) => PromiseOrValue<OUT>;

export type IterateFunction<IN, OUT> =
  | MapIterateFunction<IN, OUT>
  | PropIterateFunction<IN, OUT>;

export interface MapOptions {
  concurrency?: number;
}

export type IterableCollection<T> =
  | Record<string, PromiseOrValue<T>>
  | Map<string, PromiseOrValue<T>>
  | Array<PromiseOrValue<T>>;

export declare function Map<IN, OUT>(
  arr: IN[],
  fn: IterateFunction<IN, OUT>,
  options: MapOptions
): Promise<OUT[]>;

export declare function PropsFunction<IN, OUT>(
  obj: IterableCollection<IN>,
  fn?: IterateFunction<PromiseOrValue<IN>, OUT>,
  options?: MapOptions
): Promise<Record<string, OUT> | Map<string, OUT>>;

// type Constructor<E> = new (...args: any[]) => E;
// type CatchFilter<E> = ((error: E) => boolean) | (Record<string, unknown> & E);
// type Resolvable<R> = R | PromiseLike<R>;
// type IterateFunction<T, R> = (
//   item: T,
//   index: number,
//   arrayLength: number
// ) => Resolvable<R>;

// type PromisifyAllKeys<T> = T extends string ? `${T}Async` : never;
// type WithoutLast<T> = T extends [...infer A, any] ? A : [];
// type Last<T> = T extends [...any[], infer L] ? L : never;
// type ExtractCallbackValueType<T> = T extends (
//   error: any,
//   ...data: infer D
// ) => any
//   ? D
//   : never;

// type PromiseMethod<TArgs, TReturn> = TReturn extends never
//   ? never
//   : (...args: WithoutLast<TArgs>) => Promise<TReturn>;

// type ExtractAsyncMethod<T> = T extends (...args: infer A) => any
//   ? PromiseMethod<A, ExtractCallbackValueType<Last<Required<A>>>[0]>
//   : never;

// type PromisifyAllItems<T> = {
//   [K in keyof T as PromisifyAllKeys<K>]: ExtractAsyncMethod<T[K]>;
// };

// type NonNeverValues<T> = {
//   [K in keyof T as T[K] extends never ? never : K]: T[K];
// };

// // Drop `never` values
// type PromisifyAll<T> = NonNeverValues<PromisifyAllItems<T>> & T;

// interface ConcurrencyOption {
//   concurrency: number;
// }
// interface SpreadOption {
//   spread: boolean;
// }
// interface FromNodeOptions {
//   multiArgs?: boolean | undefined;
// }
// interface PromisifyOptions {
//   context?: any;
//   multiArgs?: boolean | undefined;
// }

// //   /**
// //    * Same as calling `Bluebird.map(thisPromise, mapper)`. With the exception that if this promise is bound to a value, the returned promise is bound to that value too.
// //    */
// type mapFn<U, Q> = (
//   this: Bluebird<R & Iterable<Q>>,
//   mapper: IterateFunction<Q, U>,
//   options?: ConcurrencyOption
// ) => Bluebird<U[]>;

// type mapSeries<U, Q> = (
//   this: Bluebird<R & Iterable<Q>>,
//   iterator: IterateFunction<Q, U>
// ) => Bluebird<U[]>;

// // "use strict";
// // module.exports = function(Promise,
// //                           PromiseArray,
// //                           apiRejection,
// //                           tryConvertToPromise,
// //                           INTERNAL,
// //                           debug) {
// // var ASSERT = require("./assert");
// // var util = require("./util");
// // var tryCatch = util.tryCatch;
// // var errorObj = util.errorObj;
// // var async = Promise._async;

// // function MappingPromiseArray(promises, fn, limit, _filter) {
// //     this.constructor$(promises);
// //     this._promise._captureStackTrace();
// //     var context = Promise._getContext();
// //     this._callback = util.contextBind(context, fn);
// //     this._preservedValues = _filter === INTERNAL
// //         ? new Array(this.length())
// //         : null;
// //     this._limit = limit;
// //     this._inFlight = 0;
// //     this._queue = [];
// //     async.invoke(this._asyncInit, this, undefined);
// //     if (util.isArray(promises)) {
// //         for (var i = 0; i < promises.length; ++i) {
// //             var maybePromise = promises[i];
// //             if (maybePromise instanceof Promise) {
// //                 maybePromise.suppressUnhandledRejections();
// //             }
// //         }
// //     }
// // }
// // util.inherits(MappingPromiseArray, PromiseArray);

// // MappingPromiseArray.prototype._asyncInit = function() {
// //     this._init$(undefined, RESOLVE_ARRAY);
// // };

// // // The following hack is required because the super constructor
// // // might call promiseFulfilled before this.callback = fn is set
// // //
// // // The super constructor call must always be first so that fields
// // // are initialized in the same order so that the sub-class instances
// // // will share same memory layout as the super class instances

// // // Override
// // MappingPromiseArray.prototype._init = function () {};

// // // Override
// // MappingPromiseArray.prototype._promiseFulfilled = function (value, index) {
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
// //             } else if (BIT_FIELD_CHECK(IS_FULFILLED)) {
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

// // MappingPromiseArray.prototype._drainQueue = function () {
// //     var queue = this._queue;
// //     var limit = this._limit;
// //     var values = this._values;
// //     while (queue.length > 0 && this._inFlight < limit) {
// //         if (this._isResolved()) return;
// //         var index = queue.pop();
// //         this._promiseFulfilled(values[index], index);
// //     }
// // };

// // MappingPromiseArray.prototype._filter = function (booleans, values) {
// //     var len = values.length;
// //     var ret = new Array(len);
// //     var j = 0;
// //     for (var i = 0; i < len; ++i) {
// //         if (booleans[i]) ret[j++] = values[i];
// //     }
// //     ret.length = j;
// //     this._resolve(ret);
// // };

// // MappingPromiseArray.prototype.preservedValues = function () {
// //     return this._preservedValues;
// // };

// // function map(promises, fn, options, _filter) {
// //     if (typeof fn !== "function") {
// //         return apiRejection(FUNCTION_ERROR + util.classString(fn));
// //     }

// //     var limit = 0;
// //     if (options !== undefined) {
// //         if (typeof options === "object" && options !== null) {
// //             if (typeof options.concurrency !== "number") {
// //                 return Promise.reject(
// //                     new TypeError("'concurrency' must be a number but it is " +
// //                                     util.classString(options.concurrency)));
// //             }
// //             limit = options.concurrency;
// //         } else {
// //             return Promise.reject(new TypeError(
// //                             "options argument must be an object but it is " +
// //                              util.classString(options)));
// //         }
// //     }
// //     limit = typeof limit === "number" &&
// //         isFinite(limit) && limit >= 1 ? limit : 0;
// //     return new MappingPromiseArray(promises, fn, limit, _filter).promise();
// // }

// // Promise.prototype.map = function (fn, options) {
// //     return map(this, fn, options, null);
// // };

// // Promise.map = function (promises, fn, options, _filter) {
// //     return map(promises, fn, options, _filter);
// // };

// // };

// export type PromiseOrValue<T> = T | Promise<T>;
export type PromiseOrValue<T> = PromiseLike<T>

export type Iterator<IN, OUT, COLLECTION = IN[]> = (
  item: PromiseOrValue<IN>,
  index: number,
  array: COLLECTION,
) => PromiseOrValue<OUT>;


export interface Options {
  concurrency?: number;
}

export interface MapCollection<IN> extends Array<IN> { }

export interface PropsRecordCollection<IN> extends Record<string, IN> { }
export interface PropsMapCollection<IN> extends Map<string, IN> { }

// // export type IterateFunction<IN, OUT> = MapIterateFunction<IN, OUT> | PropIterateFunction<IN, OUT>;

// export interface MapOptions {
//   concurrency?: number;
// }


// export type IterableCollection<T> =
//   | Record<string, PromiseOrValue<T>>
//   | Map<string, PromiseOrValue<T>>
//   | Array<PromiseOrValue<T>>;

// export declare function Map<IN, OUT>(
//   arr: IN[],
//   fn: MapIterateFunction<IN, OUT>,
//   options: MapOptions,
// ): Promise<OUT[]>;

// export declare function PropsFunction<IN, OUT>(
//   obj: IterableCollection<IN>,
//   fn?: PropIterateFunction<PromiseOrValue<IN>, OUT>,
//   options?: MapOptions,
// ): Promise<Record<string, OUT> | Map<string, OUT>>;

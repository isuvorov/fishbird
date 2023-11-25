// export type PromiseOrValue<T> = T | Promise<T>;
export type PromiseOrValue<T> = PromiseLike<T>;

export type Iterator<IN, OUT, COLLECTION = IN[]> = (
  item: PromiseOrValue<IN>,
  index: number,
  array: COLLECTION,
) => PromiseOrValue<OUT>;

export interface Options {
  concurrency?: number;
}

export interface MapCollection<T> extends Array<T> {}

export interface PropsRecordCollection<T> extends Record<string, T> {}
export interface PropsMapCollection<T> extends Map<string, T> {}

export type PromiseOrValue<T> = T | Promise<T>;

export type IteratorFn<IN, OUT, COLLECTION = IN> = (
  item: Awaited<IN>,
  index: number,
  collection: COLLECTION,
) => OUT;

export interface Options {
  concurrency?: number;
}

export type ArrayCollection<T> = T[];
export interface RecordCollection<T> extends Record<string, T> {}
export interface MapCollection<T> extends Map<string, T> {}

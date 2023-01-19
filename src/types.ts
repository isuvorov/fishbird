export type PromiseOrValue<T> = T | Promise<T>;

export type MapIterateFunction<IN, OUT> = (
  item: IN,
  index: number,
  array: IN[],
) => PromiseOrValue<OUT>;

export type PropIterateFunction<IN, OUT> = (
  item: IN,
  index: string,
  obj: IN[] | Record<string, IN>,
) => PromiseOrValue<OUT>;

export type IterateFunction<IN, OUT> = MapIterateFunction<IN, OUT> | PropIterateFunction<IN, OUT>;

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
  options: MapOptions,
): Promise<OUT[]>;

export declare function PropsFunction<IN, OUT>(
  obj: IterableCollection<IN>,
  fn?: IterateFunction<PromiseOrValue<IN>, OUT>,
  options?: MapOptions,
): Promise<Record<string, OUT> | Map<string, OUT>>;

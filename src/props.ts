/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */
import { map } from './map';
import { IterateFunction, MapOptions, PromiseOrValue } from './types';

type IterableCollection<T> =
  | Record<string, PromiseOrValue<T>>
  | Map<string, PromiseOrValue<T>>
  | Array<PromiseOrValue<T>>;

export async function props<IN, OUT>(
  obj: IterableCollection<IN>,

  fn?: IterateFunction<PromiseOrValue<IN>, OUT>,
  options?: MapOptions
): Promise<Record<string, OUT> | Map<string, OUT>> {
  const isMap = obj instanceof Map;
  if (!Array.isArray(obj) && !isMap && typeof obj !== 'object') {
    throw new TypeError(
      `input must be object, array or map, but got ${typeof obj}`
    );
  }

  const keys = isMap ? Array.from(obj.keys()) : Object.keys(obj);
  const rawValues = isMap ? Array.from(obj.values()) : Object.values(obj);

  // if (!fn) fn = (item: PromiseOrValue<IN>): OUT => item;
  const values = await map<IN, OUT>(rawValues, fn, options);
  const results = isMap
    ? (new Map() as Map<string, OUT>)
    : ({} as Record<string, OUT>);
  keys.forEach((key, index) => {
    if (results instanceof Map) {
      results.set(key, values[index]);
    } else {
      results[key] = values[index];
    }
  });
  return results;
}

export default props;

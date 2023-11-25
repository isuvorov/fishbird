import { map } from './map.js';
import type { IteratorFn, MapCollection, Options, RecordCollection } from './types.js';

// NOTE: тут вообще хз как поступать при перегрузке
// @ts-ignore
// export async function props<IN, OUT = Awaited<IN>>(
//   obj: MapCollection<IN>,
//   fn?: IteratorFn<IN, OUT, MapCollection<IN>>,
//   options?: Options,
// ): Promise<MapCollection<Awaited<OUT>>>;

export async function props<IN, OUT = Awaited<IN>>(
  obj: Record<string, IN>,
  fn?: IteratorFn<IN, OUT, Record<string, IN>>,
  options?: Options,
): Promise<Record<string, Awaited<OUT>>> {
  const isMap = obj instanceof Map;
  if (!Array.isArray(obj) && !isMap && typeof obj !== 'object') {
    throw new TypeError(`input must be object, array or map, but got ${typeof obj}`);
  }

  const keys = isMap ? Array.from(obj.keys()) : Object.keys(obj);
  const rawValues = isMap ? Array.from(obj.values()) : Object.values(obj);

  // NOTE: тут TS прав, надо дорабатывать
  // @ts-ignore
  const values = await map<IN, OUT>(rawValues, fn, options);
  const results = isMap
    ? (new Map<string, OUT>() as MapCollection<OUT>)
    : ({} as RecordCollection<OUT>);
  keys.forEach((key, index) => {
    if (results instanceof Map) {
      results.set(key, values[index]);
    } else {
      results[key] = values[index];
    }
  });
  // NOTE: тут вообще хз как поступать при перегрузке
  // TODO: надо что-то типа такого сделать
  //  as T extends PropsRecordCollection ? PropsRecordCollection : PropsMapCollection;;
  // @ts-ignore
  return results; // as obj extends MapCollection<OUT> ? MapCollection<OUT> : RecordCollection<OUT>;
}

export default props;

import { map } from './map.js';
import type { Options, PropsMapCollection, PropsRecordCollection } from './types.js';

export async function props<IN, OUT>(
  obj: PropsMapCollection<IN>,
  fn?: Iterator<IN, OUT, PropsMapCollection<IN>>,
  options?: Options,
): Promise<PropsMapCollection<OUT>>;

export async function props<IN, OUT>(
  obj: PropsRecordCollection<IN>,
  fn?: Iterator<IN, OUT, PropsRecordCollection<IN>>,
  options?: Options,
): Promise<PropsRecordCollection<OUT>> {
  const isMap = obj instanceof Map;
  if (!Array.isArray(obj) && !isMap && typeof obj !== 'object') {
    throw new TypeError(`input must be object, array or map, but got ${typeof obj}`);
  }

  const keys = isMap ? Array.from(obj.keys()) : Object.keys(obj);
  const rawValues = isMap ? Array.from(obj.values()) : Object.values(obj);

  // NOTE: тут TS прав
  // @ts-ignore
  const values = await map<IN, OUT>(rawValues, fn, options);
  const results = isMap ? new Map<string, OUT>() : ({} as Record<string, OUT>);
  keys.forEach((key, index) => {
    if (results instanceof Map) {
      results.set(key, values[index]);
    } else {
      results[key] = values[index];
    }
  });
  // NOTE: тут вообще хз как поступать при перегрузке
  // @ts-ignore
  return results;
}

export default props;

import { map } from './map.js';
import type { Iterator, MapCollection, PromiseOrValue } from './types.js';

export function mapSeries<IN, OUT>(
  arr: MapCollection<PromiseOrValue<IN>>,
  fn?: Iterator<IN, OUT, MapCollection<PromiseOrValue<IN>>>,
): Promise<MapCollection<OUT>> {
  return map<IN, OUT>(arr, fn, { concurrency: 1 });
}

export default mapSeries;

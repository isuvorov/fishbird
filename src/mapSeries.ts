import { map } from './map.js';

export function mapSeries<IN, OUT = Awaited<IN>>(
  arr: IN[],
  fn?: (item: Awaited<IN>, index?: number, array?: IN[]) => OUT,
): Promise<Awaited<OUT>[]> {
  return map<IN, OUT>(arr, fn, { concurrency: 1 });
}

export default mapSeries;

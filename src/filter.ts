import { map } from './map.js';

export async function filter<IN>(
  arr: IN[],
  filterFn: (item: Awaited<IN>) => boolean | Promise<boolean> = Boolean,
): Promise<Awaited<IN>[]> {
  const arr2 = await map(arr, async (i) => ({
    i,
    f: await filterFn(i),
  }));
  return arr2.filter((i) => i.f).map((i) => i.i);
}

export default filter;

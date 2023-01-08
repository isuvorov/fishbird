/* eslint-disable no-console */
import { delay } from 'fishblue';
import { map } from 'fishblue/map';
import { mapSeries } from 'fishblue/mapSeries';

async function main() {
  const input = [1, 2, 3];
  console.log('start', input);
  const temp = await map([1, 2, 3], (a) => a * 2);
  await delay(100);
  const result = await mapSeries(temp, (a) => a * 3);
  console.log('end', result);
}
main();

#!/usr/bin/env node
import { rename } from 'fs/promises';
import { glob } from 'glob';
import { join } from 'path';
import { createCommand } from 'ycmd';

export default createCommand({
  command: 'rename:dts', //  [-e]
  describe: 'rename d.mts to dts',

  // meta: import.meta,
  async main({ cwd, log }) {
    // await shell(`mv lib/**/*.d.mts lib/**/*.d.ts`, { cwd });
    const files = await glob(join(cwd, 'lib/**/*.d.mts'));
    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      const newFile = file.replace('.d.mts', '.d.ts');
      // eslint-disable-next-line no-await-in-loop
      await rename(file, newFile);
      log.trace(`${file} => ${newFile}`);
    }
  },
});

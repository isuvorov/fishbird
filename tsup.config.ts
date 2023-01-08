import type { Options } from 'tsup';

const env = process.env.NODE_ENV;

export const tsup: Options = {
  splitting: true,
  clean: true,
  dts: true,
  sourcemap: true,
  format: ['esm', 'cjs'], // generate cjs and esm files
  minify: env === 'production',
  bundle: env === 'production',
  skipNodeModulesBundle: true,
  entryPoints: ['src/index.ts'],
  watch: env === 'development',
  target: 'es2020',
  outDir: 'lib',
  entry: ['src/**/*.ts'], // include all files under src
};

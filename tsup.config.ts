import type { Options } from 'tsup';
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'tsup';

export const bannerCJS: Options['banner'] = {};

export const bannerESM: Options['banner'] = {
  /**
   * @link https://stackoverflow.com/questions/31931614/require-is-not-defined-node-js
   */
  // js: `
  //  import { createRequire } from 'module';
  //  const require = createRequire(import.meta.url);
  // `,
};

const env = process.env.NODE_ENV;

export const options: Options = {
  entry: ['src/**/*.tsx?'], // include all files under src
  treeshake: true,
  sourcemap: true,
  clean: true,
  platform: 'node',
  shims: true,
  outDir: 'lib',
  minify: env === 'production',
  // ignoreWatch: ['**/.turbo', '**/dist', '**/node_modules', '**/.DS_STORE', '**/.git'],

  // TODO: прочитать про эти опции
  //   splitting: true,
  //   bundle: env === 'production',
  //   skipNodeModulesBundle: true,
  //   metafile: env === 'development',
  //   // entryPoints: ['src/index.ts'],
  //   watch: env === 'development',
  //   target: 'esnext',
};

export const optionsESM: Options = {
  ...options,
  format: 'esm',
  dts: true,
  splitting: false,
  banner: bannerESM,
  outExtension: () => ({ js: '.js' }),
  outDir: 'lib',
};

export const optionsCJS: Options = {
  ...options,
  format: 'cjs',
  dts: {
    compilerOptions: {
      target: 'ES5',
      module: 'commonjs',
      moduleResolution: 'node',
    },
  },
  banner: bannerCJS,
  // esbuildOptions: (options) => {
  //   options.footer = {
  //     // This will ensure we can continue writing this plugin
  //     // as a modern ECMA module, while still publishing this as a CommonJS
  //     // library with a default export, as that's how ESLint expects plugins to look.
  //     // @see https://github.com/evanw/esbuild/issues/1182#issuecomment-1011414271
  //     js: 'module.exports = module.exports.default;',
  //   }
  // },
  outExtension: () => ({ js: '.js' }),
  outDir: 'cjs',
};

/// NOTE: ////////////////////////////////

export default defineConfig([optionsCJS, optionsESM]);

// import type { Options } from 'tsup';

// const env = process.env.NODE_ENV;

// export const tsup: Options = {
//   splitting: true,
//   clean: true,
//   dts: true,
//   sourcemap: true,
//   format: ['cjs', 'esm'], // 'iife',
//   outExtension: ({ format }) => ({ js: format === 'esm' ? '.mjs' : '.js' }),
//   minify: env === 'production',
//   bundle: env === 'production',
//   skipNodeModulesBundle: true,
//   metafile: env === 'development',
//   // entryPoints: ['src/index.ts'],
//   watch: env === 'development',
//   target: 'esnext',
//   outDir: 'lib',
//   platform: 'node',
//   entry: ['src/**/*.ts'], // include all files under src
// };

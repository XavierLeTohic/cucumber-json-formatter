import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      index: ['./src/**'],
    },
  },
  lib: [
    {
      bundle: false,
      dts: true,
      format: 'cjs',
    },
  ],
  output: {
    target: 'node',
    copy: [
      {
        from: './images/',
        to: './images/',
      },
    ]
  },
});

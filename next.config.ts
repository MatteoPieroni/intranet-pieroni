import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      '*': [
        {
          condition: {
            all: [
              'foreign',
              'browser',
              {
                path: /(@react-stately|@react-aria|@react-spectrum|react-aria-components)\/.*\/[a-z]{2}-[A-Z]{2}/,
              },
            ],
          },
          loaders: ['null-loader'],
          options: {},
          as: '*.js',
        },
      ],
    },
  },
  experimental: {
    authInterrupts: true,
  },
  cacheComponents: true,
};

export default nextConfig;

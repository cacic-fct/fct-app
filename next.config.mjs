import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: `/:path*`,
      },
      {
        source: '/',
        destination: '/calendar',
      },
      {
        source: '/docs',
        destination: 'https://docs.fctapp.ejcomp.com.br/docs',
      },
      {
        source: '/docs/:path*',
        destination: 'https://docs.fctapp.ejcomp.com.br/docs/:path*',
      },
    ];
  },
  env: {
    baseUrl: 'https://fctapp.yudi.me',
    docsUrl: 'https://docs.fctapp.yudi.me',
    plausibleUrl: 'https://plausible.fctapp.yudi.me',
  },
  output: 'standalone',
};

const withMDX = createMDX({});

export default withMDX(nextConfig);

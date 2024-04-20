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
    ];
  },
  env: {
    baseUrl: 'https://fctapp.yudi.me',
    docsUrl: 'https://docs.fctapp.yudi.me',
    plausibleUrl: 'https://plausible.fctapp.yudi.me',
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);

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
};

const withMDX = createMDX({});

export default withMDX(nextConfig);

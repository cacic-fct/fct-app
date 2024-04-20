import createMDX from '@next/mdx'

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
};


const withMDX = createMDX({})
 
export default withMDX(nextConfig)

import createMDX from '@next/mdx'

const { DOCS_URL } = process.env;

/** @type {import('next').NextConfig} */
const nextConfig = {
   pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
   async rewrites() {
    return [
      {
        source: "/:path*",
        destination: `/:path*`,
      },
      {
        source: "/docs",
        destination: `${DOCS_URL}/docs`,
      },
      {
        source: "/docs/:path*",
        destination: `${DOCS_URL}/docs/:path*`,
      },
    ];
  },
};


const withMDX = createMDX({})
 
export default withMDX(nextConfig)

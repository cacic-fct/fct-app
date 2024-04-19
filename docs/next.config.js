const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

const nextConfig = {
  basePath: '/docs',
}

module.exports = withNextra(nextConfig)

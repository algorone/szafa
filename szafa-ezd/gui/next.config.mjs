import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

// 1. Inicjalizacja wtyczki MDX
const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})

// 2. Sprawdzenie środowiska na poziomie Node.js
const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  basePath: '/ezd',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  crossOrigin: "use-credentials",
  
  async rewrites() {
    if (!isDev) {
      return [];
    }
    return [
      {
        source: '/api/indeksy/:path*',
        destination: 'http://host.docker.internal:3003/ezd/api/indeksy/:path*',
      },
      {
        source: '/api/dokumenty/:path*',
        destination: 'http://host.docker.internal:3002/ezd/api/dokumenty/:path*',
      },
            {
        source: '/api/preview/:path*',
        destination: 'http://host.docker.internal:3002/ezd/api/preview/:path*',
      },
    ];
  },
};
export default withMDX(nextConfig);



          
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.js', 'src/**/*.jsx'],
    }),
  ],
  server: {
    proxy: {
      '/api/uniswap/v1': {
        target: 'https://trading-api-labs.interface.gateway.uniswap.org',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/uniswap/, ''),
        headers: {
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'origin': 'https://app.uniswap.org',
          'referer': 'https://app.uniswap.org/',
          'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
          'x-api-key': 'JoyCGj29tT4pymvhaGciK4r1aIPvqW6W53xT1fwo',
          'x-app-version': '',
          'x-request-source': 'uniswap-web',
          'x-uniquote-enabled': 'false',
          'x-universal-router-version': '2.0',
          'x-viem-provider-enabled': 'false'
        }
      },
      '/api/uniswap/v2': {
        target: 'https://interface.gateway.uniswap.org',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/uniswap/, ''),
        headers: {
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'origin': 'https://app.uniswap.org',
          'referer': 'https://app.uniswap.org/',
          'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
          'x-api-key': 'JoyCGj29tT4pymvhaGciK4r1aIPvqW6W53xT1fwo',
          'x-app-version': '',
          'x-request-source': 'uniswap-web'
        }
      },
      '/api/base-rpc': {
        target: 'https://base-pokt.nodies.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/base-rpc/, ''),
        headers: {
          'Origin': 'https://base.org',
          'Referer': 'https://base.org/',
        }
      }
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UniswapWidget',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'next',
        '@wagmi/core',
        'wagmi',
        'viem',
        '@uniswap/sdk-core'
      ],
      output: {
        preserveModules: false,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsx',
          next: 'Next',
          '@wagmi/core': 'wagmiCore',
          'wagmi': 'wagmi',
          'viem': 'viem',
          '@uniswap/sdk-core': 'uniswapSdkCore'
        }
      }
    },
    sourcemap: true,
    minify: 'terser'
  }
})

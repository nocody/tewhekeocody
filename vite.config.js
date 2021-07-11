import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
//https://github.com/rollup/plugins/tree/master/packages/babel
import { babel } from '@rollup/plugin-babel';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()]
})



// const config = {
//   input: 'src/App.jsx',
//   output: {
//     dir: 'output',
//     format: 'esm'
//   },
//   plugins: [reactRefresh(), babel({ babelHelpers: 'bundled' })]
// };

// export default config;
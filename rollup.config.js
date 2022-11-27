import { swc } from 'rollup-plugin-swc3'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import nodeEsm from '@trigen/browserslist-config/node-esm'
import shebang from 'rollup-plugin-add-shebang'
import pkg from './package.json' assert { type: 'json' }

const extensions = ['.js', '.ts']
const external = _ => /node_modules/.test(_) && !/@swc\/helpers/.test(_)
const plugins = targets => [
  nodeResolve({
    extensions
  }),
  swc({
    tsconfig: false,
    jsc: {
      parser: {
        syntax: 'typescript'
      },
      externalHelpers: true
    },
    env: {
      targets
    },
    module: {
      type: 'es6'
    },
    sourceMaps: true
  })
]

export default [
  {
    input: pkg.exports,
    plugins: plugins(nodeEsm.join(', ')),
    external,
    output: {
      file: pkg.publishConfig.exports.import,
      format: 'es',
      sourcemap: true
    }
  },
  {
    input: 'src/cli.ts',
    plugins: [...plugins(nodeEsm.join(', ')), shebang()],
    external: _ => !_.endsWith('src/cli.ts'),
    output: {
      file: 'dist/cli.js',
      format: 'es',
      sourcemap: true
    }
  }
]

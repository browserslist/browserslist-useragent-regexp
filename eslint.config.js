import { globalIgnores } from 'eslint/config'
import baseConfig from '@trigen/eslint-config'
import moduleConfig from '@trigen/eslint-config/module'
import tsConfig from '@trigen/eslint-config/typescript'
// import tsTypeCheckedConfig from '@trigen/eslint-config/typescript-type-checked'
import testConfig from '@trigen/eslint-config/test'
import env from '@trigen/eslint-config/env'

export default [
  globalIgnores(['**/dist/', '**/package/']),
  ...baseConfig,
  ...moduleConfig,
  ...tsConfig,
  // ...tsTypeCheckedConfig,
  ...testConfig,
  env.node,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
      '@stylistic/array-element-newline': 'off'
    }
  }
]

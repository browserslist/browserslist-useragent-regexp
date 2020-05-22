import {
	external
} from '@trigen/scripts-plugin-rollup/helpers';
import tslint from 'rollup-plugin-tslint';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import shebang from 'rollup-plugin-add-shebang';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import pkg from './package.json';

const plugins = [
	tslint({
		exclude:    ['**/*.json', 'node_modules/**'],
		throwError: true
	}),
	commonjs(),
	typescript(),
	babel({
		extensions: [
			...DEFAULT_EXTENSIONS,
			'ts',
			'tsx'
		],
		babelHelpers:       'runtime',
		skipPreflightCheck: true
	})
];

export default [{
	input:    'src/index.ts',
	plugins,
	external: external(pkg, true),
	output:   {
		file:      pkg.main,
		format:    'cjs',
		exports:   'named',
		sourcemap: 'inline'
	}
}, {
	input:    'src/cli.ts',
	plugins:  [
		...plugins,
		shebang()
	],
	external: _ => !_.endsWith('src/cli.ts'),
	output:   {
		file:      'lib/cli.js',
		format:    'cjs',
		exports:   'named',
		sourcemap: 'inline'
	}
}];

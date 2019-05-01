import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import tslint from 'rollup-plugin-tslint';
import shebang from 'rollup-plugin-shebang';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import pkg from './package.json';

const plugins = [
	tslint({
		exclude:    ['**/*.json', 'node_modules/**'],
		throwError: process.env.ROLLUP_WATCH != 'true'
	}),
	commonjs(),
	typescript(),
	babel({
		extensions: [
			...DEFAULT_EXTENSIONS,
			'ts',
			'tsx'
		],
		runtimeHelpers: true
	})
];
const dependencies = [].concat(
	Object.keys(pkg.dependencies)
);

function external(id) {
	return dependencies.some(_ =>
		_ == id || id.indexOf(`${_}/`) == 0
	);
}

export default [{
	input:   'src/index.ts',
	plugins,
	external,
	output:  {
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
	external: () => true,
	output:   {
		file:      'lib/cli.js',
		format:    'cjs',
		exports:   'named',
		sourcemap: 'inline'
	}
}];

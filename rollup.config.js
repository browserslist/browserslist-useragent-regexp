import swc from 'rollup-plugin-swc';
import {
	nodeResolve
} from '@rollup/plugin-node-resolve';
import nodeEsm from '@trigen/browserslist-config/node-esm';
import shebang from 'rollup-plugin-add-shebang';
import pkg from './package.json';

const extensions = ['.js', '.ts'];
const external = _ => /node_modules/.test(_) && !/@swc\/helpers/.test(_);
const plugins = targets => [
	nodeResolve({
		extensions
	}),
	swc({
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
];

export default [{
	input: 'src/index.ts',
	plugins: plugins(nodeEsm.join(', ')),
	external,
	output: {
		file: pkg.main,
		format: 'cjs',
		exports: 'named',
		sourcemap: true
	}
}, {
	input: 'src/cli.ts',
	plugins: [
		...plugins(nodeEsm.join(', ')),
		shebang()
	],
	external: _ => !_.endsWith('src/cli.ts'),
	output: {
		file: 'lib/cli.js',
		format: 'cjs',
		exports: 'named',
		sourcemap: true
	}
}];

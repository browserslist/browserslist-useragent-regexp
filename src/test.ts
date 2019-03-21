import {
	getUserAgentRegExp
} from './';

console.log(
	getUserAgentRegExp({
		browsers: [
			'last 2 Chrome versions'
			// 'not dead'
		],
		// ignorePatch: false,
		allowZeroSubverions: true,
		allowHigherVersions: true,
		path:                process.cwd()
	})
);

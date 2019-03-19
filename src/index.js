const { findBrowsersRegExps } = require('./useragent');
const {
	getBrowsersList,
	applyVersionsToRegExps
} = require('./browserslist');
const {
	mergeBrowsersList,
	browsersVersionsToRanges
} = require('./optimize');

function createRegExp({
	browsers,
	env,
	path,
	...options
} = {
	ignoreMinor: false,
	ignorePatch: true,
	allowHigherVersions: false
}) {

	const browsersList = getBrowsersList({
		browsers,
		env,
		path
	});
	const mergedBrowsers = mergeBrowsersList(browsersList);
	// console.log(mergedBrowsers);
	const sourceRegExps = findBrowsersRegExps(mergedBrowsers, options);
	const rangedBrowsers = browsersVersionsToRanges(mergedBrowsers);
	const regExps = applyVersionsToRegExps(sourceRegExps, rangedBrowsers, options);
	console.log(rangedBrowsers);
	console.log(regExps);
}

createRegExp({
	browsers: [
		'last 2 versions',
		'Firefox ESR',
		// 'not dead'
	],
	ignorePatch: false,
	allowHigherVersions: !true,
	path:                process.cwd()
});

// 'Mozilla/5.0 (Windows NT 10.0; rv:54.0) Gecko/20100101 Firefox/54.0'

// console.log(BROWSERS_REGEXPS);


// const numbers = numbersToRanges([1, 2, 3, 4, 5, 7, 8, 10, 20, 30, 31, 32, 33]);

// console.log(numbers);

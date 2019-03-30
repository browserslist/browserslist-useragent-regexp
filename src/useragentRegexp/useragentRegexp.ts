import {
	IUserAgentRegExpOptions
} from './types';
import {
	getRegExpsForBrowsers
} from '../useragent';
import {
	getBrowsersList,
	mergeBrowserVersions,
	browserVersionsToRanges
} from '../browsers';
import {
	applyVersionsToRegExps,
	joinVersionedBrowsersRegExps
} from '../regexp';

export const defaultOptions = {
	ignoreMinor: false,
	ignorePatch: true,
	allowZeroSubverions: false,
	allowHigherVersions: false
};

/**
 * Compile browserslist query to RegExps.
 * @param  options - Browserslist and semver compare options.
 * @return Objects with info about compiled RegExps.
 */
export function getUserAgentRegExps({
	browsers,
	env,
	path,
	...otherOptions
}: IUserAgentRegExpOptions) {

	const options = {
		...defaultOptions,
		...otherOptions
	};
	const browsersList = getBrowsersList({
		browsers,
		env,
		path
	});
	const mergedBrowsers = mergeBrowserVersions(browsersList);
	const rangedBrowsers = browserVersionsToRanges(mergedBrowsers);
	const sourceRegExps = getRegExpsForBrowsers(mergedBrowsers, options);
	const regExps = applyVersionsToRegExps(sourceRegExps, rangedBrowsers, options);

	return regExps;
}

/**
 * Compile browserslist query to RegExp.
 * @param  options - Browserslist and semver compare options.
 * @return Compiled RegExp.
 */
export function getUserAgentRegExp(options: IUserAgentRegExpOptions) {

	const regExps = getUserAgentRegExps(options);
	const regExpStr = joinVersionedBrowsersRegExps(regExps);
	const regExp = new RegExp(regExpStr);

	return regExp;
}

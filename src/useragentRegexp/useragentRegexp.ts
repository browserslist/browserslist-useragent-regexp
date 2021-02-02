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
import {
	IUserAgentRegExpOptions
} from './types';
import {
	patchRegExps
} from './workarounds';
import {
	optimizeAll
} from './optimize';

export const defaultOptions = {
	ignoreMinor: false,
	ignorePatch: true,
	allowZeroSubversions: false,
	allowHigherVersions: false
};

/**
 * Compile browserslist query to RegExps.
 * @param options - Browserslist and semver compare options.
 * @returns Objects with info about compiled RegExps.
 */
export function getUserAgentRegExps(options: IUserAgentRegExpOptions = {}) {
	const {
		browsers,
		env,
		path,
		...otherOptions
	} = options;
	const finalOptions = {
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
	const sourceRegExps = getRegExpsForBrowsers(mergedBrowsers, finalOptions);
	const versionedRegExps = applyVersionsToRegExps(sourceRegExps, rangedBrowsers, finalOptions);
	const patchedRegExps = patchRegExps(versionedRegExps, mergedBrowsers);
	const optimizedRegExps = optimizeAll(patchedRegExps);

	return optimizedRegExps;
}

/**
 * Compile browserslist query to RegExp.
 * @param options - Browserslist and semver compare options.
 * @returns Compiled RegExp.
 */
export function getUserAgentRegExp(options: IUserAgentRegExpOptions = {}) {
	const regExps = getUserAgentRegExps(options);
	const regExpStr = joinVersionedBrowsersRegExps(regExps);
	const regExp = new RegExp(regExpStr);

	return regExp;
}

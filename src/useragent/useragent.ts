import regexps from 'useragent/lib/regexps';
import {
	IFixedFamily,
	IBrowserRegExpSource,
	IBrowserRegExp,
	IBrowserVersionRegExp,
	BrowserRegExpSourceProp
} from './types';
import {
	ISemverCompareOptions,
	semverify
} from '../semver';
import {
	IBrowsers
} from '../browsers';
import {
	regExpToString
} from '../regexp/util';
import {
	uniq,
	someSemverMatched,
	hasVersion,
	familyMatched
} from './util';
import {
	getMinMaxVersions
} from './versions';

export const BROWSERS_REGEXPS: IBrowserRegExp[] = [
	...extractIOSRegExp(regexps.os),
	...fixBrowsersRegExps(regexps.browser)
];

/**
 * Get user agent RegExps for given browsers.
 * @param  browsers - Browsers.
 * @param  options - Semver compare options.
 * @return User agent RegExps.
 */
export function getRegExpsForBrowsers(browsers: IBrowsers, options: ISemverCompareOptions) {

	const regExps: IBrowserVersionRegExp[] = [];

	BROWSERS_REGEXPS.forEach(({
		family,
		regExp,
		fixedVersion,
		minVersion,
		maxVersion
	}) => {

		const browserVersions = browsers.get(family);

		if (browserVersions
			&& someSemverMatched(minVersion, maxVersion, browserVersions, options)
			&& hasVersion(fixedVersion, regExp)
		) {
			regExps.push({
				family,
				regExp,
				requestVersions:    browserVersions,
				resultFixedVersion: fixedVersion,
				resultMinVersion:   minVersion,
				resultMaxVersion:   maxVersion
			});
		}
	});

	return regExps;
}

/**
 * Fix browser family.
 * @param family - Browser family.
 * @param regExp - User agent RegExp to find browser family as fallback.
 */
export function fixBrowserFamily(family: string, regExp: RegExp): IFixedFamily[] {

	const familyOrRegExp = family || regExp;
	const regExpString = regExpToString(regExp);

	switch (true) {

		/**
		 * iOS browsers: CriOS|OPiOS|FxiOS etc
		 */
		case /[^\w]?([A-Z]\w+iOS)[^\w]?/.test(regExpString):
		/**
		 * YaBrowser, Mail.ru Amigo, new Opera works with regular Chrome RegExp
		 */
		case /YaBrowser|MRCHROME|Chrome.*\(OPR\)/.test(regExpString):
		/**
		 * Chrome Mobile browser and WebView works with regular Chrome RegExp (except CrMo)
		 */
		case /\(Chrome\).* Mobile|Mobile \.\*\(Chrome\)|; wv\\\)\.\+\(Chrome\)/.test(regExpString):
		/**
		 * Firefox Mobile works with regular Firefox RegExp
		 */
		case /\(\?:Mobile\|Tablet\);\.\*\(Firefox\)/.test(regExpString):
		/**
		 * Very old Opera
		 */
		case /Opera.*\) \(\\d/.test(regExpString):
		/**
		 * Strange RegExps
		 */
		case /bingbot|^\\b\(/.test(regExpString):
			return [];

		case familyMatched(false, familyOrRegExp, [
			'Chrome Mobile', // CrMo
			'Chromium',
			'HeadlessChrome'
		]):
			return [{ family: 'chrome' }];

		case familyMatched(true, familyOrRegExp, ['Samsung Internet']):
			return [{ family: 'samsung' }];

		case familyMatched(true, familyOrRegExp, [
			'Firefox Mobile',
			'Firefox ($1)'
		]):
			return [{ family: 'firefox' }];

		case familyMatched(true, familyOrRegExp, ['IE']):
			return [{ family: 'explorer' }];

		case familyMatched(true, familyOrRegExp, ['IE Mobile']):
			return [{ family: 'explorermobile' }];

		case familyMatched(true, familyOrRegExp, ['BlackBerry WebKit']):
			return [{ family: 'blackberry' }];

		case familyMatched(true, familyOrRegExp, ['Opera Mobile']):
			return [{ family: 'operamobile' }];

		case familyOrRegExp === regExp: {

			const matches = regExpString.match(/\(([\s\w\d_\-/!|]+)\)/i);

			if (Array.isArray(matches)) {

				const match = matches[1];
				const familiesFromRegExp = match.split('|');
				const families = uniq([
					...familiesFromRegExp,
					...familiesFromRegExp.map(_ => _.replace(/ /g, '')),
					...familiesFromRegExp.map(_ => _.replace(/[_\-/\s]/g, ''))
				]);

				return families.map(family => ({
					family: family.toLowerCase(),
					regExp: new RegExp(regExpString.replace(match, family))
				}));
			}

			return [];
		}

		case typeof family === 'string':
			return [{ family: family.toLowerCase() }];

		default:
	}

	return [];
}

/**
 * Fix browser RegExp object.
 * @param  browserRegExpSource - Source browser RegExp object.
 * @return Fixed object.
 */
export function fixBrowserRegExp(browserRegExpSource: IBrowserRegExpSource) {

	const {
		[BrowserRegExpSourceProp.RegExp]: regExp,
		[BrowserRegExpSourceProp.Family]: family,
		[BrowserRegExpSourceProp.Major]: major,
		[BrowserRegExpSourceProp.Minor]: minor,
		[BrowserRegExpSourceProp.Patch]: patch
	} = browserRegExpSource;
	const families = fixBrowserFamily(
		family,
		regExp
	);
	const fixedVersion = major === 0
		? null
		: semverify([major, minor, patch]);
	let minVersion = fixedVersion;
	let maxVersion = fixedVersion;

	return families.map<IBrowserRegExp>(({
		regExp: patchedRegExp = regExp,
		...family
	}) => {

		if (!fixedVersion) {
			[minVersion, maxVersion] = getMinMaxVersions(patchedRegExp);
		}

		return {
			regExp: patchedRegExp,
			fixedVersion,
			minVersion,
			maxVersion,
			...family
		};
	});
}

/**
 * Fix browser RegExp objects.
 * @param  browserRegExpSources - Source browser RegExp objects.
 * @return Fixed objects.
 */
export function fixBrowsersRegExps(browsersRegExpSoruces: IBrowserRegExpSource[]) {

	const length = browsersRegExpSoruces.length;
	const regExps: IBrowserRegExp[] = [];

	for (let i = 0; i < length; i++) {
		regExps.push(
			...fixBrowserRegExp(browsersRegExpSoruces[i])
		);
	}

	return regExps;
}

/**
 * Extract and Fix iOS RegExp objects.
 * @param  osRegExpSources - Source OS RegExp objects.
 * @return Fixed objects.
 */
export function extractIOSRegExp(osRegExpSources: IBrowserRegExpSource[]) {

	const length = osRegExpSources.length;
	const regExps: IBrowserRegExp[] = [];

	for (let i = 0; i < length; i++) {

		if (osRegExpSources[i][BrowserRegExpSourceProp.Family] !== 'iOS') {
			continue;
		}

		regExps.push(
			...fixBrowserRegExp(osRegExpSources[i])
		);
	}

	return regExps;
}

import regexps from 'useragent/lib/regexps';
import {
	IBrowserRegExpSource,
	IBrowserRegExp,
	IBrowserVersionRegExp,
	BrowserRegExpSourceProp
} from './types';
import {
	uniq,
	someSemverMatched,
	hasVersion,
	familyMatched
} from './util';
import {
	ISemverCompareOptions,
	semverify
} from '../semver';
import {
	IBrowsers
} from '../browsers';

export const BROWSERS_REGEXPS: IBrowserRegExp[] = [
	...extractIOSRegExp(regexps.os),
	...fixBrowsersRegExps(regexps.browser)
];

export function getRegExpsForBrowsers(browsers: IBrowsers, options: ISemverCompareOptions) {

	const regExps: IBrowserVersionRegExp[] = [];

	BROWSERS_REGEXPS.forEach(({
		family,
		regExp,
		version
	}) => {

		const browserVersions = browsers.get(family);

		// todo: blacklist
		if (browserVersions
			&& someSemverMatched(version, browserVersions, options)
			&& hasVersion(version, regExp)
		) {
			regExps.push({
				family,
				regExp,
				requestVersions: browserVersions,
				resultVersion:   version
			});
		}
	});

	return regExps;
}

export function fixBrowserFamily(family: string, regExp: RegExp) {

	const familyOrRegExp = family || regExp;
	const regExpString = regExp.toString();

	switch (true) {

		case /[^\w]?([A-Z]\w+iOS|YaBrowser)[^\w]?/.test(regExpString): // CriOS|OPiOS|FxiOS
			return [];

		case familyMatched(false, familyOrRegExp, [
			'Chrome Mobile',
			'Chromium',
			'HeadlessChrome'
		]):
			return ['chrome'];

		case familyMatched(true, familyOrRegExp, ['Samsung Internet']):
			return ['samsung'];

		case familyMatched(true, familyOrRegExp, [
			'Firefox Mobile',
			'Firefox ($1)'
		]):
			return ['firefox'];

		case familyMatched(true, familyOrRegExp, ['IE']):
			return ['explorer'];

		case familyMatched(true, familyOrRegExp, ['IE Mobile']):
			return ['explorermobile'];

		case familyOrRegExp === regExp: {

			const matches = regExpString.match(/\(([\s\w\d_\-/|]+)\)/i);

			if (Array.isArray(matches)) {

				const families = matches[1].toLowerCase().split('|');

				return uniq([
					...families,
					...families.map(_ => _.replace(/ /g, '')),
					...families.map(_ => _.replace(/[_\-/\s]/g, ''))
				]);
			}

			return [];
		}

		case typeof family === 'string':
			return [family.toLowerCase()];

		default:
	}

	return [];
}

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
	const version = major === 0
		? null
		: semverify([major, minor, patch]);

	return families.map<IBrowserRegExp>((family: string) => ({
		regExp,
		family,
		version
	}));
}

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

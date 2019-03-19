const regexps = require('useragent/lib/regexps');
const { hasNumberPattern } = require('./regexp');
const {
	semverify,
	compareSemvers
} = require('./semver');

const BROWSERS_REGEXPS = [
	...extractIOSRegExp(regexps.os),
	...patchBrowsersRegExps(regexps.browser)
];

function compareSomeSemvers(version, bases, options) {
	return !version || bases.some(
		_ => compareSemvers(version, _, options)
	);
}

function hasVersion(version, regExp) {
	return version || hasNumberPattern(regExp);
}

function findBrowsersRegExps(browsers, options) {

	const regExps = [];

	BROWSERS_REGEXPS.forEach(({
		family,
		regExp,
		version
	}) => {

		const browserVersions = browsers.get(family);

		// todo: blacklist
		if (browserVersions
			&& compareSomeSemvers(version, browserVersions, options)
			&& hasVersion(version, regExp)
		) {
			regExps.push({
				family,
				regExp,
				requestVersions: browserVersions,
				resultVersion:  version
			});
		}
	});

	return regExps;
}

exports.findBrowsersRegExps = findBrowsersRegExps;

function familyIsMatched(exact, family, searchFamilies) {
	
	const isRegExp = family instanceof RegExp;
	let matcher = null;

	switch (true) {

		case isRegExp: {

			const regExpString = family.toString();

			matcher = _ => new RegExp(`(^|[^\\w])${_.replace(/ /g, '\\s*')}([^\\w]|$)`).test(regExpString);
			break;
		}

		case exact:
			matcher = _ => _ === family;
			break;
		
		default:
			matcher = _ => family.includes(_);
			break
	}

	return searchFamilies.some(matcher);
}

function transformBrowserFamily(family, regExp) {

	const familyOrRegExp = family || regExp;
	const regExpString = regExp.toString();

	switch (true) {

		case /[^\w]?([A-Z]\w+iOS|YaBrowser)[^\w]?/.test(regExpString): // CriOS|OPiOS|FxiOS
			return [];

		case familyIsMatched(false, familyOrRegExp, [
				'Chrome Mobile',
				'Chromium',
				'HeadlessChrome'
			]):
			return ['chrome'];
	
		case familyIsMatched(true, familyOrRegExp, ['Samsung Internet']):
			return ['samsung'];
	
		case familyIsMatched(true, familyOrRegExp, [
				'Firefox Mobile',
				'Firefox ($1)'
			]):
			return ['firefox'];
		
		case familyIsMatched(true, familyOrRegExp, ['IE']):
			return ['explorer'];
		
		case familyIsMatched(true, familyOrRegExp, ['IE Mobile']):
			return ['explorermobile'];

		case familyOrRegExp === regExp: {

			const matches = regExpString.match(/\(([\s\w\d_\-/|]+)\)/i);

			if (Array.isArray(matches)) {
				
				const families = matches[1].toLowerCase().split('|');

				return Array.from(
					new Set([
						...families,
						...families.map(_ => _.replace(/ /g, '')),
						...families.map(_ => _.replace(/[_\-/\s]/g, ''))
					])
				);
			}

			return [];
		}
		
		case typeof family === 'string':
			return [family.toLowerCase()];
	}

	return [];
}

function patchBrowserRegExp(browserRegExp) {
	
	const regExp = browserRegExp[0];
	const family = browserRegExp[1];
	const major = browserRegExp[2];
	const minor = browserRegExp[3];
	const patch = browserRegExp[4];
	const families = transformBrowserFamily(
		family,
		regExp
	);
	const version = major === 0
		? null
		: semverify([major, minor, patch]);

	return families.map((family) => ({
		regExp,
        family,
        version
	}));
}

function patchBrowsersRegExps(browsersRegExps) {

	const length = browsersRegExps.length;
	const patched = [];

	for (let i = 0; i < length; i++) {
		patched.push(
			...patchBrowserRegExp(browsersRegExps[i])
		);
	}

	return patched;
}

function extractIOSRegExp(osRegExp) {

	const length = osRegExp.length;
	const iOS = [];

	for (let i = 0; i < length; i++) {

		if (osRegExp[i][1] !== 'iOS') {
			continue;
		}

		iOS.push(
			...patchBrowserRegExp(osRegExp[i])
		);
	}

	return iOS;
}

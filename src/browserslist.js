const browserslist = require('browserslist');
const {
	semverify,
	rangedSemverToRegExpParts,
	getRequiredPartsCount
} = require('./semver');
const {
	join,
	findVersionSlug,
	getNumberPatternsCount,
	replaceNumbers,
	regExpToString
} = require('./regexp');

const BROWSERS_SHIRTNAMES = {
	bb:             'BlackBerry',
	and_chr:        'Chrome',
	ChromeAndroid:  'Chrome',
	FirefoxAndroid: 'Firefox',
	ff:             'Firefox',
	ie:             'Explorer',
	ie_mob:         'ExplorerMobile',
	and_ff:         'Firefox',
	ios_saf:        'iOS',
	op_mini:        'OperaMini',
	op_mob:         'OperaMobile',
	and_qq:         'QQAndroid',
	and_uc:         'UCAndroid'
};
const BROWSERS_SHIRTNAMES_REGEXP = new RegExp(`(${Object.keys(BROWSERS_SHIRTNAMES).join('|')})`);

function normalizeQuery(query) {

	const matches = query.match(BROWSERS_SHIRTNAMES_REGEXP)

	if (Array.isArray(matches)) {

		const [shirtName] = matches;

		return query.replace(shirtName, BROWSERS_SHIRTNAMES[shirtName]);
	}

	return query;
}

function parseBrowsersList(browsersList) {
	return [].concat(
        ...browsersList.map((browser) => {

            const [
                name,
                ...versions
            ] = browser.split(/ |-/);
            const family = (BROWSERS_SHIRTNAMES[name] || name).toLowerCase();

            return versions.map(version => ({
                family,
                version: semverify(version)
            }));
        })
    );
}

function applyVersionsToRegExp(regExp, versions, options) {

	let regExpStr = regExpToString(regExp);
	let maxRequiredPartsCount = 1;
	const numberPatternsCount = getNumberPatternsCount(regExpStr);
	const suitableVersions = versions.map((version) => {

		const requiredPartsCount = getRequiredPartsCount(version, options);

		maxRequiredPartsCount = Math.max(maxRequiredPartsCount, requiredPartsCount);

		return numberPatternsCount >= requiredPartsCount
			? version
			: null;
	}).filter(Boolean);

	if (!suitableVersions.length) {
		return null;
	}

	const slug = findVersionSlug(regExpStr, maxRequiredPartsCount);
	// todo: optimize with refactor: ((60|61)) and etc
	const versionsRegExp = join(suitableVersions.map(version => replaceNumbers(
		slug,
		rangedSemverToRegExpParts(version, options),
		true
	)));
	const regExpWithVersions = new RegExp(
		regExpStr.replace(slug, versionsRegExp)
	);
	// console.log(suitableVersions.map(version => replaceNumbers(
	// 	slug,
	// 	rangedSemverToRegExpParts(version, options),
	// 	true
	// )));
	console.log(regExp, suitableVersions);

	return regExpWithVersions;
}

function applyVersionsToRegExps(regExps, browsers, options) {
	return regExps
		.map(({
			family,
			regExp,
			resultVersion,
			...meta
		}) => ({
			family,
			sourceRegExp: regExp,
			regExp:      resultVersion
				? regExp
				: applyVersionsToRegExp(
					regExp,
					browsers.get(family),
					options
				),
			resultVersion,
			...meta
		}))
		.filter(_ => _.regExp);
}

exports.applyVersionsToRegExps = applyVersionsToRegExps;

function getBrowsersList({
	browsers: queries,
    env,
    path
} = {}) {

	const normalizedQuery = Array.isArray(queries)
		? queries.map(normalizeQuery)
		: '';
	const browsers = browserslist(normalizedQuery, {
		env,
		path
	});
	console.log(browsers);
    const parsedBrowsers = parseBrowsersList(browsers);
    
    return parsedBrowsers;
}

exports.getBrowsersList = getBrowsersList;

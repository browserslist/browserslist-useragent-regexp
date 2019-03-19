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

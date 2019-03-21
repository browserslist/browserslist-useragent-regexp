import {
	IRangedSemver,
	ISemverCompareOptions,
	rangedSemverToRegExp,
	getRequiredSemverPartsCount
} from '../semver';
import {
	IRangedBrowsers
} from '../browsers';
import {
	IBrowserVersionRegExp,
	IBrowserVersionedRegExp
} from '../useragent';
import {
	joinParts,
	getNumberPatternsCount,
	replaceNumberPatterns,
	regExpToString
} from './util';
import {
	getNumberPatternsPart
} from './numbersPart';

export function applyVersionsToRegExp(
	regExp: string|RegExp,
	versions: IRangedSemver[],
	options: ISemverCompareOptions
) {

	let maxRequiredPartsCount = 1;
	const regExpStr = typeof regExp === 'string'
		? regExp
		: regExpToString(regExp);
	const numberPatternsCount = getNumberPatternsCount(regExpStr);
	const suitableVersions = versions.map((version) => {

		const requiredPartsCount = getRequiredSemverPartsCount(version, options);

		maxRequiredPartsCount = Math.max(maxRequiredPartsCount, requiredPartsCount);

		return numberPatternsCount >= requiredPartsCount
			? version
			: null;
	}).filter(Boolean);

	if (!suitableVersions.length) {
		return null;
	}

	const numberPatternsPart = getNumberPatternsPart(regExpStr, maxRequiredPartsCount);
	const versionsRegExpPart = joinParts(
		suitableVersions.map(version =>
			replaceNumberPatterns(
				numberPatternsPart,
				rangedSemverToRegExp(version, options),
				maxRequiredPartsCount
			)
		)
	);
	const regExpWithVersions = regExpStr.replace(numberPatternsPart, versionsRegExpPart);

	return regExpWithVersions;
}

export function applyVersionsToRegExps(
	browserVersionRegExps: IBrowserVersionRegExp[],
	browsers: IRangedBrowsers,
	options: ISemverCompareOptions
): IBrowserVersionedRegExp[] {

	const versionedRegExps = [];

	browserVersionRegExps.forEach(({
		family,
		regExp: sourceRegExp,
		resultVersion,
		requestVersions
	}) => {

		const sourceRegExpString = regExpToString(sourceRegExp);
		let regExp = null;
		let regExpString = '';

		if (resultVersion) {
			regExp = sourceRegExp;
			regExpString = sourceRegExpString;
		} else {
			regExpString = applyVersionsToRegExp(
				sourceRegExpString,
				browsers.get(family),
				options
			);
			regExp = new RegExp(regExpString);
		}

		if (regExp) {
			versionedRegExps.push({
				family,
				sourceRegExp,
				sourceRegExpString,
				regExp,
				regExpString,
				resultVersion,
				requestVersions,
				requestVersionsStrings: requestVersions.map(_ => _.join('.'))
			});
		}
	});

	return versionedRegExps;
}

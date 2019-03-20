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
	IBrowserVersionRegExp
} from '../useragent';
import {
	join,
	getNumberPatternsCount,
	replaceNumberPatterns,
	regExpToString
} from './util';
import {
	getNumberPatternsPart
} from './numbersPart';

export function applyVersionsToRegExp(regExp: RegExp, versions: IRangedSemver[], options: ISemverCompareOptions) {

	let maxRequiredPartsCount = 1;
	const regExpStr = regExpToString(regExp);
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
	// todo: optimize with refactor: ((60|61)) and etc
	const versionsRegExpPart = join(
		suitableVersions.map(version =>
			replaceNumberPatterns(
				numberPatternsPart,
				rangedSemverToRegExp(version, options)
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
) {
	return browserVersionRegExps
		.map(({
			family,
			regExp,
			resultVersion,
			...meta
		}) => ({
			family,
			sourceRegExp: regExp,
			regExp:       resultVersion
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

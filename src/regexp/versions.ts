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
	IBrowserVersionedRegExp,
	uniq
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

/**
 * Apply ranged sevmers to the RegExp.
 * @param  regExp - Target RegExp.
 * @param  versions - Ranged semvers.
 * @param  options - Semver compare options.
 * @return RegExp with given versions.
 */
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
		uniq(
			[].concat(
				...suitableVersions.map(version =>
					rangedSemverToRegExp(version, options).map(parts =>
						replaceNumberPatterns(
							numberPatternsPart,
							parts,
							maxRequiredPartsCount
						)
					)
				)
			)
		)
	);
	const regExpWithVersions = regExpStr.replace(numberPatternsPart, versionsRegExpPart);

	return regExpWithVersions;
}

/**
 * Apply browser versions to info objects.
 * @param  browserVersionRegExps - Objects with requested browser version and RegExp.
 * @param  browsers - Ranged versions of browsers.
 * @param  options - Semver compare options.
 * @return Objects with requested browser version and RegExp special for this version.
 */
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

		if (regExpString && regExp) {
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

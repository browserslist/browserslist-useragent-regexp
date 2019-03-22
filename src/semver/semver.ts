import {
	ISemverLike,
	ISemver,
	IRangedSemver,
	ISemverCompareOptions
} from './types';
import {
	NUMBER_PATTERN
} from '../regexp/util';
import {
	rangeToRegExp
} from '../regexp/numberRange';
import {
	isAllVersion
} from './util';

/**
 * Get semver from string or array.
 * @param  version - Target to convert.
 * @return Array with semver parts.
 */
export function semverify(version: ISemverLike): ISemver {

	const split = Array.isArray(version)
		? version
		: version.toString().split('.');

	if (isAllVersion(split[0])) {
		return [split[0] as any, 0, 0];
	}

	while (split.length < 3) {
		split.push('0');
	}

	return split.map((_) => {

		const num = typeof _ === 'number'
			? _
			: parseInt(_, 10);

		return isNaN(num) ? 0 : num; // risky
	}) as ISemver;
}

/**
 * Compare semvers.
 * @param  a - Semver to compare.
 * @param  b - Semver to compare with.
 * @param  options - Compare options.
 * @return Equals or not.
 */
export function compareSemvers(
	[
		major,
		minor,
		patch
	]: ISemver,
	[
		majorBase,
		minorBase,
		patchBase
	]: ISemver,
	{
		ignoreMinor,
		ignorePatch,
		allowHigherVersions
	}: ISemverCompareOptions
) {

	if (isAllVersion(majorBase)) {
		return true;
	}

	const compareMinor = !ignoreMinor;
	// const comparePatch = ignoreMinor ? false : !ignorePatch;
	const comparePatch = compareMinor && !ignorePatch;

	if (allowHigherVersions) {

		if (
			comparePatch && patch < patchBase
			|| compareMinor && minor < minorBase
		) {
			return false;
		}

		return major >= majorBase;
	}

	if (
		comparePatch && patch !== patchBase
		|| compareMinor && minor !== minorBase
	) {
		return false;
	}

	return major === majorBase;
}

/**
 * Get required semver parts count.
 * @param  version - Semver parts or ranges.
 * @param  options - Semver compare options.
 * @return Required semver parts count.
 */
export function getRequiredSemverPartsCount(version: ISemver|IRangedSemver, {
	ignoreMinor,
	ignorePatch,
	allowZeroSubverions
}: ISemverCompareOptions) {

	let shouldRepeatCount = ignoreMinor
		? 1
		: ignorePatch
			? 2
			: 3;

	if (allowZeroSubverions) {

		for (let i = shouldRepeatCount - 1; i > 0; i--) {

			if (version[i] !== 0 || shouldRepeatCount === 1) {
				break;
			}

			shouldRepeatCount--;
		}
	}

	return shouldRepeatCount;
}

/**
 * Ranged semver to regexp patterns.
 * @param  rangedVersion - Ranged semver.
 * @param  options - Semver compare options.
 * @return Array of regexp pattern strings.
 */
export function rangedSemverToRegExp(rangedVersion: IRangedSemver, {
	ignoreMinor,
	ignorePatch,
	allowHigherVersions
}: ISemverCompareOptions) {

	const ignoreIndex = isAllVersion(rangedVersion[0])
		? 0
		: ignoreMinor
			? 1
			: ignorePatch
				? 2
				: Infinity;
	const numberPatterns: string[] = rangedVersion.map((range, i) => {

		if (i >= ignoreIndex) {
			return NUMBER_PATTERN;
		}

		const isRange = Array.isArray(range);

		if (!isRange && !allowHigherVersions) {
			return range.toString();
		}

		if (isRange) {
			return rangeToRegExp(
				range[0],
				allowHigherVersions
					? Infinity
					: range[1]
			);
		}

		return rangeToRegExp(range as number);
	});

	return numberPatterns;
}

import {
	ISemverLike,
	ISemver,
	ISemverCompareOptions
} from './types';
// import { rangeToRegExp } from './regexp';

export function isAllVersion(version: any): version is 'all' {
	return version === 'all';
}

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

	if (allowHigherVersions) {

		if (
			!ignorePatch && patch < patchBase
			|| !ignoreMinor && minor < minorBase
		) {
			return false;
		}

		return major >= majorBase;
	}

	if (
		!ignorePatch && patch !== patchBase
		|| !ignoreMinor && minor !== minorBase
	) {
		return false;
	}

	return major === majorBase;
}

// function rangedSemverToRegExpParts(rangedVersion, {
// 	ignoreMinor,
// 	ignorePatch,
// 	allowHigherVersions
// }) {

// 	const ignoreIndex = isAllVersion(rangedVersion[0])
// 		? 0
// 		: ignoreMinor
// 			? 1
// 			: ignorePatch
// 				? 2
// 				: Infinity;

// 	return rangedVersion.map((range, i) =>
// 		i >= ignoreIndex
// 			? '\\d+'
// 			: Array.isArray(range)
// 				? rangeToRegExp(range[0], allowHigherVersions ? Infinity : range[1])
// 				: range.toString()
// 	);
// }

// exports.rangedSemverToRegExpParts = rangedSemverToRegExpParts;

export function getRequiredSemverPartsCount(version: ISemver, {
	ignoreMinor,
	ignorePatch
}: ISemverCompareOptions) {

	let shouldRepeatCount = ignoreMinor
		? 1
		: ignorePatch
			? 2
			: 3;

	for (let i = 2; i > 0; i--) {

		if (version[i] !== 0 || shouldRepeatCount === 1) {
			break;
		}

		shouldRepeatCount--;
	}

	return shouldRepeatCount;
}

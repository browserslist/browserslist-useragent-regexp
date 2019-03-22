import {
	ISemver,
	IRangedSemver,
	ISemverRange,
	SemverPart
} from '../semver';
import {
	IBrowser,
	IBrowsers,
	IRangedBrowsers
} from './types';
import {
	compareArrays,
	numbersToRanges
} from './util';

/**
 * Merge browser info object to map with versions.
 * @param  browsers - Browser info object to merge.
 * @return Merged browsers map.
 */
export function mergeBrowserVersions(browsers: IBrowser[]) {

	const merge: IBrowsers = new Map();

	browsers.forEach(({
		family,
		version
	}) => {

		const versions = merge.get(family);

		if (versions) {

			const strVersion = version.join('.');

			if (versions.every(_ => _.join('.') !== strVersion)) {
				versions.push(version);
			}

			return;
		}

		merge.set(family, [version]);
	});

	merge.forEach((versions) => {

		versions.sort((a, b) => {

			for (const i in a) {

				if (a[i] !== b[i]) {
					return (a[i] as number) - (b[i] as number);
				}
			}

			return 0;
		});
	});

	return merge;
}

/**
 * Versions to ranged versions.
 * @param  versions - Semver versions list.
 * @return Ranged versions list.
 */
export function versionsListToRanges(versions: ISemver[]) {

	if (versions.length < 2) {
		return versions;
	}

	const max = versions.length + 1;
	const ranges: IRangedSemver[] = [];
	let prev: number[] = null;
	let current: number[] = versions[0];
	let major: ISemverRange = [current[SemverPart.Major]];
	let minor: ISemverRange = [current[SemverPart.Minor]];
	let patch: ISemverRange = [current[SemverPart.Patch]];
	let part: SemverPart = SemverPart.Patch;

	for (let i = 1; i < max; i++) {

		prev = versions[i - 1];
		current = versions[i] || [];

		for (let p = SemverPart.Major; p <= SemverPart.Patch; p++) {

			if (prev[p] + 1 === current[p]
				&& compareArrays(prev, current, p + 1)
			) {

				part = p;

				if (part === SemverPart.Major) {
					(major as number[]).push(current[SemverPart.Major]);
				} else {
					major = current[SemverPart.Major];
				}

				if (part === SemverPart.Minor) {
					(minor as number[]).push(current[SemverPart.Minor]);
				} else {
					minor = current[SemverPart.Minor];
				}

				if (part === SemverPart.Patch) {
					(patch as number[]).push(current[SemverPart.Patch]);
				} else {
					patch = current[SemverPart.Patch];
				}

				break;
			}

			if (part === p) {
				part = SemverPart.Patch;
				ranges.push([
					numbersToRanges(major),
					numbersToRanges(minor),
					numbersToRanges(patch)
				]);
				major = [current[SemverPart.Major]];
				minor = [current[SemverPart.Minor]];
				patch = [current[SemverPart.Patch]];
				break;
			}
		}
	}

	return ranges;
}

/**
 * Browser versions to ranged versions.
 * @param  browsers - Browser map with versions.
 * @return Browser map with ranged versions.
 */
export function browserVersionsToRanges(browsers: IBrowsers) {

	const ranged: IRangedBrowsers = new Map();

	browsers.forEach((versions, family) => {
		ranged.set(family, versionsListToRanges(versions));
	});

	return ranged;
}

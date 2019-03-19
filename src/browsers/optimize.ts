import {
	ISemver,
	IRangedSemver,
	ISemverRange,
	SemverParts
} from '../semver';
import {
	IBrowser,
	IBrowsers,
	IRangedBrowsers
} from './types';

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

export function compareArrays(a: any[], b: any[], from: number) {

	const len = a.length;

	for (let i = from; i < len; i++) {

		if (a[i] !== b[i]) {
			return false;
		}
	}

	return true;
}

export function numbersToRanges(numbers: number|number[]) {

	if (typeof numbers === 'number') {
		return numbers;
	}

	if (numbers.length === 1) {
		return numbers[0];
	}

	return [
		numbers[0],
		numbers[numbers.length - 1]
	];
}

export function versionsListToRanges(versions: ISemver[]) {

	const max = versions.length + 1;
	const ranges: IRangedSemver[] = [];
	let prev: number[] = null;
	let current: number[] = versions[0];
	let major: ISemverRange = [current[SemverParts.Major]];
	let minor: ISemverRange = [current[SemverParts.Minor]];
	let patch: ISemverRange = [current[SemverParts.Patch]];

	for (let i = 1; i < max; i++) {

		prev = versions[i - 1];
		current = versions[i] || [];

		// todo oprimize to loop?
		if (prev[SemverParts.Major] + 1 === current[SemverParts.Major]
			&& compareArrays(prev, current, SemverParts.Minor)
		) {

			(major as number[]).push(current[SemverParts.Major]);

			minor = current[SemverParts.Minor];
			patch = current[SemverParts.Patch];

			continue;
		}

		if (prev[SemverParts.Minor] + 1 === current[SemverParts.Minor]
			&& compareArrays(prev, current, SemverParts.Patch)
		) {

			major = current[SemverParts.Major];
			(minor as number[]).push(current[SemverParts.Minor]);
			patch = current[SemverParts.Patch];

			continue;
		}

		if (prev[SemverParts.Patch] + 1 === current[SemverParts.Patch]) {

			major = current[SemverParts.Major];
			minor = current[SemverParts.Minor];
			(patch as number[]).push(current[SemverParts.Patch]);

			continue;
		}

		ranges.push([
			numbersToRanges(major),
			numbersToRanges(minor),
			numbersToRanges(patch)
		]);
		major = [current[SemverParts.Major]];
		minor = [current[SemverParts.Minor]];
		patch = [current[SemverParts.Patch]];
	}

	return ranges;
}

export function browserVersionsToRanges(browsers: IBrowsers) {

	const ranged: IRangedBrowsers = new Map();

	browsers.forEach((versions, family) => {
		ranged.set(family, versionsListToRanges(versions));
	});

	return ranged;
}

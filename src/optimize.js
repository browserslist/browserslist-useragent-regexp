
function numbersToRanges(numbers) {

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

function mergeBrowsersList(browsersVersions) {

	const merge = new Map();

	browsersVersions.forEach(({
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

			for (let i in a) {

				if (a[i] !== b[i]) {
					return a[i] - b[i];
				}
			}

			return 0;
		});
	});

	return merge;
}

exports.mergeBrowsersList = mergeBrowsersList;

function compareArrays(a, b, from) {

	const len = a.length;

	for (let i = from; i < len; i++) {

		if (a[i] !== b[i]) {
			return false;
		}
	}

	return true;
}

function versionsListToRanges(versions) {

	const max = versions.length + 1;
	const ranges = [];
	let prev = null;
	let current = versions[0];
	let major = [current[0]];
	let minor = [current[1]];
	let patch = [current[2]];

	for (let i = 1; i < max; i++) {

		prev = versions[i - 1];
		current = versions[i] || [];

		// todo oprimize to loop?
		if (prev[0] + 1 === current[0]
			&& compareArrays(prev, current, 1)
		) {

			major.push(current[0]);
			
			minor = current[1];
			patch = current[2];

			continue;
		}

		if (prev[1] + 1 === current[1]
			&& compareArrays(prev, current, 2)
		) {
			
			major = current[0];
			minor.push(current[1]);
			patch = current[2];

			continue;
		}

		if (prev[2] + 1 === current[2]) {
			
			major = current[0];
			minor = current[1];
			patch.push(current[2]);

			continue;
		}

		ranges.push([
			numbersToRanges(major),
			numbersToRanges(minor),
			numbersToRanges(patch)
		]);
		major = [current[0]];
		minor = [current[1]];
		patch = [current[2]];
	}

	return ranges;
}

function browsersVersionsToRanges(browsers) {

	const ranged = new Map();

	browsers.forEach((versions, family) => {
		ranged.set(family, versionsListToRanges(versions));
	});

	return ranged;
}

exports.browsersVersionsToRanges = browsersVersionsToRanges;

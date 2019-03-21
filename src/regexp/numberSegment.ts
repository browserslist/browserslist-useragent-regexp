import {
	DIGIT_PATTERN,
	numberToDigits,
	joinParts
} from './util';

export function segmentRangeNumberPattern(from: number, to: number, zeros?: number) {

	if (to < from) {
		return '';
	}

	const zerosPrefix = typeof zeros === 'number' && zeros > 0
		? '0'.repeat(zeros)
		: '';

	if (from === to) {
		return `${zerosPrefix}${from}`;
	}

	if (from === 0 && to === 9) {
		return `${zerosPrefix}\\d`;
	}

	return `${zerosPrefix}[${from}-${to}]`;
}

export function splitToDecadeRanges(from: number, to: number) {

	const ranges: [number, number][] = [];
	let num = from;
	let decade = 1;

	do {

		decade *= 10;

		if (num < decade) {
			ranges.push([
				num,
				Math.min(decade - 1, to)
			]);
			num = decade;
		}

	} while (decade <= to);

	return ranges;
}

export function splitCommonDiff(a: number[], b: number[]): [string, number, number] {

	const len = a.length;

	if (len !== b.length || a[0] !== b[0]) {
		return null;
	}

	let common = a[0].toString();
	let currA = 0;
	let currB = 0;
	let diffA = '';
	let diffB = '';

	for (let i = 1; i < len; i++) {

		currA = a[i];
		currB = b[i];

		if (currA === currB) {
			common += currA;
		} else {
			diffA += currA;
			diffB += currB;
		}
	}

	return [
		common,
		parseInt(diffA, 10),
		parseInt(diffB, 10)
	];
}

export function enumOrRange(from: number, to: number, rangeNumberPatterns: string[]) {

	const rangePartsCount = rangeNumberPatterns.length;
	const nums: string[] = [];
	let rangeIndex = 0;
	let rangeSymbolsCount = 0;
	let enumSymbolsCount = 0;

	for (let num = from; num <= to; num++) {

		nums.push(num.toString());
		enumSymbolsCount += Math.floor(Math.log10(num) + 1) + 1;

		while (enumSymbolsCount > rangeSymbolsCount) {

			if (rangeIndex >= rangePartsCount) {
				return rangeNumberPatterns;
			}

			rangeSymbolsCount += rangeNumberPatterns[rangeIndex++].length + 1;
		}
	}

	return nums;
}

export function segmentToNumberPatterns(from: number, to: number, digitsInNumber = 0) {

	const fromDigits = numberToDigits(from);
	const digitsCount = fromDigits.length;

	if (from < 10 && to < 10 || from === to) {

		const zeros = digitsInNumber - digitsCount;

		return [
			segmentRangeNumberPattern(from, to, zeros)
		];
	}

	const toDigits = numberToDigits(to);

	if (digitsCount !== toDigits.length) {

		const decadeRanges = splitToDecadeRanges(from, to);
		const parts = [].concat(
			...decadeRanges.map(([from, to]) =>
				segmentToNumberPatterns(from, to, digitsInNumber)
			)
		);

		return parts;
	}

	const commonStart = splitCommonDiff(fromDigits, toDigits);

	if (Array.isArray(commonStart)) {

		const [
			common,
			from,
			to
		] = commonStart;
		const digitsInNumber = digitsCount - common.length;
		const diffParts = segmentToNumberPatterns(from, to, digitsInNumber);

		return [`${common}${joinParts(diffParts)}`];
	}

	const range = Array.from({
		length: digitsCount - 1
	});
	const parts = [
		...range.map((_, i) => {

			const ri = digitsCount - i - 1;
			const d = Number(i > 0);

			return fromDigits.map((digit, j) => (
				j < ri
					? digit
					: segmentRangeNumberPattern(
						j > ri
							? 0
							: digit + d,
						9
					)
			)).join('');
		}),
		...range.map((_, i) => {

			const ri = digitsCount - i - 1;
			const d = Number(i > 0);

			return toDigits.map((digit, j) => (
				j < ri
					? digit
					: segmentRangeNumberPattern(
						0,
						j > ri
							? 9
							: digit - d
					)
			)).join('');
		})
	];
	const middleSegment = segmentRangeNumberPattern(
		fromDigits[0] + 1,
		toDigits[0] - 1
	);

	if (middleSegment) {
		parts.push(`${middleSegment}${DIGIT_PATTERN.repeat(digitsCount - 1)}`);
	}

	return parts;
}

export function segmentToNumberPatternsOrEnum(from: number, to: number) {
	return enumOrRange(from, to, segmentToNumberPatterns(from, to));
}

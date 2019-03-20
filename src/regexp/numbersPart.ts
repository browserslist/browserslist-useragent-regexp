import {
	BRACED_NUMBER_PATTERN,
	ESCAPE_SYMBOL,
	regExpToString
} from './util';

function skipSquareBraces(skip: boolean, prevChar: string, char: string) {

	if (char === '['
		&& prevChar !== ESCAPE_SYMBOL
	) {
		return true;
	}

	if (char === ']'
		&& prevChar !== ESCAPE_SYMBOL
	) {
		return false;
	}

	return skip;
}

function capturePostfix(regExpStr: string, startFrom: number) {

	let char = regExpStr[startFrom];

	switch (char) {

		case '+':
		case '*':
		case '?':
			return char;

		case '(': {

			const nextChar = regExpStr[startFrom + 1];
			const afterNextChar = regExpStr[startFrom + 2];

			if (
				nextChar !== '?'
				|| afterNextChar !== '=' && afterNextChar !== '!'
			) {
				return '';
			}

			break;
		}

		case '{':
			break;

		default:
			return '';
	}

	const regExpStrLength = regExpStr.length;
	let prevChar = '';
	let braceBalance = 0;
	let skip = false;
	let postfix = '';

	for (let i = startFrom; i < regExpStrLength; i++) {

		char = regExpStr[i];
		prevChar = regExpStr[i - 1];
		skip = skipSquareBraces(skip, prevChar, char);

		if (!skip
			&& prevChar !== ESCAPE_SYMBOL
			&& (
				char === '('
				|| char === '{'
			)
		) {
			braceBalance++;
		}

		if (braceBalance > 0) {
			postfix += char;
		}

		if (!skip
			&& prevChar !== ESCAPE_SYMBOL
			&& braceBalance > 0
			&& (
				char === ')'
				|| char === '}'
			)
		) {
			braceBalance--;

			if (braceBalance === 0) {
				break;
			}
		}
	}

	return postfix;
}

export function getNumberPatternsPart(regExp: string|RegExp, numberPatternsCount?: number) {

	const regExpStr = typeof regExp === 'string'
		? regExp
		: regExpToString(regExp);
	const regExpStrLength = regExpStr.length;
	const maxNumbersCount = typeof numberPatternsCount === 'number'
		? numberPatternsCount
		: regExpStr.split(BRACED_NUMBER_PATTERN).length - 1;
	let braceBalance = 0;
	let skip = false;
	let numberCounter = 0;
	let char = '';
	let prevChar = '';
	let numberAccum = '';
	let numberPatternsPart = '';

	for (let i = 0; i < regExpStrLength; i++) {

		char = regExpStr[i];
		prevChar = regExpStr[i - 1];
		skip = skipSquareBraces(skip, prevChar, char);

		if (!skip
			&& prevChar !== ESCAPE_SYMBOL
			&& char === '('
		) {
			braceBalance++;
			numberAccum = '';
		}

		if (braceBalance > 0 || numberCounter > 0) {
			numberPatternsPart += char;
			numberAccum += char;
		}

		if (!skip
			&& prevChar !== ESCAPE_SYMBOL
			&& char === ')'
			&& braceBalance > 0
		) {
			braceBalance--;

			if (numberAccum === BRACED_NUMBER_PATTERN) {
				numberCounter++;
			}

			if (braceBalance === 0
				&& numberCounter === 0
			) {
				numberPatternsPart = '';
			}

			if (braceBalance === 0
				&& numberCounter >= maxNumbersCount
			) {
				numberPatternsPart += capturePostfix(regExpStr, ++i);
				break;
			}
		}
	}

	return numberPatternsPart;
}

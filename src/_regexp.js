

function rayRangePart(number, includes) {

    const rangeStart = number + Number(!includes);

    if (rangeStart === 0) {
        return '\\d';
    }

    if (rangeStart === 9) {
        return '9';
    }

    return `[${rangeStart}-9]`;
}

function segmentRangePart(from, to, zeros) {

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

function optimizeRayPartsParts(parts) {

    const filterDigitsSymbol = _ => _ === '\\d';
    let prev = [];
    let digitsSymbolsCount = 0;
    let prevDigitsSymbolsCount = 0;

    return parts.filter((parts, i) => {

        if (i > 0) {

            digitsSymbolsCount = parts.filter(filterDigitsSymbol).length;
            prevDigitsSymbolsCount = prev.filter(filterDigitsSymbol).length;

            if (digitsSymbolsCount <= prevDigitsSymbolsCount) {
                return false;
            }
        }

        prev = parts;

        return true;
    })
}

/*
1(1-2)|
11 12 11|12|
*/

function enumOrRange(from, to, rangeParts) {

    const rangePartsCount = rangeParts.length;
    let rangeIndex = 0;
    let rangeSymbolsCount = 0;
    let enumSymbolsCount = 0;
    let numbers = [];

    for (let num = from; num <= to; num++) {

        numbers.push(num);
        enumSymbolsCount += Math.floor(Math.log10(num) + 1) + 1;

        while (enumSymbolsCount > rangeSymbolsCount) {

            if (rangeIndex >= rangePartsCount) {
                return rangeParts;
            }

            rangeSymbolsCount += rangeParts[rangeIndex++].length + 1;
        }
    }

    return numbers;
}

// console.log(enumOrRange(69, 71, ['69', '7[0-1]']))

function splitToDecadeRanges(from, to) {

    const ranges = [];
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

    } while (decade <= to)

    return ranges;
}

function extractCommonStart(a, b) {

    const len = a.length;

    if (len !== b.length || a[0] !== b[0]) {
        return null;
    }

    let common = a[0].toString();
    let cA = '';
    let cB = '';
    let diffA = [];
    let diffB = [];

    for (let i = 1; i < len; i++) {

        cA = a[i];
        cB = b[i];

        if (cA == cB) {
            common += cA;
        } else {
            diffA += cA;
            diffB += cB;
        }
    }

    return [
        common,
        parseInt(diffA),
        parseInt(diffB)
    ];
}

function rayToRegExpParts(from) {

    const fromDigits = numberToDigits(from);
    const fromDigitsCount = fromDigits.length;
    const partsParts = optimizeRayPartsParts(
        fromDigits.map((_, i) => {

            const ri = fromDigitsCount - i - 1;
            const d = Number(i > 0);

            return fromDigits.map((digit, j) => (
                j < ri
                    ? digit
                    : j > ri
                        ? '\\d'
                        : rayRangePart(digit, j + d <= ri)
            ));
        })
    );
    const parts = partsParts.map(_ => _.join(''));

    parts.push(`\\d{${fromDigitsCount + 1},}`);

    return parts;
}

function segmentToRegExpParts(from, to, digitsInNumber = 0) {

    const fromDigits = numberToDigits(from);
    const digitsCount = fromDigits.length;
    const zeros = digitsInNumber - digitsCount;

    if (from < 10 && to < 10 || from === to) {
        return [segmentRangePart(from, to, zeros)];
    }

    const toDigits = numberToDigits(to);

    if (digitsCount !== toDigits.length) {

        const decadeRanges = splitToDecadeRanges(from, to);
        const parts = [].concat(
            ...decadeRanges.map(([from, to]) =>
                segmentToRegExpParts(from, to, digitsInNumber)
            )
        );

        return parts;
    }

    const commonStart = extractCommonStart(fromDigits, toDigits);

    if (Array.isArray(commonStart)) {

        const [
            common,
            from,
            to
        ] = commonStart;
        const digitsInNumber = digitsCount - common.length;
        const diffParts = segmentToRegExpParts(from, to, digitsInNumber);

        return [`${common}${join(diffParts)}`];
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
                    : segmentRangePart(
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
                    : segmentRangePart(
                        0,
                        j > ri
                            ? 9
                            : digit - d
                    )
            )).join('');
        })
    ];
    const middleSegment = segmentRangePart(
        fromDigits[0] + 1,
        toDigits[0] - 1
    );

    if (middleSegment) {
        parts.push(`${middleSegment}${'\\d'.repeat(digitsCount - 1)}`)
    }

    return parts;
}

function rangeToRegExp(from, to = Infinity) {

    if (from === 'all') {
        return '\\d+';
    }

    const parts = to === Infinity
        ? rayToRegExpParts(from)
        : enumOrRange(
            from,
            to,
            segmentToRegExpParts(from, to)
        );
    const regExp = join(parts, true);

    return regExp;
}

exports.rangeToRegExp = rangeToRegExp;

/*
    2 ([2-9]|\d{2,})
    34 ([3-9][4-9]|[4-9]\d|\d{3,})
    123 ([1-9][2-9][3-9]|[1-9][3-9]\d|[2-9]\d\d|\d{4,})
        3               2            1
    223 ([2-9][2-9][3-9]|[2-9][3-9]\d|[3-9]\d\d|\d{4,})
        0 0    1    2   1 0    1*  2 2 0*  1 2
    4567 (
       0 [4-9][5-9][6-9][7-9]|
       1 [4-9][5-9][7-9]\d|
       2 [4-9][6-9]\d\d|
       3 [5-9]\d\d\d|\d{5,})

    2-8 ([2-8])
    8-16 ([8-9]|1[0-6])
    8-25
        8-9 ([8-9])
        10-25 (1[0-9]|2[0-5])
        10-25 (1[0-9]|[2-1]\d|2[0-5])
    8-35
        8-9 ([8-9])
        10-35 (1[0-9]|[2-2]\d|3[0-5])
    8-55
        8-9 ([8-9])
        10-55 (1[0-9]|[2-4]\d|5[0-5])
    45-46 (4[5-9]|[5-3]\d|4[0-6])
    45-63 (4[5-9]|[5]\d||6[0-3])
    49-51 (4[9-9]|[5-4]\d|5[0-1])
    100-220 (
        1[0-9][0-9]|10[0-9]
        [2-1]\d\d|
        2[0-1]\d|22[0-0]
    )
    234 - 678 (
        23[4-9]|2[4-9][0-9]|
        [3-5]\d\d|
        6[0-6]\d|67[0-8]
    )

    4008 4092
    40
        08-92
            8-
*/

/*

([23[4-9]|2[4-9]\d|[3-9]\d\d|\d{4,})

[ [ 2, 3, 4 ], [ 2, 3, '[0-4]' ], [ 2, '[0-2]', '[0-9]' ] ]

[ [ 2, 3, 4 ], [ 2, 3, '[4-9]' ], [ 2, '[4-9]', '[0-9]' ] ]
  0            1                  2
    0  1  2      0  1  2            0  1        2
  3            2                  1
  2            1                  0
    3  2  1      3  2  1            3  2        1
    2  1  0      2  1  0            2  1        0

*/

// console.log(q(234));
// console.log(q(23, 33));

// console.log(rangeToRegExp(9, 11));
// console.log(rangeToRegExp(100));
// console.log(rangeToRegExp(234));
// console.log(rangeToRegExp(223));
// console.log(rangeToRegExp(4567));
// console.log(rangeToRegExp(234));
// console.log(rangeToRegExp(678));
// console.log(extractCommonStart([1], [1]));
// console.log(splitToDecadeRanges(9, 10));



/*

/(CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS)[ +]+(\d+)[_\.](\d+)(?:[_\.](\d+))?/

\d(?=px)
\d(?!px)
+
*
{}
?
*/

// console.log(findVersionSlug(/(CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS)[ +]+(\d+)[_\.](\d+)(?:[_\.](\d+))?/));

function skipSquareBraces(skip, prevChar, char) {

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

function capturePostfix(regExpStr, startFrom) {

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

        if (braceBalance > 0 || numberCounter > 0) {
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

function findVersionSlug(regExp, numbersCount) {

    const regExpStr = regExpToString(regExp);
    const regExpStrLength = regExpStr.length;
    const maxNumbersCount = typeof numbersCount === 'number'
        ? numbersCount
        : regExpStr.split(BRACED_NUMBER_PATTERN).length - 1;
    let braceBalance = 0;
    let skip = false;
    let numberCounter = 0;
    let char = '';
    let prevChar = '';
    let numberAccum = '';
    let versionSlug = '';
    // let from = Infinity;

    for (let i = 0; i < regExpStrLength; i++) {

        char = regExpStr[i];
        prevChar = regExpStr[i - 1];
        skip = skipSquareBraces(skip, prevChar, char);

        if (!skip
            && prevChar !== ESCAPE_SYMBOL
            && char === '('
        ) {

            // if (braceBalance === 0 && i < from) {
            //     from = i;
            // }

            braceBalance++;
            numberAccum = '';
        }

        if (braceBalance > 0 || numberCounter > 0) {
            versionSlug += char;
            numberAccum += char
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
                // console.log(versionSlug);
                versionSlug = '';
                // from = Infinity;
            }

            if (braceBalance === 0
                && numberCounter >= maxNumbersCount
            ) {
                versionSlug += capturePostfix(regExpStr, ++i);
                break;
            }
        }
    }

    return versionSlug;
}

exports.findVersionSlug = findVersionSlug;

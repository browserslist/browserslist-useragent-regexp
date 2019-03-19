const { rangeToRegExp } = require('./regexp');

function isAllVersion(version) {
    return version === 'all';
}

exports.isAllVersion = isAllVersion;

function semverify(version) {

    const split = Array.isArray(version)
        ? version
        : version.toString().split('.');

    if (isAllVersion(split[0])) {
        return [split[0], 0, 0];
    }

	while (split.length < 3) {
		split.push('0');
	}

	return split.map((_) => {
        
        const num = parseInt(_);

        return isNaN(num) ? 0 : num; // risky
    });
}

exports.semverify = semverify;

function compareSemvers([
    major,
    minor,
    patch
], [
    majorBase,
    minorBase,
    patchBase
], {
    ignoreMinor,
    ignorePatch,
    allowHigherVersions
}) {

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

exports.compareSemvers = compareSemvers;

function rangedSemverToRegExpParts(rangedVersion, {
    ignoreMinor,
    ignorePatch,
    allowHigherVersions
}) {

    const ignoreIndex = isAllVersion(rangedVersion[0])
        ? 0
        : ignoreMinor
            ? 1
            : ignorePatch
                ? 2
                : Infinity;

    return rangedVersion.map((range, i) =>
        i >= ignoreIndex
            ? '\\d+'
            : Array.isArray(range)
                ? rangeToRegExp(range[0], allowHigherVersions ? Infinity : range[1])
                : range.toString()
    );
}

exports.rangedSemverToRegExpParts = rangedSemverToRegExpParts;

function getRequiredPartsCount(version, {
    ignoreMinor,
    ignorePatch
}) {

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

exports.getRequiredPartsCount = getRequiredPartsCount;

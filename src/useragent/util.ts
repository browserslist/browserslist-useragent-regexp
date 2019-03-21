import { hasNumberPattern } from '../regexp';
import {
	ISemver,
	ISemverCompareOptions,
	compareSemvers
} from '../semver';

export function uniq<T>(items: T[]): T[] {
	return Array.from(
		new Set(items)
	);
}

export function someSemverMatched(version: ISemver, bases: ISemver[], options: ISemverCompareOptions) {
	return !version || bases.some(
		_ => compareSemvers(version, _, options)
	);
}

export function hasVersion(version: any, regExp: RegExp) {
	return Boolean(
		version || hasNumberPattern(regExp)
	);
}

export function familyMatched(exact: boolean, family: string|RegExp, searchFamilies: string[]) {

	const isRegExp = family instanceof RegExp;
	let matcher = null;

	switch (true) {

		case isRegExp: {

			const regExpString = family.toString();

			matcher = (_: string) =>
				new RegExp(`(^|[^\\w])${_.replace(/ /g, '\\s*')}([^\\w]|$)`)
					.test(regExpString);
			break;
		}

		case exact:
			matcher = (_: string) => _ === family;
			break;

		default:
			matcher = (_: string) => (family as string).includes(_);
	}

	return searchFamilies.some(matcher);
}

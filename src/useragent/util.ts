import { hasNumberPattern } from '../regexp';
import {
	ISemver,
	ISemverCompareOptions,
	compareSemvers
} from '../semver';

/**
 * Remove duplicates from array.
 * @param  items - Items to filter.
 * @return Uniq items.
 */
export function uniq<T>(items: T[]): T[] {
	return items.filter((_, i) => !items.includes(_, i + 1));
}

/**
 * Check version.
 * @param  version - Semver version.
 * @param  bases - Base semver versions.
 * @param  options - Semver compare options.
 * @return Some version is matched.
 */
export function someSemverMatched(version: ISemver, bases: ISemver[], options: ISemverCompareOptions) {
	return !version || bases.some(
		_ => compareSemvers(version, _, options)
	);
}

/**
 * Another version check. ^.^
 * @param  version - Semver version.
 * @param  regExp - Useragent RegExp.
 * @return Has version or not.
 */
export function hasVersion(version: any, regExp: RegExp) {
	return Boolean(
		version || hasNumberPattern(regExp)
	);
}

/**
 * Check browser family.
 * @param  exact - Compare exact or not.
 * @param  family - Browser family.
 * @param  searchFamilies  - Browser family variations.
 * @return Family matched or not.
 */
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

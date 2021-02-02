import browserslist from 'browserslist';
import {
	semverify
} from '../semver';
import {
	IBrowser,
	IBrowsersListRequest
} from './types';
import {
	BROWSERS_SHIRTNAMES
} from './shirtnames';
import {
	normalizeBrowserFamily
} from './util';

/**
 * Browsers strings to info objects.
 * @param browsersList - Browsers strings with family and version.
 * @returns Browser info objects.
 */
export function parseBrowsersList(browsersList: string[]) {
	return ([] as IBrowser[]).concat(
		...browsersList.map((browser) => {
			const [
				name,
				...versions
			] = browser.split(/ |-/);
			const family: string = (BROWSERS_SHIRTNAMES[name] || name).toLowerCase();

			return versions.map<IBrowser>(version => ({
				family,
				version: semverify(version)
			}));
		})
	);
}

/**
 * Request browsers list.
 * @param options - Options to get browsers list.
 * @returns Browser info objects.
 */
export function getBrowsersList(options: IBrowsersListRequest = {}) {
	const {
		browsers,
		env,
		path
	} = options;
	const normalizedBrowsers = Array.isArray(browsers)
		? browsers.map(normalizeBrowserFamily)
		: browsers;
	const browsersList = browserslist(normalizedBrowsers, {
		env,
		path
	});
	const parsedBrowsers = parseBrowsersList(browsersList);

	return parsedBrowsers;
}

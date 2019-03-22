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
 * @param  browsersList - Browsers strings with family and version.
 * @return Browser info objects.
 */
export function parseBrowsersList(browsersList: string[]): IBrowser[] {
	return [].concat(
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
 * @param  options - Options to get browsers list.
 * @return Browser info objects.
 */
export function getBrowsersList({
	browsers,
	env,
	path
}: IBrowsersListRequest = {}) {

	const normalizedBrowsers = Array.isArray(browsers)
		? browsers.map(normalizeBrowserFamily)
		: '';
	const browsersList = browserslist(normalizedBrowsers, {
		env,
		path
	});
	const parsedBrowsers = parseBrowsersList(browsersList);

	return parsedBrowsers;
}

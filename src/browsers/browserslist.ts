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
	return browsersList.reduce<IBrowser[]>((browsers, browser) => {
		const [
			name,
			...versions
		] = browser.split(/ |-/);
		const family = (BROWSERS_SHIRTNAMES[name] || name).toLowerCase();

		return versions.reduce((browsers, version) => {
			const semver = semverify(version);

			if (semver) {
				browsers.push({
					family,
					version: semver
				});
			}

			return browsers;
		}, browsers);
	}, []);
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

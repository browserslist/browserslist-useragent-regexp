import browserslist from 'browserslist';
import { semverify } from '../semver';
import {
	IBrowser,
	IBrowsersListRequest
} from './types';
import {
	BROWSERS_SHIRTNAMES_REGEXP,
	BROWSERS_SHIRTNAMES
} from './shirtnames';

export function normalizeQuery(query: string) {

	const matches = query.match(BROWSERS_SHIRTNAMES_REGEXP);

	if (Array.isArray(matches)) {

		const [shirtname] = matches;

		return query.replace(shirtname, BROWSERS_SHIRTNAMES[shirtname]);
	}

	return query;
}

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

export function getBrowsersList({
	browsers,
	env,
	path
}: IBrowsersListRequest = {}) {

	const normalizedBrowsers = Array.isArray(browsers)
		? browsers.map(normalizeQuery)
		: '';
	const browsersList = browserslist(normalizedBrowsers, {
		env,
		path
	});
	const parsedBrowsers = parseBrowsersList(browsersList);

	return parsedBrowsers;
}

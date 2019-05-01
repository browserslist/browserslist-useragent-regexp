import UserAgent from 'user-agents';
import {
	matchesUA
} from 'browserslist-useragent';
import {
	getBrowsersList
} from '../browsers';
import {
	getUserAgentRegExp,
	getUserAgentRegExps
} from './useragentRegexp';

const browsers = [
	'last 3 Chrome versions',
	'last 3 Firefox versions',
	'last 3 iOS versions',
	'last 3 Samsung versions',
	'Explorer 6-10',
	'defaults'
];

function mobile(userAgent: string, index: number) {
	return index < 15 || /[A-Z]\w+iOS|mobile/i.test(userAgent);
}

function *getUserAgents() {

	const userAgents = new Set();
	let data = null;

	for (const query of browsers) {

		const options = {
			browsers:            [query],
			allowHigherVersions: true
		};
		const versions = getBrowsersList(options);

		for (let i = 0; i < 30; i++) {

			try {
				data = new UserAgent(({ userAgent }) =>
					!userAgents.has(userAgent)
						&& mobile(userAgent, i)
						&& matchesUA(userAgent, options)
				);
			} catch (err) {
				continue;
			}

			userAgents.add(data.userAgent);
			yield {
				versions:  versions.map(_ => `${_.family} ${_.version.join('.')}`),
				userAgent: data.userAgent,
				query
			};
		}
	}
}

describe('UserAgentRegExp', () => {

	jest.setTimeout(5 * 60 * 1000);

	it('should create correct RegExps', () => {

		const userAgents = getUserAgents();

		for (const ua of userAgents) {

			const regExp = getUserAgentRegExp({
				browsers:            ua.query,
				allowHigherVersions: true,
				allowZeroSubverions: true
			});
			const works = regExp.test(ua.userAgent);

			if (!works) {

				if (ua.query === 'Explorer 6-10' && /Trident\/7/.test(ua.userAgent)) {
					console.log(`"${ua.userAgent}" is IE 11, not "${ua.query}"!!!`);
					return;
				}

				const info = getUserAgentRegExps({
					browsers:            ua.query,
					allowHigherVersions: true,
					allowZeroSubverions: true
				});
				const message = `Invalid RegExp:

Query: ${ua.query}
Browsers: ${ua.versions.join(', ')}
UserAgent: ${ua.userAgent}${info.map(_ => `
Source RegExp: ${_.sourceRegExp}
RegExp: ${_.regExp}`).join('')}
`;
				throw new Error(message);
			}
		}
	});
});

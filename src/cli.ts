/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	argv,
	read,
	end,
	options as readOptions
} from 'argue-cli';
import chalk from 'chalk';
import Table from 'easy-table';
import {
	getUserAgentRegExp,
	getBrowsersList,
	mergeBrowserVersions,
	browserVersionsToRanges,
	getRegExpsForBrowsers,
	applyVersionsToRegExps,
	patchRegExps,
	optimizeAll,
	joinVersionedBrowsersRegExps,
	isAllVersion,
	defaultOptions
} from '.';

const {
	help,
	verbose,
	...regExpOptions
}: any = readOptions([
	['help', 'h'],
	['verbose', 'v'],
	'ignorePatch',
	'ignoreMinor',
	'allowHigherVersions',
	'allowZeroSubversions'
], []);

if (help) {
	end();

	const optionsTable = new Table();

	optionsTable.cell('Option', 'query');
	optionsTable.cell(
		'Description',
		'Manually provide a browserslist query.'
		+ ' Specifying this overrides the browserslist configuration specified in your project.'
	);
	optionsTable.newRow();

	optionsTable.cell('Option', '--help, -h');
	optionsTable.cell('Description', 'Print this message.');
	optionsTable.newRow();

	optionsTable.cell('Option', '--verbose, -v');
	optionsTable.cell('Description', 'Print additional info about RegExps.');
	optionsTable.newRow();

	optionsTable.cell('Option', '--ignorePatch');
	optionsTable.cell('Description', 'Ignore differences in patch browser numbers.');
	optionsTable.cell('Default', 'true');
	optionsTable.newRow();

	optionsTable.cell('Option', '--ignoreMinor');
	optionsTable.cell('Description', 'Ignore differences in minor browser versions.');
	optionsTable.cell('Default', 'false');
	optionsTable.newRow();

	optionsTable.cell('Option', '--allowHigherVersions');
	optionsTable.cell(
		'Description',
		'For all the browsers in the browserslist query,'
		+ ' return a match if the user agent version is equal to or higher than the one specified in browserslist.'
	);
	optionsTable.cell('Default', 'false');
	optionsTable.newRow();

	optionsTable.cell('Option', '--allowZeroSubversions');
	optionsTable.cell('Description', 'Ignore match of patch or patch and minor, if they are 0.');
	optionsTable.cell('Default', 'false');
	optionsTable.newRow();

	console.log(`\nbrowserslist-useragent-regexp [query] [...options]\n\n${optionsTable.toString()}`);
	process.exit(0);
}

const query = argv.length
	? read()
	: undefined;
const options = {
	browsers: query,
	...defaultOptions,
	...regExpOptions
};

end();

if (verbose) {
	const browsersList = getBrowsersList(options);
	const mergedBrowsers = mergeBrowserVersions(browsersList);

	console.log(
		chalk.blue('\n> Browserslist\n')
	);

	const browsersTable = new Table();

	mergedBrowsers.forEach((versions, browser) => {
		browsersTable.cell('Browser', chalk.yellow(browser));

		versions.forEach((version, i) => {
			if (isAllVersion(version)) {
				browsersTable.cell(`Version ${i}`, version[0]);
			} else {
				browsersTable.cell(`Version ${i}`, version.join('.'));
			}
		});

		browsersTable.newRow();
	});

	console.log(browsersTable.print());

	const rangedBrowsers = browserVersionsToRanges(mergedBrowsers);
	const sourceRegExps = getRegExpsForBrowsers(mergedBrowsers, options);
	const versionedRegExps = applyVersionsToRegExps(sourceRegExps, rangedBrowsers, options);
	const patchedRegExps = patchRegExps(versionedRegExps, mergedBrowsers);
	const optimizedRegExps = optimizeAll(patchedRegExps);

	console.log(
		chalk.blue('\n> RegExps\n')
	);

	optimizedRegExps.forEach(({
		family,
		requestVersionsStrings,
		sourceRegExp,
		resultFixedVersion,
		resultMinVersion,
		resultMaxVersion,
		regExp
	}) => {
		const regExpsTable = new Table();

		regExpsTable.cell('Name', chalk.yellow('Family:'));
		regExpsTable.cell('Value', family);
		regExpsTable.newRow();

		regExpsTable.cell('Name', chalk.yellow('Versions:'));
		regExpsTable.cell('Value', requestVersionsStrings.join(' '));
		regExpsTable.newRow();

		regExpsTable.cell('Name', chalk.yellow('Source RegExp:'));
		regExpsTable.cell('Value', sourceRegExp);
		regExpsTable.newRow();

		regExpsTable.cell('Name', chalk.yellow('Source RegExp fixed version:'));
		regExpsTable.cell('Value', resultFixedVersion ? resultFixedVersion.join('.') : '...');
		regExpsTable.newRow();

		let regExpBrowsersVersion = '';

		if (resultMinVersion) {
			regExpBrowsersVersion = resultMinVersion.join('.');
		} else {
			regExpBrowsersVersion = '...';
		}

		regExpBrowsersVersion += ' - ';

		if (resultMaxVersion) {
			regExpBrowsersVersion += resultMaxVersion.join('.');
		} else {
			regExpBrowsersVersion += '...';
		}

		regExpsTable.cell('Name', chalk.yellow('Source RegExp browsers versions:'));
		regExpsTable.cell('Value', regExpBrowsersVersion);
		regExpsTable.newRow();

		regExpsTable.cell('Name', chalk.yellow('Versioned RegExp:'));
		regExpsTable.cell('Value', regExp);
		regExpsTable.newRow();

		console.log(`${regExpsTable.print()}\n`);
	});

	const regExpStr = joinVersionedBrowsersRegExps(optimizedRegExps);
	const regExp = new RegExp(regExpStr);

	console.log(regExp);
	process.exit(0);
}

console.log(
	getUserAgentRegExp(options)
);

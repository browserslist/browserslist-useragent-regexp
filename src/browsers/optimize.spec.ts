import {
	IBrowser
} from './types';
import {
	ISemver
} from '../semver';
import {
	mergeBrowserVersions,
	versionsListToRanges,
	browserVersionsToRanges
} from './optimize';

describe('Browsers', () => {
	describe('optimize', () => {
		describe('mergeBrowserVersions', () => {
			it('should merge browsers versions', () => {
				const browsers: IBrowser[] = [
					{
						family: 'firefox',
						version: [10, 0, 0]
					},
					{
						family: 'firefox',
						version: [11, 0, 0]
					},
					{
						family: 'chrome',
						version: [11, 12, 0]
					}
				];
				const mergedBrowsers = mergeBrowserVersions(browsers);

				expect(
					mergedBrowsers.get('firefox').length
				).toBe(
					2
				);

				expect(
					mergedBrowsers.get('chrome').length
				).toBe(
					1
				);
			});
		});

		describe('versionsListToRanges', () => {
			it('should collapse ranges', () => {
				const versions: ISemver[] = [
					[11, 0, 0],
					[12, 0, 0],
					[13, 0, 0],
					[14, 1, 1],
					[15, 1, 0],
					[15, 2, 0],
					[15, 3, 1],
					[15, 3, 2],
					[15, 3, 3]
				];
				const ranges = [
					[[11, 13], 0, 0],
					[14, 1, 1],
					[15, [1, 2], 0],
					[15, 3, [1, 3]]
				];

				expect(
					versionsListToRanges(versions)
				).toEqual(
					ranges
				);

				expect(
					versionsListToRanges([
						[10, 0, 0]
					])
				).toEqual([
					[10, 0, 0]
				]);

				expect(
					versionsListToRanges([
						[10, 0, 0],
						[14, 0, 0]
					])
				).toEqual([
					[10, 0, 0],
					[14, 0, 0]
				]);

				expect(
					versionsListToRanges([
						[10, 0, 0],
						[14, 1, 0]
					])
				).toEqual([
					[10, 0, 0],
					[14, 1, 0]
				]);

				expect(
					versionsListToRanges([
						[4, 0, 0],
						[10, 1, 0],
						[11, 1, 0]
					])
				).toEqual([
					[4, 0, 0],
					[[10, 11], 1, 0]
				]);

				expect(
					versionsListToRanges([
						[10, 1, 0],
						[11, 1, 0],
						[15, 0, 0],
						[20, 0, 1],
						[21, 0, 1]
					])
				).toEqual([
					[[10, 11], 1, 0],
					[15, 0, 0],
					[[20, 21], 0, 1]
				]);

				expect(
					versionsListToRanges([
						[15, 1, 0],
						[15, 2, 1],
						[15, 3, 2]
					])
				).toEqual([
					[15, 1, 0],
					[15, 2, 1],
					[15, 3, 2]
				]);

				expect(
					versionsListToRanges([
						[15, 1, 0],
						[15, 2, 0]
					])
				).toEqual([
					[15, [1, 2], 0]
				]);

				expect(
					versionsListToRanges([
						[4, 0, 0],
						[5, 0, 0],
						[5, 1, 0]
					])
				).toEqual([
					[[4, 5], 0, 0],
					[5, 1, 0]
				]);

				expect(
					versionsListToRanges([
						[4, 1, 0],
						[4, 1, 1],
						[4, 2, 0]
					])
				).toEqual([
					[4, 1, [0, 1]],
					[4, 2, 0]
				]);

				expect(
					versionsListToRanges([
						[4, 1, 0],
						[4, 1, 1],
						[4, 1, 3]
					])
				).toEqual([
					[4, 1, [0, 1]],
					[4, 1, 3]
				]);

				expect(
					versionsListToRanges([
						[4, 1, 0],
						[4, 1, 1],
						[4, 2, 1]
					])
				).toEqual([
					[4, 1, [0, 1]],
					[4, 2, 1]
				]);

				expect(
					versionsListToRanges([
						[4, 1, 0],
						[4, 1, 1],
						[4, 2, 2]
					])
				).toEqual([
					[4, 1, [0, 1]],
					[4, 2, 2]
				]);
			});

			it('should do not touch single versions', () => {
				expect(
					versionsListToRanges([
						[10, 0, 0]
					])
				).toEqual([
					[10, 0, 0]
				]);

				expect(
					versionsListToRanges([
						[10, 0, 0],
						[14, 0, 0]
					])
				).toEqual([
					[10, 0, 0],
					[14, 0, 0]
				]);
			});
		});

		describe('browserVersionsToRanges', () => {
			it('should collapse ranges', () => {
				const browsers = new Map<string, ISemver[]>([
					['chrome', [
						[11, 0, 0],
						[12, 0, 0],
						[13, 0, 0]
					]],
					['firefox', [
						[10, 0, 0]
					]],
					['ios', [
						[11, 1, 0],
						[11, 2, 0],
						[12, 1, 0],
						[12, 2, 0]
					]]
				]);
				const rangedBrowsers = [
					['chrome', [
						[[11, 13], 0, 0]
					]],
					['firefox', [
						[10, 0, 0]
					]],
					['ios', [
						[11, [1, 2], 0],
						[12, [1, 2], 0]
					]]
				];

				expect(
					Array.from(
						browserVersionsToRanges(browsers).entries()
					)
				).toEqual(
					rangedBrowsers
				);
			});
		});
	});
});

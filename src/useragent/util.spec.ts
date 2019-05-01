import {
	ISemver
} from '../semver';
import {
	uniq,
	someSemverMatched,
	hasVersion,
	familyMatched
} from './util';

describe('UserAgent', () => {

	describe('util', () => {

		describe('uniq', () => {

			it('should filter duplicate elements', () => {

				expect(
					uniq([1, 1, 2, 3, 3, 3, 4])
				).toEqual(
					[1, 2, 3, 4]
				);
			});
		});

		describe('someSemverMatched', () => {

			const versions: ISemver[] = [
				[10, 0, 0],
				[11, 0, 0],
				[12, 0, 0]
			];

			it('should correct match semver', () => {

				expect(
					someSemverMatched(
						[9, 0, 0],
						null,
						versions,
						{}
					)
				).toBe(
					true
				);

				expect(
					someSemverMatched(
						null,
						[11, 0, 0],
						versions,
						{}
					)
				).toBe(
					true
				);

				expect(
					someSemverMatched(
						[10, 0, 0],
						[16, 0, 0],
						versions,
						{}
					)
				).toBe(
					true
				);

				expect(
					someSemverMatched(
						[16, 0, 0],
						null,
						versions,
						{}
					)
				).toBe(
					false
				);

				expect(
					someSemverMatched(
						null,
						[9, 0, 0],
						versions,
						{}
					)
				).toBe(
					false
				);
			});
		});

		describe('hasVersion', () => {

			it('should correct test input data', () => {

				expect(
					hasVersion(
						true,
						/(test)/
					)
				).toBe(
					true
				);

				expect(
					hasVersion(
						false,
						/(test)/
					)
				).toBe(
					false
				);

				expect(
					hasVersion(
						false,
						/(\d+)/
					)
				).toBe(
					true
				);

				expect(
					hasVersion(
						true,
						/(\d+)/
					)
				).toBe(
					true
				);
			});
		});

		describe('familyMatched', () => {

			it('should correct match browser family from RegExp', () => {

				expect(
					familyMatched(
						true,
						/(Chrome)/,
						['Chrome', 'Firefox']
					)
				).toBe(
					true
				);

				expect(
					familyMatched(
						false,
						/(Chrome)/,
						['Chrome', 'Firefox']
					)
				).toBe(
					true
				);

				expect(
					familyMatched(
						true,
						/(Chrome)/,
						['Firefox']
					)
				).toBe(
					false
				);

				expect(
					familyMatched(
						false,
						/(Chrome)/,
						['Firefox']
					)
				).toBe(
					false
				);
			});

			it('should correct match exact browser family', () => {

				expect(
					familyMatched(
						true,
						'Chrome',
						['Chrome', 'Firefox']
					)
				).toBe(
					true
				);

				expect(
					familyMatched(
						true,
						'Chrome Mobile',
						['Chrome', 'Firefox']
					)
				).toBe(
					false
				);
			});

			it('should correct match browser family', () => {

				expect(
					familyMatched(
						false,
						'Chrome',
						['Chrome', 'Firefox']
					)
				).toBe(
					true
				);

				expect(
					familyMatched(
						false,
						'Chrome Mobile',
						['Chrome', 'Firefox']
					)
				).toBe(
					true
				);
			});
		});
	});
});

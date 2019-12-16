import {
	BROWSERS_SHIRTNAMES
} from './shirtnames';
import {
	normalizeBrowserFamily,
	compareArrays,
	numbersToRanges
} from './util';

describe('Browsers', () => {

	describe('util', () => {

		describe('normalizeBrowserFamily', () => {

			it('should correct normalize browser family', () => {

				const shirtname = Object.keys(BROWSERS_SHIRTNAMES)[0];
				const strWithShirtname = `foo ${shirtname} bar`;
				const strWithFullname = `foo ${BROWSERS_SHIRTNAMES[shirtname]} bar`;

				expect(
					normalizeBrowserFamily(strWithShirtname)
				).toBe(
					strWithFullname
				);
			});

			it('should correct normalize IE browsers', () => {

				expect(
					normalizeBrowserFamily('ie')
				).toBe(
					BROWSERS_SHIRTNAMES.ie
				);

				expect(
					normalizeBrowserFamily('ie_mob')
				).toBe(
					BROWSERS_SHIRTNAMES.ie_mob
				);
			});

			it('should do not change string without family shirtname', () => {

				const str = 'foo bar';

				expect(
					normalizeBrowserFamily(str)
				).toBe(
					str
				);
			});
		});

		describe('compareArrays', () => {

			it('should correct compare arrays', () => {

				expect(
					compareArrays([], [])
				).toBe(
					true
				);

				expect(
					compareArrays([1, 2, 3], [1, 2, 3])
				).toBe(
					true
				);

				expect(
					compareArrays([3, 2, 3], [1, 2, 3])
				).toBe(
					false
				);

				expect(
					compareArrays([3, 2, 3], [1, 2, 3], 1)
				).toBe(
					true
				);

				expect(
					compareArrays([3, 2, 3], [1, 2, 3], 2)
				).toBe(
					true
				);

				expect(
					compareArrays([3, 2, 3], [1, 2, 3], 3)
				).toBe(
					true
				);

				expect(
					compareArrays([3, 1], [1, 2], 3)
				).toBe(
					true
				);
			});
		});

		describe('numbersToRanges', () => {

			it('should get first and last elements form array', () => {

				expect(
					numbersToRanges([5, 6, 7])
				).toEqual(
					[5, 7]
				);

				expect(
					numbersToRanges([5, 6])
				).toEqual(
					[5, 6]
				);
			});

			it('should get first element form one-element-array', () => {

				expect(
					numbersToRanges([8])
				).toBe(
					8
				);
			});

			it('should return number', () => {

				expect(
					numbersToRanges(10)
				).toBe(
					10
				);
			});
		});
	});
});

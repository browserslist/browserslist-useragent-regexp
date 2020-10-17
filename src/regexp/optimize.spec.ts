import {
	optimize
} from './optimize';

describe('UserAgentRegExp', () => {

	describe('optimize', () => {

		it('should remove braces', () => {

			expect(
				optimize('(Family)foo(NotFamily)(bar)')
			).toBe(
				'FamilyfooNotFamilybar'
			);

			expect(
				optimize('(Family)foo(NotFamily|bar)')
			).toBe(
				'Familyfoo(NotFamily|bar)'
			);

			expect(
				optimize('(Family)(foo)?(?=NotFamily)')
			).toBe(
				'Family(foo)?(?=NotFamily)'
			);
		});

		it('should remove unnecessary escapes in ranges', () => {

			expect(
				optimize('[\\.\\[]')
			).toBe(
				'[.[]'
			);
		});
	});
});

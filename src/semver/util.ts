/**
 * Check target if is 'all'.
 * @param  version - Target to check.
 * @return Is 'all' or not.
 */
export function isAllVersion(version: any): version is 'all' {
	return version === 'all';
}

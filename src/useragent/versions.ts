import {
	ISemver
} from '../semver/types';
import {
	regExpToString
} from '../regexp/util';

/**
 * Get browser min and max versions for given useragent RegExp.
 * @param  regExp - Target RegExp.
 * @return Min and max versions.
 */
export function getMinMaxVersions(regExp: RegExp): [ISemver, ISemver] {

	const regExpString = regExpToString(regExp);

	/* istanbul ignore next */
	switch (true) {

		/**
		 * https://developers.whatismybrowser.com/useragents/explore/software_name/fennec/
		 */
		case /Fennec/.test(regExpString):
			return [
				null,
				[31, 0, 0]
			];

		/**
		 * https://developers.whatismybrowser.com/useragents/explore/software_name/minefield/
		 */
		case /Minefield/.test(regExpString):
			return [
				[3, 0, 0],
				[4, 0, 0]
			];

		/**
		 * https://wiki.mozilla.org/Firefox/Namoroka
		 */
		case /Namoroka/.test(regExpString):
			return [
				[3, 6, 0],
				[3, 6, 0]
			];

		/**
		 * https://developers.whatismybrowser.com/useragents/explore/software_name/shiretoko
		 */
		case /Shiretoko/.test(regExpString):
			return [
				[3, 0, 0],
				[3, 5, 0]
			];

		/**
		 * https://developers.whatismybrowser.com/useragents/explore/operating_system_name/android
		 */
		case /CrMo/.test(regExpString):
			return [
				[16, 0, 0],
				[16, 0, 0]
			];

		/**
		 * https://help.opera.com/en/operas-archived-history/
		 */
		case /Opera\)\\\/9\.8/.test(regExpString):
			return [
				null,
				[12, 15, 0]
			];

		default:
			return [null, null];
	}
}

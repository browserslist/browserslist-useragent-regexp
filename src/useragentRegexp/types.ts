import {
	IBrowsersListRequest
} from '../browsers';
import {
	ISemverCompareOptions
} from '../semver';

export type IUserAgentRegExpOptions = IBrowsersListRequest & ISemverCompareOptions;

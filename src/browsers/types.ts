import { ISemver } from '../semver';

export interface IBrowser {
	family: string;
	version: ISemver;
}

export interface IBrowserVersions {
	family: string;
	versions: ISemver[];
}

export interface IBrowsersListRequest {
	browsers?: string[];
	env?: string;
	path?: string;
}

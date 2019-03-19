import { ISemver } from '../semver';

export enum BrowserRegExpSourceProps {
	RegExp = 0,
	Family,
	Major,
	Minor,
	Patch
}

export interface IBrowserRegExpSource {
	[BrowserRegExpSourceProps.RegExp]: RegExp;
	[BrowserRegExpSourceProps.Family]: string;
	[BrowserRegExpSourceProps.Major]: number|string;
	[BrowserRegExpSourceProps.Minor]: number|string;
	[BrowserRegExpSourceProps.Patch]: number|string;
}

export interface IBrowserRegExp {
	family: string;
	regExp: RegExp;
	version: ISemver|null;
}

export interface IBrowserVersionRegExp {
	family: string;
	regExp: RegExp;
	requestVersions: ISemver[];
	resultVersion: ISemver|null;
}

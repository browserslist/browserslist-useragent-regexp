import {
	ISemver
} from '../semver/types';

export enum BrowserRegExpSourceProp {
	RegExp = 0,
	Family,
	Major,
	Minor,
	Patch
}

export interface IBrowserRegExpSource {
	[BrowserRegExpSourceProp.RegExp]: RegExp;
	[BrowserRegExpSourceProp.Family]: string;
	[BrowserRegExpSourceProp.Major]: number|string;
	[BrowserRegExpSourceProp.Minor]: number|string;
	[BrowserRegExpSourceProp.Patch]: number|string;
}

export interface IFixedFamily {
	family: string;
	regExp?: RegExp;
}

export interface IBrowserRegExp {
	regExp: RegExp;
	family: string;
	fixedVersion: ISemver|null;
	minVersion: ISemver|null;
	maxVersion: ISemver|null;
}

export interface IBrowserVersionRegExp {
	family: string;
	regExp: RegExp;
	requestVersions: ISemver[];
	resultFixedVersion: ISemver|null;
	resultMinVersion: ISemver|null;
	resultMaxVersion: ISemver|null;
}

export interface IBrowserVersionedRegExp extends IBrowserVersionRegExp {
	sourceRegExp: RegExp;
	sourceRegExpString: string;
	regExpString: string;
	requestVersionsStrings: string[];
}

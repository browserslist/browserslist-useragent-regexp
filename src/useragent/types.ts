import { ISemver } from '../semver';
import { IBrowser } from '../browsers';

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

export interface IBrowserRegExp extends IBrowser {
	regExp: RegExp;
	version: ISemver|null;
}

export interface IBrowserVersionRegExp {
	family: string;
	regExp: RegExp;
	requestVersions: ISemver[];
	resultVersion: ISemver|null;
}

export interface IBrowserVersionedRegExp extends IBrowserVersionRegExp {
	sourceRegExp: RegExp;
	sourceRegExpString: string;
	regExpString: string;
	requestVersionsStrings: string[];
}

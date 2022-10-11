
export interface ISemverCompareOptions {
  ignoreMinor?: boolean
  ignorePatch?: boolean
  allowZeroSubversions?: boolean
  allowHigherVersions?: boolean
}

export type ISemver = [
  number,
  number,
  number
]

export type ISemverRange = number|number[]

export type IRangedSemver = [
  ISemverRange,
  ISemverRange,
  ISemverRange
]

export type ISemverLike = string|(number|string)[]

export enum SemverPart {
  Major = 0,
  Minor,
  Patch
}

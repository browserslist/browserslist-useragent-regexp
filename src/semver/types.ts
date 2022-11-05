export interface SemverCompareOptions {
  ignoreMinor?: boolean
  ignorePatch?: boolean
  allowZeroSubversions?: boolean
  allowHigherVersions?: boolean
}

export type Semver = [
  number,
  number,
  number
]

export type SemverRange = number | [number, number]

export type RangedSemver = [
  SemverRange,
  SemverRange,
  SemverRange
]

export type SemverLike = string | (number | string)[]

export enum SemverPart {
  Major = 0,
  Minor,
  Patch
}

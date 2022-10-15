import type {
  Semver,
  RangedSemver
} from '../semver/types.js'

export interface Browser {
  family: string
  version: Semver
}

export interface BrowserslistRequest {
  browsers?: string | string[]
  env?: string
  path?: string
}

export type BrowsersVersions = Map<string, Semver[]>

export type RangedBrowsersVersions = Map<string, RangedSemver[]>

import type browserslist from 'browserslist'
import type { Options } from 'browserslist'
import type {
  Semver,
  RangedSemver
} from '../semver/types.js'

export interface Browser {
  family: string
  version: Semver
}

export interface BrowserslistRequest extends Options {
  browsers?: Parameters<typeof browserslist>[0]
}

export type BrowsersVersions = Map<string, Semver[]>

export type RangedBrowsersVersions = Map<string, RangedSemver[]>

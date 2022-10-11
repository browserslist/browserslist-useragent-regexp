import type {
  ISemver,
  IRangedSemver
} from '../semver/types.js'

export interface IBrowser {
  family: string
  version: ISemver
}

export interface IBrowsersListRequest {
  browsers?: string|string[]
  env?: string
  path?: string
}

export type IBrowsers = Map<string, ISemver[]>

export type IRangedBrowsers = Map<string, IRangedSemver[]>

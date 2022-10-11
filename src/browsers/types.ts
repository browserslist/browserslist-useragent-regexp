import {
  ISemver,
  IRangedSemver
} from '../semver'

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

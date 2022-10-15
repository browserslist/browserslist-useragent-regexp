import type { UserAgentRegex } from 'ua-regexes-lite'
import type { Semver } from '../semver/types.js'

export interface BrowserRegex extends UserAgentRegex {
  requestVersions: Semver[]
}

export interface BrowserVersionedRegex extends BrowserRegex {
  sourceRegex: RegExp
  sourceRegexString: string
  regexString: string
  requestVersionsStrings: string[]
}

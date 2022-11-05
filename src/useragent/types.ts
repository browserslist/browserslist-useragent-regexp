import type { UserAgentRegex } from 'ua-regexes-lite'
import type { AstRegExp } from 'regexp-tree/ast'
import type { Semver } from '../semver/types.js'

export interface BrowserRegex extends UserAgentRegex {
  requestVersions: Semver[]
  matchedVersions: Semver[]
}

export interface BrowserVersionedRegex extends BrowserRegex {
  sourceRegex: RegExp
  regexAst: AstRegExp
}

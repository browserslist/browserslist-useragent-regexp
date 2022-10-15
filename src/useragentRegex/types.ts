import type { BrowserslistRequest } from '../browsers/types.js'
import type { SemverCompareOptions } from '../semver/types.js'

export type UserAgentRegexOptions = BrowserslistRequest & SemverCompareOptions

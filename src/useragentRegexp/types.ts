import type {
  IBrowsersListRequest,
  IBrowsers
} from '../browsers/types.js'
import type { IBrowserVersionedRegExp } from '../useragent/types.js'
import type { ISemverCompareOptions } from '../semver/types.js'

export type IUserAgentRegExpOptions = IBrowsersListRequest & ISemverCompareOptions

export interface IBrowserPatch {
  test(browsers: IBrowsers): boolean
  patch(regExp: IBrowserVersionedRegExp): IBrowserVersionedRegExp
}

import {
  IBrowsersListRequest,
  IBrowsers
} from '../browsers/types'
import { IBrowserVersionedRegExp } from '../useragent/types'
import { ISemverCompareOptions } from '../semver/types'

export type IUserAgentRegExpOptions = IBrowsersListRequest & ISemverCompareOptions

export interface IBrowserPatch {
  test(browsers: IBrowsers): boolean
  patch(regExp: IBrowserVersionedRegExp): IBrowserVersionedRegExp
}

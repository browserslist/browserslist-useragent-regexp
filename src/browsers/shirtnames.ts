/* eslint-disable @typescript-eslint/naming-convention */

export const BROWSERS_SHIRTNAMES: Record<string, string> = {
  bb: 'BlackBerry',
  and_chr: 'Chrome',
  ChromeAndroid: 'Chrome',
  FirefoxAndroid: 'Firefox',
  ff: 'Firefox',
  ie_mob: 'ExplorerMobile',
  ie: 'Explorer',
  and_ff: 'Firefox',
  ios_saf: 'iOS',
  op_mini: 'OperaMini',
  op_mob: 'OperaMobile',
  and_qq: 'QQAndroid',
  and_uc: 'UCAndroid'
}

export const BROWSERS_SHIRTNAMES_REGEXP = new RegExp(`(${Object.keys(BROWSERS_SHIRTNAMES).join('|')})`)

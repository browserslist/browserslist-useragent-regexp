import { describe, it, expect } from 'vitest'
import { BROWSERS_SHIRTNAMES } from './shirtnames.js'
import { parseBrowsersList } from './browserslist.js'

describe('Browsers', () => {
  describe('browserslist', () => {
    describe('parseBrowsersList', () => {
      it('should correct parse browsers list', () => {
        const shirtname = Object.keys(BROWSERS_SHIRTNAMES)[0]
        const fullname = BROWSERS_SHIRTNAMES[shirtname]
        const browsersList = [
          `${shirtname} 10`,
          'Chrome 11.12',
          'OPERA 13.14.15'
        ]
        const browsers = [
          {
            family: fullname.toLowerCase(),
            version: [
              10,
              0,
              0
            ]
          },
          {
            family: 'chrome',
            version: [
              11,
              12,
              0
            ]
          },
          {
            family: 'opera',
            version: [
              13,
              14,
              15
            ]
          }
        ]

        expect(
          parseBrowsersList(browsersList)
        ).toEqual(
          browsers
        )
      })
    })
  })
})

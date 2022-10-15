import { describe, it, expect } from 'vitest'
import { parseBrowsersList } from './browserslist.js'

describe('Browsers', () => {
  describe('browserslist', () => {
    describe('parseBrowsersList', () => {
      it('should correct parse browsers list', () => {
        const browsersList = [
          'ie 10',
          'chrome 11.12',
          'opera 13.14.15'
        ]
        const browsers = [
          {
            family: 'ie',
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

import { describe, it, expect } from 'vitest'
import { parseBrowsersList } from './browserslist.js'

describe('Browsers', () => {
  describe('browserslist', () => {
    describe('parseBrowsersList', () => {
      it('should correct parse browsers list', () => {
        const browsersList = [
          'ie 10',
          'chrome 11.12',
          'opera 13.14.15',
          'ios_saf 14.2-14.4',
          'android 4.4.2-4.4.4'
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
          },
          {
            family: 'ios_saf',
            version: [
              14,
              2,
              0
            ]
          },
          {
            family: 'ios_saf',
            version: [
              14,
              3,
              0
            ]
          },
          {
            family: 'ios_saf',
            version: [
              14,
              4,
              0
            ]
          },
          {
            family: 'android',
            version: [
              4,
              4,
              2
            ]
          },
          {
            family: 'android',
            version: [
              4,
              4,
              3
            ]
          },
          {
            family: 'android',
            version: [
              4,
              4,
              4
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

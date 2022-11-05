import { describe, it, expect } from 'vitest'
import type { Semver } from '../semver/types.js'
import { findMatchedVersions } from './utils.js'

describe('UserAgent', () => {
  describe('utils', () => {
    describe('someSemverMatched', () => {
      const versions: Semver[] = [
        [
          10,
          0,
          0
        ],
        [
          11,
          0,
          0
        ],
        [
          12,
          0,
          0
        ]
      ]

      it('should correct match semver', () => {
        expect(
          findMatchedVersions(
            [
              9,
              0,
              0
            ],
            null,
            versions,
            {}
          )
        ).toEqual(
          versions
        )

        expect(
          findMatchedVersions(
            null,
            [
              11,
              0,
              0
            ],
            versions,
            {}
          )
        ).toEqual(
          [
            [
              10,
              0,
              0
            ],
            [
              11,
              0,
              0
            ]
          ]
        )

        expect(
          findMatchedVersions(
            [
              10,
              0,
              0
            ],
            [
              16,
              0,
              0
            ],
            versions,
            {}
          )
        ).toEqual(
          versions
        )

        expect(
          findMatchedVersions(
            [
              16,
              0,
              0
            ],
            null,
            versions,
            {}
          )
        ).toEqual(
          []
        )

        expect(
          findMatchedVersions(
            null,
            [
              9,
              0,
              0
            ],
            versions,
            {}
          )
        ).toEqual(
          []
        )
      })
    })
  })
})

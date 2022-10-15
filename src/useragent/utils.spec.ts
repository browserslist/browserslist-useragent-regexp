import { describe, it, expect } from 'vitest'
import type { Semver } from '../semver/types.js'
import { someSemverMatched } from './utils.js'

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
          someSemverMatched(
            [
              9,
              0,
              0
            ],
            null,
            versions,
            {}
          )
        ).toBe(
          true
        )

        expect(
          someSemverMatched(
            null,
            [
              11,
              0,
              0
            ],
            versions,
            {}
          )
        ).toBe(
          true
        )

        expect(
          someSemverMatched(
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
        ).toBe(
          true
        )

        expect(
          someSemverMatched(
            [
              16,
              0,
              0
            ],
            null,
            versions,
            {}
          )
        ).toBe(
          false
        )

        expect(
          someSemverMatched(
            null,
            [
              9,
              0,
              0
            ],
            versions,
            {}
          )
        ).toBe(
          false
        )
      })
    })
  })
})

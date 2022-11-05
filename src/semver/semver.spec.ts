import { describe, it, expect } from 'vitest'
import type { Semver } from './types.js'
import {
  semverify,
  compareSemvers,
  getRequiredSemverPartsCount,
  rangeSemver
} from './semver.js'

describe('Semver', () => {
  describe('semverify', () => {
    it('should semverify strings', () => {
      expect(
        semverify('10')
      ).toEqual(
        [
          10,
          0,
          0
        ]
      )

      expect(
        semverify('11.1')
      ).toEqual(
        [
          11,
          1,
          0
        ]
      )

      expect(
        semverify('13.0.1')
      ).toEqual(
        [
          13,
          0,
          1
        ]
      )
    })

    it('should semverify array', () => {
      expect(
        semverify([10])
      ).toEqual(
        [
          10,
          0,
          0
        ]
      )

      expect(
        semverify(['11', '1'])
      ).toEqual(
        [
          11,
          1,
          0
        ]
      )

      expect(
        semverify([
          13,
          '0',
          '1'
        ])
      ).toEqual(
        [
          13,
          0,
          1
        ]
      )
    })

    it('should return Infinity for \'all\' version', () => {
      expect(
        semverify('all')
      ).toEqual(
        [
          Infinity,
          0,
          0
        ]
      )

      expect(
        semverify(['all'])
      ).toEqual(
        [
          Infinity,
          0,
          0
        ]
      )
    })

    it('should return null for non-number versions', () => {
      expect(
        semverify('TP')
      ).toBeNull()

      expect(
        semverify(['TP'])
      ).toBeNull()
    })
  })

  describe('compareSemvers', () => {
    it('should handle Infinity (\'all\') version', () => {
      expect(
        compareSemvers(
          [
            10,
            1,
            1
          ],
          [
            Infinity,
            0,
            0
          ],
          {}
        )
      ).toBe(
        true
      )
    })

    describe('allowHigherVersions: false', () => {
      const options = {
        ignoreMinor: false,
        ignorePatch: false,
        allowHigherVersions: false
      }

      it('should compare all parts', () => {
        expect(
          compareSemvers(
            [
              10,
              1,
              1
            ],
            [
              10,
              1,
              1
            ],
            options
          )
        ).toBe(
          true
        )

        expect(
          compareSemvers(
            [
              10,
              1,
              2
            ],
            [
              10,
              1,
              1
            ],
            options
          )
        ).toBe(
          false
        )

        expect(
          compareSemvers(
            [
              10,
              1,
              1
            ],
            [
              10,
              2,
              1
            ],
            options
          )
        ).toBe(
          false
        )
      })

      it('should compare ignoring patch', () => {
        const ignorePatchOptions = {
          ...options,
          ignorePatch: true
        }

        expect(
          compareSemvers(
            [
              10,
              1,
              1
            ],
            [
              10,
              1,
              1
            ],
            ignorePatchOptions
          )
        ).toBe(
          true
        )

        expect(
          compareSemvers(
            [
              10,
              1,
              0
            ],
            [
              10,
              1,
              1
            ],
            ignorePatchOptions
          )
        ).toBe(
          true
        )

        expect(
          compareSemvers(
            [
              10,
              1,
              2
            ],
            [
              10,
              2,
              1
            ],
            ignorePatchOptions
          )
        ).toBe(
          false
        )

        expect(
          compareSemvers(
            [
              10,
              1,
              2
            ],
            [
              12,
              2,
              1
            ],
            ignorePatchOptions
          )
        ).toBe(
          false
        )
      })

      it('should compare ignoring minor', () => {
        const ignoreMinorOptions = {
          ...options,
          ignoreMinor: true
        }

        expect(
          compareSemvers(
            [
              10,
              1,
              1
            ],
            [
              10,
              1,
              1
            ],
            ignoreMinorOptions
          )
        ).toBe(
          true
        )

        expect(
          compareSemvers(
            [
              10,
              1,
              0
            ],
            [
              10,
              2,
              1
            ],
            ignoreMinorOptions
          )
        ).toBe(
          true
        )

        expect(
          compareSemvers(
            [
              10,
              1,
              2
            ],
            [
              11,
              2,
              1
            ],
            ignoreMinorOptions
          )
        ).toBe(
          false
        )
      })
    })

    describe('allowHigherVersions: true', () => {
      const options = {
        ignoreMinor: false,
        ignorePatch: false,
        allowHigherVersions: true
      }

      it('should compare all parts', () => {
        expect(
          compareSemvers(
            [
              10,
              1,
              1
            ],
            [
              10,
              1,
              1
            ],
            options
          )
        ).toBe(
          true
        )

        expect(
          compareSemvers(
            [
              10,
              2,
              3
            ],
            [
              10,
              1,
              1
            ],
            options
          )
        ).toBe(
          true
        )

        expect(
          compareSemvers(
            [
              10,
              1,
              2
            ],
            [
              10,
              1,
              1
            ],
            options
          )
        ).toBe(
          true
        )

        expect(
          compareSemvers(
            [
              9,
              1,
              1
            ],
            [
              10,
              2,
              1
            ],
            options
          )
        ).toBe(
          false
        )

        expect(
          compareSemvers(
            [
              10,
              1,
              0
            ],
            [
              10,
              1,
              1
            ],
            options
          )
        ).toBe(
          false
        )
      })

      it('should compare ignoring patch', () => {
        const ignorePatchOptions = {
          ...options,
          ignorePatch: true
        }

        expect(
          compareSemvers(
            [
              10,
              1,
              1
            ],
            [
              10,
              1,
              1
            ],
            ignorePatchOptions
          )
        ).toBe(
          true
        )

        expect(
          compareSemvers(
            [
              10,
              0,
              2
            ],
            [
              10,
              2,
              1
            ],
            ignorePatchOptions
          )
        ).toBe(
          false
        )

        expect(
          compareSemvers(
            [
              9,
              1,
              2
            ],
            [
              12,
              2,
              1
            ],
            ignorePatchOptions
          )
        ).toBe(
          false
        )
      })

      it('should compare ignoring minor', () => {
        const ignoreMinorOptions = {
          ...options,
          ignoreMinor: true
        }

        expect(
          compareSemvers(
            [
              10,
              1,
              1
            ],
            [
              10,
              1,
              1
            ],
            ignoreMinorOptions
          )
        ).toBe(
          true
        )

        expect(
          compareSemvers(
            [
              10,
              1,
              0
            ],
            [
              10,
              2,
              1
            ],
            ignoreMinorOptions
          )
        ).toBe(
          true
        )

        expect(
          compareSemvers(
            [
              9,
              1,
              2
            ],
            [
              11,
              2,
              1
            ],
            ignoreMinorOptions
          )
        ).toBe(
          false
        )
      })
    })
  })

  describe('getRequiredSemverPartsCount', () => {
    describe('allowZeroSubversions: false', () => {
      const options = {
        ignoreMinor: false,
        ignorePatch: false,
        allowZeroSubversions: false
      }
      const version: Semver = [
        1,
        2,
        3
      ]

      it('should require all parts', () => {
        expect(
          getRequiredSemverPartsCount(version, options)
        ).toBe(
          3
        )
      })

      it('should require major and minor parts', () => {
        const ignorePatchOptions = {
          ...options,
          ignorePatch: true
        }

        expect(
          getRequiredSemverPartsCount(version, ignorePatchOptions)
        ).toBe(
          2
        )
      })

      it('should require major part', () => {
        const ignoreMinorOptions = {
          ...options,
          ignoreMinor: true
        }

        expect(
          getRequiredSemverPartsCount(version, ignoreMinorOptions)
        ).toBe(
          1
        )
      })
    })

    describe('allowZeroSubversions: true', () => {
      const options = {
        ignoreMinor: false,
        ignorePatch: false,
        allowZeroSubversions: true
      }
      const version: Semver = [
        1,
        2,
        3
      ]
      const zeroVersion: Semver = [
        1,
        1,
        0
      ]
      const zerosVersion: Semver = [
        1,
        0,
        0
      ]

      it('should require all parts', () => {
        expect(
          getRequiredSemverPartsCount(version, options)
        ).toBe(
          3
        )

        expect(
          getRequiredSemverPartsCount(zeroVersion, options)
        ).toBe(
          2
        )

        expect(
          getRequiredSemverPartsCount(zerosVersion, options)
        ).toBe(
          1
        )
      })

      it('should require major and minor parts', () => {
        const ignorePatchOptions = {
          ...options,
          ignorePatch: true
        }

        expect(
          getRequiredSemverPartsCount(version, ignorePatchOptions)
        ).toBe(
          2
        )

        expect(
          getRequiredSemverPartsCount(zeroVersion, ignorePatchOptions)
        ).toBe(
          2
        )

        expect(
          getRequiredSemverPartsCount(zerosVersion, ignorePatchOptions)
        ).toBe(
          1
        )
      })

      it('should require major part', () => {
        const ignoreMinorOptions = {
          ...options,
          ignoreMinor: true
        }

        expect(
          getRequiredSemverPartsCount(version, ignoreMinorOptions)
        ).toBe(
          1
        )

        expect(
          getRequiredSemverPartsCount(zeroVersion, ignoreMinorOptions)
        ).toBe(
          1
        )

        expect(
          getRequiredSemverPartsCount(zerosVersion, ignoreMinorOptions)
        ).toBe(
          1
        )
      })
    })
  })

  describe('rangeSemver', () => {
    it('should range patch', () => {
      expect(
        rangeSemver(
          [4, 4, 3],
          [4, 4, 5]
        )
      ).toEqual([
        [4, 4, 3],
        [4, 4, 4],
        [4, 4, 5]
      ])
    })

    it('should range minor', () => {
      expect(
        rangeSemver(
          [15, 4, 0],
          [15, 6, 0]
        )
      ).toEqual([
        [15, 4, 0],
        [15, 5, 0],
        [15, 6, 0]
      ])
    })

    it('should range minor', () => {
      expect(
        rangeSemver(
          [100, 0, 0],
          [102, 0, 0]
        )
      ).toEqual([
        [100, 0, 0],
        [101, 0, 0],
        [102, 0, 0]
      ])
    })
  })
})

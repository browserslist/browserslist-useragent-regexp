import { ISemver } from './types'
import {
  semverify,
  compareSemvers,
  getRequiredSemverPartsCount,
  rangedSemverToRegExp
} from './semver'

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

    it('should ignore \'all\' version', () => {
      expect(
        semverify('all')
      ).toEqual(
        [
          'all',
          0,
          0
        ]
      )

      expect(
        semverify(['all'])
      ).toEqual(
        [
          'all',
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
    it('should handle \'all\' version', () => {
      expect(
        compareSemvers(
          [
            10,
            1,
            1
          ],
          [
            'all',
            0,
            0
          ] as any,
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
      const version: ISemver = [
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
      const version: ISemver = [
        1,
        2,
        3
      ]
      const zeroVersion: ISemver = [
        1,
        1,
        0
      ]
      const zerosVersion: ISemver = [
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

  describe('rangedSemverToRegExp', () => {
    const options = {
      ignoreMinor: false,
      ignorePatch: false,
      allowHigherVersions: false
    }

    it('should return only numbers', () => {
      expect(
        rangedSemverToRegExp(
          [
            11,
            12,
            0
          ],
          options
        )
      ).toEqual([
        [
          '11',
          '12',
          '0'
        ]
      ])
    })

    it('should return only numbers patterns', () => {
      expect(
        rangedSemverToRegExp(
          [
            'all',
            0,
            0
          ] as any,
          options
        )
      ).toEqual([
        [
          '(\\d+)',
          '(\\d+)',
          '(\\d+)'
        ]
      ])
    })

    it('should return number pattern at patch', () => {
      const ignorePatchOptions = {
        ...options,
        ignorePatch: true
      }

      expect(
        rangedSemverToRegExp(
          [
            11,
            12,
            0
          ],
          ignorePatchOptions
        )
      ).toEqual([
        [
          '11',
          '12',
          '(\\d+)'
        ]
      ])
    })

    it('should return number patterns at minor and patch', () => {
      const ignoreMinorOptions = {
        ...options,
        ignoreMinor: true
      }

      expect(
        rangedSemverToRegExp(
          [
            11,
            12,
            0
          ],
          ignoreMinorOptions
        )
      ).toEqual([
        [
          '11',
          '(\\d+)',
          '(\\d+)'
        ]
      ])
    })

    it('should return ranged major', () => {
      expect(
        rangedSemverToRegExp(
          [
            [11, 13],
            12,
            0
          ],
          options
        )
      ).toEqual([
        [
          '1[1-3]',
          '12',
          '0'
        ]
      ])
    })

    it('should return ranged major ray', () => {
      const allowHigherOptions = {
        ...options,
        allowHigherVersions: true
      }

      expect(
        rangedSemverToRegExp(
          [
            [11, 13],
            12,
            0
          ],
          allowHigherOptions
        )
      ).toEqual([
        [
          '11',
          '12',
          '\\d+'
        ],
        [
          '11',
          '(1[3-9]|[2-9]\\d|\\d{3,})',
          '(\\d+)'
        ],
        [
          '(1[2-9]|[2-9]\\d|\\d{3,})',
          '(\\d+)',
          '(\\d+)'
        ]
      ])
    })
  })
})

import {
  rayRangeDigitPattern,
  optimizeRaysNumberPatterns,
  rayToNumberPatterns
} from './numberRay'

describe('RegExp', () => {
  describe('numberRay', () => {
    describe('rayRangeNumberPattern', () => {
      it('should return digit pattern', () => {
        expect(
          rayRangeDigitPattern(0, true)
        ).toBe(
          '\\d'
        )
      })

      it('should return max digit', () => {
        expect(
          rayRangeDigitPattern(9, true)
        ).toBe(
          '9'
        )
      })

      it('should return digits range', () => {
        expect(
          rayRangeDigitPattern(1, true)
        ).toBe(
          '[1-9]'
        )
      })

      it('should start from next digit', () => {
        expect(
          rayRangeDigitPattern(1, false)
        ).toBe(
          '[2-9]'
        )
      })

      it('should not return more than 9', () => {
        expect(
          rayRangeDigitPattern(9, false)
        ).toBe(
          ''
        )
      })
    })

    describe('optimizeRaysNumberPatterns', () => {
      it('should remove useless patterns', () => {
        expect(
          optimizeRaysNumberPatterns([
            [
              '1',
              '2',
              '\\d'
            ],
            [
              '2',
              '\\d',
              '\\d'
            ]
          ])
        ).toEqual([
          [
            '1',
            '2',
            '\\d'
          ],
          [
            '2',
            '\\d',
            '\\d'
          ]
        ])

        expect(
          optimizeRaysNumberPatterns([
            [
              '1',
              '2',
              '\\d'
            ],
            [
              '2',
              '\\d',
              '\\d'
            ],
            [
              '3',
              '\\d',
              '\\d'
            ],
            [
              '3',
              '3',
              '\\d'
            ]
          ])
        ).toEqual([
          [
            '1',
            '2',
            '\\d'
          ],
          [
            '2',
            '\\d',
            '\\d'
          ]
        ])
      })
    })

    describe('rayToNumberPatterns', () => {
      it('should return correct ray pattern', () => {
        expect(
          rayToNumberPatterns(0)
        ).toEqual(['\\d+'])

        expect(
          rayToNumberPatterns(1)
        ).toEqual(['[1-9]', '\\d{2,}'])

        expect(
          rayToNumberPatterns(9)
        ).toEqual(['9', '\\d{2,}'])

        expect(
          rayToNumberPatterns(10)
        ).toEqual(['[1-9]\\d', '\\d{3,}'])

        expect(
          rayToNumberPatterns(11)
        ).toEqual([
          '1[1-9]',
          '[2-9]\\d',
          '\\d{3,}'
        ])

        expect(
          rayToNumberPatterns(19)
        ).toEqual([
          '19',
          '[2-9]\\d',
          '\\d{3,}'
        ])

        expect(
          rayToNumberPatterns(20)
        ).toEqual(['[2-9]\\d', '\\d{3,}'])

        expect(
          rayToNumberPatterns(21)
        ).toEqual([
          '2[1-9]',
          '[3-9]\\d',
          '\\d{3,}'
        ])

        expect(
          rayToNumberPatterns(29)
        ).toEqual([
          '29',
          '[3-9]\\d',
          '\\d{3,}'
        ])

        expect(
          rayToNumberPatterns(99)
        ).toEqual(['99', '\\d{3,}'])

        expect(
          rayToNumberPatterns(100)
        ).toEqual(['[1-9]\\d\\d', '\\d{4,}'])

        expect(
          rayToNumberPatterns(101)
        ).toEqual([
          '10[1-9]',
          '1[1-9]\\d',
          '[2-9]\\d\\d',
          '\\d{4,}'
        ])

        expect(
          rayToNumberPatterns(111)
        ).toEqual([
          '11[1-9]',
          '1[2-9]\\d',
          '[2-9]\\d\\d',
          '\\d{4,}'
        ])

        expect(
          rayToNumberPatterns(199)
        ).toEqual([
          '199',
          '[2-9]\\d\\d',
          '\\d{4,}'
        ])

        expect(
          rayToNumberPatterns(200)
        ).toEqual(['[2-9]\\d\\d', '\\d{4,}'])

        expect(
          rayToNumberPatterns(299)
        ).toEqual([
          '299',
          '[3-9]\\d\\d',
          '\\d{4,}'
        ])

        expect(
          rayToNumberPatterns(999)
        ).toEqual(['999', '\\d{4,}'])

        expect(
          rayToNumberPatterns(1000)
        ).toEqual(['[1-9]\\d\\d\\d', '\\d{5,}'])

        expect(
          rayToNumberPatterns(56)
        ).toEqual([
          '5[6-9]',
          '[6-9]\\d',
          '\\d{3,}'
        ])
      })
    })
  })
})

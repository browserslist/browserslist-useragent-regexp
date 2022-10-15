import { describe, it, expect } from 'vitest'
import { numbersToRanges } from './utils.js'

describe('Browsers', () => {
  describe('utils', () => {
    describe('numbersToRanges', () => {
      it('should get first and last elements form array', () => {
        expect(
          numbersToRanges([
            5,
            6,
            7
          ])
        ).toEqual(
          [5, 7]
        )

        expect(
          numbersToRanges([5, 6])
        ).toEqual(
          [5, 6]
        )
      })

      it('should get first element form one-element-array', () => {
        expect(
          numbersToRanges([8])
        ).toBe(
          8
        )
      })

      it('should return number', () => {
        expect(
          numbersToRanges(10)
        ).toBe(
          10
        )
      })
    })
  })
})

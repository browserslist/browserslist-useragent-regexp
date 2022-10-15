import { describe, it, expect } from 'vitest'
import { compareArrays, uniq } from './index.js'

describe('Utils', () => {
  describe('compareArrays', () => {
    it('should correct compare arrays', () => {
      expect(
        compareArrays([], [])
      ).toBe(
        true
      )

      expect(
        compareArrays([
          1,
          2,
          3
        ], [
          1,
          2,
          3
        ])
      ).toBe(
        true
      )

      expect(
        compareArrays([
          3,
          2,
          3
        ], [
          1,
          2,
          3
        ])
      ).toBe(
        false
      )

      expect(
        compareArrays([
          3,
          2,
          3
        ], [
          1,
          2,
          3
        ], 1)
      ).toBe(
        true
      )

      expect(
        compareArrays([
          3,
          2,
          3
        ], [
          1,
          2,
          3
        ], 2)
      ).toBe(
        true
      )

      expect(
        compareArrays([
          3,
          2,
          3
        ], [
          1,
          2,
          3
        ], 3)
      ).toBe(
        true
      )

      expect(
        compareArrays([3, 1], [1, 2], 3)
      ).toBe(
        true
      )
    })
  })

  describe('uniq', () => {
    it('should filter duplicate elements', () => {
      expect(
        uniq([
          1,
          1,
          2,
          3,
          3,
          3,
          4
        ])
      ).toEqual(
        [
          1,
          2,
          3,
          4
        ]
      )
    })
  })
})

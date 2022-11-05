import { describe, it, expect } from 'vitest'
import { compareArrays } from './index.js'

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
})

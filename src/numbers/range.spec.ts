import { describe, it, expect } from 'vitest'
import { toString } from '../regex/index.js'
import { rangeToRegex } from './range.js'

describe('Numbers', () => {
  describe('range', () => {
    describe('rangeToRegex', () => {
      it('should return number pattern for Infinity (\'all\') version', () => {
        expect(
          toString(rangeToRegex(Infinity))
        ).toBe(
          '\\d+'
        )
      })

      it('should return ray pattern', () => {
        expect(
          toString(rangeToRegex(6))
        ).toBe(
          '([6-9]|\\d{2,})'
        )
      })

      it('should return segment pattern', () => {
        expect(
          toString(rangeToRegex(6, 8))
        ).toBe(
          '[6-8]'
        )
      })
    })
  })
})

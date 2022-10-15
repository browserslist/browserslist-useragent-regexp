import { describe, it, expect } from 'vitest'
import { rangeToRegex } from './numberRange.js'

describe('Regex', () => {
  describe('numberRange', () => {
    describe('rangeToRegex', () => {
      it('should return number pattern for \'all\' version', () => {
        expect(
          rangeToRegex('all' as any)
        ).toBe(
          '\\d+'
        )
      })

      it('should return ray pattern', () => {
        expect(
          rangeToRegex(6)
        ).toBe(
          '([6-9]|\\d{2,})'
        )
      })

      it('should return segment pattern', () => {
        expect(
          rangeToRegex(6, 8)
        ).toBe(
          '(6|7|8)'
        )
      })
    })
  })
})

import { describe, it, expect } from 'vitest'
import { rangeToRegExp } from './numberRange.js'

describe('RegExp', () => {
  describe('numberRange', () => {
    describe('rangeToRegExp', () => {
      it('should return number pattern for \'all\' version', () => {
        expect(
          rangeToRegExp('all' as any)
        ).toBe(
          '\\d+'
        )
      })

      it('should return ray pattern', () => {
        expect(
          rangeToRegExp(6)
        ).toBe(
          '([6-9]|\\d{2,})'
        )
      })

      it('should return segment pattern', () => {
        expect(
          rangeToRegExp(6, 8)
        ).toBe(
          '(6|7|8)'
        )
      })
    })
  })
})

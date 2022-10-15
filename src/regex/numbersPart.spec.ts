import { describe, it, expect } from 'vitest'
import { getNumberPatternsPart } from './numbersPart.js'

describe('Regex', () => {
  describe('numbersPart', () => {
    describe('getNumberPatternsPart', () => {
      it('should work with RegExp', () => {
        expect(
          getNumberPatternsPart(/Chrome(\d+)/)
        ).toBe(
          '(\\d+)'
        )
      })

      it('should work with string', () => {
        expect(
          getNumberPatternsPart('Chrome(\\d+)')
        ).toBe(
          '(\\d+)'
        )
      })

      it('should ignore square braces', () => {
        expect(
          getNumberPatternsPart('[(\\d+)](\\d+)')
        ).toBe(
          '(\\d+)'
        )
      })

      it('should handle escaped braces', () => {
        expect(
          getNumberPatternsPart('\\(\\d+) (not a number) (\\d+)')
        ).toBe(
          '(\\d+)'
        )
      })

      it('should handle nested groups', () => {
        expect(
          getNumberPatternsPart('Chrome (Canary(\\d+)) (\\d+)(test)')
        ).toBe(
          '(Canary(\\d+)) (\\d+)'
        )
      })

      it('should handle only given number patterns count', () => {
        expect(
          getNumberPatternsPart('(\\d+)1(\\d+)2(\\d+)3', 2)
        ).toBe(
          '(\\d+)1(\\d+)'
        )

        expect(
          getNumberPatternsPart('(\\d+)1(\\d+)2(\\d+)3', 1)
        ).toBe(
          '(\\d+)'
        )

        expect(
          getNumberPatternsPart('Chrome (Canary(\\d+)) (\\d+)', 1)
        ).toBe(
          '(Canary(\\d+))' // feel free to optimize
        )
      })

      it('should capture group postfix', () => {
        expect(
          getNumberPatternsPart('(\\d+)+(some)')
        ).toBe(
          '(\\d+)+'
        )

        expect(
          getNumberPatternsPart('(\\d+)*vvv')
        ).toBe(
          '(\\d+)*'
        )

        expect(
          getNumberPatternsPart('(\\d+)?')
        ).toBe(
          '(\\d+)?'
        )

        expect(
          getNumberPatternsPart('test(\\d+){1,2}test')
        ).toBe(
          '(\\d+){1,2}'
        )

        expect(
          getNumberPatternsPart('test(\\d+)(?!g(g(g)))test')
        ).toBe(
          '(\\d+)(?!g(g(g)))'
        )

        expect(
          getNumberPatternsPart('v(\\d+)(?=g)')
        ).toBe(
          '(\\d+)(?=g)'
        )
      })
    })
  })
})

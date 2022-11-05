import { describe, it, expect } from 'vitest'
import { toString } from './regex.js'
import { optimizeRegex } from './optimize.js'

describe('Regex', () => {
  describe('optimizeRegex', () => {
    it('should remove braces', () => {
      expect(
        toString(optimizeRegex('(Family)foo(NotFamily)(bar)'))
      ).toBe(
        '/FamilyfooNotFamilybar/'
      )

      expect(
        toString(optimizeRegex('(?:Family)'))
      ).toBe(
        '/Family/'
      )

      expect(
        toString(optimizeRegex('(Family)foo(NotFamily|bar)'))
      ).toBe(
        '/Familyfoo(NotFamily|bar)/'
      )

      expect(
        toString(optimizeRegex('(Family)(foo)?(?=NotFamily)'))
      ).toBe(
        '/Family(foo)?(?=NotFamily)/'
      )
    })

    it('should remove top braces', () => {
      expect(
        toString(optimizeRegex('/(chrome|safari)/'))
      ).toBe(
        '/chrome|safari/'
      )

      expect(
        toString(optimizeRegex('/(chrome|safari) post/'))
      ).toBe(
        '/(chrome|safari) post/'
      )
    })

    it('should make groups uncapturable', () => {
      expect(
        toString(optimizeRegex('(?:Family)+'))
      ).toBe(
        '/(Family)+/'
      )
    })

    it('should merge disjunctions', () => {
      expect(
        toString(optimizeRegex('/chrome|(safari|firefox)|opera/'))
      ).toBe(
        '/chrome|safari|firefox|opera/'
      )

      expect(
        toString(optimizeRegex('/(chrome|(safari|firefox)|opera)/'))
      ).toBe(
        '/chrome|safari|firefox|opera/'
      )

      expect(
        toString(optimizeRegex('/(chrome|(safari|(firefox|edge))|opera)/'))
      ).toBe(
        '/chrome|safari|firefox|edge|opera/'
      )
    })

    it('should remove unnecessary escapes in ranges', () => {
      expect(
        toString(optimizeRegex('[\\.\\[]'))
      ).toBe(
        '/[.[]/'
      )
    })
  })
})

import type { BrowserVersionedRegex } from '../useragent/types.js'
import {
  optimizeRegex,
  toRegex,
  CapturingGroupNode,
  AstRegExpNode,
  DisjunctionCapturingGroupNode
} from '../regex/index.js'

/**
 * Compile regexes.
 * @param regexes - Objects with info about compiled regexes.
 * @returns Objects with info about compiled regexes.
 */
export function compileRegexes(regexes: BrowserVersionedRegex[]) {
  return regexes.map<BrowserVersionedRegex>(({
    regexAst,
    ...regex
  }) => {
    const optimizedRegexAst = optimizeRegex(regexAst)

    return {
      ...regex,
      regexAst: optimizedRegexAst,
      regex: toRegex(optimizedRegexAst)
    }
  })
}

/**
 * Compile regex.
 * @param regexes - Objects with info about compiled regexes.
 * @returns Compiled common regex.
 */
export function compileRegex(regexes: BrowserVersionedRegex[]) {
  const partsRegexes = regexes.map(
    ({ regexAst }) => CapturingGroupNode(regexAst.body)
  )
  const regexAst = optimizeRegex(
    AstRegExpNode(
      DisjunctionCapturingGroupNode(partsRegexes)
    )
  )

  return toRegex(regexAst)
}

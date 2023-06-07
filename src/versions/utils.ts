import type {
  AstRegExp,
  AstNode,
  Expression
} from 'regexp-tree/ast'
import type { NodePath } from 'regexp-tree'
import RegexpTree from 'regexp-tree'
import type {
  SemverRange,
  RangedSemver,
  SemverCompareOptions
} from '../semver/index.js'
import {
  parseRegex,
  isNumberPatternNode,
  isExpressionNode,
  visitors,
  NumberPatternNode,
  NumberCharsNode
} from '../regex/index.js'
import { rangeToRegex } from '../numbers/index.js'

/**
 * Get number patterns count from the regex.
 * @param regex - Target regex.
 * @returns Number patterns count.
 */
export function getNumberPatternsCount(regex: string | RegExp | AstNode) {
  const regexAst = parseRegex(regex)
  let count = 0

  RegexpTree.traverse(regexAst, {
    Group(nodePath: NodePath) {
      if (isNumberPatternNode(nodePath.node)) {
        count++
      }
    }
  })

  return count
}

/**
 * Replace number patterns.
 * @param regex - Target regex.
 * @param numbers - Number patterns to paste.
 * @param numberPatternsCount - Number patterns count to replace.
 * @returns Regex with replaced number patterns.
 */
export function replaceNumberPatterns(
  regex: string | RegExp | AstRegExp,
  numbers: Expression[],
  numberPatternsCount?: number
): AstRegExp
export function replaceNumberPatterns<T extends AstNode>(
  regex: T,
  numbers: Expression[],
  numberPatternsCount?: number
): T

export function replaceNumberPatterns(
  regex: string | RegExp | AstNode,
  numbers: Expression[],
  numberPatternsCount?: number
) {
  let regexAst = parseRegex(regex)
  const numbersToReplace = typeof numberPatternsCount === 'number'
    && numberPatternsCount < numbers.length
    ? numbers.slice(0, numberPatternsCount)
    : numbers.slice()

  RegexpTree.traverse(regexAst, visitors({
    every() {
      return Boolean(numbersToReplace.length)
    },
    Group(nodePath: NodePath) {
      if (isNumberPatternNode(nodePath.node) && numbersToReplace.length) {
        if (regexAst === nodePath.node) {
          regexAst = numbersToReplace.shift()
        } else {
          nodePath.replace(numbersToReplace.shift())
        }

        return false
      }

      return true
    }
  }))

  return regexAst
}

/**
 * Get from regex part with number patterns.
 * @param regex - Target regex.
 * @param numberPatternsCount - Number patterns to extract.
 * @returns Regex part with number patterns.
 */
export function getNumberPatternsPart(regex: string | RegExp | AstNode, numberPatternsCount?: number): Expression[] {
  const regexAst = parseRegex(regex)
  const maxNumbersCount = Math.min(
    getNumberPatternsCount(regexAst),
    numberPatternsCount || Infinity
  )
  const expressions: Expression[] = []
  let numbersCounter = 0
  let containsNumberPattern = false

  RegexpTree.traverse(regexAst, visitors({
    every: {
      pre({ node, parent }) {
        if (node === regexAst) {
          return true
        }

        if (!isExpressionNode(node)) {
          return false
        }

        if (parent === regexAst) {
          containsNumberPattern = false
        }

        return numbersCounter < maxNumbersCount
      },
      post({ node, parent }) {
        if (node !== regexAst && parent === regexAst
          && isExpressionNode(node)
          && (containsNumberPattern || numbersCounter > 0 && numbersCounter < maxNumbersCount)
        ) {
          expressions.push(node)
        }
      }
    },
    Group(nodePath: NodePath) {
      if (isNumberPatternNode(nodePath.node) && numbersCounter < maxNumbersCount) {
        containsNumberPattern = true
        numbersCounter++

        return false
      }

      return true
    }
  }))

  if (expressions.length === 1 && !isNumberPatternNode(expressions[0])) {
    return getNumberPatternsPart(expressions[0], maxNumbersCount)
  }

  return expressions
}

/**
 * Ranged semver to regex patterns.
 * @param rangedVersion - Ranged semver.
 * @param options - Semver compare options.
 * @returns Array of regex pattern.
 */
export function rangedSemverToRegex(rangedVersion: RangedSemver, options: SemverCompareOptions) {
  const {
    ignoreMinor,
    ignorePatch,
    allowHigherVersions
  } = options
  const ignoreIndex = rangedVersion[0] === Infinity
    ? 0
    : ignoreMinor
      ? 1
      : ignorePatch
        ? 2
        : 3

  if (allowHigherVersions) {
    const numberPatterns: Expression[][] = []
    let prevWasZero = true
    let d = 0
    let start = 0
    const createMapper = (i: number) => (range: SemverRange, j: number) => {
      if (j >= ignoreIndex) {
        return NumberPatternNode()
      }

      start = Array.isArray(range)
        ? range[0]
        : range

      if (j < i) {
        return NumberCharsNode(start)
      }

      if (j > i) {
        return NumberPatternNode()
      }

      return rangeToRegex(start + d)
    }

    for (let i = ignoreIndex - 1; i >= 0; i--) {
      if (prevWasZero && !rangedVersion[i]) {
        continue
      }

      prevWasZero = false
      numberPatterns.push(rangedVersion.map(createMapper(i)))
      d = 1
    }

    return numberPatterns
  }

  const numberPatterns = rangedVersion.map((range, i) => {
    if (i >= ignoreIndex) {
      return NumberPatternNode()
    }

    if (Array.isArray(range)) {
      return rangeToRegex(
        range[0],
        range[1]
      )
    }

    return NumberCharsNode(range)
  })

  return [numberPatterns]
}

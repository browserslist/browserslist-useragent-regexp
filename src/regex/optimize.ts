import type {
  AstRegExp,
  AstNode,
  Expression
} from 'regexp-tree/ast'
import RegexpTree from 'regexp-tree'
import {
  isCharNode,
  isDigitRangeNode,
  parseRegex,
  toString
} from './regex.js'

/**
 * Optimize regex.
 * @param regex - Regex to optimize.
 * @returns Optimized regex string.
 */
export function optimizeRegex(regex: string | RegExp | AstRegExp): AstRegExp
export function optimizeRegex<T extends AstNode>(regex: T): T

export function optimizeRegex(regex: string | RegExp | AstNode) {
  // Optimization requires filled codePoints
  const regexAst = RegexpTree.optimize(parseRegex(toString(regex))).getAST()

  RegexpTree.traverse(regexAst, {
    Group(nodePath) {
      const {
        parent,
        node
      } = nodePath
      const { expression } = node

      node.capturing = true

      if (parent.type === 'RegExp'
        || expression.type !== 'Disjunction' && parent.type !== 'Repetition'
        || expression.type === 'Disjunction' && parent.type === 'Disjunction'
      ) {
        nodePath.replace(nodePath.node.expression)
      }
    }
  })

  return regexAst
}

/**
 * Merge digits patterns if possible.
 * @param a
 * @param b
 * @returns Merged node.
 */
export function mergeDigits(a: Expression, b: Expression) {
  if (isCharNode(a) && isCharNode(b) && a.value === b.value) {
    return b
  }

  if (
    isCharNode(a, /\d/) && isDigitRangeNode(b)
    && Number(b.expressions[0].from.value) - Number(a.value) === 1
  ) {
    return {
      ...b,
      expressions: [
        {
          ...b.expressions[0],
          from: a
        }
      ]
    }
  }

  if (
    isDigitRangeNode(a) && isCharNode(b, /\d/)
    && Number(b.value) - Number(a.expressions[0].to.value) === 1
  ) {
    return {
      ...a,
      expressions: [
        {
          ...a.expressions[0],
          to: b
        }
      ]
    }
  }

  return null
}

/**
 * Optimize segment number patterns.
 * @param patterns
 * @returns Optimized segment number patterns.
 */
export function optimizeSegmentNumberPatterns(patterns: Expression[]) {
  return patterns.reduce<Expression[]>((patterns, node) => {
    const prevNode = patterns[patterns.length - 1]

    if (prevNode
      && node.type === 'Alternative' && prevNode.type === 'Alternative'
      && node.expressions.length === prevNode.expressions.length
    ) {
      const merged = prevNode.expressions.reduceRight<Expression[]>((exps, exp, i) => {
        if (!exps) {
          return exps
        }

        const merged = mergeDigits(exp, node.expressions[i])

        if (merged) {
          exps.unshift(merged)
        } else {
          return null
        }

        return exps
      }, [])

      if (merged) {
        node.expressions = merged
        patterns.pop()
      }
    }

    patterns.push(node)

    return patterns
  }, [])
}

import type {
  AstRegExp,
  AstNode,
  Expression,
  Char,
  CharacterClass,
  ClassRange
} from 'regexp-tree/ast'
import RegexpTree from 'regexp-tree'

/**
 * Check node whether is number pattern.
 * @param node - AST node to check.
 * @returns Is number pattern or not.
 */
export function isNumberPatternNode(node: AstNode) {
  if (node.type === 'Group' && node.expression.type === 'Repetition') {
    const {
      expression,
      quantifier
    } = node.expression

    return expression.type === 'Char' && expression.value === '\\d'
      && quantifier.kind === '+' && quantifier.greedy
  }

  return false
}

/**
 * Check node whether is char node.
 * @param node - AST node to check.
 * @param value - Value to compare.
 * @returns Is char node or not.
 */
export function isCharNode(node: AstNode, value?: string | number | RegExp): node is Char {
  if (node && node.type === 'Char') {
    return typeof value === 'undefined'
      || value instanceof RegExp && value.test(node.value)
      || String(value) === node.value
  }

  return false
}

/**
 * Check node whether is digit range.
 * @param node - AST node to check.
 * @returns Is digit range or not.
 */
export function isDigitRangeNode(node: AstNode): node is CharacterClass & { expressions: [ClassRange] } {
  if (node.type === 'CharacterClass' && node.expressions.length === 1) {
    const [expression] = node.expressions

    return expression.type === 'ClassRange'
      && isCharNode(expression.from, /\d/)
      && isCharNode(expression.to, /\d/)
  }

  return false
}

/**
 * Check node whether is expression.
 * @param node - AST node to check.
 * @returns Is expression node or not.
 */
export function isExpressionNode(node: AstNode): node is Expression {
  return node.type !== 'RegExp' && node.type !== 'ClassRange' && node.type !== 'Quantifier'
}

/**
 * Parse regex from string or regex.
 * @param regex - Target regex or string.
 * @returns Parsed regex.
 */
export function parseRegex(regex: string | RegExp | AstRegExp): AstRegExp
export function parseRegex(regex: string | RegExp | AstNode): AstNode
export function parseRegex<T extends AstNode>(regex: T): T

export function parseRegex(regex: string | RegExp | AstNode) {
  return typeof regex === 'string'
    ? RegexpTree.parse(regex.replace(/^([^/])/, '/$1').replace(/([^/])$/, '$1/'))
    : regex instanceof RegExp
      ? RegexpTree.parse(regex)
      : regex
}

/**
 * Get regex from string or AST.
 * @param src - String or AST.
 * @returns RegExp.
 */
export function toRegex(src: string | AstRegExp) {
  return typeof src === 'string'
    ? new RegExp(src)
    : new RegExp(RegexpTree.generate(src.body), src.flags)
}

/**
 * Get string from regex or AST.
 * @param src - RegExp or AST.
 * @returns String.
 */
export function toString(src: string | RegExp | AstNode | null) {
  return typeof src === 'string'
    ? src
    : src instanceof RegExp
      ? src.toString()
      : RegexpTree.generate(src)
}

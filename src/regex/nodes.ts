import type {
  AstRegExp,
  Alternative,
  Expression,
  Char,
  SimpleChar,
  SpecialChar,
  ClassRange,
  CharacterClass,
  Quantifier,
  SimpleQuantifier,
  RangeQuantifier,
  CapturingGroup,
  Repetition,
  Disjunction
} from 'regexp-tree/ast'
import { concat } from '../utils/index.js'

export function AstRegExpNode(body: Expression): AstRegExp {
  return {
    type: 'RegExp',
    body,
    flags: ''
  }
}

export function AlternativeNode(
  ...expressions: (Expression | Expression[])[]
): Alternative | Expression {
  const exps = concat(expressions).filter(Boolean)

  if (exps.length === 1) {
    return exps[0]
  }

  return {
    type: 'Alternative',
    expressions: exps
  }
}

export function SimpleCharNode(value: string | number): SimpleChar {
  return {
    type: 'Char',
    kind: 'simple',
    value: String(value),
    codePoint: NaN
  }
}

export function MetaCharNode(value: string): SpecialChar {
  return {
    type: 'Char',
    kind: 'meta',
    value,
    codePoint: NaN
  }
}

export function ClassRangeNode(from: Char, to: Char): ClassRange {
  return {
    type: 'ClassRange',
    from,
    to
  }
}

export function CharacterClassNode(
  ...expressions: (Char | ClassRange | (Char | ClassRange)[])[]
): CharacterClass {
  return {
    type: 'CharacterClass',
    expressions: concat(expressions).filter(Boolean)
  }
}

export function SimpleQuantifierNode(kind: SimpleQuantifier['kind']): SimpleQuantifier {
  return {
    type: 'Quantifier',
    kind,
    greedy: true
  }
}

export function RangeQuantifierNode(from: number, to?: number): RangeQuantifier {
  return {
    type: 'Quantifier',
    kind: 'Range',
    from,
    to,
    greedy: true
  }
}

export function CapturingGroupNode(expression: Expression): CapturingGroup {
  return {
    type: 'Group',
    capturing: true,
    expression,
    number: null
  }
}

export function RepetitionNode(expression: Expression, quantifier: Quantifier): Repetition {
  return {
    type: 'Repetition',
    expression,
    quantifier
  }
}

export function DisjunctionNode(...expressions: (Expression | Expression[])[]): Disjunction | Expression {
  const exprs = concat(expressions).filter(Boolean)

  if (exprs.length === 1) {
    return exprs[0]
  }

  const disjunction: Disjunction = {
    type: 'Disjunction',
    left: null,
    right: exprs.pop()
  }

  exprs.reduceRight<Disjunction>((disjunction, expr, i) => {
    if (i === 0) {
      disjunction.left = expr

      return disjunction
    }

    disjunction.left = {
      type: 'Disjunction',
      left: null,
      right: expr
    }

    return disjunction.left
  }, disjunction)

  return disjunction
}

export function DisjunctionCapturingGroupNode(...expressions: (Expression | Expression[])[]) {
  const expr = DisjunctionNode(...expressions)

  if (expr.type === 'Disjunction') {
    return CapturingGroupNode(expr)
  }

  return expr
}

export function DigitPatternNode() {
  return MetaCharNode('\\d')
}

export function NumberPatternNode(
  quantifier: Quantifier = SimpleQuantifierNode('+')
) {
  const numberPattern = RepetitionNode(
    DigitPatternNode(),
    quantifier
  )

  return numberPattern
}

export function NumberCharsNode(value: number) {
  return AlternativeNode(
    Array.from(String(value), SimpleCharNode)
  )
}

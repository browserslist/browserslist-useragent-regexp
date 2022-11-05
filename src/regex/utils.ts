import type {
  SpecificTraversalHandlers,
  TraversalCallbacks,
  TraversalCallback,
  TraversalHandlers
} from 'regexp-tree'

export interface Visitors extends SpecificTraversalHandlers {
  every?: TraversalCallback | TraversalCallbacks
}

const classes = [
  'RegExp',
  'Disjunction',
  'Alternative',
  'Assertion',
  'Char',
  'CharacterClass',
  'ClassRange',
  'Backreference',
  'Group',
  'Repetition',
  'Quantifier'
] as const

/**
 * Create traversal visitors.
 * @param visitors
 * @returns Traversal handlers.
 */
export function visitors(visitors: Visitors): TraversalHandlers {
  const { every } = visitors

  if (!every) {
    return visitors
  }

  if (typeof every === 'function') {
    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '*': every,
      ...visitors
    }
  }

  return classes.reduce<Record<string, TraversalCallbacks>>((newVisitors, className) => {
    const visitor = visitors[className] as TraversalCallback | TraversalCallbacks
    const visitorPre = visitor
      ? 'pre' in visitor
        ? visitor.pre
        : visitor as TraversalCallback
      : null
    const visitorPost = visitor
      ? 'post' in visitor
        ? visitor.post
        : null
      : null

    newVisitors[className] = {
      pre(nodePath) {
        if (every.pre(nodePath) !== false && visitorPre) {
          return visitorPre(nodePath)
        }

        return true
      },
      post(nodePath) {
        if (every.post(nodePath) !== false && visitorPost) {
          return visitorPost(nodePath)
        }

        return true
      }
    }

    return newVisitors
  }, {})
}

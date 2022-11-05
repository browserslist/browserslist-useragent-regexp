import type {
  AstRegExp,
  AstNode
} from 'regexp-tree/ast'
import RegexpTree from 'regexp-tree'
import type {
  BrowserRegex,
  BrowserVersionedRegex
} from '../useragent/types.js'
import { clone } from '../utils/index.js'
import {
  RangedSemver,
  SemverCompareOptions,
  getRequiredSemverPartsCount
} from '../semver/index.js'
import { versionsListToRanges } from '../browsers/index.js'
import {
  parseRegex,
  AlternativeNode,
  DisjunctionCapturingGroupNode,
  visitors
} from '../regex/index.js'
import {
  getNumberPatternsPart,
  replaceNumberPatterns,
  rangedSemverToRegex
} from './utils.js'

/**
 * Apply ranged sevmers to the regex.
 * @param regex - Target regex.
 * @param versions - Ranged semvers.
 * @param options - Semver compare options.
 * @returns Regex with given versions.
 */
export function applyVersionsToRegex(
  regex: string | RegExp | AstRegExp,
  versions: RangedSemver[],
  options: SemverCompareOptions
): AstRegExp
export function applyVersionsToRegex<T extends AstNode>(
  regex: T,
  versions: RangedSemver[],
  options: SemverCompareOptions
): T

export function applyVersionsToRegex(
  regex: string | RegExp | AstNode,
  versions: RangedSemver[],
  options: SemverCompareOptions
) {
  const { allowHigherVersions } = options
  const regexAst = parseRegex(regex)
  const finalVersions = allowHigherVersions && versions.length
    ? [versions[0]]
    : versions
  const maxRequiredPartsCount = finalVersions.reduce(
    (maxRequiredPartsCount, version) => Math.max(
      maxRequiredPartsCount,
      getRequiredSemverPartsCount(version, options)
    ),
    1
  )
  const numberPatternsPart = getNumberPatternsPart(regexAst, maxRequiredPartsCount)
  const versionsPart = DisjunctionCapturingGroupNode(
    ...finalVersions.map(
      version => rangedSemverToRegex(version, options)
        .map(parts => replaceNumberPatterns(
          AlternativeNode(clone(numberPatternsPart)),
          parts,
          maxRequiredPartsCount
        ))
    )
  )

  RegexpTree.traverse(regexAst, visitors({
    every(nodePath) {
      if (!numberPatternsPart.length) {
        return false
      }

      if (nodePath.node === numberPatternsPart[0]) {
        if (numberPatternsPart.length === 1) {
          nodePath.replace(versionsPart)
        } else {
          nodePath.remove()
        }

        numberPatternsPart.shift()
      }

      return true
    }
  }))

  return regexAst
}

/**
 * Apply browser versions to info objects.
 * @param browserRegexes - Objects with requested browser version and regex.
 * @param options - Semver compare options.
 * @returns Objects with requested browser version and regex special for this version.
 */
export function applyVersionsToRegexes(
  browserRegexes: BrowserRegex[],
  options: SemverCompareOptions
): BrowserVersionedRegex[] {
  return browserRegexes.map(({
    regex: sourceRegex,
    version,
    maxVersion,
    matchedVersions,
    ...other
  }) => {
    let regexAst = parseRegex(sourceRegex)

    if (!version) {
      regexAst = applyVersionsToRegex(
        regexAst,
        versionsListToRanges(matchedVersions),
        {
          ...options,
          allowHigherVersions: !maxVersion && options.allowHigherVersions
        }
      )
    }

    return {
      regex: null,
      sourceRegex,
      regexAst,
      version,
      maxVersion,
      matchedVersions,
      ...other
    }
  })
}

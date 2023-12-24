import { describe, it } from 'vitest'
import { useragents } from '../../test/useragents.js'
import {
  getUserAgentRegex,
  getUserAgentRegexes
} from './useragentRegex.js'

function* getUserAgents() {
  const regexesCache = new Map<string, RegExp>()
  const getRegex = (query: string, allowHigherVersions = true) => {
    const key = `${query}:${allowHigherVersions}`
    let regex = regexesCache.get(key)

    if (!regex) {
      regex = getUserAgentRegex({
        browsers: query,
        allowHigherVersions,
        allowZeroSubversions: true
      })
      regexesCache.set(key, regex)
    }

    return regex
  }

  for (const useragent of useragents) {
    if (useragent.yes) {
      for (const query of useragent.yes) {
        yield {
          ua: useragent.ua,
          regex: getRegex(query, useragent.allowHigherVersions),
          query,
          allowHigherVersions: useragent.allowHigherVersions,
          should: true
        }
      }
    }

    if (useragent.no) {
      for (const query of useragent.no) {
        yield {
          ua: useragent.ua,
          regex: getRegex(query, useragent.allowHigherVersions),
          allowHigherVersions: useragent.allowHigherVersions,
          query,
          should: false
        }
      }
    }
  }
}

interface UserAgentTest {
  ua: string
  regex: RegExp
  query: string
  allowHigherVersions?: boolean
  should: boolean
}

function inspect({ query, ua, should, allowHigherVersions }: UserAgentTest) {
  const info = getUserAgentRegexes({
    browsers: query,
    allowHigherVersions,
    allowZeroSubversions: true
  })
  const message = `${should ? 'Should' : 'Should not'} matches:

Useragent: ${ua}
Query: ${query}
${info.map(_ => `
Source Regex: ${String(_.sourceRegex)}
Regex: ${String(_.regex)}`).join('')}
`

  throw new Error(message)
}

describe('UserAgentRegex', () => {
  it('should create correct regexes', () => {
    const userAgents = getUserAgents()
    let res: boolean

    for (const ua of userAgents) {
      res = ua.regex.test(ua.ua)

      if (res !== ua.should) {
        inspect(ua)
      }
    }
  })
}, 5 * 60 * 1000)

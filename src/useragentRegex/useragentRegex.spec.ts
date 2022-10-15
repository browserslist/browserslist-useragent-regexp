import { describe, it } from 'vitest'
import { useragents } from '../../test/useragents.js'
import {
  getUserAgentRegex,
  getUserAgentRegexes
} from './useragentRegex.js'

function *getUserAgents() {
  const regexesCache = new Map<string, RegExp>()
  const getRegex = (query: string) => {
    let regex = regexesCache.get(query)

    if (!regex) {
      regex = getUserAgentRegex({
        browsers: query,
        allowHigherVersions: true,
        allowZeroSubversions: true
      })
      regexesCache.set(query, regex)
    }

    return regex
  }

  for (const useragent of useragents) {
    if (useragent.yes) {
      for (const query of useragent.yes) {
        yield {
          ua: useragent.ua,
          regex: getRegex(query),
          query,
          should: true
        }
      }
    }

    if (useragent.no) {
      for (const query of useragent.no) {
        yield {
          ua: useragent.ua,
          regex: getRegex(query),
          query,
          should: false
        }
      }
    }
  }
}

function inspect(query: string, ua: string, should: boolean) {
  const info = getUserAgentRegexes({
    browsers: query,
    allowHigherVersions: true,
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
        inspect(ua.query, ua.ua, ua.should)
      }
    }
  })
}, 5 * 60 * 1000)

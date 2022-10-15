/* eslint-disable no-console */
import {
  argv,
  read,
  end,
  alias,
  option,
  readOptions
} from 'argue-cli'
import colors from 'picocolors'
import Table from 'easy-table'
import {
  getUserAgentRegex,
  getBrowsersList,
  mergeBrowserVersions,
  browserVersionsToRanges,
  getRegexesForBrowsers,
  applyVersionsToRegexes,
  optimizeAll,
  joinVersionedBrowsersRegexes,
  isAllVersion,
  defaultOptions
} from './index.js'

const {
  help,
  verbose,
  ...regexOptions
} = readOptions(
  option(alias('help', 'h'), Boolean),
  option(alias('verbose', 'v'), Boolean),
  option('ignorePatch', Boolean),
  option('ignoreMinor', Boolean),
  option('allowHigherVersions', Boolean),
  option('allowZeroVersions', Boolean)
)

if (help) {
  end()

  const optionsTable = new Table()

  optionsTable.cell('Option', 'query')
  optionsTable.cell(
    'Description',
    'Manually provide a browserslist query.'
    + ' Specifying this overrides the browserslist configuration specified in your project.'
  )
  optionsTable.newRow()

  optionsTable.cell('Option', '--help, -h')
  optionsTable.cell('Description', 'Print this message.')
  optionsTable.newRow()

  optionsTable.cell('Option', '--verbose, -v')
  optionsTable.cell('Description', 'Print additional info about regexes.')
  optionsTable.newRow()

  optionsTable.cell('Option', '--ignorePatch')
  optionsTable.cell('Description', 'Ignore differences in patch browser numbers.')
  optionsTable.cell('Default', 'true')
  optionsTable.newRow()

  optionsTable.cell('Option', '--ignoreMinor')
  optionsTable.cell('Description', 'Ignore differences in minor browser versions.')
  optionsTable.cell('Default', 'false')
  optionsTable.newRow()

  optionsTable.cell('Option', '--allowHigherVersions')
  optionsTable.cell(
    'Description',
    'For all the browsers in the browserslist query,'
    + ' return a match if the user agent version is equal to or higher than the one specified in browserslist.'
  )
  optionsTable.cell('Default', 'false')
  optionsTable.newRow()

  optionsTable.cell('Option', '--allowZeroSubversions')
  optionsTable.cell('Description', 'Ignore match of patch or patch and minor, if they are 0.')
  optionsTable.cell('Default', 'false')
  optionsTable.newRow()

  console.log(`\nbrowserslist-useragent-regexp [query] [...options]\n\n${optionsTable.toString()}`)
  process.exit(0)
}

const query = argv.length
  ? read()
  : undefined
const options = {
  browsers: query,
  ...defaultOptions,
  ...regexOptions
}

end()

if (verbose) {
  const browsersList = getBrowsersList(options)
  const mergedBrowsers = mergeBrowserVersions(browsersList)

  console.log(
    colors.blue('\n> Browserslist\n')
  )

  const browsersTable = new Table()

  mergedBrowsers.forEach((versions, browser) => {
    browsersTable.cell('Browser', colors.yellow(browser))

    versions.forEach((version, i) => {
      if (isAllVersion(version)) {
        browsersTable.cell(`Version ${i}`, version[0])
      } else {
        browsersTable.cell(`Version ${i}`, version.join('.'))
      }
    })

    browsersTable.newRow()
  })

  console.log(browsersTable.print())

  const rangedBrowsers = browserVersionsToRanges(mergedBrowsers)
  const sourceRegexes = getRegexesForBrowsers(mergedBrowsers, options)
  const versionedRegexes = applyVersionsToRegexes(sourceRegexes, rangedBrowsers, options)
  const optimizedRegexes = optimizeAll(versionedRegexes)

  console.log(
    colors.blue('\n> Regexes\n')
  )

  optimizedRegexes.forEach(({
    family,
    requestVersionsStrings,
    sourceRegex,
    version,
    minVersion,
    maxVersion,
    regex
  }) => {
    const regexesTable = new Table()

    regexesTable.cell('Name', colors.yellow('Family:'))
    regexesTable.cell('Value', family)
    regexesTable.newRow()

    regexesTable.cell('Name', colors.yellow('Versions:'))
    regexesTable.cell('Value', requestVersionsStrings.join(' '))
    regexesTable.newRow()

    regexesTable.cell('Name', colors.yellow('Source regex:'))
    regexesTable.cell('Value', sourceRegex)
    regexesTable.newRow()

    regexesTable.cell('Name', colors.yellow('Source regex fixed version:'))
    regexesTable.cell('Value', version ? version.join('.') : '...')
    regexesTable.newRow()

    let regexBrowsersVersion = ''

    if (minVersion) {
      regexBrowsersVersion = minVersion.filter(isFinite).join('.')
    } else {
      regexBrowsersVersion = '...'
    }

    regexBrowsersVersion += ' - '

    if (maxVersion) {
      regexBrowsersVersion += maxVersion.filter(isFinite).join('.')
    } else {
      regexBrowsersVersion += '...'
    }

    regexesTable.cell('Name', colors.yellow('Source regex browsers versions:'))
    regexesTable.cell('Value', regexBrowsersVersion)
    regexesTable.newRow()

    regexesTable.cell('Name', colors.yellow('Versioned regex:'))
    regexesTable.cell('Value', regex)
    regexesTable.newRow()

    console.log(`${regexesTable.print()}\n`)
  })

  const regexStr = joinVersionedBrowsersRegexes(optimizedRegexes)
  const regex = new RegExp(regexStr)

  console.log(regex)
  process.exit(0)
}

console.log(
  getUserAgentRegex(options)
)

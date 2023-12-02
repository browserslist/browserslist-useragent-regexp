# browserslist-useragent-regexp

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]
[![Documentation badge][documentation]][documentation-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/browserslist-useragent-regexp.svg
[npm-url]: https://npmjs.com/package/browserslist-useragent-regexp

[node]: https://img.shields.io/node/v/browserslist-useragent-regexp.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/browserslist-useragent-regexp
[deps-url]: https://libraries.io/npm/browserslist-useragent-regexp/tree

[size]: https://packagephobia.com/badge?p=browserslist-useragent-regexp
[size-url]: https://packagephobia.com/result?p=browserslist-useragent-regexp

[build]: https://img.shields.io/github/actions/workflow/status/browserslist/browserslist-useragent-regexp/tests.yml?branch=master
[build-url]: https://github.com/browserslist/browserslist-useragent-regexp/actions

[coverage]: https://img.shields.io/codecov/c/github/browserslist/browserslist-useragent-regexp.svg
[coverage-url]: https://app.codecov.io/gh/browserslist/browserslist-useragent-regexp

[documentation]: https://img.shields.io/badge/API-Documentation-2b7489.svg
[documentation-url]: https://browserslist.github.io/browserslist-useragent-regexp

A utility to compile [browserslist query](https://github.com/browserslist/browserslist#queries) to a regex to test browser useragent. Simplest example: you can detect supported browsers on client-side.

1) Create `.browserslistrc` config, for example like this:

```
last 2 versions
not dead
```

2) Add script to `package.json`:

```json
{
  "scripts": {
    "supportedBrowsers": "echo \"export default $(browserslist-useragent-regexp --allowHigherVersions);\" > supportedBrowsers.js"
  }
}
```

<details>
  <summary>for Windows users</summary>

```json
{
  "scripts": {
    "supportedBrowsers": "(echo export default && browserslist-useragent-regexp --allowHigherVersions) > supportedBrowsers.js"
  }
}
```

</details>

3) Run this script, to compile regex:

```bash
pnpm supportedBrowsers
# or
npm run supportedBrowsers
# or
yarn supportedBrowsers
```

`supportedBrowsers.js`:

```js
export default /Edge?\/(10[5-9]|1[1-9]\d|[2-9]\d\d|\d{4,})(\.\d+|)(\.\d+|)|Firefox\/(10[4-9]|1[1-9]\d|[2-9]\d\d|\d{4,})\.\d+(\.\d+|)|Chrom(ium|e)\/(10[5-9]|1[1-9]\d|[2-9]\d\d|\d{4,})\.\d+(\.\d+|)|Maci.* Version\/(15\.([6-9]|\d{2,})|(1[6-9]|[2-9]\d|\d{3,})\.\d+)([,.]\d+|)( Mobile\/\w+|) Safari\/|Chrome.+OPR\/(9\d|\d{3,})\.\d+\.\d+|(CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS|CPU iPad OS)[ +]+(15[._]([6-9]|\d{2,})|(1[6-9]|[2-9]\d|\d{3,})[._]\d+)([._]\d+|)|Opera Mini|Android:?[ /\-](10[6-9]|1[1-9]\d|[2-9]\d{2}|\d{4,})(\.\d+|)(\.\d+|)|Mobile Safari.+OPR\/(6[4-9]|[7-9]\d|\d{3,})\.\d+\.\d+|Android.+Firefox\/(10[5-9]|1[1-9]\d|[2-9]\d\d|\d{4,})\.\d+(\.\d+|)|Android.+Chrom(ium|e)\/(10[6-9]|1[1-9]\d|[2-9]\d\d|\d{4,})\.\d+(\.\d+|)|Android.+(UC? ?Browser|UCWEB|U3)[ /]?(13\.([4-9]|\d{2,})|(1[4-9]|[2-9]\d|\d{3,})\.\d+)\.\d+|SamsungBrowser\/(1[7-9]|[2-9]\d|\d{3,})\.\d+|Android.+MQQBrowser\/(13(\.([1-9]|\d{2,})|)|(1[4-9]|[2-9]\d|\d{3,})(\.\d+|))(\.\d+|)|K[Aa][Ii]OS\/(2\.([5-9]|\d{2,})|([3-9]|\d{2,})\.\d+)(\.\d+|)/;
```

4) Import regex from created file:

```js
import supportedBrowsers from './supportedBrowsers.js';

if (supportedBrowsers.test(navigator.userAgent)) {
  alert('Your browser is supported.');
}
```

## Install

```bash
pnpm add -D browserslist-useragent-regexp
# or
npm i -D browserslist-useragent-regexp
# or
yarn add -D browserslist-useragent-regexp
```

## Why?

As was written in article ["Smart Bundling: Shipping legacy code to only legacy browsers"](https://www.smashingmagazine.com/2018/10/smart-bundling-legacy-code-browsers/): you can determinate, which bundle you should give to browser from server with [`browserslist-useragent`](https://github.com/browserslist/browserslist-useragent). But in this case you must have your own server with special logic. Now, with `browserslist-useragent-regexp`, you can move that to client-side.

Development was inspired by [this proposal from Mathias Bynens](https://twitter.com/mathias/status/1105857829393653761).

How to make differential resource loading and other optimizations with `browserslist-useragent-regexp` you can read in article ["Speed up with Browserslist"](https://dev.to/dangreen/speed-up-with-browserslist-30lh).

[Demo](https://browserslist.github.io/browserslist-useragent-regexp/demo.html) ([sources](https://github.com/browserslist/browserslist-useragent-regexp/blob/7cf6afb7da2b6c77179abb8b8bd1bbcb61cf376a/docs/demo.html#L17-L29), [build script](https://github.com/browserslist/browserslist-useragent-regexp/blob/7cf6afb7da2b6c77179abb8b8bd1bbcb61cf376a/examples/buildDemo.js#L61-L74)).

Also, testing useragents using generated regex [is faster](https://gist.github.com/dangreen/55c41072d8891efd3a772a4739d6cd9d) than using the `matchesUA` method from browserslist-useragent.

## CLI

```bash
pnpm browserslist-useragent-regexp [query] [...options]
# or
npx browserslist-useragent-regexp [query] [...options]
# or
yarn exec -- browserslist-useragent-regexp [query] [...options]
```

Also, short alias is available:

```bash
pnpm bluare [query] [...options]
```

| Option | Description | Default |
|--------|-------------|---------|
| query | Manually provide a browserslist query. Specifying this overrides the browserslist configuration specified in your project. | |
| &#x2011;&#x2011;help, -h | Print this message. | |
| &#x2011;&#x2011;verbose, -v | Print additional info about regexes. | |
| &#x2011;&#x2011;ignorePatch | Ignore differences in patch browser numbers. | `true` |
| &#x2011;&#x2011;ignoreMinor | Ignore differences in minor browser versions. | `false` |
| &#x2011;&#x2011;allowHigherVersions | For all the browsers in the browserslist query, return a match if the useragent version is equal to or higher than the one specified in browserslist. | `false` |
| &#x2011;&#x2011;allowZeroSubversions | Ignore match of patch or patch and minor, if they are 0. | `false` |

## JS API basics

Module exposes two main methods:

### [getUserAgentRegexes(options)](https://browserslist.github.io/browserslist-useragent-regexp/functions/getUserAgentRegexes.html)

Compile browserslist query to [regexes for each browser](#regex-info-object).

### [getUserAgentRegex(options)](https://browserslist.github.io/browserslist-useragent-regexp/functions/getUserAgentRegex.html)

Compile browserslist query to one regex.

> [Description of all methods you can find in Documentation.](https://browserslist.github.io/browserslist-useragent-regexp/index.html)

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| browsers | `string \| string[]` | — | Manually provide a browserslist query (or an array of queries). Specifying this overrides the browserslist configuration specified in your project. |
| ignorePatch | `boolean` | `true` | Ignore differences in patch browser numbers. |
| ignoreMinor | `boolean` | `false` | Ignore differences in minor browser versions. |
| allowHigherVersions | `boolean` | `false` | For all the browsers in the browserslist query, return a match if the useragent version is equal to or higher than the one specified in browserslist. |
| allowZeroSubversions | `boolean` | `false` | Ignore match of patch or patch and minor, if they are 0. |

Any of the [`browserslist` API options](https://github.com/browserslist/browserslist#js-api) may also be provided.

#### Regex info object

| Property | Type | Description |
|----------|------|-------------|
| family | `string` | Browser family. |
| requestVersions | `[number, number, number][]` | Versions provided by browserslist. |
| regex | `RegExp` | Regex to match useragent with family and versions. |
| sourceRegex | `RegExp` | Original useragent regex, without versions. |
| version | `[number, number, number] \| null` | Useragent version of regex. |
| minVersion | `[number, number, number] \| null` | Useragent min version of regex. |
| maxVersion | `[number, number, number] \| null` | Useragent max version of regex. |

## Other

- [Supported browsers](https://github.com/browserslist/browserslist-useragent#supported-browsers)
- [Notes](https://github.com/browserslist/browserslist-useragent#notes)
- [When querying for modern browsers](https://github.com/browserslist/browserslist-useragent#when-querying-for-modern-browsers)

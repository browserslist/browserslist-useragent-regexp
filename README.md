
# browserslist-useragent-regexp

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependency status][deps]][deps-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]
[![Greenkeeper badge][greenkeeper]][greenkeeper-url]

[npm]: https://img.shields.io/npm/v/browserslist-useragent-regexp.svg
[npm-url]: https://www.npmjs.com/package/browserslist-useragent-regexp

[node]: https://img.shields.io/node/v/browserslist-useragent-regexp.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/david/TrigenSoftware/browserslist-useragent-regexp.svg
[deps-url]: https://david-dm.org/TrigenSoftware/browserslist-useragent-regexp

[build]: http://img.shields.io/travis/com/TrigenSoftware/browserslist-useragent-regexp.svg
[build-url]: https://travis-ci.com/TrigenSoftware/browserslist-useragent-regexp

[coverage]: https://img.shields.io/coveralls/TrigenSoftware/browserslist-useragent-regexp.svg
[coverage-url]: https://coveralls.io/r/TrigenSoftware/browserslist-useragent-regexp

[greenkeeper]: https://badges.greenkeeper.io/TrigenSoftware/browserslist-useragent-regexp.svg
[greenkeeper-url]: https://greenkeeper.io/

A utility to compile [browserslist query](https://github.com/browserslist/browserslist#queries) to a RegExp. Simplest example: you can detect "dead" browsers on client-side.

1) Add script to `package.json`:

```json
{
  "scripts": {
    "deadBrowsers": "echo \"module.exports = $(browserslist-useragent-regexp 'dead');\" > deadBrowsers.js"
  }
}
```

2) Run this script, to compile RegExp:

```bash
$ npm run deadBrowsers
# or
$ yarn deadBrowsers
```

3) Import RegExp from created file:

```js
const deadBrowsers = require('./deadBrowsers');

if (deadBrowsers.test(navigator.userAgent)) {
    alert('Your browser is dead');
}
```

## Install

```bash
npm i -D browserslist-useragent-regexp
# or
yarn add -D browserslist-useragent-regexp
```

## Why?

As was written in article ["Smart Bundling: Shipping legacy code to only legacy browsers"](https://www.smashingmagazine.com/2018/10/smart-bundling-legacy-code-browsers/): you can determinate, which bundle you should give to browser from server with [`browserslist-useragent`](https://github.com/browserslist/browserslist-useragent). But in this case you must have your own server with special logic. Now, with `browserslist-useragent-regexp`, you can move that to client-side.

Development was inspired by [this proposal from Mathias Bynens](https://twitter.com/mathias/status/1105857829393653761).

[Demo](https://trigensoftware.github.io/browserslist-useragent-regexp/demo.html) ([sources](https://github.com/TrigenSoftware/browserslist-useragent-regexp/blob/7cf6afb7da2b6c77179abb8b8bd1bbcb61cf376a/docs/demo.html#L17-L29), [build script](https://github.com/TrigenSoftware/browserslist-useragent-regexp/blob/7cf6afb7da2b6c77179abb8b8bd1bbcb61cf376a/examples/buildDemo.js#L61-L74)).

## CLI

```bash
npx browserslist-useragent-regexp [query] [...options]
# or
yarn exec -- browserslist-useragent-regexp [query] [...options]
```

| Option | Description | Default |
|--------|-------------|---------|
| query | Manually provide a browserslist query. Specifying this overrides the browserslist configuration specified in your project. | |
| &#x2011;&#x2011;help, -h | Print this message. | |
| &#x2011;&#x2011;verbose, -v | Print additional info about RegExps. | |
| &#x2011;&#x2011;ignorePatch | Ignore differences in patch browser numbers. | `true` |
| &#x2011;&#x2011;ignoreMinor | Ignore differences in minor browser versions. | `false` |
| &#x2011;&#x2011;allowHigherVersions | For all the browsers in the browserslist query, return a match if the user agent version is equal to or higher than the one specified in browserslist. | `false` |
| &#x2011;&#x2011;allowZeroSubverions | Ignore match of patch or patch and minor, if they are 0. | `false` |

## JS API basics

Module exposes two main methods:

### [getUserAgentRegExps(options)](https://trigensoftware.github.io/browserslist-useragent-regexp/modules/_useragentregexp_useragentregexp_.html#getuseragentregexps)

Compile browserslist query to [RegExps for each browser](#regexp-info-object).

### [getUserAgentRegExp(options)](https://trigensoftware.github.io/browserslist-useragent-regexp/modules/_useragentregexp_useragentregexp_.html#getuseragentregexp)

Compile browserslist query to one RegExp.

> [Description of all methods you can find in Documentation.](https://trigensoftware.github.io/browserslist-useragent-regexp/index.html)

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| browsers | `string \| string[]` | — | Manually provide a browserslist query (or an array of queries). Specifying this overrides the browserslist configuration specified in your project. |
| env | `string` | — | When multiple browserslist [environments](https://github.com/ai/browserslist#environments) are specified, pick the config belonging to this environment. |
| ignorePatch | `boolean` | `true` | Ignore differences in patch browser numbers. |
| ignoreMinor | `boolean` | `false` | Ignore differences in minor browser versions. |
| allowHigherVersions | `boolean` | `false` | For all the browsers in the browserslist query, return a match if the user agent version is equal to or higher than the one specified in browserslist. |
| allowZeroSubverions | `boolean` | `false` | Ignore match of patch or patch and minor, if they are 0. |

#### RegExp info object

| Property | Type | Description |
|----------|------|-------------|
| family | `string` | Browser family. |
| requestVersions | `[number, number, number][]` | Versions provided by browserslist. |
| regExp | `RegExp` | RegExp to match user agent with family and versions. |
| sourceRegExp | `RegExp` | Original user agent RegExp, without versions. |
| resultVersion | `[number, number, number] \| null` | User agent version of RegExp. |

## Other

- [Supported browsers](https://github.com/browserslist/browserslist-useragent#supported-browsers)
- [Notes](https://github.com/browserslist/browserslist-useragent#notes)
- [When querying for modern browsers](https://github.com/browserslist/browserslist-useragent#when-querying-for-modern-browsers)

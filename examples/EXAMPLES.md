# EXAMPLES

## Supported browsers

1) Create `.browserslistrc` config, for example like this:

```
last 2 versions
not dead
```

2) Add script to `package.json`:

```json
{
  "scripts": {
    "supportedBrowsers": "echo \"module.exports = $(browserslist-useragent-regexp --allowHigherVersions);\" > supportedBrowsers.js"
  }
}
```

3) Run this script, to compile RegExp:

```bash
npm run supportedBrowsers
# or
yarn supportedBrowsers
```

4) Import RegExp from created file:

```js
const supportedBrowsers = require('./supportedBrowsers');

if (supportedBrowsers.test(navigator.userAgent)) {
    alert('Your browser is supported.');
}
```

## Unsupported browsers

1) Create `.browserslistrc` config, for example with [environments](https://github.com/browserslist/browserslist#environments), like this:

```
[production]
last 2 versions
not dead

[unsupported]
dead
```

2) Add script to `package.json`:

```json
{
  "scripts": {
    "supportedBrowsers": "echo \"module.exports = $(BROWSERSLIST_ENV=unsupported browserslist-useragent-regexp);\" > supportedBrowsers.js"
  }
}
```

3) Run this script, to compile RegExp:

```bash
npm run supportedBrowsers
# or
yarn supportedBrowsers
```

4) Import RegExp from created file:

```js
const unsupportedBrowsers = require('./unsupportedBrowsers');

if (unsupportedBrowsers.test(navigator.userAgent)) {
    alert('Your browser is unsupported.');
}
```

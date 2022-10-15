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
    "supportedBrowsers": "echo \"export default $(browserslist-useragent-regexp --allowHigherVersions);\" > supportedBrowsers.js"
  }
}
```

3) Run this script, to compile regex:

```bash
npm run supportedBrowsers
# or
yarn supportedBrowsers
```

4) Import regex from created file:

```js
import supportedBrowsers from './supportedBrowsers.js';

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
    "supportedBrowsers": "echo \"export default $(BROWSERSLIST_ENV=unsupported browserslist-useragent-regexp);\" > supportedBrowsers.js"
  }
}
```

3) Run this script, to compile regex:

```bash
npm run supportedBrowsers
# or
yarn supportedBrowsers
```

4) Import regex from created file:

```js
import unsupportedBrowsers from './unsupportedBrowsers.js';

if (unsupportedBrowsers.test(navigator.userAgent)) {
    alert('Your browser is unsupported.');
}
```

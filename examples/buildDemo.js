import {
  getUserAgentRegexes,
  getUserAgentRegex
} from '../dist/index.js'

function versionsToString(versions) {
  return versions.map(_ => (
    _[0] === Infinity
      ? 'all'
      : _.join('.')
  )).join(' ')
}

function renderStyles() {
  return `<style>
body {
  font-family:
    /* Safari for OS X and iOS (San Francisco) */
    -apple-system,
    /* Chrome < 56 for OS X (San Francisco) */
    BlinkMacSystemFont,
    /* Windows */
    'Segoe UI',
    /* Android */
    Roboto,
    /* Basic web fallback */
    'Helvetica Neue',
    Arial,
    sans-serif,
    /* Emoji fonts */
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol';
}

pre {
  font-family:
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    'Liberation Mono',
    'Courier New',
    monospace;
}

h2 > pre {
  display: inline;
}

h2 > input {
  vertical-align: middle;
}

table {
  width: 100%;
}

th, td {
  text-align: left;
}

</style>`
}

function renderScript() {
  const modernBrowsers = getUserAgentRegex({
    browsers: 'last 3 years and not dead',
    allowHigherVersions: true
  })
  const actualBrowsers = getUserAgentRegex({
    browsers: 'last 6 years and not dead',
    allowHigherVersions: true
  })

  return `<script id="browserslist-loader">
    var host = document.getElementById('browserslist-loader').parentElement;
    var scripts = [
      [
        ['defer', 'defer']
      ]
    ];

    function load(attrs, src) {

      var script = document.createElement('script');
      var len = attrs.length;

      for (var i = 0; i < len; i++) {
        script.setAttribute(attrs[i][0], attrs[i][1]);
      }

      script.setAttribute('src', src);
      host.appendChild(script);
    }

    switch (true) {

      case ${modernBrowsers}.test(navigator.userAgent):
        load(scripts[0], 'demojs/index.modern.js');
        break;

      case ${actualBrowsers}.test(navigator.userAgent):
        load(scripts[0], 'demojs/index.actual.js');
        break;

      default:
        load(scripts[0], 'demojs/index.old.js');
    }
  </script>`
}

function renderHtml(body) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, minimal-ui">
    <meta name="format-detection" content="telephone=no">
    <title>DEMO</title>
    <style>
      td, th {
        padding: .5em 0
      }

      pre {
        margin: 0
      }

      .last th,
      .last td {
        padding-bottom: 1.5em
      }
    </style>
    ${renderScript()}
    ${renderStyles()}
  </head>
  <body>
    ${body}
  </body>
</html>`
}

function renderUserAgentRegex({
  family,
  sourceRegex,
  regex,
  requestVersions,
  matchedVersions,
  version,
  minVersion,
  maxVersion
}, query) {
  const regexString = regex.toString()
  const sourceRegexString = sourceRegex.toString()
  const requestVersionsString = versionsToString(requestVersions)
  const matchedVersionsString = versionsToString(matchedVersions)
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

  return `<tr data-group-family="${query} ${family}">
    <th rowspan="6" valign="top">
      <input type="checkbox" onclick="return false" readonly data-family="${family}" data-for-query="${query}" data-regex="${regexString.replace(/^\/|\/$/g, '').replace(/([^\\])"/g, '$1\\"')}">
    </th>
    <th>Family:</th>
    <td>${family}</td>
  </tr>
  <tr data-group-family="${query} ${family}">
    <th>Versions:</th><td>${requestVersionsString}</td>
  </tr>
  <tr data-group-family="${query} ${family}">
    <th>Matched versions:</th><td>${matchedVersionsString}</td>
  </tr>
  <tr data-group-family="${query} ${family}">
    <th>Source regex:</th><td><pre>${sourceRegexString}</pre></td>
  </tr>
  <tr data-group-family="${query} ${family}">
    <th>${version ? 'Source regex fixed browser version' : 'Source regex browsers versions'}:</th><td>${version ? version.join('.') : regexBrowsersVersion}</td>
  </tr>
  <tr data-group-family="${query} ${family}" class="last">
    <th>Versioned regex:</th><td><pre>${regexString}</pre></td>
  </tr>`
}

function renderQuery(query) {
  const result = getUserAgentRegexes({
    browsers: query,
    allowHigherVersions: true
  })

  return `<thead data-group-query="${query}">
    <tr>
      <th>
        <input type="checkbox" onclick="return false" readonly data-query="${query}">
      </th>
      <th collspan="2">
        <h2>
          <pre>${query}</pre>
        </h2>
      </th>
    </tr>
  </thead>
  <tbody data-group-query="${query}">
    ${result.map(_ => renderUserAgentRegex(_, query)).join('\n')}
  </tbody>`
}

function render(queries) {
  return renderHtml(`<h1>browserslist-useragent-regexp demo</h1>
<table>
  <tr>
    <th>Useragent:</th>
    <td id="useragent"></td>
  <tr>
    <th>Options:</th>
    <td>
      <pre>{
  allowHigherVersions: true
}</pre>
    </td>
  </tr>
</table>
<table>
  ${queries.map(_ => renderQuery(_)).join('\n')}
</table>`)
}

console.log(render(['dead', 'defaults']))

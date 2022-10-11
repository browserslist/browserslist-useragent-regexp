const {
  getUserAgentRegExps,
  getUserAgentRegExp
} = require('../lib')

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
  const modernBrowsers = getUserAgentRegExp({
    browsers: 'last 2 versions and last 1 year',
    allowHigherVersions: true,
    allowZeroSubverions: true
  })
  const actualBrowsers = getUserAgentRegExp({
    browsers: 'last 2 years and not last 2 versions',
    allowHigherVersions: true,
    allowZeroSubverions: true
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
    ${renderScript()}
    ${renderStyles()}
  </head>
  <body>
    ${body}
  </body>
</html>`
}

function renderUserAgentRegExp({
  family,
  sourceRegExpString,
  regExpString,
  requestVersionsStrings,
  resultFixedVersion,
  resultMinVersion,
  resultMaxVersion
}, query) {
  let regExpBrowsersVersion = ''

  if (resultMinVersion) {
    regExpBrowsersVersion = resultMinVersion.join('.')
  } else {
    regExpBrowsersVersion = '...'
  }

  regExpBrowsersVersion += ' - '

  if (resultMaxVersion) {
    regExpBrowsersVersion += resultMaxVersion.join('.')
  } else {
    regExpBrowsersVersion += '...'
  }

  return `<li>
  <input type="checkbox" onclick="return false" readonly data-for-query="${query}" data-regexp="${regExpString.replace(/([^\\])"/g, '$1\\"')}">
  <table>
    <tr>
      <th>Family:</th><td>${family}</td>
    </tr>
    <tr>
      <th>Versions:</th><td>${requestVersionsStrings.join(' ')}</td>
    </tr>
    <tr>
      <th>Source RegExp:</th><td><pre>${sourceRegExpString}</pre></td>
    </tr>
    <tr>
      <th>Source RegExp fixed version:</th><td>${resultFixedVersion ? resultFixedVersion.join('.') : '...'}</td>
    </tr>
    <tr>
      <th>Source RegExp browsers versions:</th><td>${regExpBrowsersVersion}</td>
    </tr>
    <tr>
      <th>Versioned RegExp:</th><td><pre>${regExpString}</pre></td>
    </tr>
  </table>
</li>`
}

function renderQuery(query) {
  const result = getUserAgentRegExps({
    browsers: query,
    allowHigherVersions: true,
    allowZeroSubverions: true
  })

  return `<div>
  <h2>
    <input type="checkbox" onclick="return false" readonly data-query="${query}">
    <pre>${query}</pre>
  </h2>
  <ul>
    ${result.map(_ => renderUserAgentRegExp(_, query)).join('\n')}
  </ul>
</div>`
}

function render(queries) {
  return renderHtml(`<h1>browserslist-useragent-regexp demo</h1>
<table>
  <tr>
    <th>UserAgent:</th>
    <td id="useragent"></td>
  <tr>
    <th>Options:</th>
    <td>
      <pre>{
  allowHigherVersions: true,
  allowZeroSubverions: true
}</pre>
    </td>
  </tr>
</table>
<div>
  ${queries.map(_ => renderQuery(_)).join('\n')}
</div>`)
}

console.log(render(['defaults', 'dead']))

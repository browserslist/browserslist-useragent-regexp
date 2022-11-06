/* eslint-disable */

function forEach(elements, handler) {
  for (var i = 0, len = elements.length; i < len; i++) {
    handler(elements[i]);
  }
}

function findByAttribute(attribute, value) {
  var hasValue = typeof value !== 'undefined';

  if (typeof document.querySelectorAll === 'function') {
    return document.querySelectorAll(
      hasValue
        ? '[' + attribute + '=' + value + ']'
        : '[' + attribute + ']'
    );
  }

  var result = [];

  forEach(document.all, function (element) {
    if (!hasValue && element.hasAttribute(attribute)
      || hasValue && element.getAttribute(attribute) === value
    ) {
      result.push(element);
    }
  });

  return result;
}

function elevateElements(elements) {
  var firstElement = elements[0]
  var root = elements[0].parentElement
  var firstRootElement = root.children[0]

  if (firstElement === firstRootElement) {
    return
  }

  var fragment = document.createDocumentFragment()

  forEach(elements, function (element) {
    fragment.appendChild(element)
  })

  root.insertBefore(fragment, firstRootElement)
}

document.getElementById('useragent').innerText = navigator.userAgent;

forEach(findByAttribute('data-query'), function (input) {
  var query = input.getAttribute('data-query');
  var some = false;

  forEach(findByAttribute('data-for-query', query), function (input) {
    var regex = input.getAttribute('data-regex')
    var family = input.getAttribute('data-family')
    var checked = new RegExp(regex).test(navigator.userAgent);

    input.checked = checked;
    some = some || checked;

    if (checked) {
      elevateElements(
        findByAttribute('data-group-family', query + ' ' + family)
      )
    }
  });

  input.checked = some;

  if (some) {
    elevateElements(
      findByAttribute('data-group-query', query)
    )
  }
});

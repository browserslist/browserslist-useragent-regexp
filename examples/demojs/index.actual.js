/* eslint-disable */

function elevateElements(elements) {
  var firstElement = elements[0]
  var root = elements[0].parentElement
  var firstRootElement = root.firstElementChild

  if (firstElement === firstRootElement) {
    return
  }

  var fragment = document.createDocumentFragment()

  elements.forEach(function (element) {
    fragment.append(element)
  })

  root.insertBefore(fragment, firstRootElement)
}

document.getElementById('useragent').innerText = navigator.userAgent

Array.from(document.querySelectorAll('[data-query]')).forEach(function (input) {
  var query = input.dataset.query
  var some = false

  Array.from(document.querySelectorAll('[data-for-query="' + query + '"]')).forEach(function (input) {
    var regex = input.dataset.regex
    var family = input.dataset.family
    var checked = new RegExp(regex).test(navigator.userAgent)

    input.checked = checked
    some = some || checked

    if (checked) {
      elevateElements(
        document.querySelectorAll('[data-group-family="' + query + ' ' + family + '"]')
      )
    }
  })

  input.checked = some

  if (some) {
    elevateElements(
      document.querySelectorAll('[data-group-query="' + query + '"]')
    )
  }
})

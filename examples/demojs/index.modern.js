/* eslint-disable */

function elevateElements(elements) {
  const firstElement = elements[0]
  const root = elements[0].parentElement
  const firstRootElement = root.firstElementChild

  if (firstElement === firstRootElement) {
    return
  }

  const fragment = document.createDocumentFragment()

  elements.forEach((element) => {
    fragment.append(element)
  })

  root.insertBefore(fragment, firstRootElement)
}

document.getElementById('useragent').innerText = navigator.userAgent

document.querySelectorAll('[data-query]').forEach((input) => {
  const { query } = input.dataset
  let some = false

  document.querySelectorAll(`[data-for-query=${query}]`).forEach((input) => {
    const { regex, family } = input.dataset
    const checked = new RegExp(regex).test(navigator.userAgent)

    input.checked = checked
    some = some || checked

    if (checked) {
      elevateElements(
        document.querySelectorAll(`[data-group-family=${family}]`)
      )
    }
  })

  input.checked = some

  if (some) {
    elevateElements(
      document.querySelectorAll(`[data-group-query=${query}]`)
    )
  }
})

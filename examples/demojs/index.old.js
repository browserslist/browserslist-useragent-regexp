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

document.getElementById('useragent').innerText = navigator.userAgent;

forEach(findByAttribute('data-query'), function (input) {

	var queryDiv = input.parentElement.parentElement;
	var queriesDiv = queryDiv.parentElement;
	var query = input.getAttribute('data-query');
	var some = false;

	forEach(findByAttribute('data-for-query', query), function (input) {

		var li = input.parentElement;
		var ul = li.parentElement;
		var checked = new RegExp(input.getAttribute('data-regexp')).test(navigator.userAgent);

		input.checked = checked;
		some = some || checked;

		if (checked) {
			ul.insertBefore(li, ul.children[0]);
		}
	});

	input.checked = some;

	if (some) {
		queriesDiv.insertBefore(queryDiv, queriesDiv.children[0]);
	}
});

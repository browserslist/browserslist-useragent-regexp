/* eslint-disable import/unambiguous, no-var, prefer-template, prefer-arrow-callback, func-names */
/* eslint-env browser */

document.getElementById('useragent').innerText = navigator.userAgent;

Array.from(document.querySelectorAll('[data-query]')).forEach(function (input) {

	var queryDiv = input.parentElement.parentElement;
	var queriesDiv = queryDiv.parentElement;
	var query = input.dataset.query;
	var some = false;

	Array.from(document.querySelectorAll('[data-for-query=' + query + ']')).forEach(function (input) {

		var li = input.parentElement;
		var ul = li.parentElement;
		var checked = new RegExp(input.dataset.regexp).test(navigator.userAgent);

		input.checked = checked;
		some = some || checked;

		if (checked) {
			ul.insertBefore(li, ul.firstElementChild);
		}
	});

	input.checked = some;

	if (some) {
		queriesDiv.insertBefore(queryDiv, queriesDiv.firstElementChild);
	}
});

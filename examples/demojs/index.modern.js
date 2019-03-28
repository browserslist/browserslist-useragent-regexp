/* eslint-disable import/unambiguous */
/* eslint-env browser */

document.getElementById('useragent').innerText = navigator.userAgent;

document.querySelectorAll('[data-query]').forEach((input) => {

	const queryDiv = input.parentElement.parentElement;
	const queriesDiv = queryDiv.parentElement;
	const query = input.dataset.query;
	let some = false;

	document.querySelectorAll(`[data-for-query=${query}]`).forEach((input) => {

		const li = input.parentElement;
		const ul = li.parentElement;
		const checked = new RegExp(input.dataset.regexp).test(navigator.userAgent);

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

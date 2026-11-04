/**
 * Save permanences to local storage
 * @return {[type]} [description]
 */
(function () {
	var s = localStorage;
	var permanences = s.getItem('permanences');

	if (typeof permanences == 'string') {
		permanences = JSON.parse(permanences);
	}

	if (typeof permanences != 'object' || permanences === null) {
		permanences = {};
	}

	// Delete permanences
	if (a = document.querySelector('[data-delete-permanences]')) {
		var key = a.dataset.deletepermanences;

		if (permanences.hasOwnProperty(key)) {
			delete permanences[key];
			s.setItem('permanences', JSON.stringify(permanences));
		}
	}
	// Append permanences
	else if (a = document.querySelector('[data-new-permanences]')) {
		var data = JSON.parse(a.dataset.newpermanences);
		permanences[data.key] = data;
		s.setItem('permanences', JSON.stringify(permanences));
		return;
	}

	if (!Object.keys(permanences).length) {
		return;
	}

	const escape = (unsafe) => {
		return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
	};

	const tpl = document.getElementById('permanences');

	Object.values(permanences).forEach((b) => {
		if (b.date <= Math.floor(Date.now() / 1000)) {
			// permanences is old, delete it
			delete permanences[b.key];
			s.setItem('permanences', JSON.stringify(permanences));
		}

		let html = tpl.innerHTML;

		html = html.replace(/#(\w+)#/g, (_, m) => escape(b[m] ?? ''));
		tpl.parentNode.insertAdjacentHTML('beforeend', html);
	});
})();

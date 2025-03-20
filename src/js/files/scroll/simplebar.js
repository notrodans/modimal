// Connecting plugin from node_modules
import SimpleBar from "simplebar";
// Connecting styles from node_modules
import "simplebar/dist/simplebar.css";

// Add data-simplebar attribute to block

// Can also be initialized with the following code, applying settings
/*
if (document.querySelectorAll('[data-simplebar]').length) {
	document.querySelectorAll('[data-simplebar]').forEach(scrollBlock => {
		new SimpleBar(scrollBlock, {
			autoHide: false
		});
	});
}
*/

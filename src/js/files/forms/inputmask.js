/* Input masks (in progress) */

// Connecting the list of active modules
import { flsModules } from "../modules.js";

// Connecting the module
import "inputmask/dist/inputmask.min.js";

const inputMasks = document.querySelectorAll("input");
if (inputMasks.length) {
	flsModules.inputmask = Inputmask().mask(inputMasks);
}

import { isMobile, FLS } from "./functions.js";
// Connecting the list of active modules
import { flsModules } from "./modules.js";

// Connecting from node_modules
import tippy from "tippy.js";

// Connecting styles from src/scss/libs
import "../../scss/libs/tippy.scss";
// Connecting styles from node_modules
//import 'tippy.js/dist/tippy.css';

// Launching and adding to the object of modules
flsModules.tippy = tippy("[data-tippy-content]", {});

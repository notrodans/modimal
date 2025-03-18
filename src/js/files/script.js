// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules.js";

const header = document.querySelector(".header");

function updateHeight() {
  if(header) {
    const headerHeight = header.offsetHeight;
    document.body.style.setProperty("--header-height", `${headerHeight / 16}rem`);
  }
}

document.addEventListener("DOMContentLoaded", updateHeight);

const observer = new ResizeObserver(updateHeight);
if (header) {
	observer.observe(header);
}

const queryParams = new URLSearchParams(location.search);
const searchField = document.querySelector(".search-block__input");

if (searchField) {
  searchField.value = queryParams.get("search") || "";
}

for (const checkbox of document.querySelectorAll(".spollers-filters-form__input")) {
  if (checkbox.name && queryParams.has(checkbox.name)) {
    checkbox.checked = queryParams.getAll(checkbox.name).includes(checkbox.value);
  }
}

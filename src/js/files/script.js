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
  searchField.value = queryParams.get("q") || "";
}

for (const checkbox of document.querySelectorAll(".spollers-filters-form__input")) {
  if (checkbox.name && queryParams.has(checkbox.name)) {
    checkbox.checked = queryParams.getAll(checkbox.name).includes(checkbox.value);
  }
}

document.addEventListener('click', ({ target }) => {
  if (target.matches('[class*="__unhide"]')) {
    const input = target.closest('.password-block').querySelector('.password-block__input');
    input.type = input.type === "password" ? 'text' : 'password';
  }
});

// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules.js";

const header = document.querySelector('.header');

function updateHeaderHeight() {
  if (!header) return;

  const height = header.offsetHeight;
  document.body.style.setProperty('--header-height', `${height}px`);
}

document.addEventListener('DOMContentLoaded', updateHeaderHeight);

const headerObserver = new ResizeObserver(updateHeaderHeight);
if (header) {
  headerObserver.observe(header);
}


// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules.js";

function updateHeaderHeight() {
  const header = document.querySelector('.header');
  if (!header) return;

  const height = header.offsetHeight;
  document.body.style.setProperty('--header-height', `${height}px`);
}

document.addEventListener('DOMContentLoaded', updateHeaderHeight);

window.addEventListener('resize', updateHeaderHeight);

const headerObserver = new ResizeObserver(updateHeaderHeight);
const headerElement = document.querySelector('.header');
if (headerElement) {
  headerObserver.observe(headerElement);
}


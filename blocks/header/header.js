/* eslint-disable function-paren-newline, object-curly-newline */
import { nav, div, span, a, img, button, i } from '../../scripts/dom-helpers.js';
import { loadFragment } from '../fragment/fragment.js';

const $body = document.body;
const navTransitionTime = 400; // match --nav-transition-time var in styles.css

function open(item) {
  $body.classList.add(`${item}-open`, 'no-scroll');
}

function close(item) {
  // ignore if item is already closed
  if (!$body.classList.contains(`${item}-open`)) return;

  $body.classList.remove(`${item}-open`);
  if (item === 'nav') $body.classList.add('nav-close');

  setTimeout(() => {
    $body.classList.remove(`${item}-open`, 'no-scroll');
    if (item === 'nav') $body.classList.remove('nav-close');
  }, navTransitionTime);
}

let $loginModal;
async function loginModal() {
  const loginHtml = await loadFragment('/login');
  if (loginHtml) {
    // Create modal elements
    const $modalContent = div();
    while (loginHtml.firstElementChild) $modalContent.append(loginHtml.firstElementChild);
    const $closeBtn = div({ class: 'close' }, 'X');
    $loginModal = div({ class: 'login-modal' },
      $closeBtn,
      $modalContent,
    );
    $closeBtn.addEventListener('click', () => close('modal'));

    $body.append($loginModal);

    // delay to ensure modal is loaded before animating
    setTimeout(() => { open('modal'); }, 100);
  } else {
    // eslint-disable-next-line no-console
    console.error('Failed to load login fragment.');
  }
}

export default async function decorate(block) {
  const fetchNav = await fetch('/nav.plain.html');
  const navHTML = await fetchNav.text();
  const $nav = nav();
  $nav.innerHTML = navHTML;

  const $header = document.querySelector('header');

  const $overlay = div({ class: 'overlay' });
  $overlay.addEventListener('click', () => {
    close('nav');
    close('modal');
  });

  // nav burger menu
  const $navBtn = div({ class: 'nav-btn' }, span(), span(), span());
  $navBtn.addEventListener('click', () => {
    if (!$body.classList.contains('nav-open')) {
      open('nav');
      close('modal');
    } else {
      close('nav');
    }
  });

  const $logo = a({ class: 'logo', href: '/' }, '888.de', img({
    src: '/icons/888de-logo.svg',
    width: '60',
    height: '60',
    alt: '888.de',
  }));

  const $loginBtn = button({ class: 'login' }, 'Einloggen');
  // let $loginModal;
  $loginBtn.addEventListener('click', () => {
    close('nav');

    if (!$loginModal) {
      // create login modal
      loginModal();
    } else {
      open('modal');
    }
  });

  block.replaceWith($navBtn, $logo, $loginBtn);
  $header.after($nav);
  $body.append($overlay);

  // accordion functionality
  const $navUL = $nav.querySelector('ul');
  const $accordionLIs = Array.from($navUL.children);
  $accordionLIs.forEach((li) => {
    const nestedUl = li.querySelector('ul');
    if (nestedUl) {
      const liText = li.firstChild.textContent.trim();
      const $spanLI = span(liText);
      const $arrow = i('>');
      li.firstChild.replaceWith($spanLI, $arrow);

      li.addEventListener('click', () => {
        li.classList.toggle('open');
      });
    }
  });

  // header opacity change
  $header.classList.add('solid');
  window.addEventListener('scroll', () => {
    const { scrollY } = window;
    const windowWidth = window.innerWidth;
    if (scrollY > (windowWidth < 1024 ? 45 : 60)) {
      $header.classList.remove('solid');
    } else {
      $header.classList.add('solid');
    }
  });
}

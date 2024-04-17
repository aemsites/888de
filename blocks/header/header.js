/* eslint-disable function-paren-newline, object-curly-newline */
import { nav, div, span, a, img, button, i } from '../../scripts/dom-helpers.js';
import { loadFragment } from '../fragment/fragment.js';
import { decorateExternalLinks } from '../../scripts/scripts.js';

const $body = document.body;
let $loginModal;
let $nav;

function open(item) {
  $body.classList.add(`${item}-open`, 'no-scroll');
}

function close(item) {
  const navTransitionTime = 400; // match --nav-transition-time var in styles.css

  // ignore if item is already closed
  if (!$body.classList.contains(`${item}-open`)) return;

  $body.classList.remove(`${item}-open`);
  if (item === 'nav') $body.classList.add('nav-close');

  setTimeout(() => {
    $body.classList.remove(`${item}-open`, 'no-scroll');
    if (item === 'nav') $body.classList.remove('nav-close');
  }, navTransitionTime);
}

async function getNav() {
  const fetchNav = await fetch('/nav.plain.html');
  const navHTML = await fetchNav.text();
  $nav = nav();
  $nav.innerHTML = navHTML;

  decorateExternalLinks($nav, 'from header.js');

  if (navHTML) {
    const $header = document.querySelector('header');
    $header.after($nav);

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

    setTimeout(() => { open('nav'); }, 20);
  }
}

async function getModal() {
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
    setTimeout(() => { open('modal'); }, 20);
  } else {
    // eslint-disable-next-line no-console
    console.error('Failed to load login fragment.');
  }
}

export default async function decorate(block) {
  // nav burger menu
  const $navBtn = div({ class: 'nav-btn' }, span(), span(), span());
  $navBtn.addEventListener('click', () => {
    if (!$body.classList.contains('nav-open')) {
      if (!$nav) getNav();
      else open('nav');
      close('modal');
    } else {
      close('nav');
    }
  });

  const $logo = a({ class: 'logo', href: '/' }, '888.de', img({
    src: '/icons/888de-logo.svg',
    width: '60',
    height: '60',
    alt: 'Online Slots Spiele & Online Poker Room',
  }));

  const $loginBtn = button({ class: 'login' }, 'Einloggen');
  $loginBtn.addEventListener('click', () => {
    if (!$loginModal) getModal();
    else open('modal');
    close('nav');
  });

  block.replaceWith($navBtn, $logo, $loginBtn);

  const $overlay = div({ class: 'overlay' });
  $overlay.addEventListener('click', () => {
    close('nav');
    close('modal');
  });
  $body.append($overlay);
}

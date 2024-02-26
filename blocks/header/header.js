/* eslint-disable object-curly-newline */
import { nav, div, span, a, img, button, i } from '../../scripts/dom-helpers.js';
import { loadFragment } from '../fragment/fragment.js';

const $body = document.body;
const navTransitionTime = 400; // match --nav-transition-time var in styles.css

function open(item) {
  $body.classList.add(`${item}-open`);
  $body.classList.add('no-scroll');
}

function close(item) {
  // ignore if item is already closed
  if (!$body.classList.contains(`${item}-open`)) return;

  $body.classList.remove(`${item}-open`);
  if (item === 'nav') $body.classList.add('nav-close');

  setTimeout(() => {
    $body.classList.remove('no-scroll');
    $body.classList.remove(`${item}-open`);
    if (item === 'nav') $body.classList.remove('nav-close');
  }, navTransitionTime);
}

export default async function decorate(block) {
  const fetchNav = await fetch('/nav.plain.html');
  const navHTML = await fetchNav.text();
  const $nav = nav();
  $nav.innerHTML = navHTML;

  const $header = document.querySelector('header');

  const loginHtml = await loadFragment('/login');

  const $loginModal = div(
    { class: 'login-modal' },
    div(loginHtml),
  );

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

  const $overlay = div({ class: 'overlay' });
  $overlay.addEventListener('click', () => {
    close('nav');
    close('modal');
  });

  const $logo = a({ class: 'logo', href: '/' }, '888.de', img({
    src: '/icons/888de-logo.svg?test1',
    width: '60',
    height: '60',
    alt: '888.de',
  }));

  const $loginBtn = button({ class: 'login' }, 'Einloggen');
  $loginBtn.addEventListener('click', () => {
    open('modal');
    close('nav');
  });

  block.replaceWith($navBtn, $logo, $loginBtn);
  $header.after($nav);
  $body.append($overlay, $loginModal);

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

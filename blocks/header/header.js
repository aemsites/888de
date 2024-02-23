/* eslint-disable object-curly-newline */
import { nav, div, span, a, img, button, i } from '../../scripts/dom-helpers.js';

function closeNav($body) {
  const navTransitionTime = 400; // match --nav-transition-time var in styles.css

  // ignore if nav is already closed
  if (!$body.classList.contains('nav-open')) return;

  $body.classList.remove('nav-open');
  $body.classList.add('nav-close');

  setTimeout(() => {
    $body.classList.remove('no-scroll');
    $body.classList.remove('nav-close');
  }, navTransitionTime);
}

export default async function decorate(block) {
  const fetchNav = await fetch('/nav.plain.html');
  const navHTML = await fetchNav.text();
  const $nav = nav();
  $nav.innerHTML = navHTML;

  const $body = document.body;
  const $header = document.querySelector('header');

  // nav burger menu
  const $navBtn = div({ class: 'nav-btn' }, span(), span(), span());
  $navBtn.addEventListener('click', () => {
    if (!$body.classList.contains('nav-open')) {
      $body.classList.add('nav-open');
      $body.classList.add('no-scroll');
    } else {
      closeNav($body);
    }
  });

  const $overlay = div({ class: 'overlay' });
  $body.append($overlay);
  $overlay.addEventListener('click', () => {
    closeNav($body);
  });

  const $logo = a({ class: 'logo', href: '/' }, '888.de', img({
    src: '/icons/888de-logo.svg',
    width: '60',
    height: '60',
    alt: '888.de',
  }));

  const $login = button({ class: 'login' }, 'Einloggen');

  block.replaceWith($navBtn, $logo, $login);

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
}

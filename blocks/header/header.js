/* eslint-disable object-curly-newline */
import { nav, div, span, a, img, button, i } from '../../scripts/dom-helpers.js';

function closeNav($body, navTransitionTime) {
  $body.classList.remove('nav-open');
  setTimeout(() => {
    $body.classList.remove('no-scroll');
  }, navTransitionTime);
}

export default async function decorate(block) {
  const fetchNav = await fetch('/drafts/dfink/nav.plain.html');
  const navHTML = await fetchNav.text();
  const $nav = nav();
  $nav.innerHTML = navHTML;

  const $body = document.body;
  const $main = document.querySelector('main');
  const $header = document.querySelector('header');

  // nav burger menu
  const $navBtn = div({ class: 'nav-btn' }, span(), span(), span());
  const navTransitionTime = 400; // match --nav-transition-time var in styles.css
  $navBtn.addEventListener('click', () => {
    if (!$body.classList.contains('nav-open')) {
      $body.classList.add('nav-open');
      $body.classList.add('no-scroll');
    } else {
      closeNav($body, navTransitionTime);
    }
  });

  $main.addEventListener('click', () => {
    closeNav($body, navTransitionTime);
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

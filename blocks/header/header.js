/* eslint-disable object-curly-newline */
import { nav, div, span, a, img, button } from '../../scripts/dom-helpers.js';

export default async function decorate(block) {
  const navMenuHTML = await fetch('/drafts/dfink/nav.plain.html');
  const $nav = nav({ class: 'nav' });
  $nav.innerHTML = await navMenuHTML.text();

  const $navBtn = div({ class: 'nav-btn' }, span(), span(), span());
  $navBtn.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });

  const $logo = a({ class: 'logo', href: '/' }, '888.de', img({
    src: '/icons/888de-logo.svg',
    width: '60',
    height: '60',
    alt: '888.de',
  }));

  const $login = button({ class: 'login' }, 'Einloggen');

  block.replaceWith($navBtn, $logo, $login);

  document.querySelector('header').after($nav);
}

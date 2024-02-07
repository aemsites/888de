/* eslint-disable object-curly-newline */
import { loadFragment } from '../fragment/fragment.js';
import { nav, div, span, a, img, button } from '../../scripts/dom-helpers.js';

export default async function decorate(block) {
  const navPath = '/drafts/dfink/nav';
  const $navMenu = await loadFragment(navPath);

  const $hamburger = div({ class: 'menu-btn' }, span(), span(), span());

  const $logo = a({ class: 'logo', href: '/' }, '888.de', img({
    src: '/icons/888de-logo.svg',
    width: '60',
    height: '60',
    alt: '888.de',
  }));

  const $login = button({ class: 'login' }, 'Einloggen');

  const $nav = nav($hamburger, $logo, $login, $navMenu);

  block.append($nav);
}

/* eslint-disable object-curly-newline */
import { nav, div, span, a, img, button, i } from '../../scripts/dom-helpers.js';

export default async function decorate(block) {
  const fetchNav = await fetch('/drafts/dfink/nav.plain.html');
  const navHTML = await fetchNav.text();
  const navTransitionTime = 400; // match --nav-transition-time var in styles.css
  const $nav = nav();
  $nav.innerHTML = navHTML;
  const $navUL = $nav.querySelector('ul');
  const $accordionLIs = Array.from($navUL.children);

  $accordionLIs.forEach((li) => {
    // if li has ul, format it as accordion
    if (li.querySelector('ul') !== null) {
      const spanLI = span(li.firstChild.textContent.trim());
      const $arrow = i('>');
      li.firstChild.replaceWith(spanLI, $arrow);

      li.addEventListener('click', () => {
        li.classList.toggle('open');
      });
    }
  });

  const $body = document.body;
  const $main = document.querySelector('main');
  const $navBtn = div({ class: 'nav-btn' }, span(), span(), span());

  $main.addEventListener('click', () => {
    $body.classList.remove('nav-open');
    setTimeout(() => {
      $body.classList.remove('no-scroll');
    }, navTransitionTime);
  });

  $navBtn.addEventListener('click', () => {
    if (!$body.classList.contains('nav-open')) {
      $body.classList.add('nav-open');
      $body.classList.add('no-scroll');
    } else {
      $body.classList.remove('nav-open');
      // allow animation to finish
      setTimeout(() => {
        $body.classList.remove('no-scroll');
      }, navTransitionTime);
    }
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

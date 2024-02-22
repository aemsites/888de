/* eslint-disable object-curly-newline */
import { nav, div, span, a, img, button, i } from '../../scripts/dom-helpers.js';

export default async function decorate(block) {
  const fetchNav = await fetch('/drafts/dfink/nav.plain.html');

  const navHTML = await fetchNav.text();

  const $nav = nav();
  const navTransitionTime = 400;
  $nav.innerHTML = navHTML;

  const $navUL = $nav.querySelector('ul');

  const $accordionLIs = Array.from($navUL.children);

  $accordionLIs.forEach((li) => {
    // Check if the li has a nested uls

    // console.log(li.innerHTML);

    //console.log('this', li.firstChild.textContent.trim());

    if (li.querySelector('ul') !== null) {
      // const $checkbox = input({ type: 'checkbox', checked: true });

      
      const textContent = li.firstChild.textContent.trim();

      // wrap text in span
      const spanLI = span(li.firstChild.textContent.trim());
      li.firstChild.replaceWith(spanLI);




      li.addEventListener('click', () => {
        li.classList.toggle('open');
      });

      const $arrow = i();
      // li.prepend($checkbox, $arrow);
      li.prepend($arrow);
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

     // match --nav-transition-time var in styles.css

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

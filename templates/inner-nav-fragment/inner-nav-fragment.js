/* eslint-disable object-curly-newline */
/* eslint-disable function-paren-newline */
import { aside, div } from '../../scripts/dom-helpers.js';
import { breadcrumbs } from '../../scripts/scripts.js';

export default async function decorate(doc) {
  const $aside = aside({ class: 'left-nav' });
  const currentURL = window.location.href;
  const { pathname } = new URL(currentURL);
  const pathParts = pathname.split('/').filter((part) => part !== ''); // Remove empty parts
  const parentFullPath = `/${pathParts.slice(0, -1).join('/')}`;

  (async () => {
    try {
      const response = await fetch(`${parentFullPath}/left-nav.plain.html`);
      const html = await response.text();
      $aside.innerHTML = html;

      // add active class
      $aside.querySelectorAll('a').forEach(($link) => {
        const hrefPath = new URL($link.href).pathname.replace(/\/$/, '');
        const currentPath = new URL(currentURL).pathname.replace(/\/$/, '');
        if (hrefPath === currentPath) $link.parentElement.classList.add('active');
      });
    } catch (error) {
      console.error('Error fetching HTML:', error);
    }
  })();

  const $sectionOuter = doc.querySelector('main > .section-outer');
  const $sectionContent = $sectionOuter.querySelector('.section');
  const $breadcrumbsContainer = div({ class: 'breadcrumbs-container' });

  $sectionOuter.prepend($aside);
  $sectionContent.prepend($breadcrumbsContainer);

  breadcrumbs(doc).then(($breadcrumbs) => {
    $breadcrumbsContainer.append($breadcrumbs);
  }).catch((error) => {
    console.error('Error generating breadcrumbs:', error);
  });
}

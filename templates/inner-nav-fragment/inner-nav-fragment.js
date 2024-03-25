/* eslint-disable object-curly-newline */
/* eslint-disable function-paren-newline */
import { aside, div } from '../../scripts/dom-helpers.js';
import { breadcrumbs } from '../../scripts/scripts.js';

export default async function decorate(doc) {
  const $aside = aside({ class: 'left-nav' });
  const currentURL = window.location.href;
  const { protocol, host, pathname } = window.location;
  let parentPath = `${protocol}//${host}${pathname}`;
  // if path does not end with / get parent directory
  if (!pathname.endsWith('/')) parentPath = `${parentPath.substring(0, parentPath.lastIndexOf('/'))}/`;

  (async () => {
    try {
      const response = await fetch(`${parentPath}left-nav.plain.html`);
      const html = await response.text();
      $aside.innerHTML = html;

      // add active class
      $aside.querySelectorAll('a').forEach(($link) => {
        const hrefPath = new URL($link.href).pathname.replace(/\/$/, '');
        const currentPath = new URL(currentURL).pathname.replace(/\/$/, '');
        if (hrefPath === currentPath) $link.parentElement.classList.add('active');
      });
    } catch (error) {
      // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.error('Error generating breadcrumbs:', error);
  });
}

/* eslint-disable object-curly-newline */
/* eslint-disable function-paren-newline */
import { aside, div } from '../../scripts/dom-helpers.js';
import { breadcrumbs } from '../../scripts/scripts.js';

export default async function decorate(doc) {
  const $aside = aside({ class: 'left-nav' });

  const { pathname, origin } = window.location;
  const currentPath = `${origin}${pathname.replace(/\/$/, '')}`;
  const parentDirectory = pathname.substring(0, pathname.lastIndexOf('/') + 1);
  const parentPath = `${origin}${parentDirectory.replace(/\/$/, '')}`;

  console.log('currentPath = ' + currentPath);
  console.log('parentDirectory = ' + parentDirectory);
  console.log('parentPath = ' + parentPath);

  const getLeftNav = async (url) => {
    console.log('getLeftnav url = ' + url);
    try {
      const response = await fetch(`${url}/left-nav.plain.html`);
      if (!response.ok) {
        throw new Error(`Fetch failed with status ${response.status}`);
      }
      const html = await response.text();
      $aside.innerHTML = html;
      console.log(`getLeftNav success  = ${url}/left-nav.plain.html`)
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error fetching left-nav from ${url}/left-nav.plain.html:`, error);
      return false;
    }
  };

  (async () => {
    // if lef-nav isn't in curernt path (index page) - get from parent folder
    const success = await getLeftNav(currentPath) || await getLeftNav(parentPath);

    if (success) {
      $aside.querySelectorAll('a').forEach(($link) => {
        if ($link.href.replace(/\/$/, '') === currentPath) $link.parentElement.classList.add('active');
      });
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

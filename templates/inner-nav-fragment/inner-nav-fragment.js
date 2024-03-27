/* eslint-disable object-curly-newline */
/* eslint-disable function-paren-newline */
import { aside, div } from '../../scripts/dom-helpers.js';
import { breadcrumbs } from '../../scripts/scripts.js';

export default async function decorate(doc) {
  const $aside = aside({ class: 'left-nav' });

  const { pathname, origin } = window.location;
  const parts = pathname.split('/');
  const normalizedPathname = pathname.replace(/\/$/, '');

  // parent directory
  const lastSlashIndex = normalizedPathname.lastIndexOf('/');
  const parentDirectory = lastSlashIndex !== -1 ? normalizedPathname.substring(0, lastSlashIndex) : '';

  const currentPath = `${origin + pathname.replace(/\/$/, '')}`;
  const parentPath = `${origin + parentDirectory}`;

  const getLeftNav = async (url) => {
    try {
      const response = await fetch(`${url}/left-nav.plain.html`);
      if (response.status === 404) {
        // eslint-disable-next-line no-console
        console.log('(above 404 can be ignored) left-nav doesn\'t exist at that location - so we check the parent folder');
        return false;
      }
      if (!response.ok) {
        throw new Error(`Fetch failed with status ${response.status}`);
      }
      const html = await response.text();
      $aside.innerHTML = html;
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
      const keywords = ['abhebung', 'einzahlung'];
      const keyword = parts[2];
      $aside.querySelectorAll('a').forEach(($link) => {
        const href = $link.href.replace(/\/$/, '');
        const linkText = $link.textContent.trim().toLowerCase();
        if (keywords.includes(keyword) && keyword === linkText) {
          $link.parentElement.classList.add('active');
          return;
        }
        if (!keywords.includes(keyword) && href === currentPath) {
          $link.parentElement.classList.add('active');
        }
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

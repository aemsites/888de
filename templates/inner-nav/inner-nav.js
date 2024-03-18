/* eslint-disable object-curly-newline */
/* eslint-disable function-paren-newline */
import { ul, li, a } from '../../scripts/dom-helpers.js';
import { breadcrumbs } from '../../scripts/scripts.js';

export default async function decorate(doc) {
  const $anchorNav = ul({ class: 'inner-nav' });
  const parentFolder = window.location.pathname.split('/').filter(Boolean)[0];

  fetch('/query-index.json')
    .then((response) => response.json())
    .then((data) => {
      // get paths that match parent & exclude 'index-breadcrumb'
      const filteredPaths = data.data.filter((item) => item.path.startsWith(`/${parentFolder}`) && !item.path.includes('index-breadcrumb'));

      // sort by 'nav-order'
      filteredPaths.sort((A, B) => parseInt(A['nav-order'], 10) - parseInt(B['nav-order'], 10));

      const listItems = filteredPaths.map((item) => {
        const isActive = item.path === window.location.pathname ? 'active' : '';
        return li({ class: isActive }, a({ href: item.path }, item.title.replace(/\s*\|\s*888\.de$/, '')));
      });

      listItems.forEach((listItem) => $anchorNav.appendChild(listItem));
    })
    .catch((error) => console.error('Error fetching JSON:', error));

  const $page = doc.querySelector('main > .section-outer > .section');

  $page.prepend($anchorNav);

  // insert breadcrumbs
  breadcrumbs(doc).then(($breadcrumbs) => {
    $page.prepend($breadcrumbs);
  }).catch((error) => {
    console.error('Error generating breadcrumbs:', error);
  });
}

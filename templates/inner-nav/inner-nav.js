/* eslint-disable object-curly-newline */
/* eslint-disable function-paren-newline */
import { aside, div, ul, li, a } from '../../scripts/dom-helpers.js';
import { breadcrumbs } from '../../scripts/scripts.js';

export default async function decorate(doc) {
  const $aside = aside({ class: 'left-nav' });
  const $nav = ul();
  const parentFolder = window.location.pathname.split('/').filter(Boolean)[0];

  fetch('/query-index.json')
    .then((response) => response.json())
    .then((data) => {
      // get paths that match parent & exclude 'index-breadcrumb'
      const filteredPaths = data.data.filter((item) => item.path.startsWith(`/${parentFolder}`) && !item.path.includes('index-breadcrumb'));

      // sort by 'nav-order'
      filteredPaths.sort((A, B) => parseInt(A['nav-order'], 10) - parseInt(B['nav-order'], 10));

      const listItems = filteredPaths.map((item) => {
        const isActive = item.path.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '') ? 'active' : '';
        return li({ class: isActive }, a({ href: item.path }, item.title.replace(/\s*\|\s*888\.de$/, '')));
      });

      listItems.forEach((listItem) => $nav.appendChild(listItem));
    })
    .catch((error) => console.error('Error fetching JSON:', error));

  const $sectionOuter = doc.querySelector('main > .section-outer');
  const $sectionContent = $sectionOuter.querySelector('.section');
  const $breadcrumbsContainer = div({ class: 'breadcrumbs-container' });

  $aside.append($nav);
  $sectionOuter.prepend($aside);
  $sectionContent.prepend($breadcrumbsContainer);

  breadcrumbs(doc).then(($breadcrumbs) => {
    $breadcrumbsContainer.append($breadcrumbs);
  }).catch((error) => {
    console.error('Error generating breadcrumbs:', error);
  });
}

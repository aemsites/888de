import { div } from '../../scripts/dom-helpers.js';
import { breadcrumbs } from '../../scripts/scripts.js';

export default async function decorate(doc) {
  const $page = doc.querySelector('main > .section-outer > .section');

  // insert breadcrumbs
  const $breadcrumbsContainer = div({ class: 'breadcrumbs-container' });
  $page.prepend($breadcrumbsContainer);

  breadcrumbs(doc, $page).then(($breadcrumbs) => {
    $breadcrumbsContainer.append($breadcrumbs);
  }).catch((error) => {
    console.error('Error generating breadcrumbs:', error);
  });
}

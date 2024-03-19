import { div } from '../../scripts/dom-helpers.js';
import { breadcrumbs } from '../../scripts/scripts.js';

export default async function decorate(doc) {
  const $sectionContent = doc.querySelector('main > .section-outer .section');
  const $breadcrumbsContainer = div({ class: 'breadcrumbs-container' });

  $sectionContent.prepend($breadcrumbsContainer);

  breadcrumbs(doc).then(($breadcrumbs) => {
    $breadcrumbsContainer.append($breadcrumbs);
  }).catch((error) => {
    console.error('Error generating breadcrumbs:', error);
  });
}

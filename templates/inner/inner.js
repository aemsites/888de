import { breadcrumbs } from '../../scripts/scripts.js';

export default async function decorate(doc) {
  const $page = doc.querySelector('main > .section-outer > .section');

  breadcrumbs(doc).then(($breadcrumbs) => {
    $page.prepend($breadcrumbs);
  }).catch((error) => {
    console.error('Error generating breadcrumbs:', error);
  });
}

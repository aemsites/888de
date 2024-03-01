/* eslint-disable object-curly-newline */
/* eslint-disable function-paren-newline */
import { div, ul, li, a } from '../../scripts/dom-helpers.js';

// Smooth scrolling function
function scrollToTarget(target) {
  const { offsetTop } = target;
  window.scrollTo({
    top: offsetTop,
    behavior: 'smooth',
  });
}

export default async function decorate(doc) {
  const paragraphs = doc.querySelectorAll('main .default-content-wrapper p');
  const $anchorNav = ul({ class: 'anchor-nav' });

  paragraphs.forEach((p) => {
    const pTxt = p.textContent;
    const isAnchor = pTxt.match(/\[anchor:\s*([^\]]+)\]/g);

    if (isAnchor) {
      // get anchor text
      const anchorTxt = pTxt.replace(/\[anchor:\s*|\]/g, '');
      const anchorID = anchorTxt
        .replace(/ /g, '_')
        .replace(/\./g, '')
        .trim()
        .toLowerCase();
      const $anchor = div({ class: 'anchor', id: anchorID });

      p.replaceWith($anchor);

      // build nav
      const $anchorLink = li(a({ href: `#${anchorID}` }, anchorTxt));
      $anchorNav.appendChild($anchorLink);
      $anchorLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.pushState(null, null, `#${anchorID}`);
        scrollToTarget($anchor);

        const $activeAnchor = doc.querySelector('.anchor-nav .active');
        if ($activeAnchor) $activeAnchor.classList.remove('active');
        $anchorLink.classList.add('active');
      });
    } // matches
  }); // each

  const $page = doc.querySelector('main > .section-outer > .section');

  $page.prepend($anchorNav);
}

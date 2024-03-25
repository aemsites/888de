/* eslint-disable object-curly-newline */
/* eslint-disable function-paren-newline */
import { aside, div, ul, li, a } from '../../scripts/dom-helpers.js';
import { breadcrumbs } from '../../scripts/scripts.js';

function scrollToTarget(target) {
  const { offsetTop } = target;
  const scrollMarginTop = parseInt(window.getComputedStyle(target).scrollMarginTop, 10) || 0;
  window.scrollTo({
    top: offsetTop - scrollMarginTop,
    behavior: 'smooth',
  });
}

function highlightNav(doc) {
  const $anchors = doc.querySelectorAll('.anchor');
  window.addEventListener('scroll', () => {
    const scrollAmount = window.scrollY;
    $anchors.forEach(($anchor) => {
      if (scrollAmount >= (($anchor.offsetTop))) {
        const id = $anchor.getAttribute('id');
        const $navLI = doc.querySelector(`a[href="#${id}"]`).parentElement;
        const $activeLI = doc.querySelector('.left-nav .active');
        if ($activeLI) $activeLI.classList.remove('active');
        $navLI.classList.add('active');
      }
    });
  });
}

export default async function decorate(doc) {
  const paragraphs = doc.querySelectorAll('main .default-content-wrapper p');
  const $aside = aside({ class: 'left-nav' });
  const $nav = ul();

  paragraphs.forEach((p, i) => {
    const pTxt = p.textContent;
    const isAnchor = pTxt.match(/\{anchor:\s*([^\]]+)\}/g);

    if (isAnchor) {
      const anchorTxt = pTxt.replace(/\{anchor:\s*|\}/g, '');
      const anchorID = anchorTxt
        .replace(/ /g, '_')
        .replace(/\./g, '')
        .trim()
        .toLowerCase();
      const $anchor = div({ class: 'anchor', id: anchorID });

      if (i === 0) $anchor.classList.add('first');

      p.replaceWith($anchor);

      // build nav
      const $anchorLink = li(a({ href: `#${anchorID}` }, anchorTxt));
      $nav.appendChild($anchorLink);
      $anchorLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.pushState(null, null, `#${anchorID}`);
        scrollToTarget($anchor);
      });
    } // matches
  }); // each

  const $sectionOuter = doc.querySelector('main > .section-outer');
  const $sectionContent = $sectionOuter.querySelector('.section');
  const $breadcrumbsContainer = div({ class: 'breadcrumbs-container' });

  $aside.append($nav);
  $sectionOuter.prepend($aside);
  $sectionContent.prepend($breadcrumbsContainer);

  breadcrumbs(doc).then(($breadcrumbs) => {
    $breadcrumbsContainer.append($breadcrumbs);
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Error generating breadcrumbs:', error);
  });

  highlightNav(doc);
}

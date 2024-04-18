/* eslint-disable function-paren-newline, object-curly-newline */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { div } from '../../scripts/dom-helpers.js';

// convert the sitemap links to an accordion
function createMobileMenu(block) {
  const accordionItems = block.querySelectorAll('.section-outer:nth-of-type(2) .default-content-wrapper > ul');
  accordionItems.forEach((accordionItem) => {
    const accordionItemNew = div({ class: 'details accordion-item' },
      div({ class: 'summary accordion-header' }, accordionItem.querySelector('strong')),
      div({ class: 'accordion-content' }, accordionItem.querySelector('li > ul')),
    );
    accordionItemNew.onclick = () => accordionItemNew.classList.toggle('open');
    accordionItem.replaceWith(accordionItemNew);
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  block.textContent = '';

  // load footer fragment
  const footerPath = footerMeta.footer || '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  createMobileMenu(footer);
  block.append(footer);

  const [paymentStrip, siteMap, regulation, sbtMain, license] = document.querySelectorAll('div.footer>div>div.section-outer');
  paymentStrip.classList.add('payment-strip');
  siteMap.classList.add('site-map');
  regulation.classList.add('regulation');
  sbtMain.classList.add('sbt-main');
  license.classList.add('license');

  // open all accordions on desktop, close them all on mobile
  function checkWindowSize() {
    const isMobileScreen = window.matchMedia('(max-width: 1024px)').matches;
    if (!isMobileScreen) siteMap.classList.add('open');
    else siteMap.classList.remove('open');
  }
  checkWindowSize();
  window.addEventListener('load', checkWindowSize);
  window.addEventListener('resize', checkWindowSize);
}

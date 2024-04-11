/* eslint-disable object-curly-newline */
/* eslint-disable function-paren-newline */
import { div, removeEmptyTags } from '../../scripts/dom-helpers.js';

export default async function decorate(doc) {
  const mainEl = doc.querySelector('main');
  const heroSection = div({ class: 'hero-section' });
  const imageWrapper = div({ class: 'main-content-image' });
  const dtBackground = mainEl.querySelector('picture');
  imageWrapper.append(dtBackground);
  const mobileBackground = mainEl.querySelector('picture');
  const mobileImageWrapper = div({ class: 'mobile-content-image' });
  mobileImageWrapper.append(mobileBackground);
  heroSection.append(imageWrapper);
  heroSection.append(mobileImageWrapper);
  const imageContent = mainEl.querySelectorAll('.default-content-wrapper p, .default-content-wrapper h2');
  const imageContentWrapper = div({ class: 'image-content-wrapper' });
  imageContent.forEach((content) => {
    imageContentWrapper.append(content);
  });
  mobileImageWrapper.append(imageContentWrapper.cloneNode(true));
  const brandBox = mainEl.querySelector('.columns-container');
  brandBox.classList.remove('section');
  brandBox.classList.add('brand-box');
  heroSection.append(imageContentWrapper);
  heroSection.append(brandBox);
  mainEl.replaceChildren(heroSection);
  removeEmptyTags(heroSection);
}

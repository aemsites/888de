import {
  div, removeEmptyTags,
} from '../../scripts/dom-helpers.js';

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
  const imageContent = mainEl.querySelectorAll('.default-content-wrapper p');
  const imageContentWrapper = div({ class: 'image-content-wrapper section' });
  imageContent.forEach((content) => {
    imageContentWrapper.append(content);
  });
  heroSection.append(imageContentWrapper);
  const brandBox = mainEl.querySelector('.columns-container');
  brandBox.classList.remove('section');
  imageContentWrapper.append(brandBox);
  heroSection.append(imageContentWrapper);
  mainEl.replaceChildren(heroSection);
  removeEmptyTags(heroSection);
}

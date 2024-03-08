import {
  div, removeEmptyTags,
} from '../../scripts/dom-helpers.js';

export default async function decorate(doc) {
  const mainEl = doc.querySelector('main');
  const imageWrapper = div({ class: 'main-content-image' });
  const dtBackground = mainEl.querySelector('picture');
  imageWrapper.append(dtBackground);
  const mobileBackground = mainEl.querySelector('picture');
  const mobileImageWrapper = div({ class: 'mobile-content-image' });
  const imageParent = mobileBackground.parentElement.parentElement;
  mobileImageWrapper.append(mobileBackground);
  mainEl.prepend(imageWrapper);
  mainEl.prepend(mobileImageWrapper);
  removeEmptyTags(imageParent);
  const imageContent = mainEl.querySelector('.default-content-wrapper');
  imageContent.classList.add('image-content-wrapper');
}

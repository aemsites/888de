import { readBlockConfig } from '../../scripts/aem.js';

function createMobileSlide(slide, slideContent) {
    slide.innerHTML = `<div class="brand-logo">
    ${slideContent.icon.outerHTML||''}
 </div>
 ${(slideContent.mobVideolink || slideContent.dtVideoLink) ? `<video class="mob" autoplay="autoplay" width="100%" loop="" muted="" playsinline="" poster="${slideContent.mobileImg ? slideContent.mobileImg  : slideContent.img}">
    <source src="${slideContent.mobVideolink ? slideContent.mobVideolink : slideContent.dtVideoLink}" type="video/mp4">
 </video>` : (slideContent.mobilePic ? slideContent.mobilePic.outerHTML : slideContent.pic.outerHTML)}
 <div class="mobile-v2">
    ${slideContent.offer.outerHTML}
    <div class="mobile">${slideContent.termsLink.outerHTML}</div>
    ${slideContent.button.outerHTML}
 </div>`;
}

export default function decorate(block) {
    const cols = [...block.firstElementChild.children];
    const dtSlidesWrapper = document.createElement('div');
    dtSlidesWrapper.classList.add('dt-slides-wrapper');
    const mobileSlidesWrapper = document.createElement('div');
    mobileSlidesWrapper.classList.add('mobile-slides-wrapper');
    const configs = readBlockConfig(block);
    const transitionDuration = configs['transition-duration'];

    // add index to each slide
    let slideIndex = 1;
    [...block.children].forEach((row) => {
        let slideContent = {};
        if (row.children.length === 2) {
            if (row.children[0].innerText === 'transition duration') {
                block.removeChild(row);
                return;
            }
        }
        [...row.children].forEach((col) => {
            const pic = col.querySelector('picture');
            if (pic) {
                slideContent.pic = pic;
                const img = pic.querySelector('img');
                slideContent.img = img.getAttribute('src');
                const mobilePic = col.querySelectorAll('picture')[1];
                if (mobilePic) {
                    slideContent.mobilePic = mobilePic;
                    const mobileImg = mobilePic.querySelector('img');
                    slideContent.mobileImg = mobileImg.getAttribute('src');
                }
                const dtVideoLink = col.querySelector('a');
                if (dtVideoLink) {
                    slideContent.dtVideoLink = dtVideoLink.getAttribute('href');
                }
                const mobVideolink = col.querySelectorAll('a')[1];
                if (mobVideolink) {
                    slideContent.mobVideolink = mobVideolink.getAttribute('href');
                }

            } else {
                const icon = col.querySelector('span.icon');
                if (icon) {
                    slideContent.icon = icon;
                    col.removeChild(icon.parentElement);
                }
                const button = col.querySelector('p.button-container');
                if (button) {
                    slideContent.button = button;
                    col.removeChild(button);
                }
                const link = col.querySelector('a');
                if (link) {
                    link.classList.remove('button');
                    slideContent.termsLink = link;
                    col.removeChild(link.parentElement);
                }
                slideContent.offer = col;
            }
        });
        const slide = document.createElement('div');
        slide.className = `slide slide-${slideIndex++}`;
        createMobileSlide(slide, slideContent);
        mobileSlidesWrapper.append(slide);
    });
    block.replaceChildren(mobileSlidesWrapper);
}

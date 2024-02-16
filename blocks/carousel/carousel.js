import { readBlockConfig } from '../../scripts/aem.js';

function createMobileSlide(slide, slideContent) {
    slide.innerHTML = `<div class="brand-logo">
    ${slideContent.icon.outerHTML || ''}
 </div>
 ${(slideContent.mobVideolink || slideContent.dtVideoLink) ? `<video class="mob" autoplay="autoplay" width="100%" loop="" muted="" playsinline="" poster="${slideContent.mobileImg ? slideContent.mobileImg : slideContent.img}">
    <source src="${slideContent.mobVideolink ? slideContent.mobVideolink : slideContent.dtVideoLink}" type="video/mp4">
 </video>` : (slideContent.mobilePic ? slideContent.mobilePic.outerHTML : slideContent.pic.outerHTML)}
 <div class="mobile-v2">
    ${slideContent.offer.outerHTML}
    <div class="mobile">${slideContent.termsLink.outerHTML}</div>
    ${slideContent.button.outerHTML}
 </div>`;
}

function populateDtSlidesWrapper(dtSlidesWrapper, slideContent) {
    dtSlidesWrapper.innerHTML = `
    ${slideContent.mobilePic ? slideContent.mobilePic.outerHTML : slideContent.pic.outerHTML}
    <div id="left">
       <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31.589" height="44.614" viewBox="0 0 31.589 44.614">
          <defs>
             <filter id="a" x="0" y="0" width="31.589" height="44.614" filterUnits="userSpaceOnUse">
                <feOffset dy="3" input="SourceAlpha"></feOffset>
                <feGaussianBlur stdDeviation="3" result="b"></feGaussianBlur>
                <feFlood flood-opacity="0.302"></feFlood>
                <feComposite operator="in" in2="b"></feComposite>
                <feComposite in="SourceGraphic"></feComposite>
             </filter>
          </defs>
          <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#a)">
             <path d="M8194.854,13316.641l9.773,13.262-9.773,13.353h3.737l9.852-13.308-9.852-13.307Z" transform="translate(8217.44 13349.25) rotate(180)" fill="#fff"></path>
          </g>
       </svg>
    </div>
    <div id="right">
       <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31.589" height="44.614" viewBox="0 0 31.589 44.614">
          <defs>
             <filter id="a" x="0" y="0" width="31.589" height="44.614" filterUnits="userSpaceOnUse">
                <feOffset dy="3" input="SourceAlpha"></feOffset>
                <feGaussianBlur stdDeviation="3" result="b"></feGaussianBlur>
                <feFlood flood-opacity="0.302"></feFlood>
                <feComposite operator="in" in2="b"></feComposite>
                <feComposite in="SourceGraphic"></feComposite>
             </filter>
          </defs>
          <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#a)">
             <path d="M8194.854,13316.641l9.773,13.262-9.773,13.353h3.737l9.852-13.308-9.852-13.307Z" transform="translate(-8185.85 -13310.64)" fill="#fff"></path>
          </g>
       </svg>
    </div>`;
}

function createDesktopSlide(slide, slideContent) {
    slide.innerHTML = `
         <div class="brand-logo">
            ${slideContent.icon.outerHTML || ''}
            <div class="brand-logo-line">&nbsp;</div>
         </div>
         <div class="banner-offer">
         ${slideContent.offer.outerHTML}
         </div>
         <div class="banner-cta-terms">
            ${slideContent.button.outerHTML}
            <div class="banner-terms">${slideContent.termsLink.outerHTML}</div>
         </div>
         ${(slideContent.dtVideoLink) ? `
         <video class="mob" autoplay="autoplay" width="100%" loop="" muted="" playsinline="" poster="${slideContent.img ? slideContent.img : ''}">
            <source src="${slideContent.dtVideoLink ? slideContent.dtVideoLink : ''}" type="video/mp4">
        </video>` : (slideContent.pic ? slideContent.pic.outerHTML : '')}
    `;
}

function createBoxOffer(boxOffer, slideContent) {
    boxOffer.innerHTML = `
    ${slideContent.offer.outerHTML}
    ${slideContent.button.outerHTML}
    <div class="pc">${slideContent.termsLink.outerHTML}</div>
    `;
}

// function to change slide on click of dot activating slide, dot and box offer
function changeSlide(slideIndex, dtSlidesWrapper, dtDotsWrapper, dtBannerBoxWrapper) {
    const slides = dtSlidesWrapper.querySelectorAll('.slide');
    const dots = dtDotsWrapper.querySelectorAll('.dot');
    const boxOffers = dtBannerBoxWrapper.querySelectorAll('.box-offer');
    slides.forEach((slide) => {
        slide.classList.remove('active');
    });
    dots.forEach((dot) => {
        dot.classList.remove('active');
    });
    boxOffers.forEach((boxOffer) => {
        boxOffer.classList.remove('active');
    });
    console.log(slideIndex, slides[slideIndex - 1]);
    slides[slideIndex - 1].classList.add('active');
    dots[slideIndex - 1].classList.add('active');
    boxOffers[slideIndex - 1].classList.add('active');
}

export default function decorate(block) {
    const cols = [...block.firstElementChild.children];
    const dtSlidesWrapper = document.createElement('div');
    dtSlidesWrapper.classList.add('dt-slides-wrapper');
    const dtDotsWrapper = document.createElement('div');
    dtDotsWrapper.classList.add('dt-dots-wrapper');
    const dtBannerBoxWrapper = document.createElement('div');
    dtBannerBoxWrapper.classList.add('dt-banner-box-wrapper');
    const mobileSlidesWrapper = document.createElement('div');
    mobileSlidesWrapper.classList.add('mobile-slides-wrapper');
    const configs = readBlockConfig(block);
    const transitionDuration = configs['transition-duration'];
    const slider = document.createElement('div');
    slider.className = 'slider';

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
        const mobSlide = document.createElement('div');
        mobSlide.className = `slide slide-${slideIndex}`;

        // create mobile view
        createMobileSlide(mobSlide, slideContent);
        mobileSlidesWrapper.append(mobSlide);

        // create desktop view
        if (slideIndex === 1) {
            populateDtSlidesWrapper(slider, slideContent);
        }

        const dtSlide = document.createElement('div');
        dtSlide.className = `slide slide-${slideIndex}`;
        if(slideIndex === 1) {
            dtSlide.classList.add('active');
        }
        createDesktopSlide(dtSlide, slideContent);
        slider.append(dtSlide);
        dtSlidesWrapper.append(slider);

        const dot = document.createElement('span');
        dot.className = `dot dot-${slideIndex}`;
        if(slideIndex === 1) {
            dot.classList.add('active');
        }
        dtDotsWrapper.append(dot);

        const boxOffer = document.createElement('div');
        boxOffer.className = `box-offer box-offer-${slideIndex}`;
        if(slideIndex === 1) {
            boxOffer.classList.add('active');
        }
        createBoxOffer(boxOffer, slideContent);
        dtBannerBoxWrapper.append(boxOffer);

        slideIndex++;
    });
    dtSlidesWrapper.append(dtDotsWrapper);
    dtSlidesWrapper.append(dtBannerBoxWrapper);
    block.replaceChildren(dtSlidesWrapper, mobileSlidesWrapper);

    // call change slide on click of dot, click of left and right arrow, on hover of box offer
    const dtLeft = dtSlidesWrapper.querySelector('#left');
    const dtRight = dtSlidesWrapper.querySelector('#right');
    dtLeft.addEventListener('click', () => {
        slideIndex = slideIndex > 1 ? slideIndex - 1 : dtSlidesWrapper.querySelectorAll('.slide').length;
        changeSlide(slideIndex, dtSlidesWrapper, dtDotsWrapper, dtBannerBoxWrapper);
    });
    dtRight.addEventListener('click', () => {
        slideIndex = slideIndex < dtSlidesWrapper.querySelectorAll('.slide').length ? slideIndex + 1 : 1;
        changeSlide(slideIndex, dtSlidesWrapper, dtDotsWrapper, dtBannerBoxWrapper);
    });
    dtDotsWrapper.addEventListener('click', (e) => {
        slideIndex = parseInt(e.target.className.split(' ')[1].split('-')[1]);
        changeSlide(slideIndex, dtSlidesWrapper, dtDotsWrapper, dtBannerBoxWrapper);
    });
    dtBannerBoxWrapper.addEventListener('mouseover', (e) => {
        const boxOffer = e.target.closest('.box-offer');
        slideIndex = parseInt(boxOffer.className.split(' ')[1].split('-')[2]);
        changeSlide(slideIndex, dtSlidesWrapper, dtDotsWrapper, dtBannerBoxWrapper);
    });

    //auto rotate slides
    const dtSlides = dtSlidesWrapper.querySelectorAll('.slide');
    slideIndex = 1;
    setInterval(() => {
        if (slideIndex > dtSlides.length) {
            slideIndex = 1;
        }
        changeSlide(slideIndex, dtSlidesWrapper, dtDotsWrapper, dtBannerBoxWrapper);
        slideIndex++;
    }, transitionDuration*1000);

}
/* eslint-disable no-nested-ternary */
import { readBlockConfig } from '../../scripts/aem.js';

function createMobileSlide(slide, slideContent) {
  slide.innerHTML = `<div class="brand-logo">
    ${slideContent.icon.outerHTML || ''}
 </div>
 <div class="slide-banner">${slideContent.mobilePic ? slideContent.mobilePic.outerHTML : slideContent.pic.outerHTML}</div>
 <div class="mobile-v2">
    ${slideContent.offer ? slideContent.offer.outerHTML : ''}
    <div class="mobile">${slideContent.termsLink ? slideContent.termsLink.outerHTML : ''}</div>
    ${slideContent.button ? slideContent.button.outerHTML : ''}
 </div>`;

  setTimeout(() => {
    const slideBanner = slide.querySelector('.slide-banner');
    if (slideContent.mobVideolink || slideContent.dtVideoLink) {
      slideBanner.innerHTML = `<video class="mob" autoplay="autoplay" width="100%" loop="" muted="" playsinline="" poster="${slideContent.mobileImg ? slideContent.mobileImg : slideContent.img}">
     <source src="${slideContent.mobVideolink ? slideContent.mobVideolink : slideContent.dtVideoLink}" type="video/mp4">
  </video>`;
    }
  }, 3500);
}

function populateDtSlidesWrapper(dtSlidesWrapper, pic) {
  dtSlidesWrapper.innerHTML = `
    ${pic ? pic.outerHTML : ''}
    <div id="left">
    <span class="icon icon-carousel-chevron"></span>
    </div>
    <div id="right">
    <span class="icon icon-carousel-chevron"></span>
    </div>`;
}

function createDesktopSlide(slide, slideContent) {
  slide.innerHTML = `
         <div class="brand-logo">
            ${slideContent.icon ? slideContent.icon.outerHTML : ''}
            <div class="brand-logo-line">&nbsp;</div>
         </div>
         <div class="banner-offer">
         ${slideContent.offer ? slideContent.offer.outerHTML : ''}
         </div>
         <div class="banner-cta-terms">
            ${slideContent.button ? slideContent.button.outerHTML : ''}
            <div class="banner-terms">${slideContent.termsLink ? slideContent.termsLink.outerHTML : ''}</div>
         </div>`;
  setTimeout(() => {
    slide.innerHTML += `
         ${(slideContent.dtVideoLink) ? `
         <video class="mob" autoplay="autoplay" width="100%" loop="" muted="" playsinline="" poster="${slideContent.img ? slideContent.img : ''}">
            <source src="${slideContent.dtVideoLink ? slideContent.dtVideoLink : ''}" type="video/mp4">
        </video>` : (slideContent.pic ? slideContent.pic.outerHTML : '')}
    `;
    slide.parentElement.querySelector('img').style.visibility = 'hidden';
  }, 3500);
}

function createBoxOffer(boxOffer, slideContent) {
  boxOffer.innerHTML = `
    ${slideContent.offer ? slideContent.offer.outerHTML : ''}
    ${slideContent.button ? slideContent.button.outerHTML.replaceAll('main-banner', 'carousel') : ''}
    <div class="pc">${slideContent.termsLink ? slideContent.termsLink.outerHTML.replaceAll('main-banner', 'carousel') : ''}</div>
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
  slides[slideIndex - 1].classList.add('active');
  dots[slideIndex - 1].classList.add('active');
  boxOffers[slideIndex - 1].classList.add('active');
}

export default function decorate(block) {
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
  let mobRatio;
  const vpWidth = window.innerWidth;

  const firstPic = block.querySelector('picture').cloneNode(true);
  firstPic.querySelector('img').setAttribute('loading', 'eager');
  populateDtSlidesWrapper(slider, firstPic);
  let slideIndex = 1;
  [...block.children].forEach((row) => {
    const slideContent = {};
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
        img.setAttribute('loading', 'eager');
        const ratio = (parseInt(img.height, 10) / parseInt(img.width, 10)) * 100;
        pic.style.paddingBottom = `${ratio}%`;
        if (vpWidth < 1600) {
          slider.style.maxHeight = `${img.height}px`;
        }
        slideContent.img = img.getAttribute('src');
        const mobilePic = col.querySelectorAll('picture')[1];
        if (mobilePic) {
          const mobileImg = mobilePic.querySelector('img');
          mobileImg.setAttribute('loading', 'eager');
          slideContent.mobileImg = mobileImg.getAttribute('src');
          mobRatio = (parseInt(mobileImg.height, 10) / parseInt(mobileImg.width, 10)) * 100;
          slideContent.mobilePic = mobilePic;
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
    const mobileBanner = mobSlide.querySelector('.slide-banner');
    mobileBanner.style.paddingBottom = `${mobRatio}%`;
    mobileBanner.style.maxHeight = `${vpWidth * (mobRatio / 100)}px`;

    const dtSlide = document.createElement('div');
    dtSlide.className = `slide slide-${slideIndex}`;
    if (slideIndex === 1) {
      dtSlide.classList.add('active');
    }
    createDesktopSlide(dtSlide, slideContent);
    slider.append(dtSlide);
    dtSlidesWrapper.append(slider);

    const dot = document.createElement('span');
    dot.className = `dot dot-${slideIndex}`;
    if (slideIndex === 1) {
      dot.classList.add('active');
    }
    dtDotsWrapper.append(dot);

    const boxOffer = document.createElement('div');
    boxOffer.className = `box-offer box-offer-${slideIndex}`;
    if (slideIndex === 1) {
      boxOffer.classList.add('active');
    }
    createBoxOffer(boxOffer, slideContent);
    dtBannerBoxWrapper.append(boxOffer);

    slideIndex += 1;
  });
  // create bouncing arrow
  const bouncingArrow = document.createElement('span');
  bouncingArrow.className = 'bouncing-arrow';
  bouncingArrow.innerHTML = '<span class="icon icon-carousel-chevron"></span>';
  const carousel = document.querySelector('.carousel');
  window.addEventListener('scroll', () => {
    if (carousel) {
      const carouselBottom = carousel.offsetTop + carousel.offsetHeight;
      if (window.scrollY > carouselBottom) {
        bouncingArrow.classList.add('inactive');
      } else {
        bouncingArrow.classList.remove('inactive');
      }
    }
  });

  bouncingArrow.addEventListener('click', () => {
    const slideCount = mobileSlidesWrapper.querySelectorAll('.slide').length;
    const carouselTop = carousel.offsetTop;
    const carouselHeight = carousel.offsetHeight;
    const carouselBottom = carouselTop + carouselHeight;
    const { scrollY } = window;
    const scrollBy = (carouselHeight / slideCount) + 10;
    if (scrollY < carouselBottom) {
      window.scrollTo({
        top: scrollY + scrollBy,
        behavior: 'smooth',
      });
    }
  });

  mobileSlidesWrapper.append(bouncingArrow);
  dtSlidesWrapper.append(dtDotsWrapper);
  dtSlidesWrapper.append(dtBannerBoxWrapper);
  if (vpWidth > 600) {
    block.replaceChildren(dtSlidesWrapper);
  } else {
    block.replaceChildren(mobileSlidesWrapper);
  }

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
    slideIndex = parseInt(e.target.className.split(' ')[1].split('-')[1], 10);
    changeSlide(slideIndex, dtSlidesWrapper, dtDotsWrapper, dtBannerBoxWrapper);
  });
  dtBannerBoxWrapper.addEventListener('mouseover', (e) => {
    const boxOffer = e.target.closest('.box-offer');
    slideIndex = parseInt(boxOffer.className.split(' ')[1].split('-')[2], 10);
    changeSlide(slideIndex, dtSlidesWrapper, dtDotsWrapper, dtBannerBoxWrapper);
  });

  // auto rotate slides
  const dtSlides = dtSlidesWrapper.querySelectorAll('.slide');
  slideIndex = 1;
  let intervalId;
  const startAutoScroll = () => {
    intervalId = setInterval(() => {
      if (slideIndex > dtSlides.length) {
        slideIndex = 1;
      }
      changeSlide(slideIndex, dtSlidesWrapper, dtDotsWrapper, dtBannerBoxWrapper);
      slideIndex += 1;
    }, transitionDuration * 1000);
  };
  const stopAutoScroll = () => {
    clearInterval(intervalId);
  };
  startAutoScroll();
  dtSlidesWrapper.querySelector('.slider #right').addEventListener('mouseover', stopAutoScroll);
  dtSlidesWrapper.querySelector('.slider #left').addEventListener('mouseover', stopAutoScroll);
  dtSlidesWrapper.querySelector('.slider #right').addEventListener('mouseout', startAutoScroll);
  dtSlidesWrapper.querySelector('.slider #left').addEventListener('mouseout', startAutoScroll);
}

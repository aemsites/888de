/* eslint-disable function-paren-newline */
// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';
import { div } from './dom-helpers.js';
// eslint-disable-next-line import/no-cycle
import { loadFragment } from '../blocks/fragment/fragment.js';
import { close } from '../blocks/header/header.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// google tag manager
function loadGTM() {
  // ignore if non-prod
  const host = window.location.hostname;
  if (host.includes('localhost') || host.includes('.page') || host.includes('.live')) return;

  const scriptTag = document.createElement('script');
  scriptTag.innerHTML = `
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.setAttribute('class','optanon-category-C0001');j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-NSNT2WJ');`;
  document.head.append(scriptTag);
}

loadGTM();

async function loginModal() {
  const loginHtml = await loadFragment('/login');
  const $modalContent = div();
  while (loginHtml.firstElementChild) $modalContent.append(loginHtml.firstElementChild);
  const $closeBtn = div({ class: 'close' }, 'X');
  const $loginModal = div({ class: 'login-modal' },
    $closeBtn,
    $modalContent,
  );
  $closeBtn.addEventListener('click', () => close('modal'));

  const $body = document.body;
  $body.append($loginModal);
  $body.classList.add('login-ready');
}

loginModal();

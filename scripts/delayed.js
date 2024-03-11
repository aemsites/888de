// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// google tag manager
function loadGTM() {
  // ignore if non-prod host
  const host = window.location.hostname;
  if (host.includes('localhost') || host.includes('.page') || host.includes('.live')) return;

  const scriptTag = document.createElement('script');
  scriptTag.innerHTML = `
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.setAttribute('class','optanon-category-C0001');j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-NSNT2WJ');`;
  document.head.prepend(scriptTag);
}

loadGTM();

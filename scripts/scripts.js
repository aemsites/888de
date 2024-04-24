/* eslint-disable function-paren-newline */
import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  getMetadata,
} from './aem.js';

import {
  ol, li, a as anchor, span, meta,
} from './dom-helpers.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * when a link is immediately following an icon or picture and
 the link text contains the URL, link it.
 */
export function wrapSpanLink(element = document) {
  element.querySelectorAll('span.icon + a, picture + a').forEach((a) => {
    a.innerHTML = '';
    a.append(a.previousElementSibling);
  });
}

/**
 * Writes a script element with the LD JSON struct to the page
 * @param {HTMLElement} parent
 * @param {Object} json
 */
export function addLdJsonScript(parent, json) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.innerHTML = JSON.stringify(json);
  parent.append(script);
}

/** allow for link attributes to be added into link text
 * ex: Link Text{target=blank|rel=noopener}
 * @param main
 */
export function buildLinks(main) {
  main.querySelectorAll('a').forEach((a) => {
    const match = a.textContent.match(/(.*){([^}]*)}/);
    if (match) {
      // eslint-disable-next-line no-unused-vars
      const [_, linkText, attrs] = match;
      a.textContent = linkText;
      // match all attributes between curly braces
      attrs.split('|').forEach((attr) => {
        const [key, ...values] = attr.split('=');
        const value = values.join('=');
        //  a.setAttribute(key.trim(), value.trim());
        a.setAttribute(key, value);

        // if <a> has onclick=SmartButton()
        if (key === 'onclick' && value.includes('SmartButton')) {
          // set href to #
          a.setAttribute('href', '#');
          // use SmartButtion function
          a.addEventListener('click', (e) => {
            e.preventDefault();
          });
        }
      });
    }
  });
}

/**
 * Decorates paragraphs containing a single link as buttons.
 * @param {Element} element container element
 */
export function decorateButtons(element) {
  element.querySelectorAll('a').forEach((a) => {
    if (a.href !== a.textContent) {
      const up = a.parentElement;
      const twoup = a.parentElement.parentElement;
      if (!a.querySelector('img')) {
        // let default button be text-only, no decoration
        const linkText = a.textContent;
        const linkTextEl = document.createElement('span');
        linkTextEl.classList.add('link-button-text');
        linkTextEl.append(linkText);
        a.textContent = `${linkText}`;
        if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
          a.textContent = '';
          a.className = 'button text'; // default
          up.classList.add('button-container');
          a.append(linkTextEl);
        }
        if (up.childNodes.length === 2 && up.tagName === 'DIV' && up.querySelector('.icon')) {
          const icon = up.querySelector('.icon');
          a.textContent = '';
          a.className = 'button text'; // default
          up.classList.add('button-container', 'button-icon');
          a.append(icon);
          a.append(linkTextEl);
        }
        if (up.childNodes.length === 1
            && up.tagName === 'STRONG'
            && twoup.childNodes.length === 1
            && twoup.tagName === 'P'
        ) {
          a.className = 'button primary';
          twoup.classList.add('button-container');
        }
        if (up.childNodes.length === 1
            && up.tagName === 'EM'
            && twoup.childNodes.length === 1
            && twoup.tagName === 'P'
        ) {
          a.className = 'button secondary';
          twoup.classList.add('button-container');
        }
      }
    }
  });
}

export function decorateExternalLinks(main) {
  main.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href) {
      if (!href.startsWith('/') // in case of local paths
          && !href.startsWith('#')) { // in case of anchors
        if (!href.includes('888.de') // link is internal
          && a.getAttribute('target') === null) { // external link has target attr
          a.setAttribute('target', '_blank');
        }
      }
    }
  });
}

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

const resizeListeners = new WeakMap();

/**
 * Sets section metadata background-image's optimized size from the provided breakpoints.
 *
 * @param {HTMLElement} section - The section element to which the background image will be applied.
 * @param {string} bgImage - The base URL of the background image.
 * @param {Array<{width: string, media?: string}>} [breakpoints=[
 *  { width: '450' },
 *  { media: '(min-width: 450px)', width: '750' },
 *  { media: '(min-width: 750px)', width: '2000' }
 * ]] - An array of breakpoint objects which contain a `width` value of the requested image, and
 * an optional `media` query string indicating which breakpoint to use that image.
 */
function createOptimizedBackgroundImage(section, bgImage, breakpoints = [
  { width: '750' },
  { media: '(min-width: 600px)', width: '2000' },
]) {
  const updateBackground = () => {
    const url = new URL(bgImage, window.location.href);
    const pathname = encodeURI(url.pathname);

    // Filter all matching breakpoints + pick the one with the highest resolution
    const matchedBreakpoints = breakpoints
      .filter((breakpoint) => !breakpoint.media || window.matchMedia(breakpoint.media).matches);
    let matchedBreakpoint;
    if (matchedBreakpoints.length) {
      matchedBreakpoint = matchedBreakpoints
        .reduce((acc, curr) => (parseInt(curr.width, 10) > parseInt(acc.width, 10) ? curr : acc));
    } else {
      [matchedBreakpoint] = breakpoints;
    }

    const adjustedWidth = matchedBreakpoint.width * window.devicePixelRatio;
    section.style.backgroundImage = `url(${pathname}?width=${adjustedWidth}&format=webply&optimize=medium)`;
    section.style.backgroundSize = 'cover';
  };

  // If a listener already exists for this section, remove it
  if (resizeListeners.has(section)) {
    window.removeEventListener('resize', resizeListeners.get(section));
  }

  // Store this function in the WeakMap for this section, attach + update background
  resizeListeners.set(section, updateBackground);
  window.addEventListener('resize', updateBackground);
  updateBackground();
}

/**
 * Finds all sections in the main element of the document
 * that require additional decoration: adding
 * a background image or an arc effect.
 * @param {Element} main
 */

function decorateStyledSections(main) {
  Array.from(main.querySelectorAll('.section-outer[data-background-image]'))
    .forEach((section) => {
      const bgImage = section.dataset.backgroundImage;
      if (bgImage) {
        createOptimizedBackgroundImage(section, bgImage);
      }
    });
  Array.from(main.querySelectorAll('.section-outer[data-nav-id]'))
    .forEach((section) => {
      const id = section.dataset.navId;
      section.id = id;
    });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  buildLinks(main);
  decorateButtons(main);
  decorateExternalLinks(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  wrapSpanLink(main);
  decorateStyledSections(main);
}

/**
 * Decorates per the template.
 */
export async function loadTemplate(doc, templateName) {
  try {
    const cssLoaded = new Promise((resolve) => {
      loadCSS(`${window.hlx.codeBasePath}/templates/${templateName}/${templateName}.css`).then((resolve)).catch((err) => {
        // eslint-disable-next-line no-console
        console.error(`failed to load css module for ${templateName}`, err.target.href);
        resolve();
      });
    });
    const decorationComplete = new Promise((resolve) => {
      (async () => {
        try {
          const mod = await import(`../templates/${templateName}/${templateName}.js`);
          if (mod.default) {
            await mod.default(doc);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(`failed to load module for ${templateName}`, error);
        }
        resolve();
      })();
    });

    document.body.classList.add(`${templateName}-template`);

    await Promise.all([cssLoaded, decorationComplete]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`failed to load block ${templateName}`, error);
  }
}

/**
 * Builds breadcrumbs and return object.
 * @param {Element} main The container element
 */
export async function breadcrumbs(doc) {
  const { location } = window;
  const pathname = location.pathname.split('/');
  const segments = pathname.filter((segment) => segment.trim() !== '');

  function crumb(name, href, index) {
    return li({ itemprop: 'itemListElement', itemscope: '', itemtype: 'https://schema.org/ListItem' },
      anchor({ itemprop: 'item', href },
        span({ itemprop: 'name' }, name),
      ),
      meta({ itemprop: 'position', content: index }),
    );
  }

  async function title(response) {
    const html = await response.text();
    const parser = new DOMParser();
    const page = parser.parseFromString(html, 'text/html');
    return page.querySelector('h1').textContent;
  }

  const $breadcrumbs = ol({ class: 'breadcrumbs', itemscope: '', itemtype: 'https://schema.org/BreadcrumbList' },
    crumb('888.de', '/', '0'),
  );

  // get all page segments asynchronously
  const crumbSegments = segments.map(async (segment, index) => {
    let href = `${window.location.origin}/${segments.slice(0, index + 1).join('/')}/`;
    let h1;

    if (index === segments.length - 1) {
      // current page
      href = window.location.href;
      h1 = doc.querySelector('h1').textContent;
    } else {
      const getIndexHTML = await fetch(`${href}index.plain.html`);
      if (getIndexHTML.ok) {
        h1 = await title(getIndexHTML);
      } else {
        // get h1 from page index-breadcrumb doc
        const getBreadcrumbHTML = await fetch(`${href}index-breadcrumb.plain.html`);
        h1 = await title(getBreadcrumbHTML);
      }
    }
    return crumb(h1, href, index + 1);
  });

  // wait for promises to resolve
  const crumbs = await Promise.all(crumbSegments);
  crumbs.forEach(($crumb) => { $breadcrumbs.append($crumb); });
  return $breadcrumbs;
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'de';
  const templateName = getMetadata('template');
  decorateTemplateAndTheme(templateName);

  const $body = doc.querySelector('body');
  $body.setAttribute('itemscope', '');
  $body.setAttribute('itemtype', 'https://schema.org/WebPage');

  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    if (templateName) {
      await loadTemplate(doc, templateName.toLowerCase());
    }
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

async function loadLazy(doc) {
  const main = doc.querySelector('main');
  loadHeader(doc.querySelector('header')); // Moving this here per David N.
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();
  // loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

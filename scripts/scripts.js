import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  getMetadata,
  toClassName,
} from './aem.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * when a link is immediately following an icon or picture and
 the link text contains the URL, link it.
 */
export function wrapSpanLink(element = document) {
  element.querySelectorAll('span.icon + a, picture + a').forEach((a) => {
    if (a.href === a.innerHTML) {
      a.innerHTML = '';
      a.append(a.previousElementSibling);
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
      a.title = linkText;
      // match all attributes between curly braces
      attrs.split('|').forEach((attr) => {
        const [key, value] = attr.split('=');
        //  a.setAttribute(key.trim(), value.trim());
        a.setAttribute(key, value);
      });
    }
  });
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

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  buildLinks(main);
  wrapSpanLink(document);
}

/**
 * Decorates per the template.
 */
async function loadTemplate(main) {
  try {
    const templateName = toClassName(getMetadata('template'));
    const template = await import(`../templates/${templateName}/${templateName}.js`);
    loadCSS(`${window.hlx.codeBasePath}/templates/${templateName}/${templateName}.css`);
    if (template.default) {
      await template.default(main);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('template loading failed', error);
  }
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
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

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
const templateName = getMetadata('template');
if (templateName) {
  await loadTemplate(templateName);
}

async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
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

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
/* eslint-disable no-useless-concat */
/* eslint-disable func-names */

window.addQueryParameter = (src) => {
  if (!src.href.includes(sCut)) {
    src.href += (src.href.includes('?') ? '&' : '?') + sCut;
  }
};

// extracts the top-level domain (TLD) from the current window's location
const locateDomain = window.location.hostname.substring(window.location.hostname.indexOf('.'));

// Smart Button
const iosRegex = /(like mac os x)/i;
const androidRegex = /(android)/i;
const mobileRegex = /(blackberry|samsung|palm|bolt|symbian|fennec|nokia|kindle|phone|mini|ericsson|teashark|teleca)/i;
const userAgent = window.sUserAgent || window.rlUserAgent || navigator.userAgent;
// eslint-disable-next-line max-len
const isMobile = iosRegex.test(userAgent) || mobileRegex.test(userAgent) || androidRegex.test(userAgent);
// eslint-disable-next-line no-unused-vars
const dlp = '';
const rlWtc = '';
let casinoURL;
let pokerURL;
let sportURL;
let bingoURL;
let homeSite;
let cashier;
const pokerNDLURL = '//ndl.triple8holdem.com/';

if (locateDomain === '.888.ca') {
  casinoURL = 'www.888casino.ca';
  pokerURL = 'www.888poker.ca';
  sportURL = 'www.888sport.ca';
  bingoURL = 'www.888ladies.com';
  homeSite = 'www.888.ca';
  cashier = 'www.safe-cashier.com/C2/Account/Login/';
}

if (locateDomain === '.888.de') {
  casinoURL = 'www.888slots.de';
  pokerURL = 'www.888poker.de';
  sportURL = 'www.888sport.de';
  bingoURL = 'www.888ladies.com';
  homeSite = 'www.888.de';
  cashier = 'www.safe-cashier.com/C2/Account/Login/';
}

if (locateDomain === '.888.ro') {
  casinoURL = 'www.888casino.ro';
  pokerURL = 'www.888poker.ro';
  sportURL = 'www.888sport.ro';
  bingoURL = 'www.888ladies.com';
  homeSite = 'www.888.ro';
  cashier = 'www.safe-cashier.com/C2/Account/Login/';
}

// Google Analytics
window.MyGoogleAnalytics = {
  trackEvent(category, action, label, value) {
    if (!(MyGtm.exists() && MyGtm.trigger(category, action, label))) {
      try {
        if ('pageTracker' in window) {
          pageTracker._trackEvent(category || 'UNKNOWN', action || 'UNKNOWN', label, value);
        } else if ('ga' in window) {
          ga('send', 'event', category || 'UNKNOWN', action || 'UNKNOWN', label, value);
        } else {
          window._gaq = window._gaq || [];
          window._gaq.push(['_trackEvent', category || 'UNKNOWN', action || 'UNKNOWN', label, value]);
        }
      } catch (e) { /* empty */ }
    }
  },
  logError(component, methodName, errorName, parameters) {
    this.trackEvent('Errors', `${component}::${methodName}::${errorName}`, parameters);
  },
};

// GTM
window.googleTagManager = {
  exists() {
    return typeof dataLayer !== 'undefined' && dataLayer && dataLayer instanceof Array && dataLayer.length > 0 && dataLayer[0].serial;
  },
  trigger(eventType, category, label, isAnalytics, action, dynamicParams) {
    let success = false;
    if (this.exists()) {
      const eventData = {
        event: eventType || 'UNKNOWN',
        category: category || 'UNKNOWN',
        label: label || 'UNKNOWN',
        action: action || 'UNKNOWN',
        isAnalytics: isAnalytics || 'true',
      };

      if (arguments.length === 6) {
        if (checkIfJson(dynamicParams)) {
          try {
            // eslint-disable-next-line no-restricted-syntax, guard-for-in
            for (const param in dynamicParams) {
              eventData[param] = dynamicParams[param];
            }
          } catch (exception) {
            GoogleAnalytics.error('triggerEvent', 'DynamicParam', `Exception::${exception.message}`);
          }
        }
      }

      try {
        dataLayer.push(eventData);
        success = true;
      } catch (exception) {
        GoogleAnalytics.error('triggerEvent', 'pushDataLayer', `Exception::${exception.message}`);
      }
    }
    return success;
  },
};

function generateDLPParameter() {
  let dlpParameter = '';
  try {
    dlpParameter = encodeURIComponent(document.location.href);
    // eslint-disable-next-line no-useless-escape
    dlpParameter = dlpParameter.replace(/\.|\#/gi, '%2E');
    return dlpParameter;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('DLP Not Sent');
  }
}

const dlpValue = generateDLPParameter();
const siteActions = {
  '888poker': {
    actions: {
      register(dl) {
        if (dl != null) {
          return `${pokerURL}/register/?dl=${dl}&dlp=${dlpValue}&${sCut}`;
        }
        return `${pokerURL}/register/?dlp=${dlpValue}&${sCut}`;
      },
      login: {
        url: `${pokerURL}/openclient.htm?dlp=${dlpValue}&${sCut}`,
      },
      cashier(promoCode) {
        if (promoCode != null) {
          return `${cashier}?brandid=1&promocode=${promoCode}&${sCut}`;
        }
        return `${cashier}?brandid=1&${sCut}`;
      },
      play: {
        url(dl) {
          if (isMobile) {
            if (dl != null) {
              return `${pokerURL}/router/` + `/?dl=${dl}&dlp=${dlpValue}&${sCut}`;
            }
            return `${pokerURL}/router/` + `/?dlp=${dlpValue}&${sCut}`;
          } if (dl != null) {
            return `${pokerNDLURL}?dl=${dl}&dlp=${dlpValue}&${sCut}`;
          }
          return `${pokerNDLURL}?dlp=${dlpValue}&${sCut}`;
        },
      },
      download: {
        url(dl) {
          if (dl != null) {
            return `${pokerURL}/router/?dl=${dl}&dlp=${dlpValue}&${sCut}`;
          }
          return `${pokerURL}/router/?dlp=${dlpValue}&${sCut}`;
        },
      },
    },
  },
  '888casino': {
    actions: {
      register(dl) {
        if (dl != null) {
          if (locateDomain === '.888.de') {
            return `${casinoURL}/registrieren/?dlp=${dlpValue}&${sCut}`;
          }
          return `${casinoURL}/register/?dlp=${dlpValue}&${sCut}`;
        }
        return `${casinoURL}?dlp=${dlpValue}&${sCut}&#deeplink={"action":"register"}`;
      },
      play: {
        url(dl) {
          if (dl != null) {
            return `${casinoURL}/play/?dl=${dl}&dlp=${dlpValue}&${sCut}`;
          }
          return `${casinoURL}/play/?dlp=${dlpValue}&${sCut}`;
        },
      },
      login: {
        url: `${casinoURL}?dlp=${dlpValue}&${sCut}&#deeplink={"action":"login"}`,
      },
      cashier(promoCode) {
        if (promoCode != null) {
          return `${casinoURL}?dlp=${dlpValue}&${sCut}&#deeplink={"action":"cashier", "action_next":"7, ${promoCode}"}`;
        }
        return `${casinoURL}?dlp=${dlpValue}&${sCut}&#deeplink={"action":"cashier"}`;
      },
    },
  },
  '888sport': {
    actions: {
      register(dl) {
        if (dl != null) {
          return `${sportURL}/?dl=${dl}&dlp=${dlpValue}&wtc=${rlWtc}&${sCut}&deeplink=opennrs`;
        }
        return `${sportURL}/?dlp=${dlpValue}&wtc=${rlWtc}&${sCut}&deeplink=opennrs`;
      },
      login: {
        url: `${sportURL}?dlp=${dlpValue}&${sCut}&deeplink=openlogin`,
      },
      cashier(promoCode) {
        if (promoCode != null) {
          return `${cashier}?brandid=8&promocode=${promoCode}&${sCut}`;
        }
        return `${cashier}?brandid=8&${sCut}`;
      },
    },
  },
  '888bingo': {
    actions: {
      register: {
        url(dl) {
          if (dl != null) {
            return isMobile === true ? `play.888ladies.com/#/registration?dlp=${dlpValue}&dl=${dl}&${sCut}` : `${bingoURL}/register/?dlp=${dlpValue}&dl=${dl}&${sCut}`;
          }
          return isMobile === true ? `play.888ladies.com/#/registration?dlp=${dlpValue}&${sCut}` : `${bingoURL}/register/?dlp=${dlpValue}&${sCut}`;
        },
      },
      login: {
        url(dl) {
          if (dl != null) {
            return isMobile === true ? `play.888ladies.com/#/Login?dlp=${dlpValue}&dl=${dl}&${sCut}` : `${bingoURL}/loginpage/?dlp=${dlpValue}&dl=${dl}&${sCut}`;
          }
          return isMobile === true ? `play.888ladies.com/#/Login?dlp=${dlpValue}&${sCut}` : `${bingoURL}/loginpage/?dlp=${dlpValue}&${sCut}`;
        },
      },
    },
  },
};

window.addAnchor = function (src, anchor) {
  if (src.href.indexOf(anchor) !== -1) {
    const strUrl = src.href.replace(anchor, '') + anchor;
    src.href = strUrl;
  }
};

window.addAnchorParams = function (src, anchor, target) {
  if (src.indexOf('?') === -1) {
    src = `${src}?${sCut}`;
  } else {
    src = `${src.href}&${sCut}`;
  }
  src += anchor;
  window.open(src, target);
};

window.SmartButton = function (brand, action, dl, promoCode) {
  const urlEnva = window.location.host;
  let enva = '';
  if (urlEnva.search('stage') === 0) {
    enva = 'stage-';
  }
  if (siteActions[brand].actions[action]) {
    if (brand !== '888bingo') {
      switch (action) {
        case 'cashier':
          window.open(`${window.location.protocol}//${enva}${siteActions[brand].actions[action](promoCode)}`, '_self');
          break;
        case 'register':
          window.open(`${window.location.protocol}//${enva}${siteActions[brand].actions[action](dl)}`, '_self');
          break;
        default:
          if (brand === '888poker' && action === 'download') {
            setTimeout(() => {
              window.location.href = `${window.location.protocol}//${enva}${pokerURL}/download/?dl=${dl}&dlp=${dlpValue}&${sCut}`;
            }, 2000);
            window.open(`${window.location.protocol}//${enva}${siteActions[brand].actions[action].url(dl)}`, '_self');
          } else if (brand === '888poker' && action === 'play') {
            if (isMobile) {
              // eslint-disable-next-line max-len
              // window.location.href = window.location.protocol + '//' + enva + SDPokerURL + '/download/?dl=' + dl + '&dlp=' + dlp + '&' + sCut;
              window.open(`${window.location.protocol}//${enva}${siteActions[brand].actions[action].url(dl)}`, '_self');
            } else {
              window.open(siteActions[brand].actions[action].url(dl), '_blank');
            }
          } else if (brand === '888casino' && action === 'play') {
            window.open(`${window.location.protocol}//${enva}${siteActions[brand].actions[action].url(dl)}`, '_self');
          } else {
            window.open(`${window.location.protocol}//${enva}${siteActions[brand].actions[action].url}`, '_self');
          }
          break;
      }
    } else {
      window.open(`${window.location.protocol}//${enva}${siteActions[brand].actions[action].url(dl)}`, '_self');
    }
  } else {
    window.open(`${window.location.protocol}//${enva}${homeSite}`, '_self');
  }
};

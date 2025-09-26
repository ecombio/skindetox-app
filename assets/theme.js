"use strict";
const global = {
  announcementBar: "announcement-bar",
  overlay: ".bls__overlay",
  header: "header",
  mobile_stickybar: "shopify-section-mobile-stickybar",
};
const SCROLL_ZOOM_IN_TRIGGER_CLASSNAME = 'animate--zoom-in';

window.addEventListener('load', function () {
  const padding = window.innerWidth - document.body.clientWidth;
  if (padding > 0) {
    document.querySelector('html').setAttribute('style', `--padding-right: ${padding}px`)
  }
})

function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  };
}

function initializeScrollZoomAnimationTrigger() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const animationTriggerElements = Array.from(document.getElementsByClassName(SCROLL_ZOOM_IN_TRIGGER_CLASSNAME));

  if (animationTriggerElements.length === 0) return;

  const scaleAmount = 0.2 / 100;

  animationTriggerElements.forEach((element) => {
    let elementIsVisible = false;
    const observer = new IntersectionObserver((elements) => {
      elements.forEach((entry) => {
        elementIsVisible = entry.isIntersecting;
      });
    });
    observer.observe(element);
    element.style.setProperty('--zoom-in-ratio', 1 + scaleAmount * percentageSeen(element));
    window.addEventListener(
      'scroll',
      throttle(() => {
        if (!elementIsVisible) return;
        element.style.setProperty('--zoom-in-ratio', 1 + scaleAmount * percentageSeen(element));
      }),
      { passive: true }
    );
  });
}

function percentageSeen(element) {
  const viewportHeight = window.innerHeight;
  const scrollY = window.scrollY;
  const elementPositionY = element.getBoundingClientRect().top + scrollY;
  const elementHeight = element.offsetHeight;
  if (elementPositionY > scrollY + viewportHeight) {
    return 0;
  } else if (elementPositionY + elementHeight < scrollY) {
    return 100;
  }
  const distance = scrollY + viewportHeight - elementPositionY;
  let percentage = distance / ((viewportHeight + elementHeight) / 100);
  return Math.round(percentage);
}

window.addEventListener('DOMContentLoaded', () => {
  initializeScrollZoomAnimationTrigger();
});

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function HoverIntent(elements, userConfig) {
  const defaultOptions = {
    exitDelay: 180,
    interval: 100,
    sensitivity: 6,
  };
  let config = {};
  let currX, currY, prevX, prevY;
  let allElems, pollTimer, exitTimer;
  const extend = function (defaults, userArgs) {
    for (let i in userArgs) {
      defaults[i] = userArgs[i];
    }
    return defaults;
  };
  const mouseTrack = function (ev) {
    currX = ev.pageX;
    currY = ev.pageY;
  };
  const mouseCompare = function (targetElem) {
    const distX = prevX - currX, distY = prevY - currY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    if (distance < config.sensitivity) {
      clearTimeout(exitTimer);
      for (let elem of allElems) {
        if (elem.isActive) {
          config.onExit(elem);
          elem.isActive = false;
        }
      }
      config.onEnter(targetElem);
      targetElem.isActive = true;
    } else {
      prevX = currX;
      prevY = currY;
      pollTimer = setTimeout(function () {
        mouseCompare(targetElem);
      }, config.interval);
    }
  };
  const init = function (elements, userConfig) {
    if (!userConfig || !userConfig.onEnter || !userConfig.onExit) {
      throw 'onEnter and onExit callbacks must be provided';
    }
    config = extend(defaultOptions, userConfig);
    allElems = elements;
    for (let elem of allElems) {
      if (!elem) return;
      elem.isActive = false;
      elem.addEventListener('mousemove', mouseTrack);
      elem.addEventListener('mouseenter', function (ev) {
        prevX = ev.pageX;
        prevY = ev.pageY;
        if (elem.isActive) {
          clearTimeout(exitTimer);
          return;
        }
        pollTimer = setTimeout(function () {
          mouseCompare(elem);
        }, config.interval);
      });
      elem.addEventListener('mouseleave', function (ev) {
        clearTimeout(pollTimer);
        if (!elem.isActive)
          return;
        exitTimer = setTimeout(function () {
          config.onExit(elem);
          elem.isActive = false;
        }, config.exitDelay);
      });
    }
  };
  init(elements, userConfig);
};
var menuItems = document.querySelectorAll('.bls__menu-parent');
var menuDropdown1 = document.querySelectorAll('.dropdown li.level-1');
var menuDropdown2 = document.querySelectorAll('.dropdown li.level-2');

HoverIntent(menuItems, {
  // required parameters
  onEnter: function (targetItem) {
    targetItem.classList.add('visible');
  },
  onExit: function (targetItem) {
    targetItem.classList.remove('visible');
  },
});

HoverIntent(menuDropdown1, {
  // required parameters
  onEnter: function (targetItem) {
    targetItem.classList.add('visible');
  },
  onExit: function (targetItem) {
    targetItem.classList.remove('visible');
  },
});

HoverIntent(menuDropdown2, {
  // required parameters
  onEnter: function (targetItem) {
    targetItem.classList.add('visible');
  },
  onExit: function (targetItem) {
    targetItem.classList.remove('visible');
  },
});

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}
class FeatureButton extends HTMLElement {
  constructor() {
    super();
    this.init();
    this.initButton();
  }

  init() {
    this.querySelectorAll("a.demo").forEach((button) =>
      button.addEventListener("click", this.onButtonClick.bind(this))
    );
  }

  initButton() {
    this.querySelectorAll("button.demo").forEach((button) =>
      button.addEventListener("click", this.onButtonClick.bind(this))
    );
  }

  onButtonClick(event) {
    event.preventDefault();
    const is_shown = document.querySelector("#dlg-demo-feature_0");
    if (event.currentTarget && is_shown === null) {
      var fbtn = EasyDialogBox.create(
        "dlg-demo-feature",
        "dlg dlg-disable-heading dlg-disable-footer dlg-disable-drag",
        "",
        this.htmlRender().outerHTML
      );
      fbtn.onClose = fbtn.destroy;
      fbtn.show();
    }
  }
  htmlRender() {
    const container = document.createElement("div");
    const parent = document.createElement("div");
    const listHome = `
      {
        "home1": ["main-demo.jpg", "146577129769", "Main Demo", "Popular", "Clothing & Fashion Demo", "v1"],
        "home4": ["4.jpg", "146577326377", "TikTok Fashion", "Popular", "Clothing & Fashion Demo", "v1"],
        "home3": ["simple-morden.jpg", "146577359145", "Simple Modern", "Popular", "Clothing & Fashion Demo", "v1"],
        "home21": ["22.jpg", "151227695401", "Mega Store", "Popular", "Supermarket & Tech Demo", "v2"],
        "home15": ["home-15.jpg", "148235026729", "Home Decor", "Popular", "Home & Furniture Demo", "v1"],
        "home23": ["25.jpg", "159199330601", "Swimwear", "New", "Clothing & Fashion Demo", "v2"],
        "home25": ["29.jpg", "160724058409", "Fashion Elegance", "New", "Clothing and Fashion Demo", "v2"],
        "home26": ["27.jpg", "160318980393", "Christmas", "New", "Home and Garden Demo", "v2"],
        "home2": ["skin-care.jpg", "146577522985", "Skincare", "Popular", "Health & Beauty Demo", "v1"],
        "home24": ["26.jpg", "159413633321", "Organic Foods", "New", "Organic Food and Drink Demo", "v2"],
        "home27": ["28.jpg", "160540393769", "Halloween", "New", "Home and Garden Demo", "v2"],
        "home22": ["24.jpg", "154227638569", "Gym Fitness", "", "Sports and Recreation Demo", "v2"],
        "home13": ["digital-1.jpg", "147055903017", "Smart Digital", "Popular", "Supermarket & Tech Demo", "v1"],
        "home14": ["digital-2.jpg", "147477037353", "Mega Digital", "", "Supermarket & Tech Demo", "v1"],
        "home10": ["watches.jpg", "146577457449", "Unique Watches", "Popular", "Modern Watches Demo", "v1"],
        "home5": ["trendy-style.jpg", "146577490217", "Trendy Style", "", "Clothing & Fashion Demo", "v1"],
        "home20": ["20.jpg", "149694939433", "Sneaker Store", "", "Clothing & Fashion Demo", "v1"],
        "home8": ["colthing-store.jpg", "146577228073", "Clothing Store", "Popular", "Clothing & Fashion Demo", "v1"],
        "home11": ["underwear.jpg", "146577424681", "Underwear", "", "Clothing & Fashion Demo", "v1"],
        "home16": ["home-16.jpg", "148448837929", "Minimal Furniture", "", "Home & Furniture Demo", "v1"],
        "home6": ["minimal-colthing.jpg", "146577391913", "Minimal Clothings", "", "Clothing & Fashion Demo", "v1"],
        "home7": ["men-luxury.jpg", "146577260841", "Men\'s Luxury", "", "Clothing & Fashion Demo", "v1"],
        "home9": ["categories-men.jpg", "146577195305", "Categories Men\'s", "", "Clothing & Fashion Demo", "v1"],
        "home18": ["cosmetic.jpg", "149242773801", "Cosmetics", "", "Cosmetic & Beauty Demo", "v1"],
        "home17": ["home-14.jpg", "147869466921", "Adventure Gear", "", "Outdoor & Camping Demo", "v1"],
        "home19": ["21.jpg", "150281126185", "Radiant Jewelry", "", "Jewelry & Accessories Demo", "v1"],
        "home12": ["rtl.jpg", "163055403305", "RTL Demo", "", "Clothing & Fashion Demo", "v1"]
      }`
    const myObjHomeDemo = JSON.parse(listHome);

    container.setAttribute("class", "preview-demo-home-page");
    parent.setAttribute("class", "uminio-grid row");
    for (let itemH in myObjHomeDemo) {
      const themeImage = document.createElement("div");
      themeImage.setAttribute("class", "theme-img");
      const aDemoLinkImg = document.createElement("a");
      aDemoLinkImg.setAttribute("target", "_blank");
      if (myObjHomeDemo[itemH][5] == "v1") {
        aDemoLinkImg.setAttribute(
          "href",
          "https://umino-demo.myshopify.com/?preview_theme_id=" +
          myObjHomeDemo[itemH][1]
        );
      } else if (myObjHomeDemo[itemH][5] == "v2") {
        aDemoLinkImg.setAttribute(
          "href",
          "https://umino-demo-v2.myshopify.com/?preview_theme_id=" +
          myObjHomeDemo[itemH][1]
        );
      }
      aDemoLinkImg.setAttribute("title", myObjHomeDemo[itemH][2]);
      const aDemoImg = document.createElement("img");
      aDemoImg.setAttribute("width", "350");
      aDemoImg.setAttribute("height", "256");
      aDemoImg.setAttribute("loading", "lazy");
      aDemoImg.setAttribute(
        "src",
        "https://blueskytechmage.com/shopify/umino-preview-home/" +
        myObjHomeDemo[itemH][0]
      );
      aDemoImg.setAttribute("alt", myObjHomeDemo[itemH][2]);
      aDemoLinkImg.appendChild(aDemoImg);
      if (myObjHomeDemo[itemH][3] != "") {
        const themeLabel = document.createElement("label");
        themeLabel.setAttribute(
          "class",
          "label-demo-home-postion " + myObjHomeDemo[itemH][3].toLowerCase()
        );
        themeLabel.appendChild(
          document.createTextNode(myObjHomeDemo[itemH][3])
        );
        themeImage.appendChild(themeLabel);
      }
      themeImage.appendChild(aDemoLinkImg);
      const themeInfo = document.createElement("div");
      themeInfo.setAttribute("class", "theme-info");
      const themeName = document.createElement("h3");
      const aDemoLink = document.createElement("a");
      aDemoLink.setAttribute("target", "_blank");
      if (myObjHomeDemo[itemH][5] == "v1") {
        aDemoLink.setAttribute(
          "href",
          "https://umino-demo.myshopify.com/?preview_theme_id=" +
          myObjHomeDemo[itemH][1]
        );
      } else if (myObjHomeDemo[itemH][5] == "v2") {
        aDemoLink.setAttribute(
          "href",
          "https://umino-demo-v2.myshopify.com/?preview_theme_id=" +
          myObjHomeDemo[itemH][1]
        );
      }
      aDemoLink.setAttribute("title", myObjHomeDemo[itemH][2]);
      aDemoLink.appendChild(document.createTextNode(myObjHomeDemo[itemH][2]));
      themeName.appendChild(aDemoLink);
      themeInfo.appendChild(themeName);
      const themeDes = document.createElement("p");
      themeDes.appendChild(document.createTextNode(myObjHomeDemo[itemH][4]));
      themeInfo.appendChild(themeDes);
      const itemHome = document.createElement("div");
      itemHome.setAttribute("class", "theme-item col-lg-3 col-sm-6");
      itemHome.appendChild(themeImage);
      itemHome.appendChild(themeInfo);
      parent.appendChild(itemHome);
    }
    container.appendChild(parent);
    return container;
  }
}
customElements.define("feature-button", FeatureButton);

function backToTop() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  if (document.getElementById("bls__back-top")) {
    document.getElementById("bls__back-top").style.height = scrolled + "%";
  }
}

function mobileStickyBar() {
  var stickybar = document.querySelector(".bls__mobile-stickybar");
  if (!stickybar) {
    return;
  }
  var currentScroll = window.pageYOffset;
  let headerbar = 0;
  if (document.getElementById("announcement-bar")) {
    headerbar = document.getElementById("announcement-bar")?.clientHeight;
  }
  let headertopbar = 0;
  if (document.getElementById("shopify-section-top-bar")) {
    headertopbar = document.getElementById(
      "shopify-section-top-bar"
    ).clientHeight;
  }
  let headerpage = document.getElementById("page-header")?.clientHeight;
  let headerh = headerbar + headertopbar + headerpage + 50;
  if (currentScroll > headerh) {
    stickybar.classList.remove("d-none");
  } else {
    stickybar.classList.add("d-none");
  }
}

function setCookie(cname, cvalue, exdays) {
  const date = new Date();
  date.setTime(date.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + date.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function initComparisons() {
  var x, i;
  x = document.getElementsByClassName("img-comp-overlay");
  for (i = 0; i < x.length; i++) {
    compareImages(x[i]);
  }
  function compareImages(img) {
    var slider,
      img,
      clicked = 0,
      w,
      h;
    w = img.offsetWidth;
    h = img.offsetHeight;
    const icc = img.closest(".img-comp-container");
    if (icc) {
      slider = icc.querySelector(".image-comparison__button");
    }
    if (slider) {
      slider.addEventListener("touchstart", slideReady);
      slider.addEventListener("mousedown", slideReady);
    }
    window.addEventListener("mouseup", slideFinish);
    window.addEventListener("touchend", slideFinish);
    function slideReady(e) {
      e.preventDefault();
      clicked = 1;
      window.addEventListener("mousemove", slideMove);
      window.addEventListener("touchmove", slideMove);
    }
    function slideFinish() {
      clicked = 0;
    }
    function slideMove(e) {
      var pos;
      if (clicked == 0) return false;
      pos = getCursorPos(e);
      if (pos < 0) pos = 0;
      if (pos > w) pos = w;
      slide(pos);
    }
    function getCursorPos(e) {
      var a,
        x = 0;
      e = e.changedTouches ? e.changedTouches[0] : e;
      a = img.getBoundingClientRect();
      x = e.pageX - a.left;
      x = x - window.pageXOffset;

      return x;
    }
    function slide(x) {
      if (slider) {
        var x_ps = x + slider.offsetWidth / 2 + 10;
        var percent = (x_ps / w) * 100;
        if (percent >= 100 - ((slider.offsetWidth / 2 + 10) / w) * 100) {
          percent = 100 - ((slider.offsetWidth / 2 + 10) / w) * 100;
        }
      }

      img
        .closest(".img-comp-container")
        .setAttribute(
          "style",
          "--percent: " + percent.toFixed(4) + "%;--height: " + h + "px "
        );
    }
  }
}
initComparisons();

function showAnime(target) {
  const styles = getComputedStyle(target);
  const duration = 400;
  const easing = "ease";
  target.style.overflow = "hidden";
  target.style.display = "block";
  const heightVal = {
    height: target.getBoundingClientRect().height + "px",
    marginTop: styles.marginTop,
    marginBottom: styles.marginBottom,
    paddingTop: styles.paddingTop,
    paddingBottom: styles.paddingBottom,
  };
  Object.keys(heightVal).forEach((key) => {
    if (parseFloat(heightVal[key]) === 0) {
      delete heightVal[key];
    }
  });
  if (Object.keys(heightVal).length === 0) {
    return false;
  }
  let showAnime;
  Object.keys(heightVal).forEach((key) => {
    target.style[key] = 0;
  });
  showAnime = target.animate(heightVal, {
    duration: duration,
    easing: easing,
  });
  showAnime.finished.then(() => {
    target.style.overflow = "";
    Object.keys(heightVal).forEach((key) => {
      target.style[key] = "";
    });
  });
}

function hideAnime(target) {
  const styles = getComputedStyle(target);
  const duration = 300;
  const easing = "ease";
  target.style.overflow = "hidden";
  const heightVal = {
    height: target.getBoundingClientRect().height + "px",
    marginTop: styles.marginTop,
    marginBottom: styles.marginBottom,
    paddingTop: styles.paddingTop,
    paddingBottom: styles.paddingBottom,
  };
  Object.keys(heightVal).forEach((key) => {
    if (parseFloat(heightVal[key]) === 0) {
      delete heightVal[key];
    }
  });
  if (Object.keys(heightVal).length === 0) {
    return false;
  }
  let hideAnime;
  Object.keys(heightVal).forEach((key) => {
    target.style[key] = heightVal[key];
    heightVal[key] = 0;
  });
  hideAnime = target.animate(heightVal, {
    duration: duration,
    easing: easing,
  });
  hideAnime.finished.then(() => {
    target.style.overflow = "";
    Object.keys(heightVal).forEach((key) => {
      target.style[key] = "";
      target.style.display = "none";
    });
  });
}

const slideAnimeHidden = (() => {
  let isAnimating = false;
  return (setOptions) => {
    const defaultOptions = {
      target: false,
      duration: 400,
      easing: "ease"
    };
    const options = Object.assign({}, defaultOptions, setOptions);
    const target = options.target;
    if (!target) {
      return;
    }
    const styles = getComputedStyle(target);
    target.style.overflow = "hidden";
    const duration = options.duration;
    const easing = options.easing;
    const heightVal = {
      height: target.getBoundingClientRect().height + "px",
      marginTop: styles.marginTop,
      marginBottom: styles.marginBottom,
      paddingTop: styles.paddingTop,
      paddingBottom: styles.paddingBottom,
    };
    Object.keys(heightVal).forEach((key) => {
      if (parseFloat(heightVal[key]) === 0) {
        delete heightVal[key];
      }
    });
    if (Object.keys(heightVal).length === 0) {
      isAnimating = false;
      return false;
    }
    let slideAnime;
    Object.keys(heightVal).forEach((key) => {
      target.style[key] = heightVal[key];
      heightVal[key] = 0;
    });
    slideAnime = target.animate(heightVal, {
      duration: duration,
      easing: easing,
    });
    slideAnime.finished.then(() => {
      target.style.overflow = "";
      Object.keys(heightVal).forEach((key) => {
        target.style[key] = "";
      });
      target.style.display = "none";
      isAnimating = false;
    });
  };
})();

const slideAnime = (() => {
  let isAnimating = false;
  return (setOptions) => {
    const defaultOptions = {
      target: false,
      animeType: "slideToggle",
      duration: 400,
      easing: "ease",
      isDisplayStyle: "block",
    };
    const options = Object.assign({}, defaultOptions, setOptions);
    const target = options.target;
    if (!target) {
      return;
    }
    if (isAnimating) {
      return;
    }
    isAnimating = true;
    let animeType = options.animeType;
    const styles = getComputedStyle(target);
    if (animeType === "slideToggle") {
      animeType = styles.display === "none" ? "slideDown" : "slideUp";
    }
    if (
      (animeType === "slideUp" && styles.display === "none") ||
      (animeType === "slideDown" && styles.display !== "none") ||
      (animeType !== "slideUp" && animeType !== "slideDown")
    ) {
      isAnimating = false;
      return false;
    }
    target.style.overflow = "hidden";
    const duration = options.duration;
    const easing = options.easing;
    const isDisplayStyle = options.isDisplayStyle;
    if (animeType === "slideDown") {
      target.style.display = isDisplayStyle;
    }
    const heightVal = {
      height: target.getBoundingClientRect().height + "px",
      marginTop: styles.marginTop,
      marginBottom: styles.marginBottom,
      paddingTop: styles.paddingTop,
      paddingBottom: styles.paddingBottom,
    };
    Object.keys(heightVal).forEach((key) => {
      if (parseFloat(heightVal[key]) === 0) {
        delete heightVal[key];
      }
    });
    if (Object.keys(heightVal).length === 0) {
      isAnimating = false;
      return false;
    }
    let slideAnime;
    if (animeType === "slideDown") {
      Object.keys(heightVal).forEach((key) => {
        target.style[key] = 0;
      });
      slideAnime = target.animate(heightVal, {
        duration: duration,
        easing: easing,
      });
    } else if (animeType === "slideUp") {
      Object.keys(heightVal).forEach((key) => {
        target.style[key] = heightVal[key];
        heightVal[key] = 0;
      });
      slideAnime = target.animate(heightVal, {
        duration: duration,
        easing: easing,
      });
    }
    slideAnime.finished.then(() => {
      target.style.overflow = "";
      Object.keys(heightVal).forEach((key) => {
        target.style[key] = "";
      });
      if (animeType === "slideUp") {
        target.style.display = "none";
      }
      isAnimating = false;
    });
  };
})();

var BlsEventShopify = (function () {
  return {
    init: function () {
      this.setupEventListeners();
      Shopify.eventCountDownTimer();
      Shopify.eventFlashingBrowseTab();
    },
    setupEventListeners: function () {
      window.addEventListener("scroll", () => {
        backToTop();
        mobileStickyBar();
      });

      document
        .querySelectorAll(".collection-infinite-scroll a")
        .forEach((showMore) => {
          showMore.addEventListener(
            "click",
            (e) => {
              for (var item of document.querySelectorAll(
                ".collection-list__item.grid__item"
              )) {
                item.classList.remove("d-none");
              }
              showMore.parentElement.remove();
            },
            false
          );
        });

      const footer_block = document.querySelectorAll(
        ".bls__footer_block-title"
      );
      footer_block.forEach((footer) => {
        footer.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const parent = target.parentElement;
          const footerContent = parent.querySelector(
            ".bls__footer_block-content"
          );
          slideAnime({
            target: footerContent,
            animeType: "slideToggle",
          });
          const footer_block = target.closest(".bls__footer_block");
          if (!footer_block.classList.contains("active")) {
            footer_block.classList.add("active");
          } else {
            footer_block.classList.remove("active");
          }
        });
      });

      const mobile_stickybar = document.getElementById(global.mobile_stickybar);
      const ft = document.querySelector("footer");
      if (mobile_stickybar && ft) {
        ft.classList.add("enable_menu-bottom");
      }

      const cookie_bar = document.getElementById("bls_cookie");
      if (cookie_bar) {
        if (!getCookie("cookie_bar")) {
          cookie_bar.classList.remove("d-none");
        }
        document
          .querySelectorAll("#bls_cookie .cookie-dismiss")
          .forEach((closeCookie) => {
            closeCookie.addEventListener(
              "click",
              (e) => {
                e.preventDefault();
                const target = e.currentTarget;
                target.closest("#bls_cookie").remove();
                setCookie("cookie_bar", "dismiss", 30);
              },
              false
            );
          });
      }

      const announcementBar = document.getElementById(global.announcementBar);
      if (announcementBar) {
        const swc = announcementBar.querySelector(".swiper-announcementBar");
        if (swc) {
          swc.style.maxHeight = announcementBar.offsetHeight + "px";
          var swiper = new Swiper(".swiper-announcementBar", {
            loop: true,
            slidesPerView: 1,
            direction: "vertical",
            autoplay: {
              delay: 3000,
            },
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        }
        const cds = announcementBar.querySelectorAll(
          ".countdown-announcementBar"
        );
        cds.forEach((cd) => {
          const cddl = cd?.dataset.blockDeadline;
          const dateParts = cddl.split("-");
          const isoDate =
            dateParts[2] +
            "-" +
            dateParts[0].padStart(2, "0") +
            "-" +
            dateParts[1].padStart(2, "0") +
            "T00:00:00Z";
          if (cddl && Date.parse(isoDate)) {
            const deadline = new Date(isoDate);
            const calculateTimeLeft = () => {
              const difference = +deadline - +new Date();
              let timeLeft = {};
              if (difference > 0) {
                timeLeft = {
                  days_announcementBar: Math.floor(
                    difference / (1000 * 60 * 60 * 24)
                  ),
                  hours_announcementBar: Math.floor(
                    (difference / (1000 * 60 * 60)) % 24
                  ),
                  minutes_announcementBar: Math.floor(
                    (difference / 1000 / 60) % 60
                  ),
                  seconds_announcementBar: Math.floor((difference / 1000) % 60),
                };
              }
              return timeLeft;
            };
            const updateCountdown = () => {
              const timeLeft = calculateTimeLeft();
              Object.entries(timeLeft).forEach(([key, value]) => {
                cd.querySelector("." + key).innerHTML = value;
              });
            };

            setInterval(updateCountdown, 1000);
          }
        });
        if (getCookie("announcement_bar")) {
          announcementBar.classList.add("d-none");
        }
        document
          .querySelectorAll("#announcement-bar .announcement-close")
          .forEach((closeAnnouncement) => {
            closeAnnouncement.addEventListener(
              "click",
              (e) => {
                e.preventDefault();
                const target = e.currentTarget;
                target.closest("#announcement-bar").remove();
                setCookie("announcement_bar", 1, 1);
              },
              false
            );
          });
      }
      const conditions = document.getElementById("product_conditions_form");
      const bpb = document.querySelector(".bls__payment-button");
      if (conditions) {
        if (getCookie("term_conditions")) {
          conditions.setAttribute('checked','')
          if (bpb) {
            bpb.classList.remove("disabled");
          }
        }else{
          conditions.addEventListener("change", (event) => {
            setCookie('term_conditions', 1, 1);
            
            if (bpb) {
              if (event.currentTarget.checked) {
                bpb.classList.remove("disabled");
              } else {
                bpb.classList.add("disabled");
              }
            }
          });
        }
      }

      document.querySelectorAll(global.overlay).forEach((event) => {
        event.addEventListener(
          "click",
          (e) => {
            const target = e.currentTarget;
            target.classList.add("d-none-overlay");
            document.documentElement.classList.remove("hside_opened");
            document.documentElement.classList.remove("vetical-overlay");
            for (var item of document.querySelectorAll(".bls__opend-popup")) {
              item.classList.remove("bls__opend-popup");
            }
            const btn = document.querySelector(".btn-filter");
            if (btn && btn.classList.contains("actived")) {
              btn.classList.remove("actived");
            }
            for (var item of document.querySelectorAll(".bls__addon")) {
              item.classList.remove("is-open");
            }
            for (var item of document.querySelectorAll(
              ".bls-minicart-wrapper"
            )) {
              item.classList.remove("addons-open");
            }
            for (var item of document.querySelectorAll(".vertical-menu")) {
              item.classList.remove("open");
            }
          },
          false
        );
      });

      document.querySelectorAll(".bls__terms-conditions a").forEach((event) => {
        event.addEventListener(
          "click",
          (e) => {
            const content = document.getElementById("popup-terms-conditions");
            if (!content) return;
            e.preventDefault();
            const text = content.getAttribute("data-text");
            var promotion = EasyDialogBox.create(
              "popup-terms-conditions",
              "dlg dlg-disable-footer dlg-disable-drag",
              text,
              content.innerHTML
            );
            promotion.onClose = promotion.destroy;
            promotion.show(300);
          },
          false
        );
      });
    },
  };
})();
BlsEventShopify.init();
//task custom
var BlsCustomSlideShow = (function () {
  return {
    init: function () {
      this.CustomInnerMenu();
    },
    CustomInnerMenu: function () {
      const article = document.querySelector(".verticalmenu-html");
      const menuSlide = document.querySelectorAll(".menu-slide");
      if (article) {
        const menuHtml = article.innerHTML;
        if (menuSlide) {
          menuSlide.forEach((menu) => {
            menu.innerHTML = menuHtml;
            menu
              .closest(".bls-wrapper")
              .querySelector(".bls_vertical_menu .title-menu-dropdown")
              .classList.add("none-pointer");
          });
        }
      }
      if (menuSlide === null) return;
      if (article) {
        let width = screen.width;
        const limitItemShow = article.dataset.limitshowitem;
        const lenghtLi = document.querySelectorAll(
          ".menu-slide .level0"
        ).length;
        if (width > 1199) {
          if (lenghtLi > limitItemShow) {
            var lineItem = Array.from(
              document.querySelectorAll(".menu-slide .level0")
            );
            lineItem.forEach((element, index) => {
              if (index > limitItemShow - 1) {
                const item = lineItem[index];
                if (item.classList.contains("expand-menu-link")) {
                  return;
                }
                item.classList.add("orther-link");
                item.style.display = "none";
              }
            });
            document.querySelector(
              ".menu-slide .expand-menu-link"
            ).style.display = "block";
            document
              .querySelector(".menu-slide .expand-menu-link a")
              .addEventListener(
                "click",
                (e) => {
                  e.preventDefault();
                  const target = e.currentTarget;
                  const parent = target.parentElement;
                  if (!parent.classList.contains("expanding")) {
                    parent.classList.add("expanding");
                    parent.querySelector("a").innerHTML =
                      window.menuStrings?.hideMenus;
                    for (var item of document.querySelectorAll(
                      ".menu-slide .level0.orther-link"
                    )) {
                      showAnime(item);
                    }
                  } else {
                    parent.classList.remove("expanding");
                    parent.querySelector("a").innerHTML =
                      window.menuStrings?.moreMenus;
                    for (var item of document.querySelectorAll(
                      ".menu-slide .level0.orther-link"
                    )) {
                      hideAnime(item);
                    }
                  }
                },
                false
              );
          } else {
            if (document.querySelector(".slideshow-custom .expand-menu-link")) {
              document.querySelector(
                ".slideshow-custom .expand-menu-link"
              ).style.display = "none";
            }
          }
        }
      }
    },
  };
})();
BlsCustomSlideShow.init();

let newParser = new DOMParser();
var BlsSettingsSwiper = (function () {
  return {
    init: function () {
      this.BlsSettingsCarousel();
    },
    BlsSettingsCarousel: function () {
      var _this =this
      document.querySelectorAll(".bls__swiper").forEach((element) => {
        _this.BlsCarousel(element);
      });
    },
    BlsCarousel: function (e) {
      var sliderGlobal;
      var autoplaying = e?.dataset.autoplay === "true";
      var loop = e?.dataset.loop === "true";
      var dataSlideshow = e?.dataset.slideshow ? e?.dataset.slideshow : 0;
      var dataArrowCenterImage = e?.dataset.arrowCenterimage ? e?.dataset.arrowCenterimage : 0;
      var itemDesktop = e?.dataset.desktop ? e?.dataset.desktop : 4;
      var itemTablet = e?.dataset.tablet ? e?.dataset.tablet : 2;
      var itemMobile = e?.dataset.mobile ? e?.dataset.mobile : 1;
      var autoplaySpeed = e?.dataset.autoplaySpeed
        ? e?.dataset.autoplaySpeed
        : 3000;
      var speed = e?.dataset.speed ? e?.dataset.speed : 400;
      var effect = e?.dataset.effect ? e?.dataset.effect : "slide";
      var sectionId = e?.dataset.sectionId;
      var row = e?.dataset.row ? e?.dataset.row : 1;
      var spacing = e?.dataset.spacing ? e?.dataset.spacing : 0;
      var progressbar = e?.dataset.paginationProgressbar === "true";
      var animateSrcoll = e?.dataset.animationSrcoll === "true";
      var width = window.innerWidth;
      var autoItem = e?.dataset.itemMobile === "true";
      spacing = Number(spacing);
      autoplaySpeed = Number(autoplaySpeed);
      speed = Number(speed);
      if (autoplaying) {
        var autoplaying = { delay: autoplaySpeed };
      }
      sliderGlobal = new Swiper("#bls__swiper-" + sectionId, {
        slidesPerView: autoItem ? "auto" : itemMobile,
        spaceBetween: spacing >= 15 ? 15 : spacing,
        autoplay: autoplaying,
        loop: loop,
        effect: effect,
        speed: speed,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        grid: {
          rows: row,
          fill: "row",
        },
        navigation: {
          nextEl: e.querySelector(".swiper-button-next"),
          prevEl: e.querySelector(".swiper-button-prev"),
        },
        pagination: {
          clickable: true,
          el: e.querySelector(".swiper-pagination"),
          type: progressbar ? "progressbar" : "bullets",
        },
        breakpoints: {
          768: {
            slidesPerView: itemTablet,
            spaceBetween: spacing >= 30 ? 30 : spacing,
          },
          1200: {
            slidesPerView: itemDesktop,
            spaceBetween: spacing,
          },
        },
        on: {
          init: function () {
            if (dataSlideshow) {
              if (width > 767) {
                document.querySelectorAll(".slide-image").forEach((img) => {
                  var dataImageSlide = img?.dataset.imgSlide;
                  img.innerHTML = `<img 
                      src=${dataImageSlide} 
                      alt="slide" 
                      srcset="${dataImageSlide}&amp;width=375 375w, ${dataImageSlide}&amp;width=550 550w, ${dataImageSlide}&amp;width=750 750w, ${dataImageSlide}&amp;width=1100 1100w, ${dataImageSlide}&amp;width=1500 1500w, ${dataImageSlide}&amp;width=1780 1780w, ${dataImageSlide}&amp;width=2000 2000w, ${dataImageSlide}&amp;width=3000 3000w, ${dataImageSlide}&amp;width=3840 3840w" 
                      sizes="100vw"
                    >`;
                });
              }else{
                if (document.querySelector(".slide-image-mobile")) {
                  document
                    .querySelectorAll(".slide-image-mobile")
                    .forEach((imgMobile) => {
                      var dataImageSlideMobile =
                        imgMobile?.dataset.imgSlideMobile;
                      imgMobile.innerHTML = `<img 
                        src=${dataImageSlideMobile} 
                        alt="slide mobile" 
                        srcset="${dataImageSlideMobile}&amp;width=375 375w, ${dataImageSlideMobile}&amp;width=550 550w, ${dataImageSlideMobile}&amp;width=750 750w, ${dataImageSlideMobile}&amp;width=1100 1100w, ${dataImageSlideMobile}&amp;width=1500 1500w, ${dataImageSlideMobile}&amp;width=1780 1780w, ${dataImageSlideMobile}&amp;width=2000 2000w, ${dataImageSlideMobile}&amp;width=3000 3000w, ${dataImageSlideMobile}&amp;width=3840 3840w" 
                        sizes="100vw"
                      >`;
                    });
                } else {
                  document.querySelectorAll(".slide-image").forEach((img) => {
                    var dataImageSlide = img?.dataset.imgSlide;
                    img.innerHTML = `<img 
                        src=${dataImageSlide} 
                        alt="slide" 
                        srcset="${dataImageSlide}&amp;width=375 375w, ${dataImageSlide}&amp;width=550 550w, ${dataImageSlide}&amp;width=750 750w, ${dataImageSlide}&amp;width=1100 1100w, ${dataImageSlide}&amp;width=1500 1500w, ${dataImageSlide}&amp;width=1780 1780w, ${dataImageSlide}&amp;width=2000 2000w, ${dataImageSlide}&amp;width=3000 3000w, ${dataImageSlide}&amp;width=3840 3840w" 
                        sizes="100vw"
                      >`;
                  });
                }
              }
              window.addEventListener("resize", function () {
                const resizeWidth = window.innerWidth;
                if (resizeWidth <= 767) {
                  if (document.querySelector(".slide-image-mobile")) {
                    document
                      .querySelectorAll(".slide-image-mobile")
                      .forEach((imgMobile) => {
                        var dataImageSlideMobile =
                          imgMobile?.dataset.imgSlideMobile;
                        imgMobile.innerHTML = `<img 
                          src=${dataImageSlideMobile} 
                          alt="slide mobile" 
                          srcset="${dataImageSlideMobile}&amp;width=375 375w, ${dataImageSlideMobile}&amp;width=550 550w, ${dataImageSlideMobile}&amp;width=750 750w, ${dataImageSlideMobile}&amp;width=1100 1100w, ${dataImageSlideMobile}&amp;width=1500 1500w, ${dataImageSlideMobile}&amp;width=1780 1780w, ${dataImageSlideMobile}&amp;width=2000 2000w, ${dataImageSlideMobile}&amp;width=3000 3000w, ${dataImageSlideMobile}&amp;width=3840 3840w" 
                          sizes="100vw"
                        >`;
                      });
                  } else {
                    document.querySelectorAll(".slide-image").forEach((img) => {
                      var dataImageSlide = img?.dataset.imgSlide;
                      img.innerHTML = `<img 
                          src=${dataImageSlide} 
                          alt="slide" 
                          srcset="${dataImageSlide}&amp;width=375 375w, ${dataImageSlide}&amp;width=550 550w, ${dataImageSlide}&amp;width=750 750w, ${dataImageSlide}&amp;width=1100 1100w, ${dataImageSlide}&amp;width=1500 1500w, ${dataImageSlide}&amp;width=1780 1780w, ${dataImageSlide}&amp;width=2000 2000w, ${dataImageSlide}&amp;width=3000 3000w, ${dataImageSlide}&amp;width=3840 3840w" 
                          sizes="100vw"
                        >`;
                    });
                  }
                } else {
                  document.querySelectorAll(".slide-image").forEach((img) => {
                    var dataImageSlide = img?.dataset.imgSlide;
                    img.innerHTML = `<img 
                        src=${dataImageSlide} 
                        alt="slide" 
                        srcset="${dataImageSlide}&amp;width=375 375w, ${dataImageSlide}&amp;width=550 550w, ${dataImageSlide}&amp;width=750 750w, ${dataImageSlide}&amp;width=1100 1100w, ${dataImageSlide}&amp;width=1500 1500w, ${dataImageSlide}&amp;width=1780 1780w, ${dataImageSlide}&amp;width=2000 2000w, ${dataImageSlide}&amp;width=3000 3000w, ${dataImageSlide}&amp;width=3840 3840w" 
                        sizes="100vw"
                      >`;
                  });
                }
              });
              if (animateSrcoll) {
                initializeScrollZoomAnimationTrigger()
              }
            }
            if (dataArrowCenterImage) {
              var swiper = document.getElementById("bls__swiper-" + sectionId);
              var items_slide = swiper.querySelectorAll(".bls__responsive-image");
              if (items_slide.length != 0) {
                var oH = [];
                items_slide.forEach((e) => {
                  oH.push(e.offsetHeight / 2);
                });
                var max = Math.max(...oH);
                var arrowsOffset = '--arrows-offset-top: ' + max + 'px';
                if (swiper.querySelectorAll('.swiper-arrow')) {
                  swiper.querySelectorAll('.swiper-arrow').forEach((arrow) => {
                    arrow.setAttribute('style', arrowsOffset);
                  });
                }
              }
            }
          },
        },
      });

      if (dataSlideshow) {
        sliderGlobal.on("slideChange", function () {
          document.querySelectorAll(".video-slider").forEach((video) => {
            var dataVideo = video.dataset.video;
            var dataPoster = video.dataset.poster;
            video.innerHTML = `
              <video playsinline="true" loop="loop" muted="muted" autoplay="autoplay" preload="metadata"
                poster="${dataPoster}">
                <source
                  src="${dataVideo}"
                  type="video/mp4">
              </video>
              `;
          });
        });
      }
    },
  };
})();
BlsSettingsSwiper.init();

var BlsSettingsSwiperTestimonial = (function () {
  return {
    init: function () {
      this.BlsSettingsCarouselTestimonial();
    },
    BlsSettingsCarouselTestimonial: function () {
      document.querySelectorAll(".bls__testimonial").forEach((element) => {
        this.BlsCarouselTestimonial(element);
      });
    },
    BlsCarouselTestimonial: function (e) {
      var autoplaying = e?.dataset.autoplay === "true";
      var loop = e?.dataset.loop === "true";
      var itemDesktop = e?.dataset.desktop ? e?.dataset.desktop : 4;
      var itemTablet = e?.dataset.tablet ? e?.dataset.tablet : 2;
      var itemMobile = e?.dataset.mobile ? e?.dataset.mobile : 1;
      var sectionId = e?.dataset.sectionId;
      var width = window.innerWidth;
      var showThumb = e?.dataset.thumb === "true";
      var spacing = e?.dataset.spacing ? e?.dataset.spacing : 0;
      var progressbar = e?.dataset.paginationProgressbar === "true";
      spacing = Number(spacing);
      if (width <= 767) {
        if (spacing >= 15) {
          spacing = 15;
        }
      } else if (width <= 1199) {
        if (spacing >= 30) {
          spacing = 30;
        }
      }
      if (showThumb) {
        new Swiper("#bls__testimonial-" + sectionId, {
          slidesPerView: itemMobile,
          spaceBetween: spacing,
          autoplay: autoplaying,
          loop: loop,
          watchSlidesProgress: true,
          watchSlidesVisibility: true,
          navigation: {
            nextEl: e.querySelector(".swiper-button-next"),
            prevEl: e.querySelector(".swiper-button-prev"),
          },
          pagination: {
            clickable: true,
            el: e.querySelector(".swiper-pagination"),
          },
          breakpoints: {
            768: {
              slidesPerView: itemTablet,
            },
            1200: {
              slidesPerView: itemDesktop,
            },
          },
          thumbs: {
            swiper: {
              el: `.testimonial-thumb-${sectionId}`,
              multipleActiveThumbs: true,
              spaceBetween: 10,
              slidesPerView: "auto",
              freeMode: true,
              centerInsufficientSlides: true,
              watchSlidesProgress: true,
            },
          },
        });
      } else {
        new Swiper("#bls__testimonial-" + sectionId, {
          slidesPerView: itemMobile,
          spaceBetween: spacing,
          autoplay: autoplaying,
          loop: loop,
          watchSlidesProgress: true,
          watchSlidesVisibility: true,
          navigation: {
            nextEl: e.querySelector(".swiper-button-next"),
            prevEl: e.querySelector(".swiper-button-prev"),
          },
          pagination: {
            clickable: true,
            el: e.querySelector(".swiper-pagination"),
            type: progressbar ? "progressbar" : "bullets",
          },
          breakpoints: {
            768: {
              slidesPerView: itemTablet,
            },
            1200: {
              slidesPerView: itemDesktop,
            },
          },
        });
      }
    },
  };
})();
BlsSettingsSwiperTestimonial.init();

var BlsAddMetatagScale = (function () {
  return {
    init: function () {
      this.addMeta();
    },
    addMeta: function () {
      const body = document.querySelector("body");
      const metaTag = document.querySelector('meta[name="viewport"]');
      const currentContent = metaTag.getAttribute("content");
      const updatedContent = currentContent + ", maximum-scale=1";
      body.addEventListener("touchstart", function () {
        metaTag.setAttribute("content", updatedContent);
      });
    },
  };
})();
BlsAddMetatagScale.init();

var BlsToggle = (function () {
  return {
    init: function () {
      this.initToggle(), this.backToTop(), this.initToggleLookbook();
    },
    initToggle: function () {
      var faq_parent = ".bls__page-faq-items > .bls__page-faq-title";
      document.querySelectorAll(faq_parent).forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          const target = e.currentTarget;
          const parent = target.parentElement;
          const faqContent = parent.querySelector(".bls__page-faq-content");
          slideAnime({
            target: faqContent,
            animeType: "slideToggle",
          });
          if (item.closest(".bls-toggle").classList.contains("active")) {
            item.closest(".bls-toggle").classList.remove("active");
          } else {
            item.closest(".bls-toggle").classList.add("active");
          }
        });
      });
    },
    backToTop: function () {
      const b = document.querySelector(".back-top");
      if (b) {
        document.addEventListener("scroll", () => {
          if (window.scrollY > 400) {
            b.classList.add("show");
          } else {
            b.classList.remove("show");
          }
        });
        b.addEventListener("click", () => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });
      }
    },
    initToggleLookbook: function () {
      document.body.addEventListener("click", (evt) => {
        const target = evt.target;
        if (
          !target.closest(".bls__product-item") &&
          target !=
          document.querySelector(
            ".bls__product-item.active .lookbook__popup-items"
          )
        ) {
          const lookbook_items =
            document.querySelectorAll(".bls__product-item");
          lookbook_items.forEach((items) => {
            items.classList.remove(
              "active",
              "top",
              "bottom",
              "left",
              "right",
              "center"
            );
          });
        }
      });
      document.body.addEventListener("click", this.onBodyClick);
      const lookbook = document.querySelectorAll(".lookbook-action");
      lookbook.forEach((action) => {
        action.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const item = target.closest(".bls__product-item");
          const lookbook_item = item.querySelector(".lookbook__popup-items");
          const rect = item.getBoundingClientRect();
          const rect_item = lookbook_item.getBoundingClientRect();
          const item_right = rect_item.right;
          const item_left = rect_item.left;
          let height = window.innerHeight;
          let width = window.innerWidth;
          let pos_l = "center";
          const top = rect.top;
          const lookbook_items =
            document.querySelectorAll(".bls__product-item");
          if (!item.classList.contains("active")) {
            lookbook_items.forEach((items) => {
              items.classList.remove(
                "active",
                "top",
                "bottom",
                "left",
                "right",
                "center"
              );
            });
            item.classList.add("active");
            if (width > 767) {
              if (item_right > width) {
                pos_l = "left";
              } else if (item_left < 0) {
                pos_l = "right";
              }
              if (top > height / 2) {
                item.classList.add("top", pos_l);
              } else {
                item.classList.add("bottom", pos_l);
              }
            } else {
              if (top > height / 2) {
                item.classList.add("top");
              } else {
                item.classList.add("bottom");
              }
              let left = 0;
              if (item_right > width) {
                left = -50 - (item_right - width);
                lookbook_item.style.left = left + "px";
              } else if (item_left < 0) {
                left = -item_left;
                lookbook_item.style.left = left + "px";
              }
            }
          } else {
            item.classList.remove(
              "active",
              "top",
              "bottom",
              "left",
              "right",
              "center"
            );
          }
        });
      });
    },
  };
})();
BlsToggle.init();

var BlsPopup = (function () {
  return {
    init: function () {
      this.fetchDataNewletter(),
        this.fetchDataPromotion(),
        this.checkFormInfo(),
        this.checkShowMsgStockNotify();
    },
    setCookie: function (cname, exdays, cvalue) {
      const date = new Date();
      date.setTime(date.getTime() + exdays * 24 * 60 * 60 * 1000);
      let expires = "expires=" + date.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    getCookie: function (cname) {
      let name = cname + "=";
      let ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },
    deleteCookie: function (cname) {
      document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    },
    fetchDataNewletter: function () {
      const url = `${window.location.pathname}?section_id=newsletter-popup`;
      const _this = this;
      if (window.popup?.newsletterPopup !== false) {
        fetch(url)
          .then((response) => response.text())
          .then((responseText) => {
            const html = newParser.parseFromString(responseText, "text/html");
            const n = html.querySelector("#bls__newsletter-popup");
            if (n) {
              const c = n?.dataset.show;
              const disableMobile = n?.dataset.showMobile === "true";
              if (c === "show-on-all-pages" || c === "show-on-homepage") {
                if (_this.getCookie("bls-newsletter-popup") === "") {
                  var newsletter = EasyDialogBox.create(
                    "newsletterp",
                    `dlg dlg-disable-footer	dlg-disable-drag ${disableMobile ? "dlg-disable-mobile" : ""
                    }`,
                    "",
                    n.innerHTML
                  );
                  newsletter.onClose = newsletter.destroy;
                  newsletter.show(1000);
                  newsletter.onShow = function () {
                    _this.checkNotShowNewletter();
                  };
                }
              }
            }
          })
          .catch((e) => {
            throw e;
          });
      }
    },
    checkNotShowNewletter: function () {
      const _this = this;
      const check = document.getElementById("doNotShow");
      if (check) {
        check.addEventListener("change", (e) => {
          if (e.currentTarget.checked) {
            _this.setCookie("bls-newsletter-popup", 99999, "bls");
          } else {
            _this.deleteCookie("bls-newsletter-popup");
          }
        });
      }
    },
    fetchDataPromotion: function () {
      const url = `${window.location.pathname}?section_id=promotion-popup`;
      const _this = this;
      if (window.popup?.promotionPopup !== false) {
        fetch(url)
          .then((response) => response.text())
          .then((responseText) => {
            const html = newParser.parseFromString(responseText, "text/html");
            const p = html.querySelector("#bls__promotion-popup");
            const s = p?.dataset.show;
            const m = p?.dataset.showMb === "true";
            if (s === "show-on-all-pages" || s === "show-on-homepage") {
              if (_this.getCookie("bls-promotion-popup") === "") {
                var promotion = EasyDialogBox.create(
                  "promotionp",
                  `dlg dlg-disable-footer ${m ? "" : "dlg-disable-mobile"
                  } dlg-disable-drag`,
                  "",
                  p.innerHTML
                );
                promotion.onClose = promotion.destroy;
                promotion.show(6000);
                promotion.onShow = function () {
                  _this.copyPromotion();
                  _this.checkNotShowPromotion();
                };
              }
            }
          })
          .catch((e) => {
            throw e;
          });
      }
    },
    checkNotShowPromotion: function () {
      const _this = this;
      const check = document.querySelector("#doNotShowPromotion");
      if (check) {
        check.addEventListener("change", (e) => {
          if (e.currentTarget.checked) {
            _this.setCookie("bls-promotion-popup", 1, "bls");
          } else {
            _this.deleteCookie("bls-promotion-popup");
          }
        });
      }
    },
    copyPromotion: function () {
      const cp = document.querySelectorAll(".discount");
      if (cp !== null) {
        cp.forEach((e) => {
          e.addEventListener("click", (el) => {
            el.preventDefault();
            navigator.clipboard.writeText(e?.dataset.code);
            e.classList.add("action-copy");
            setTimeout(() => {
              e.classList.remove("action-copy");
            }, 1500);
          });
        });
      }
    },
    checkFormInfo: function () {
      const _this = this;
      const urlInfo = window.location.href;
      const formInfo = document.querySelector(".form-infor");
      const formErr = document.querySelector(".form-infor-body.noti-error");
      const formSuccess = document.querySelector(
        ".form-infor-body.noti-success"
      );
      const fi = document.querySelector(".form-infor,.close-form-info");
      if (fi) {
        fi.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const closet = target.closest(".form-infor");
          e.preventDefault();
          if (closet.classList.contains("show-noti-form")) {
            closet.classList.remove("show-noti-form");
          }
        });
      }
      if (urlInfo.indexOf("customer_posted=true#newsletter-form-popup") >= 1) {
        formInfo.classList.add("show-noti-form");
        formErr.style.display = "none";
        _this.setCookie("bls-newsletter-popup", 99999, "bls");
        const newURL = location.href.split("?")[0];
        window.history.pushState("object", document.title, newURL);
      }
      if (
        urlInfo.indexOf("contact%5Btags%5D=newsletter&form_type=customer") >= 1
      ) {
        formInfo.classList.add("show-noti-form");
        formSuccess.style.display = "none";
        const newURL = location.href.split("?")[0];
        window.history.pushState("object", document.title, newURL);
      }
      if (urlInfo.indexOf("customer_posted=true") >= 1) {
        formInfo.classList.add("show-noti-form");
        formErr.style.display = "none";
        const newURL = location.href.split("?")[0];
        _this.setCookie("bls-newsletter-popup", 99999, "bls");
        window.history.pushState("object", document.title, newURL);
      }
      if (urlInfo.indexOf("contact_posted=true#askquestion") >= 1) {
        formInfo.classList.add("show-noti-form");
        formErr.style.display = "none";
        const newURL = location.href.split("?")[0];
        window.history.pushState("object", document.title, newURL);
      }
    },
    checkShowMsgStockNotify: function () {
      const urlInfo = window.location.href;
      const formInfo = document.querySelector(".stock-notify");
      const fi = document.querySelector(
        ".stock-notify,.close-form-stock-notify"
      );
      if (fi) {
        fi.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const closet = target.closest(".stock-notify");
          e.preventDefault();
          if (closet.classList.contains("show-noti-form")) {
            closet.classList.remove("show-noti-form");
          }
        });
      }
      if (urlInfo.indexOf("contact_posted=true#FormStockNotify") > -1) {
        formInfo.classList.add("show-noti-form");
        const newURL = location.href.split("?")[0];
        window.history.pushState("object", document.title, newURL);
      }
    },
  };
})();
BlsPopup.init();

var BlsLoginPopup = (function () {
  return {
    init: function () {
      this.showLogin();
    },
    clickTab: function () {
      const hidden = document.querySelectorAll("[data-login-hidden]");
      const show = document.querySelectorAll("[data-login-show]");
      const iTitle = document.querySelector(
        "#loginp_0 .dlg-heading .popup-title"
      );
      show.forEach((e) => {
        var s = e?.dataset.loginShow;
        e.addEventListener("click", function (el) {
          el.preventDefault();
          hidden.forEach((eh) => {
            var h = eh?.dataset.loginHidden;
            if (eh.getAttribute("aria-hidden") === "true" && s === h) {
              eh.setAttribute("aria-hidden", "false");
              if (iTitle) {
                iTitle.innerText = s;
              }
            } else {
              eh.setAttribute("aria-hidden", "true");
            }
          });
        });
      });
    },
    showLogin: function () {
      const action = document.querySelector(".action-login");
      const _this = this;
      if (action !== null) {
        action.addEventListener("click", (e) => {
          e.preventDefault();
          _this.fetchDataLogin();
          document.body.classList.add("login-popup-show");
        });
      }
    },
    fetchDataLogin: function () {
      const url = `${window.location.pathname}?section_id=login-popup`;
      const _this = this;
      fetch(url)
        .then((response) => response.text())
        .then((responseText) => {
          const html = newParser.parseFromString(responseText, "text/html");
          const l = html.querySelector("#login-popup");
          if (l) {
            var titleLoginDefault = l.querySelector("[data-title-default]");
            var dataTitleLogin = titleLoginDefault.dataset.titleDefault;
            var login = EasyDialogBox.create(
              "loginp",
              "dlg dlg-disable-footer dlg-disable-drag",
              `${dataTitleLogin}`,
              l.innerHTML
            );
            login.onClose = login.destroy;
            login.show();
          }
          _this.clickTab();
        })
        .catch((e) => {
          throw e;
        });
    },
  };
})();
BlsLoginPopup.init();

var BlsLazyloadImg = (function () {
  return {
    init: function () {
      this.lazyReady();
    },
    lazyReady: function () {
      if (!!window.IntersectionObserver) {
        let observer = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.width = entry.boundingClientRect.width;
                entry.target.height = entry.boundingClientRect.height;
                entry.target.sizes = `${entry.boundingClientRect.width}px`;
                entry.target.classList.add("bls-loaded-image");
                entry.target
                  .closest(".bls-image-js")
                  .classList.remove("bls-loading-image");
                observer.unobserve(entry.target);
              }
            });
          },
          { rootMargin: "10px" }
        );
        document.querySelectorAll(".bls-image-js img").forEach((img) => {
          observer.observe(img);
        });
      }
    },
  };
})();
BlsLazyloadImg.init();

const rdc = {
  mode: "same-origin",
  credentials: "same-origin",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  },
};
let parser = new DOMParser();
const newMap = new Map();

var BlsReloadEvents = (function () {
  return {
    init: function () {
      this.setupEventListeners();
    },

    setupEventListeners: function () {
      document.addEventListener("shopify:section:load", function (event) {
        var id = event.detail.sectionId;

        var section = event.target.querySelector(
          "[" + "data-id" + '="' + id + '"]'
        );

        if (section != undefined) {
          const { type } = section?.dataset;
          switch (type) {
            case "instagram":
              BlsInstagramShopify.init();
              break;
            case "product_grid":
              BlsProductGridEvents.init();
              BlsProductTabEvents.init();
              BlsColorSwatchesShopify.init();
              break;
            case "product_carousel":
              BlsProductGridEvents.init();
              BlsProductTabEvents.init();
              BlsColorSwatchesShopify.init();
              break;
            case "recently_viewed_products":
              BlsRVProductsShopify.init();
              break;
            case "product_recommendations":
              BlsProductRecommendsEvents.init();
              break;
            case "product_single":
              BlsColorSwatchesShopify.init();
              break;
            case "product_deal":
              BlsColorSwatchesShopify.init();
              BlsCountdownTimer.init();
              break;
            default:
              break;
          }
        }
      });
    },
  };
})();
BlsReloadEvents.init();

var BlsInstagramShopify = (function () {
  return {
    init: function () {
      this.loadInstagram();
    },

    loadInstagram: function () {
      const ig_class = document.querySelectorAll(".bls__instagram-api");
      ig_class.forEach((e) => {
        if (e != undefined) {
          const { accessToken, images, igType } = e?.dataset;
          if (accessToken) {
            this.initInstagram(e, accessToken, images, igType);
          } else {
            console.warn("Access Token is invalid!");
          }
        }
      });
    },

    initInstagram: async function (nodeElement, at, num_img, igType) {
      const _this = this;
      let i = num_img !== undefined ? num_img : 4;
      const resp = await this.fetchCache(
        `https://graph.instagram.com/me/media?fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${at}`,
        {
          cache: "force-cache",
        }
      );
      if (!resp) return;

      if (resp.error) {
        return console.error("Instagram error: ", resp.error?.message);
      }
      if (igType === "carousel") {
        _this.initCarousel(resp.data, nodeElement, i);
      } else {
        _this.initGrid(resp.data, nodeElement, i);
      }
    },

    fetchCache: function (u, fetchOption) {
      let cf = fetchOption !== undefined ? fetchOption : rdc;
      return new Promise((resolve, reject) => {
        if (newMap.get(u)) {
          return resolve(newMap.get(u));
        }
        fetch(u, cf)
          .then((res) => {
            if (res.ok) {
              const j = res.json();
              resolve(j);
              newMap.set(u, j);
              return j;
            } else {
              reject(res);
            }
          })
          .catch(reject);
      });
    },

    initCarousel: function (images, nodeElement, i) {
      images
        .filter(
          (d) => d.media_type === "IMAGE" || d.media_type === "CAROUSEL_ALBUM"
        )
        .slice(0, i)
        .forEach((image) => {
          var node = document.createElement("div");
          node.classList.add("swiper-slide");
          var responsiveImageNode = document.createElement("div");
          var node_ig_item = document.createElement("div");
          node_ig_item.classList.add("bls__instagram-item");
          var imgUrl = document.createElement("a");
          var ig_logo = document.createElement("span");
          ig_logo.classList.add("bls__instagram-icon");
          responsiveImageNode.classList.add("bls__responsive-image");
          responsiveImageNode.classList.add("bls_instagram-image");
          responsiveImageNode.classList.add("bls-image-js");
          responsiveImageNode.setAttribute("style", "--aspect-ratio:1/1");
          responsiveImageNode.innerHTML += `<img src="${image.media_url}" srcset="${image.media_url}&width=165 165w,${image.media_url}&width=330 330w,${image.media_url}&width=535 535w,${image.media_url}&width=750 750w,${image.media_url}&width=1000 1000w,${image.media_url}&width=1500 1500w,${image.media_url}&width=3000 3000w" sizes="(min-width: 1260px) 282px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)" loading="lazy" alt="instagram">`;
          imgUrl.setAttribute("href", image.permalink);
          imgUrl.appendChild(responsiveImageNode);
          imgUrl.appendChild(ig_logo);
          node_ig_item.appendChild(imgUrl);
          node.appendChild(node_ig_item);
          nodeElement.querySelector(".swiper-wrapper").appendChild(node);
        });
      BlsLazyloadImg.init();
    },

    initGrid: function (images, nodeElement, limits) {
      const _this = this;
      const gridNode = nodeElement.querySelector(".bls__instagram-grid");
      if (gridNode) {
        const { spacing } = gridNode?.dataset;
        nodeElement.setAttribute("style", "--bs-gutter-x:" + spacing + "px");
        var items = Number(limits);
        images
          .filter(
            (d) => d.media_type === "IMAGE" || d.media_type === "CAROUSEL_ALBUM"
          )
          .slice(0, items)
          .forEach((image) => {
            var node = document.createElement("div");
            node.classList.add("bls__instagram-item");
            var imgUrl = document.createElement("a");
            var ig_logo = document.createElement("span");
            ig_logo.classList.add("bls__instagram-icon");
            var nodeChild = document.createElement("div");
            nodeChild.classList.add("bls__responsive-image");
            nodeChild.classList.add("bls-image-js");
            nodeChild.setAttribute("style", "--aspect-ratio: 1/1");
            nodeChild.classList.add("bls_instagram-image");
            nodeChild.innerHTML += `<img src="${image.media_url}" srcset="${image.media_url}&width=165 165w,${image.media_url}&width=330 330w,${image.media_url}&width=535 535w,${image.media_url}&width=750 750w,${image.media_url}&width=1000 1000w,${image.media_url}&width=1500 1500w,${image.media_url}&width=3000 3000w" sizes="(min-width: 1260px) 282px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)" loading="lazy" alt="instagram">`;
            imgUrl.setAttribute("href", image.permalink);
            imgUrl.appendChild(nodeChild);
            imgUrl.appendChild(ig_logo);
            node.appendChild(imgUrl);
            gridNode.querySelector(".row").appendChild(node);
            BlsLazyloadImg.init();
          });
      }
    },
  };
})();
BlsInstagramShopify.init();

var BlsProductGridEvents = (function () {
  return {
    init: function () {
      this.setupEventListeners();
    },

    setupEventListeners: function () {
      const _this = this;
      document.querySelectorAll(".bls__btn-load-more").forEach((el) => {
        el.addEventListener("click", function (e) {
          const sectionId = this.closest(".bls__grid").dataset.id;
          _this.loadButtonLoadMore(sectionId,e.currentTarget);
        });
      });
    },

    loadButtonLoadMore: function (sectionId, button_loadmore) {
      const defClass = document.querySelector(
        ".bls__load-more_wrap-" + sectionId
      );
      if (defClass != undefined) {
        const { nextUrl, currentPage, totalPages,totalItems } = defClass?.dataset;
        this.loadMore(defClass, sectionId, nextUrl, currentPage, totalPages,totalItems,button_loadmore);
      }
    },

    loadMore: function (defClass, sectionId, nextUrl, currentPage, totalPages,totalItems,button_loadmore) {
      const grid = document.querySelector("#bls__product-grid-" + sectionId);
    

      if (grid != undefined) {
        const { id, r, d, to } = grid?.dataset;
        const loadMoreBtn = defClass.querySelector('[type="button"]');
        loadMoreBtn.classList.add("btn-loading");
        let nextPage = parseInt(currentPage) + 1;
        fetch(`${nextUrl}?page=${nextPage}&section_id=${id}`)
          .then((response) => response.text())
          .then((responseText) => {
            const productNodes = parser.parseFromString(
              responseText,
              "text/html"
            );
            const productNodesHtml = productNodes.querySelectorAll(
              `#bls__product-grid-${sectionId} .bls__product-load`
            );
            productNodesHtml.forEach((prodNode) =>
              document
                .getElementById(`bls__product-grid-${sectionId}`)
                .appendChild(prodNode)
            );
 
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            loadMoreBtn.classList.remove("btn-loading");
            if (nextPage == totalPages) {
              defClass.remove();
            } else {
              defClass.setAttribute("data-current-page", nextPage);
            }
            let list_item = document.querySelectorAll(`#bls__product-grid-${sectionId} .bls__product-item`)
            list_item = Array.from(list_item).filter((item, index) => {                  
                 if(index >= totalItems){
                  item.remove()
                 }
                 return index < totalItems
            });
            if(list_item.length ==  totalItems) {
              button_loadmore.remove();
            }
            BlsColorSwatchesShopify.init();
            BlsSubActionProduct.init();
            BlsReloadSpr.init();
            BlsLazyloadImg.init();
          });
      }
    },
  };
})();
BlsProductGridEvents.init();

var BlsProductTabEvents = (function () {
  return {
    init: function () {
      this.setupEventListeners();
      this.setupDropdownStyle();
      document.addEventListener("click", this.closeAllSelect);
    },

    setupEventListeners: function (value) {
      document.querySelectorAll(".bls__collection-tab").forEach((el) => {
        const tab_item = el.querySelectorAll(".bls__collection-tab-item");
        if (tab_item.length != 0) {
          tab_item.forEach((e) => {
            e.addEventListener("click", function () {
              if (!this.classList.contains("active")) {
                el.querySelectorAll(".bls__collection-tab-item").forEach(
                  (element) => {
                    element.classList.remove("active");
                  }
                );
                this.classList.add("active");
                const tabId = this.dataset.id;
                el.querySelectorAll(".bls__cls-tab").forEach((element) => {
                  if (element.id === tabId) {
                    if (!element.classList.contains("active")) {
                      el.querySelectorAll(".bls__cls-tab").forEach((elm) => {
                        elm.classList.remove("active");
                      });
                      element.classList.add("active");
                    }
                  }
                });
              }
            });
          });
        } else {
          const tabId = value;
          el.querySelectorAll(".bls__cls-tab").forEach((element) => {
            if (element.id === tabId) {
              if (!element.classList.contains("active")) {
                el.querySelectorAll(".bls__cls-tab").forEach((elm) => {
                  elm.classList.remove("active");
                });
                element.classList.add("active");
              }
            }
          });
        }
      });
    },

    setupDropdownStyle: function () {
      const _this = this;
      var x, i, j, l, ll, selElmnt, a, b, z, p, o;
      x = document.getElementsByClassName("custom-select");
      l = x.length;
      if (l > 0) {
        for (i = 0; i < l; i++) {
          selElmnt = x[i].getElementsByTagName("select")[0];
          x[i].innerHTML = "";
          x[i].appendChild(selElmnt);
          ll = selElmnt.length;
          a = document.createElement("div");
          a.setAttribute(
            "class",
            "select-selected flex justify-content-between w-full"
          );
          p = document.createElement("span");
          p.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
          a.appendChild(p);
          o = document.createElement("span");
          o.setAttribute("class", "select-arrow");
          o.innerHTML = `<svg fill="currentColor" width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M441.9 167.3l-19.8-19.8c-4.7-4.7-12.3-4.7-17 0L224 328.2 42.9 147.5c-4.7-4.7-12.3-4.7-17 0L6.1 167.3c-4.7 4.7-4.7 12.3 0 17l209.4 209.4c4.7 4.7 12.3 4.7 17 0l209.4-209.4c4.7-4.7 4.7-12.3 0-17z"></path></svg>`;
          a.appendChild(o);
          x[i].appendChild(a);
          b = document.createElement("div");
          b.setAttribute("class", "select-items select-hide");
          for (j = 0; j < ll; j++) {
            z = document.createElement("div");
            z.innerHTML = selElmnt.options[j].innerHTML;
            if (selElmnt.options[j].getAttribute("selected")) {
              z.setAttribute("class", "same-as-selected");
            }
            z.addEventListener("click", function (e) {
              var y, i, k, s, h, sl, yl;
              s = this.parentNode.parentNode.getElementsByTagName("select")[0];
              sl = s.length;
              h = this.parentNode.previousSibling;
              for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                  s.selectedIndex = i;
                  h.childNodes[0].innerHTML = this.innerHTML;
                  y =
                    this.parentNode.getElementsByClassName("same-as-selected");
                  yl = y.length;
                  for (k = 0; k < yl; k++) {
                    y[k].removeAttribute("class");
                  }
                  this.setAttribute("class", "same-as-selected");
                  break;
                }
              }
              s.dispatchEvent(new Event("change"));
              s.dispatchEvent(new Event("click"));
              h.click();
            });
            b.appendChild(z);
          }
          x[i].appendChild(b);
          a.addEventListener("click", function (e) {
            e.stopPropagation();
            _this.closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
            _this.setupEventListeners(
              this.closest(".custom-select").querySelector(".select-data").value
            );
          });
        }
      }
    },
    closeAllSelect: function (elmnt) {
      var x,
        y,
        i,
        xl,
        yl,
        arrNo = [];
      x = document.getElementsByClassName("select-items");
      y = document.getElementsByClassName(
        "select-selected flex justify-content-between w-full"
      );
      xl = x.length;
      yl = y.length;
      for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
          arrNo.push(i);
        } else {
          y[i].classList.remove("select-arrow-active");
        }
      }
      for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
          x[i].classList.add("select-hide");
        }
      }
    },
  };
})();
BlsProductTabEvents.init();

var BlsColorSwatchesShopify = (function () {
  return {
    init: function () {
      this.initSwatches();
    },

    initSwatches: function () {
      const _this = this;
      const actionSwatchColor = document.querySelectorAll(
        ".bls__product-color-swatches"
      );
      actionSwatchColor.forEach((e) => {
        _this.checkSwatches(e);
      });
      var t;
      const actionSwatch = document.querySelectorAll(".bls__option-swatch-js");
      actionSwatch.forEach((e) => {
        const productTarget = e.closest(".bls__product-item");
        if (productTarget) {
          e.addEventListener(
            "mouseout",
            function () {
              if (e.closest(".swiper")) {
                t = setTimeout(() => {
                  e.closest(".swiper").classList.remove("show-tooltip");
                }, 400);
              }
            },
            false
          );
          e.addEventListener("mouseover", () => {
            clearTimeout(t);
            _this.listenerColor(e, productTarget);
            if (e.closest(".swiper")) {
              e.closest(".swiper").classList.add("show-tooltip");
            }
          });
        }
      });
    },

    listenerColor: function (e, productTarget) {
      const _this = this;
      setTimeout(() => {
        if (!e.classList.contains("active")) {
          const activeSwatches = e
            .closest(".bls__product-option")
            .querySelectorAll(".bls__option-swatch-js");
          activeSwatches.forEach((el) => {
            el.classList.remove("active");
          });
          e.classList.toggle("active");
          _this.swapProduct(productTarget);
        }
      }, 0);
    },

    updateMasterId(options, variantData) {
      var result = variantData.find((variant) => {
        return !variant.options
          .map((option, index) => {
            return options[index] === option;
          })
          .includes(false);
      });
      return result;
    },

    updatePrice(currentVariant, productTarget) {
      if (!currentVariant) return;
      const compare_at_price = currentVariant.compare_at_price;
      const price = currentVariant.price;
      const unit_price = currentVariant.unit_price;
      const unit_price_measurement = currentVariant.unit_price_measurement;
      const price_format = Shopify.formatMoney(
        currentVariant.price,
        cartStrings?.money_format
      );
      if (unit_price && unit_price_measurement) {
        const price_num = Shopify.formatMoney(
          unit_price,
          cartStrings?.money_format
        );
        const price_unit =
          unit_price_measurement.reference_value != 1
            ? unit_price_measurement.reference_value
            : unit_price_measurement.reference_unit;
        const upn = productTarget.querySelector(".unit-price .number");
        const upu = productTarget.querySelector(".unit-price .unit");
        if (upn) {
          upn.innerHTML = price_num;
        }
        if (upu) {
          upu.innerHTML = price_unit;
        }
      }
      const prp = productTarget.querySelector(".price__regular .price");
      if (prp) {
        prp.innerHTML = price_format;
      }
      const bls__price = productTarget.querySelector(".bls__price");
      bls__price.classList.remove("price--sold-out", "price--on-sale");
      bls__price
        .querySelector(".price__regular .price")
        .classList.remove("special-price");
      if (compare_at_price && compare_at_price > price) {
        const compare_format = Shopify.formatMoney(
          compare_at_price,
          cartStrings?.money_format
        );
        if (!bls__price.querySelector(".compare-price")) {
          var ps = bls__price.querySelector(".price__sale");
          var sp = document.createElement("span");
          var cp = document.createElement("s");
          cp.classList.add("price-item", "compare-price");
          sp.appendChild(cp);
          if (ps) {
            ps.appendChild(sp);
          }
        }
        if (bls__price.querySelector(".compare-price")) {
          bls__price.querySelector(".compare-price").innerHTML = compare_format;
        }
        bls__price.classList.add("price--on-sale");
        bls__price
          .querySelector(".price__regular .price")
          .classList.add("special-price");
      } else if (!currentVariant.available) {
        bls__price.classList.add("price--sold-out");
      }
    },

    updateMedia(currentVariant, productTarget) {
      if (!currentVariant) return;
      if (!currentVariant.featured_media) return;
      setTimeout(() => {
        productTarget
          .querySelector(".bls__product-main-img img")
          .removeAttribute("srcset");
        productTarget
          .querySelector(".bls__product-main-img img")
          .setAttribute("src", currentVariant.featured_media.preview_image.src);
      }, 200);
    },

    renderProductInfo(currentVariant, variantQtyData, productTarget, color) {
      let qty = 0;
      let percent = 0;
      let sale = false;
      let sold_out = false;
      let pre_order = false;
      let av = false;
      let im = false;
      const compare_at_price = currentVariant.compare_at_price;
      const price = currentVariant.price;
      const vqd = variantQtyData.reduce((acc, item) => {
        const existingItem = acc.find((i) => i.option === item.option);
        if (existingItem) {
          existingItem.qty += item.qty;
          if (item.available === true) {
            existingItem.available = true;
          }
          if (item.mamagement === "") {
            existingItem.mamagement = "";
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
      vqd.find((variantQty) => {
        if (variantQty.option === currentVariant.option1) {
          qty = variantQty.qty;
          av = variantQty.available;
          im = variantQty.mamagement;
        }
      });
      if (compare_at_price && compare_at_price > price) {
        sale = true;
        percent = ((compare_at_price - price) / compare_at_price) * 100;
      }
      if (im === "") {
        sold_out = false;
        pre_order = false;
      } else {
        if (av && qty < 1) {
          pre_order = true;
        } else if (!av) {
          sold_out = true;
        }
      }
      const product_label = productTarget.querySelector(".bls__product-label");
      const product_scrolling = productTarget.querySelector(
        ".bls__product-text-scrolling"
      );
      if (product_label) {
        product_label.remove();
      }
      if (product_scrolling) {
        const content = product_scrolling?.dataset.textProductScrolling;
        if (sale) {
          product_scrolling.style.display = 'flex';
          let content_replace;
          if (window.productLabel.saleType == 'price') {
            content_replace = content.replace("[percent_sale]", "- " + Shopify.formatMoney(
              (compare_at_price - price),
              cartStrings.money_format
            ))
          } else if (window.productLabel.saleType == 'percent') {
            content_replace = content.replace(
              "[percent_sale]",
              percent.toFixed(0) + "%"
            )
          } else {
            content_replace = content.replace(
              "[percent_sale]", ''
            )
          }
          product_scrolling
            .querySelectorAll(".sale-content-product")
            .forEach((sale) => {
              sale.innerText = content_replace;
            });
        } else {
          product_scrolling.style.display = 'none';
        }
      }
      if (sale || pre_order || sold_out) {
        var element = document.createElement("div");
        element.classList.add(
          "bls__product-label",
          "fs-12",
          "pointer-events-none",
          "absolute"
        );
        productTarget.querySelector(".bls__product-img").appendChild(element);
        const label = productTarget.querySelector(".bls__product-label");

        if (sale) {
          if (label.querySelector(".bls__sale-label")) {
            if (window.productLabel.saleType == 'price') {
              label.querySelector(".bls__sale-label").innerText = "- " + Shopify.formatMoney(
                (compare_at_price - price),
                cartStrings.money_format
              );
            } else if (window.productLabel.saleType == 'text') {
              label.querySelector(".bls__sale-label").innerText = window.productLabel.saleLabel;
            } else {
              label.querySelector(".bls__sale-label").innerText = -percent.toFixed(0) + "%";
            }
          } else {
            var element_sale = document.createElement("div");
            element_sale.classList.add("bls__sale-label");
            if (window.productLabel.saleType == 'price') {
              element_sale.innerText = "- " + Shopify.formatMoney(
                (compare_at_price - price),
                cartStrings.money_format
              );
            } else if (window.productLabel.saleType == 'text') {
              element_sale.innerText = window.productLabel.saleLabel;
            } else {
              element_sale.innerText = -percent.toFixed(0) + "%";
            }
            if (label) {
              label.appendChild(element_sale);
            }
          }
        }
        if (sold_out) {
          if (label.querySelector(".bls__sold-out-label")) {
            label.querySelector(".bls__sold-out-label").innerText =
              window.variantStrings?.soldOut;
          } else {
            var element_sold_out = document.createElement("div");
            element_sold_out.classList.add("bls__sold-out-label");
            element_sold_out.innerText = window.variantStrings?.soldOut;
            if (label) {
              label.appendChild(element_sold_out);
            }
          }
        }
        if (pre_order) {
          var element_pre_order = document.createElement("div");
          element_pre_order.classList.add("bls__pre-order-label");
          element_pre_order.innerText = window.variantStrings?.preOrder;
          if (label) {
            label.appendChild(element_pre_order);
          }
        }
      }

      const productAddCartDiv = productTarget.querySelector(
        ".bls__product-addtocart-js"
      );
      if (productAddCartDiv) {
        const currentVariantId = productAddCartDiv.dataset.productVariantId;
        if (Number(currentVariantId) !== currentVariant.id) {
          productAddCartDiv.dataset.productVariantId = currentVariant.id;
        }
      }
      this.toggleAddButton(
        !currentVariant.available,
        window.variantStrings?.soldOut,
        productTarget,
        pre_order
      );
    },

    toggleAddButton(disable = true, text, productTarget, pre_order = false) {
      const productForm = productTarget;
      if (!productForm) return;
      const addButton = productForm.querySelector(".bls__js-addtocart");
      const addButtonText = productTarget.querySelector(
        ".bls__js-addtocart .bls__button-content"
      );
      const addButtonTooltipText = productTarget.querySelector(
        ".bls__js-addtocart .bls_tooltip-content"
      );
      if (!addButton) return;

      if (disable) {
        addButton.setAttribute("disabled", "disabled");
        if (text) {
          addButtonText.textContent = text;
          if (addButtonTooltipText) {
            addButtonTooltipText.textContent = text;
          }
        }
      } else {
        addButton.removeAttribute("disabled");
        if (pre_order) {
          addButtonText.textContent = window.variantStrings?.preOrder;
          if (addButtonTooltipText) {
            addButtonTooltipText.textContent = window.variantStrings?.preOrder;
          }
        } else {
          addButtonText.textContent = window.variantStrings?.addToCart;
          if (addButtonTooltipText) {
            addButtonTooltipText.textContent = window.variantStrings?.addToCart;
          }
        }
      }
    },

    setUnavailable(productTarget) {
      const addButton = productTarget.querySelector(".bls__js-addtocart");
      const addButtonText = productTarget.querySelector(
        ".bls__js-addtocart .bls__button-content"
      );
      const addButtonTooltipText = productTarget.querySelector(
        ".bls__js-addtocart .bls_tooltip-content"
      );
      if (!addButton) return;
      addButtonText.textContent = window.variantStrings?.unavailable;
      addButtonTooltipText.textContent = window.variantStrings?.unavailable;
    },

    swapProduct: function (productTarget) {
      const product_swatch_active = productTarget.querySelector(
        ".bls__option-swatch-js.active"
      );
      const position_swatch =
        product_swatch_active.getAttribute("data-position");
      const variantData = JSON.parse(
        productTarget.querySelector(".productinfo").textContent
      );
      const variantQtyData = JSON.parse(
        productTarget.querySelector(".productVariantsQty").textContent
      );
      let options = Array.from(
        productTarget.querySelectorAll(".bls__option-swatch-js.active"),
        (select) => select.getAttribute("data-value")
      );
      variantData.find((variant) => {
        if (options.length == 1) {
          const variantOptions = {
            1: variant.option1,
            2: variant.option2,
            3: variant.option3,
          };
          if (variantOptions[position_swatch] === options[0]) {
            options = variant.options;
          }
        }
      });
      const currentVariant = this.updateMasterId(options, variantData);
      this.toggleAddButton(true, "", productTarget);
      if (!currentVariant) {
        this.toggleAddButton(true, "", productTarget);
        this.setUnavailable(productTarget);
      } else {
        this.updatePrice(currentVariant, productTarget);
        this.updateMedia(currentVariant, productTarget);
        this.renderProductInfo(
          currentVariant,
          variantQtyData,
          productTarget,
          product_swatch_active.dataset.color
        );
      }
    },

    checkSwatches: function (e) {
      const { color, image } = e?.dataset;
      if (this.checkColor(color)) {
        e.style.backgroundColor = color;
      } else {
        if (image) {
          e.classList.add = "bls__" + color.replace(" ", "-");
          e.style.backgroundColor = null;
          e.style.backgroundImage = "url('" + image + "')";
          e.style.backgroundSize = "cover";
          e.style.backgroundRepeat = "no-repeat";
        }
      }
    },

    checkColor: function (strColor) {
      var s = new Option().style;
      s.color = strColor;
      return s.color == strColor;
    },
  };
})();
BlsColorSwatchesShopify.init();

var BlsCountdownTimer = (function () {
  return {
    init: function () {
      this.handleCountdown();
      this.eventCountDownTimer();
    },

    eventCountDownTimer: function () {
      const element = document.querySelectorAll(".bls__countdown-timer");

      if (element.length === 0) return;
      element.forEach((e) => {
        const day = e.getAttribute("data-days");
        const hrs = e.getAttribute("data-hrs");
        const secs = e.getAttribute("data-secs");
        const mins = e.getAttribute("data-mins");
        const time = e.getAttribute("data-time");
        var countDownDate = new Date(time).getTime();
        var timer = setInterval(function () {
          var now = new Date().getTime();
          var distance = countDownDate - now;
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);
          var html =
            '<span class="countdown-days"><span class="countdown_ti heading-weight">' +
            days +
            '</span> <span class="countdown_tx">' +
            day +
            "</span></span> " +
            '<span class="countdown-hours"><span class="countdown_ti heading-weight">' +
            hours +
            '</span> <span class="countdown_tx">' +
            hrs +
            "</span></span> " +
            '<span class="countdown-min"><span class="countdown_ti heading-weight">' +
            minutes +
            '</span> <span class="countdown_tx">' +
            mins +
            "</span></span> " +
            '<span class="countdown-sec"><span class="countdown_ti heading-weight">' +
            seconds +
            '</span> <span class="countdown_tx">' +
            secs +
            "</span></span>";
          const cd = e.querySelector(".bls__product-countdown");
          if (cd) {
            cd.innerHTML = html;
          }
          if (distance < 0) {
            clearInterval(timer);
          }
        }, 1000);
      });
    },

    handleCountdown: function () {
      var second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;
      const timer = document.querySelectorAll(".bls__timer");
      timer.forEach((e) => {
        const { timer } = e?.dataset;
        const dateParts = timer.split("-");
        const isoDate =
          dateParts[2] +
          "-" +
          dateParts[0].padStart(2, "0") +
          "-" +
          dateParts[1].padStart(2, "0") +
          "T00:00:00Z";
        if (Date.parse(isoDate)) {
          var countDown = new Date(isoDate).getTime();
          if (countDown) {
            setInterval(function () {
              var now = new Date().getTime(),
                distance = countDown - now;
              if (countDown >= now) {
                (e.querySelector(".js-timer-days").innerText =
                  Math.floor(distance / day) < 10
                    ? ("0" + Math.floor(distance / day)).slice(-2)
                    : Math.floor(distance / day)),
                  (e.querySelector(".js-timer-hours").innerText = (
                    "0" + Math.floor((distance % day) / hour)
                  ).slice(-2)),
                  (e.querySelector(".js-timer-minutes").innerText = (
                    "0" + Math.floor((distance % hour) / minute)
                  ).slice(-2)),
                  (e.querySelector(".js-timer-seconds").innerText = (
                    "0" + Math.floor((distance % minute) / second)
                  ).slice(-2));
              }
            }, second);
          }
        }
      });
    },
  };
})();
BlsCountdownTimer.init();

var BlsWishlistHeader = (function () {
  return {
    init: function () {
      this.handleCount();
    },
    handleCount: function () {
      const wishlist = document.querySelectorAll(".bls-header-wishlist");
      const items = JSON.parse(localStorage.getItem('bls__wishlist-items'));
      wishlist.forEach((item) => {
        const numb = item.querySelector(".wishlist-count");
        numb.innerText = items !== null && items.length != 0 ? items.length : 0;
      });
    },
  };
})();

var BlsWishlistLoad = (function () {
  return {
    init: function (productHandle, wishlist_items) {
      const is_page_wishlist = document.querySelector(
        ".bls__wishlist-page-section"
      );
      if (productHandle) {
        const arr_items = [];
        if (wishlist_items === null) {
          arr_items.push(productHandle);
          localStorage.setItem(
            "bls__wishlist-items",
            JSON.stringify(arr_items)
          );
        } else {
          let index = wishlist_items.indexOf(productHandle);
          arr_items.push(...wishlist_items);
          if (index === -1) {
            arr_items.push(productHandle);
            localStorage.setItem(
              "bls__wishlist-items",
              JSON.stringify(arr_items)
            );
          } else if (index > -1) {
            arr_items.splice(index, 1);
            localStorage.setItem(
              "bls__wishlist-items",
              JSON.stringify(arr_items)
            );
            if (is_page_wishlist) {
              const div_no_product = is_page_wishlist.querySelector(
                ".bls__wishlist-no-product-js"
              );
              const item_remove = document.querySelector(
                '.bls__wishlist-list[data-product-handle="' +
                productHandle +
                '"]'
              );
              if (item_remove) {
                item_remove.remove();
              }
              const it =
                is_page_wishlist.querySelectorAll(".bls__product-item");
              if (wishlist_items.length <= 1 || it.length < 1) {
                div_no_product.classList.remove("d-none");
              }
            }
          }
        }
        BlsSubActionProduct.handleInitWishlist();
      }
    },
  };
})();

var BlsCompareLoad = (function () {
  return {
    init: function (productTarget, compare_items) {
      const is_page_compare = document.querySelector(
        ".bls__compare-page-section"
      );
      if (productTarget) {
        const productHandle = productTarget.dataset.productHandle;
        const arr_items = [];
        if (compare_items === null) {
          arr_items.push(productHandle);
          localStorage.setItem("bls__compare-items", JSON.stringify(arr_items));
        } else {
          let index = compare_items.indexOf(productHandle);
          arr_items.push(...compare_items);
          if (index === -1) {
            arr_items.push(productHandle);
            localStorage.setItem(
              "bls__compare-items",
              JSON.stringify(arr_items)
            );
          } else if (index > -1) {
            arr_items.splice(index, 1);
            localStorage.setItem(
              "bls__compare-items",
              JSON.stringify(arr_items)
            );
            if (is_page_compare) {
              const div_no_product = is_page_compare.querySelector(
                ".bls__compare-no-product-js"
              );
              const item_remove = document.querySelectorAll(
                '.bls__compare-value[data-product-handle="' +
                productHandle +
                '"]'
              );
              if (item_remove.length !== 0) {
                item_remove.forEach((i) => {
                  i.remove();
                });
              }
              const it = is_page_compare.querySelectorAll(".bls__product-item");
              if (compare_items.length <= 1 || it.length < 1) {
                div_no_product.classList.remove("d-none");
                const attr_remove = document.querySelector(
                  ".bls__compare-table"
                );
                if (attr_remove) {
                  attr_remove.classList.add("d-none");
                }
              }
            }
          }
        }
        BlsSubActionProduct.handleInitCompare();
      }
    },
  };
})();

var BlsSubActionProduct = (function () {
  return {
    init: function () {
      this.handleInitQuickviewAction();
      this.handleActionWishlist();
      this.handleInitWishlist();
      this.handleActionCompare();
      this.handleInitCompare();
    },

    handleInitQuickviewAction: function () {
      const _this = this;
      const qvbtn = document.querySelectorAll(".bls__product-quickview");
      if (qvbtn.length > 0) {
        qvbtn.forEach((e) => {
          e.addEventListener("click", () => {
            e.classList.add("btn-loading");
            const exist_load = e.querySelectorAll("span.loader-icon");
            if (exist_load.length === 0) {
              const exist_loading = e.querySelectorAll("div.loader-icon");
              if (exist_loading.length === 0) {
                const spanLoading = document.createElement("div");
                spanLoading.classList.add("loader-icon");
                e.appendChild(spanLoading);
              }
            }
            const productTarget = e.closest(".bls__product-item");
            _this.handleFetchDataQuickView(
              e,
              productTarget.dataset.productHandle
            );
          });
        });
      }
    },

    handleFetchDataQuickView: function (e, handle) {
      const _this = this;
      if (handle) {
        fetch(
          `${window.Shopify.routes.root}products/${handle}/?section_id=product-quickview`
        )
          .then((response) => response.text())
          .then((responseText) => {
            const html = parser.parseFromString(responseText, "text/html");
            html
              .querySelectorAll("#shopify-section-product-quickview")
              .forEach((el) => {
                var quickviewBox = EasyDialogBox.create(
                  "qvdialog",
                  "dlg dlg-disable-heading dlg-multi dlg-disable-footer dlg-disable-drag",
                  "",
                  el.innerHTML
                );
                quickviewBox.onClose = quickviewBox.destroy;
                quickviewBox.show();
                BlsColorSwatchesShopify.init();
                BlsReloadSpr.init();
                Shopify.eventFlashSold("dlg");
                Shopify.eventCountDownTimer("dlg");
                Shopify.swiperSlideQickview();
                BlsLazyloadImg.init();
                Shopify.PaymentButton.init();
              });
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            _this.handleActionWishlist();
            _this.handleInitWishlist();
            _this.handleActionCompare();
            _this.handleInitCompare();
            _this.showPopupStockNotify();
            Shopify.termsConditionsAction();
            e.classList.remove("btn-loading");
            e.querySelectorAll(".loader-icon").forEach((el) => {
              el.remove();
            });
          });
      }
    },

    handleInitWishlist: function () {
      const wishlist_items = JSON.parse(
        localStorage.getItem("bls__wishlist-items")
      );
      const wishlist_icon = document.querySelectorAll(".bls__product-wishlist");
      wishlist_icon.forEach((e) => {
        const { proAddWishlist, proRemoveWishlist, removeWishlist, action } = e?.dataset;
        const is_page_wishlist = document.querySelector(
          ".bls__wishlist-page-section"
        );
        const tooltip_wishlist = e.querySelector(".bls_tooltip-content");
        const productHandle = e.dataset.productHandle;
        if (wishlist_items !== null) {
          let index = wishlist_items.indexOf(productHandle);
          if (index !== -1) {
            e.querySelector(".bls__product-icon").classList.add("active");
            if (is_page_wishlist) {
              tooltip_wishlist.innerText =
                window.stringsTemplate?.messageRemoveWishlist;
            } else {
              if (action === 'remove') {
                tooltip_wishlist.innerText = removeWishlist;
              } else {
                tooltip_wishlist.innerText = proRemoveWishlist;
              }
            }
          } else {
            e.querySelector(".bls__product-icon").classList.remove("active");
            tooltip_wishlist.innerText = proAddWishlist;
          }
        }
        BlsWishlistHeader.init();
      });
    },

    handleActionWishlist: function () {
      const btnWishlist = document.querySelectorAll(
        ".bls__product-wishlist-js"
      );
      if (btnWishlist.length > 0) {
        btnWishlist.forEach((e) => {
          e.addEventListener("click", this.handleWishlistFunctionClick);
        });
      }
    },

    handleWishlistFunctionClick: function (evt) {
      evt.preventDefault();
      const e = evt.currentTarget;
      const wishlist_items = JSON.parse(
        localStorage.getItem("bls__wishlist-items")
      );
      const productHandle = e.dataset.productHandle;
      const action = e.dataset.action;
      const is_page_wishlist = document.querySelector(
        ".bls__wishlist-page-section"
      );
      const is_minicart = document.querySelector(".bls-minicart-wrapper")
      if (is_page_wishlist) {
        BlsWishlistLoad.init(productHandle, wishlist_items);
      }
      const arr_items = [];
      if (wishlist_items === null) {
        arr_items.push(productHandle);
        localStorage.setItem("bls__wishlist-items", JSON.stringify(arr_items));
        BlsSubActionProduct.handleInitWishlist();
      } else {
        let index = wishlist_items.indexOf(productHandle);
        arr_items.push(...wishlist_items);
        if (index === -1) {
          arr_items.push(productHandle);
          localStorage.setItem(
            "bls__wishlist-items",
            JSON.stringify(arr_items)
          );
          BlsSubActionProduct.handleInitWishlist();
        } else if (index > -1) {
          if (is_page_wishlist) {
            arr_items.splice(index, 1);
            localStorage.setItem(
              "bls__wishlist-items",
              JSON.stringify(arr_items)
            );
          } else {
            if (action === 'remove') {
              BlsWishlistLoad.init(productHandle, wishlist_items);
            } else {
              window.location.href = `${window.shopUrl}${window.Shopify.routes.root}pages/wishlist`;
            }
          }
        }
      }
    },

    handleCompareFunctionClick: function (evt) {
      const e = evt.currentTarget;
      const compare_items = JSON.parse(
        localStorage.getItem("bls__compare-items")
      );
      const productHandle = e.dataset.productHandle;
      const arr_items = [];
      if (compare_items === null) {
        arr_items.push(productHandle);
        localStorage.setItem("bls__compare-items", JSON.stringify(arr_items));
        BlsSubActionProduct.handleInitCompare();
      } else {
        let index = compare_items.indexOf(productHandle);
        arr_items.push(...compare_items);
        if (index === -1) {
          arr_items.push(productHandle);
          localStorage.setItem("bls__compare-items", JSON.stringify(arr_items));
          BlsSubActionProduct.handleInitCompare();
        } else if (index > -1) {
          window.location.href = `${window.shopUrl}${window.Shopify.routes.root}pages/compare`;
        }
      }
    },

    handleInitCompare: function () {
      const compare_items = JSON.parse(
        localStorage.getItem("bls__compare-items")
      );
      const compare_icon = document.querySelectorAll(".bls__product-compare");
      const is_page_compare = document.querySelector(
        ".bls__compare-page-section"
      );
      compare_icon.forEach((e) => {
        const { proAddCompare, proRemoveCompare } = e?.dataset;
        const tooltip_compare = e.querySelector(".bls_tooltip-content");
        const productHandle = e.dataset.productHandle;
        if (compare_items !== null) {
          let index = compare_items.indexOf(productHandle);
          if (index !== -1) {
            e.querySelector(".bls__product-icon").classList.add("active");
            if (is_page_compare) {
              tooltip_compare.innerText =
                window.stringsTemplate?.messageRemoveCompare;
            } else {
              tooltip_compare.innerText = proRemoveCompare;
            }
          } else {
            e.querySelector(".bls__product-icon").classList.remove("active");
            tooltip_compare.innerText = proAddCompare;
          }
        }
      });
    },

    handleActionCompare: function () {
      const btnCompare = document.querySelectorAll(".bls__product-compare-js");
      if (btnCompare.length > 0) {
        btnCompare.forEach((e) => {
          e.addEventListener("click", this.handleCompareFunctionClick);
        });
      }
    },

    showPopupStockNotify: function () {
      const stockClass = document.querySelectorAll(".product-notify-stock");
      const _this = this;
      stockClass.forEach((stock) => {
        stock.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const variantId = target.getAttribute("data-product-variant");
          e.preventDefault();
          _this.fetchDataStockNotifySection(variantId);
        });
      });
    },

    fetchDataStockNotifySection: function (variantId) {
      const url = "/variants/" + variantId + "/?section_id=stock-notify";
      fetch(url)
        .then((response) => response.text())
        .then((responseText) => {
          const html = newParser.parseFromString(responseText, "text/html");
          const id = html.querySelector("#bls-stock-notify");
          const text = id.getAttribute("data-stock-title");
          if (id) {
            var createPopupStock = EasyDialogBox.create(
              "stockNotify",
              "dlg dlg-multi dlg-disable-footer dlg-disable-drag",
              text,
              id.innerHTML
            );
            createPopupStock.center();
            createPopupStock.onClose = createPopupStock.destroy;
            createPopupStock.show();
          }
        })
        .catch((e) => {
          throw e;
        });
    },
  };
})();
BlsSubActionProduct.init();

var BlsSubActionProductPreLoad = (function () {
  return {
    handleActionPg: function () {
      const btnRemoveCompare = document.querySelectorAll(
        ".bls__compare-remove-js"
      );
      if (btnRemoveCompare.length > 0) {
        btnRemoveCompare.forEach((e) => {
          e.addEventListener("click", function () {
            const compare_items = JSON.parse(
              localStorage.getItem("bls__compare-items")
            );
            const productTarget = e.closest(".bls__product-item");
            if (productTarget) {
              BlsCompareLoad.init(productTarget, compare_items);
            }
          });
        });
      }
    },
  };
})();

var BlsReloadSpr = (function () {
  return {
    init: function () {
      if (window.SPR) {
        window.SPR.registerCallbacks();
        window.SPR.initRatingHandler();
        window.SPR.initDomEls();
        window.SPR.loadProducts();
        window.SPR.loadBadges();
      }
    },
  };
})();

var BlsMainMenuShopify = (function () {
  return {
    init: function () {
      this.initMainMenu();
      this.initVerticalMenu();
    },
    initMainMenu: function () {
      var _this = this;
      const header = document.querySelector(global.header);
      const sticky = header?.getAttribute("data-sticky");
      const sticky_mobile = header?.getAttribute("data-sticky-mobile");
      const verticalmenu = document.querySelector(".verticalmenu-list");
      const bls_main_menu = document.querySelector(".bls_main_menu");
      var menu_parent = "li.bls__menu-parent";

      // _this.onMenuMobileItem();
      _this.loadMoreMenu();
      document.querySelectorAll(".nav-toggle").forEach((navToggle) => {
        navToggle.addEventListener("click", (e) => {
          if (document.documentElement.classList.contains("nav-open")) {
            document.documentElement.classList.remove("nav-open");
            if (!bls_main_menu) {
              document.documentElement.classList.remove("nav-verticalmenu");
            }
          } else {
            document.documentElement.classList.add("nav-open");
            if (!bls_main_menu) {
              document.documentElement.classList.add("nav-verticalmenu");
            }
          }
        });
      });

      document.querySelectorAll(".close-menu").forEach((closeToggle) => {
        closeToggle.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            document.documentElement.classList.remove("nav-open");
            document.querySelectorAll('.submenu,.subchildmenu').forEach(item => {
              item.classList.remove("is--open");
              if (item.classList.contains('is--open-lv2')) {
                item.classList.remove("is--open-lv2");
              }
              if (item.classList.contains('is--open-lv3')) {
                item.classList.remove("is--open-lv3");
              }
            })
          },
          false
        );
      });

      if (verticalmenu && bls_main_menu) {
        const article = document.querySelector(".verticalmenu-html");
        const limitItemShow = article.dataset.limitshowitem;
        const html_title =
          '<a data-menu="verticalmenu-list" href="#">' +
          window.menuStrings?.verticalTitle +
          "</a>";
        const verticalmenu_html =
          document.querySelector(".verticalmenu-list").innerHTML;
        const el = document.createElement("ul");
        el.classList.add("verticalmenu-list");
        el.classList.add("verticalmenu-mobile");
        el.style.display = "none";
        el.setAttribute("data-limitshowitem", limitItemShow);
        el.innerHTML = verticalmenu_html;
        document
          .querySelector(".bls_main_menu .mobile-menu-content")
          .appendChild(el);
        document
          .querySelector(".bls_main_menu .menu-mobile-title")
          .insertAdjacentHTML("beforeend", html_title);
        // _this.onMenuMobileItem("verticalmenu");
      }

      document
        .querySelectorAll(".bls_main_menu .menu-mobile-title a")
        .forEach((navToggle) => {
          navToggle.addEventListener(
            "click",
            (e) => {
              e.preventDefault();
              const target = e.currentTarget;
              const data = target.getAttribute("data-menu");
              for (var item_title of document.querySelectorAll(
                ".bls_main_menu .menu-mobile-title a"
              )) {
                item_title.classList.remove("active");
              }
              target.classList.add("active");
              for (var item_menu of document.querySelectorAll(
                ".bls_main_menu .mobile-menu-content > ul"
              )) {
                item_menu.style.display = "none";
              }
              document.querySelector(
                ".bls_main_menu ." + data + ""
              ).style.display = "block";
            },
            false
          );
        });

      let width = screen.width;
      document
        .querySelectorAll("li.bls__menu-parent .submenu")
        .forEach((menuItem, index) => {
          if (width > 1024) {
            menuItem.addEventListener("mouseenter", (e) => {
              const target = e.currentTarget;
              target.closest('.bls__menu-parent').classList.add('bls-item-active-submenu');
            });
            menuItem.addEventListener("mouseleave", (e) => {
              const target = e.currentTarget;
              target.closest('.bls__menu-parent').classList.remove('bls-item-active-submenu');
            }
            );
          }
        });

      document
        .querySelectorAll(".bls-menu-item.type_banner")
        .forEach((menuItem, index) => {
          if (menuItem.classList.contains("space-banner")) {
            menuItem.closest(".submenu").classList.add("submenu-space-banner");
          }
        });

      let windowWidth = window.innerWidth;
      window.addEventListener("resize", function () {
        windowWidth = window.innerWidth;
        ac(windowWidth);
      });
      window.addEventListener('load', function () {
        windowWidth = screen.width;
        al(windowWidth);
      })
      function al(windowWidth) {
        if (windowWidth <= 1024) {
          if (document.querySelector('.show-localization')) {
            if (document.querySelector('.lang-curentcy')) {
              document.querySelector('.lang-curentcy')?.remove();
            }
            if (document.querySelector('.topbar')) {
              document.querySelectorAll('.topbar localization-form').forEach(item => {
                if (item) {
                  item.remove()
                }
              })
            }
          } else {
            document.querySelectorAll('.disclosure-mobile').forEach(item => {
              if (item) {
                item.remove();
              }
            })
          }
        }
      }
      function ac(windowWidth) {
        const categoriesListMenuMobile = document.querySelector('.categories-list-menu-mobile');
        const categoriesListMenu = document.querySelector('[data-menu="categories-list"]');
        const categoriesListMenuVertical = document.querySelector('[data-menu="verticalmenu-list"]');
        const categoriesListMenuVerticalMobile = document.querySelector('.verticalmenu-mobile');
        const horizontalList = document.querySelector('.horizontal-list');

        if (document.querySelectorAll("li.advanced-content > .sub").length) {
          if (windowWidth <= 1024) {
            for (var item_content of document.querySelectorAll(
              "li.advanced-content > .sub"
            )) {
              item_content.classList.remove("active");
            }
          } else {
            for (var item_content of document.querySelectorAll(
              "li.advanced-content > .sub"
            )) {
              item_content.classList.add("active");
              break;
            }
          }
        }
        if (windowWidth <= 1024) {
          if (document.querySelector('.show-localization')) {
            if (document.querySelector('.lang-curentcy')) {
              document.querySelector('.lang-curentcy')?.remove();
            }
            if (document.querySelector('.topbar')) {
              document.querySelectorAll('.topbar localization-form').forEach(item => {
                if (item) {
                  item.remove()
                }
              })
            }
          } else {
            document.querySelectorAll('.disclosure-mobile').forEach(item => {
              if (item) {
                item.remove();
              }
            })
          }
          if (document.querySelector('.verticalmenu-mobile')) {
            document.querySelector('.categories-list-menu-mobile')?.remove();
            document.querySelector('[data-menu="categories-list"]')?.remove();
          }
          if (horizontalList && categoriesListMenu?.classList.contains('active') || categoriesListMenuVertical?.classList.contains('active')) {
            horizontalList.style.display = "none"
          }
          if (categoriesListMenuMobile && categoriesListMenu.classList.contains('active')) {
            categoriesListMenuMobile.style.display = "block"
          }
          if (categoriesListMenuVerticalMobile && categoriesListMenuVertical.classList.contains('active')) {
            categoriesListMenuVerticalMobile.style.display = "block";
          }
        } else {
          if (categoriesListMenuMobile && categoriesListMenu.classList.contains('active')) {
            categoriesListMenuMobile.style.display = "none";
          }

          if (categoriesListMenuVerticalMobile && categoriesListMenuVertical.classList.contains('active')) {
            categoriesListMenuVerticalMobile.style.display = "none";
          }

          if (horizontalList && categoriesListMenu?.classList.contains('active') || categoriesListMenuVertical?.classList.contains('active')) {
            horizontalList.style.display = "block";
          }
        }
      }
      ac(windowWidth);
      al(windowWidth);
      document.querySelectorAll("li.advanced-main a").forEach((item) => {
        item.addEventListener(
          "mouseenter",
          (e) => {
            const target = e.currentTarget;
            const data = target.getAttribute("data-link");
            if (data) {
              for (var item_content of document.querySelectorAll(
                "li.advanced-content > .sub"
              )) {
                item_content.classList.remove("active");
              }
              for (var item of document.querySelectorAll(
                "li.advanced-main a"
              )) {
                item.classList.remove("active");
              }

              target.classList.add("active");
              if (document.getElementById(data)) {
                document.getElementById(data).classList.add("active");
              }
            }
          },
          false
        );
      });
      let headerbar = 0;
      if (document.getElementById("announcement-bar")) {
        headerbar = document.getElementById("announcement-bar")?.clientHeight;
      }
      let sticky_height = 0;
      if (document.getElementById("bls__sticky-addcart")) {
        sticky_height = document.getElementById("bls__sticky-addcart")?.clientHeight;
      }
      let headertopbar = 0;
      if (document.getElementById("shopify-section-top-bar")) {
        headertopbar = document.getElementById(
          "shopify-section-top-bar"
        ).clientHeight;
      }
      let headerpage = document.getElementById("page-header")?.clientHeight;
      document
        .querySelector("body")
        .setAttribute(
          "style",
          "--height-bar: " +
          headerbar +
          "px;--height-header: " +
          headerpage +
          "px;--height-sticky: " +
          sticky_height +
          "px "
        );
      if (sticky == "true") {
        if (sticky_mobile == "false" && window.innerWidth < 1025) {
          return;
        }
        let headerSpaceH =
          document.getElementById("sticky-header").offsetHeight;
        let newdiv = document.createElement("div");
        let headerh = headerbar + headertopbar + headerSpaceH;
        newdiv.style.height = headerSpaceH + "px";
        newdiv.classList.add("headerSpace", "unvisible");
        document.querySelector("#sticky-header").after(newdiv);
        window.addEventListener("scroll", () => {
          const currentScroll = window.pageYOffset;
          if (
            currentScroll <= header.querySelector(".header-middle").offsetTop
          ) {
            if (header.classList.contains("transparent")) {
              header.classList.add("transparent");
            }
            return;
          }
          if (header.classList.contains("transparent")) {
            header.classList.remove("transparent");
          }
        });
        window.addEventListener("scroll", () => {
          stickyFunction();
        });
        function stickyFunction() {
          if (window.pageYOffset > headerh) {
            header.classList.add("header_scroll_down");
            header.classList.add("header_scroll_up");
            header.querySelector(".headerSpace").classList.remove("unvisible");
            if (document.querySelector(".extent-button-right-bar")) {
              document
                .querySelector(".extent-button-right-bar")
                .classList.add("d-xxl-block");
              let extentButtonRightBar = document.querySelector(
                ".extent-button-right-bar"
              );
              let btnFixed = document.querySelector(".btn-fixed");
              if (btnFixed === null) {
                let htmlbuttonright = `<div class="btn-fixed">
                  <a class="demo content-fixed pointer" role="link" aria-label="Select Demos">
                    <span class="icon-btn">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2406 0.780116C10.7017 0.346314 11.3492 0.218262 12.0519 0.218262H15.3573C16.06 0.218262 16.7074 0.346314 17.1686 0.780116C17.6389 1.22258 17.7819 1.85492 17.7819 2.53644V8.10008C17.7819 8.7816 17.6389 9.41395 17.1686 9.85641C16.7074 10.2902 16.06 10.4183 15.3573 10.4183H12.0519C11.3492 10.4183 10.7017 10.2902 10.2406 9.85641C9.77031 9.41395 9.62732 8.7816 9.62732 8.10008V2.53644C9.62732 1.85492 9.77031 1.22258 10.2406 0.780116ZM11.0629 1.65413C10.9461 1.76395 10.8273 1.99069 10.8273 2.53644V8.10008C10.8273 8.64583 10.9461 8.87258 11.0629 8.98239C11.1888 9.10086 11.4537 9.21826 12.0519 9.21826H15.3573C15.9555 9.21826 16.2204 9.10086 16.3463 8.98239C16.463 8.87258 16.5819 8.64583 16.5819 8.10008V2.53644C16.5819 1.99069 16.463 1.76395 16.3463 1.65413C16.2204 1.53566 15.9555 1.41826 15.3573 1.41826H12.0519C11.4537 1.41826 11.1888 1.53566 11.0629 1.65413Z" fill="#212529"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2406 12.2345C10.7017 11.8007 11.3492 11.6726 12.0519 11.6726H15.3573C16.06 11.6726 16.7074 11.8007 17.1686 12.2345C17.6389 12.6769 17.7819 13.3093 17.7819 13.9908V15.4635C17.7819 16.145 17.6389 16.7774 17.1686 17.2198C16.7074 17.6536 16.06 17.7817 15.3573 17.7817H12.0519C11.3492 17.7817 10.7017 17.6536 10.2406 17.2198C9.77031 16.7774 9.62732 16.145 9.62732 15.4635V13.9908C9.62732 13.3093 9.77031 12.6769 10.2406 12.2345ZM11.0629 13.1085C10.9461 13.2183 10.8273 13.445 10.8273 13.9908V15.4635C10.8273 16.0093 10.9461 16.236 11.0629 16.3458C11.1888 16.4643 11.4537 16.5817 12.0519 16.5817H15.3573C15.9555 16.5817 16.2204 16.4643 16.3463 16.3458C16.463 16.236 16.5819 16.0093 16.5819 15.4635V13.9908C16.5819 13.445 16.463 13.2183 16.3463 13.1085C16.2204 12.99 15.9555 12.8726 15.3573 12.8726H12.0519C11.4537 12.8726 11.1888 12.99 11.0629 13.1085Z" fill="#212529"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.6537 9.01766C1.53697 9.12747 1.41814 9.35422 1.41814 9.89997V15.4636C1.41814 16.0094 1.53697 16.2361 1.6537 16.3459C1.77962 16.4644 2.04448 16.5818 2.64269 16.5818H5.94814C6.54634 16.5818 6.8112 16.4644 6.93713 16.3459C7.05385 16.2361 7.17269 16.0094 7.17269 15.4636V9.89997C7.17269 9.35422 7.05385 9.12747 6.93713 9.01766C6.8112 8.89919 6.54634 8.78179 5.94814 8.78179H2.64269C2.04448 8.78179 1.77962 8.89919 1.6537 9.01766ZM0.831448 8.14364C1.29256 7.70984 1.93998 7.58179 2.64269 7.58179H5.94814C6.65085 7.58179 7.29826 7.70984 7.75938 8.14364C8.2297 8.5861 8.37269 9.21845 8.37269 9.89997V15.4636C8.37269 16.1451 8.2297 16.7775 7.75938 17.2199C7.29826 17.6537 6.65085 17.7818 5.94814 17.7818H2.64269C1.93998 17.7818 1.29256 17.6537 0.831448 17.2199C0.361128 16.7775 0.21814 16.1451 0.21814 15.4636V9.89997C0.21814 9.21844 0.361128 8.5861 0.831448 8.14364Z" fill="#212529"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.6537 1.65413C1.53697 1.76395 1.41814 1.99069 1.41814 2.53644V4.00917C1.41814 4.55492 1.53697 4.78167 1.6537 4.89148C1.77962 5.00995 2.04448 5.12735 2.64269 5.12735H5.94814C6.54634 5.12735 6.8112 5.00995 6.93713 4.89148C7.05385 4.78167 7.17269 4.55492 7.17269 4.00917V2.53644C7.17269 1.99069 7.05385 1.76395 6.93713 1.65413C6.8112 1.53566 6.54634 1.41826 5.94814 1.41826H2.64269C2.04448 1.41826 1.77962 1.53566 1.6537 1.65413ZM0.831448 0.780116C1.29256 0.346314 1.93998 0.218262 2.64269 0.218262H5.94814C6.65085 0.218262 7.29826 0.346314 7.75938 0.780116C8.2297 1.22258 8.37269 1.85492 8.37269 2.53644V4.00917C8.37269 4.69069 8.2297 5.32304 7.75938 5.7655C7.29826 6.1993 6.65085 6.32735 5.94814 6.32735H2.64269C1.93998 6.32735 1.29256 6.1993 0.831448 5.7655C0.361128 5.32304 0.21814 4.69069 0.21814 4.00917V2.53644C0.21814 1.85492 0.361128 1.22258 0.831448 0.780116Z" fill="#212529"/>
                      </svg>
                    </span>
                    <span class="box-desc tooltip-f"> Select Demos </span>
                  </a>
                  <a
                    href="https://blueskytechmage.com/shopify/uminio-theme/#features"
                    aria-label="Features"
                    class="content-fixed"
                    target="_blank"
                  >
                    <span class="icon-btn">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="18" height="18" fill="none"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.54404 1.54059C2.65827 0.42709 4.3263 0 6.48283 0H11.5172C13.6737 0 15.3417 0.42709 16.456 1.54059C17.5716 2.65555 18 4.32629 18 6.48447V11.5155C18 13.6737 17.5716 15.3445 16.456 16.4594C15.3417 17.5729 13.6737 18 11.5172 18H6.48283C4.3263 18 2.65827 17.5729 1.54404 16.4594C0.428359 15.3445 0 13.6737 0 11.5155V6.48447C0 4.32629 0.428359 2.65555 1.54404 1.54059ZM2.40174 2.41437C1.62954 3.18607 1.21884 4.45011 1.21884 6.48447V11.5155C1.21884 13.5499 1.62954 14.8139 2.40174 15.5856C3.17539 16.3588 4.44406 16.7702 6.48283 16.7702H11.5172C13.5559 16.7702 14.8246 16.3588 15.5983 15.5856C16.3705 14.8139 16.7812 13.5499 16.7812 11.5155V6.48447C16.7812 4.45011 16.3705 3.18607 15.5983 2.41437C14.8246 1.64123 13.5559 1.22981 11.5172 1.22981H6.48283C4.44406 1.22981 3.17539 1.64123 2.40174 2.41437Z" fill="#212529"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.93317 4.37377C9.63723 3.61699 10.953 4.08433 10.953 5.1047V7.84039H11.8419C12.8317 7.84039 13.3686 8.95684 12.7098 9.67166C12.7097 9.67173 12.7099 9.6716 12.7098 9.67166L9.06683 13.6262C8.36277 14.383 7.047 13.9157 7.047 12.8953V10.1596H6.15811C5.16826 10.1596 4.63139 9.04315 5.2902 8.32833C5.29026 8.32827 5.29014 8.3284 5.2902 8.32833L8.93317 4.37377ZM9.75641 5.21051L6.25047 9.01633H7.6453C7.97572 9.01633 8.24359 9.27226 8.24359 9.58797V12.7895L11.7495 8.98367H10.3547C10.0243 8.98367 9.75641 8.72773 9.75641 8.41203V5.21051Z" fill="#212529"/>
                      </svg>
                    </span>
                    <span class="box-desc tooltip-f"> Features </span>
                  </a>
                  <a
                    href="https://themeforest.net/item/umino-multipurpose-shopify-themes-os-20/42969030"
                    aria-label="Buy Now"
                    target="_blank"
                    class="content-fixed show-mobile"
                  >
                    <span class="icon-btn">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.26846 10.156C6.59983 10.156 6.86846 10.4246 6.86846 10.756C6.86846 11.9231 7.83292 12.8875 9 12.8875C10.1671 12.8875 11.1315 11.9231 11.1315 10.756C11.1315 10.4246 11.4002 10.156 11.7315 10.156C12.0629 10.156 12.3315 10.4246 12.3315 10.756C12.3315 12.5858 10.8298 14.0875 9 14.0875C7.17018 14.0875 5.66846 12.5858 5.66846 10.756C5.66846 10.4246 5.93709 10.156 6.26846 10.156Z" fill="#111111"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.93408 0.770732C7.16872 1.00472 7.16924 1.38462 6.93525 1.61926L4.11005 4.45226C3.87606 4.6869 3.49616 4.68742 3.26153 4.45343C3.02689 4.21944 3.02637 3.83954 3.26036 3.6049L6.08555 0.771903C6.31954 0.537265 6.69944 0.536741 6.93408 0.770732Z" fill="#111111"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.066 0.770732C11.3006 0.536741 11.6805 0.537265 11.9145 0.771903L14.7397 3.6049C14.9737 3.83954 14.9732 4.21944 14.7385 4.45343C14.5039 4.68742 14.124 4.6869 13.89 4.45226L11.0648 1.61926C10.8308 1.38462 10.8313 1.00472 11.066 0.770732Z" fill="#111111"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.03579 4.93786C1.9586 4.98956 1.79558 5.1378 1.79558 5.76122C1.79558 6.53405 1.97485 6.63591 2.00045 6.65046C2.00083 6.65067 2.00118 6.65087 2.00149 6.65105C2.04429 6.67571 2.1264 6.7033 2.29644 6.71579C2.42615 6.72532 2.55965 6.72432 2.72619 6.72307C2.7884 6.72261 2.85521 6.72211 2.92816 6.72211H15.0718C15.1448 6.72211 15.2116 6.72261 15.2738 6.72307C15.4403 6.72432 15.5738 6.72532 15.7035 6.71579C15.8736 6.7033 15.9557 6.67571 15.9985 6.65105L15.9995 6.65046C16.0251 6.63591 16.2044 6.53405 16.2044 5.76122C16.2044 5.1378 16.0414 4.98956 15.9642 4.93786C15.8225 4.84293 15.5702 4.80034 15.0718 4.80034H2.92816C2.42976 4.80034 2.17753 4.84293 2.03579 4.93786ZM1.368 3.94084C1.85256 3.61629 2.46661 3.60034 2.92816 3.60034H15.0718C15.5334 3.60034 16.1474 3.61629 16.632 3.94084C17.1811 4.30863 17.4044 4.94083 17.4044 5.76122C17.4044 6.65485 17.2027 7.34205 16.5977 7.69074C16.3273 7.84655 16.0363 7.89458 15.7915 7.91257C15.6088 7.92599 15.4055 7.92438 15.2249 7.92294C15.1715 7.92251 15.1201 7.92211 15.0718 7.92211H2.92816C2.87987 7.92211 2.82847 7.92251 2.7751 7.92294C2.59449 7.92438 2.3912 7.92599 2.2085 7.91257C1.96368 7.89458 1.67265 7.84655 1.40229 7.69074C0.797263 7.34205 0.595581 6.65485 0.595581 5.76122C0.595581 4.94083 0.818881 4.30863 1.368 3.94084Z" fill="#111111"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7467 6.84984C16.0721 6.91225 16.2854 7.22667 16.223 7.55211L14.9118 14.3886C14.9118 14.3887 14.9119 14.3885 14.9118 14.3886C14.7739 15.1091 14.593 15.9124 14.0279 16.5045C13.437 17.1236 12.5442 17.4044 11.2554 17.4044H6.54937C5.33588 17.4044 4.44854 17.1012 3.83769 16.4826C3.24376 15.8811 3.00535 15.0723 2.87463 14.2798L1.77404 7.53574C1.72067 7.20869 1.94252 6.90031 2.26957 6.84693C2.59661 6.79356 2.905 7.01542 2.95837 7.34246L4.05863 14.0845C4.0586 14.0843 4.05865 14.0846 4.05863 14.0845C4.17764 14.8057 4.36465 15.3084 4.69156 15.6394C5.00163 15.9535 5.5308 16.2044 6.54937 16.2044H11.2554C12.3938 16.2044 12.8941 15.9545 13.1598 15.676C13.4511 15.3707 13.5903 14.9096 13.7333 14.1629L15.0444 7.32609C15.1068 7.00065 15.4213 6.78743 15.7467 6.84984Z" fill="#111111"/>
                      </svg>
                    </span>
                    <span class="box-desc tooltip-f"> Buy Now </span>
                  </a>
                  <a
                    href="https://shopify.pxf.io/c/3722068/1061744/13624"
                    aria-label="Open Store"
                    target="_blank"
                    class="content-fixed"
                  >
                    <span class="icon-btn">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.72023 7.79663C2.03319 7.79663 2.2869 8.05183 2.2869 8.36663V12.0126C2.2869 13.7784 2.64417 14.8673 3.30633 15.5295C3.96931 16.1925 5.06039 16.5503 6.8279 16.5503H11.2047C12.9723 16.5503 14.0633 16.1925 14.7263 15.5295C15.3885 14.8673 15.7457 13.7784 15.7457 12.0126V8.36663C15.7457 8.05183 15.9994 7.79663 16.3124 7.79663C16.6254 7.79663 16.8791 8.05183 16.8791 8.36663V12.0126C16.8791 13.8929 16.5055 15.3578 15.5253 16.338C14.546 17.3173 13.0832 17.6903 11.2047 17.6903H6.8279C4.9494 17.6903 3.48665 17.3173 2.50729 16.338C1.52712 15.3578 1.15356 13.8929 1.15356 12.0126V8.36663C1.15356 8.05183 1.40727 7.79663 1.72023 7.79663Z" fill="#111111"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.56445 0.822476C6.59366 0.531308 6.83732 0.309692 7.12826 0.309692H10.9204C11.2117 0.309692 11.4555 0.531786 11.4843 0.823321L12.0203 6.24768C12.1996 8.07135 10.839 9.56999 9.02029 9.56999C7.20157 9.56999 5.84091 8.0716 6.02028 6.24793L6.56445 0.822476ZM7.64063 1.44969L7.14811 6.36017C7.14809 6.36035 7.14813 6.36 7.14811 6.36017C7.03547 7.50828 7.86716 8.42999 9.02029 8.42999C10.1736 8.42999 11.0054 7.50853 10.8925 6.36017L10.4073 1.44969H7.64063Z" fill="#111111"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.4677 0.497312C10.5751 0.377852 10.7278 0.309692 10.888 0.309692H13.3646C14.4858 0.309692 15.3931 0.52107 16.0521 1.12978C16.7043 1.73223 17.0057 2.6263 17.1578 3.72437C17.1587 3.73121 17.1595 3.73806 17.1602 3.74493L17.3877 5.97932C17.5838 7.94953 16.1173 9.56999 14.1442 9.56999C12.5168 9.56999 11.061 8.26389 10.8927 6.63078L10.8925 6.62899L10.3241 0.936659C10.3081 0.77638 10.3603 0.616773 10.4677 0.497312ZM11.5144 1.44969L12.02 6.51326C12.02 6.51298 12.0201 6.51355 12.02 6.51326C12.1283 7.55948 13.0922 8.42999 14.1442 8.42999C15.4515 8.42999 16.3885 7.38735 16.2601 6.09352C16.2601 6.0933 16.2601 6.09375 16.2601 6.09352L16.0339 3.87154C15.8933 2.86465 15.6431 2.29974 15.2855 1.96945C14.9335 1.64433 14.371 1.44969 13.3646 1.44969H11.5144Z" fill="#111111"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.93987 1.12978C2.59887 0.52107 3.50613 0.309692 4.62729 0.309692H7.10398C7.26414 0.309692 7.41681 0.377863 7.52425 0.497342C7.63168 0.616821 7.68383 0.776449 7.6678 0.93674L7.09955 6.62736C7.09952 6.6276 7.09957 6.62711 7.09955 6.62736C6.94048 8.26363 5.48231 9.56999 3.85586 9.56999C1.88289 9.56999 0.41646 7.94975 0.61227 5.9797C0.612257 5.97983 0.612283 5.97958 0.61227 5.9797L0.831483 3.74698C0.832225 3.73943 0.833116 3.73189 0.834157 3.72437C0.986197 2.6263 1.28765 1.73223 1.93987 1.12978ZM1.9582 3.87052L1.74008 6.0921C1.61131 7.38625 2.54836 8.42999 3.85586 8.42999C4.90886 8.42999 5.87042 7.55977 5.97157 6.51669L5.97171 6.51523L6.47745 1.44969H4.62729C3.62092 1.44969 3.05841 1.64433 2.70643 1.96945C2.34898 2.29963 2.09878 2.86427 1.9582 3.87052Z" fill="#111111"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.09724 13.1624C7.57954 12.6801 8.25662 12.4901 9.02033 12.4901C9.78403 12.4901 10.4611 12.6801 10.9434 13.1624C11.4263 13.6453 11.6171 14.3243 11.6171 15.0902V17.1203C11.6171 17.4351 11.3634 17.6903 11.0504 17.6903H6.99025C6.67729 17.6903 6.42358 17.4351 6.42358 17.1203V15.0902C6.42358 14.3243 6.61432 13.6453 7.09724 13.1624ZM7.89627 13.9708C7.70317 14.1639 7.55692 14.5 7.55692 15.0902V16.5503H10.4837V15.0902C10.4837 14.5 10.3375 14.1639 10.1444 13.9708C9.95067 13.7771 9.61271 13.6301 9.02033 13.6301C8.42794 13.6301 8.08999 13.7771 7.89627 13.9708Z" fill="#111111"/>
                      </svg>
                    </span>
                    <span class="box-desc tooltip-f"> Open Store </span>
                  </a>
                </div>`;
                extentButtonRightBar.insertAdjacentHTML(
                  "beforeend",
                  htmlbuttonright
                );
                extentButtonRightBar.init();
              }
            }
          } else {
            header.classList.remove("header_scroll_down");
            header.querySelector(".headerSpace").classList.add("unvisible");
            if (document.querySelector(".extent-button-right-bar")) {
              document
                .querySelector(".extent-button-right-bar")
                .classList.remove("d-xxl-block");
            }
            if (document.querySelector(".bls__overlay")) {
              document.documentElement.classList.remove("vetical-overlay");
              document
                .querySelector(".bls__overlay")
                .classList.add("d-none-overlay");
            }
            if (document.querySelector(".vertical-menu")) {
              if (
                document
                  .querySelector(".vertical-menu")
                  .classList.contains("open")
              ) {
                document
                  .querySelector(".vertical-menu")
                  .classList.remove("open");
              }
            }
          }
        }
      }

      if (bls_main_menu) {
        _this.loadImageMenu();
        let width = window.innerWidth;
        if (width > 1024) {
          _this.addCssSubMenu();
        }
        window.addEventListener(
          "resize",
          function (event) {
            if (width > 1024) {
              _this.addCssSubMenu();
            }
          },
          true
        );
      }
    },
    initVerticalMenu: function () {
      document.querySelectorAll(".close-menu").forEach((closeToggle) => {
        closeToggle.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            document.documentElement.classList.remove("nav-open");
            document.querySelectorAll('.submenu,.subchildmenu').forEach(item => {
              item.classList.remove("is--open");
              if (item.classList.contains('is--open-lv2')) {
                item.classList.remove("is--open-lv2");
              }
              if (item.classList.contains('is--open-lv3')) {
                item.classList.remove("is--open-lv3");
              }
            })
          },
          false
        );
      });
      let width = screen.width;
      const article = document.querySelector(".verticalmenu-html");
      if (article === null) return;
      const limitItemShow = article.dataset.limitshowitem;
      const lenghtLi = document.querySelectorAll(
        ".verticalmenu-html .level0"
      ).length;
      if (width > 1024) {
        if (lenghtLi > limitItemShow) {
          var lineItem = Array.from(
            document.querySelectorAll(".verticalmenu-html .level0")
          );
          lineItem.forEach((element, index) => {
            if (index > limitItemShow - 1) {
              const item = lineItem[index];
              if (item.classList.contains("expand-menu-link")) {
                return;
              }
              item.classList.add("orther-link");
              item.style.display = "none";
            }
          });
          document.querySelector(
            ".verticalmenu-html .expand-menu-link"
          ).style.display = "block";
          document
            .querySelector(".verticalmenu-html .expand-menu-link a")
            .addEventListener(
              "click",
              (e) => {
                e.preventDefault();
                const target = e.currentTarget;
                const parent = target.parentElement;
                if (!parent.classList.contains("expanding")) {
                  parent.classList.add("expanding");
                  parent.querySelector("a").innerHTML =
                    window.menuStrings?.hideMenus;
                  for (var item of document.querySelectorAll(
                    ".verticalmenu-html .level0.orther-link"
                  )) {
                    showAnime(item);
                  }
                } else {
                  parent.classList.remove("expanding");
                  parent.querySelector("a").innerHTML =
                    window.menuStrings?.moreMenus;
                  for (var item of document.querySelectorAll(
                    ".verticalmenu-html .level0.orther-link"
                  )) {
                    hideAnime(item);
                  }
                }
              },
              false
            );
        } else {
          document.querySelector(".expand-menu-link").style.display = "none";
        }
      }
      if (document.querySelector(".bls_vertical_menu .title-menu-dropdown")) {
        document
          .querySelector(".bls_vertical_menu .title-menu-dropdown")
          .addEventListener("click", (event) => {
            event.preventDefault();
            const target = event.currentTarget;
            const closest = target.closest(".vertical-menu");
            if (closest.classList.contains("open")) {
              closest.classList.remove("open");
              if (document.querySelector(".bls__overlay")) {
                document.documentElement.classList.remove("vetical-overlay");
                document
                  .querySelector(".bls__overlay")
                  .classList.add("d-none-overlay");
              }
            } else {
              closest.classList.add("open");
              if (document.querySelector(".bls__overlay")) {
                document.documentElement.classList.add("vetical-overlay");
                document
                  .querySelector(".bls__overlay")
                  .classList.remove("d-none-overlay");
              }
            }
          });
      }
    },
    onMenuItemEnter: function (evt, index) {
      const target = evt;
      target.classList.add("bls-item-active");
    },
    onMenuItemLeave: function (evt, index) {
      const target = evt;
      target.classList.remove("bls-item-active");
    },
    onMenuMobileItem: function (evt) {
      var menu_parent = "li.bls__menu-parent > .open-children-toggle";
      var menu_submenu = "li.bls__menu-parent .submenu .open-children-toggle";
      if (evt) {
        menu_parent =
          ".verticalmenu-list li.bls__menu-parent > .open-children-toggle";
        menu_submenu =
          ".verticalmenu-list li.bls__menu-parent .submenu .open-children-toggle";
      }
      document.querySelectorAll(menu_parent).forEach((childrenToggle) => {
        childrenToggle.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            const parent = target.parentElement;
            const submenu = parent.querySelector(".submenu");
            slideAnime({
              target: submenu,
              animeType: "slideToggle",
            });
            if (!parent.querySelector("a").classList.contains("active")) {
              parent.querySelector("a").classList.add("active");
            } else {
              parent.querySelector("a").classList.remove("active");
            }
          },
          false
        );
      });

      document.querySelectorAll(menu_submenu).forEach((childrenToggle) => {
        childrenToggle.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const parent = target.parentElement;
          const submenu = parent.querySelector(".subchildmenu");
          slideAnime({
            target: submenu,
            animeType: "slideToggle",
          });
          if (!parent.querySelector("a").classList.contains("active")) {
            parent.querySelector("a").classList.add("active");
          } else {
            parent.querySelector("a").classList.remove("active");
          }
        });
      });
    },
    addCssSubMenu: function () {
      const bodyWidth =
        document.documentElement.clientWidth || document.body.clientWidth;
      const header = document.querySelector("header");
      const submenu_center = document.querySelector(".bls_submenu-center");
      const width_sub_center = document
        .querySelector("[data-width-sub-center]")
        ?.getAttribute("data-width-sub-center");
      if (!header || bodyWidth < 1024) return;
      var padding = 30;
      if (bodyWidth < 1200) {
        padding = 15;
      }
      document
        .querySelectorAll(".horizontal-list .menu-width-custom > .submenu")
        .forEach((submenu) => {
          if (submenu_center) {
            var submenu_data = submenu.getBoundingClientRect();
            var width = submenu_data.width;
            var left = submenu_data.left;
            var right = submenu_data.right;
            if (width_sub_center <= width) {
              var left_style = (left - (right - bodyWidth)) / 2;
              submenu.style.left = left_style + "px";
            }
          } else {
            const elementWidth = submenu.clientWidth;
            const elementLeft = submenu.offsetLeft;
            if (bodyWidth - (elementWidth + elementLeft) < 0) {
              var left = bodyWidth - (elementWidth + elementLeft);
              left = left + elementLeft - padding;
              if (elementLeft < 0) {
                left = 0;
              }
              submenu.style.left = left + "px";
            }
          }
        });
    },
    loadImageMenu: function () {
      const menu_parent = document.querySelectorAll(".bls__menu-parent");
      var width = window.innerWidth;
      menu_parent.forEach((menu) => {
        menu.addEventListener("mouseover", (items) => {
          var target = items.currentTarget;
          target.querySelectorAll(".menu-banner-loaded").forEach((item) => {
            var dataImgBanner = item?.dataset.imageBanner;
            var dataImgWidth = item?.dataset.width;
            var dataImgHeight = item?.dataset.height;
            var img = item.querySelector(".image-banner-loaded");
            if (img == null && dataImgBanner != undefined) {
              item.innerHTML = `<img 
              src=${dataImgBanner} 
              alt="Menu banner" 
              srcset="${dataImgBanner}&amp;width=375 375w, ${dataImgBanner}&amp;width=550 550w, ${dataImgBanner}&amp;width=750 750w, ${dataImgBanner}&amp;width=1100 1100w, ${dataImgBanner}&amp;width=1500 1500w, ${dataImgBanner}&amp;width=1780 1780w, ${dataImgBanner}&amp;width=2000 2000w, ${dataImgBanner}&amp;width=3000 3000w, ${dataImgBanner}&amp;width=3840 3840w" 
              sizes="100vw",
              class="image-banner-loaded"
              loading="lazy"
              width="${dataImgWidth}"
              height="${dataImgHeight}"
            >`;
            }
          });
        });
      });
    },
    loadMoreMenu: function () {
      let firstMenuParent =
        document.querySelector(".horizontal-list")?.firstChild;
      let submenu = firstMenuParent?.querySelector(".submenu");
      let loadmore = submenu?.querySelector(".extent-loadmore-button");
      let loadmoreButton = document.querySelector(".loadmore-menu");
      if (loadmoreButton == null) {
        let loadmoreHtml = `<div class="loadmore-menu text-center">
          <a  class="demo whitespace-nowrap btn-primary" role="link" aria-label="View All Demos">
            View All Demos
          </a>
        </div>`;
        loadmore?.insertAdjacentHTML("beforeend", loadmoreHtml);
        loadmore?.init();
      }
    },
  };
})();
BlsMainMenuShopify.init();

var BlsMenuActionMobile = (function () {
  return {
    init: function () {
      this.menuTabActions();
    },
    menuTabActions: function () {
      var back_main_menu = ".back-main-menu",
        back_main_menu_lv1 = ".back-main-menu-lv1",
        back_main_menu_lv2 = ".back-main-menu-lv2",
        back_main_menu_lv3 = ".back-main-menu-lv3",
        menu_parent_link = "li.bls__menu-parent > a",
        menu_parent = "li.bls__menu-parent > .open-children-toggle",
        submenu = ".submenu",
        subchildmenu = ".subchildmenu",
        menu_lv2 = "[data-menu-level2]",
        dropdown_lv2 = ".submenu .dropdown li.level-1 > .open-children-toggle",
        dropdown_lv3 = ".submenu .dropdown li.level-2 > .open-children-toggle";
      let windowWidth = window.innerWidth;
      if (windowWidth <= 1024) {
        document.querySelectorAll(menu_parent_link).forEach((link) => {
          const main = link
            .closest(".main-nav")?.getAttribute("data-action-mobile");
          if (main === "false") {
            link.removeAttribute("href");
            link.classList.add("not-links");
            link.setAttribute("role", "link");
          }
        });
      }
      document.querySelectorAll(menu_parent).forEach((main) => {
        main.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const parent = target.parentElement;
          var menu_lv2_nodes = parent.querySelectorAll(
            ".submenu [data-menu-level2]"
          );
          if (menu_lv2_nodes) {
            var menu_lv2_last = menu_lv2_nodes[menu_lv2_nodes.length - 1];
            if (menu_lv2_last) {
              menu_lv2_last.classList.add("last-child");
            }
          }
          if (parent.querySelector(".submenu")) {
            if (
              !parent.querySelector(".submenu").classList.contains("is--open")
            ) {
              parent.querySelector(".submenu").classList.add("is--open");
            } else {
              parent.querySelector(".submenu").classList.remove("is--open");
            }
          }
        });
      });

      document.querySelectorAll(back_main_menu).forEach((back) => {
        back.addEventListener("click", (e) => {
          const target = e.currentTarget;
          e.preventDefault();
          target.closest(submenu).classList.remove("is--open");
        });
      });

      document.querySelectorAll(menu_lv2).forEach((lv2) => {
        lv2.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const parent = target.parentElement;
          if (
            !parent.querySelector(".subchildmenu")?.classList.contains("is--open")
          ) {
            parent.querySelector(".subchildmenu").classList.add("is--open");
          } else {
            parent.querySelector(".subchildmenu").classList.remove("is--open");
          }
        });
      });

      document.querySelectorAll(back_main_menu_lv1).forEach((back) => {
        back.addEventListener("click", (e) => {
          e.preventDefault();
          for (var item of document.querySelectorAll(subchildmenu)) {
            item.classList.remove("is--open");
          }
        });
      });

      document.querySelectorAll(back_main_menu_lv2).forEach((back) => {
        back.addEventListener("click", (e) => {
          e.preventDefault();
          const target = e.currentTarget;
          target.closest(subchildmenu).classList.remove("is--open-lv2");
        });
      });

      document.querySelectorAll(back_main_menu_lv3).forEach((back) => {
        back.addEventListener("click", (e) => {
          e.preventDefault();
          const target = e.currentTarget;
          target.closest(subchildmenu).classList.remove("is--open-lv3");
        });
      });

      document.querySelectorAll(dropdown_lv2).forEach((lv3) => {
        lv3.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const parent = target.parentElement;
          if (
            !parent.querySelector("li .subchildmenu")?.classList.contains("is--open-lv2")
          ) {
            parent
              .querySelector("li .subchildmenu")
              .classList.add("is--open-lv2");
          } else {
            parent
              .querySelector("li .subchildmenu")
              .classList.remove("is--open-lv2");
          }
        });
      });

      document.querySelectorAll(dropdown_lv3).forEach((lv3) => {
        lv3.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const parent = target.parentElement;
          if (
            !parent.querySelector("li .subchildmenu")?.classList.contains("is--open-lv3")
          ) {
            parent
              .querySelector("li .subchildmenu")
              .classList.add("is--open-lv3");
          } else {
            parent
              .querySelector("li .subchildmenu")
              .classList.remove("is--open-lv3");
          }
        });
      });
    },
  };
})();
BlsMenuActionMobile.init();

var BlsSearchShopify = (function () {
  return {
    init: function () {
      var predictive = document.querySelector("#predictive-search");
      if (predictive) {
        this.setupEventListeners();
      }
      const form = document.querySelector("#search-form");
      document.querySelectorAll(".top-search-toggle").forEach((navToggle) => {
        navToggle.addEventListener("click", () => {
          if (!form.classList.contains("bls__opend-popup-header")) {
            form.classList.add("bls__opend-popup-header");
            document.documentElement.classList.add("hside_opened");
            document.documentElement.classList.add("open-search");
            setTimeout(function () {
              form.querySelector('input[type="search"]').focus();
            }, 100);
          } else {
            form.classList.remove("bls__opend-popup-header");
            document.documentElement.classList.remove("hside_opened");
            document.documentElement.classList.remove("open-search");
          }
        });
      });
      document
        .querySelectorAll(".mini_search_header .button-close")
        .forEach((navToggle) => {
          navToggle.addEventListener("click", () => {
            form.classList.remove("bls__opend-popup-header");
            document.documentElement.classList.remove("hside_opened");
            document.documentElement.classList.remove("open-search");
          });
        });
      const sf = document.querySelector(".search-full");
      if (sf) {
        const hs = sf.closest(".header_search");
        document.addEventListener("click", (e) => {
          const ehs = e.target.closest(".header_search");
          if (!ehs) {
            if (hs) {
              const ps = hs.querySelector(".popup-search");
              ps.classList.remove("popup-search-show");
            }
          } else {
            const ps = ehs.querySelector(".popup-search");
            ps.classList.add("popup-search-show");
            if (e.target && e.target.classList.contains("popup-search-show")) {
              ps.classList.remove("popup-search-show");
            }
          }
        });
      }
    },
    setupEventListeners: function () {
      const input = document.querySelector('input[type="search"]');
      const form = document.querySelector("form.search");
      form.addEventListener("submit", this.onFormSubmit.bind(this));
      input.addEventListener(
        "input",
        this.debounce((event) => {
          this.onChange(event);
        }, 300).bind(this)
      );
      input.addEventListener("focus", this.onFocus.bind(this));
      document.addEventListener("focusout", this.onFocusOut.bind(this));
      document.addEventListener("keyup", this.onKeyup.bind(this));
      document
        .querySelectorAll('.select_cat [data-name="product_type"] li')
        .forEach((product_type) => {
          product_type.addEventListener("click", (e) => {
            const target = e.currentTarget;
            if (target.classList.contains("active")) {
              return;
            } else {
              for (var item of document.querySelectorAll(
                '.select_cat [data-name="product_type"] li'
              )) {
                item.classList.remove("active");
              }
              target.classList.add("active");
              document
                .querySelector("#search_mini_form")
                .querySelector('[name="category"]').value =
                target.getAttribute("data-value");
              this.onChange();
            }
          });
        });
    },

    debounce: function (fn, wait) {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
      };
    },

    getQuery: function () {
      return document.querySelector('input[type="search"]').value.trim();
    },

    onChange: function () {
      const searchTerm = this.getQuery();
      if (!searchTerm.length) {
        this.close(true);
        return;
      }
      this.getSearchResults(searchTerm);
    },

    onFormSubmit: function (event) {
      if (
        !this.getQuery().length ||
        this.querySelector('[aria-selected="true"] a')
      )
        event.preventDefault();
    },

    onFocus: function () {
      const searchTerm = this.getQuery();
      if (!searchTerm.length) return;
      if (
        document
          .querySelector("#predictive-search")
          .classList.contains("results")
      ) {
        this.open();
      } else {
        this.getSearchResults(searchTerm);
      }
    },

    onFocusOut: function () {
      setTimeout(() => {
        if (!document.contains(document.activeElement)) this.close();
      });
    },

    onKeyup: function (event) {
      if (!this.getQuery().length) this.close(true);
      event.preventDefault();

      switch (event.code) {
        case "ArrowUp":
          this.switchOption("up");
          break;
        case "ArrowDown":
          this.switchOption("down");
          break;
        case "Enter":
          this.selectOption();
          break;
      }
    },

    switchOption: function (direction) {
      if (!this.getAttribute("open")) return;
      const moveUp = direction === "up";
      const selectedElement = document.querySelector('[aria-selected="true"]');
      const allElements = document.querySelectorAll("li");
      let activeElement = document.querySelector("li");

      if (moveUp && !selectedElement) return;

      this.statusElement.textContent = "";

      if (!moveUp && selectedElement) {
        activeElement = selectedElement.nextElementSibling || allElements[0];
      } else if (moveUp) {
        activeElement =
          selectedElement.previousElementSibling ||
          allElements[allElements.length - 1];
      }

      if (activeElement === selectedElement) return;

      activeElement.setAttribute("aria-selected", true);
      if (selectedElement) selectedElement.setAttribute("aria-selected", false);
      document
        .querySelector('input[type="search"]')
        .setAttribute("aria-activedescendant", activeElement.id);
    },

    selectOption: function () {
      const selectedProduct = document.querySelector(
        '[aria-selected="true"] a, [aria-selected="true"] button'
      );

      if (selectedProduct) selectedProduct.click();
    },

    getSearchResults: function (searchTerm) {
      const cachedResults = {};
      const queryKey = searchTerm.replace(" ", "-").toLowerCase();
      this.setLiveRegionLoadingState();
      if (cachedResults[queryKey]) {
        this.renderSearchResults(cachedResults[queryKey]);
        return;
      }
      if (document.querySelector(".search_type_popup")) {
        var section_id = "search-predictive-grid";
      } else {
        var section_id = "search-predictive-list";
      }
      if (document.querySelector(".predictive_search_suggest")) {
        var search_url = `${routes?.predictive_search_url
          }?q=${encodeURIComponent(
            searchTerm
          )}&resources[options][fields]=title,tag,vendor,product_type,variants.title,variants.sku&resources[options][prefix]=last&resources[options][unavailable_products]=last&resources[type]=query,product,collection&resources[limit]=6&section_id=${section_id}`;
      } else {
        var search_url = `${routes.search_url}?q=${encodeURIComponent(
          searchTerm
        )}&options[prefix]=last&options[unavailable_products]=last&type=query,product,collection&limit=6&section_id=${section_id}`;
      }
      fetch(`${search_url}`)
        .then((response) => {
          if (!response.ok) {
            var error = new Error(response.status);
            this.close();
            throw error;
          }
          return response.text();
        })
        .then((text) => {
          const resultsMarkup = new DOMParser()
            .parseFromString(text, "text/html")
            .querySelector("#shopify-section-" + section_id + "").innerHTML;
          cachedResults[queryKey] = resultsMarkup;
          this.renderSearchResults(resultsMarkup);
          BlsColorSwatchesShopify.init();
          BlsLazyloadImg.init();
        })
        .catch((error) => {
          this.close();
          throw error;
        });
    },

    setLiveRegionLoadingState: function () {
      document.querySelector("#search_mini_form").classList.add("loading");
      document.querySelector("#predictive-search").classList.add("loading");
    },

    setLiveRegionResults: function () {
      document.querySelector("#search_mini_form").classList.remove("loading");
      document.querySelector("#predictive-search").classList.remove("loading");
    },

    renderSearchResults: function (resultsMarkup) {
      document.querySelector("[data-predictive-search]").innerHTML =
        resultsMarkup;
      document.querySelector("#predictive-search").classList.add("results");
      const quick_search = document.querySelector("#quick-search");
      if (quick_search) {
        quick_search.classList.add("d-none");
      }
      this.setLiveRegionResults();
      this.open();
    },

    open: function () {
      document
        .querySelector('input[type="search"]')
        .setAttribute("aria-expanded", true);
      this.isOpen = true;
    },

    close: function (clearSearchTerm = false) {
      if (clearSearchTerm) {
        document.querySelector('input[type="search"]').value = "";
        document
          .querySelector("#predictive-search")
          .classList.remove("results");
        const quick_search = document.querySelector("#quick-search");
        if (quick_search) {
          quick_search.classList.remove("d-none");
        }
      }
      const selected = document.querySelector('[aria-selected="true"]');
      if (selected) selected.setAttribute("aria-selected", false);
      document
        .querySelector('input[type="search"]')
        .setAttribute("aria-activedescendant", "");
      document
        .querySelector('input[type="search"]')
        .setAttribute("aria-expanded", false);
      this.resultsMaxHeight = false;
      document
        .querySelector("[data-predictive-search]")
        .removeAttribute("style");
      this.isOpen = false;
    },
  };
})();
BlsSearchShopify.init();

var BlsUminoAdminLi = (function () {
  return {
    init: function () {
      this.BlsCheckLi();
    },
    BlsCheckLi: function () {
      const _this = this;
      if (typeof umino_app === "object") {
        if (umino_app.mode === "admin") {
          if (umino_app.action === "active") {
            if (_this.checkCookie(umino_app.lic) === false) {
              _this.BlsActive();
            }
          } else {
            const url =
              "https://api.blueskytechco.store/api/remove-license/?code=" +
              umino_app.lic +
              "&domain=" +
              umino_app.shop;
            fetch(url)
              .then((response) => response.json())
              .then((responseText) => {
                if (responseText) {
                  const dateCreate = new Date(new Date().getTime() - 36e6);
                  _this.setCookie(umino_app.lic, dateCreate);
                }
                _this.BlsRenderHtml(3);
              })
              .catch((e) => {
                console.log(e);
              });
          }
        }
      } else {
        _this.BlsRenderHtml(0);
      }
    },
    BlsRenderHtml: function (cs) {
      const shop = window.location.hostname.replace(/\./g, "-");
      if (!document.querySelector("#" + "bls__" + shop)) {
        const a = document.createElement("DIV");
        const n = document.createElement("DIV");
        const b = document.createElement("h3");
        const c = document.createElement("p");
        const step2p = document.createElement("p");
        const step3p = document.createElement("p");
        const elementH5 = document.createElement("h5");
        const e = document.createElement("h5");
        const f = document.createElement("h5");
        const g = document.createElement("h5");
        const h = document.createElement("strong");
        const sp1 = document.createElement("span");
        const sp2 = document.createElement("span");
        const sp3 = document.createElement("span");
        const pca = document.createElement("a");
        const eca = document.createElement("a");
        const mail = document.createElement("a");
        const br1 = document.createElement("br");
        const br2 = document.createElement("br");
        const br3 = document.createElement("br");
        const br4 = document.createElement("br");
        const spPrice = document.createElement("span");
        const spBold1 = document.createElement("span");
        const spBold2 = document.createElement("span");
        const ecbuy = document.createElement("a");

        var text = "";
        switch (cs) {
          case 1:
            text = "This purchase code was activated for another domain!";
            break;
          case 2:
            text = "This purchase code is invalid!";
            break;
          case 3:
            text = "Purchase Code deleted successfully!";
            break;
          default:
            text = "Welcome to Umino - Shopify Themes OS 2.0 🎉 ";
            break;
        }
        const t = document.createTextNode(text);
        const s = document.createTextNode(
          "Follow these simple steps to use Umino theme:"
        );
        const q = document.createTextNode(
          "Step 1: Add Umino theme file to your 'Online store' > 'Theme'."
        );
        const p = document.createTextNode("Step 2: Insert purchase code");
        const k = document.createTextNode("Step 3: Activate purchase code");
        const r = document.createTextNode("Recommend: Install ");
        const ec = document.createTextNode("EComposer Page Builder");
        const fao = document.createTextNode(" - FREE Add-on for Umino");
        const wh = document.createTextNode(
          "Why you need EComposer Page Builder?"
        );
        const ad1 = document.createTextNode(
          "- One more option to customize Umino layouts."
        );
        const ad2 = document.createTextNode(
          "- Provide another highly flexible editor."
        );
        const ad3 = document.createTextNode("- Especially, ");
        const ad3_3 = document.createTextNode(
          " for Umino users, we offer the "
        );
        const ad3_4 = document.createTextNode(" of this app ");
        const only = document.createTextNode("only");
        const partner = document.createTextNode("Theme Partner Plan");
        const price = document.createTextNode("$114) ");
        const ad3_2 = document.createTextNode(" every year), ");
        const plan_content = document.createTextNode(
          "contact us to upgrade your plan."
        );
        const w = document.createTextNode(
          "Go to 'Theme setting' > 'Purchase code' to insert your purchase code."
        );
        const x = document.createTextNode(
          "Go to 'Theme setting' > 'Purchase code action' and select 'Active purchase code'."
        );
        const m = document.createTextNode("👉 Get Umino purchase code");
        const ecbuy_content = document.createTextNode(
          "👉 Install EComposer Here"
        );
        const step1 = document.createElement("DIV");
        const step2 = document.createElement("DIV");
        const step3 = document.createElement("DIV");
        const recommend = document.createElement("DIV");
        pca.setAttribute("target", "_blank");
        eca.setAttribute("target", "_blank");
        ecbuy.setAttribute("target", "_blank");
        pca.setAttribute(
          "href",
          "https://themeforest.net/item/umino-multipurpose-shopify-themes-os-20/42969030"
        );
        eca.setAttribute(
          "href",
          "https://ecomposer.app/referral?ref=Blueskytechco"
        );
        mail.setAttribute("href", "mailto:the4studio.net@gmail.com");
        ecbuy.setAttribute(
          "href",
          "https://ecomposer.app/referral?ref=Blueskytechco"
        );
        b.setAttribute("class", `msg-${cs}`);
        eca.setAttribute("class", "link");
        mail.setAttribute("class", "link");
        pca.setAttribute("class", "popup-btn");
        ecbuy.setAttribute("class", "popup-btn ecom");
        spPrice.setAttribute("class", "ecom-price");
        spBold1.setAttribute("class", "ecom-bold");
        spBold2.setAttribute("class", "ecom-bold");
        step1.setAttribute("class", "step-1");
        step2.setAttribute("class", "step-2");
        step3.setAttribute("class", "step-3");
        pca.appendChild(m);
        ecbuy.appendChild(ecbuy_content);
        eca.appendChild(ec);
        step2p.appendChild(w);
        step3p.appendChild(x);
        b.appendChild(t);
        c.appendChild(s);
        elementH5.appendChild(q);
        e.appendChild(p);
        f.appendChild(k);
        g.appendChild(r);
        g.appendChild(eca);
        g.appendChild(fao);
        h.appendChild(wh);
        sp1.appendChild(ad1);
        sp2.appendChild(ad2);
        sp3.appendChild(ad3);
        spBold1.appendChild(only);
        sp3.appendChild(spBold1);
        sp3.appendChild(ad3_3);
        spBold2.appendChild(partner);
        sp3.appendChild(spBold2);
        sp3.appendChild(ad3_4);
        // spPrice.appendChild(price);
        sp3.appendChild(spPrice);
        // sp3.appendChild(ad3_2);
        mail.appendChild(plan_content);
        sp3.appendChild(mail);
        step1.appendChild(elementH5);
        step2.appendChild(e);
        step2.appendChild(step2p);
        step2.appendChild(pca);
        step3.appendChild(f);
        step3.appendChild(step3p);
        recommend.appendChild(g);
        recommend.appendChild(h);
        recommend.appendChild(br1);
        recommend.appendChild(sp1);
        recommend.appendChild(br2);
        recommend.appendChild(sp2);
        recommend.appendChild(br3);
        recommend.appendChild(sp3);
        recommend.appendChild(br4);
        recommend.appendChild(ecbuy);
        a.setAttribute("id", "bls__not-active");
        n.appendChild(b);
        n.appendChild(c);
        n.appendChild(step1);
        n.appendChild(step2);
        n.appendChild(step3);
        // n.appendChild(recommend);
        a.appendChild(n);
        setInterval(() => {
          if (document.getElementById("bls__not-active")) {
            document.getElementById("bls__not-active").setAttribute("style", "display: block !important;");
          } else {
            document.querySelector("body").appendChild(a);
          }
        }, 1000);
      } else {
        document.querySelector("#" + "bls__" + shop).remove();
      }
    },
    BlsActive: function () {
      const _this = this;
      const url =
        "https://api.blueskytechco.store/api/check-license/?code=" +
        umino_app.lic +
        "&domain=" +
        umino_app.shop;
      fetch(url)
        .then((response) => response.json())
        .then((responseText) => {
          if (responseText.d === false) {
            _this.BlsRenderHtml(2);
          } else if (responseText.d === true) {
            const dateCheck = new Date(new Date().getTime() + 36e6);
            _this.setCookie(umino_app.lic, dateCheck);
          } else if (responseText.d === "err") {
            console.log(
              responseText.err
                ? responseText.err.message
                : "Please contact to server's adminstrator!!!"
            );
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    setCookie: function (cvalue, d) {
      const v = btoa(cvalue);
      document.cookie =
        "UHVyY2hhc2VDb2Rl" + "=" + v + ";expires=" + d + ";path=/";
    },
    checkCookie: function (val) {
      const v = atob(getCookie("UHVyY2hhc2VDb2Rl"));
      if (val.length !== 0 && v == val) {
        return true;
      } else {
        return false;
      }
    },
  };
})();
BlsUminoAdminLi.init();
class InstagramShop extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll("img").forEach((button) =>
      button.addEventListener("click", this.onButtonClick.bind(this))
    );
  }

  onButtonClick(event) {
    event.preventDefault();
    const is_shown = document.querySelector("#dlg-lookbook_0");
    if (event.currentTarget && is_shown === null) {
      var lookbook = EasyDialogBox.create(
        "dlg-lookbook",
        "dlg dlg-disable-heading dlg-disable-footer dlg-disable-drag",
        "",
        this.htmlRender(event.currentTarget).innerHTML
      );
      lookbook.onClose = lookbook.destroy;
      lookbook.show();
    }
  }

  htmlRender(ct) {
    const bli = ct.closest(".bls__lookbook-items");
    const is = ct.closest("instagram-shop");
    if (bli) {
      const id = bli.id;
      if (is) {
        const data = JSON.parse(is.querySelector(".igShopBlock").textContent);
        if (data) {
          const getData = data.find((x) => x.id === id);
          const img = getData.bl_img;
          const {
            ot_1,
            ol_1,
            p_1,
            ot_2,
            ol_2,
            p_2,
            ot_3,
            ol_3,
            p_3,
            ot_4,
            ol_4,
            p_4,
            ot_5,
            ol_5,
            p_5,
            cap_1,
            cap_2,
            cap_3,
            cap_4,
            p_img_1,
            p_img_2,
            p_img_3,
            p_img_4,
            p_img_5,
            pn_1,
            pn_2,
            pn_3,
            pn_4,
            pn_5,
            pp_1,
            pp_2,
            pp_3,
            pp_4,
            pp_5,
            pcp_1,
            pcp_2,
            pcp_3,
            pcp_4,
            pcp_5,
            ar,
            cr,
            pr,
          } = getData;
          const p_1_d = p_1 ? "" : "d-none";
          const p_2_d = p_2 ? "" : "d-none";
          const p_3_d = p_3 ? "" : "d-none";
          const p_4_d = p_4 ? "" : "d-none";
          const p_5_d = p_5 ? "" : "d-none";

          const pp_d_1 =
            Number(pcp_1.replace(/[^0-9]/g, "")) <
              Number(pp_1.replace(/[^0-9]/g, "")) || pcp_1 === ""
              ? "d-none"
              : "";
          const pp_d_2 =
            Number(pcp_2.replace(/[^0-9]/g, "")) <
              Number(pp_2.replace(/[^0-9]/g, "")) || pcp_2 === ""
              ? "d-none"
              : "";
          const pp_d_3 =
            Number(pcp_3.replace(/[^0-9]/g, "")) <
              Number(pp_3.replace(/[^0-9]/g, "")) || pcp_3 === ""
              ? "d-none"
              : "";
          const pp_d_4 =
            Number(pcp_4.replace(/[^0-9]/g, "")) <
              Number(pp_4.replace(/[^0-9]/g, "")) || pcp_4 === ""
              ? "d-none"
              : "";
          const pp_d_5 =
            Number(pcp_5.replace(/[^0-9]/g, "")) <
              Number(pp_5.replace(/[^0-9]/g, "")) || pcp_5 === ""
              ? "d-none"
              : "";
          const container = document.createElement("div");
          const aspect_ratio = ar === "custom" ? cr.replace(":", "/") : ar;
          container.innerHTML = `
            <div class="bls__instagram-shop">
              <div class="bls__lookbook-items">
                <div class="bls__lookbook-image">
                  <div
                    class="bls__responsive-image bls-image-js"
                    style="--aspect-ratio: ${aspect_ratio};"
                  >
                    <img
                      srcset="${img}"
                    >
                  </div>
                </div>
                <div
                  class="bls__product-item absolute ${p_1_d}"
                  style="top: ${ot_1}%; left: ${ol_1}%; transform: translate(-${ot_1}%,-${ol_1}%)"
                >
                  <a href="${p_1}" target="_blank">
                    <span class="icon-dot icon">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" cslip-rule="evenodd" d="M5 0C4.44772 0 4 0.447715 4 1V4L1 4C0.447715 4 0 4.44771 0 5C0 5.55228 0.447715 6 1 6H4V9C4 9.55229 4.44772 10 5 10C5.55228 10 6 9.55228 6 9V6H9C9.55228 6 10 5.55229 10 5C10 4.44772 9.55228 4 9 4L6 4V1C6 0.447715 5.55228 0 5 0Z" fill=""></path>
                      </svg>
                    </span>
                  </a>
                </div>
                <div
                  class="bls__product-item absolute ${p_2_d}"
                  style="top: ${ot_2}%; left: ${ol_2}%; transform: translate(-${ot_2}%,-${ol_2}%)"
                >
                  <a href="${p_2}" target="_blank">
                    <span class="icon-dot icon">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" cslip-rule="evenodd" d="M5 0C4.44772 0 4 0.447715 4 1V4L1 4C0.447715 4 0 4.44771 0 5C0 5.55228 0.447715 6 1 6H4V9C4 9.55229 4.44772 10 5 10C5.55228 10 6 9.55228 6 9V6H9C9.55228 6 10 5.55229 10 5C10 4.44772 9.55228 4 9 4L6 4V1C6 0.447715 5.55228 0 5 0Z" fill=""></path>
                      </svg>
                    </span>
                  </a>
                </div>
                <div
                  class="bls__product-item absolute ${p_3_d}"
                  style="top: ${ot_3}%; left: ${ol_3}%; transform: translate(-${ot_3}%,-${ol_3}%)"
                >
                  <a href="${p_3}" target="_blank">
                    <span class="icon-dot icon">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" cslip-rule="evenodd" d="M5 0C4.44772 0 4 0.447715 4 1V4L1 4C0.447715 4 0 4.44771 0 5C0 5.55228 0.447715 6 1 6H4V9C4 9.55229 4.44772 10 5 10C5.55228 10 6 9.55228 6 9V6H9C9.55228 6 10 5.55229 10 5C10 4.44772 9.55228 4 9 4L6 4V1C6 0.447715 5.55228 0 5 0Z" fill=""></path>
                      </svg>
                    </span>
                  </a>
                </div>
                <div
                  class="bls__product-item absolute ${p_4_d}"
                  style="top: ${ot_4}%; left: ${ol_4}%; transform: translate(-${ot_4}%,-${ol_4}%)"
                >
                  <a href="${p_4}" target="_blank">
                    <span class="icon-dot icon">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" cslip-rule="evenodd" d="M5 0C4.44772 0 4 0.447715 4 1V4L1 4C0.447715 4 0 4.44771 0 5C0 5.55228 0.447715 6 1 6H4V9C4 9.55229 4.44772 10 5 10C5.55228 10 6 9.55228 6 9V6H9C9.55228 6 10 5.55229 10 5C10 4.44772 9.55228 4 9 4L6 4V1C6 0.447715 5.55228 0 5 0Z" fill=""></path>
                      </svg>
                    </span>
                  </a>
                </div>
                <div
                  class="bls__product-item absolute ${p_5_d}"
                  style="top: ${ot_5}%; left: ${ol_5}%; transform: translate(-${ot_5}%,-${ol_5}%)"
                >
                  <a href="${p_5}" target="_blank">
                    <span class="icon-dot icon">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" cslip-rule="evenodd" d="M5 0C4.44772 0 4 0.447715 4 1V4L1 4C0.447715 4 0 4.44771 0 5C0 5.55228 0.447715 6 1 6H4V9C4 9.55229 4.44772 10 5 10C5.55228 10 6 9.55228 6 9V6H9C9.55228 6 10 5.55229 10 5C10 4.44772 9.55228 4 9 4L6 4V1C6 0.447715 5.55228 0 5 0Z" fill=""></path>
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
              <div class="bls__lookbook-content">
                <div class="bls__lookbook-info custom-scrollbar">
                  <div class="bls__lookbook-product">
                    <div class="bls__lookbook-product-items ${p_1_d}">
                      <a href="${p_1}" target="_blank">
                        <div
                          class="bls__responsive-image bls-image-js"
                          style="--aspect-ratio: ${pr};"
                        >
                          <img
                            srcset="${p_img_1}"
                          >
                        </div>
                        <div
                        class="bls__product-details pt-10"
                        >
                          <div class="bls__product-name regular mb-0">${pn_1}</div>
                          <p class="bls__product-price mb-4" ><span>${pp_1}</span><s class="px-5 ${pp_d_1}">${pcp_1}</s></p>
                        </div>
                      </a>
                    </div>
                    <div class="bls__lookbook-product-items ${p_2_d}">
                      <a href="${p_2}" target="_blank">
                        <div
                          class="bls__responsive-image bls-image-js"
                          style="--aspect-ratio: ${pr};"
                        >
                          <img
                            srcset="${p_img_2}"
                          >
                        </div>
                        <div
                        class="bls__product-details pt-10"
                        >
                        <div class="bls__product-name regular mb-0">${pn_2}</div>
                        <p class="bls__product-price mb-4" ><span>${pp_2}</span><s class="px-5 ${pp_d_2}">${pcp_2}</s></p>
                        </div>
                      </a>
                    </div>
                    <div class="bls__lookbook-product-items ${p_3_d}">
                      <a href="${p_3}" target="_blank">
                        <div
                          class="bls__responsive-image bls-image-js"
                          style="--aspect-ratio: ${pr};"
                        >
                          <img
                            srcset="${p_img_3}"
                          >
                        </div>
                        <div
                        class="bls__product-details pt-10"
                        >
                        <div class="bls__product-name regular mb-0">${pn_3}</div>
                        <p class="bls__product-price mb-4" ><span>${pp_3}</span><s class="px-5 ${pp_d_3}">${pcp_3}</s></p>
                        </div>
                      </a>
                    </div>
                    <div class="bls__lookbook-product-items ${p_4_d}">
                      <a href="${p_4}" target="_blank">
                        <div
                          class="bls__responsive-image bls-image-js"
                          style="--aspect-ratio: ${pr};"
                        >
                          <img
                            srcset="${p_img_4}"
                          >
                        </div>
                        <div
                        class="bls__product-details pt-10"
                        >
                        <div class="bls__product-name regular mb-0">${pn_4}</div>
                        <p class="bls__product-price mb-4" ><span>${pp_4}</span><s class="px-5 ${pp_d_4}">${pcp_4}</s></p>
                        </div>
                      </a>
                    </div>
                    <div class="bls__lookbook-product-items ${p_5_d}">
                      <a href="${p_5}" target="_blank">
                        <div
                          class="bls__responsive-image bls-image-js"
                          style="--aspect-ratio: ${pr};"
                        >
                          <img
                            srcset="${p_img_5}"
                          >
                        </div>
                        <div
                        class="bls__product-details pt-10"
                        >
                        <div class="bls__product-name regular mb-0">${pn_5}</div>
                        <p class="bls__product-price mb-4" ><span>${pp_5}</span><s class="px-5 ${pp_d_5}">${pcp_5}</s></p>
                        </div>
                      </a>
                    </div>
                  </div>
                
                <div class="bls__lookbook-caption">
                  <p>
                  ${cap_1.replaceAll(/\n/g, "<br>")}
                  </p>
                  <p>
                    ${cap_2}
                  </p>
                </div>
                <a href="${cap_4}" target="_blank">
                  ${cap_3}
                </a>
                </div>
              </div>
            </div>
          `;
          return container;
        }
      }
    }
  }
}
customElements.define("instagram-shop", InstagramShop);
class SkeletonPage extends HTMLElement {
  constructor() {
    super();
    const url = "?section_id=skeleton-page";

    fetch(`${window.Shopify.routes.root}${url}`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = newParser.parseFromString(responseText, "text/html");
        const p = html.querySelector("#bls__skeleton");
        if (p) {
          this.innerHTML = p.innerHTML;
        }
      })
      .catch((e) => {
        throw e;
      });
  }
}
customElements.define("skeleton-page", SkeletonPage);
class VideoYoutube extends HTMLElement {
  constructor() {
    super();
    const thumb = this.closest(".bls__video-thumb");
    if (thumb) {
      thumb.querySelector(".bls__thmbnail-video").classList.add("d-none");
    }
  }
}
customElements.define("video-youtube", VideoYoutube);
class HeaderTotalPrice extends HTMLElement {
  constructor() {
    super();
  }
  updateTotal(cart) {
    this.minicart_total = this.querySelector("[data-cart-subtotal-price]");
    if (!this.minicart_total) return;
    if (cart.total_price == undefined) return;
    const price_format = Shopify.formatMoney(
      cart.total_price,
      cartStrings?.money_format
    );
    this.minicart_total.innerHTML = price_format;
  }
}
customElements.define("header-total-price", HeaderTotalPrice);
class ShopTheLook extends HTMLElement {
  constructor() {
    super();
    this.items = this.querySelectorAll(".bls__lookbook-dot");
    this.ls = this.querySelector(".lookbook-swiper");
    this.sl = null;
    if (this.ls) {
      this.init(this.ls);
      if (this.items.length) {
        this.items.forEach((e) => {
          e.addEventListener("click", this.onButtonClick.bind(this), false);
        });
      }
    }
    BlsLazyloadImg.init();
  }
  onButtonClick(e) {
    e.preventDefault();
    const position = e.currentTarget.dataset.productPosition;
    if (position) {
      this.sl.slideToLoop(position - 1, 500);
    }
    this.items.forEach((item) => {
      item.classList.remove("active");
    });
    e.currentTarget.classList.add("active");
  }
  init(e) {
    var autoplaying = e?.dataset.autoplay === "true";
    var loop = e.dataset.loop === "true";
    var itemDesktop = e?.dataset.desktop ? e?.dataset.desktop : 4;
    var itemTablet = e?.dataset.tablet ? e?.dataset.tablet : 2;
    var itemMobile = e?.dataset.mobile ? e?.dataset.mobile : 1;
    var width = window.innerWidth;
    var spacing = e?.dataset.spacing ? e?.dataset.spacing : 0;
    var progressbar = e?.dataset.paginationProgressbar === "true";
    spacing = Number(spacing);
    if (width <= 767) {
      if (spacing >= 15) {
        spacing = 15;
      }
    } else if (width <= 1199) {
      if (spacing >= 30) {
        spacing = 30;
      }
    }
    this.sl = new Swiper("#" + e.id, {
      slidesPerView: itemMobile,
      spaceBetween: spacing,
      autoplay: autoplaying,
      delay: 3000,
      loop: loop,
      effect: "slide",
      speed: 400,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      grid: {
        rows: 1,
        fill: "row",
      },
      navigation: {
        nextEl: e.querySelector(".swiper-button-next"),
        prevEl: e.querySelector(".swiper-button-prev"),
      },
      pagination: {
        clickable: true,
        el: e.querySelector(".swiper-pagination"),
        type: progressbar ? "progressbar" : "bullets",
      },
      breakpoints: {
        768: {
          slidesPerView: itemTablet,
        },
        1200: {
          slidesPerView: itemDesktop,
        },
      },
    });
  }
}
customElements.define("shop-the-look", ShopTheLook);
class AgeVerifier extends HTMLElement {
  constructor() {
    super();
    this.ageVerifyDetail = this.querySelector(".age-verify-detail");
    this.declineVerifyDetail = this.querySelector(".decline-verify-detail");
    this.init();
    this.mainFunction();
    if (Shopify.designMode) {
      document.addEventListener('shopify:section:load', () => this.init());
      document.addEventListener('shopify:section:load', () => this.mainFunction());
    }
  }
  init() {
    const _this = this;
    const designMode = _this.dataset.enableDesignMode;
    if (!Shopify.designMode) {
      if (!getCookie("bls_age_verifier")) {
        setTimeout(() => {
          _this.setAttribute("open", "");
          this.declineVerifyDetail.classList.add("d-none");
          this.ageVerifyDetail.classList.remove("d-none");
        }, 150);
      }
      else {
        if (getCookie("bls_age_verifier") == "false") {
          setTimeout(() => {
            _this.setAttribute("open", "");
            this.declineVerifyDetail.classList.remove("d-none");
            this.ageVerifyDetail.classList.add("d-none");
          }, 150);
        } else {
          _this.removeAttribute("open");
        }
      }
    } else {
      if (designMode == "true") {
        document.addEventListener('shopify:section:select', (e) => {
          var qbe = document.querySelector(".overlay-age-verifier")?.dataset.shopifyEditorSection;
          if (qbe && JSON.parse(qbe).id === e.detail.sectionId) {
            _this.setAttribute("open", "");
            this.declineVerifyDetail.classList.add("d-none");
            this.ageVerifyDetail.classList.remove("d-none");
          } else {
            _this.setAttribute("closing", "true");
            setTimeout(() => {
              _this.removeAttribute("closing");
              _this.removeAttribute("open");
            }, 150);
          }
        });
      } else {
        _this.setAttribute("closing", "true");
        setTimeout(() => {
          _this.removeAttribute("closing");
          _this.removeAttribute("open");
        }, 150);
      }
    }
  }

  mainFunction() {
    const approve = this.querySelector(".age-verifier-approve");
    const decline = this.querySelector(".age-verifier-decline");
    const returnBtn = this.querySelector(".age-verifier-return");
    if (returnBtn) {
      returnBtn.addEventListener("click", () => this.handleReturn());
    }

    if (!approve || !decline) return;
    approve.addEventListener("click", () => this.handleApprove());
    decline.addEventListener("click", () => this.handleDecline());
  }
  handleReturn() {
    if (!Shopify.designMode) {
      setCookie("bls_age_verifier", "false", "-1");
      this.init();
    } else {
      this.setAttribute("open", "");
      this.declineVerifyDetail.classList.add("d-none");
      this.ageVerifyDetail.classList.remove("d-none");
    }
  }
  handleDecline() {
    if (!Shopify.designMode) {
      setCookie("bls_age_verifier", "false", "365");
      this.init();
    } else {
      this.setAttribute("open", "");
      this.declineVerifyDetail.classList.remove("d-none");
      this.ageVerifyDetail.classList.add("d-none");
    }
  }
  handleApprove() {
    if (!Shopify.designMode) {
      setCookie("bls_age_verifier", "true", "false");
      this.setAttribute("closing", "true");
      setTimeout(() => {
        this.removeAttribute("closing");
        this.removeAttribute("open");
      }, 150);
    } else {
      this.setAttribute("closing", "true");
      setTimeout(() => {
        this.removeAttribute("closing");
        this.removeAttribute("open");
      }, 150);
    }
  }
}
customElements.define("age-verifier", AgeVerifier);
class ProgressBar extends HTMLElement {
  constructor() {
    super();

    const orders = this.dataset.order;
    this.init(orders);
  }
  init(orders) {
    const fe_unavaiable = this.dataset.feUnavaiable;
    const fe_avaiable = this.dataset.feAvaiable;
    const rate = Number(Shopify.currency.rate);
    const min = Number(this.dataset.feAmount);
    if (!min || !rate) return;
    const order = Number(orders) / 100;
    const min_by_currency = min * rate;
    if (order == undefined) return;
    if ((order / min_by_currency) * 100 > 100) {
      this.setProgressBar(100);
    } else {
      this.setProgressBar((order / min_by_currency) * 100);
    }
    this.setProgressBarTitle(
      order,
      min_by_currency,
      fe_unavaiable,
      fe_avaiable
    );
  }
  setProgressBarTitle(order, min_by_currency, fe_unavaiable, fe_avaiable) {
    const title = this.querySelector(".free-shipping-message");
    if (!title) return;
    title.classList.remove("opacity-0");
    if (order >= min_by_currency) {
      title.innerHTML = fe_avaiable;
    } else {
      const ammount = "{{ amount }}";
      title.innerHTML = fe_unavaiable.replace(
        ammount.trim(),
        Shopify.formatMoney(
          (min_by_currency - order) * 100,
          cartStrings.money_format
        )
      );
    }
  }
  setProgressBar(progress) {
    const p = this.querySelector(".progress");
    p.style.width = progress + "%";
    if (progress === 100) {
      this.classList.add("cart_shipping_free");
    } else {
      this.classList.remove("cart_shipping_free");
    }
  }
}
customElements.define("free-ship-progress-bar", ProgressBar);

class SlideImageShopable extends HTMLElement {
  constructor() {
    super();
    this.init();
  }
  init(){
    this.BlsCarousel();
  }
  BlsCarousel()  {
    var sliderGlobal;
    var element = this.querySelector(".bls__swiper-shopable");
    var autoplaying = element.dataset.autoplay === "true";
    var loop = element.dataset.loop === "true";
    var dataArrowCenterImage = element.dataset.arrowCenterimage ? element.dataset.arrowCenterimage : 0;
    var itemDesktop = element.dataset.desktop ? element.dataset.desktop : 1;
    var itemTablet = element.dataset.tablet ? element.dataset.tablet : 1;
    var itemMobile = element.dataset.mobile ? element.dataset.mobile : 1;
    var spacing = element.dataset.spacing ? element.dataset.spacing : 0;
    spacing = Number(spacing);
    sliderGlobal = new Swiper(element, {
      slidesPerView: itemMobile,
      spaceBetween: spacing >= 15 ? 15 : spacing,
      autoplay: autoplaying,
      loop: loop,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      navigation: {
        nextEl: element.querySelector(".swiper-button-next-item"),
        prevEl: element.querySelector(".swiper-button-prev-item"),
      },
      pagination: {
        clickable: true,
        el: element.querySelector(".swiper-pagination-item"),
        type: "progressbar",
      },
      breakpoints: {
        768: {
          slidesPerView: itemTablet,
          spaceBetween: spacing >= 30 ? 30 : spacing,
        },
        1200: {
          slidesPerView: itemDesktop,
          spaceBetween: spacing,
        },
      },
      on: {
        init: function () {
          if (dataArrowCenterImage) {
            var items_slide = element.querySelectorAll(".bls__responsive-image");
            if (items_slide.length != 0) {
                var oH = [];
                items_slide.forEach((e) => {
                    oH.push(e.offsetHeight/2);
                });
                var max = Math.max(...oH);
                var arrowsOffset = '--arrows-offset-top: '+ max +'px';
                if (element.querySelectorAll('.swiper-arrow')) {
                  element.querySelectorAll('.swiper-arrow').forEach((arrow) => {
                    arrow.setAttribute('style', arrowsOffset);
                  });
                }
            }
          }
        },
      },
    });
  }
}
customElements.define('slide-image-shopable', SlideImageShopable);

document.addEventListener("shopify:section:load", function (event) {
  var id = event.detail.sectionId;
  var section = event.target.querySelector("[" + "data-id" + '="' + id + '"]');
  if (section) {
    var element = section.querySelector(".bls__swiper");
    var customSlide = section.querySelector(".slideshow-custom");
    var testimonial = section.querySelector(".bls__testimonial");
    var counter = section.querySelector(".bls__counter")
    if (customSlide) {
      BlsCustomSlideShow.init();
    }
    if (element) {
      BlsSettingsSwiper.BlsCarousel(element);
    }
    if (testimonial) {
      BlsSettingsSwiperTestimonial.init();
    }
    if (counter) {
      BlsCounterEvent.init();
    }
  }
  if (id) {
    BlsLazyloadImg.init();
  }
});


class productList extends HTMLElement{
  constructor() {
    super();
    this.carousel_mobile = Boolean(this.dataset.carouselmobile);
    this.gridCustomColumn =  this.dataset.gridCustomcolumn;
    this.gapTablet = this.dataset.gridGaptablet;
    this.gapMobile= this.dataset.gridGapmobile;
    this.carousel_arrows = this.dataset.swippercontrol;
    this.carouselpagination = this.dataset.carouselpagination;
    this.items  = this.querySelectorAll(".product-list_item")
    this.init();
  }
  init(){
    var _this =this
       
    if(this.carousel_mobile){
      var width = window.innerWidth;
      if(width <=768 ){
        _this.CarouselView()
      }
      window.addEventListener("resize",(e)=> {
          var width = window.innerWidth;
          if(width > 768 ){
            _this.className = `row row-cols-xl-${_this.gridCustomColumn} ${_this.gapTablet} ${_this.gapMobile}`;
            _this.innerHTML = ""
            _this.items.forEach((item) => {
              _this.appendChild(item);
              item.style = ""
              item.classList.remove("swiper-slide");
              item.classList.add("product-list_item");
              item.classList.add("col-sm-6");
            })
          }else{
              _this.CarouselView()
          }
      })
    }
  
  }

  CarouselView() {
    var _this =this
    _this.className = `swiper bls__swiper hover__show-nav`;
            let swiper = this.querySelector(".swiper-wrapper")
            if(!swiper){
              var swiper_wrapper = document.createElement("div");     
              swiper_wrapper.classList.add("swiper-wrapper")    
              _this.items.forEach((item) => {
                swiper_wrapper.appendChild(item);
                item.classList.add("swiper-slide");
                item.classList.add("product-list_item");
                item.classList.remove("col-sm-6");
              })
              if(this.carousel_arrows){
                let carousel_arrows =  document.createElement("div");
                carousel_arrows.classList.add("swipper-next-back")
                carousel_arrows.innerHTML = `  <div class="swiper-arrow swiper-next swiper-button-next box-shadow"><i class="icon-chevron-right"></i></div>
          <div class="swiper-arrow swiper-prev swiper-button-prev box-shadow"><i class="icon-chevron-left"></i></div>`
                  _this.appendChild(carousel_arrows)
              }
              if (this.carouselpagination == 'carousel_bullets' || this.carouselpagination == 'show_bullet_mobile' || this.carouselpagination == 'carousel_pagination_progress'){
                let carouselpagination =  document.createElement("div");
                carouselpagination.classList.add("swiper-pagination")
                _this.appendChild(carouselpagination)
              }
              _this.appendChild(swiper_wrapper);
              _this.BlsCarousel(_this);
            }
  }
  BlsCarousel(e) {
    var autoplaying = e?.dataset.autoplay === "true";
    var loop = e?.dataset.loop === "true";
    var dataArrowCenterImage = e?.dataset.arrowCenterimage ? e?.dataset.arrowCenterimage : 0;
    var itemDesktop = e?.dataset.desktop ? e?.dataset.desktop : 4;
    var itemTablet = e?.dataset.tablet ? e?.dataset.tablet : 2;
    var itemMobile = e?.dataset.mobile ? e?.dataset.mobile : 1;
    var autoplaySpeed = e?.dataset.autoplaySpeed
      ? e?.dataset.autoplaySpeed
      : 3000;
    var speed = e?.dataset.speed ? e?.dataset.speed : 400;
    var effect = e?.dataset.effect ? e?.dataset.effect : "slide";
    var sectionId = e?.dataset.sectionId;
    var row = e?.dataset.row ? e?.dataset.row : 1;
    var spacing = e?.dataset.spacing ? e?.dataset.spacing : 0;
    var progressbar = e?.dataset.paginationProgressbar === "true";
   
    var autoItem = e?.dataset.itemMobile === "true";
    spacing = Number(spacing);
    autoplaySpeed = Number(autoplaySpeed);
    speed = Number(speed);
    if (autoplaying) {
      var autoplaying = { delay: autoplaySpeed };
    }
    sliderGlobal = new Swiper("#bls__swiper-" + sectionId, {
      slidesPerView: autoItem ? "auto" : itemMobile,
      spaceBetween: spacing >= 15 ? 15 : spacing,
      autoplay: autoplaying,
      loop: loop,
      effect: effect,
      speed: speed,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      grid: {
        rows: row,
        fill: "row",
      },
      navigation: {
        nextEl: e.querySelector(".swiper-button-next"),
        prevEl: e.querySelector(".swiper-button-prev"),
      },
      pagination: {
        clickable: true,
        el: e.querySelector(".swiper-pagination"),
        type: progressbar ? "progressbar" : "bullets",
      },
      breakpoints: {
        768: {
          slidesPerView: itemTablet,
          spaceBetween: spacing >= 30 ? 30 : spacing,
        },
        1200: {
          slidesPerView: itemDesktop,
          spaceBetween: spacing,
        },
      },
      on: {
        init: function () {
          if (dataArrowCenterImage) {
            var swiper = document.getElementById("bls__swiper-" + sectionId);
            var items_slide = swiper.querySelectorAll(".product-list_item");
            if (items_slide.length != 0) {
              var oH = [];
              items_slide.forEach((e) => {
                oH.push(e.offsetHeight / 2);
              });
              var max = Math.max(...oH);
              var arrowsOffset = '--arrows-offset-top: ' + max + 'px';
              if (swiper.querySelectorAll('.swiper-arrow')) {
                swiper.querySelectorAll('.swiper-arrow').forEach((arrow) => {
                  arrow.setAttribute('style', arrowsOffset);
                });
              }
            }
          }
        },
      },
    });
  }
}

customElements.define('product-list', productList);

/* ============================================================
   Custom JavaScript Section
   ------------------------------------------------------------
   Add your custom scripts below this line. This area is reserved
   for theme-specific enhancements, overrides, or integrations.
   ============================================================ */

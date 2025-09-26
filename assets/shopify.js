Shopify.bind = function (fn, scope) {
    return function () {
      return fn.apply(scope, arguments);
    };
  };

  Shopify.setSelectorByValue = function (selector, value) {
    for (var i = 0, count = selector.options.length; i < count; i++) {
      var option = selector.options[i];
      if (value == option.value || value == option.innerHTML) {
        selector.selectedIndex = i;
        return i;
      }
    }
  };

  Shopify.addListener = function (target, eventName, callback) {
    target.addEventListener
      ? target.addEventListener(eventName, callback, false)
      : target.attachEvent("on" + eventName, callback);
  };

  Shopify.postLink = function (path, options) {
    options = options || {};
    var method = options["method"] || "post";
    var params = options["parameters"] || {};

    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for (var key in params) {
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", params[key]);
      form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  Shopify.CountryProvinceSelector = function (
    country_domid,
    province_domid,
    options
  ) {
    this.countryEl = document.getElementById(country_domid);
    this.provinceEl = document.getElementById(province_domid);
    this.provinceContainer = document.getElementById(
      options["hideElement"] || province_domid
    );

    Shopify.addListener(
      this.countryEl,
      "change",
      Shopify.bind(this.countryHandler, this)
    );

    this.initCountry();
    this.initProvince();
  };

  Shopify.CountryProvinceSelector.prototype = {
    initCountry: function () {
      var value = this.countryEl.getAttribute("data-default");
      Shopify.setSelectorByValue(this.countryEl, value);
      this.countryHandler();
    },

    initProvince: function () {
      var value = this.provinceEl.getAttribute("data-default");
      if (value && this.provinceEl.options.length > 0) {
        Shopify.setSelectorByValue(this.provinceEl, value);
      }
    },

    countryHandler: function (e) {
      var opt = this.countryEl.options[this.countryEl.selectedIndex];
      var raw = opt.getAttribute("data-provinces");
      var provinces = JSON.parse(raw);

      this.clearOptions(this.provinceEl);
      if (provinces && provinces.length == 0) {
        this.provinceContainer.style.display = "none";
      } else {
        for (var i = 0; i < provinces.length; i++) {
          var opt = document.createElement("option");
          opt.value = provinces[i][0];
          opt.innerHTML = provinces[i][1];
          this.provinceEl.appendChild(opt);
        }

        this.provinceContainer.style.display = "";
      }
    },

    clearOptions: function (selector) {
      while (selector.firstChild) {
        selector.removeChild(selector.firstChild);
      }
    },

    setOptions: function (selector, values) {
      for (var i = 0, count = values.length; i < values.length; i++) {
        var opt = document.createElement("option");
        opt.value = values[i];
        opt.innerHTML = values[i];
        selector.appendChild(opt);
      }
    },
  };

  Shopify.formatMoney = function (cents, format) {
    if (typeof cents == "string") {
      cents = cents.replace(".", "");
    }
    var value = "";
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || this.money_format;

    function defaultOption(opt, def) {
      return typeof opt == "undefined" ? def : opt;
    }

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultOption(precision, 2);
      thousands = defaultOption(thousands, ",");
      decimal = defaultOption(decimal, ".");

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split("."),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands),
        cents = parts[1] ? decimal + parts[1] : "";

      return dollars + cents;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case "amount":
        value = formatWithDelimiters(cents, 2);
        break;
      case "amount_no_decimals":
        value = formatWithDelimiters(cents, 0);
        break;
      case "amount_with_comma_separator":
        value = formatWithDelimiters(cents, 2, ".", ",");
        break;
      case "amount_no_decimals_with_comma_separator":
        value = formatWithDelimiters(cents, 0, ".", ",");
        break;
    }
    return formatString.replace(placeholderRegex, value);
  };

  Shopify.eventFlashSold = function (dlg = false) {
    let element = document.querySelector(
      ".bls__product-details-infor .bls__flash-sold"
    );
    if (dlg) {
      element = document.querySelector(
        ".bls__quickview-content .bls__flash-sold"
      );
    }
    if (!element) return;
    const flash_sold = element.getAttribute("data-flash-sold");
    const flash_hours = element.getAttribute("data-flash-hours");
    const soldArray = flash_sold.split(",");
    const hoursArray = flash_hours.split(",");
    var sold = soldArray[Math.floor(Math.random() * soldArray.length)];
    var hour = hoursArray[Math.floor(Math.random() * hoursArray.length)];
    const ps = document.querySelector(".bls__flash-sold .product-sold");
    const ph = document.querySelector(".bls__flash-sold .product-hour");
    if (ps) {
      ps.innerHTML = sold;
    }
    if (ph) {
      ph.innerHTML = hour;
    }
    element.style.display = "block";
  };

  Shopify.eventFlashingBrowseTab = function () {
    var enable = window.flashingBrowseTab?.enable,
      myTimer,
      message,
      titleTag = document.getElementsByTagName("title")[0],
      first_notification = window.flashingBrowseTab?.firstNotification,
      secondary_notification = window.flashingBrowseTab?.secondaryNotification;
    if (enable && titleTag) {
      var originalTitle = titleTag.innerText;
      var isActive = true;
      document.addEventListener("visibilitychange", () => {
        document.visibilityState === "visible"
          ? (function () {
              if (isActive) return;
              clearInterval(myTimer), (titleTag.innerText = originalTitle);
            })()
          : (function () {
              var i = 1;
              if (
                ((isActive = false),
                !first_notification || !secondary_notification)
              )
                return;
              myTimer = setInterval(function () {
                if (i == 1) {
                  message = first_notification;
                  i = 2;
                } else {
                  message = secondary_notification;
                  i = 1;
                }
                titleTag.innerText = message;
              }, 2000);
            })();
      });
    }
  };

  Shopify.addToastAction = function (strToast) {
    let messageToast = EasyDialogBox.create(
      null,
      "dlg-toast dlg-fade",
      null,
      strToast,
      null,
      null,
      20,
      500
    );
    messageToast.onHide = messageToast.destroy;
    messageToast.show().hide(3000);
  };

  Shopify.termsConditionsAction = function () {
    function conditions(evt) {
      const content = document.getElementById("popup-terms-conditions");
      if (!content) return;
      const e = evt.currentTarget;
      const text = content.getAttribute("data-text");
      var promotion = EasyDialogBox.create(
        "popup-terms-conditions",
        "dlg dlg-disable-footer dlg-disable-drag",
        text,
        content.innerHTML
      );
      promotion.onClose = promotion.destroy;
      promotion.show(300);
      e.href = "javascript: (function(){})();";
      e.target = "_self";
    }
    document.querySelectorAll(".bls__terms-conditions a").forEach((event) => {
      event.addEventListener("click", conditions);
    });
  };

  Shopify.eventCountDownTimer = function (dlg = false) {
    let element = document.querySelectorAll(".bls__countdown-timer");
    if (dlg) {
      element = document.querySelectorAll(
        ".bls__quickview-content .bls__countdown-timer"
      );
    }
    element.forEach((el) => {
      const day = el.getAttribute("data-days");
      const hrs = el.getAttribute("data-hrs");
      const secs = el.getAttribute("data-secs");
      const mins = el.getAttribute("data-mins");
      const time = el.getAttribute("data-time");
      var countDownDate = new Date(time).getTime();
      var timer = setInterval(function () {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        if (distance < 0) {
          el.classList.add("d-none");
          clearInterval(timer);
        } else {
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
          const cd = el.querySelector(".bls__product-countdown");
          if (cd) {
            cd.innerHTML = html;
          }
          el.classList.remove("d-none");
        }
      }, 1000);
    });
  };

  Shopify.swiperSlideQickview = function () {
    var swiper_qickview = new Swiper("#bls__swiper-qickview", {
      slidesPerView: 1,
      spaceBetween: 0,
      autoplay: false,
      loop: true,
      navigation: {
        nextEl: document
          .getElementById("bls__swiper-qickview")
          .querySelector(".swiper-button-next"),
        prevEl: document
          .getElementById("bls__swiper-qickview")
          .querySelector(".swiper-button-prev"),
      },
    });

    document
      .querySelectorAll(".bls__quickview-content .bls__option-swatch")
      .forEach((button) => {
        button.addEventListener(
          "click",
          (e) => {
            const target = e.currentTarget;
            var options = Array.from(
              target
                .closest("#variant-radios")
                .querySelectorAll(".bls__option-swatch.active"),
              (select) => select.getAttribute("data-value")
            );
            var variantData = JSON.parse(
              target
                .closest("#variant-radios")
                .querySelector('[type="application/json"]').textContent
            );
            var currentVariant = variantData.find((variant) => {
              return !variant.options
                .map((option, index) => {
                  return options[index] === option;
                })
                .includes(false);
            });
            if (!currentVariant) return;
            if (!currentVariant.featured_media) return;
            var featured_media_id = currentVariant.featured_media.id;
            var position = target
              .closest(".bls__product-quickview")
              .querySelector(`[data-media-id="${featured_media_id}"]`)
              .getAttribute("data-position");
            swiper_qickview.slideTo(position, 1000);
          },
          false
        );
      });

    var conditions = document.getElementById("conditions_form_qickview");
    const ccq = document.querySelector(".bls-btn-checkout-qickview");
    if (conditions) {
      if (getCookie("term_conditions")) {
        conditions.setAttribute('checked','')
        if (ccq) {
          ccq.classList.remove("disabled");
        }
      }else{
        conditions.addEventListener("change", (event) => {
          setCookie('term_conditions', 1, 1);
          
          if (ccq) {
            if (event.currentTarget.checked) {
              ccq.classList.remove("disabled");
            } else {
              ccq.classList.add("disabled");
            }
          }
        });
      }
    }
  };
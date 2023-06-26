document.addEventListener("DOMContentLoaded", () => {
  const xl = matchMedia('(max-width: 1024px)');

  const header = document.querySelector('header');


  class Menu {
    constructor(menuElement, buttonElement) {
      this.menu = typeof menuElement === "string" ? document.querySelector(menuElement) : menuElement;
      this.button = typeof buttonElement === "string" ? document.querySelector(buttonElement) : buttonElement;
      this.buttons = this.menu.querySelectorAll('button');
      this.overlay = document.createElement('div');
      this.overlay.hidden = true;
      this._init();
    }

    _init() {
      if (header) {
        header.appendChild(this.overlay);
      }

      if (this.buttons.length) {
        this.buttons.forEach(el => {
          el.addEventListener('click', this.closeMenu.bind(this));
        })
      }

      this.overlay.classList.add('overlay');

      this.overlay.addEventListener('click', this.toggleMenu.bind(this));
      this.button.addEventListener('click', this.toggleMenu.bind(this));
    }

    toggleMenu() {
      this.menu.classList.toggle('menu--open');
      this.button.classList.toggle('menu-button--active');
      this.overlay.hidden = !this.overlay.hidden;

      if (this.isMenuOpen()) {
        this.disableScroll();
      } else {
        this.enableScroll();
      }
    }

    closeMenu() {
      this.menu.classList.remove('menu--open');
      this.button.classList.remove('menu-button--active');
      this.overlay.hidden = true;

      this.enableScroll();
    }

    isMenuOpen() {
      return this.menu.classList.contains('menu--open');
    }

    disableScroll() {
      // Get the current page scroll position;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      document.documentElement.classList.add('disable-scroll');
      // if any scroll is attempted, set this to the previous value;
      window.onscroll = function () {
        window.scrollTo(scrollLeft, scrollTop);
      };
    }

    enableScroll() {
      document.documentElement.classList.remove('disable-scroll');
      window.onscroll = function () { };
    }
  }

  const menu = document.getElementById('menu');
  const menuButton = document.querySelector('.menu-button');

  if (menu && menuButton) {
    new Menu(menu, menuButton);
  }

  let handler;

  function scrollAdd() {
    /* ... */
    handler = throttle(function (event) {
      scrollHeader();
    }, 500);
    document.addEventListener('scroll', handler, false);
  }

  function scrollRemove() {
    /* ... */
    document.removeEventListener('scroll', handler, false);
  }

  if (xl.matches) {
    scrollAdd();
    document.removeEventListener('scroll', scrollHeader);
  } else {
    document.addEventListener('scroll', scrollHeader);
    scrollRemove();
  }

  xl.addEventListener('change', () => {
    if (xl.matches) {
      document.removeEventListener('scroll', scrollHeader);
      scrollAdd();
    } else {
      document.addEventListener('scroll', scrollHeader);
      scrollRemove();
    }
  });

  function disableScroll() {
    // Get the current page scroll position;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    document.documentElement.classList.add('disable-scroll');

    // if any scroll is attempted, set this to the previous value;
    window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  function enableScroll() {
    document.documentElement.classList.remove('disable-scroll');
    window.onscroll = function () { };
  }

  var prevScrollpos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  function scrollHeader() {
    var currentScrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScrollPos < 0) {
      currentScrollPos = 0;
      prevScrollpos = 0;
    };
    if (prevScrollpos < 0) {
      prevScrollpos = 0;
      currentScrollPos = 0;
    };
    const num = 50;
    if (currentScrollPos > num) {
      header.classList.add('header--active');
    } else {
      header.classList.remove('header--active');
    };
    if (prevScrollpos >= currentScrollPos) {
      header.classList.remove('out');
    } else {
      header.classList.add('out');
    };
    prevScrollpos = currentScrollPos;
  };

  function initHeader() {
    var currentScrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    const num = xl.matches ? 50 : 150;
    if (currentScrollPos > num) {
      header.classList.add('header--active');
    } else {
      header.classList.remove('header--active');
    }
  }

  initHeader();

  function throttle(func, ms) {
    let isThrottled = false,
      savedArgs,
      savedThis;

    function wrapper() {

      if (isThrottled) { // (2);
        savedArgs = arguments;
        savedThis = this;
        return;
      }

      func.apply(this, arguments); // (1);

      isThrottled = true;

      setTimeout(function () {
        isThrottled = false; // (3);
        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, ms);
    }

    return wrapper;
  }

  const catalogButton = document.querySelector('.header-catalog-button');
  if (catalogButton) {
    catalogButton.addEventListener('click', () => {
      if (catalogButton.classList.contains('active')) {
        enableScroll();
        document.documentElement.classList.remove('catalog-open');
      } else {
        disableScroll();
        document.documentElement.classList.add('catalog-open');
      }
      catalogButton.classList.toggle('active');
    })
  }

  const mainCatalogBlocks = document.querySelectorAll('.main-catalog-sublist > ul > li');

  if (mainCatalogBlocks.length) {
    mainCatalogBlocks.forEach(el => {
      const list = el.querySelectorAll('.main-catalog-block-wrapper > ul > li');
      if (!list.length) {
        el.classList.add('no-sublist-items');
      }
    })
  }

  const mainCatalogContainer = document.querySelector('.main-catalog-content');

  if (mainCatalogContainer) {
    mainCatalogContainer.addEventListener('click', function () {
      const button = event.target.closest('.main-catalog-block-button');
      if (button) {
        let nowText = button.innerHTML;
        let showtext = button.dataset.showtext;
        if (showtext) {
          button.innerHTML = showtext;
          button.dataset.showtext = nowText;
        }
        button.classList.toggle('active');
        const prev = button.previousElementSibling;
        if (prev) {
          prev.classList.toggle('active-show-list');
          if (prev.style.maxHeight) {
            prev.style.maxHeight = null;
          } else {
            prev.style.maxHeight = prev.scrollHeight + "px";
          }
        }
        return;
      }
      const target = event.target.closest('li');

      if (target) {
        const link = target.querySelector('a');

        link.click();
      }
    })
  }

  const mainCatalogBlockButtons = document.querySelectorAll('.main-catalog-block-button');

  if (mainCatalogBlockButtons.length) {
    mainCatalogBlockButtons.forEach(el => {
      el.addEventListener('click', function () {
        let nowText = this.innerHTML;
        let showtext = this.dataset.showtext;
        if (showtext) {
          this.innerHTML = showtext;
          this.dataset.showtext = nowText;
        }
        this.classList.toggle('active');
        const prev = this.previousElementSibling;
        if (prev) {
          prev.classList.toggle('active-show-list');
          if (prev.style.maxHeight) {
            prev.style.maxHeight = null;
          } else {
            prev.style.maxHeight = prev.scrollHeight + "px";
          }
        }
      })
    })
  }

  const catalogs = document.querySelectorAll('.page-catalog');

  if (catalogs.length) {
    catalogs.forEach(catalog => {
      const catalogButtons = catalog.querySelectorAll('.page-catalog-btn');
      const catalogContent = catalog.querySelector('.page-catalog-content');

      if (catalogButtons.length) {
        catalogButtons.forEach(el => {
          el.addEventListener('click', function () {
            if (!xl.matches) {
              if (this.classList.contains('active')) {
                return;
              }
              catalogButtons.forEach(el => el.classList.remove('active'));
              this.classList.add('active');

              if (this.nextElementSibling) {
                catalogContent.innerHTML = this.nextElementSibling.innerHTML;
              }
            } else {
              this.classList.toggle('active');
            }
          })

          if (el.classList.contains('active')) {
            if (el.nextElementSibling) {
              catalogContent.innerHTML = el.nextElementSibling.innerHTML;
            }
          }
        })
      }
    })
  }

  document.addEventListener('resize', () => {
    const activeShowList = document.querySelectorAll('.active-show-list');

    if (activeShowList.length) {
      activeShowList.forEach(el => {
        el.style.maxHeight = 'auto';
        el.classList.remove('active-show-list');
      })
    }
  })

  const news = document.querySelectorAll('.news');

  if (news.length) {
    news.forEach(el => {
      const swiper = el.querySelector('.news-swiper');
      const swiperPagination = el.querySelector('.swiper-pagination');
      const next = el.querySelector('.next');
      const prev = el.querySelector('.prev');

      if (swiper) {
        const numberOfSlides = swiper.querySelectorAll('.swiper-slide');
        if (numberOfSlides.length > 1) {
          setTimeout(() => {
            new Swiper(swiper, {
              slidesPerView: 'auto',
              loop: numberOfSlides.length > 3,
              slidesPerGroupAuto: false,
              speed: 400,
              autoplay: {
                delay: 5000,
              },
              grabCursor: true,
              pagination: {
                el: swiperPagination,
                clickable: true,
                type: 'fraction',
                formatFractionCurrent: function (number) {
                  var s = "0" + number;
                  return s.substr(s.length - 2);
                },
                formatFractionTotal: function (number) {
                  var s = "0" + number;
                  return s.substr(s.length - 2);
                }
              },
              navigation: {
                nextEl: next,
                prevEl: prev,
              },
            })
          }, 0)

        }
      }
    })
  }

  const podcategory = document.querySelectorAll('.podcategory-swiper');

  if (podcategory.length) {

    podcategory.forEach(el => {
      const next = el.parentElement.querySelector('.next');
      const prev = el.parentElement.querySelector('.prev');

      const swiperWidth = el.getBoundingClientRect().width;
      const slides = el.querySelectorAll('.swiper-slide');
      let slidesWidth = 0;
      if (slides.length) {
        slides.forEach(slide => {
          slidesWidth += slide.getBoundingClientRect().width;
        })
      }
      if (slidesWidth > swiperWidth && !xl.matches) {
        el.parentElement.classList.add('active-swiper');
        new Swiper(el, {
          slidesPerView: 'auto',
          grabCursor: true,
          navigation: { 
            nextEl: next,
            prevEl: prev,
          },
          on: {
            resize: function () {
              el.parentElement.classList.add('active-swiper');
            }
          }
        })
      } else {
        el.parentElement.classList.add('not-active-swiper');
      }


    })
  }

  const productSwipers = document.querySelectorAll('.product-swipers');

  if (productSwipers.length) {
    productSwipers.forEach(wrapper => {
      const mainSwiper = wrapper.querySelector('.product-swiper');
      const tumbsSwiper = wrapper.querySelector('.tumbs-swiper');
      const tumbsSlides = tumbsSwiper.querySelectorAll('.swiper-slide');
      const prev = mainSwiper.parentElement.querySelector('.prev');
      const next = mainSwiper.parentElement.querySelector('.next');
      if (mainSwiper && tumbsSwiper) {
        const tumb = new Swiper(tumbsSwiper, {
          loop: tumbsSlides.length > 3,
          slidesPerView: 'auto',
          slideToClickedSlide: true,
          loopedSlides: 4,
          grabCursor: true,
        })
        const swiper = new Swiper(mainSwiper, {
          loop: tumbsSlides.length > 3,
          slidesPerView: 1,
          grabCursor: true,
          loopedSlides: 4,
          navigation: {
            nextEl: next,
            prevEl: prev,
          },
        })


        swiper.controller.control = tumb;
        tumb.controller.control = swiper;
      }
    })
  }

  const particleConfig = (enabled = true) => {
    
    return {
      "particles": {
        "number": {
          "value": xl.matches ? 30 : 50,
          "density": {
            "enable": true,
            "value_area":  xl.matches ? 400 : (innerWidth / 1920 * 800)
          }
        },
        "color": {
          "value": "#b9e7ff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          },
          "image": {
            "src": "img/github.svg",
            "width": 100,
            "height": 100
          }
        },
        "opacity": {
          "value": 1,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": xl.matches ? 6 : (innerWidth / 1920 * 6),
          "random": false,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": xl.matches ? 192.40944730386272 : (innerWidth / 1920 * 192.40944730386272),
          "color": "#b9e7ff",
          "opacity": 1,
          "width": 2
        },
        "move": {
          "enable": true,
          "speed":  xl.matches ? 6 : (innerWidth / 1920 * 6),
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": enabled,
            "mode": "grab"
          },
          "onclick": {
            "enable": false,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 400,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 24.362316369040354,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 100,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 1
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    }
  }

  const mainparticles = document.getElementById('canvas');

  if (mainparticles) {
    particlesJS('canvas', particleConfig(false));
  }

  const particles = document.getElementById('particlesjs');

  if (particles && !xl.matches) {

    setTimeout(() => {
      particlesJS('particlesjs', particleConfig())
    }, 0)
  }

  const particles404 = document.getElementById('particles404');

  if (particles404) {
    setTimeout(() => {
      particlesJS('particles404', particleConfig())
    }, 0)
  }

  const headerNav = document.getElementById('header-nav');

  if (headerNav && menu) {
    const clone = document.createElement('nav');
    clone.classList = headerNav.classList;
    clone.innerHTML = headerNav.innerHTML;
    menu.prepend(clone);
  }

  const headerLogo = document.querySelector('.header__logo');

  if (headerLogo && header) {
    const clone = headerLogo.cloneNode(true);

    header.prepend(clone);
  }

  const searchButton = document.querySelector('.search-toggle');
  const searchClose = document.querySelector('.search-button-close');

  if (searchButton && searchClose) {
    searchButton.addEventListener('click', function () {
      this.classList.toggle('active');
      if (catalogButton && catalogButton.classList.contains('active')) {
        catalogButton.click();
      }
    })
    searchClose.addEventListener('click', () => {
      searchButton.click();
    })
  }

  function modalHandler() {
    const modal = document.querySelector(`${this.dataset?.modal}`) || this
    if (modal.classList.contains('regModal') && modal.hidden) {
      disableScroll();
    } else {
      enableScroll();
    }
    if (modal) {
      if (modal.hidden) {
        modal.hidden = !modal.hidden
        modal.style.setProperty('pointer-events', 'auto');
        setTimeout(() => {
          modal.style.opacity = 1
        }, 10);
      } else {
        modal.style.opacity = 0
        modal.style.setProperty('pointer-events', null);
        const numb = Number(getComputedStyle(modal).transitionDuration.match(/(\d+\.\d+)|(\d+)/g)[0]);
        if (numb > 0) {
          modal.addEventListener('transitionend', hideaftertransition);
        } else {
          modal.hidden = true
        }
      }
    }
  }

  const regModal = document.querySelectorAll('.regModal');

  if (regModal) {
    regModal.forEach(el => {
      el.addEventListener('click', function () {
        if (event.target.classList.contains('regModal')) {
          modalHandler.apply(this);
        }
      });
      const closeButton = el.querySelectorAll('.close-button');
      if (closeButton.length) {
        closeButton.forEach(button => {
          button.addEventListener('click', () => {
            modalHandler.apply(el);
          });
        })
      }
    });
  }


  function hideaftertransition() {
    this.hidden = true
    this.removeEventListener('transitionend', hideaftertransition);
  }

  document.addEventListener('click', () => {
    const dataModal = event.target.closest('[data-modal]');
    if (dataModal) {
      modalHandler.apply(dataModal);
      return;
    }

    const err = event.target.closest('.error');

    if (err) {
      const errors = document.querySelectorAll('.error');
      if (errors.length)
      errors.forEach(el=>el.classList.remove('error'));
    }
  })

  function inputNumbersHandler(el) {
    const inputNumbers = el.querySelector('.store-count-input');
    const regEx = new RegExp('[0-9]+', 'g');
    const plus = el.querySelector('.plus');
    const minus = el.querySelector('.minus');

    if (inputNumbers) {
      inputNumbers.addEventListener('keypress', (event) => {
        if (event.keyCode == 46 || event.keyCode == 8) {
          //do nothing
        }
        else {
          if (event.keyCode < 48 || event.keyCode > 57) {
            event.preventDefault();
          }
        }
      })
      inputNumbers.addEventListener('input', function () {
        const value = this.value;
        if (!regEx.test(value)) {
          this.value = '';
        };
      })
      inputNumbers.addEventListener('blur', function () {
        if (this.value.trim() === '') {
          this.value = 1;
        }
      })
    }

    if (plus) {
      plus.addEventListener('click', () => {
        inputNumbers.value++;
      })
    }

    if (minus) {
      minus.addEventListener('click', () => {
        inputNumbers.value--;
        if (inputNumbers.value < 1) {
          inputNumbers.value = 1;
        }
      })
    }
  }
  setTimeout(() => {
    const storeCount = document.querySelectorAll('.store-count-wrapper');

    if (storeCount.length) {
      storeCount.forEach(el => {
        inputNumbersHandler(el);
      })
    }

    const addButtons = document.querySelectorAll('[data-modal="#addProduct"]');
    const addProductContent = document.getElementById('addProduct-content');

    if (addButtons.length && addProductContent) {
      addButtons.forEach(el => {
        el.addEventListener('click', function () {
          const parent = this.closest('.store-item');
          if (parent) {
            const clone = parent.cloneNode(true);
            addProductContent.innerHTML = '';
            addProductContent.appendChild(clone);
            inputNumbersHandler(addProductContent);
          }
        })
      })
    }
  }, 0)

  const catalogMaxHeight = document.querySelectorAll('.catalog2-max-h');

  if (catalogMaxHeight.length) {
    const style = getComputedStyle(document.body);
    const numb = style.getPropertyValue('--lineNumb') || 5;
    catalogMaxHeight.forEach(el => {

      if (el.children.length > numb) {
        el.nextElementSibling.classList.add('visible');
      }
    })
  }

  const accordions = document.querySelectorAll('.accordion');

  if (accordions.length) {
    accordions.forEach(el => {
      const btn = el.querySelector('.accordion-button');

      if (btn) {
        btn.addEventListener('click', function () {
          this.classList.toggle('active');
        })
      }
    })
  }

  setTimeout(() => {
    const ranges = document.querySelectorAll('.slider-range')
    if (ranges.length) {
      ranges.forEach(el => {
        let valueInput = [];
        const min = el.parentElement.querySelector('.min');
        const max = el.parentElement.querySelector('.max');

        const range = new rSlider({
          target: el,
          values: { min: +el.dataset.min || 0, max: +el.dataset.max || 100 },
          step: +el.dataset.step || 10,
          range: true,
          set: [+el.dataset.set1 || 0, +el.dataset.set2 || 100],
          scale: false,
          labels: true,
          tooltip: false,
          onChange: (value) => {
            valueInput = value.split(',');
            if (min) {
              min.value = valueInput[0] + '.00';
            }
            if (max) {
              max.value = valueInput[1] + '.00';
            }
          }
        });

        const inputs = el.parentElement.querySelectorAll('input');
        const maxValue = range.conf.values[range.conf.values.length - 1] + '.00';
        const minValue = range.conf.values[0] + '.00';

        if (inputs.length) {
          inputs.forEach(el => {
            const regEx = new RegExp('[0-9]+', 'g');
            el.addEventListener('keypress', (event) => {
              if (event.keyCode == 46 || event.keyCode == 8) {
                //do nothing
              }
              else {
                if (event.keyCode < 48 || event.keyCode > 57) {
                  event.preventDefault();
                }
              }
            })
            el.addEventListener('input', function () {
              const value = this.value;
              if (!regEx.test(value)) {
                this.value = '';
              }
            })
            el.addEventListener('blur', function () {
              if (this.value.trim() === '') {
                if (this.classList.contains('min')) {
                  this.value = minValue;
                }
                if (this.classList.contains('max')) {
                  this.value = maxValue;
                }
              } else {
                const values = range.getValue().split(',');
                if (this.classList.contains('min')) {
                  range.setValues(+this.value, +values[1]);
                }
                if (this.classList.contains('max')) {
                  range.setValues(+values[0], +this.value);
                }
              }
            })
          })
        }

      })
    }
  }, 0);

  var x, i, j, l, ll, selElmnt, a, b, c;
  /* Look for any elements with the class "custom-select": */
  x = document.getElementsByClassName("custom-select");
  l = x.length;
  for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
      /* For each option in the original select element,
      create a new DIV that will act as an option item: */
      c = document.createElement("DIV");
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener("click", function (e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h, sl, yl, sel;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        sel = this.parentNode.previousSibling.classList.add('select-selected--active')
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
      /* When the select box is clicked, close any other select boxes,
      and open/close the current select box: */
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  }

  function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i)
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
  }

  /* If the user clicks anywhere outside the select box,
  then close all select boxes: */
  document.addEventListener("click", closeAllSelect);

  const viewButtons = document.querySelectorAll('.view-button');
  const catalog2Content = document.querySelector('.catalog2-content');

  if (viewButtons.length) {
    viewButtons.forEach(el => {
      el.addEventListener('click', function () {
        viewButtons.forEach(btn => {
          btn.classList.remove('active');
        })
        this.classList.add('active');
        if (this.classList.contains('--hor')) {
          catalog2Content.classList.add('--horizontal');
        } else {
          catalog2Content.classList.remove('--horizontal');
        }
      })

      if (el.classList.contains('active')) {
        el.click();
      }
    })
  }

  const filterBtn = document.querySelector('.filter-button');
  const filterClose = document.querySelector('.filter-close');

  if (filterBtn && filterClose) {
    filterBtn.addEventListener('click', function () {
      this.classList.toggle('active');
    })

    filterClose.addEventListener('click', () => filterBtn.click());
  }

  const favoriteItems = document.querySelectorAll('.favorite-list input[type="checkbox"], .cart-list input[type="checkbox"]');

  if (favoriteItems.length) { 
    favoriteItems.forEach(el => {
      el.addEventListener('click', function () {
        const parent = this.closest('.store-item');
        if (parent) {
          if (this.checked) {
            parent.classList.add('active');
          } else {
            parent.classList.remove('active');
          }
        }
      })
      if (el.checked) { 
        const parent = el.closest('.store-item');
        if (parent) {
          parent.classList.add('active');
        }
      }
    })
  }

  const orderSelects = document.querySelectorAll('.order-select-wrapper');

  function closeSelect () {
    if (!event.target.closest('.order-select')) {
      if (orderSelects.length) {
        orderSelects.forEach(container=> {
          const btn = container.querySelector('.order-select-name');
          if (btn) {
            btn.classList.remove('open');
          }
        })
      }
      document.removeEventListener('click', closeSelect);
    }
  }

  function closeSelects () {
    if (orderSelects.length) {
      orderSelects.forEach(container=> {
        const btn = container.querySelector('.order-select-name');
        if (btn) {
          btn.classList.remove('open');
        }
      })
    }
    document.removeEventListener('click', closeSelect);
  }

  if (orderSelects.length) {
    orderSelects.forEach(container => {
      const btn = container.querySelector('.order-select-name');
      const options = container.querySelectorAll('.order-select-btn');
      const content = container.querySelector('.order-content');

      if (options.length) {
        options.forEach(option => {
          option.addEventListener('click', function () {
            options.forEach(option1 => {
              option1.classList.remove('selected');
            })
            this.classList.add('selected');
            btn.innerHTML = this.innerHTML;
            if (content) {
              content.innerHTML = this.nextElementSibling?.innerHTML || '';
            }
            closeSelects();
          })

          if (option.classList.contains('selected')) {
            options.forEach(option1 => {
              option1.classList.remove('selected');
            })
            btn.innerHTML = option.innerHTML;
            if (content) {
              content.innerHTML = option.nextElementSibling?.innerHTML || '';
            }
          }
        })
      }

      if (btn) {
        btn.addEventListener('click', function () {
          this.classList.toggle('open');

          if (this.classList.contains('open')) {
            document.addEventListener('click', closeSelect);
          }
        })
      }
    })
  }

  const scrolledObj = document.querySelectorAll('[data-scroll]');

  if (scrolledObj.length) {
    scrolledObj.forEach(el => {
      el.addEventListener('click', function () {
        const sc = document.getElementById(this.dataset.scroll);
        if (sc) {
          const header = document.querySelector('header');
          let headerH = null;
          if (header) {
            headerH = header.getBoundingClientRect().height;
          }
          const yOffset = headerH ? -headerH : -200;
          const y = sc.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'auto' });
        }
      })
    })
  }


});












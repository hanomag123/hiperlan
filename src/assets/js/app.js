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
              slidesPerGroup: 1,
              slidesPerGroupAuto: false,
              speed: 500,
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
              breakpoints: {
                // when window width is >= 1025px
                1025: {
                  slidesPerGroup: 3,
                  slidesPerGroupAuto: true,
                  speed: 700,
                },
              },
              navigation: {
                nextEl: next,
                prevEl: prev,
              },
              on: {
                transitionStart: function (swiper) {

                  if (!xl.matches) {
                    swiper.el.classList.add('transition');
                  }
                },
                transitionEnd: function (swiper) {
                  if (!xl.matches) {
                    swiper.el.classList.remove('transition');
                  }
                },
              }
            })
          }, 0)

        }
      }
    })
  }

  const mainparticles = document.getElementById('canvas');

  if (mainparticles) {
    particlesJS('canvas',
      {
        "particles": {
          "number": {
            "value": 50,
            "density": {
              "enable": true,
              "value_area": 800
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
            "value": 6,
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
            "distance": 192.40944730386272,
            "color": "#b9e7ff",
            "opacity": 1,
            "width": 2
          },
          "move": {
            "enable": true,
            "speed": 6,
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
              "enable": false,
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
    )
  }

  const particles = document.getElementById('particlesjs');

  if (particles && !xl.matches) {

    setTimeout(() => {
      particlesJS('particlesjs',
        {
          "particles": {
            "number": {
              "value": 50,
              "density": {
                "enable": true,
                "value_area": 800
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
              "value": 6,
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
              "distance": 192.40944730386272,
              "color": "#b9e7ff",
              "opacity": 1,
              "width": 2
            },
            "move": {
              "enable": true,
              "speed": 6,
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
                "enable": true,
                "mode": "grab"
              },
              "onclick": {
                "enable": true,
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
      )
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

  const buttonsModal = document.querySelectorAll('[data-modal]');

  function hideaftertransition() {
    this.hidden = true
    this.removeEventListener('transitionend', hideaftertransition);
  }

  if (buttonsModal.length) {
    buttonsModal.forEach(el => el.addEventListener('click', modalHandler));
  }

});












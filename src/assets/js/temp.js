function disableScroll() {
  // Get the current page scroll position
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  document.documentElement.style.setProperty('scroll-behavior', 'auto');

  // if any scroll is attempted, set this to the previous value
  window.onscroll = function () {
    window.scrollTo(scrollLeft, scrollTop);
  };
}

function enableScroll() {
  document.documentElement.style.setProperty('scroll-behavior', null);
  window.onscroll = function () { };
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

function hideaftertransition() {
  this.hidden = true
  this.removeEventListener('transitionend', hideaftertransition);
}


for (const form of document.forms) {
  form.addEventListener('submit', function () {
    event.preventDefault();
    const formData = new FormData(this);
    const parent = this.closest('.regModal');
    const feedback = document.querySelector('#feedback');

    const reset = this.closest('.store-count');

    if (reset) {
      return;
    }

    for(let [name, value] of formData.entries()) {
      console.log(name, value);
    }

    this.reset();
    const customfeedback = this.closest('.custom-feedback,.cart-order'); 


    if (customfeedback) {
      customfeedback.classList.add('active');
    }

    if (parent) {
      modalHandler.apply(parent);
    } 

    if (feedback && parent) {
      modalHandler.apply(feedback);
    }
  });
}


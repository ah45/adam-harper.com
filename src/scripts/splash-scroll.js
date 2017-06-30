/*
 * Animation
 */


// credit: https://www.kirupa.com/html5/animating_with_easing_functions_in_javascript.htm
function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
  var stepMultiplier = 1 + Math.pow(currentIteration / totalIterations - 1, 3);
  return startValue + (changeInValue * stepMultiplier);
}

function easeScroll(fromYPosition, toYPosition) {
  var scrollInProgress = true;
  var i = 0;

  var direction = (fromYPosition > toYPosition) ? 'up' : 'down';
  var distance = Math.abs(fromYPosition - toYPosition);

  var animateScroll = function () {
    if (scrollInProgress) {
      var delta = easeOutCubic(i, 0, distance, 75);
      var newPosition = fromYPosition + (direction == 'up' ? -delta : delta);

      window.scrollTo(0, newPosition);
      i = i + 1;

      if (window.pageYOffset == toYPosition) {
        scrollInProgress = false;
      }
      else {
        requestAnimationFrame(animateScroll);
      }
    }
  }

  requestAnimationFrame(animateScroll);
}


/*
 * Event handling
 */



function headerHeight () {
  var el = document.getElementsByTagName('header')[0];
  return el.offsetTop + el.clientHeight;
}

function scrollToTop     (e) { e.preventDefault(); easeScroll(window.pageYOffset, 0); }
function scrollToSummary (e) { e.preventDefault(); easeScroll(window.pageYOffset, headerHeight()); }

function hide (el) { el.style.display = 'none'; }
function show (el) { el.style.display = 'block'; }

function addSplashSkipoverHandling () {
  var skipSplash = document.getElementsByClassName('splash__skip')[0];
  var showSplash = document.getElementsByClassName('splash__show')[0];

  skipSplash.addEventListener('click', function (e) {
    hide(e.target);
    scrollToSummary(e);
  });

  showSplash.addEventListener('click', function (e) {
    hide(e.target);
    scrollToTop(e);
  });

  document.addEventListener('scroll', function () {
    return function () {
      var position = window.pageYOffset;
      var cutover  = 0.5 * headerHeight();

      if (position > cutover) {
        hide(skipSplash);
        show(showSplash);
      }
      else {
        show(skipSplash);
        hide(showSplash);
      }
    }
  }());
}

addSplashSkipoverHandling();

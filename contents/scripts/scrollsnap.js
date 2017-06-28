var KeyPageUp   = 33;
var KeyPageDown = 34;
var KeyUp       = 38;
var KeyDown     = 40;

function handleTouchMove (startX, startY) {
  var handler = function (e) {
    var touches = e.touches;

    if (touches === undefined || touches.length == 0) { return; }

    e.preventDefault();

    var deltaX = startX - touches[0].pageX;
    var deltaY = startY - touches[0].pageY;
    var direction;

    if (deltaX >= 50) { direction = 'left' }
    else if (deltaX <= -50) { direction = 'right' }
    else if (deltaY >=  50) { direction = 'up' }
    else if (deltaY <= -50) { direction = 'down' }

    if (direction !== undefined) {
      var swipeEvent = new Event('swipe');
      swipeEvent.swipeDirection = direction;

      document.dispatchEvent(swipeEvent);
    }

    if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
      document.removeEventListener('touchmove', handler);
    }
  }

  return handler;
}

function handleTouchStart (e) {
  var touches = e.touches;

  if (touches === undefined || touches.length == 0) { return; }

  var startX = touches[0].pageX;
  var startY = touches[0].pageY;

  document.addEventListener('touchmove', handleTouchMove(startX, startY));
}

function isDownKey (e) {
  var key = e.which;
  return (key == KeyDown || key == KeyPageDown);
}

function isUpKey (e) {
  var key = e.which;
  return (key == KeyUp || key == KeyPageUp);
}

function isScrollDown (e) { return (e.deltaY > 0); }
function isScrollUp   (e) { return (e.deltaY < 0); }

function isMoveDown (e) {
  return (e.type == 'keydown' && isDownKey(e))
      || (e.type == 'wheel' && isScrollDown(e))
      || (e.type == 'swipe' && e.swipeDirection == 'up')
      || false
  ;
}

function isMoveUp (e) {
  return (e.type == 'keydown' && isUpKey(e))
      || (e.type == 'wheel' && isScrollUp(e))
      || (e.type == 'swipe' && e.swipeDirection == 'down')
      || false
  ;
}

function headerHeight () {
  var el = document.getElementsByTagName('header')[0];
  return el.offsetTop + el.clientHeight;
}

function scrollToTop     (e) { e.preventDefault(); window.scrollTo(0, 0); }
function scrollToSummary (e) { e.preventDefault(); window.scrollTo(0, headerHeight()); }

function handleScroll () {
  var trigger;

  document.addEventListener('keydown', function (e) { trigger = e; });
  document.addEventListener('mousewheel', function (e) { trigger = e; });
  document.addEventListener('swipe', function (e) { trigger = e; });

  return function (e) {
    var offset = window.pageYOffset;
    var summaryOffset = headerHeight();

    console.log(['scrolled to ' + offset, trigger, summaryOffset]);

    if (offset == 0) {
      if (isMoveDown(trigger)) {
        console.log('to the summary!');
        scrollToSummary(e);
      }
      else {
        console.log('there\'s nowhere to go');
      }
    }
    else if (offset == summaryOffset) {
      if (isMoveUp(trigger)) {
        console.log('to the top!');
        scrollToTop(e);
      }
      else {
        console.log('carry on down');
      }
    }
    else if (offset < summaryOffset) {
      console.log('back to the summary with you');
      scrollToSummary(e);
    }
    else {
      console.log('all good');
    }
  }
}


document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('scroll', handleScroll());

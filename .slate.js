// Deterministic, predictable window focus switching.
slate.bind('1:ctrl;alt', focusNthWindow(0));
slate.bind('2:ctrl;alt', focusNthWindow(1));
slate.bind('3:ctrl;alt', focusNthWindow(2));
slate.bind('4:ctrl;alt', focusNthWindow(3));
slate.bind('5:ctrl;alt', focusNthWindow(4));
slate.bind('6:ctrl;alt', focusNthWindow(5));
slate.bind('7:ctrl;alt', focusNthWindow(6));
slate.bind('8:ctrl;alt', focusNthWindow(7));
slate.bind('9:ctrl;alt', focusNthWindow(8));
slate.bind('0:ctrl;alt', focusNthWindow(9));

slate.bind('left:ctrl;alt;shift', focusWindowOnNeighboringScreen(prevScreen));
slate.bind('right:ctrl;alt;shift', focusWindowOnNeighboringScreen(nextScreen));

function focusWindowOnNeighboringScreen(iterator) {
  return function() {
    var count = slate.screenCount();
    var orig = slate.screen().id();
    var curr = iterator(orig, count);
    while (curr !== orig) {
      if (focusNthWindow(0, curr)()) {
        break;
      } else {
        curr = iterator(curr, count);
      }
    }
  }
}

function prevScreen(i, count) {
  return (i - 1 + count) % count;
}

function nextScreen(i, count) {
  return (i + 1) % count;
}

function focusNthWindow(n, screenId) {
  return function () {
    var wins = getWindowsOnScreen(screenId);
    if (wins.length > n) {
      wins[n].focus();
      return true;
    } else {
      return false;
    }
  }
}

function getWindowsOnScreen(screenId) {
  var windows = [];
  var currentScreenId = screenId === void 0 ? slate.screen().id() : screenId;
  slate.eachApp(function(app) {
    app.eachWindow(function(win) {
      if (win.screen().id() === currentScreenId) {
        windows.push(win);
      }
    });
  });
  return windows.sort(compareWindowsByPosition);
}

function compareWindowsByPosition(a, b) {
  var apos = a.topLeft();
  var bpos = b.topLeft();

  return apos.x - bpos.x || apos.y - bpos.y;
}

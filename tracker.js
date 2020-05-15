var timer = null;
var start = 0;
var paused = 0;
var diffs = [];
var elapsed = '0.00';

function zeroFill(i) {
  if (i < 10) i = '0' + i;
  return i;
};

function toggle_timer(e) {
  if (!e.classList.contains('active')) {
    if (!start) start = new Date().getTime(); // - (9.999 * 60 * 60 * 1000); // Test Times
    if (paused) diffs.push(new Date().getTime() - paused);
    var adjustedStart = start;
    diffs.forEach(function (diff) { adjustedStart += diff; });
    timer = setInterval(update_timer, 33, e, adjustedStart);
    e.classList.add('active')
  } else {
    clearInterval(timer);
    paused = new Date().getTime();
    e.classList.remove('active')
  }
};

function update_timer(e, adjustedStart) {
  elapsed = Math.floor((new Date().getTime() - adjustedStart) / 10) / 100;

  var timeElement = e.children[0].children[0];
  var subtimeElement = e.children[0].children[1];
  var h = Math.floor((elapsed * 1000) / (1000 * 60 * 60));
  var m = (new Date(elapsed * 1000)).getMinutes();
  var s = (new Date(elapsed * 1000)).getSeconds();
  var zeroM = (h > 0) ? zeroFill(m) : m;
  var zeroS = (h > 0 || m > 0) ? zeroFill(s) : s;

  h = (h) ? h += ':' : '';
  zeroM += ':';
  if (zeroM === '0:') zeroM = '';

  timeElement.innerText = h + zeroM + zeroS;
  subtimeElement.innerText = '.' + zeroFill(Number(String(elapsed).split('.')[1]) || 0);
};

function increment_count(e) {
  var counted = e.currentTarget.classList.contains('counted');
  var numbers = e.currentTarget.querySelector('.count');

  if (numbers) {
    var shown = numbers.querySelector(':not(.hidden)');
    var next = null;

    if (e.wheelDelta > 0) next = shown.previousElementSibling;
    else if (e.wheelDelta < 0) next = shown.nextElementSibling;

    if (next) {
      shown.classList.toggle('hidden');
      next.classList.toggle('hidden');

      if (counted) {
        if (next.getAttribute('src')) e.currentTarget.querySelector('.items').classList.remove('grayscale');
        else e.currentTarget.querySelector('.items').classList.add('grayscale');

        console.log(next.getAttribute('src'));
      }
    }
  }
};

function toggle_item(e, misc) {
  e.preventDefault();

  var parent = e.currentTarget;
  var show = null;
  var items = [];
  var markers = false;

  if (e.which === 2) items = parent.querySelector('.markers');
  else items = parent.querySelector('.items');

  if (e.which === 1
      && !(parent.classList.contains('dungeon') && !parent.querySelector('.items').children[0].classList.contains('hidden'))) {
    if (!parent.classList.contains('counted')) {
      items.classList.toggle('grayscale');
    } else {
      console.log('clack');
      var counted = e.currentTarget.classList.contains('counted');
      var numbers = e.currentTarget.querySelector('.count');

      if (numbers) {
        console.log(counted);
        console.log(numbers);
        var shown = numbers.querySelector(':not(.hidden)');
        var next = shown.previousElementSibling;
        console.log(shown);
        console.log(next);

        if (next) {
          shown.classList.toggle('hidden');
          next.classList.toggle('hidden');

          if (counted) {
            if (next.getAttribute('src')) e.currentTarget.querySelector('.items').classList.remove('grayscale');
            else e.currentTarget.querySelector('.items').classList.add('grayscale');

            console.log(next.getAttribute('src'));
          }
        } else {
          console.log(numbers.querySelector(':last-child'));
          shown.classList.toggle('hidden');
          numbers.lastElementChild.classList.toggle('hidden');
          e.currentTarget.querySelector('.items').classList.add('grayscale');
        }
      }
    }
  }

  if (e.which === 3 || (e.which === 2 && items)) {
    for (var i = 0; i < items.children.length; i++) {
      if (!items.children[i].classList.contains('hidden')) {
        items.children[i].classList.add('hidden');
        show = i + 1;
      }

      if (show === items.children.length) {
        items.children[0].classList.remove('hidden');
      } else if (show === i) {
        items.children[i].classList.remove('hidden');
      }
    }

    if (!show) items.children[0].classList.remove('hidden');
  }

  if (misc === 'alttp_gomode') calculate_go_mode();
};

function calculate_go_mode() {
  var items = [];
  var mayComplete = true;
  var canComplete = true;
  var dungeons = ['ganonstower'];
  var miserymireMedallion = document.querySelector('#miserymire .markers :not(.hidden)').getAttribute('data-id');
  var turtlerockMedallion = document.querySelector('#turtlerock .markers :not(.hidden)').getAttribute('data-id');

  document.querySelectorAll('.item:not(.auto):not(.dungeon)').forEach(function (item) {
    var selected = item.querySelector('.items:not(.grayscale) :not(.hidden)');
    if (selected) items.push(selected.id || item.id);
  });

  document.querySelectorAll('.item.dungeon:not(.auto)').forEach(function (dungeon) {
    var selected = dungeon.querySelector('.items :not(.hidden)');
    var reward = (selected) ? selected.getAttribute('data-id') : null;

    if (reward === 'crystal' || reward === 'fairycrystal') dungeons.push(dungeon.id);
  });

  function mayClearDungeon(dungeon) {
    if (dungeon === 'easternpalace') {
      return items.includes('bow')
          && items.includes('lantern');
    } else if (dungeon === 'desertpalace') {
      return (items.includes('lantern') || items.includes('firerod'))
          && (items.includes('sword1') || items.includes('sword2') || items.includes('sword3') || items.includes('sword4') || items.includes('bow') || items.includes('hammer') || items.includes('somaria') || items.includes('byrna') || items.includes('firerod') || items.includes('icerod'))
          && (
            ((items.includes('glove1') || items.includes('glove2')) && items.includes('book'))
            || (items.includes('flute') && items.includes('glove2') && items.includes('mirror'))
          );
    } else if (dungeon === 'towerofhera') {
      return (items.includes('lantern') || items.includes('flute'))
          && (items.includes('glove1') || items.includes('glove2'))
          && (items.includes('sword1') || items.includes('sword2') || items.includes('sword3') || items.includes('sword4') || items.includes('hammer'));
    } else if (dungeon === 'agahnim') {
      return items.includes('lantern')
          && (
            (items.includes('sword1') && items.includes('cape'))
            || items.includes('sword2')
            || items.includes('sword3')
            || items.includes('sword4')
          );
    } else if (dungeon === 'palaceofdarkness') {
      return items.includes('bow')
          && items.includes('hammer')
          && items.includes('lantern')
          && items.includes('moonpearl')
          && (
            items.includes('agahnim')
            || ((items.includes('hammer') || items.includes('flippers')) && (items.includes('glove1') || items.includes('glove2')))
          );
    } else if (dungeon === 'swamppalace') {
      return items.includes('hammer')
          && items.includes('mirror')
          && items.includes('flippers')
          && items.includes('hookshot')
          && items.includes('moonpearl')
          && (
            (items.includes('glove1') || items.includes('glove2'))
            || items.includes('agahnim')
          );
    } else if (dungeon === 'skullwoods') {
      return items.includes('moonpearl')
          && items.includes('firerod')
          && (items.includes('sword1') || items.includes('sword2') || items.includes('sword3') || items.includes('sword4'))
          && (
            ((items.includes('hammer') && items.includes('glove1')) || items.includes('glove2'))
            || (items.includes('agahnim') && items.includes('hookshot') && (items.includes('hammer') || items.includes('flippers')))
          );
    } else if (dungeon === 'theivestown') {
      return items.includes('moonpearl')
          && (items.includes('glove1') || items.includes('glove2'))
          && (items.includes('sword1') || items.includes('sword2') || items.includes('sword3') || items.includes('sword4') || items.includes('bow') || items.includes('hammer') || items.includes('somaria') || items.includes('byrna') || items.includes('firerod') || items.includes('icerod'))
          && (
            items.includes('hammer')
            || (items.includes('agahnim') && items.includes('hookshot') && (items.includes('hammer') || items.includes('flippers')))
          );
    } else if (dungeon === 'icepalace') {
      return items.includes('hammer')
          && items.includes('glove2')
          && items.includes('flippers')
          && items.includes('moonpearl')
          && (items.includes('bombos') || items.includes('firerod'));
    } else if (dungeon === 'miserymire') {
      return items.includes('flute')
          && items.includes('glove2')
          && items.includes('lantern')
          && items.includes('somaria')
          && items.includes('moonpearl')
          && (items.includes('hookshot') || items.includes('boots'))
          && (items.includes(miserymireMedallion) || (items.includes('bombos') && items.includes('ether') && items.includes('quake')))
          && (items.includes('sword1') || items.includes('sword2') || items.includes('sword3') || items.includes('sword4'));
    } else if (dungeon === 'turtlerock') {
      return items.includes('hammer')
          && items.includes('glove2')
          && items.includes('icerod')
          && items.includes('firerod')
          && items.includes('lantern')
          && items.includes('somaria')
          && items.includes('moonpearl')
          && (items.includes(turtlerockMedallion) || (items.includes('bombos') && items.includes('ether') && items.includes('quake')))
          && (items.includes('sword1') || items.includes('sword2') || items.includes('sword3') || items.includes('sword4'));
    } else if (dungeon === 'ganonstower') {
      return items.includes('bow')
          && items.includes('glove2')
          && items.includes('hookshot')
          && items.includes('moonpearl')
          && (items.includes('lantern') || items.includes('flute'))
          && (items.includes('lantern') || items.includes('firerod'))
          && (items.includes('sword2') || items.includes('sword3') || items.includes('sword4'));
    }
  };

  function canClearDungeon(dungeon) {
    if (dungeon === 'easternpalace') {
      return mayClearDungeon('easternpalace');
    } else if (dungeon === 'desertpalace') {
      return mayClearDungeon('desertpalace')
          && items.includes('boots');
    } else if (dungeon === 'towerofhera') {
      return mayClearDungeon('towerofhera')
          && (items.includes('lantern') || items.includes('firerod'));
    } else if (dungeon === 'agahnim') {
      return mayClearDungeon('agahnim');
    } else if (dungeon === 'palaceofdarkness') {
      return mayClearDungeon('palaceofdarkness');
    } else if (dungeon === 'swamppalace') {
      return mayClearDungeon('swamppalace');
    } else if (dungeon === 'skullwoods') {
      return mayClearDungeon('skullwoods');
    } else if (dungeon === 'theivestown') {
      return mayClearDungeon('theivestown')
          && items.includes('hammer');
    } else if (dungeon === 'icepalace') {
      return mayClearDungeon('icepalace')
          && items.includes('somaria')
          && items.includes('hookshot');
    } else if (dungeon === 'miserymire') {
      return mayClearDungeon('miserymire');
    } else if (dungeon === 'turtlerock') {
      return mayClearDungeon('turtlerock');
    } else if (dungeon === 'ganonstower') {
      return mayClearDungeon('ganonstower')
          && items.includes('boots')
          && items.includes('hammer')
          && items.includes('firerod')
          && items.includes('somaria');
    }
  };

  dungeons.forEach(function (dungeon) {
    if (mayComplete && !mayClearDungeon(dungeon)) mayComplete = false;
    if (canComplete && !canClearDungeon(dungeon)) canComplete = false;
  });

  if (canComplete) {
    document.querySelectorAll('#gomode .items > *').forEach(function (i) { i.classList.add('hidden'); });
    document.querySelector('#gomode #go').classList.remove('hidden');
  } else if (mayComplete) {
    document.querySelectorAll('#gomode .items > *').forEach(function (i) { i.classList.add('hidden'); });
    document.querySelector('#gomode #maybego').classList.remove('hidden');
  } else{
    document.querySelectorAll('#gomode .items > *').forEach(function (i) { i.classList.add('hidden'); });
    document.querySelector('#gomode #nogo').classList.remove('hidden');
  }

  // console.log('items', items);
  // console.log('dungeons', dungeons);
  // console.log('mayBeatGanon', mayClearDungeon('ganonstower'));
  // console.log('mayComplete', mayComplete);
};

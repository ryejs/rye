(function() {
  var exports,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  exports = {};

  exports.assert = (chai || require('chai')).assert;

  exports.$ = Rye;

  exports.list_items = function() {
    return $('.list li');
  };

  exports.escape = function(v) {
    return v.replace(/[[\]]/g, function(v) {
      return {
        '[': '%5B',
        ']': '%5D'
      }[v];
    });
  };

  Number.Countdown = (function() {

    function Countdown(index, done) {
      this.index = index != null ? index : 0;
      this.done = done;
      this.fire = __bind(this.fire, this);

    }

    Countdown.prototype.valueOf = function() {
      return this.index;
    };

    Countdown.prototype.toString = function() {
      return this.index.toString();
    };

    Countdown.prototype.fire = function() {
      if (!--this.index) {
        return this.done();
      }
    };

    return Countdown;

  })();

  Number.Counter = (function() {

    function Counter(index) {
      this.index = index != null ? index : 0;
      this.step = __bind(this.step, this);

    }

    Counter.prototype.valueOf = function() {
      return this.index;
    };

    Counter.prototype.toString = function() {
      return this.index.toString();
    };

    Counter.prototype.step = function() {
      return ++this.index;
    };

    return Counter;

  })();

  exports.makeElement = function(tagName, html, attrs) {
    var el, key, value;
    el = document.createElement(tagName);
    el.innerHTML = html;
    for (key in attrs) {
      value = attrs[key];
      el[key] = value;
    }
    return el;
  };

  exports.do_not_call = function(event) {
    return assert.ok(false, "Function shouldn't be called");
  };

  exports.fire = function(type, element, x, y) {
    var event, touch;
    event = document.createEvent('Event');
    touch = {
      pageX: x || 0,
      pageY: y || 0,
      target: element
    };
    event.initEvent('touch' + type, true, true);
    event.touches = [touch];
    return element.dispatchEvent(event);
  };

  exports.down = function(element, x, y) {
    return fire('start', element, x, y);
  };

  exports.move = function(element, x, y) {
    return fire('move', element, x, y);
  };

  exports.up = function(element) {
    return fire('end', element);
  };

  (function() {
    var test;
    test = document.createElement('section');
    test.id = 'test';
    document.body.appendChild(test);
    return setup(function() {
      return test.innerHTML = "<header>\n    <h2>This is the test area</h2>\n</header>\n<div class=\"content\">\n    <p id=\"hello\">Hello</p>\n    <ul class=\"list\">\n        <li class=\"a\">One</li>\n        <li class=\"b\">Two</li>\n        <li class=\"c\">Three</li>\n    </ul>\n</div>";
    });
  })();

  exports.util = Rye.require('Util');

  exports.data = Rye.require('Data');

  exports.events = Rye.require('Events');

  exports.EventEmitter = Rye.require('Events').EventEmitter;

  exports.DOMEventEmitter = Rye.require('Events').DOMEventEmitter;

  exports.touchEvents = Rye.require('TouchEvents');

  exports.request = Rye.require('Request');

  exports.style = Rye.require('Style');

  exports.util.extend(window, exports);

}).call(this);

(function() {

  suite('Collection', function() {
    test('get all', function() {
      var list, nodelist;
      list = list_items();
      nodelist = list.get();
      return assert(nodelist.length === 3, "List has 3 elements");
    });
    test('get index', function() {
      var el, list;
      list = list_items();
      el = list.get(0);
      assert(el instanceof HTMLElement, "list.get(0) is an element");
      return assert(el.className === 'a', "list.get(0) is .a");
    });
    test('eq', function() {
      var b, list;
      list = list_items();
      b = list.eq(1);
      assert(b instanceof Rye, "Returns Rye instance");
      return assert(b.length === 1, "One element");
    });
    test('eq null', function() {
      var b, list;
      list = list_items();
      b = list.eq();
      assert(b instanceof Rye, "Returns Rye instance");
      return assert(b.length === 0, "Without elements");
    });
    test('forEach', function() {
      var count, list;
      list = list_items();
      count = 0;
      list.forEach(function(el, i) {
        assert.strictEqual(el, list.get(i), "Index in loop corresponds to element");
        return count++;
      });
      return assert.equal(count, 3, "Three iterations completed");
    });
    test('reduce', function() {
      var list, res;
      list = list_items();
      res = list.reduce(function(p, c, i) {
        return p + c.className;
      }, 'ø');
      return assert.strictEqual(res, 'øabc', "Result includes concatenated classes");
    });
    test('reduceRight', function() {
      var list, res;
      list = list_items();
      res = list.reduceRight(function(p, c, i) {
        return p + c.className;
      }, 'ø');
      return assert.strictEqual(res, 'øcba', "Result includes reverse concatenated classes");
    });
    test('indexOf', function() {
      var el, i, list, _i, _len, _ref, _results;
      list = list_items();
      _ref = list.get();
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        el = _ref[i];
        _results.push(assert(list.indexOf(el) === i, "Indexes must match"));
      }
      return _results;
    });
    test('map', function() {
      var list, res;
      list = list_items();
      res = list.get().map(function(el) {
        return el.className;
      });
      return assert.deepEqual(res, ['a', 'b', 'c'], "List of classnames matches");
    });
    test('sort', function() {
      var list;
      list = list_items();
      list.sort(function(a, b) {
        if (a.className < b.className) {
          return 1;
        } else {
          return -1;
        }
      });
      return assert(list.get(0).className === 'c', ".c is first in the list");
    });
    test('each', function() {
      var count, list;
      list = list_items();
      count = 0;
      list = list.each(function(el, i) {
        assert.strictEqual(el, list.get(i), "Index in loop corresponds to element");
        return count++;
      });
      assert(list instanceof Rye, "Returns Rye instance");
      return assert.equal(count, 3, "Three iterations completed");
    });
    test('push', function() {
      var div, list, list_length, ret;
      list = list_items();
      div = document.createElement('div');
      list_length = list.length;
      ret = list.push(div);
      assert.equal(ret, list_length, "Push position");
      assert.equal(list.length, list_length + 1, "Increase size");
      return assert.equal(list.get(3), div, "Adds the element to last position");
    });
    test('push not elements', function() {
      var list, list_length, obj, ret;
      list = list_items();
      obj = {};
      list_length = list.length;
      ret = list.push(obj);
      assert.equal(ret, -1, "Fail operation");
      return assert.equal(list.length, list_length, "Keep size");
    });
    test('slice', function() {
      var list, res;
      list = list_items();
      res = list.slice(0, 2);
      assert.deepEqual(res.elements, [list.elements[0], list.elements[1]], "List of classnames matches");
      return assert.deepEqual(list, list_items(), "Doesnt affect the original");
    });
    test('concat', function() {
      var list, list2, other;
      list = list_items();
      other = [document.createElement('div')];
      list2 = list.concat(other);
      assert(list2.length === 4, "List length should increase by 1");
      return assert(list2.get(3).tagName === 'DIV');
    });
    test('pluck', function() {
      var ret, rye;
      rye = $();
      rye.elements = [
        {
          k: 'rye'
        }, {
          k: 'js'
        }
      ];
      ret = rye.pluck('k');
      return assert.deepEqual(ret, ['rye', 'js']);
    });
    return test('put', function() {
      var rye;
      rye = $();
      rye.elements = [
        {
          k: 'rye'
        }, {
          k: 'js'
        }
      ];
      rye.put('k', '-');
      return assert.deepEqual(rye.elements, [
        {
          k: '-'
        }, {
          k: '-'
        }
      ]);
    });
  });

}).call(this);

(function() {

  suite('Data', function() {
    test('storage data', function() {
      var e;
      e = {};
      assert.equal(data.get(e, 'key'), void 0, "No initial data");
      data.set(e, 'key', 'foo');
      assert.equal(data.get(e, 'key'), 'foo', "Data foo in key");
      data.set(e, 'key', 'bar');
      assert.equal(data.get(e, 'key'), 'bar', "Data changed to bar in key");
      return assert.deepEqual(data.get(e), {
        key: 'bar'
      }, "Get all data");
    });
    test('Element storage data', function() {
      var el;
      el = $(document.createElement('div'));
      assert.equal(el.data('key'), void 0, "No initial data");
      el.data('key', 'foo');
      assert.equal(el.data('key'), 'foo', "Data foo in key");
      el.data('key', {
        fizz: 1,
        buzz: 2
      });
      return assert.deepEqual(el.data('key'), {
        fizz: 1,
        buzz: 2
      }, "Data changed to object in key");
    });
    return test('List storage data', function() {
      var el;
      el = $([document.createElement('div'), document.createElement('div')]);
      assert.deepEqual(el.data('key'), [void 0, void 0], "No initial data");
      el.data('key', 'foo');
      assert.deepEqual(el.data('key'), ['foo', 'foo'], "Data foo in key");
      el.data('key', 'bar');
      return assert.deepEqual(el.data('key'), ['bar', 'bar'], "Data changed to bar in key");
    });
  });

}).call(this);

(function() {

  suite('EventEmitter', function() {
    test('add listener', function() {
      var emitter;
      emitter = new EventEmitter;
      emitter.on('click', function() {
        return null;
      });
      return assert.equal(emitter.events['click'].length, 1);
    });
    test('remove listener', function() {
      var fn, x;
      x = new EventEmitter;
      fn = function() {
        return 123;
      };
      x.on('click', fn);
      x.removeListener('click', fn);
      assert(x.events['click'] === void 0, "Event removed by reference");
      x.on('click', fn);
      x.removeListener('click');
      return assert(x.events['click'] === void 0, "Event removed by name");
    });
    test('remove all listener', function() {
      var fn, x;
      x = new EventEmitter;
      fn = function() {
        return 123;
      };
      x.on('click', fn);
      x.on('keydown', fn);
      x.removeListener('*', fn);
      assert(x.events['click'] === void 0, "Event removed by reference");
      x.on('click', fn);
      x.on('keydown', fn);
      x.removeListener('*');
      return assert(x.events['click'] === void 0, "Event removed by name");
    });
    test('emit event', function(done) {
      var x;
      x = new EventEmitter;
      x.on('click', function(arg) {
        assert.equal(arg, 55);
        return done();
      });
      return x.emit('click', 55);
    });
    return test('emit once', function(done) {
      var x;
      x = new EventEmitter;
      x.once('click', function(arg) {
        return assert(arg === 4, "Argument received");
      });
      x.emit('click', 4);
      x.emit('click', 5);
      return setTimeout(function() {
        assert(x.events['click'] === void 0, "Event removed");
        return done();
      });
    });
  });

  suite('PubSub', function() {
    test('subscribe publish', function(done) {
      $.subscribe('sign', function(arg) {
        assert(arg === 55, "Argument received");
        return done();
      });
      return $.publish('sign', 55);
    });
    return test('unsubscribe', function(done) {
      $.subscribe('sign', function() {
        return assert(false, "Event shouldn't be emmited");
      });
      $.unsubscribe('sign');
      $.publish('sign');
      return setTimeout(function() {
        return done();
      }, 0);
    });
  });

  suite('DOMEvents', function() {
    test('addListener', function(done) {
      var div, fn;
      div = makeElement('div');
      fn = function(event) {
        assert.equal(event.data, 55);
        return done();
      };
      events.addListener(div, 'click', fn);
      return events.trigger(div, 'click', 55);
    });
    test('once', function(done) {
      var counter, div;
      div = makeElement('div');
      counter = new Number.Counter;
      events.once(div, 'click', counter.step);
      events.trigger(div, 'click');
      events.trigger(div, 'click');
      return setTimeout(function() {
        assert.equal(counter, 1);
        return done();
      }, 0);
    });
    test('remove listener', function(done) {
      var counter, div;
      div = makeElement('div');
      counter = new Number.Counter;
      events.addListener(div, 'foo', do_not_call);
      events.addListener(div, 'buz', do_not_call);
      events.addListener(div, 'bar', counter.step);
      events.removeListener(div, 'foo');
      events.removeListener(div, 'buz*');
      events.trigger(div, 'bar');
      events.trigger(div, 'buz');
      events.trigger(div, 'foo');
      return setTimeout(function() {
        assert.equal(counter, 1);
        return done();
      }, 0);
    });
    test('remove listener in element without emitter', function() {
      var div;
      div = makeElement('div');
      events.removeListener(div, 'foo');
      return assert.ok(true);
    });
    test('remove listener trought selector', function(done) {
      var counter, el, item;
      el = $('#test .content').get(0);
      item = $('.a').get(0);
      counter = new Number.Counter;
      events.addListener(el, 'click li', counter.step);
      events.addListener(el, 'click ul', do_not_call);
      events.addListener(el, 'blur li', do_not_call);
      events.addListener(el, 'focus li', do_not_call);
      events.removeListener(el, 'click ul');
      events.removeListener(el, 'blur *');
      events.removeListener(el, 'focus*');
      events.trigger(item, 'click');
      events.trigger(item, 'blur');
      events.trigger(item, 'focus');
      return setTimeout(function() {
        assert.equal(counter, 1);
        return done();
      }, 0);
    });
    test('remove listener trought handler', function(done) {
      var counter, div;
      div = makeElement('div');
      counter = new Number.Counter;
      events.addListener(div, 'click', do_not_call);
      events.addListener(div, 'click', counter.step);
      events.removeListener(div, '*', do_not_call);
      events.trigger(div, 'click');
      return setTimeout(function() {
        assert.equal(counter, 1);
        return done();
      }, 0);
    });
    test('remove all listeners', function(done) {
      var div;
      div = makeElement('div');
      events.addListener(div, 'click', do_not_call);
      events.addListener(div, 'focus', do_not_call);
      events.addListener(div, 'blur', do_not_call);
      events.removeListener(div, '*');
      events.trigger(div, 'click');
      events.trigger(div, 'focus');
      events.trigger(div, 'blur');
      return setTimeout((function() {
        return done();
      }), 0);
    });
    test('destroy emitter', function(done) {
      var div, emitter;
      div = makeElement('div');
      emitter = new DOMEventEmitter(div);
      emitter.addListener('click', do_not_call).addListener('focus', do_not_call).addListener('blur', do_not_call).destroy();
      emitter.trigger('click');
      emitter.trigger('focus');
      emitter.trigger('blur');
      return setTimeout((function() {
        return done();
      }), 0);
    });
    test('accept multiple', function(done) {
      var counter, emitter, item, list;
      list = $('.list').get(0);
      emitter = new DOMEventEmitter(list);
      item = $('.a').get(0);
      counter = new Number.Counter;
      emitter.addListener({
        'click .a': counter.step,
        'click': counter.step
      });
      events.trigger(item, 'click');
      return setTimeout(function() {
        assert.equal(counter, 2);
        return done();
      }, 0);
    });
    test('create event', function() {
      var event;
      event = events.createEvent({
        type: 'click'
      });
      assert.equal(event.type, 'click');
      event = events.createEvent('click', {
        prop: 'value'
      });
      return assert.equal(event.prop, 'value');
    });
    test('delegate', function(done) {
      var counter, fn, item, list;
      list = $('.list').get(0);
      item = $('.a').get(0);
      counter = new Number.Counter;
      fn = function(event) {
        counter.step();
        assert.equal(event.currentTarget, document);
        return assert.equal(event.target, item);
      };
      events.addListener(document, 'click .a', fn);
      events.trigger(item, 'click');
      events.trigger(list, 'click');
      events.trigger(document, 'click');
      return setTimeout(function() {
        assert.equal(counter, 1);
        return done();
      }, 0);
    });
    test('remove delegate', function(done) {
      var item, list;
      list = $('.list').get(0);
      item = $('.a').get(0);
      events.addListener(document, 'click .a', do_not_call);
      events.removeListener(document, 'click .a');
      events.trigger(item, 'click');
      return setTimeout(function() {
        return done();
      }, 0);
    });
    test('handler context', function(done) {
      var counter, item, list;
      list = $('.list').get(0);
      item = $('.a').get(0);
      counter = new Number.Counter;
      events.addListener(list, 'click .a', function() {
        assert.equal(this, item);
        return counter.step();
      });
      events.addListener(list, 'click', function() {
        assert.equal(this, list);
        return counter.step();
      });
      events.trigger(item, 'click');
      return setTimeout(function() {
        assert.equal(counter, 2);
        return done();
      }, 0);
    });
    test('Rye on', function(done) {
      var fn, itens;
      itens = $('.list li');
      fn = function(event) {
        assert(event.data === 55, "Argument received");
        return done();
      };
      itens.on('click', fn);
      return itens.eq(2).trigger('click', 55);
    });
    return test('Rye removeListener', function(done) {
      var itens;
      itens = $('.list li');
      itens.on('blur', do_not_call).removeListener('blur');
      itens.trigger('blur');
      return setTimeout((function() {
        return done();
      }), 0);
    });
  });

}).call(this);

(function() {

  suite('Manipulation', function() {
    test('get text', function() {
      var div, el;
      div = makeElement('div', '<p>x</p>');
      el = $(div);
      return assert.equal(el.text(), 'x');
    });
    test('set text', function() {
      var div, el;
      div = makeElement('div');
      el = $(div).text('<');
      return assert.equal(el.html(), '&lt;');
    });
    test('get html', function() {
      return assert.equal($('body').html(), document.getElementsByTagName('body')[0].innerHTML);
    });
    test('set html', function() {
      var contents, div;
      div = makeElement('div');
      contents = '<p><b>X</b></p>';
      $(div).html(contents);
      return assert.equal($(div).html(), contents);
    });
    test('empty', function() {
      var div, el;
      div = makeElement('div', '<p>a</p><p>b</p><p>c</p>');
      el = $(div).children();
      el.empty();
      assert.equal(el.get(0).innerHTML, '');
      assert.equal(el.get(1).innerHTML, '');
      return assert.equal(el.get(2).innerHTML, '');
    });
    test('append', function() {
      var contents, div;
      div = makeElement('div', '<span>1</span>');
      contents = '<p>Hello</p>';
      $(div).append(contents);
      assert.lengthOf(div.childNodes, 2);
      assert.equal(div.getElementsByTagName('p')[0].textContent, 'Hello');
      return assert.equal(div.getElementsByTagName('*')[1].tagName, 'P');
    });
    test('append element', function() {
      var el;
      el = makeElement('p', 'test', {
        className: 'test-append-element'
      });
      $('#test').append(el);
      assert.lengthOf($('#test .test-append-element'), 1);
      assert.equal($('#test .content').next().get(0), el);
      return assert.equal($('#test p').get(-1), el);
    });
    test('append element to elements', function() {
      var el, list;
      el = makeElement('p', 'test', {
        className: 'test-append-element'
      });
      list = list_items();
      list.append(el);
      return assert.lengthOf(list.find('.test-append-element'), 3);
    });
    test('prepend', function() {
      var contents, div;
      div = makeElement('div', '<span>2</span>');
      contents = '<p>Hello</p>';
      $(div).prepend(contents);
      assert.lengthOf(div.childNodes, 2);
      assert.equal(div.getElementsByTagName('p')[0].textContent, 'Hello');
      return assert.equal(div.getElementsByTagName('*')[0].tagName, 'P');
    });
    test('prepend element', function() {
      var el;
      el = makeElement('p', 'test', {
        className: 'test-prepend-element'
      });
      $('#test').prepend(el);
      assert.lengthOf($('#test .test-prepend-element'), 1);
      return assert.equal($('#test p').get(0), el);
    });
    test('prepend to a collection', function() {
      var el, list;
      el = makeElement('p', 'test', {
        className: 'test-append-element'
      });
      list = list_items();
      list.prepend(el);
      return assert.lengthOf(list.find('.test-append-element'), 3);
    });
    test('prepend to empty', function() {
      var el, item;
      el = makeElement('p', 'test', {
        className: 'test-prepend-element'
      });
      item = list_items().filter('.a');
      item.prepend(el);
      return assert.lengthOf(item.children(), 1);
    });
    test('after with html', function() {
      var el, found;
      el = $('#hello');
      el.after('<div id="after"></div>');
      found = $('#after');
      return assert.equal(el.next().get(0), found.get(0));
    });
    test('after with element', function() {
      var div, el, found, li;
      el = $('#hello');
      div = makeElement('div', null, {
        id: 'after-element'
      });
      el.after(div);
      found = $('#after-element');
      assert.equal(el.next().get(0), found.get(0));
      el = $('.list .c');
      li = makeElement('li', null, {
        id: 'after-element'
      });
      el.after(li);
      assert.equal(el.next().get(0), li);
      return assert.equal($('.list li').last().get(0), li);
    });
    test('after to collection', function() {
      var li, list;
      list = list_items();
      li = makeElement('li', null, {
        "class": 'after-element'
      });
      list.after(li);
      return assert.equal(list_items().length, 6);
    });
    test('before with html', function() {
      var el, found;
      el = $('#hello');
      el.before('<div id="before"></div>');
      found = $('#before');
      return assert.equal(el.prev().get(0), found.get(0));
    });
    test('before with element', function() {
      var div, el, found;
      el = $('#hello');
      div = makeElement('div', null, {
        id: 'before-element'
      });
      el.before(div);
      found = $('#before-element');
      return assert.equal(el.prev().get(0), found.get(0));
    });
    test('before to collection', function() {
      var li, list;
      list = list_items();
      li = makeElement('li', null, {
        "class": 'before-element'
      });
      list.before(li);
      return assert.equal(list_items().length, 6);
    });
    test('clone', function() {
      var cloned, div, el;
      div = makeElement('div', 'content');
      el = $(div);
      cloned = el.clone();
      assert.notEqual(cloned.get(0), el.get(0));
      return assert.equal(cloned.html(), el.html());
    });
    test('set val', function() {
      var div, el, input;
      input = makeElement('input', '', {
        value: 'foo'
      });
      el = $(input).val('bar');
      assert.equal(input.value, 'bar');
      div = makeElement('div', '<select><option value="foo">f</option><option value="bar">b</option></select>');
      el = $(div).children().val('bar');
      return assert.isTrue(el.find('option').get(1).selected);
    });
    test('get val', function() {
      var div, input;
      input = makeElement('input', '', {
        value: 'foo'
      });
      assert.equal($(input).val(), 'foo');
      div = makeElement('div', '<select><option value="foo">f</option><option value="bar" selected>b</option></select>');
      assert.equal($(div).find('select').val(), 'bar');
      div = makeElement('div', '<select multiple><option value="foo" selected>f</option><option value="bar" selected>b</option><option value="fizz" disabled selected>f</option></select>');
      return assert.deepEqual($(div).find('select').val(), ['foo', 'bar']);
    });
    test('get attr', function() {
      var el, input;
      input = document.createElement('input');
      input.title = 'title';
      input.value = 'value';
      el = $(input);
      assert.equal(el.attr('title'), 'title');
      return assert.equal(el.attr('value'), 'value');
    });
    test('set attr', function() {
      var el, input;
      input = document.createElement('input');
      el = $(input);
      el.attr('value', 'value');
      assert.equal(input.value, 'value');
      el.attr({
        'title': 'title'
      });
      assert.equal(input.getAttribute('title'), 'title');
      el.attr({
        'title': ''
      });
      return assert.equal(input.getAttribute('title'), '');
    });
    test('get prop', function() {
      var el, input;
      input = document.createElement('input');
      input.title = 'title';
      el = $(input);
      return assert.equal(el.prop('title'), 'title');
    });
    return test('set prop', function() {
      var el, input;
      input = document.createElement('input');
      el = $(input);
      el.prop('title', 'title');
      assert.equal(input.title, 'title');
      el.prop({
        'title': 'title'
      });
      assert.equal(input.title, 'title');
      el.prop({
        'title': ''
      });
      return assert.equal(input.title, '');
    });
  });

}).call(this);

(function() {

  suite('Querying', function() {
    test('ID query', function() {
      var el;
      el = $('#hello');
      assert.lengthOf(el, 1);
      assert(el.length === 1, "Has one element");
      el = $('#no-exists');
      return assert.lengthOf(el, 0, "It has no elements");
    });
    test('class query', function() {
      var el;
      el = $('.a');
      return assert.lengthOf(el, 1, "Has one element");
    });
    test('tag query', function() {
      var el;
      el = $('section');
      assert.lengthOf(el, 1, "Has one element");
      return assert(el.get(0).tagName === 'SECTION', "Tag matches");
    });
    test('complex query', function() {
      var el;
      el = $('section#test .list .b');
      return assert.lengthOf(el, 1, "It has one element");
    });
    test('multiple results', function() {
      var el;
      el = $('#test li');
      return assert.lengthOf(el, 3, "It has 3 elements");
    });
    test('matches error', function() {
      var el;
      el = $();
      el.elements = [{}];
      el._update();
      return assert.lengthOf(el.filter(), 0, "matches filter only elements");
    });
    return test('matches fallback', function() {
      var el, filter_all, filter_div, filter_foo, filter_null, foo, parent, util, _prefix;
      util = $.require('Util');
      (parent = document.createElement('div')).innerHTML = "<div class=\"foo\"></div>\n<div></div>";
      parent.id = 'matches-fallback';
      el = $(parent);
      _prefix = util.prefix;
      util.prefix = function() {
        return false;
      };
      filter_div = el.filter('div');
      assert.lengthOf(filter_div, 1);
      assert.deepEqual(filter_div.elements, [parent]);
      filter_foo = el.children().filter('.foo');
      foo = parent.getElementsByClassName('foo')[0];
      assert.lengthOf(filter_foo, 1);
      assert.deepEqual(filter_foo.elements, [foo]);
      filter_null = el.filter('batata');
      assert.lengthOf(filter_null, 0);
      filter_all = el.children().filter('*');
      assert.lengthOf(filter_all, 2);
      assert.equal(filter_all.get(0), foo);
      return util.prefix = _prefix;
    });
  });

  suite('Traversal methods', function() {
    test('find', function() {
      var all, list;
      all = $('*');
      list = all.find('.list li');
      return assert.deepEqual(list.get(), list_items().get(), "Gets the list items");
    });
    test('find in one', function() {
      var doc, list;
      doc = $(document);
      list = doc.find('.list li');
      return assert.deepEqual(list.get(), list_items().get(), "Gets the list items");
    });
    test('filter', function() {
      var all, list, nothing;
      all = $('*');
      list = all.filter('.list li');
      assert.deepEqual(list.get(), list_items().get(), "Filter the list items");
      nothing = all.filter('.nothing-with-this');
      assert.equal(nothing.length, 0, "Filter should returns nothing");
      return assert.deepEqual(all, $('*'), "Doesnt affect the original");
    });
    test('filter function', function() {
      var el, list;
      list = list_items();
      el = list.filter(function(item, index) {
        return item.className !== 'a';
      });
      return assert.deepEqual(el.elements, $('.b, .c').elements, "Keeps .a and .b element");
    });
    test('filter not', function() {
      var filtered, list;
      list = list_items();
      filtered = list.filter('!.a');
      assert.equal(filtered.length, 2, "Removes .a element");
      return assert.deepEqual(filtered.pluck('className'), ['b', 'c']);
    });
    test('contains', function() {
      var list, lists;
      lists = $('ul');
      list = lists.contains('.a');
      assert.deepEqual(list.elements, $('.list').elements);
      lists = $('ul');
      list = lists.contains('.list');
      return assert.lengthOf(list.elements, 0);
    });
    test('is', function() {
      var all, doc, list;
      doc = $(document);
      assert.isTrue(doc.is(document), "Document is document");
      list = list_items();
      assert.isTrue(list.is('li'), "Filter the list items");
      all = $('*');
      return assert.isTrue(all.is(list_items()), "Filter the list items with Rye instance");
    });
    test('index', function() {
      var el;
      el = list_items().filter('.b');
      assert.equal(el.index(), 1);
      el = list_items();
      return assert.equal(el.index('.list li.b'), 1);
    });
    test('not element', function() {
      var doc, el;
      doc = $(document);
      assert.lengthOf(doc.not(document), 0);
      el = $('#hello');
      return assert.lengthOf(el.not(el.elements[0]), 0);
    });
    test('not rye', function() {
      var list;
      list = list_items();
      return assert.equal(list.not($('.a')).length, 2, "Removes Rye .a element");
    });
    test('not function', function() {
      var el, list;
      list = list_items();
      el = list.not(function(item, index) {
        return item.className !== 'a';
      });
      return assert.equal(el.get(0), $('.a').get(0), "Keeps .a element");
    });
    test('add multiple (Rye)', function() {
      var list, list2, list3;
      list = list_items();
      list2 = list_items();
      list3 = list.add(list2);
      assert(list3.length === 3, "List length shouldn't change");
      return assert.deepEqual(list3.pluck('className'), ['a', 'b', 'c'], "Elements are the same");
    });
    test('add multiple (Array)', function() {
      var list, list2, list3;
      list = list_items();
      list2 = list_items().get();
      list3 = list.add(list2);
      assert(list3.length === 3, "List length shouldn't change");
      return assert.deepEqual(list3.pluck('className'), ['a', 'b', 'c'], "Elements are the same");
    });
    test('add single item', function() {
      var div, list, list3;
      list = list_items();
      div = document.createElement('div');
      list3 = list.add(div);
      assert(list3.length === 4, "Has four items");
      assert.deepEqual(list3.pluck('className'), ['a', 'b', 'c', ''], "Classes match");
      return assert(list3.get(3) === div, "Element was appended to the list");
    });
    test('add invalid item', function() {
      var list, list3;
      list = list_items();
      list3 = list.add('bacon');
      assert(list3.length === 3, "Length didn't change");
      return assert.deepEqual(list3.pluck('className'), ['a', 'b', 'c'], "Classes match");
    });
    test('pluck node', function() {
      var first, list, second;
      list = list_items();
      first = $(list.get(0));
      second = $(first.pluckNode('nextSibling'));
      return assert.equal(second.get(0), list.get(1), "Walks to second element");
    });
    test('pluck', function() {
      var obj;
      obj = $();
      obj.elements[0] = {
        fizz: 'buzz'
      };
      obj._update();
      return assert.deepEqual(obj.pluck('fizz'), ['buzz'], "Plucks elements properties");
    });
    test('next', function() {
      var el;
      el = $('.a').next();
      assert(el.length === 1, "One element found");
      return assert(el.get(0).className === 'b', "Next element is .b");
    });
    test('prev', function() {
      var el;
      el = $('.c').prev();
      assert(el.length === 1, "One element found");
      return assert(el.get(0).className === 'b', "Previous element is .b");
    });
    test('first', function() {
      var first;
      first = list_items().first();
      assert(first.length === 1, "One element found");
      return assert(first.get(0).className === 'a', "first() is .a");
    });
    test('last', function() {
      var last;
      last = list_items().last();
      assert(last.length === 1, "One element found");
      return assert(last.get(0).className === 'c', "last() is .c");
    });
    test('siblings', function() {
      var list, siblings;
      list = list_items();
      siblings = list.eq(1).siblings();
      assert(siblings.length === 2, "Two siblings");
      return assert.deepEqual(siblings.get().map(function(el) {
        return el.className;
      }), ['a', 'c']);
    });
    test('parent', function() {
      var el;
      el = $('.a').parent();
      assert(el.length === 1, "One element found");
      return assert(el.get(0).className === 'list', "Parent is .list");
    });
    test('parents', function() {
      var els;
      els = $('.a').parents();
      assert.isTrue(els.is('ul'), "Ul element found");
      return assert.isTrue(els.is('body'), "Body always found");
    });
    test('closest', function() {
      var closest, el;
      el = $('.a');
      closest = el.closest('ul');
      assert.lengthOf(closest, 1);
      assert.equal(closest.get(0).className, 'list');
      el = $('.a');
      closest = el.closest('.a');
      assert.lengthOf(closest, 1);
      assert.equal(closest.get(0).className, 'a');
      closest = el.closest('section#test');
      assert.lengthOf(closest, 1);
      assert.equal(closest.get(0).id, 'test');
      closest = el.closest('html');
      assert.lengthOf(closest, 1);
      assert.equal(closest.get(0), document.documentElement);
      closest = el.closest('bacon');
      return assert.lengthOf(closest, 0);
    });
    return test('children', function() {
      var list;
      list = $('.list').children();
      return assert.deepEqual(list.elements, list_items().elements, "Ul element found");
    });
  });

}).call(this);

(function() {

  suite('Request (slow)', function() {
    test('get request', function(done) {
      var countdown, obj, query;
      countdown = new Number.Countdown(4, done);
      obj = {
        fizz: 1,
        bar: 2
      };
      query = request.query(obj);
      request('/echo', function(err, data) {
        assert.equal(this.method, 'GET');
        assert.equal(data, 'get no data');
        return countdown.fire();
      });
      request({
        url: '/echo',
        method: 'get',
        data: obj,
        callback: function(err, data) {
          assert.deepEqual(this.data, query);
          assert.equal(data, 'get 2');
          return countdown.fire();
        }
      });
      request({
        url: '/echo',
        method: 'get',
        data: query,
        callback: function(err, data) {
          assert.deepEqual(this.data, query);
          assert.equal(data, 'get 2');
          return countdown.fire();
        }
      });
      return request.get({
        url: '/echo',
        data: obj,
        callback: function(err, data) {
          assert.equal(data, 'get 2');
          return countdown.fire();
        }
      });
    });
    test('post request', function(done) {
      var countdown, obj, query;
      countdown = new Number.Countdown(3, done);
      obj = {
        fizz: 1,
        bar: 2
      };
      query = request.query(obj);
      request({
        url: '/echo',
        method: 'post'
      }, function(err, data) {
        assert.equal(this.method, 'POST');
        assert.equal(data, 'post no data');
        return countdown.fire();
      });
      request({
        url: '/echo',
        method: 'post',
        data: obj
      }, function(err, data) {
        assert.deepEqual(this.data, query);
        assert.equal(data, 'post 2');
        return countdown.fire();
      });
      return request.post({
        url: '/echo',
        data: obj
      }, function(err, data) {
        assert.equal(data, 'post 2');
        return countdown.fire();
      });
    });
    test('async', function(done) {
      var countdown;
      countdown = new Number.Countdown(2, done);
      request.get('/echo', function(err, data) {
        assert.isTrue(this.async);
        return countdown.fire();
      });
      return request.get({
        url: '/echo',
        async: false
      }, function(err, data) {
        assert.isFalse(this.async);
        return countdown.fire();
      });
    });
    test('accept json', function(done) {
      return request({
        url: '/accept?json',
        responseType: 'json'
      }, function(err, data) {
        assert.equal(this.type, 'json');
        assert.deepEqual(data, {
          json: 'ok'
        });
        return done();
      });
    });
    test('accept xml', function(done) {
      return request({
        url: '/accept?xml',
        responseType: 'xml'
      }, function(err, data) {
        assert.equal(this.type, 'xml');
        assert.equal(data.documentElement.textContent, 'ok');
        return done();
      });
    });
    test('accept html', function(done) {
      return request({
        url: '/accept?html',
        responseType: 'html'
      }, function(err, data) {
        assert.equal(this.type, 'html');
        assert.equal(data, 'html ok');
        return done();
      });
    });
    test('accept text', function(done) {
      return request({
        url: '/accept?text',
        responseType: 'text'
      }, function(err, data) {
        assert.equal(this.type, 'text');
        assert.equal(data, 'text ok');
        return done();
      });
    });
    test('timeout', function(done) {
      return request({
        url: '/sleep?' + Date.now(),
        timeout: '1'
      }, function(err, data) {
        assert.instanceOf(err, Error);
        return done();
      });
    });
    test('parse error', function(done) {
      return request({
        url: '/echo',
        responseType: 'json'
      }, function(err, data) {
        assert.instanceOf(err, Error);
        return done();
      });
    });
    test('sended content type', function(done) {
      var countdown;
      countdown = new Number.Countdown(2, done);
      request({
        url: '/content',
        method: 'post'
      }, function(err, data) {
        assert.equal(data, 'content type application/x-www-form-urlencoded');
        return countdown.fire();
      });
      return request({
        url: '/content'
      }, function(err, data) {
        assert.equal(data, 'content type undefined');
        return countdown.fire();
      });
    });
    test('status', function(done) {
      var countdown;
      countdown = new Number.Countdown(2, done);
      request({
        url: '/status?status=200'
      }, function(err, data, xhr) {
        assert.equal(xhr.status, 200);
        return countdown.fire();
      });
      request({
        url: '/status?status=500'
      }, function(err, data, xhr) {
        assert.equal(xhr.status, 500);
        assert.equal(err.message, 'Request failed');
        return countdown.fire();
      });
      request({
        url: '/status?status=400'
      }, function(err, data, xhr) {
        assert.equal(xhr.status, 400);
        assert.equal(err.message, 'Request failed');
        return countdown.fire();
      });
      return request({
        url: '/status?status=304'
      }, function(err, data, xhr) {
        assert.equal(xhr.status, 304);
        return countdown.fire();
      });
    });
    test('appendQuery', function() {
      assert.equal(request.appendQuery('url', 'par=1'), 'url?par=1');
      assert.equal(request.appendQuery('url?par=1', 'bar=2'), 'url?par=1&bar=2');
      return assert.equal(request.appendQuery('??', '?par=1'), '?par=1');
    });
    test('query', function() {
      assert.equal(request.query({
        foo: {
          one: 1,
          two: 2
        }
      }), escape('foo[one]=1&foo[two]=2'));
      assert.equal(request.query({
        ids: [1, 2, 3]
      }), escape('ids[]=1&ids[]=2&ids[]=3'));
      return assert.equal(request.query({
        foo: 'bar',
        nested: {
          will: 'not be ignored'
        }
      }), escape('foo=bar&nested[will]=not+be+ignored'));
    });
    test('form query', function() {
      var form, query;
      form = makeElement('form', "<input name=\"email\" value=\"koss@nocorp.me\">\n<input name=\"password\" value=\"123456\">\n<input name=\"ops\" value=\"123456\" disabled>\n<input name=\"unchecked_hasValue\" value=\"myValue\" type=\"checkbox\">\n<input name=\"unchecked_noValue\" type=\"checkbox\">\n<input name=\"checked_hasValue\" checked value=\"myValue\" type=\"checkbox\">\n<input name=\"checked_disabled\" checked value=\"ImDisabled\" type=\"checkbox\" disabled>\n<input name=\"checked_noValue\" checked type=\"checkbox\">\n\n<fieldset>\n  <input type=\"radio\" name=\"radio1\" value=\"r1\">\n  <input type=\"radio\" name=\"radio1\" checked value=\"r2\">\n  <input type=\"radio\" name=\"radio1\" value=\"r3\">\n</fieldset>\n\n<textarea name=\"textarea\">text</textarea>\n\n<select name=\"selectbox\">\n    <option value=\"selectopt1\">select1</option>\n    <option value=\"selectopt2\">select2</option>\n    <option value=\"selectopt3\">select3</option>\n</select>\n\n<select name=\"selectbox-multiple\" multiple>\n    <option value=\"selectopt1\" selected>select1</option>\n    <option value=\"selectopt2\">select2</option>\n    <option value=\"selectopt3\" selected>select3</option>\n</select>\n\n<div class=\"actions\">\n  <input type=\"submit\" name=\"submit\" value=\"Save\">\n  <input type=\"button\" name=\"preview\" value=\"Preview\">\n  <input type=\"reset\" name=\"clear\" value=\"Clear form\">\n  <button name=\"button\">I'm a button</button>\n</div>");
      query = $(form).query();
      query = query.split('&').sort().join('&');
      return assert.equal(query, 'checked_hasValue=myValue&checked_noValue=on&email=koss%40nocorp.me&password=123456&radio1=r2&selectbox-multiple%5B%5D=selectopt1&selectbox-multiple%5B%5D=selectopt3&selectbox=selectopt1&textarea=text');
    });
    return test('Rye', function(done) {
      var countdown;
      countdown = new Number.Countdown(3, done);
      $.request('/echo', function(err, data) {
        assert.equal(this.method, 'GET');
        assert.equal(data, 'get no data');
        return countdown.fire();
      });
      $.get('/echo', function(err, data) {
        assert.equal(this.method, 'GET');
        assert.equal(data, 'get no data');
        return countdown.fire();
      });
      return $.post('/echo', function(err, data) {
        assert.equal(this.method, 'POST');
        assert.equal(data, 'post no data');
        return countdown.fire();
      });
    });
  });

}).call(this);

(function() {

  suite('Constructor', function() {
    test('Rye()', function() {
      return assert.instanceOf($('div'), Rye, "$() returns instance of Rye");
    });
    test('call without arguments', function() {
      var obj;
      obj = $();
      assert.instanceOf(obj, Rye);
      return assert.lengthOf(obj, 0);
    });
    test('call with null', function() {
      var obj;
      obj = $(null);
      assert.instanceOf(obj, Rye);
      return assert.lengthOf(obj, 0);
    });
    test('call with undefined', function() {
      var obj;
      obj = $(void 0);
      assert.instanceOf(obj, Rye);
      return assert.lengthOf(obj, 0);
    });
    test('call with empty array', function() {
      var obj;
      obj = $([]);
      assert.instanceOf(obj, Rye);
      return assert.lengthOf(obj, 0);
    });
    test('call with invalid array', function() {
      var obj;
      obj = $([1, 2, 3]);
      assert.instanceOf(obj, Rye);
      assert.lengthOf(obj, 0);
      obj = $([[1], [2]]);
      assert.instanceOf(obj, Rye);
      return assert.lengthOf(obj, 0);
    });
    test('call with nodelist', function() {
      var obj;
      obj = $(document.querySelectorAll('.list li'));
      assert.instanceOf(obj, Rye);
      return assert.lengthOf(obj, 3);
    });
    return test('call with document', function() {
      var obj;
      obj = $(document);
      assert.instanceOf(obj, Rye);
      return assert.lengthOf(obj, 1);
    });
  });

}).call(this);

(function() {

  suite('Style', function() {
    var getClass;
    test('getCSS', function() {
      var div, test;
      div = document.createElement('div');
      div.style.marginLeft = '2px';
      assert.equal(style.getCSS(div, 'margin-left'), '2px');
      test = document.getElementById('test');
      return assert.equal(style.getCSS(test, 'position'), 'absolute');
    });
    test('setCSS', function() {
      var div;
      div = document.createElement('div');
      style.setCSS(div, 'margin-left', 2);
      assert.equal(div.style.marginLeft, '2px');
      style.setCSS(div, 'opacity', 0.2);
      assert.equal(div.style.opacity, '0.2');
      style.setCSS(div, 'opacity', '');
      style.setCSS(div, 'margin-left', '');
      return assert.isFalse(!!div.getAttribute('style'));
    });
    test('setCSS - to remove', function() {
      var div;
      div = document.createElement('div');
      style.setCSS(div, 'margin-left', 2);
      style.setCSS(div, 'margin', null);
      assert.isFalse(!!div.getAttribute('style'));
      style.setCSS(div, 'margin-left', 2);
      style.setCSS(div, 'margin', '');
      return assert.isFalse(!!div.getAttribute('style'));
    });
    test('get css', function() {
      var div, el;
      div = document.createElement('div');
      div.style.marginLeft = '2px';
      el = $(div);
      return assert.equal(el.css('margin-left'), '2px');
    });
    test('set css', function() {
      var div, el;
      div = document.createElement('div');
      el = $(div);
      el.css('margin-left', 2);
      assert.equal(div.style.marginLeft, '2px');
      el.css({
        'margin-right': 3
      });
      assert.equal(div.style.marginRight, '3px');
      el.css({
        'margin': ''
      });
      return assert.isFalse(!!div.getAttribute('style'));
    });
    test('show/hide', function() {
      var el;
      el = $('#test');
      el.hide();
      assert.equal(el.get(0).style.display, 'none', "Display set to none");
      el.show();
      return assert.equal(el.get(0).style.display, 'block', "Display set to block");
    });
    test('show/hide returns Rye', function() {
      var el;
      el = $('#test');
      assert.equal(el.hide(), el);
      return assert.equal(el.show(), el);
    });
    test('show/hide preserves display', function() {
      var el;
      el = $('.a');
      el.get(0).style.display = 'inline';
      el.hide();
      el.show();
      return assert.equal(el.get(0).style.display, 'inline', "Display property is preserved");
    });
    test('hasClass', function() {
      var el;
      el = $('.a');
      assert.isTrue(el.hasClass('a'));
      return assert.isFalse(el.hasClass('b'));
    });
    test('hasClass fallback', function() {
      var el;
      el = $([]);
      el.elements.push({
        className: ' a b'
      });
      assert.isTrue(el.hasClass('a'));
      return assert.isFalse(el.hasClass('c'));
    });
    getClass = function(el) {
      return el.get(0).className.trim().split(/\s+/);
    };
    test('addClass', function() {
      var el;
      el = $('.a');
      el.addClass('b');
      assert.deepEqual(getClass(el), ['a', 'b']);
      el.addClass(' c d ');
      assert.deepEqual(getClass(el), ['a', 'b', 'c', 'd']);
      el.addClass('a');
      assert.deepEqual(getClass(el), ['a', 'b', 'c', 'd']);
      el.addClass('with-a');
      assert.deepEqual(getClass(el), ['a', 'b', 'c', 'd', 'with-a']);
      el = $(document.createElement('div'));
      el.addClass('with-a');
      return assert.deepEqual(getClass(el), ['with-a']);
    });
    test('addClass fallback', function() {
      var el;
      el = $([]);
      el.elements.push({
        className: ' a b'
      });
      el._update();
      el.addClass('   a c');
      return assert.deepEqual(getClass(el), ['a', 'b', 'c']);
    });
    test('removeClass', function() {
      var div, el;
      div = document.createElement('div');
      el = $(div);
      div.className = '  a b   c ';
      el.removeClass('a');
      assert.deepEqual(getClass(el), ['b', 'c'], "Class .a removed");
      el.removeClass('b w');
      return assert.deepEqual(getClass(el), ['c'], "Class .b removed, .w ignored");
    });
    test('removeClass all', function() {
      var div, el;
      div = document.createElement('div');
      el = $(div);
      div.className = '  a b   c ';
      el.removeClass('*');
      assert.equal(div.className, '', "All classes removed with *");
      div.className = '  a b   c ';
      el.removeClass(/.*/);
      return assert.equal(div.className, '', "All classes removed with /.*/");
    });
    test('removeClass *', function() {
      var div, el;
      div = document.createElement('div');
      el = $(div);
      div.className = '  class-a class-b   class-c ';
      el.removeClass('class-*');
      assert.equal(div.className, '');
      div.className = '  class-a b   class-c ';
      el.removeClass('class-*');
      return assert.deepEqual(getClass(el), ['b']);
    });
    test('removeClass regexp', function() {
      var div, el;
      div = document.createElement('div');
      el = $(div);
      div.className = '  class-a class-b   class-c ';
      el.removeClass(/\bclass-\S\b/);
      assert.deepEqual(getClass(el), ['class-b', 'class-c']);
      div.className = '  class-a class-b   class-c ops';
      el.removeClass(/\bclass-\S\b/g);
      return assert.deepEqual(getClass(el), ['ops']);
    });
    test('removeClass mix', function() {
      var div, el;
      div = document.createElement('div');
      el = $(div);
      div.className = '  class-a class-b   class-c a b c';
      el.removeClass('class-* b');
      return assert.deepEqual(getClass(el), ['a', 'c']);
    });
    test('removeClass fallback', function() {
      var el;
      el = $([]);
      el.elements.push({
        className: ' a b  '
      });
      el._update();
      el.removeClass('  b d');
      return assert.deepEqual(getClass(el), ['a'], "Class .b removed, .d ignored");
    });
    test('toggleClass', function() {
      var div, el;
      div = document.createElement('div');
      el = $(div);
      div.className = '  a b   c ';
      el.toggleClass('a');
      assert.deepEqual(getClass(el), ['b', 'c'], "Class .a removed");
      el.toggleClass('a');
      return assert.deepEqual(getClass(el), ['b', 'c', 'a'], "Class .a added");
    });
    return test('toggleClass forced', function() {
      var div, el;
      div = document.createElement('div');
      el = $(div);
      div.className = '  a b   c ';
      el.toggleClass('a', true);
      assert.deepEqual(getClass(el), ['a', 'b', 'c'], "Nothing happens");
      el.toggleClass('d', false);
      assert.deepEqual(getClass(el), ['a', 'b', 'c'], "Nothing happens");
      el.toggleClass('d', true);
      return assert.deepEqual(getClass(el), ['a', 'b', 'c', 'd'], "Class .d added");
    });
  });

}).call(this);

(function() {

  suite('TouchEvents (slow)', function() {
    test('tap', function(done) {
      var counter, element;
      element = $('.a').get(0);
      counter = new Number.Counter;
      events.addListener(element, 'tap', counter.step);
      down(element, 10, 10);
      up(element);
      return setTimeout(function() {
        assert.equal(counter, 1);
        events.removeListener(element, '*');
        return done();
      }, 0);
    });
    test('tap textnode', function(done) {
      var counter, element, text;
      element = $('.a').get(0);
      text = element.childNodes[0];
      counter = new Number.Counter;
      events.addListener(element, 'tap', function(event) {
        assert.equal(event.target, element);
        events.removeListener(element, '*');
        return counter.step();
      });
      down(text, 10, 10);
      up(text);
      return setTimeout(function() {
        return done();
      }, 0);
    });
    test('tap twice', function(done) {
      var counter, element;
      element = $('.a').get(0);
      counter = new Number.Counter;
      events.addListener(element, 'tap', counter.step);
      down(element, 10, 10);
      up(element);
      return setTimeout(function() {
        down(element, 10, 10);
        up(element);
        return setTimeout(function() {
          assert.equal(counter, 2);
          events.removeListener(element, '*');
          return done();
        }, 0);
      }, 200);
    });
    test('single tap', function(done) {
      var counterDouble, counterSingle, element;
      element = $('.a').get(0);
      counterSingle = new Number.Counter;
      counterDouble = new Number.Counter;
      events.addListener(element, 'singletap', counterSingle.step);
      events.addListener(element, 'doubletap', counterDouble.step);
      down(element, 10, 10);
      up(element);
      return setTimeout(function() {
        assert.equal(counterSingle, 1);
        assert.equal(counterDouble, 0);
        events.removeListener(element, '*');
        return done();
      }, 300);
    });
    test('double tap', function(done) {
      var counterDouble, counterSingle, element;
      element = $('.a').get(0);
      counterSingle = new Number.Counter;
      counterDouble = new Number.Counter;
      events.addListener(element, 'singletap', counterSingle.step);
      events.addListener(element, 'doubletap', counterDouble.step);
      down(element, 10, 10);
      up(element);
      return setTimeout(function() {
        down(element, 12, 12);
        up(element);
        return setTimeout(function() {
          assert.equal(counterSingle, 0);
          assert.equal(counterDouble, 1);
          events.removeListener(element, '*');
          return done();
        }, 100);
      }, 100);
    });
    test('long tap', function(done) {
      var counter, element;
      element = $('.a').get(0);
      counter = new Number.Counter;
      events.addListener(element, 'longtap', counter.step);
      down(element, 10, 10);
      return setTimeout(function() {
        up(element);
        assert.equal(counter, 1);
        events.removeListener(element, '*');
        return done();
      }, 900);
    });
    test('a move cancels long tap', function(done) {
      var counter, element;
      element = $('.a').get(0);
      counter = new Number.Counter;
      events.addListener(element, 'longtap', counter.step);
      down(element, 10, 10);
      return setTimeout(function() {
        move(element, 50, 10);
        return setTimeout(function() {
          up(element);
          assert.equal(counter, 0);
          events.removeListener(element, '*');
          return done();
        }, 450);
      }, 450);
    });
    test('swipe', function(done) {
      var counter, element;
      element = $('.a').get(0);
      counter = new Number.Counter;
      events.addListener(element, 'swipe', counter.step);
      down(element, 10, 10);
      return setTimeout(function() {
        move(element, 70, 10);
        up(element);
        return setTimeout(function() {
          assert.equal(counter, 1);
          events.removeListener(element, '*');
          return done();
        }, 0);
      }, 50);
    });
    [['left', 0, 50], ['right', 100, 50], ['up', 50, 0], ['down', 50, 100]].forEach(function(_arg) {
      var direction, x, y;
      direction = _arg[0], x = _arg[1], y = _arg[2];
      return test("swipe " + direction, function(done) {
        var counter, element;
        element = $('.a').get(0);
        counter = new Number.Counter;
        events.addListener(element, "swipe" + direction, counter.step);
        down(element, 50, 50);
        return setTimeout(function() {
          move(element, x, y);
          up(element);
          return setTimeout(function() {
            assert.equal(counter, 1);
            events.removeListener(element, '*');
            return done();
          }, 0);
        }, 50);
      });
    });
    return test('cancel', function(done) {
      var counter, element;
      element = $('.a').get(0);
      counter = new Number.Counter;
      events.addListener(element, 'swipe', counter.step);
      down(element, 10, 10);
      return setTimeout(function() {
        move(element, 70, 10);
        fire('cancel', element);
        up(element);
        return setTimeout(function() {
          assert.equal(counter, 0);
          events.removeListener(element, '*');
          return done();
        }, 0);
      }, 50);
    });
  });

}).call(this);

(function() {

  suite('Util', function() {
    test('each', function() {
      var array, obj;
      obj = {
        key: 'value'
      };
      util.each(obj, function(value, key) {
        return assert.deepEqual([value, key], ['value', 'key']);
      });
      array = ['value'];
      return util.each(array, function(value, key) {
        return assert.deepEqual([value, key], ['value', '0']);
      });
    });
    test('extend', function() {
      var one, two;
      one = {
        one: 1
      };
      two = util.extend(one, {
        two: 2
      });
      return assert.deepEqual(two, {
        one: 1,
        two: 2
      });
    });
    test('inherits', function() {
      var Bacon, Meat, obj;
      Meat = (function() {

        function Meat() {}

        Meat.prototype.barbecue = true;

        Meat.prototype.hello = function() {
          return 'hi';
        };

        return Meat;

      })();
      Bacon = (function() {

        function Bacon() {}

        return Bacon;

      })();
      util.inherits(Bacon, Meat);
      obj = new Bacon;
      assert.equal(obj.barbecue, true);
      assert.instanceOf(obj.hello, Function);
      return assert.equal(obj.hello(), 'hi');
    });
    test('isElement', function() {
      var comment, div, fragment;
      assert.isFalse(util.isElement(false), "False isnt element");
      div = document.createElement('div');
      assert.isTrue(util.isElement(div), "DIV is element");
      comment = document.createComment('hi');
      assert.isFalse(util.isElement(comment), "Comment isnt element");
      fragment = document.createDocumentFragment('div');
      return assert.isFalse(util.isElement(fragment), "Fragment isnt element");
    });
    test('isNodeList', function() {
      var collection, div, qsa;
      assert.isFalse(util.isNodeList(false), "False isnt node list");
      qsa = document.querySelectorAll('nothing');
      assert.isTrue(util.isNodeList(qsa), "Query querySelectorAll result is node list");
      collection = document.body.children;
      assert.isTrue(util.isNodeList(collection), "Childrens are node list");
      div = document.createElement('div');
      return assert.isTrue(util.isElement(div), "Element isnt node list");
    });
    test('unique', function() {
      var array;
      assert.deepEqual(util.unique([]), [], "Empty array");
      array = [1, 2, 3, 1];
      assert.deepEqual(util.unique(array), [1, 2, 3], "Simple case");
      assert.deepEqual(array, [1, 2, 3, 1], "Preserve source");
      return assert.deepEqual(util.unique([0, null, false, void 0]), [0, null, false, void 0], "Filter falsy values");
    });
    test('pluck', function() {
      var array;
      array = [
        {
          prop: 1,
          another: 3
        }, {
          prop: 2,
          another: 4
        }
      ];
      return assert.deepEqual(util.pluck(array, 'prop'), [1, 2], "Get prop property of objects");
    });
    test('put', function() {
      var arr;
      arr = [
        {
          id: 1
        }, {
          id: 2
        }
      ];
      util.put(arr, 'loco', true);
      return assert.deepEqual(util.pluck(arr, 'loco'), [true, true]);
    });
    test('prefix', function() {
      var context;
      assert.strictEqual(util.prefix('document'), document, "find unprefixed object");
      context = {
        mozBacon: function() {}
      };
      return assert.strictEqual(util.prefix('bacon', context), context.mozBacon, "find prefixed object");
    });
    test('applier right', function() {
      var context, fn;
      context = {};
      fn = function(a, b, c) {
        assert.equal(this, context);
        return assert.deepEqual([a, b, c], ['call1', 'call2', 'apply']);
      };
      util.applier('right', fn, context, ['apply'])('call1', 'call2');
      return util.applier('right', fn, context, ['apply'])('call1', 'call2');
    });
    test('applier left', function() {
      var context, fn;
      context = {};
      fn = function(a, b, c) {
        assert.equal(this, context);
        return assert.deepEqual([a, b, c], ['apply', 'call1', 'call2']);
      };
      util.applier('left', fn, context, ['apply'])('call1', 'call2');
      return util.applier('left', fn, context, ['apply'])('call1', 'call2');
    });
    test('curry', function() {
      var fn;
      fn = function(a, b, c) {
        assert.equal(this, util);
        return assert.deepEqual([a, b, c], ['apply1', 'apply2', 'call1']);
      };
      util.curry(fn, 'apply1', 'apply2')('call1');
      return util.curry(fn, 'apply1', 'apply2')('call1');
    });
    test('type', function() {
      return assert.equal(util.type(/\b/), 'regexp');
    });
    return test('is', function() {
      assert.isTrue(util.is('regexp', /\b/));
      assert.isTrue(util.is(['regexp', 'object'], /\b/));
      assert.isFalse(util.is(['regexp', 'object'], ''));
      return assert.isTrue(util.is(['regexp', 'object'], {}));
    });
  });

}).call(this);

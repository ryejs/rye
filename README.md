Rye
===

**Rye** is a light javascript library for DOM manipulation and events. It's a lighter alternative to jQuery, that unlike Zepto, supports IE9+ or even IE8 (using es5-shim).

Loosely based on Zepto and Ender.

by [jcemer](http://github.com/jcemer), [ricardobeat](http://github.com/ricardobeat) and [v42](http://github.com/v42)

API
---

The API is similar to jQuery but not totally compatible. Inconsistencies like `.map()` behavior, `map/each()` argument ordering are fixed in Rye.

It doesn't do any trickery to subclass `Array`, elements are stored in the `.elements` property instead. This means that array methods ran on a `Rye` instance return another `Rye` instance, while methods ran on `.get()` or `.elements` return instances of `Array` (ex: `$('li').each()` vs `$('li').get().forEach()`).

#### Traversing

- `find()`
- `filter()`
- `has()`
- `is()`
- `not()`
- `add()`
- `next()`
- `prev()`
- `first()`
- `last()`
- `siblings()`
- `parent()`
- `closest()`
- `parents()`
- `children()`

#### Collection methods

- `get()`
- `eq()`
- `forEach()`
- `each()`
- `reduce()`
- `reduceRight()`
- `indexOf()`
- `map()`
- `sort()`
- `push()`
- `slice()`
- `concat()`

#### Style

- `show()`
- `hide()`
- `hasClass()`
- `addClass()`
- `removeClass()`
- `toggleClass()`

API wishlist
------------

- `after()`
- `before()`
- `toggle()` - maybe not?
- other css methods
- `html()`
- `text()`
- `attr()`, `val()`, `prop()` ?

### Events
 
- `on` | `addEventListener`
- `off` | `removeEventListener`
- `trigger` | `emit` | `dispatchEvent`
- `hasEventListener`

Components wishlist
-------------------

- ajax and serialize
- gestures
- data storage

Browser compatiblity
--------------------

<table>
    <tr>
        <th>Chrome</th>
        <td>6+</td>
    </tr>
    <tr>
        <th>Safari</th>
        <td>5+</td>
    </tr>
    <tr>
        <th>Firefox</th>
        <td>6+</td>
    </tr>
    <tr>
        <th>IE</th>
        <td>9+</td>
    </tr>
    <tr>
        <th>Opera</th>
        <td>11.5+</td>
    </tr>
</table>

#### Mobile

<table>
    <tr>
        <th>iOS</th>
        <td>4.1+</td>
    </tr>
    <tr>
        <th>Android</th>
        <td>4.0+</td>
    </tr>
    <tr>
        <th>Blackberry</th>
        <td>10+</td>
    </tr>
    <tr>
        <th>Opera Mobile</th>
        <td>11.1+</td>
    </tr>
    <tr>
        <th>Chrome (Android)</th>
        <td>18+</td>
    </tr>
    <tr>
        <th>Firefox (Android)</th>
        <td>15+</td>
    </tr>
</table>

Not going to happen
------------

- event aliases like delegate, live, click, focus
- cancel bubbling and prevent default by returning false
- effects and animation - do it with CSS
- defining global `$`
- end() or other chain-aware methods

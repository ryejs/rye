Rye 0.1.3
===
[![CDNJS version](https://img.shields.io/cdnjs/v/ryejs.svg)](https://cdnjs.com/libraries/ryejs)

Website and documentation http://ryejs.com

<!-- [![Build Status](https://secure.travis-ci.org/ryejs/rye.png?branch=master)](http://travis-ci.org/ryejs/rye) -->

**Rye** is a lightweight javascript library for DOM manipulation and events with support for **all modern browsers**, including IE9+. It also has **touch events/gestures**, an **event emitter** constructor, and a **jQuery-like** API.

Browser compatiblity
--------------------

| Desktop Browser | Version |
| --------------- | ------- |
| Chrome          | 6+      |
| Safari          | 5+      |
| Firefox         | 6+      |
| IE              | 9+      |
| Opera           | 11.5+   |

| Mobile Browser    | Version       |
| ----------------- | ------------- |
| iOS Safari        | 4.1+ (6.0.1)  |
| Chrome (Android)  | 18+ (18)      |
| Android Browser   | 4.0+          |
| Firefox (Android) | 15+ (18)      |
| Blackberry        | 10+           |
| Opera Mobile      | 11.1+  (12.1) |


API
---


### Rye
- [`Constructor`](http://ryejs.com#rye-constructor)
- [`Rye.define`](http://ryejs.com#rye-ryedefine)
- [`Rye.require`](http://ryejs.com#rye-ryerequire)

### Data
- [`data`](http://ryejs.com#data-data)
- [`@set`](http://ryejs.com#data-@set)
- [`@get`](http://ryejs.com#data-@get)

### Traversal
- [`find`](http://ryejs.com#traversal-find)
- [`index`](http://ryejs.com#traversal-index)
- [`add`](http://ryejs.com#traversal-add)
- [`pluckNode`](http://ryejs.com#traversal-plucknode)
- [`next`](http://ryejs.com#traversal-next)
- [`prev`](http://ryejs.com#traversal-prev)
- [`siblings`](http://ryejs.com#traversal-siblings)
- [`parent`](http://ryejs.com#traversal-parent)
- [`parents`](http://ryejs.com#traversal-parents)
- [`closest`](http://ryejs.com#traversal-closest)
- [`children`](http://ryejs.com#traversal-children)

### Filter
- [`filter`](http://ryejs.com#filter-filter)
- [`filter not`](http://ryejs.com#filter-filternot)
- [`contains`](http://ryejs.com#filter-contains)
- [`is`](http://ryejs.com#filter-is)
- [`first`](http://ryejs.com#filter-first)
- [`last`](http://ryejs.com#filter-last)

### Query
- [`@matches`](http://ryejs.com#query-@matches)
- [`@qsa`](http://ryejs.com#query-@qsa)
- [`@getClosestNode`](http://ryejs.com#query-@getclosestnode)

### Collection
- [`get`](http://ryejs.com#collection-get)
- [`eq`](http://ryejs.com#collection-eq)
- [`forEach`](http://ryejs.com#collection-foreach)
- [`reduce`](http://ryejs.com#collection-reduce)
- [`reduceRight`](http://ryejs.com#collection-reduceright)
- [`indexOf`](http://ryejs.com#collection-indexof)
- [`map`](http://ryejs.com#collection-map)
- [`sort`](http://ryejs.com#collection-sort)
- [`each`](http://ryejs.com#collection-each)
- [`iterate`](http://ryejs.com#collection-iterate)
- [`push`](http://ryejs.com#collection-push)
- [`slice`](http://ryejs.com#collection-slice)
- [`concat`](http://ryejs.com#collection-concat)
- [`pluck`](http://ryejs.com#collection-pluck)
- [`put`](http://ryejs.com#collection-put)

### Manipulation
- [`text`](http://ryejs.com#manipulation-text)
- [`html`](http://ryejs.com#manipulation-html)
- [`empty`](http://ryejs.com#manipulation-empty)
- [`append`](http://ryejs.com#manipulation-append)
- [`prepend`](http://ryejs.com#manipulation-prepend)
- [`after`](http://ryejs.com#manipulation-after)
- [`before`](http://ryejs.com#manipulation-before)
- [`clone`](http://ryejs.com#manipulation-clone)
- [`remove`](http://ryejs.com#manipulation-remove)
- [`val`](http://ryejs.com#manipulation-val)
- [`attr`](http://ryejs.com#manipulation-attr)
- [`removeAttr`](http://ryejs.com#manipulation-removeAttr)
- [`prop`](http://ryejs.com#manipulation-prop)
- [`Rye.create`](http://ryejs.com#manipulation-ryecreate)
- [`@getValue`](http://ryejs.com#manipulation-@getvalue)
- [`@getAttribute`](http://ryejs.com#manipulation-@getattribute)

### Style
- [`show`](http://ryejs.com#style-show)
- [`hide`](http://ryejs.com#style-hide)
- [`css`](http://ryejs.com#style-css)
- [`hasClass`](http://ryejs.com#style-hasclass)
- [`addClass`](http://ryejs.com#style-addclass)
- [`removeClass`](http://ryejs.com#style-removeclass)
- [`toggleClass`](http://ryejs.com#style-toggleclass)
- [`@getCSS`](http://ryejs.com#style-@getcss)
- [`@setCSS`](http://ryejs.com#style-@setcss)
- [`@hasClass`](http://ryejs.com#style-@hasclass)
- [`@addClass`](http://ryejs.com#style-@addclass)
- [`@removeClass`](http://ryejs.com#style-@removeclass)

### Event Emitter
- [`addListener (on)`](http://ryejs.com#eventemitter-addlisteneron)
- [`once`](http://ryejs.com#eventemitter-once)
- [`removeListener`](http://ryejs.com#eventemitter-removelistener)
- [`trigger`](http://ryejs.com#eventemitter-trigger)
- [`proxy`](http://ryejs.com#eventemitter-proxy)

### DOM Event Emitter
- [`addListener (on)`](http://ryejs.com#domeventemitter-addlisteneron)
- [`once (one)`](http://ryejs.com#domeventemitter-onceone)
- [`removeListener (off)`](http://ryejs.com#domeventemitter-removelisteneroff)
- [`destroy`](http://ryejs.com#domeventemitter-destroy)
- [`trigger`](http://ryejs.com#domeventemitter-trigger)
- [`emit`](http://ryejs.com#domeventemitter-emit)
- [`proxy`](http://ryejs.com#domeventemitter-proxy)

### Events
- [`addListener`](http://ryejs.com#events-addlistener)
- [`once`](http://ryejs.com#events-once)
- [`removeListener`](http://ryejs.com#events-removelistener)
- [`trigger`](http://ryejs.com#events-trigger)
- [`@getEmitter`](http://ryejs.com#events-@getemitter)
- [`@createEvent`](http://ryejs.com#events-@createevent)
- [`@addListener`](http://ryejs.com#events-@addlistener)
- [`@once`](http://ryejs.com#events-@once)
- [`@removeListener`](http://ryejs.com#events-@removelistener)
- [`@trigger`](http://ryejs.com#events-@trigger)
- [`Rye.subscribe`](http://ryejs.com#events-ryesubscribe)
- [`Rye.unsubscribe`](http://ryejs.com#events-ryeunsubscribe)
- [`Rye.publish`](http://ryejs.com#events-ryepublish)

### Touch Events

### Request
- [`Rye.request()`](http://ryejs.com#request-ryerequest)
- [`Rye.get()`](http://ryejs.com#request-ryeget)
- [`Rye.post()`](http://ryejs.com#request-ryepost)
- [`serialize`](http://ryejs.com#request-serialize)
- [`@request`](http://ryejs.com#request-@request)
- [`@serialize`](http://ryejs.com#request-@serialize)
- [`@appendQuery`](http://ryejs.com#request-@appendquery)
- [`@defaults`](http://ryejs.com#request-@defaults)
- [`@get`](http://ryejs.com#request-@get)
- [`@post`](http://ryejs.com#request-@post)

### Util
- [`@extend`](http://ryejs.com#util-@extend)
- [`@inherits`](http://ryejs.com#util-@inherits)
- [`@isElement`](http://ryejs.com#util-@iselement)
- [`@isNodeList`](http://ryejs.com#util-@isnodelist)
- [`@unique`](http://ryejs.com#util-@unique)
- [`@pluck`](http://ryejs.com#util-@pluck)
- [`@put`](http://ryejs.com#util-@put)
- [`@prefix`](http://ryejs.com#util-@prefix)
- [`@applier`](http://ryejs.com#util-@applier)
- [`@curry`](http://ryejs.com#util-@curry)
- [`@getUid`](http://ryejs.com#util-@getuid)
- [`@type`](http://ryejs.com#util-@type)
- [`@is`](http://ryejs.com#util-@is)


---

Loosely based on Zepto and Ender.

by [jcemer](http://github.com/jcemer), [ricardobeat](http://github.com/ricardobeat) and [WesleydeSouza](http://github.com/WesleydeSouza)

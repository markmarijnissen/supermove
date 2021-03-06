/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(9);
	__webpack_require__(11);
	var Surface = __webpack_require__(22);
	var Kefir = __webpack_require__(12);
	var m = __webpack_require__(2);

	var Supermove = __webpack_require__(4);
	Supermove.merge = __webpack_require__(5);
	Supermove.animate = __webpack_require__(6);
	Supermove.resize = __webpack_require__(7);
	Supermove.tween = __webpack_require__(8);
	Supermove.update = Surface.update;
	Supermove.spec = Surface.spec;
	Supermove.event = __webpack_require__(1)(document.body);
	Supermove.VERSION = ("0.3.0");

	// Export to Window
	if(typeof window !== 'undefined'){
		window.Supermove = Supermove;
		window.Kefir = Kefir;
		window.m = m;
	}

	if(true){
		console.log('Supermove '+("0.3.0")+' (developer build)');
	}
	module.exports = Supermove;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var DomDelegate = __webpack_require__(18).Delegate;
	var Kefir = __webpack_require__(12);

	/**
	 * createDomEventStreamFactory(element)
	 *
	 * Initialize a DomDelegate instance to create a
	 * Stream Factory - it's actually a StreamFactory-Factory :)
	 */
	function createDomEventStreamFactory(el){
		var delegate = new DomDelegate(el);
		return DomEventStreamFactory.bind(delegate);
	}

	/**
	 * Stream factory
	 *
	 * Create a stream of DOM Events
	 */
	function DomEventStreamFactory(eventType,handler,useCapture){
		// `this` is bound to a dom-delegate instance.
		// 
		// We use function.bind() to get a partially applied
		// 'subscribe' and 'unsubscribe' function.
		// 
		// The only argument remaining is the "callback" argument,
		// which is exactly what Kefir needs.
		return Kefir.fromSubUnsub(
			subscribe.bind(this,eventType,handler,useCapture),
			unsubscribe.bind(this,eventType,handler,useCapture)
		);
	}

	/**
	 * Subscribe to DOM-Events
	 *
	 * Note: `this` is bound to a dom-delegate instance
	 */
	function subscribe(eventType,handler,useCapture,callback){
		this.on(eventType,handler,callback,useCapture);
	}

	/**
	 * Subscribe to DOM-Events
	 *
	 * Note: `this` is bound to a dom-delegate instance
	 */
	function unsubscribe(eventType,handler,useCapture,callback){
		this.off(eventType,handler,callback,useCapture);
	}

	module.exports = createDomEventStreamFactory;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {var m = (function app(window, undefined) {
		var OBJECT = "[object Object]", ARRAY = "[object Array]", STRING = "[object String]", FUNCTION = "function";
		var type = {}.toString;
		var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g, attrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;
		var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;

		// caching commonly used variables
		var $document, $location, $requestAnimationFrame, $cancelAnimationFrame;

		// self invoking function needed because of the way mocks work
		function initialize(window){
			$document = window.document;
			$location = window.location;
			$cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
			$requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
		}

		initialize(window);


		/**
		 * @typedef {String} Tag
		 * A string that looks like -> div.classname#id[param=one][param2=two]
		 * Which describes a DOM node
		 */

		/**
		 *
		 * @param {Tag} The DOM node tag
		 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
		 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array, or splat (optional)
		 *
		 */
		function m() {
			var args = [].slice.call(arguments);
			var hasAttrs = args[1] != null && type.call(args[1]) === OBJECT && !("tag" in args[1] || "view" in args[1]) && !("subtree" in args[1]);
			var attrs = hasAttrs ? args[1] : {};
			var classAttrName = "class" in attrs ? "class" : "className";
			var cell = {tag: "div", attrs: {}};
			var match, classes = [];
			if (type.call(args[0]) != STRING) throw new Error("selector in m(selector, attrs, children) should be a string")
			while (match = parser.exec(args[0])) {
				if (match[1] === "" && match[2]) cell.tag = match[2];
				else if (match[1] === "#") cell.attrs.id = match[2];
				else if (match[1] === ".") classes.push(match[2]);
				else if (match[3][0] === "[") {
					var pair = attrParser.exec(match[3]);
					cell.attrs[pair[1]] = pair[3] || (pair[2] ? "" :true)
				}
			}

			var children = hasAttrs ? args.slice(2) : args.slice(1);
			if (children.length === 1 && type.call(children[0]) === ARRAY) {
				cell.children = children[0]
			}
			else {
				cell.children = children
			}
			
			for (var attrName in attrs) {
				if (attrs.hasOwnProperty(attrName)) {
					if (attrName === classAttrName && attrs[attrName] != null && attrs[attrName] !== "") {
						classes.push(attrs[attrName])
						cell.attrs[attrName] = "" //create key in correct iteration order
					}
					else cell.attrs[attrName] = attrs[attrName]
				}
			}
			if (classes.length > 0) cell.attrs[classAttrName] = classes.join(" ");
			
			return cell
		}
		function build(parentElement, parentTag, parentCache, parentIndex, data, cached, shouldReattach, index, editable, namespace, configs) {
			//`build` is a recursive function that manages creation/diffing/removal of DOM elements based on comparison between `data` and `cached`
			//the diff algorithm can be summarized as this:
			//1 - compare `data` and `cached`
			//2 - if they are different, copy `data` to `cached` and update the DOM based on what the difference is
			//3 - recursively apply this algorithm for every array and for the children of every virtual element

			//the `cached` data structure is essentially the same as the previous redraw's `data` data structure, with a few additions:
			//- `cached` always has a property called `nodes`, which is a list of DOM elements that correspond to the data represented by the respective virtual element
			//- in order to support attaching `nodes` as a property of `cached`, `cached` is *always* a non-primitive object, i.e. if the data was a string, then cached is a String instance. If data was `null` or `undefined`, cached is `new String("")`
			//- `cached also has a `configContext` property, which is the state storage object exposed by config(element, isInitialized, context)
			//- when `cached` is an Object, it represents a virtual element; when it's an Array, it represents a list of elements; when it's a String, Number or Boolean, it represents a text node

			//`parentElement` is a DOM element used for W3C DOM API calls
			//`parentTag` is only used for handling a corner case for textarea values
			//`parentCache` is used to remove nodes in some multi-node cases
			//`parentIndex` and `index` are used to figure out the offset of nodes. They're artifacts from before arrays started being flattened and are likely refactorable
			//`data` and `cached` are, respectively, the new and old nodes being diffed
			//`shouldReattach` is a flag indicating whether a parent node was recreated (if so, and if this node is reused, then this node must reattach itself to the new parent)
			//`editable` is a flag that indicates whether an ancestor is contenteditable
			//`namespace` indicates the closest HTML namespace as it cascades down from an ancestor
			//`configs` is a list of config functions to run after the topmost `build` call finishes running

			//there's logic that relies on the assumption that null and undefined data are equivalent to empty strings
			//- this prevents lifecycle surprises from procedural helpers that mix implicit and explicit return statements (e.g. function foo() {if (cond) return m("div")}
			//- it simplifies diffing code
			//data.toString() might throw or return null if data is the return value of Console.log in Firefox (behavior depends on version)
			try {if (data == null || data.toString() == null) data = "";} catch (e) {data = ""}
			if (data.subtree === "retain") return cached;
			var cachedType = type.call(cached), dataType = type.call(data);
			if (cached == null || cachedType !== dataType) {
				if (cached != null) {
					if (parentCache && parentCache.nodes) {
						var offset = index - parentIndex;
						var end = offset + (dataType === ARRAY ? data : cached.nodes).length;
						clear(parentCache.nodes.slice(offset, end), parentCache.slice(offset, end))
					}
					else if (cached.nodes) clear(cached.nodes, cached)
				}
				cached = new data.constructor;
				if (cached.tag) cached = {}; //if constructor creates a virtual dom element, use a blank object as the base cached node instead of copying the virtual el (#277)
				cached.nodes = []
			}

			if (dataType === ARRAY) {
				//recursively flatten array
				for (var i = 0, len = data.length; i < len; i++) {
					if (type.call(data[i]) === ARRAY) {
						data = data.concat.apply([], data);
						i-- //check current index again and flatten until there are no more nested arrays at that index
						len = data.length
					}
				}
				
				var nodes = [], intact = cached.length === data.length, subArrayCount = 0;

				//keys algorithm: sort elements without recreating them if keys are present
				//1) create a map of all existing keys, and mark all for deletion
				//2) add new keys to map and mark them for addition
				//3) if key exists in new list, change action from deletion to a move
				//4) for each key, handle its corresponding action as marked in previous steps
				var DELETION = 1, INSERTION = 2 , MOVE = 3;
				var existing = {}, unkeyed = [], shouldMaintainIdentities = false;
				for (var i = 0; i < cached.length; i++) {
					if (cached[i] && cached[i].attrs && cached[i].attrs.key != null) {
						shouldMaintainIdentities = true;
						existing[cached[i].attrs.key] = {action: DELETION, index: i}
					}
				}
				
				var guid = 0
				for (var i = 0, len = data.length; i < len; i++) {
					if (data[i] && data[i].attrs && data[i].attrs.key != null) {
						for (var j = 0, len = data.length; j < len; j++) {
							if (data[j] && data[j].attrs && data[j].attrs.key == null) data[j].attrs.key = "__mithril__" + guid++
						}
						break
					}
				}
				
				if (shouldMaintainIdentities) {
					var keysDiffer = false
					if (data.length != cached.length) keysDiffer = true
					else for (var i = 0, cachedCell, dataCell; cachedCell = cached[i], dataCell = data[i]; i++) {
						if (cachedCell.attrs && dataCell.attrs && cachedCell.attrs.key != dataCell.attrs.key) {
							keysDiffer = true
							break
						}
					}
					
					if (keysDiffer) {
						for (var i = 0, len = data.length; i < len; i++) {
							if (data[i] && data[i].attrs) {
								if (data[i].attrs.key != null) {
									var key = data[i].attrs.key;
									if (!existing[key]) existing[key] = {action: INSERTION, index: i};
									else existing[key] = {
										action: MOVE,
										index: i,
										from: existing[key].index,
										element: cached.nodes[existing[key].index] || $document.createElement("div")
									}
								}
							}
						}
						var actions = []
						for (var prop in existing) actions.push(existing[prop])
						var changes = actions.sort(sortChanges);
						var newCached = new Array(cached.length)
						newCached.nodes = cached.nodes.slice()

						for (var i = 0, change; change = changes[i]; i++) {
							if (change.action === DELETION) {
								clear(cached[change.index].nodes, cached[change.index]);
								newCached.splice(change.index, 1)
							}
							if (change.action === INSERTION) {
								var dummy = $document.createElement("div");
								dummy.key = data[change.index].attrs.key;
								parentElement.insertBefore(dummy, parentElement.childNodes[change.index] || null);
								newCached.splice(change.index, 0, {attrs: {key: data[change.index].attrs.key}, nodes: [dummy]})
								newCached.nodes[change.index] = dummy
							}

							if (change.action === MOVE) {
								if (parentElement.childNodes[change.index] !== change.element && change.element !== null) {
									parentElement.insertBefore(change.element, parentElement.childNodes[change.index] || null)
								}
								newCached[change.index] = cached[change.from]
								newCached.nodes[change.index] = change.element
							}
						}
						cached = newCached;
					}
				}
				//end key algorithm

				for (var i = 0, cacheCount = 0, len = data.length; i < len; i++) {
					//diff each item in the array
					var item = build(parentElement, parentTag, cached, index, data[i], cached[cacheCount], shouldReattach, index + subArrayCount || subArrayCount, editable, namespace, configs);
					if (item === undefined) continue;
					if (!item.nodes.intact) intact = false;
					if (item.$trusted) {
						//fix offset of next element if item was a trusted string w/ more than one html element
						//the first clause in the regexp matches elements
						//the second clause (after the pipe) matches text nodes
						subArrayCount += (item.match(/<[^\/]|\>\s*[^<]/g) || [0]).length
					}
					else subArrayCount += type.call(item) === ARRAY ? item.length : 1;
					cached[cacheCount++] = item
				}
				if (!intact) {
					//diff the array itself
					
					//update the list of DOM nodes by collecting the nodes from each item
					for (var i = 0, len = data.length; i < len; i++) {
						if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes)
					}
					//remove items from the end of the array if the new array is shorter than the old one
					//if errors ever happen here, the issue is most likely a bug in the construction of the `cached` data structure somewhere earlier in the program
					for (var i = 0, node; node = cached.nodes[i]; i++) {
						if (node.parentNode != null && nodes.indexOf(node) < 0) clear([node], [cached[i]])
					}
					if (data.length < cached.length) cached.length = data.length;
					cached.nodes = nodes
				}
			}
			else if (data != null && dataType === OBJECT) {
				var controllerConstructors = [], controllers = []
				while (data.view) {
					var controllerConstructor = (data.controller || {}).$original || data.controller || function() {}
					var controllerIndex = m.redraw.strategy() == "diff" && cached.controllerConstructors ? cached.controllerConstructors.indexOf(controllerConstructor) : -1
					var controller = controllerIndex > -1 ? cached.controllers[controllerIndex] : new (data.controller || function() {})
					var key = data && data.attrs && data.attrs.key
					data = pendingRequests == 0 || cached ? data.view(controller) : {tag: "placeholder"}
					if (key) {
						if (!data.attrs) data.attrs = {}
						data.attrs.key = key
					}
					if (controller.onunload) unloaders.push({controller: controller, handler: controller.onunload})
					controllerConstructors.push(controllerConstructor)
					controllers.push(controller)
				}
				if (!data.tag && controllers.length) throw new Error("Component template must return a virtual element, not an array, string, etc.")
				if (!data.attrs) data.attrs = {};
				if (!cached.attrs) cached.attrs = {};

				var dataAttrKeys = Object.keys(data.attrs)
				var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0)
				//if an element is different enough from the one in cache, recreate it
				if (data.tag != cached.tag || dataAttrKeys.sort().join() != Object.keys(cached.attrs).sort().join() || data.attrs.id != cached.attrs.id || data.attrs.key != cached.attrs.key || (m.redraw.strategy() == "all" && cached.configContext && cached.configContext.retain !== true) || (m.redraw.strategy() == "diff" && cached.configContext && cached.configContext.retain === false)) {
					if (cached.nodes.length) clear(cached.nodes);
					if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) cached.configContext.onunload()
					if (cached.controllers) {
						for (var i = 0, controller; controller = cached.controllers[i]; i++) {
							if (typeof controller.onunload === FUNCTION) controller.onunload({preventDefault: function() {}})
						}
					}
				}
				if (type.call(data.tag) != STRING) return;

				var node, isNew = cached.nodes.length === 0;
				if (data.attrs.xmlns) namespace = data.attrs.xmlns;
				else if (data.tag === "svg") namespace = "http://www.w3.org/2000/svg";
				else if (data.tag === "math") namespace = "http://www.w3.org/1998/Math/MathML";
				
				if (isNew) {
					if (data.attrs.is) node = namespace === undefined ? $document.createElement(data.tag, data.attrs.is) : $document.createElementNS(namespace, data.tag, data.attrs.is);
					else node = namespace === undefined ? $document.createElement(data.tag) : $document.createElementNS(namespace, data.tag);
					cached = {
						tag: data.tag,
						//set attributes first, then create children
						attrs: hasKeys ? setAttributes(node, data.tag, data.attrs, {}, namespace) : data.attrs,
						children: data.children != null && data.children.length > 0 ?
							build(node, data.tag, undefined, undefined, data.children, cached.children, true, 0, data.attrs.contenteditable ? node : editable, namespace, configs) :
							data.children,
						nodes: [node]
					};
					if (controllers.length) {
						cached.controllerConstructors = controllerConstructors
						cached.controllers = controllers
						for (var i = 0, controller; controller = controllers[i]; i++) {
							if (controller.onunload && controller.onunload.$old) controller.onunload = controller.onunload.$old
							if (pendingRequests && controller.onunload) {
								var onunload = controller.onunload
								controller.onunload = function() {}
								controller.onunload.$old = onunload
							}
						}
					}
					
					if (cached.children && !cached.children.nodes) cached.children.nodes = [];
					//edge case: setting value on <select> doesn't work before children exist, so set it again after children have been created
					if (data.tag === "select" && data.attrs.value) setAttributes(node, data.tag, {value: data.attrs.value}, {}, namespace);
					parentElement.insertBefore(node, parentElement.childNodes[index] || null)
				}
				else {
					node = cached.nodes[0];
					if (hasKeys) setAttributes(node, data.tag, data.attrs, cached.attrs, namespace);
					cached.children = build(node, data.tag, undefined, undefined, data.children, cached.children, false, 0, data.attrs.contenteditable ? node : editable, namespace, configs);
					cached.nodes.intact = true;
					if (controllers.length) {
						cached.controllerConstructors = controllerConstructors
						cached.controllers = controllers
					}
					if (shouldReattach === true && node != null) parentElement.insertBefore(node, parentElement.childNodes[index] || null)
				}
				//schedule configs to be called. They are called after `build` finishes running
				if (typeof data.attrs["config"] === FUNCTION) {
					var context = cached.configContext = cached.configContext || {};

					// bind
					var callback = function(data, args) {
						return function() {
							return data.attrs["config"].apply(data, args)
						}
					};
					configs.push(callback(data, [node, !isNew, context, cached]))
				}
			}
			else if (typeof data != FUNCTION) {
				//handle text nodes
				var nodes;
				if (cached.nodes.length === 0) {
					if (data.$trusted) {
						nodes = injectHTML(parentElement, index, data)
					}
					else {
						nodes = [$document.createTextNode(data)];
						if (!parentElement.nodeName.match(voidElements)) parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null)
					}
					cached = "string number boolean".indexOf(typeof data) > -1 ? new data.constructor(data) : data;
					cached.nodes = nodes
				}
				else if (cached.valueOf() !== data.valueOf() || shouldReattach === true) {
					nodes = cached.nodes;
					if (!editable || editable !== $document.activeElement) {
						if (data.$trusted) {
							clear(nodes, cached);
							nodes = injectHTML(parentElement, index, data)
						}
						else {
							//corner case: replacing the nodeValue of a text node that is a child of a textarea/contenteditable doesn't work
							//we need to update the value property of the parent textarea or the innerHTML of the contenteditable element instead
							if (parentTag === "textarea") parentElement.value = data;
							else if (editable) editable.innerHTML = data;
							else {
								if (nodes[0].nodeType === 1 || nodes.length > 1) { //was a trusted string
									clear(cached.nodes, cached);
									nodes = [$document.createTextNode(data)]
								}
								parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null);
								nodes[0].nodeValue = data
							}
						}
					}
					cached = new data.constructor(data);
					cached.nodes = nodes
				}
				else cached.nodes.intact = true
			}

			return cached
		}
		function sortChanges(a, b) {return a.action - b.action || a.index - b.index}
		function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
			for (var attrName in dataAttrs) {
				var dataAttr = dataAttrs[attrName];
				var cachedAttr = cachedAttrs[attrName];
				if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr)) {
					cachedAttrs[attrName] = dataAttr;
					try {
						//`config` isn't a real attributes, so ignore it
						if (attrName === "config" || attrName == "key") continue;
						//hook event handlers to the auto-redrawing system
						else if (typeof dataAttr === FUNCTION && attrName.indexOf("on") === 0) {
							node[attrName] = autoredraw(dataAttr, node)
						}
						//handle `style: {...}`
						else if (attrName === "style" && dataAttr != null && type.call(dataAttr) === OBJECT) {
							for (var rule in dataAttr) {
								if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) node.style[rule] = dataAttr[rule]
							}
							for (var rule in cachedAttr) {
								if (!(rule in dataAttr)) node.style[rule] = ""
							}
						}
						//handle SVG
						else if (namespace != null) {
							if (attrName === "href") node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataAttr);
							else if (attrName === "className") node.setAttribute("class", dataAttr);
							else node.setAttribute(attrName, dataAttr)
						}
						//handle cases that are properties (but ignore cases where we should use setAttribute instead)
						//- list and form are typically used as strings, but are DOM element references in js
						//- when using CSS selectors (e.g. `m("[style='']")`), style is used as a string, but it's an object in js
						else if (attrName in node && !(attrName === "list" || attrName === "style" || attrName === "form" || attrName === "type" || attrName === "width" || attrName === "height")) {
							//#348 don't set the value if not needed otherwise cursor placement breaks in Chrome
							if (tag !== "input" || node[attrName] !== dataAttr) node[attrName] = dataAttr
						}
						else node.setAttribute(attrName, dataAttr)
					}
					catch (e) {
						//swallow IE's invalid argument errors to mimic HTML's fallback-to-doing-nothing-on-invalid-attributes behavior
						if (e.message.indexOf("Invalid argument") < 0) throw e
					}
				}
				//#348 dataAttr may not be a string, so use loose comparison (double equal) instead of strict (triple equal)
				else if (attrName === "value" && tag === "input" && node.value != dataAttr) {
					node.value = dataAttr
				}
			}
			return cachedAttrs
		}
		function clear(nodes, cached) {
			for (var i = nodes.length - 1; i > -1; i--) {
				if (nodes[i] && nodes[i].parentNode) {
					try {nodes[i].parentNode.removeChild(nodes[i])}
					catch (e) {} //ignore if this fails due to order of events (see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
					cached = [].concat(cached);
					if (cached[i]) unload(cached[i])
				}
			}
			if (nodes.length != 0) nodes.length = 0
		}
		function unload(cached) {
			if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) {
				cached.configContext.onunload();
				cached.configContext.onunload = null
			}
			if (cached.controllers) {
				for (var i = 0, controller; controller = cached.controllers[i]; i++) {
					if (typeof controller.onunload === FUNCTION) controller.onunload({preventDefault: function() {}});
				}
			}
			if (cached.children) {
				if (type.call(cached.children) === ARRAY) {
					for (var i = 0, child; child = cached.children[i]; i++) unload(child)
				}
				else if (cached.children.tag) unload(cached.children)
			}
		}
		function injectHTML(parentElement, index, data) {
			var nextSibling = parentElement.childNodes[index];
			if (nextSibling) {
				var isElement = nextSibling.nodeType != 1;
				var placeholder = $document.createElement("span");
				if (isElement) {
					parentElement.insertBefore(placeholder, nextSibling || null);
					placeholder.insertAdjacentHTML("beforebegin", data);
					parentElement.removeChild(placeholder)
				}
				else nextSibling.insertAdjacentHTML("beforebegin", data)
			}
			else parentElement.insertAdjacentHTML("beforeend", data);
			var nodes = [];
			while (parentElement.childNodes[index] !== nextSibling) {
				nodes.push(parentElement.childNodes[index]);
				index++
			}
			return nodes
		}
		function autoredraw(callback, object) {
			return function(e) {
				e = e || event;
				m.redraw.strategy("diff");
				m.startComputation();
				try {return callback.call(object, e)}
				finally {
					endFirstComputation()
				}
			}
		}

		var html;
		var documentNode = {
			appendChild: function(node) {
				if (html === undefined) html = $document.createElement("html");
				if ($document.documentElement && $document.documentElement !== node) {
					$document.replaceChild(node, $document.documentElement)
				}
				else $document.appendChild(node);
				this.childNodes = $document.childNodes
			},
			insertBefore: function(node) {
				this.appendChild(node)
			},
			childNodes: []
		};
		var nodeCache = [], cellCache = {};
		m.render = function(root, cell, forceRecreation) {
			var configs = [];
			if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.");
			var id = getCellCacheKey(root);
			var isDocumentRoot = root === $document;
			var node = isDocumentRoot || root === $document.documentElement ? documentNode : root;
			if (isDocumentRoot && cell.tag != "html") cell = {tag: "html", attrs: {}, children: cell};
			if (cellCache[id] === undefined) clear(node.childNodes);
			if (forceRecreation === true) reset(root);
			cellCache[id] = build(node, null, undefined, undefined, cell, cellCache[id], false, 0, null, undefined, configs);
			for (var i = 0, len = configs.length; i < len; i++) configs[i]()
		};
		function getCellCacheKey(element) {
			var index = nodeCache.indexOf(element);
			return index < 0 ? nodeCache.push(element) - 1 : index
		}

		m.trust = function(value) {
			value = new String(value);
			value.$trusted = true;
			return value
		};

		function gettersetter(store) {
			var prop = function() {
				if (arguments.length) store = arguments[0];
				return store
			};

			prop.toJSON = function() {
				return store
			};

			return prop
		}

		m.prop = function (store) {
			//note: using non-strict equality check here because we're checking if store is null OR undefined
			if (((store != null && type.call(store) === OBJECT) || typeof store === FUNCTION) && typeof store.then === FUNCTION) {
				return propify(store)
			}

			return gettersetter(store)
		};

		var roots = [], components = [], controllers = [], lastRedrawId = null, lastRedrawCallTime = 0, computePostRedrawHook = null, prevented = false, topComponent, unloaders = [];
		var FRAME_BUDGET = 16; //60 frames per second = 1 call per 16 ms
		function parameterize(component, args) {
			var controller = component.controller || function(){};
			contoller = controller.bind.apply(controller,[controller].concat(args));
			var view = function(ctrl) {
				if (arguments.length > 1) args = args.concat([].slice.call(arguments, 1))
				return component.view.apply(component, args ? [ctrl].concat(args) : [ctrl])
			}
			controller.$original = component.controller
			var output = {controller: controller, view: view}
			if (args[0] && args[0].key != null) output.attrs = {key: args[0].key}
			return output
		}
		m.component = function(component) {
			return parameterize(component, [].slice.call(arguments, 1))
		}
		m.mount = m.module = function(root, component) {
			if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.");
			var index = roots.indexOf(root);
			if (index < 0) index = roots.length;
			
			var isPrevented = false;
			var event = {preventDefault: function() {isPrevented = true}};
			for (var i = 0, unloader; unloader = unloaders[i]; i++) {
				unloader.handler.call(unloader.controller, event)
				unloader.controller.onunload = null
			}
			if (isPrevented) {
				for (var i = 0, unloader; unloader = unloaders[i]; i++) unloader.controller.onunload = unloader.handler
			}
			else unloaders = []
			
			if (controllers[index] && typeof controllers[index].onunload === FUNCTION) {
				controllers[index].onunload(event)
			}
			
			if (!isPrevented) {
				m.redraw.strategy("all");
				m.startComputation();
				roots[index] = root;
				if (arguments.length > 2) component = subcomponent(component, [].slice.call(arguments, 2))
				var currentComponent = topComponent = component = component || {};
				var constructor = component.controller || function() {}
				var controller = new constructor;
				//controllers may call m.mount recursively (via m.route redirects, for example)
				//this conditional ensures only the last recursive m.mount call is applied
				if (currentComponent === topComponent) {
					controllers[index] = controller;
					components[index] = component
				}
				endFirstComputation();
				return controllers[index]
			}
			else computePostRedrawHook = null
		};
		var redrawing = false
		m.redraw = function(force) {
			if (redrawing) return
			redrawing = true
			//lastRedrawId is a positive number if a second redraw is requested before the next animation frame
			//lastRedrawID is null if it's the first redraw and not an event handler
			if (lastRedrawId && force !== true) {
				//when setTimeout: only reschedule redraw if time between now and previous redraw is bigger than a frame, otherwise keep currently scheduled timeout
				//when rAF: always reschedule redraw
				if (new Date - lastRedrawCallTime > FRAME_BUDGET || $requestAnimationFrame === window.requestAnimationFrame) {
					if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId);
					lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET)
				}
			}
			else {
				redraw();
				lastRedrawId = $requestAnimationFrame(function() {lastRedrawId = null}, FRAME_BUDGET)
			}
			redrawing = false
		};
		m.redraw.strategy = m.prop();
		var blank = function() {return ""}
		function redraw() {
			for (var i = 0, root; root = roots[i]; i++) {
				if (controllers[i]) {
					var args = components[i].controller && components[i].controller.$$args ? [controllers[i]].concat(components[i].controller.$$args) : [controllers[i]]
					m.render(root, components[i].view ? components[i].view(controllers[i], args) : blank())
				}
			}
			//after rendering within a routed context, we need to scroll back to the top, and fetch the document title for history.pushState
			if (computePostRedrawHook) {
				computePostRedrawHook();
				computePostRedrawHook = null
			}
			lastRedrawId = null;
			lastRedrawCallTime = new Date;
			m.redraw.strategy("diff")
		}

		var pendingRequests = 0;
		m.startComputation = function() {pendingRequests++};
		m.endComputation = function() {
			pendingRequests = Math.max(pendingRequests - 1, 0);
			if (pendingRequests === 0) m.redraw()
		};
		var endFirstComputation = function() {
			if (m.redraw.strategy() == "none") {
				pendingRequests--
				m.redraw.strategy("diff")
			}
			else m.endComputation();
		}

		m.withAttr = function(prop, withAttrCallback) {
			return function(e) {
				e = e || event;
				var currentTarget = e.currentTarget || this;
				withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop))
			}
		};

		//routing
		var modes = {pathname: "", hash: "#", search: "?"};
		var redirect = function() {}, routeParams, currentRoute;
		m.route = function() {
			//m.route()
			if (arguments.length === 0) return currentRoute;
			//m.route(el, defaultRoute, routes)
			else if (arguments.length === 3 && type.call(arguments[1]) === STRING) {
				var root = arguments[0], defaultRoute = arguments[1], router = arguments[2];
				redirect = function(source) {
					var path = currentRoute = normalizeRoute(source);
					if (!routeByValue(root, router, path)) {
						m.route(defaultRoute, true)
					}
				};
				var listener = m.route.mode === "hash" ? "onhashchange" : "onpopstate";
				window[listener] = function() {
					var path = $location[m.route.mode]
					if (m.route.mode === "pathname") path += $location.search
					if (currentRoute != normalizeRoute(path)) {
						redirect(path)
					}
				};
				computePostRedrawHook = setScroll;
				window[listener]()
			}
			//config: m.route
			else if (arguments[0].addEventListener || arguments[0].attachEvent) {
				var element = arguments[0];
				var isInitialized = arguments[1];
				var context = arguments[2];
				element.href = (m.route.mode !== 'pathname' ? $location.pathname : '') + modes[m.route.mode] + this.attrs.href;
				if (element.addEventListener) {
					element.removeEventListener("click", routeUnobtrusive);
					element.addEventListener("click", routeUnobtrusive)
				}
				else {
					element.detachEvent("onclick", routeUnobtrusive);
					element.attachEvent("onclick", routeUnobtrusive)
				}
			}
			//m.route(route, params)
			else if (type.call(arguments[0]) === STRING) {
				var oldRoute = currentRoute;
				currentRoute = arguments[0];
				var args = arguments[1] || {}
				var queryIndex = currentRoute.indexOf("?")
				var params = queryIndex > -1 ? parseQueryString(currentRoute.slice(queryIndex + 1)) : {}
				for (var i in args) params[i] = args[i]
				var querystring = buildQueryString(params)
				var currentPath = queryIndex > -1 ? currentRoute.slice(0, queryIndex) : currentRoute
				if (querystring) currentRoute = currentPath + (currentPath.indexOf("?") === -1 ? "?" : "&") + querystring;

				var shouldReplaceHistoryEntry = (arguments.length === 3 ? arguments[2] : arguments[1]) === true || oldRoute === arguments[0];

				if (window.history.pushState) {
					computePostRedrawHook = function() {
						window.history[shouldReplaceHistoryEntry ? "replaceState" : "pushState"](null, $document.title, modes[m.route.mode] + currentRoute);
						setScroll()
					};
					redirect(modes[m.route.mode] + currentRoute)
				}
				else {
					$location[m.route.mode] = currentRoute
					redirect(modes[m.route.mode] + currentRoute)
				}
			}
		};
		m.route.param = function(key) {
			if (!routeParams) throw new Error("You must call m.route(element, defaultRoute, routes) before calling m.route.param()")
			return routeParams[key]
		};
		m.route.mode = "search";
		function normalizeRoute(route) {
			return route.slice(modes[m.route.mode].length)
		}
		function routeByValue(root, router, path) {
			routeParams = {};

			var queryStart = path.indexOf("?");
			if (queryStart !== -1) {
				routeParams = parseQueryString(path.substr(queryStart + 1, path.length));
				path = path.substr(0, queryStart)
			}

			// Get all routes and check if there's
			// an exact match for the current path
			var keys = Object.keys(router);
			var index = keys.indexOf(path);
			if(index !== -1){
				m.mount(root, router[keys [index]]);
				return true;
			}

			for (var route in router) {
				if (route === path) {
					m.mount(root, router[route]);
					return true
				}

				var matcher = new RegExp("^" + route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");

				if (matcher.test(path)) {
					path.replace(matcher, function() {
						var keys = route.match(/:[^\/]+/g) || [];
						var values = [].slice.call(arguments, 1, -2);
						for (var i = 0, len = keys.length; i < len; i++) routeParams[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
						m.mount(root, router[route])
					});
					return true
				}
			}
		}
		function routeUnobtrusive(e) {
			e = e || event;
			if (e.ctrlKey || e.metaKey || e.which === 2) return;
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;
			var currentTarget = e.currentTarget || e.srcElement;
			var args = m.route.mode === "pathname" && currentTarget.search ? parseQueryString(currentTarget.search.slice(1)) : {};
			while (currentTarget && currentTarget.nodeName.toUpperCase() != "A") currentTarget = currentTarget.parentNode
			m.route(currentTarget[m.route.mode].slice(modes[m.route.mode].length), args)
		}
		function setScroll() {
			if (m.route.mode != "hash" && $location.hash) $location.hash = $location.hash;
			else window.scrollTo(0, 0)
		}
		function buildQueryString(object, prefix) {
			var duplicates = {}
			var str = []
			for (var prop in object) {
				var key = prefix ? prefix + "[" + prop + "]" : prop
				var value = object[prop]
				var valueType = type.call(value)
				var pair = (value === null) ? encodeURIComponent(key) :
					valueType === OBJECT ? buildQueryString(value, key) :
					valueType === ARRAY ? value.reduce(function(memo, item) {
						if (!duplicates[key]) duplicates[key] = {}
						if (!duplicates[key][item]) {
							duplicates[key][item] = true
							return memo.concat(encodeURIComponent(key) + "=" + encodeURIComponent(item))
						}
						return memo
					}, []).join("&") :
					encodeURIComponent(key) + "=" + encodeURIComponent(value)
				if (value !== undefined) str.push(pair)
			}
			return str.join("&")
		}
		function parseQueryString(str) {
			if (str.charAt(0) === "?") str = str.substring(1);
			
			var pairs = str.split("&"), params = {};
			for (var i = 0, len = pairs.length; i < len; i++) {
				var pair = pairs[i].split("=");
				var key = decodeURIComponent(pair[0])
				var value = pair.length == 2 ? decodeURIComponent(pair[1]) : null
				if (params[key] != null) {
					if (type.call(params[key]) !== ARRAY) params[key] = [params[key]]
					params[key].push(value)
				}
				else params[key] = value
			}
			return params
		}
		m.route.buildQueryString = buildQueryString
		m.route.parseQueryString = parseQueryString
		
		function reset(root) {
			var cacheKey = getCellCacheKey(root);
			clear(root.childNodes, cellCache[cacheKey]);
			cellCache[cacheKey] = undefined
		}

		m.deferred = function () {
			var deferred = new Deferred();
			deferred.promise = propify(deferred.promise);
			return deferred
		};
		function propify(promise, initialValue) {
			var prop = m.prop(initialValue);
			promise.then(prop);
			prop.then = function(resolve, reject) {
				return propify(promise.then(resolve, reject), initialValue)
			};
			return prop
		}
		//Promiz.mithril.js | Zolmeister | MIT
		//a modified version of Promiz.js, which does not conform to Promises/A+ for two reasons:
		//1) `then` callbacks are called synchronously (because setTimeout is too slow, and the setImmediate polyfill is too big
		//2) throwing subclasses of Error cause the error to be bubbled up instead of triggering rejection (because the spec does not account for the important use case of default browser error handling, i.e. message w/ line number)
		function Deferred(successCallback, failureCallback) {
			var RESOLVING = 1, REJECTING = 2, RESOLVED = 3, REJECTED = 4;
			var self = this, state = 0, promiseValue = 0, next = [];

			self["promise"] = {};

			self["resolve"] = function(value) {
				if (!state) {
					promiseValue = value;
					state = RESOLVING;

					fire()
				}
				return this
			};

			self["reject"] = function(value) {
				if (!state) {
					promiseValue = value;
					state = REJECTING;

					fire()
				}
				return this
			};

			self.promise["then"] = function(successCallback, failureCallback) {
				var deferred = new Deferred(successCallback, failureCallback);
				if (state === RESOLVED) {
					deferred.resolve(promiseValue)
				}
				else if (state === REJECTED) {
					deferred.reject(promiseValue)
				}
				else {
					next.push(deferred)
				}
				return deferred.promise
			};

			function finish(type) {
				state = type || REJECTED;
				next.map(function(deferred) {
					state === RESOLVED && deferred.resolve(promiseValue) || deferred.reject(promiseValue)
				})
			}

			function thennable(then, successCallback, failureCallback, notThennableCallback) {
				if (((promiseValue != null && type.call(promiseValue) === OBJECT) || typeof promiseValue === FUNCTION) && typeof then === FUNCTION) {
					try {
						// count protects against abuse calls from spec checker
						var count = 0;
						then.call(promiseValue, function(value) {
							if (count++) return;
							promiseValue = value;
							successCallback()
						}, function (value) {
							if (count++) return;
							promiseValue = value;
							failureCallback()
						})
					}
					catch (e) {
						m.deferred.onerror(e);
						promiseValue = e;
						failureCallback()
					}
				} else {
					notThennableCallback()
				}
			}

			function fire() {
				// check if it's a thenable
				var then;
				try {
					then = promiseValue && promiseValue.then
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					state = REJECTING;
					return fire()
				}
				thennable(then, function() {
					state = RESOLVING;
					fire()
				}, function() {
					state = REJECTING;
					fire()
				}, function() {
					try {
						if (state === RESOLVING && typeof successCallback === FUNCTION) {
							promiseValue = successCallback(promiseValue)
						}
						else if (state === REJECTING && typeof failureCallback === "function") {
							promiseValue = failureCallback(promiseValue);
							state = RESOLVING
						}
					}
					catch (e) {
						m.deferred.onerror(e);
						promiseValue = e;
						return finish()
					}

					if (promiseValue === self) {
						promiseValue = TypeError();
						finish()
					}
					else {
						thennable(then, function () {
							finish(RESOLVED)
						}, finish, function () {
							finish(state === RESOLVING && RESOLVED)
						})
					}
				})
			}
		}
		m.deferred.onerror = function(e) {
			if (type.call(e) === "[object Error]" && !e.constructor.toString().match(/ Error/)) throw e
		};

		m.sync = function(args) {
			var method = "resolve";
			function synchronizer(pos, resolved) {
				return function(value) {
					results[pos] = value;
					if (!resolved) method = "reject";
					if (--outstanding === 0) {
						deferred.promise(results);
						deferred[method](results)
					}
					return value
				}
			}

			var deferred = m.deferred();
			var outstanding = args.length;
			var results = new Array(outstanding);
			if (args.length > 0) {
				for (var i = 0; i < args.length; i++) {
					args[i].then(synchronizer(i, true), synchronizer(i, false))
				}
			}
			else deferred.resolve([]);

			return deferred.promise
		};
		function identity(value) {return value}

		function ajax(options) {
			if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
				var callbackKey = "mithril_callback_" + new Date().getTime() + "_" + (Math.round(Math.random() * 1e16)).toString(36);
				var script = $document.createElement("script");

				window[callbackKey] = function(resp) {
					script.parentNode.removeChild(script);
					options.onload({
						type: "load",
						target: {
							responseText: resp
						}
					});
					window[callbackKey] = undefined
				};

				script.onerror = function(e) {
					script.parentNode.removeChild(script);

					options.onerror({
						type: "error",
						target: {
							status: 500,
							responseText: JSON.stringify({error: "Error making jsonp request"})
						}
					});
					window[callbackKey] = undefined;

					return false
				};

				script.onload = function(e) {
					return false
				};

				script.src = options.url
					+ (options.url.indexOf("?") > 0 ? "&" : "?")
					+ (options.callbackKey ? options.callbackKey : "callback")
					+ "=" + callbackKey
					+ "&" + buildQueryString(options.data || {});
				$document.body.appendChild(script)
			}
			else {
				var xhr = new window.XMLHttpRequest;
				xhr.open(options.method, options.url, true, options.user, options.password);
				xhr.onreadystatechange = function() {
					if (xhr.readyState === 4) {
						if (xhr.status >= 200 && xhr.status < 300) options.onload({type: "load", target: xhr});
						else options.onerror({type: "error", target: xhr})
					}
				};
				if (options.serialize === JSON.stringify && options.data && options.method !== "GET") {
					xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
				}
				if (options.deserialize === JSON.parse) {
					xhr.setRequestHeader("Accept", "application/json, text/*");
				}
				if (typeof options.config === FUNCTION) {
					var maybeXhr = options.config(xhr, options);
					if (maybeXhr != null) xhr = maybeXhr
				}

				var data = options.method === "GET" || !options.data ? "" : options.data
				if (data && (type.call(data) != STRING && data.constructor != window.FormData)) {
					throw "Request data should be either be a string or FormData. Check the `serialize` option in `m.request`";
				}
				xhr.send(data);
				return xhr
			}
		}
		function bindData(xhrOptions, data, serialize) {
			if (xhrOptions.method === "GET" && xhrOptions.dataType != "jsonp") {
				var prefix = xhrOptions.url.indexOf("?") < 0 ? "?" : "&";
				var querystring = buildQueryString(data);
				xhrOptions.url = xhrOptions.url + (querystring ? prefix + querystring : "")
			}
			else xhrOptions.data = serialize(data);
			return xhrOptions
		}
		function parameterizeUrl(url, data) {
			var tokens = url.match(/:[a-z]\w+/gi);
			if (tokens && data) {
				for (var i = 0; i < tokens.length; i++) {
					var key = tokens[i].slice(1);
					url = url.replace(tokens[i], data[key]);
					delete data[key]
				}
			}
			return url
		}

		m.request = function(xhrOptions) {
			if (xhrOptions.background !== true) m.startComputation();
			var deferred = new Deferred();
			var isJSONP = xhrOptions.dataType && xhrOptions.dataType.toLowerCase() === "jsonp";
			var serialize = xhrOptions.serialize = isJSONP ? identity : xhrOptions.serialize || JSON.stringify;
			var deserialize = xhrOptions.deserialize = isJSONP ? identity : xhrOptions.deserialize || JSON.parse;
			var extract = xhrOptions.extract || function(xhr) {
				return xhr.responseText.length === 0 && deserialize === JSON.parse ? null : xhr.responseText
			};
			xhrOptions.method = (xhrOptions.method || 'GET').toUpperCase();
			xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data);
			xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize);
			xhrOptions.onload = xhrOptions.onerror = function(e) {
				try {
					e = e || event;
					var unwrap = (e.type === "load" ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity;
					var response = unwrap(deserialize(extract(e.target, xhrOptions)), e.target);
					if (e.type === "load") {
						if (type.call(response) === ARRAY && xhrOptions.type) {
							for (var i = 0; i < response.length; i++) response[i] = new xhrOptions.type(response[i])
						}
						else if (xhrOptions.type) response = new xhrOptions.type(response)
					}
					deferred[e.type === "load" ? "resolve" : "reject"](response)
				}
				catch (e) {
					m.deferred.onerror(e);
					deferred.reject(e)
				}
				if (xhrOptions.background !== true) m.endComputation()
			};
			ajax(xhrOptions);
			deferred.promise = propify(deferred.promise, xhrOptions.initialValue);
			return deferred.promise
		};

		//testing API
		m.deps = function(mock) {
			initialize(window = mock || window);
			return window;
		};
		//for internal testing only, do not use `m.deps.factory`
		m.deps.factory = app;

		return m
	})(typeof window != "undefined" ? window : {});

	if (typeof module != "undefined" && module !== null && module.exports) module.exports = m;
	else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {return m}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)(module)))

/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Surface = __webpack_require__(22);
	var DomEventStreamFactory = __webpack_require__(1);

	/**
	 * Create a Supermove instance
	 */
	module.exports = function Supermove(el,options){
		options = {
			id: 'root',
			parent:'root-container',
			show: true
		};

		return m.mount(el,{
			controller: Surface.controller.bind(Surface.controller,options),
			view: Surface.view
		});

		// who doesn't this work???
		// return m.mount(el, m.component(Surface,options));
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * merge multiple layout-specification into one.
	 */
	module.exports = function merge(){
			// tmp vars for key,value,types of source and dest objects.
		var key,srcVal,destVal,srcType,destType,
			// destination is a fresh object
			dest = {}, 
			// merge all arguments
			sources = Array.prototype.slice.call(arguments,0);
		
		// loop over all layout-specs (arguments)
		for(var i = 0, len = sources.length; i < len; i++){
			if(sources[i] === null) continue;
			
			// loop over all keys (attributes)
			for(key in sources[i]){
				// init values
				srcVal = sources[i][key];
				srcType = typeof srcVal;
				destVal = dest[key];
				destType = typeof destVal;

				// merge-strategy is based on the key
				switch(key){
					// 'id' should be the same, otherwise error
					case 'id':
						if(destType !== 'undefined' && destVal !== srcVal){
							throw new Error('merging specs with different IDs! ('+destVal+' != '+srcVal+')');
						}
						dest[key] = srcVal;
						break;
					// 'parent' should be the same, otherwise error
					case 'parent':
						if(destType !== 'undefined' && destVal !== srcVal){
							throw new Error('merging specs with different parents! ('+destVal+' != '+srcVal+')');
						}
						dest[key] = srcVal;
						break;
					// 'element' is added once (i.e. add class only once)
					case 'element':
						if(!destVal || destVal.indexOf(srcVal) < 0){
							dest[key] = (destVal || '') + srcVal;
						}
						break;
					// 'opacity' is multiplied
					case 'opacity':
						dest[key] = (destVal || 1) * srcVal;
						break;

					// width/height is multiplied (%) or added (px)
					case 'width':
					case 'height':
						if(true){
							if(srcType !== 'number'){
								console.error('[dev] '+key+' is not a number!');
							}
						}
						// * for percentages (value is 0..1)
						if(srcVal <= 1.0 && srcVal >= 0.0) {
							dest[key] = (destVal || 1) * srcVal;
						// + for pixels
						} else {
							dest[key] = (destVal || 0) + srcVal;
						}
						break;

					// for all other keys
					default:
						// + for numbers
						if(srcType === 'number'){
							dest[key] = (destVal || 0) + srcVal;
						
						// concat for strings
						} else if(srcType === 'string'){
							dest[key] = (destVal || '') + srcVal;

						// && on booleans
						} else if(srcType === 'boolean'){  
							dest[key] = destType === 'boolean'? destVal && srcVal: srcVal;
						
						// concat into an array everything else
						} else {
							if(destType === 'undefined') {
								destVal = [];
							} else if(!Array.isArray(destVal)){
								destVal = [destVal];
							}
							if(srcType === 'undefined') {
								srcVal = [];
							} else if(!Array.isArray(srcVal)){
								srcVal = [srcVal];
							}
							dest[key] = destVal.concat(srcVal);
						}
				}
			}
		}
		return dest;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Kefir = __webpack_require__(12);
	var m = __webpack_require__(2);
	var callbacks = [];

	function step(time){
		var len = callbacks.length;
		if(len > 0){
			for(var i = len-1; i >= 0; i--){
				if(!callbacks[i].start) {
					callbacks[i].start = time;
				} 
				if(callbacks[i].duration > 1 && time - callbacks[i].start > callbacks[i].duration){
					callbacks[i](1);
					unsubscribe(callbacks[i]);
				} else {
					callbacks[i]((time - callbacks[i].start) / callbacks[i].duration);	
				}
			}
			m.redraw(true);
			window.requestAnimationFrame(step);
		}
	}

	function createSubscribe(duration){
		return function subscribe(callback){
			var index = callbacks.length;
			callbacks.push(callback);
			callback.duration = duration || 1;
			if(index === 0) window.requestAnimationFrame(step);
		};
	}

	function unsubscribe(callback){
		var index = callbacks.indexOf(callback);
		if(index >= 0) callbacks.splice(index,1);
	}

	module.exports = function animate(duration){
		return Kefir.fromSubUnsub(createSubscribe(duration),unsubscribe);
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Kefir = __webpack_require__(12);

	var SIZE = [window.innerWidth,window.innerHeight];

	module.exports = Kefir.fromEvent(window,'resize')
		.map(function(event){
			return [event.target.innerWidth,event.target.innerHeight];
		})
		.toProperty(SIZE);

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function tween(start,end,time){
		if(typeof time === 'undefined') {
			return tween.bind(null,start,end);
		} else if(typeof start === 'object'){
			var data = {};
			for(var key in start){
				if(key !== 'id') {
					data[key] = tween(start[key],end[key],time);
				} else {
					data[key] = start[key] || end[key];
				}
			}
			return data;
		} else if(typeof start === 'number'){
			return start + (end - start) * time;
		} else {
			return start || end;
		}
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(10);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(15)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/mark/dev/supermove/node_modules/css-loader/index.js!/Users/mark/dev/supermove/supermove.css", function() {
			var newContent = require("!!/Users/mark/dev/supermove/node_modules/css-loader/index.js!/Users/mark/dev/supermove/supermove.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(17)();
	exports.push([module.id, "\n.supermove-root {\n    width: 100%;\n    height: 100%;\n    margin: 0px;\n    padding: 0px;\n    opacity: .999999; /* ios8 hotfix */\n    overflow: hidden;\n    -webkit-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n    perspective: 500px;\n}\n\n.supermove-container {\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    bottom: 0px;\n    right: 0px;\n    overflow: visible;\n    -webkit-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n    -webkit-backface-visibility: visible;\n    backface-visibility: visible;\n    pointer-events: none;\n    perspective: 1000px;\n    perspective-origin: 0 50%;\n}\n\n.supermove-surface {\n    width: 100%;\n    height: 100%;\n    position: absolute;\n    -webkit-transform-origin: center center;\n    transform-origin: center center;\n    -webkit-backface-visibility: visible;\n    backface-visibility: visible;\n    -webkit-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n    -webkit-tap-highlight-color: transparent;\n    pointer-events: auto;\n}", ""]);

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
	if (!Function.prototype.bind) {
	  Function.prototype.bind = function (oThis) {
	    if (typeof this !== "function") {
	      // closest thing possible to the ECMAScript 5
	      // internal IsCallable function
	      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
	    }

	    var aArgs = Array.prototype.slice.call(arguments, 1), 
	        fToBind = this, 
	        fNOP = function () {},
	        fBound = function () {
	          return fToBind.apply(this instanceof fNOP && oThis
	                 ? this
	                 : oThis,
	                 aArgs.concat(Array.prototype.slice.call(arguments)));
	        };

	    fNOP.prototype = this.prototype;
	    fBound.prototype = new fNOP();

	    return fBound;
	  };
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! Kefir.js v1.3.1
	 *  https://github.com/pozadi/kefir
	 */
	;(function(global){
	  "use strict";

	  var Kefir = {};


	function and() {
	  for (var i = 0; i < arguments.length; i++) {
	    if (!arguments[i]) {
	      return arguments[i];
	    }
	  }
	  return arguments[i - 1];
	}

	function or() {
	  for (var i = 0; i < arguments.length; i++) {
	    if (arguments[i]) {
	      return arguments[i];
	    }
	  }
	  return arguments[i - 1];
	}

	function not(x) {
	  return !x;
	}

	function concat(a, b) {
	  var result, length, i, j;
	  if (a.length === 0) {
	    return b;
	  }
	  if (b.length === 0) {
	    return a;
	  }
	  j = 0;
	  result = new Array(a.length + b.length);
	  length = a.length;
	  for (i = 0; i < length; i++, j++) {
	    result[j] = a[i];
	  }
	  length = b.length;
	  for (i = 0; i < length; i++, j++) {
	    result[j] = b[i];
	  }
	  return result;
	}

	function circleShift(arr, distance) {
	  var length = arr.length
	    , result = new Array(length)
	    , i;
	  for (i = 0; i < length; i++) {
	    result[(i + distance) % length] = arr[i];
	  }
	  return result;
	}

	function find(arr, value) {
	  var length = arr.length
	    , i;
	  for (i = 0; i < length; i++) {
	    if (arr[i] === value) {
	      return i;
	    }
	  }
	  return -1;
	}

	function findByPred(arr, pred) {
	  var length = arr.length
	    , i;
	  for (i = 0; i < length; i++) {
	    if (pred(arr[i])) {
	      return i;
	    }
	  }
	  return -1;
	}

	function cloneArray(input) {
	  var length = input.length
	    , result = new Array(length)
	    , i;
	  for (i = 0; i < length; i++) {
	    result[i] = input[i];
	  }
	  return result;
	}

	function remove(input, index) {
	  var length = input.length
	    , result, i, j;
	  if (index >= 0 && index < length) {
	    if (length === 1) {
	      return [];
	    } else {
	      result = new Array(length - 1);
	      for (i = 0, j = 0; i < length; i++) {
	        if (i !== index) {
	          result[j] = input[i];
	          j++;
	        }
	      }
	      return result;
	    }
	  } else {
	    return input;
	  }
	}

	function removeByPred(input, pred) {
	  return remove(input, findByPred(input, pred));
	}

	function map(input, fn) {
	  var length = input.length
	    , result = new Array(length)
	    , i;
	  for (i = 0; i < length; i++) {
	    result[i] = fn(input[i]);
	  }
	  return result;
	}

	function forEach(arr, fn) {
	  var length = arr.length
	    , i;
	  for (i = 0; i < length; i++) {
	    fn(arr[i]);
	  }
	}

	function fillArray(arr, value) {
	  var length = arr.length
	    , i;
	  for (i = 0; i < length; i++) {
	    arr[i] = value;
	  }
	}

	function contains(arr, value) {
	  return find(arr, value) !== -1;
	}

	function rest(arr, start, onEmpty) {
	  if (arr.length > start) {
	    return Array.prototype.slice.call(arr, start);
	  }
	  return onEmpty;
	}

	function slide(cur, next, max) {
	  var length = Math.min(max, cur.length + 1),
	      offset = cur.length - length + 1,
	      result = new Array(length),
	      i;
	  for (i = offset; i < length; i++) {
	    result[i - offset] = cur[i];
	  }
	  result[length - 1] = next;
	  return result;
	}

	function isEqualArrays(a, b) {
	  var length, i;
	  if (a == null && b == null) {
	    return true;
	  }
	  if (a == null || b == null) {
	    return false;
	  }
	  if (a.length !== b.length) {
	    return false;
	  }
	  for (i = 0, length = a.length; i < length; i++) {
	    if (a[i] !== b[i]) {
	      return false;
	    }
	  }
	  return true;
	}

	function spread(fn, length) {
	  switch(length) {
	    case 0: return function(a) {return fn();};
	    case 1: return function(a) {return fn(a[0]);};
	    case 2: return function(a) {return fn(a[0], a[1]);};
	    case 3: return function(a) {return fn(a[0], a[1], a[2]);};
	    case 4: return function(a) {return fn(a[0], a[1], a[2], a[3]);};
	    default: return function(a) {return fn.apply(null, a);};
	  }
	}

	function apply(fn, c, a) {
	  var aLength = a ? a.length : 0;
	  if (c == null) {
	    switch (aLength) {
	      case 0: return fn();
	      case 1: return fn(a[0]);
	      case 2: return fn(a[0], a[1]);
	      case 3: return fn(a[0], a[1], a[2]);
	      case 4: return fn(a[0], a[1], a[2], a[3]);
	      default: return fn.apply(null, a);
	    }
	  } else {
	    switch (aLength) {
	      case 0: return fn.call(c);
	      default: return fn.apply(c, a);
	    }
	  }
	}

	function get(map, key, notFound) {
	  if (map && key in map) {
	    return map[key];
	  } else {
	    return notFound;
	  }
	}

	function own(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	function createObj(proto) {
	  var F = function() {};
	  F.prototype = proto;
	  return new F();
	}

	function extend(target /*, mixin1, mixin2...*/) {
	  var length = arguments.length
	    , i, prop;
	  for (i = 1; i < length; i++) {
	    for (prop in arguments[i]) {
	      target[prop] = arguments[i][prop];
	    }
	  }
	  return target;
	}

	function inherit(Child, Parent /*, mixin1, mixin2...*/) {
	  var length = arguments.length
	    , i;
	  Child.prototype = createObj(Parent.prototype);
	  Child.prototype.constructor = Child;
	  for (i = 2; i < length; i++) {
	    extend(Child.prototype, arguments[i]);
	  }
	  return Child;
	}

	var NOTHING = ['<nothing>'];
	var END = 'end';
	var VALUE = 'value';
	var ERROR = 'error';
	var ANY = 'any';

	function noop() {}

	function id(x) {
	  return x;
	}

	function id2(_, x) {
	  return x;
	}

	function strictEqual(a, b) {
	  return a === b;
	}

	function defaultDiff(a, b) {
	  return [a, b];
	}

	var now = Date.now ?
	  function() {
	    return Date.now();
	  } :
	  function() {
	    return new Date().getTime();
	  };

	var log = ((typeof console !== undefined) && isFn(console.log)) ?
	  function(m) {
	    console.log(m);
	  } : noop;



	Kefir.DEPRECATION_WARNINGS = true;
	function deprecated(name, alt, fn) {
	  var message = 'Method `' + name + '` is deprecated, and to be removed in v3.0.0.';
	  if (alt) {
	    message += '\nUse `' + alt + '` instead.';
	  }
	  message += '\nTo disable all warnings like this set `Kefir.DEPRECATION_WARNINGS = false`.';
	  return function() {
	    if (Kefir.DEPRECATION_WARNINGS) {
	      log(message);
	    }
	    return fn.apply(this, arguments);
	  };
	}

	function isFn(fn) {
	  return typeof fn === 'function';
	}

	function isUndefined(x) {
	  return typeof x === 'undefined';
	}

	function isArrayLike(xs) {
	  return isArray(xs) || isArguments(xs);
	}

	var isArray = Array.isArray || function(xs) {
	  return Object.prototype.toString.call(xs) === '[object Array]';
	};

	var isArguments = function(xs) {
	  return Object.prototype.toString.call(xs) === '[object Arguments]';
	};

	// For IE
	if (!isArguments(arguments)) {
	  isArguments = function(obj) {
	    return !!(obj && own(obj, 'callee'));
	  };
	}

	function withInterval(name, mixin) {

	  function AnonymousStream(wait, args) {
	    Stream.call(this);
	    this._wait = wait;
	    this._intervalId = null;
	    var $ = this;
	    this._$onTick = function() {
	      $._onTick();
	    };
	    this._init(args);
	  }

	  inherit(AnonymousStream, Stream, {

	    _name: name,

	    _init: function(args) {},
	    _free: function() {},

	    _onTick: function() {},

	    _onActivation: function() {
	      this._intervalId = setInterval(this._$onTick, this._wait);
	    },
	    _onDeactivation: function() {
	      if (this._intervalId !== null) {
	        clearInterval(this._intervalId);
	        this._intervalId = null;
	      }
	    },

	    _clear: function() {
	      Stream.prototype._clear.call(this);
	      this._$onTick = null;
	      this._free();
	    }

	  }, mixin);

	  Kefir[name] = function(wait) {
	    return new AnonymousStream(wait, rest(arguments, 1, []));
	  };
	}

	function withOneSource(name, mixin, options) {


	  options = extend({
	    streamMethod: function(StreamClass, PropertyClass) {
	      return function() {
	        return new StreamClass(this, arguments);
	      };
	    },
	    propertyMethod: function(StreamClass, PropertyClass) {
	      return function() {
	        return new PropertyClass(this, arguments);
	      };
	    }
	  }, options || {});



	  mixin = extend({
	    _init: function(args) {},
	    _free: function() {},

	    _handleValue: function(x, isCurrent) {
	      this._send(VALUE, x, isCurrent);
	    },
	    _handleError: function(x, isCurrent) {
	      this._send(ERROR, x, isCurrent);
	    },
	    _handleEnd: function(__, isCurrent) {
	      this._send(END, null, isCurrent);
	    },

	    _handleAny: function(event) {
	      switch (event.type) {
	        case VALUE: this._handleValue(event.value, event.current); break;
	        case ERROR: this._handleError(event.value, event.current); break;
	        case END: this._handleEnd(event.value, event.current); break;
	      }
	    },

	    _onActivation: function() {
	      this._source.onAny(this._$handleAny);
	    },
	    _onDeactivation: function() {
	      this._source.offAny(this._$handleAny);
	    }
	  }, mixin || {});



	  function buildClass(BaseClass) {
	    function AnonymousObservable(source, args) {
	      BaseClass.call(this);
	      this._source = source;
	      this._name = source._name + '.' + name;
	      this._init(args);
	      var $ = this;
	      this._$handleAny = function(event) {
	        $._handleAny(event);
	      };
	    }

	    inherit(AnonymousObservable, BaseClass, {
	      _clear: function() {
	        BaseClass.prototype._clear.call(this);
	        this._source = null;
	        this._$handleAny = null;
	        this._free();
	      }
	    }, mixin);

	    return AnonymousObservable;
	  }


	  var AnonymousStream = buildClass(Stream);
	  var AnonymousProperty = buildClass(Property);

	  if (options.streamMethod) {
	    Stream.prototype[name] = options.streamMethod(AnonymousStream, AnonymousProperty);
	  }

	  if (options.propertyMethod) {
	    Property.prototype[name] = options.propertyMethod(AnonymousStream, AnonymousProperty);
	  }

	}

	function withTwoSources(name, mixin /*, options*/) {

	  mixin = extend({
	    _init: function(args) {},
	    _free: function() {},

	    _handlePrimaryValue: function(x, isCurrent) {
	      this._send(VALUE, x, isCurrent);
	    },
	    _handlePrimaryError: function(x, isCurrent) {
	      this._send(ERROR, x, isCurrent);
	    },
	    _handlePrimaryEnd: function(__, isCurrent) {
	      this._send(END, null, isCurrent);
	    },

	    _handleSecondaryValue: function(x, isCurrent) {
	      this._lastSecondary = x;
	    },
	    _handleSecondaryError: function(x, isCurrent) {
	      this._send(ERROR, x, isCurrent);
	    },
	    _handleSecondaryEnd: function(__, isCurrent) {},

	    _handlePrimaryAny: function(event) {
	      switch (event.type) {
	        case VALUE:
	          this._handlePrimaryValue(event.value, event.current);
	          break;
	        case ERROR:
	          this._handlePrimaryError(event.value, event.current);
	          break;
	        case END:
	          this._handlePrimaryEnd(event.value, event.current);
	          break;
	      }
	    },
	    _handleSecondaryAny: function(event) {
	      switch (event.type) {
	        case VALUE:
	          this._handleSecondaryValue(event.value, event.current);
	          break;
	        case ERROR:
	          this._handleSecondaryError(event.value, event.current);
	          break;
	        case END:
	          this._handleSecondaryEnd(event.value, event.current);
	          this._removeSecondary();
	          break;
	      }
	    },

	    _removeSecondary: function() {
	      if (this._secondary !== null) {
	        this._secondary.offAny(this._$handleSecondaryAny);
	        this._$handleSecondaryAny = null;
	        this._secondary = null;
	      }
	    },

	    _onActivation: function() {
	      if (this._secondary !== null) {
	        this._secondary.onAny(this._$handleSecondaryAny);
	      }
	      if (this._alive) {
	        this._primary.onAny(this._$handlePrimaryAny);
	      }
	    },
	    _onDeactivation: function() {
	      if (this._secondary !== null) {
	        this._secondary.offAny(this._$handleSecondaryAny);
	      }
	      this._primary.offAny(this._$handlePrimaryAny);
	    }
	  }, mixin || {});



	  function buildClass(BaseClass) {
	    function AnonymousObservable(primary, secondary, args) {
	      BaseClass.call(this);
	      this._primary = primary;
	      this._secondary = secondary;
	      this._name = primary._name + '.' + name;
	      this._lastSecondary = NOTHING;
	      var $ = this;
	      this._$handleSecondaryAny = function(event) {
	        $._handleSecondaryAny(event);
	      };
	      this._$handlePrimaryAny = function(event) {
	        $._handlePrimaryAny(event);
	      };
	      this._init(args);
	    }

	    inherit(AnonymousObservable, BaseClass, {
	      _clear: function() {
	        BaseClass.prototype._clear.call(this);
	        this._primary = null;
	        this._secondary = null;
	        this._lastSecondary = null;
	        this._$handleSecondaryAny = null;
	        this._$handlePrimaryAny = null;
	        this._free();
	      }
	    }, mixin);

	    return AnonymousObservable;
	  }


	  var AnonymousStream = buildClass(Stream);
	  var AnonymousProperty = buildClass(Property);

	  Stream.prototype[name] = function(secondary) {
	    return new AnonymousStream(this, secondary, rest(arguments, 1, []));
	  };

	  Property.prototype[name] = function(secondary) {
	    return new AnonymousProperty(this, secondary, rest(arguments, 1, []));
	  };

	}

	// Dispatcher

	function callSubscriber(sType, sFn, event) {
	  if (sType === ANY) {
	    sFn(event);
	  } else if (sType === event.type) {
	    if (sType === VALUE || sType === ERROR) {
	      sFn(event.value);
	    } else {
	      sFn();
	    }
	  }
	}

	function Dispatcher() {
	  this._items = [];
	}

	extend(Dispatcher.prototype, {
	  add: function(type, fn) {
	    this._items = concat(this._items, [{
	      type: type,
	      fn: fn
	    }]);
	    return this._items.length;
	  },
	  remove: function(type, fn) {
	    this._items = removeByPred(this._items, function(fnData) {
	      return fnData.type === type && fnData.fn === fn;
	    });
	    return this._items.length;
	  },
	  dispatch: function(event) {
	    var items = this._items;
	    for (var i = 0; i < items.length; i++) {
	      callSubscriber(items[i].type, items[i].fn, event);
	    }
	  }
	});








	// Events

	function Event(type, value, current) {
	  return {type: type, value: value, current: !!current};
	}

	var CURRENT_END = Event(END, undefined, true);





	// Observable

	function Observable() {
	  this._dispatcher = new Dispatcher();
	  this._active = false;
	  this._alive = true;
	}
	Kefir.Observable = Observable;

	extend(Observable.prototype, {

	  _name: 'observable',

	  _onActivation: function() {},
	  _onDeactivation: function() {},

	  _setActive: function(active) {
	    if (this._active !== active) {
	      this._active = active;
	      if (active) {
	        this._onActivation();
	      } else {
	        this._onDeactivation();
	      }
	    }
	  },

	  _clear: function() {
	    this._setActive(false);
	    this._alive = false;
	    this._dispatcher = null;
	  },

	  _send: function(type, x, isCurrent) {
	    if (this._alive) {
	      this._dispatcher.dispatch(Event(type, x, isCurrent));
	      if (type === END) {
	        this._clear();
	      }
	    }
	  },

	  _on: function(type, fn) {
	    if (this._alive) {
	      this._dispatcher.add(type, fn);
	      this._setActive(true);
	    } else {
	      callSubscriber(type, fn, CURRENT_END);
	    }
	    return this;
	  },

	  _off: function(type, fn) {
	    if (this._alive) {
	      var count = this._dispatcher.remove(type, fn);
	      if (count === 0) {
	        this._setActive(false);
	      }
	    }
	    return this;
	  },

	  onValue: function(fn) {
	    return this._on(VALUE, fn);
	  },
	  onError: function(fn) {
	    return this._on(ERROR, fn);
	  },
	  onEnd: function(fn) {
	    return this._on(END, fn);
	  },
	  onAny: function(fn) {
	    return this._on(ANY, fn);
	  },

	  offValue: function(fn) {
	    return this._off(VALUE, fn);
	  },
	  offError: function(fn) {
	    return this._off(ERROR, fn);
	  },
	  offEnd: function(fn) {
	    return this._off(END, fn);
	  },
	  offAny: function(fn) {
	    return this._off(ANY, fn);
	  }

	});


	// extend() can't handle `toString` in IE8
	Observable.prototype.toString = function() {
	  return '[' + this._name + ']';
	};









	// Stream

	function Stream() {
	  Observable.call(this);
	}
	Kefir.Stream = Stream;

	inherit(Stream, Observable, {

	  _name: 'stream'

	});







	// Property

	function Property() {
	  Observable.call(this);
	  this._current = NOTHING;
	  this._currentError = NOTHING;
	}
	Kefir.Property = Property;

	inherit(Property, Observable, {

	  _name: 'property',

	  _send: function(type, x, isCurrent) {
	    if (this._alive) {
	      if (!isCurrent) {
	        this._dispatcher.dispatch(Event(type, x));
	      }
	      if (type === VALUE) {
	        this._current = x;
	      }
	      if (type === ERROR) {
	        this._currentError = x;
	      }
	      if (type === END) {
	        this._clear();
	      }
	    }
	  },

	  _on: function(type, fn) {
	    if (this._alive) {
	      this._dispatcher.add(type, fn);
	      this._setActive(true);
	    }
	    if (this._current !== NOTHING) {
	      callSubscriber(type, fn, Event(VALUE, this._current, true));
	    }
	    if (this._currentError !== NOTHING) {
	      callSubscriber(type, fn, Event(ERROR, this._currentError, true));
	    }
	    if (!this._alive) {
	      callSubscriber(type, fn, CURRENT_END);
	    }
	    return this;
	  }

	});






	// Log

	Observable.prototype.log = function(name) {
	  name = name || this.toString();

	  var handler = function(event) {
	    var typeStr = '<' + event.type + (event.current ? ':current' : '') + '>';
	    if (event.type === VALUE || event.type === ERROR) {
	      console.log(name, typeStr, event.value);
	    } else {
	      console.log(name, typeStr);
	    }
	  };

	  if (!this.__logHandlers) {
	    this.__logHandlers = [];
	  }
	  this.__logHandlers.push({name: name, handler: handler});

	  this.onAny(handler);
	  return this;
	};

	Observable.prototype.offLog = function(name) {
	  name = name || this.toString();

	  if (this.__logHandlers) {
	    var handlerIndex = findByPred(this.__logHandlers, function(obj) {
	      return obj.name === name;
	    });
	    if (handlerIndex !== -1) {
	      var handler = this.__logHandlers[handlerIndex].handler;
	      this.__logHandlers.splice(handlerIndex, 1);
	      this.offAny(handler);
	    }
	  }

	  return this;
	};



	// Kefir.withInterval()

	withInterval('withInterval', {
	  _init: function(args) {
	    this._fn = args[0];
	    var $ = this;
	    this._emitter = {
	      emit: function(x) {
	        $._send(VALUE, x);
	      },
	      error: function(x) {
	        $._send(ERROR, x);
	      },
	      end: function() {
	        $._send(END);
	      },
	      emitEvent: function(e) {
	        $._send(e.type, e.value);
	      }
	    };
	  },
	  _free: function() {
	    this._fn = null;
	    this._emitter = null;
	  },
	  _onTick: function() {
	    this._fn(this._emitter);
	  }
	});





	// Kefir.fromPoll()

	withInterval('fromPoll', {
	  _init: function(args) {
	    this._fn = args[0];
	  },
	  _free: function() {
	    this._fn = null;
	  },
	  _onTick: function() {
	    this._send(VALUE, this._fn());
	  }
	});





	// Kefir.interval()

	withInterval('interval', {
	  _init: function(args) {
	    this._x = args[0];
	  },
	  _free: function() {
	    this._x = null;
	  },
	  _onTick: function() {
	    this._send(VALUE, this._x);
	  }
	});




	// Kefir.sequentially()

	withInterval('sequentially', {
	  _init: function(args) {
	    this._xs = cloneArray(args[0]);
	    if (this._xs.length === 0) {
	      this._send(END);
	    }
	  },
	  _free: function() {
	    this._xs = null;
	  },
	  _onTick: function() {
	    switch (this._xs.length) {
	      case 1:
	        this._send(VALUE, this._xs[0]);
	        this._send(END);
	        break;
	      default:
	        this._send(VALUE, this._xs.shift());
	    }
	  }
	});




	// Kefir.repeatedly()

	withInterval('repeatedly', {
	  _init: function(args) {
	    this._xs = cloneArray(args[0]);
	    this._i = -1;
	  },
	  _onTick: function() {
	    if (this._xs.length > 0) {
	      this._i = (this._i + 1) % this._xs.length;
	      this._send(VALUE, this._xs[this._i]);
	    }
	  }
	});

	Kefir.repeatedly = deprecated(
	  'Kefir.repeatedly()',
	  'Kefir.repeat(() => Kefir.sequentially(...)})',
	  Kefir.repeatedly
	);





	// Kefir.later()

	withInterval('later', {
	  _init: function(args) {
	    this._x = args[0];
	  },
	  _free: function() {
	    this._x = null;
	  },
	  _onTick: function() {
	    this._send(VALUE, this._x);
	    this._send(END);
	  }
	});

	function _AbstractPool(options) {
	  Stream.call(this);

	  this._queueLim = get(options, 'queueLim', 0);
	  this._concurLim = get(options, 'concurLim', -1);
	  this._drop = get(options, 'drop', 'new');
	  if (this._concurLim === 0) {
	    throw new Error('options.concurLim can\'t be 0');
	  }

	  var $ = this;
	  this._$handleSubAny = function(event) {
	    $._handleSubAny(event);
	  };

	  this._queue = [];
	  this._curSources = [];
	  this._activating = false;

	  this._bindedEndHandlers = [];
	}

	inherit(_AbstractPool, Stream, {

	  _name: 'abstractPool',

	  _add: function(obj, toObs) {
	    toObs = toObs || id;
	    if (this._concurLim === -1 || this._curSources.length < this._concurLim) {
	      this._addToCur(toObs(obj));
	    } else {
	      if (this._queueLim === -1 || this._queue.length < this._queueLim) {
	        this._addToQueue(toObs(obj));
	      } else if (this._drop === 'old') {
	        this._removeOldest();
	        this._add(toObs(obj));
	      }
	    }
	  },
	  _addAll: function(obss) {
	    var $ = this;
	    forEach(obss, function(obs) {
	      $._add(obs);
	    });
	  },
	  _remove: function(obs) {
	    if (this._removeCur(obs) === -1) {
	      this._removeQueue(obs);
	    }
	  },

	  _addToQueue: function(obs) {
	    this._queue = concat(this._queue, [obs]);
	  },
	  _addToCur: function(obs) {
	    this._curSources = concat(this._curSources, [obs]);
	    if (this._active) {
	      this._subscribe(obs);
	    }
	  },
	  _subscribe: function(obs) {
	    var $ = this;

	    var onEnd = function() {
	      $._removeCur(obs);
	    };

	    this._bindedEndHandlers.push({obs: obs, handler: onEnd});

	    obs.onAny(this._$handleSubAny);
	    obs.onEnd(onEnd);
	  },
	  _unsubscribe: function(obs) {
	    obs.offAny(this._$handleSubAny);

	    var onEndI = findByPred(this._bindedEndHandlers, function(obj) {
	      return obj.obs === obs;
	    });
	    if (onEndI !== -1) {
	      var onEnd = this._bindedEndHandlers[onEndI].handler;
	      this._bindedEndHandlers.splice(onEndI, 1);
	      obs.offEnd(onEnd);
	    }
	  },
	  _handleSubAny: function(event) {
	    if (event.type === VALUE || event.type === ERROR) {
	      this._send(event.type, event.value, event.current && this._activating);
	    }
	  },

	  _removeQueue: function(obs) {
	    var index = find(this._queue, obs);
	    this._queue = remove(this._queue, index);
	    return index;
	  },
	  _removeCur: function(obs) {
	    if (this._active) {
	      this._unsubscribe(obs);
	    }
	    var index = find(this._curSources, obs);
	    this._curSources = remove(this._curSources, index);
	    if (index !== -1) {
	      if (this._queue.length !== 0) {
	        this._pullQueue();
	      } else if (this._curSources.length === 0) {
	        this._onEmpty();
	      }
	    }
	    return index;
	  },
	  _removeOldest: function() {
	    this._removeCur(this._curSources[0]);
	  },

	  _pullQueue: function() {
	    if (this._queue.length !== 0) {
	      this._queue = cloneArray(this._queue);
	      this._addToCur(this._queue.shift());
	    }
	  },

	  _onActivation: function() {
	    var sources = this._curSources
	      , i;
	    this._activating = true;
	    for (i = 0; i < sources.length; i++) {
	      if (this._active) {
	        this._subscribe(sources[i]);
	      }
	    }
	    this._activating = false;
	  },
	  _onDeactivation: function() {
	    var sources = this._curSources
	      , i;
	    for (i = 0; i < sources.length; i++) {
	      this._unsubscribe(sources[i]);
	    }
	  },

	  _isEmpty: function() {
	    return this._curSources.length === 0;
	  },
	  _onEmpty: function() {},

	  _clear: function() {
	    Stream.prototype._clear.call(this);
	    this._queue = null;
	    this._curSources = null;
	    this._$handleSubAny = null;
	    this._bindedEndHandlers = null;
	  }

	});





	// .merge()

	var MergeLike = {
	  _onEmpty: function() {
	    if (this._initialised) {
	      this._send(END, null, this._activating);
	    }
	  }
	};

	function Merge(sources) {
	  _AbstractPool.call(this);
	  if (sources.length === 0) {
	    this._send(END);
	  } else {
	    this._addAll(sources);
	  }
	  this._initialised = true;
	}

	inherit(Merge, _AbstractPool, extend({_name: 'merge'}, MergeLike));

	Kefir.merge = function(obss) {
	  return new Merge(obss);
	};

	Observable.prototype.merge = function(other) {
	  return Kefir.merge([this, other]);
	};




	// .concat()

	function Concat(sources) {
	  _AbstractPool.call(this, {concurLim: 1, queueLim: -1});
	  if (sources.length === 0) {
	    this._send(END);
	  } else {
	    this._addAll(sources);
	  }
	  this._initialised = true;
	}

	inherit(Concat, _AbstractPool, extend({_name: 'concat'}, MergeLike));

	Kefir.concat = function(obss) {
	  return new Concat(obss);
	};

	Observable.prototype.concat = function(other) {
	  return Kefir.concat([this, other]);
	};






	// .pool()

	function Pool() {
	  _AbstractPool.call(this);
	}
	Kefir.Pool = Pool;

	inherit(Pool, _AbstractPool, {

	  _name: 'pool',

	  plug: function(obs) {
	    this._add(obs);
	    return this;
	  },
	  unplug: function(obs) {
	    this._remove(obs);
	    return this;
	  }

	});

	Kefir.pool = function() {
	  return new Pool();
	};





	// .bus()

	function Bus() {
	  _AbstractPool.call(this);
	}
	Kefir.Bus = Bus;

	inherit(Bus, _AbstractPool, {

	  _name: 'bus',

	  plug: function(obs) {
	    this._add(obs);
	    return this;
	  },
	  unplug: function(obs) {
	    this._remove(obs);
	    return this;
	  },

	  emit: function(x) {
	    this._send(VALUE, x);
	    return this;
	  },
	  error: function(x) {
	    this._send(ERROR, x);
	    return this;
	  },
	  end: function() {
	    this._send(END);
	    return this;
	  },
	  emitEvent: function(event) {
	    this._send(event.type, event.value);
	  }

	});

	Kefir.bus = function() {
	  return new Bus();
	};





	// .flatMap()

	function FlatMap(source, fn, options) {
	  _AbstractPool.call(this, options);
	  this._source = source;
	  this._fn = fn || id;
	  this._mainEnded = false;
	  this._lastCurrent = null;

	  var $ = this;
	  this._$handleMainSource = function(event) {
	    $._handleMainSource(event);
	  };
	}

	inherit(FlatMap, _AbstractPool, {

	  _onActivation: function() {
	    _AbstractPool.prototype._onActivation.call(this);
	    if (this._active) {
	      this._activating = true;
	      this._source.onAny(this._$handleMainSource);
	      this._activating = false;
	    }
	  },
	  _onDeactivation: function() {
	    _AbstractPool.prototype._onDeactivation.call(this);
	    this._source.offAny(this._$handleMainSource);
	  },

	  _handleMainSource: function(event) {
	    if (event.type === VALUE) {
	      if (!event.current || this._lastCurrent !== event.value) {
	        this._add(event.value, this._fn);
	      }
	      this._lastCurrent = event.value;
	    }
	    if (event.type === ERROR) {
	      this._send(ERROR, event.value, event.current);
	    }
	    if (event.type === END) {
	      if (this._isEmpty()) {
	        this._send(END, null, event.current);
	      } else {
	        this._mainEnded = true;
	      }
	    }
	  },

	  _onEmpty: function() {
	    if (this._mainEnded) {
	      this._send(END);
	    }
	  },

	  _clear: function() {
	    _AbstractPool.prototype._clear.call(this);
	    this._source = null;
	    this._lastCurrent = null;
	    this._$handleMainSource = null;
	  }

	});

	Observable.prototype.flatMap = function(fn) {
	  return new FlatMap(this, fn)
	    .setName(this, 'flatMap');
	};

	Observable.prototype.flatMapLatest = function(fn) {
	  return new FlatMap(this, fn, {concurLim: 1, drop: 'old'})
	    .setName(this, 'flatMapLatest');
	};

	Observable.prototype.flatMapFirst = function(fn) {
	  return new FlatMap(this, fn, {concurLim: 1})
	    .setName(this, 'flatMapFirst');
	};

	Observable.prototype.flatMapConcat = function(fn) {
	  return new FlatMap(this, fn, {queueLim: -1, concurLim: 1})
	    .setName(this, 'flatMapConcat');
	};

	Observable.prototype.flatMapConcurLimit = function(fn, limit) {
	  var result;
	  if (limit === 0) {
	    result = Kefir.never();
	  } else {
	    if (limit < 0) {
	      limit = -1;
	    }
	    result = new FlatMap(this, fn, {queueLim: -1, concurLim: limit});
	  }
	  return result.setName(this, 'flatMapConcurLimit');
	};






	// .zip()

	function Zip(sources, combinator) {
	  Stream.call(this);
	  if (sources.length === 0) {
	    this._send(END);
	  } else {
	    this._buffers = map(sources, function(source) {
	      return isArray(source) ? cloneArray(source) : [];
	    });
	    this._sources = map(sources, function(source) {
	      return isArray(source) ? Kefir.never() : source;
	    });
	    this._combinator = combinator ? spread(combinator, this._sources.length) : id;
	    this._aliveCount = 0;

	    this._bindedHandlers = Array(this._sources.length);
	    for (var i = 0; i < this._sources.length; i++) {
	      this._bindedHandlers[i] = this._bindHandleAny(i);
	    }

	  }
	}


	inherit(Zip, Stream, {

	  _name: 'zip',

	  _onActivation: function() {
	    var i, length = this._sources.length;
	    this._drainArrays();
	    this._aliveCount = length;
	    for (i = 0; i < length; i++) {
	      if (this._active) {
	        this._sources[i].onAny(this._bindedHandlers[i]);
	      }
	    }
	  },

	  _onDeactivation: function() {
	    for (var i = 0; i < this._sources.length; i++) {
	      this._sources[i].offAny(this._bindedHandlers[i]);
	    }
	  },

	  _emit: function(isCurrent) {
	    var values = new Array(this._buffers.length);
	    for (var i = 0; i < this._buffers.length; i++) {
	      values[i] = this._buffers[i].shift();
	    }
	    this._send(VALUE, this._combinator(values), isCurrent);
	  },

	  _isFull: function() {
	    for (var i = 0; i < this._buffers.length; i++) {
	      if (this._buffers[i].length === 0) {
	        return false;
	      }
	    }
	    return true;
	  },

	  _emitIfFull: function(isCurrent) {
	    if (this._isFull()) {
	      this._emit(isCurrent);
	    }
	  },

	  _drainArrays: function() {
	    while (this._isFull()) {
	      this._emit(true);
	    }
	  },

	  _bindHandleAny: function(i) {
	    var $ = this;
	    return function(event) {
	      $._handleAny(i, event);
	    };
	  },

	  _handleAny: function(i, event) {
	    if (event.type === VALUE) {
	      this._buffers[i].push(event.value);
	      this._emitIfFull(event.current);
	    }
	    if (event.type === ERROR) {
	      this._send(ERROR, event.value, event.current);
	    }
	    if (event.type === END) {
	      this._aliveCount--;
	      if (this._aliveCount === 0) {
	        this._send(END, null, event.current);
	      }
	    }
	  },

	  _clear: function() {
	    Stream.prototype._clear.call(this);
	    this._sources = null;
	    this._buffers = null;
	    this._combinator = null;
	    this._bindedHandlers = null;
	  }

	});

	Kefir.zip = function(sources, combinator) {
	  return new Zip(sources, combinator);
	};

	Observable.prototype.zip = function(other, combinator) {
	  return new Zip([this, other], combinator);
	};






	// .combine()

	function Combine(active, passive, combinator) {
	  Stream.call(this);
	  if (active.length === 0) {
	    this._send(END);
	  } else {
	    this._activeCount = active.length;
	    this._sources = concat(active, passive);
	    this._combinator = combinator ? spread(combinator, this._sources.length) : id;
	    this._aliveCount = 0;
	    this._currents = new Array(this._sources.length);
	    fillArray(this._currents, NOTHING);
	    this._activating = false;
	    this._emitAfterActivation = false;
	    this._endAfterActivation = false;

	    this._bindedHandlers = Array(this._sources.length);
	    for (var i = 0; i < this._sources.length; i++) {
	      this._bindedHandlers[i] = this._bindHandleAny(i);
	    }

	  }
	}


	inherit(Combine, Stream, {

	  _name: 'combine',

	  _onActivation: function() {
	    var length = this._sources.length,
	        i;
	    this._aliveCount = this._activeCount;
	    this._activating = true;
	    for (i = 0; i < length; i++) {
	      this._sources[i].onAny(this._bindedHandlers[i]);
	    }
	    this._activating = false;
	    if (this._emitAfterActivation) {
	      this._emitAfterActivation = false;
	      this._emitIfFull(true);
	    }
	    if (this._endAfterActivation) {
	      this._send(END, null, true);
	    }
	  },

	  _onDeactivation: function() {
	    var length = this._sources.length,
	        i;
	    for (i = 0; i < length; i++) {
	      this._sources[i].offAny(this._bindedHandlers[i]);
	    }
	  },

	  _emitIfFull: function(isCurrent) {
	    if (!contains(this._currents, NOTHING)) {
	      var combined = cloneArray(this._currents);
	      combined = this._combinator(combined);
	      this._send(VALUE, combined, isCurrent);
	    }
	  },

	  _bindHandleAny: function(i) {
	    var $ = this;
	    return function(event) {
	      $._handleAny(i, event);
	    };
	  },

	  _handleAny: function(i, event) {
	    if (event.type === VALUE) {
	      this._currents[i] = event.value;
	      if (i < this._activeCount) {
	        if (this._activating) {
	          this._emitAfterActivation = true;
	        } else {
	          this._emitIfFull(event.current);
	        }
	      }
	    }
	    if (event.type === ERROR) {
	      this._send(ERROR, event.value, event.current);
	    }
	    if (event.type === END) {
	      if (i < this._activeCount) {
	        this._aliveCount--;
	        if (this._aliveCount === 0) {
	          if (this._activating) {
	            this._endAfterActivation = true;
	          } else {
	            this._send(END, null, event.current);
	          }
	        }
	      }
	    }
	  },

	  _clear: function() {
	    Stream.prototype._clear.call(this);
	    this._sources = null;
	    this._currents = null;
	    this._combinator = null;
	    this._bindedHandlers = null;
	  }

	});

	Kefir.combine = function(active, passive, combinator) {
	  if (isFn(passive)) {
	    combinator = passive;
	    passive = null;
	  }
	  return new Combine(active, passive || [], combinator);
	};

	Observable.prototype.combine = function(other, combinator) {
	  return Kefir.combine([this, other], combinator);
	};






	// .sampledBy()
	Kefir.sampledBy = deprecated(
	  'Kefir.sampledBy()',
	  'Kefir.combine(active, passive, combinator)',
	  function(passive, active, combinator) {

	    // we need to flip `passive` and `active` in combinator function
	    var _combinator = combinator;
	    if (passive.length > 0) {
	      var passiveLength = passive.length;
	      _combinator = function() {
	        var args = circleShift(arguments, passiveLength);
	        return combinator ? apply(combinator, null, args) : args;
	      };
	    }

	    return new Combine(active, passive, _combinator).setName('sampledBy');
	  }
	);

	Observable.prototype.sampledBy = function(other, combinator) {
	  var _combinator;
	  if (combinator) {
	    _combinator = function(active, passive) {
	      return combinator(passive, active);
	    };
	  }
	  return new Combine([other], [this], _combinator || id2).setName(this, 'sampledBy');
	};

	function produceStream(StreamClass, PropertyClass) {
	  return function() {
	    return new StreamClass(this, arguments);
	  };
	}
	function produceProperty(StreamClass, PropertyClass) {
	  return function() {
	    return new PropertyClass(this, arguments);
	  };
	}



	// .toProperty()

	withOneSource('toProperty', {
	  _init: function(args) {
	    if (args.length > 0) {
	      this._send(VALUE, args[0]);
	    }
	  }
	}, {propertyMethod: produceProperty, streamMethod: produceProperty});





	// .changes()

	withOneSource('changes', {
	  _handleValue: function(x, isCurrent) {
	    if (!isCurrent) {
	      this._send(VALUE, x);
	    }
	  },
	  _handleError: function(x, isCurrent) {
	    if (!isCurrent) {
	      this._send(ERROR, x);
	    }
	  }
	}, {
	  streamMethod: function() {
	    return function() {
	      return this;
	    };
	  },
	  propertyMethod: produceStream
	});




	// .withHandler()

	withOneSource('withHandler', {
	  _init: function(args) {
	    this._handler = args[0];
	    this._forcedCurrent = false;
	    var $ = this;
	    this._emitter = {
	      emit: function(x) {
	        $._send(VALUE, x, $._forcedCurrent);
	      },
	      error: function(x) {
	        $._send(ERROR, x, $._forcedCurrent);
	      },
	      end: function() {
	        $._send(END, null, $._forcedCurrent);
	      },
	      emitEvent: function(e) {
	        $._send(e.type, e.value, $._forcedCurrent);
	      }
	    };
	  },
	  _free: function() {
	    this._handler = null;
	    this._emitter = null;
	  },
	  _handleAny: function(event) {
	    this._forcedCurrent = event.current;
	    this._handler(this._emitter, event);
	    this._forcedCurrent = false;
	  }
	});




	// .flatten(fn)

	withOneSource('flatten', {
	  _init: function(args) {
	    this._fn = args[0] ? args[0] : id;
	  },
	  _free: function() {
	    this._fn = null;
	  },
	  _handleValue: function(x, isCurrent) {
	    var xs = this._fn(x);
	    for (var i = 0; i < xs.length; i++) {
	      this._send(VALUE, xs[i], isCurrent);
	    }
	  }
	});







	// .transduce(transducer)

	var TRANSFORM_METHODS_OLD = {
	  step: 'step',
	  result: 'result'
	};

	var TRANSFORM_METHODS_NEW = {
	  step: '@@transducer/step',
	  result: '@@transducer/result'
	};


	function xformForObs(obs) {
	  function step(res, input) {
	    obs._send(VALUE, input, obs._forcedCurrent);
	    return null;
	  }
	  function result(res) {
	    obs._send(END, null, obs._forcedCurrent);
	    return null;
	  }
	  return {
	    step: step,
	    result: result,
	    '@@transducer/step': step,
	    '@@transducer/result': result
	  };
	}

	withOneSource('transduce', {
	  _init: function(args) {
	    var xf = args[0](xformForObs(this));
	    if (isFn(xf[TRANSFORM_METHODS_NEW.step]) && isFn(xf[TRANSFORM_METHODS_NEW.result])) {
	      this._transformMethods = TRANSFORM_METHODS_NEW;
	    } else if (isFn(xf[TRANSFORM_METHODS_OLD.step]) && isFn(xf[TRANSFORM_METHODS_OLD.result])) {
	      this._transformMethods = TRANSFORM_METHODS_OLD;
	    } else {
	      throw new Error('Unsuported transducers protocol');
	    }
	    this._xform = xf;
	  },
	  _free: function() {
	    this._xform = null;
	    this._transformMethods = null;
	  },
	  _handleValue: function(x, isCurrent) {
	    this._forcedCurrent = isCurrent;
	    if (this._xform[this._transformMethods.step](null, x) !== null) {
	      this._xform[this._transformMethods.result](null);
	    }
	    this._forcedCurrent = false;
	  },
	  _handleEnd: function(__, isCurrent) {
	    this._forcedCurrent = isCurrent;
	    this._xform[this._transformMethods.result](null);
	    this._forcedCurrent = false;
	  }
	});








	// .map(fn)

	withOneSource('map', {
	  _init: function(args) {
	    this._fn = args[0] || id;
	  },
	  _free: function() {
	    this._fn = null;
	  },
	  _handleValue: function(x, isCurrent) {
	    this._send(VALUE, this._fn(x), isCurrent);
	  }
	});




	// .mapErrors(fn)

	withOneSource('mapErrors', {
	  _init: function(args) {
	    this._fn = args[0] || id;
	  },
	  _free: function() {
	    this._fn = null;
	  },
	  _handleError: function(x, isCurrent) {
	    this._send(ERROR, this._fn(x), isCurrent);
	  }
	});



	// .errorsToValues(fn)

	function defaultErrorsToValuesHandler(x) {
	  return {
	    convert: true,
	    value: x
	  };
	}

	withOneSource('errorsToValues', {
	  _init: function(args) {
	    this._fn = args[0] || defaultErrorsToValuesHandler;
	  },
	  _free: function() {
	    this._fn = null;
	  },
	  _handleError: function(x, isCurrent) {
	    var result = this._fn(x);
	    var type = result.convert ? VALUE : ERROR;
	    var newX = result.convert ? result.value : x;
	    this._send(type, newX, isCurrent);
	  }
	});



	// .valuesToErrors(fn)

	function defaultValuesToErrorsHandler(x) {
	  return {
	    convert: true,
	    error: x
	  };
	}

	withOneSource('valuesToErrors', {
	  _init: function(args) {
	    this._fn = args[0] || defaultValuesToErrorsHandler;
	  },
	  _free: function() {
	    this._fn = null;
	  },
	  _handleValue: function(x, isCurrent) {
	    var result = this._fn(x);
	    var type = result.convert ? ERROR : VALUE;
	    var newX = result.convert ? result.error : x;
	    this._send(type, newX, isCurrent);
	  }
	});




	// .filter(fn)

	withOneSource('filter', {
	  _init: function(args) {
	    this._fn = args[0] || id;
	  },
	  _free: function() {
	    this._fn = null;
	  },
	  _handleValue: function(x, isCurrent) {
	    if (this._fn(x)) {
	      this._send(VALUE, x, isCurrent);
	    }
	  }
	});




	// .filterErrors(fn)

	withOneSource('filterErrors', {
	  _init: function(args) {
	    this._fn = args[0] || id;
	  },
	  _free: function() {
	    this._fn = null;
	  },
	  _handleError: function(x, isCurrent) {
	    if (this._fn(x)) {
	      this._send(ERROR, x, isCurrent);
	    }
	  }
	});




	// .takeWhile(fn)

	withOneSource('takeWhile', {
	  _init: function(args) {
	    this._fn = args[0] || id;
	  },
	  _free: function() {
	    this._fn = null;
	  },
	  _handleValue: function(x, isCurrent) {
	    if (this._fn(x)) {
	      this._send(VALUE, x, isCurrent);
	    } else {
	      this._send(END, null, isCurrent);
	    }
	  }
	});





	// .take(n)

	withOneSource('take', {
	  _init: function(args) {
	    this._n = args[0];
	    if (this._n <= 0) {
	      this._send(END);
	    }
	  },
	  _handleValue: function(x, isCurrent) {
	    this._n--;
	    this._send(VALUE, x, isCurrent);
	    if (this._n === 0) {
	      this._send(END, null, isCurrent);
	    }
	  }
	});





	// .skip(n)

	withOneSource('skip', {
	  _init: function(args) {
	    this._n = Math.max(0, args[0]);
	  },
	  _handleValue: function(x, isCurrent) {
	    if (this._n === 0) {
	      this._send(VALUE, x, isCurrent);
	    } else {
	      this._n--;
	    }
	  }
	});




	// .skipDuplicates([fn])

	withOneSource('skipDuplicates', {
	  _init: function(args) {
	    this._fn = args[0] || strictEqual;
	    this._prev = NOTHING;
	  },
	  _free: function() {
	    this._fn = null;
	    this._prev = null;
	  },
	  _handleValue: function(x, isCurrent) {
	    if (this._prev === NOTHING || !this._fn(this._prev, x)) {
	      this._prev = x;
	      this._send(VALUE, x, isCurrent);
	    }
	  }
	});





	// .skipWhile(fn)

	withOneSource('skipWhile', {
	  _init: function(args) {
	    this._fn = args[0] || id;
	    this._skip = true;
	  },
	  _free: function() {
	    this._fn = null;
	  },
	  _handleValue: function(x, isCurrent) {
	    if (!this._skip) {
	      this._send(VALUE, x, isCurrent);
	      return;
	    }
	    if (!this._fn(x)) {
	      this._skip = false;
	      this._fn = null;
	      this._send(VALUE, x, isCurrent);
	    }
	  }
	});





	// .diff(fn, seed)

	withOneSource('diff', {
	  _init: function(args) {
	    this._fn = args[0] || defaultDiff;
	    this._prev = args.length > 1 ? args[1] : NOTHING;
	  },
	  _free: function() {
	    this._prev = null;
	    this._fn = null;
	  },
	  _handleValue: function(x, isCurrent) {
	    if (this._prev !== NOTHING) {
	      this._send(VALUE, this._fn(this._prev, x), isCurrent);
	    }
	    this._prev = x;
	  }
	});





	// .scan(fn, seed)

	withOneSource('scan', {
	  _init: function(args) {
	    this._fn = args[0];
	    if (args.length > 1) {
	      this._send(VALUE, args[1], true);
	    }
	  },
	  _free: function() {
	    this._fn = null;
	  },
	  _handleValue: function(x, isCurrent) {
	    if (this._current !== NOTHING) {
	      x = this._fn(this._current, x);
	    }
	    this._send(VALUE, x, isCurrent);
	  }
	}, {streamMethod: produceProperty});





	// .reduce(fn, seed)

	withOneSource('reduce', {
	  _init: function(args) {
	    this._fn = args[0];
	    this._result = args.length > 1 ? args[1] : NOTHING;
	  },
	  _free: function() {
	    this._fn = null;
	    this._result = null;
	  },
	  _handleValue: function(x) {
	    this._result = (this._result === NOTHING) ? x : this._fn(this._result, x);
	  },
	  _handleEnd: function(__, isCurrent) {
	    if (this._result !== NOTHING) {
	      this._send(VALUE, this._result, isCurrent);
	    }
	    this._send(END, null, isCurrent);
	  }
	});




	// .mapEnd(fn)

	withOneSource('mapEnd', {
	  _init: function(args) {
	    this._fn = args[0];
	  },
	  _free: function() {
	    this._fn = null;
	  },
	  _handleEnd: function(__, isCurrent) {
	    this._send(VALUE, this._fn(), isCurrent);
	    this._send(END, null, isCurrent);
	  }
	});




	// .skipValue()

	withOneSource('skipValues', {
	  _handleValue: function() {}
	});



	// .skipError()

	withOneSource('skipErrors', {
	  _handleError: function() {}
	});



	// .skipEnd()

	withOneSource('skipEnd', {
	  _handleEnd: function() {}
	});



	// .endOnError()

	withOneSource('endOnError', {
	  _handleError: function(x, isCurrent) {
	    this._send(ERROR, x, isCurrent);
	    this._send(END, null, isCurrent);
	  }
	});



	// .slidingWindow(max[, min])

	withOneSource('slidingWindow', {
	  _init: function(args) {
	    this._max = args[0];
	    this._min = args[1] || 0;
	    this._buff = [];
	  },
	  _free: function() {
	    this._buff = null;
	  },
	  _handleValue: function(x, isCurrent) {
	    this._buff = slide(this._buff, x, this._max);
	    if (this._buff.length >= this._min) {
	      this._send(VALUE, this._buff, isCurrent);
	    }
	  }
	});




	// .bufferWhile([predicate], [options])

	withOneSource('bufferWhile', {
	  _init: function(args) {
	    this._fn = args[0] || id;
	    this._flushOnEnd = get(args[1], 'flushOnEnd', true);
	    this._buff = [];
	  },
	  _free: function() {
	    this._buff = null;
	  },
	  _flush: function(isCurrent) {
	    if (this._buff !== null && this._buff.length !== 0) {
	      this._send(VALUE, this._buff, isCurrent);
	      this._buff = [];
	    }
	  },
	  _handleValue: function(x, isCurrent) {
	    this._buff.push(x);
	    if (!this._fn(x)) {
	      this._flush(isCurrent);
	    }
	  },
	  _handleEnd: function(x, isCurrent) {
	    if (this._flushOnEnd) {
	      this._flush(isCurrent);
	    }
	    this._send(END, null, isCurrent);
	  }
	});





	// .debounce(wait, {immediate})

	withOneSource('debounce', {
	  _init: function(args) {
	    this._wait = Math.max(0, args[0]);
	    this._immediate = get(args[1], 'immediate', false);
	    this._lastAttempt = 0;
	    this._timeoutId = null;
	    this._laterValue = null;
	    this._endLater = false;
	    var $ = this;
	    this._$later = function() {
	      $._later();
	    };
	  },
	  _free: function() {
	    this._laterValue = null;
	    this._$later = null;
	  },
	  _handleValue: function(x, isCurrent) {
	    if (isCurrent) {
	      this._send(VALUE, x, isCurrent);
	    } else {
	      this._lastAttempt = now();
	      if (this._immediate && !this._timeoutId) {
	        this._send(VALUE, x);
	      }
	      if (!this._timeoutId) {
	        this._timeoutId = setTimeout(this._$later, this._wait);
	      }
	      if (!this._immediate) {
	        this._laterValue = x;
	      }
	    }
	  },
	  _handleEnd: function(__, isCurrent) {
	    if (isCurrent) {
	      this._send(END, null, isCurrent);
	    } else {
	      if (this._timeoutId && !this._immediate) {
	        this._endLater = true;
	      } else {
	        this._send(END);
	      }
	    }
	  },
	  _later: function() {
	    var last = now() - this._lastAttempt;
	    if (last < this._wait && last >= 0) {
	      this._timeoutId = setTimeout(this._$later, this._wait - last);
	    } else {
	      this._timeoutId = null;
	      if (!this._immediate) {
	        this._send(VALUE, this._laterValue);
	        this._laterValue = null;
	      }
	      if (this._endLater) {
	        this._send(END);
	      }
	    }
	  }
	});





	// .throttle(wait, {leading, trailing})

	withOneSource('throttle', {
	  _init: function(args) {
	    this._wait = Math.max(0, args[0]);
	    this._leading = get(args[1], 'leading', true);
	    this._trailing = get(args[1], 'trailing', true);
	    this._trailingValue = null;
	    this._timeoutId = null;
	    this._endLater = false;
	    this._lastCallTime = 0;
	    var $ = this;
	    this._$trailingCall = function() {
	      $._trailingCall();
	    };
	  },
	  _free: function() {
	    this._trailingValue = null;
	    this._$trailingCall = null;
	  },
	  _handleValue: function(x, isCurrent) {
	    if (isCurrent) {
	      this._send(VALUE, x, isCurrent);
	    } else {
	      var curTime = now();
	      if (this._lastCallTime === 0 && !this._leading) {
	        this._lastCallTime = curTime;
	      }
	      var remaining = this._wait - (curTime - this._lastCallTime);
	      if (remaining <= 0) {
	        this._cancelTraling();
	        this._lastCallTime = curTime;
	        this._send(VALUE, x);
	      } else if (this._trailing) {
	        this._cancelTraling();
	        this._trailingValue = x;
	        this._timeoutId = setTimeout(this._$trailingCall, remaining);
	      }
	    }
	  },
	  _handleEnd: function(__, isCurrent) {
	    if (isCurrent) {
	      this._send(END, null, isCurrent);
	    } else {
	      if (this._timeoutId) {
	        this._endLater = true;
	      } else {
	        this._send(END);
	      }
	    }
	  },
	  _cancelTraling: function() {
	    if (this._timeoutId !== null) {
	      clearTimeout(this._timeoutId);
	      this._timeoutId = null;
	    }
	  },
	  _trailingCall: function() {
	    this._send(VALUE, this._trailingValue);
	    this._timeoutId = null;
	    this._trailingValue = null;
	    this._lastCallTime = !this._leading ? 0 : now();
	    if (this._endLater) {
	      this._send(END);
	    }
	  }
	});





	// .delay()

	withOneSource('delay', {
	  _init: function(args) {
	    this._wait = Math.max(0, args[0]);
	    this._buff = [];
	    var $ = this;
	    this._$shiftBuff = function() {
	      $._send(VALUE, $._buff.shift());
	    };
	  },
	  _free: function() {
	    this._buff = null;
	    this._$shiftBuff = null;
	  },
	  _handleValue: function(x, isCurrent) {
	    if (isCurrent) {
	      this._send(VALUE, x, isCurrent);
	    } else {
	      this._buff.push(x);
	      setTimeout(this._$shiftBuff, this._wait);
	    }
	  },
	  _handleEnd: function(__, isCurrent) {
	    if (isCurrent) {
	      this._send(END, null, isCurrent);
	    } else {
	      var $ = this;
	      setTimeout(function() {
	        $._send(END);
	      }, this._wait);
	    }
	  }
	});

	// Kefir.fromBinder(fn)

	function FromBinder(fn) {
	  Stream.call(this);
	  this._fn = fn;
	  this._unsubscribe = null;
	}

	inherit(FromBinder, Stream, {

	  _name: 'fromBinder',

	  _onActivation: function() {
	    var $ = this
	      , isCurrent = true
	      , emitter = {
	        emit: function(x) {
	          $._send(VALUE, x, isCurrent);
	        },
	        error: function(x) {
	          $._send(ERROR, x, isCurrent);
	        },
	        end: function() {
	          $._send(END, null, isCurrent);
	        },
	        emitEvent: function(e) {
	          $._send(e.type, e.value, isCurrent);
	        }
	      };
	    this._unsubscribe = this._fn(emitter) || null;

	    // fix https://github.com/pozadi/kefir/issues/35
	    if (!this._active && this._unsubscribe !== null) {
	      this._unsubscribe();
	      this._unsubscribe = null;
	    }

	    isCurrent = false;
	  },
	  _onDeactivation: function() {
	    if (this._unsubscribe !== null) {
	      this._unsubscribe();
	      this._unsubscribe = null;
	    }
	  },

	  _clear: function() {
	    Stream.prototype._clear.call(this);
	    this._fn = null;
	  }

	});

	Kefir.fromBinder = function(fn) {
	  return new FromBinder(fn);
	};






	// Kefir.emitter()

	function Emitter() {
	  Stream.call(this);
	}

	inherit(Emitter, Stream, {
	  _name: 'emitter',
	  emit: function(x) {
	    this._send(VALUE, x);
	    return this;
	  },
	  error: function(x) {
	    this._send(ERROR, x);
	    return this;
	  },
	  end: function() {
	    this._send(END);
	    return this;
	  },
	  emitEvent: function(event) {
	    this._send(event.type, event.value);
	  }
	});

	Kefir.emitter = function() {
	  return new Emitter();
	};

	Kefir.Emitter = Emitter;







	// Kefir.never()

	var neverObj = new Stream();
	neverObj._send(END);
	neverObj._name = 'never';
	Kefir.never = function() {
	  return neverObj;
	};





	// Kefir.constant(x)

	function Constant(x) {
	  Property.call(this);
	  this._send(VALUE, x);
	  this._send(END);
	}

	inherit(Constant, Property, {
	  _name: 'constant'
	});

	Kefir.constant = function(x) {
	  return new Constant(x);
	};




	// Kefir.constantError(x)

	function ConstantError(x) {
	  Property.call(this);
	  this._send(ERROR, x);
	  this._send(END);
	}

	inherit(ConstantError, Property, {
	  _name: 'constantError'
	});

	Kefir.constantError = function(x) {
	  return new ConstantError(x);
	};




	// Kefir.repeat(generator)

	function Repeat(generator) {
	  Stream.call(this);
	  this._generator = generator;
	  this._source = null;
	  this._inLoop = false;
	  this._activating = false;
	  this._iteration = 0;

	  var $ = this;
	  this._$handleAny = function(event) {
	    $._handleAny(event);
	  };
	}

	inherit(Repeat, Stream, {

	  _name: 'repeat',

	  _handleAny: function(event) {
	    if (event.type === END) {
	      this._source = null;
	      this._startLoop();
	    } else {
	      this._send(event.type, event.value, this._activating);
	    }
	  },

	  _startLoop: function() {
	    if (!this._inLoop) {
	      this._inLoop = true;
	      while (this._source === null && this._alive && this._active) {
	        this._source = this._generator(this._iteration++);
	        if (this._source) {
	          this._source.onAny(this._$handleAny);
	        } else {
	          this._send(END);
	        }
	      }
	      this._inLoop = false;
	    }
	  },

	  _onActivation: function() {
	    this._activating = true;
	    if (this._source) {
	      this._source.onAny(this._$handleAny);
	    } else {
	      this._startLoop();
	    }
	    this._activating = false;
	  },

	  _onDeactivation: function() {
	    if (this._source) {
	      this._source.offAny(this._$handleAny);
	    }
	  },

	  _clear: function() {
	    Stream.prototype._clear.call(this);
	    this._generator = null;
	    this._source = null;
	    this._$handleAny = null;
	  }

	});

	Kefir.repeat = function(generator) {
	  return new Repeat(generator);
	};



	// .setName

	Observable.prototype.setName = function(sourceObs, selfName /* or just selfName */) {
	  this._name = selfName ? sourceObs._name + '.' + selfName : sourceObs;
	  return this;
	};



	// .mapTo

	Observable.prototype.mapTo = deprecated(
	  '.mapTo()',
	  '.map(() => value)',
	  function(value) {
	    return this.map(function() {
	      return value;
	    }).setName(this, 'mapTo');
	  }
	);



	// .pluck

	Observable.prototype.pluck = deprecated(
	  '.pluck()',
	  '.map((v) => v.prop)',
	  function(propertyName) {
	    return this.map(function(x) {
	      return x[propertyName];
	    }).setName(this, 'pluck');
	  }
	);



	// .invoke

	Observable.prototype.invoke = deprecated(
	  '.invoke()',
	  '.map((v) => v.method())',
	  function(methodName /*, arg1, arg2... */) {
	    var args = rest(arguments, 1);
	    return this.map(args ?
	      function(x) {
	        return apply(x[methodName], x, args);
	      } :
	      function(x) {
	        return x[methodName]();
	      }
	    ).setName(this, 'invoke');
	  }
	);




	// .timestamp

	Observable.prototype.timestamp = deprecated(
	  '.timestamp()',
	  '.map((v) => {value: v, time: (new Date).getTime()})',
	  function() {
	    return this.map(function(x) {
	      return {value: x, time: now()};
	    }).setName(this, 'timestamp');
	  }
	);




	// .tap

	Observable.prototype.tap = deprecated(
	  '.tap()',
	  '.map((v) => {fn(v); return v})',
	  function(fn) {
	    return this.map(function(x) {
	      fn(x);
	      return x;
	    }).setName(this, 'tap');
	  }
	);




	// .and

	Kefir.and = deprecated(
	  'Kefir.and()',
	  'Kefir.combine([a, b], (a, b) => a && b)',
	  function(observables) {
	    return Kefir.combine(observables, and).setName('and');
	  }
	);

	Observable.prototype.and = deprecated(
	  '.and()',
	  '.combine(other, (a, b) => a && b)',
	  function(other) {
	    return this.combine(other, and).setName('and');
	  }
	);



	// .or

	Kefir.or = deprecated(
	  'Kefir.or()',
	  'Kefir.combine([a, b], (a, b) => a || b)',
	  function(observables) {
	    return Kefir.combine(observables, or).setName('or');
	  }
	);

	Observable.prototype.or = deprecated(
	  '.or()',
	  '.combine(other, (a, b) => a || b)',
	  function(other) {
	    return this.combine(other, or).setName('or');
	  }
	);



	// .not

	Observable.prototype.not = deprecated(
	  '.not()',
	  '.map(v => !v)',
	  function() {
	    return this.map(not).setName(this, 'not');
	  }
	);



	// .awaiting

	Observable.prototype.awaiting = function(other) {
	  return Kefir.merge([
	    this.mapTo(true),
	    other.mapTo(false)
	  ]).skipDuplicates().toProperty(false).setName(this, 'awaiting');
	};




	// .fromCallback

	Kefir.fromCallback = function(callbackConsumer) {
	  var called = false;
	  return Kefir.fromBinder(function(emitter) {
	    if (!called) {
	      callbackConsumer(function(x) {
	        emitter.emit(x);
	        emitter.end();
	      });
	      called = true;
	    }
	  }).setName('fromCallback');
	};




	// .fromNodeCallback

	Kefir.fromNodeCallback = function(callbackConsumer) {
	  var called = false;
	  return Kefir.fromBinder(function(emitter) {
	    if (!called) {
	      callbackConsumer(function(error, x) {
	        if (error) {
	          emitter.error(error);
	        } else {
	          emitter.emit(x);
	        }
	        emitter.end();
	      });
	      called = true;
	    }
	  }).setName('fromNodeCallback');
	};




	// .fromPromise

	Kefir.fromPromise = function(promise) {
	  var called = false;
	  return Kefir.fromBinder(function(emitter) {
	    if (!called) {
	      var onValue = function(x) {
	        emitter.emit(x);
	        emitter.end();
	      };
	      var onError = function(x) {
	        emitter.error(x);
	        emitter.end();
	      };
	      var _promise = promise.then(onValue, onError);

	      // prevent promise/A+ libraries like Q to swallow exceptions
	      if (_promise && isFn(_promise.done)) {
	        _promise.done();
	      }

	      called = true;
	    }
	  }).toProperty().setName('fromPromise');
	};






	// .fromSubUnsub

	Kefir.fromSubUnsub = function(sub, unsub, transformer) {
	  return Kefir.fromBinder(function(emitter) {
	    var handler = transformer ? function() {
	      emitter.emit(apply(transformer, this, arguments));
	    } : emitter.emit;
	    sub(handler);
	    return function() {
	      unsub(handler);
	    };
	  });
	};




	// .fromEvent

	var subUnsubPairs = [
	  ['addEventListener', 'removeEventListener'],
	  ['addListener', 'removeListener'],
	  ['on', 'off']
	];

	Kefir.fromEvent = function(target, eventName, transformer) {
	  var pair, sub, unsub;

	  for (var i = 0; i < subUnsubPairs.length; i++) {
	    pair = subUnsubPairs[i];
	    if (isFn(target[pair[0]]) && isFn(target[pair[1]])) {
	      sub = pair[0];
	      unsub = pair[1];
	      break;
	    }
	  }

	  if (sub === undefined) {
	    throw new Error('target don\'t support any of ' +
	      'addEventListener/removeEventListener, addListener/removeListener, on/off method pair');
	  }

	  return Kefir.fromSubUnsub(
	    function(handler) {
	      target[sub](eventName, handler);
	    },
	    function(handler) {
	      target[unsub](eventName, handler);
	    },
	    transformer
	  ).setName('fromEvent');
	};

	var withTwoSourcesAndBufferMixin = {
	  _init: function(args) {
	    this._buff = [];
	    this._flushOnEnd = get(args[0], 'flushOnEnd', true);
	  },
	  _free: function() {
	    this._buff = null;
	  },
	  _flush: function(isCurrent) {
	    if (this._buff !== null && this._buff.length !== 0) {
	      this._send(VALUE, this._buff, isCurrent);
	      this._buff = [];
	    }
	  },

	  _handlePrimaryEnd: function(__, isCurrent) {
	    if (this._flushOnEnd) {
	      this._flush(isCurrent);
	    }
	    this._send(END, null, isCurrent);
	  }
	};



	withTwoSources('bufferBy', extend({

	  _onActivation: function() {
	    this._primary.onAny(this._$handlePrimaryAny);
	    if (this._alive && this._secondary !== null) {
	      this._secondary.onAny(this._$handleSecondaryAny);
	    }
	  },

	  _handlePrimaryValue: function(x, isCurrent) {
	    this._buff.push(x);
	  },

	  _handleSecondaryValue: function(x, isCurrent) {
	    this._flush(isCurrent);
	  },

	  _handleSecondaryEnd: function(x, isCurrent) {
	    if (!this._flushOnEnd) {
	      this._send(END, null, isCurrent);
	    }
	  }

	}, withTwoSourcesAndBufferMixin));




	withTwoSources('bufferWhileBy', extend({

	  _handlePrimaryValue: function(x, isCurrent) {
	    this._buff.push(x);
	    if (this._lastSecondary !== NOTHING && !this._lastSecondary) {
	      this._flush(isCurrent);
	    }
	  },

	  _handleSecondaryEnd: function(x, isCurrent) {
	    if (!this._flushOnEnd && (this._lastSecondary === NOTHING || this._lastSecondary)) {
	      this._send(END, null, isCurrent);
	    }
	  }

	}, withTwoSourcesAndBufferMixin));





	withTwoSources('filterBy', {

	  _handlePrimaryValue: function(x, isCurrent) {
	    if (this._lastSecondary !== NOTHING && this._lastSecondary) {
	      this._send(VALUE, x, isCurrent);
	    }
	  },

	  _handleSecondaryEnd: function(__, isCurrent) {
	    if (this._lastSecondary === NOTHING || !this._lastSecondary) {
	      this._send(END, null, isCurrent);
	    }
	  }

	});



	withTwoSources('skipUntilBy', {

	  _handlePrimaryValue: function(x, isCurrent) {
	    if (this._lastSecondary !== NOTHING) {
	      this._send(VALUE, x, isCurrent);
	    }
	  },

	  _handleSecondaryEnd: function(__, isCurrent) {
	    if (this._lastSecondary === NOTHING) {
	      this._send(END, null, isCurrent);
	    }
	  }

	});



	withTwoSources('takeUntilBy', {

	  _handleSecondaryValue: function(x, isCurrent) {
	    this._send(END, null, isCurrent);
	  }

	});



	withTwoSources('takeWhileBy', {

	  _handlePrimaryValue: function(x, isCurrent) {
	    if (this._lastSecondary !== NOTHING) {
	      this._send(VALUE, x, isCurrent);
	    }
	  },

	  _handleSecondaryValue: function(x, isCurrent) {
	    this._lastSecondary = x;
	    if (!this._lastSecondary) {
	      this._send(END, null, isCurrent);
	    }
	  },

	  _handleSecondaryEnd: function(__, isCurrent) {
	    if (this._lastSecondary === NOTHING) {
	      this._send(END, null, isCurrent);
	    }
	  }

	});




	withTwoSources('skipWhileBy', {

	  _init: function() {
	    this._hasFalseyFromSecondary = false;
	  },

	  _handlePrimaryValue: function(x, isCurrent) {
	    if (this._hasFalseyFromSecondary) {
	      this._send(VALUE, x, isCurrent);
	    }
	  },

	  _handleSecondaryValue: function(x, isCurrent) {
	    this._hasFalseyFromSecondary = this._hasFalseyFromSecondary || !x;
	  },

	  _handleSecondaryEnd: function(__, isCurrent) {
	    if (!this._hasFalseyFromSecondary) {
	      this._send(END, null, isCurrent);
	    }
	  }

	});


	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return Kefir;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    global.Kefir = Kefir;
	  } else if (typeof module === "object" && typeof exports === "object") {
	    module.exports = Kefir;
	    Kefir.Kefir = Kefir;
	  } else {
	    global.Kefir = Kefir;
	  }

	}(this));

/***/ },
/* 13 */,
/* 14 */,
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function () {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	function replaceText(source, id, replacement) {
		var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
		var start = source.lastIndexOf(boundaries[0]);
		var wrappedReplacement = replacement
			? (boundaries[0] + replacement + boundaries[1])
			: "";
		if (source.lastIndexOf(boundaries[0]) >= 0) {
			var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
			return source.slice(0, start) + wrappedReplacement + source.slice(end);
		} else {
			return source + wrappedReplacement;
		}
	}

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap && typeof btoa === "function") {
			try {
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
				css = "@import url(\"data:text/css;base64," + btoa(css) + "\")";
			} catch(e) {}
		}

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
		var list = [];
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
		return list;
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/*jshint browser:true, node:true*/

	'use strict';

	/**
	 * @preserve Create and manage a DOM event delegator.
	 *
	 * @version 0.3.0
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */
	var Delegate = __webpack_require__(20);

	module.exports = function(root) {
	  return new Delegate(root);
	};

	module.exports.Delegate = Delegate;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file imports the `mat4` file from the `gl-matrix` library.
	 */

	// Set gl-matrix common constants
	window.GLMAT_EPSILON = 0.000001;
	window.GLMAT_ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;

	// Import the actual library
	var mat4 = __webpack_require__(21).mat4;

	// Add method for style output (copied on mat4.str)
	mat4.style = function (a) {
	    return 'transform: matrix3d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
	                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
	                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
	                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + '); ';
	};

	module.exports = mat4;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/*jshint browser:true, node:true*/

	'use strict';

	module.exports = Delegate;

	/**
	 * DOM event delegator
	 *
	 * The delegator will listen
	 * for events that bubble up
	 * to the root node.
	 *
	 * @constructor
	 * @param {Node|string} [root] The root node or a selector string matching the root node
	 */
	function Delegate(root) {

	  /**
	   * Maintain a map of listener
	   * lists, keyed by event name.
	   *
	   * @type Object
	   */
	  this.listenerMap = [{}, {}];
	  if (root) {
	    this.root(root);
	  }

	  /** @type function() */
	  this.handle = Delegate.prototype.handle.bind(this);
	}

	/**
	 * Start listening for events
	 * on the provided DOM element
	 *
	 * @param  {Node|string} [root] The root node or a selector string matching the root node
	 * @returns {Delegate} This method is chainable
	 */
	Delegate.prototype.root = function(root) {
	  var listenerMap = this.listenerMap;
	  var eventType;

	  // Remove master event listeners
	  if (this.rootElement) {
	    for (eventType in listenerMap[1]) {
	      if (listenerMap[1].hasOwnProperty(eventType)) {
	        this.rootElement.removeEventListener(eventType, this.handle, true);
	      }
	    }
	    for (eventType in listenerMap[0]) {
	      if (listenerMap[0].hasOwnProperty(eventType)) {
	        this.rootElement.removeEventListener(eventType, this.handle, false);
	      }
	    }
	  }

	  // If no root or root is not
	  // a dom node, then remove internal
	  // root reference and exit here
	  if (!root || !root.addEventListener) {
	    if (this.rootElement) {
	      delete this.rootElement;
	    }
	    return this;
	  }

	  /**
	   * The root node at which
	   * listeners are attached.
	   *
	   * @type Node
	   */
	  this.rootElement = root;

	  // Set up master event listeners
	  for (eventType in listenerMap[1]) {
	    if (listenerMap[1].hasOwnProperty(eventType)) {
	      this.rootElement.addEventListener(eventType, this.handle, true);
	    }
	  }
	  for (eventType in listenerMap[0]) {
	    if (listenerMap[0].hasOwnProperty(eventType)) {
	      this.rootElement.addEventListener(eventType, this.handle, false);
	    }
	  }

	  return this;
	};

	/**
	 * @param {string} eventType
	 * @returns boolean
	 */
	Delegate.prototype.captureForType = function(eventType) {
	  return ['blur', 'error', 'focus', 'load', 'resize', 'scroll'].indexOf(eventType) !== -1;
	};

	/**
	 * Attach a handler to one
	 * event for all elements
	 * that match the selector,
	 * now or in the future
	 *
	 * The handler function receives
	 * three arguments: the DOM event
	 * object, the node that matched
	 * the selector while the event
	 * was bubbling and a reference
	 * to itself. Within the handler,
	 * 'this' is equal to the second
	 * argument.
	 *
	 * The node that actually received
	 * the event can be accessed via
	 * 'event.target'.
	 *
	 * @param {string} eventType Listen for these events
	 * @param {string|undefined} selector Only handle events on elements matching this selector, if undefined match root element
	 * @param {function()} handler Handler function - event data passed here will be in event.data
	 * @param {Object} [eventData] Data to pass in event.data
	 * @returns {Delegate} This method is chainable
	 */
	Delegate.prototype.on = function(eventType, selector, handler, useCapture) {
	  var root, listenerMap, matcher, matcherParam;

	  if (!eventType) {
	    throw new TypeError('Invalid event type: ' + eventType);
	  }

	  // handler can be passed as
	  // the second or third argument
	  if (typeof selector === 'function') {
	    useCapture = handler;
	    handler = selector;
	    selector = null;
	  }

	  // Fallback to sensible defaults
	  // if useCapture not set
	  if (useCapture === undefined) {
	    useCapture = this.captureForType(eventType);
	  }

	  if (typeof handler !== 'function') {
	    throw new TypeError('Handler must be a type of Function');
	  }

	  root = this.rootElement;
	  listenerMap = this.listenerMap[useCapture ? 1 : 0];

	  // Add master handler for type if not created yet
	  if (!listenerMap[eventType]) {
	    if (root) {
	      root.addEventListener(eventType, this.handle, useCapture);
	    }
	    listenerMap[eventType] = [];
	  }

	  if (!selector) {
	    matcherParam = null;

	    // COMPLEX - matchesRoot needs to have access to
	    // this.rootElement, so bind the function to this.
	    matcher = matchesRoot.bind(this);

	  // Compile a matcher for the given selector
	  } else if (/^[a-z]+$/i.test(selector)) {
	    matcherParam = selector;
	    matcher = matchesTag;
	  } else if (/^#[a-z0-9\-_]+$/i.test(selector)) {
	    matcherParam = selector.slice(1);
	    matcher = matchesId;
	  } else {
	    matcherParam = selector;
	    matcher = matches;
	  }

	  // Add to the list of listeners
	  listenerMap[eventType].push({
	    selector: selector,
	    handler: handler,
	    matcher: matcher,
	    matcherParam: matcherParam
	  });

	  return this;
	};

	/**
	 * Remove an event handler
	 * for elements that match
	 * the selector, forever
	 *
	 * @param {string} [eventType] Remove handlers for events matching this type, considering the other parameters
	 * @param {string} [selector] If this parameter is omitted, only handlers which match the other two will be removed
	 * @param {function()} [handler] If this parameter is omitted, only handlers which match the previous two will be removed
	 * @returns {Delegate} This method is chainable
	 */
	Delegate.prototype.off = function(eventType, selector, handler, useCapture) {
	  var i, listener, listenerMap, listenerList, singleEventType;

	  // Handler can be passed as
	  // the second or third argument
	  if (typeof selector === 'function') {
	    useCapture = handler;
	    handler = selector;
	    selector = null;
	  }

	  // If useCapture not set, remove
	  // all event listeners
	  if (useCapture === undefined) {
	    this.off(eventType, selector, handler, true);
	    this.off(eventType, selector, handler, false);
	    return this;
	  }

	  listenerMap = this.listenerMap[useCapture ? 1 : 0];
	  if (!eventType) {
	    for (singleEventType in listenerMap) {
	      if (listenerMap.hasOwnProperty(singleEventType)) {
	        this.off(singleEventType, selector, handler);
	      }
	    }

	    return this;
	  }

	  listenerList = listenerMap[eventType];
	  if (!listenerList || !listenerList.length) {
	    return this;
	  }

	  // Remove only parameter matches
	  // if specified
	  for (i = listenerList.length - 1; i >= 0; i--) {
	    listener = listenerList[i];

	    if ((!selector || selector === listener.selector) && (!handler || handler === listener.handler)) {
	      listenerList.splice(i, 1);
	    }
	  }

	  // All listeners removed
	  if (!listenerList.length) {
	    delete listenerMap[eventType];

	    // Remove the main handler
	    if (this.rootElement) {
	      this.rootElement.removeEventListener(eventType, this.handle, useCapture);
	    }
	  }

	  return this;
	};


	/**
	 * Handle an arbitrary event.
	 *
	 * @param {Event} event
	 */
	Delegate.prototype.handle = function(event) {
	  var i, l, type = event.type, root, phase, listener, returned, listenerList = [], target, /** @const */ EVENTIGNORE = 'ftLabsDelegateIgnore';

	  if (event[EVENTIGNORE] === true) {
	    return;
	  }

	  target = event.target;

	  // Hardcode value of Node.TEXT_NODE
	  // as not defined in IE8
	  if (target.nodeType === 3) {
	    target = target.parentNode;
	  }

	  root = this.rootElement;

	  phase = event.eventPhase || ( event.target !== event.currentTarget ? 3 : 2 );
	  
	  switch (phase) {
	    case 1: //Event.CAPTURING_PHASE:
	      listenerList = this.listenerMap[1][type];
	    break;
	    case 2: //Event.AT_TARGET:
	      if (this.listenerMap[0] && this.listenerMap[0][type]) listenerList = listenerList.concat(this.listenerMap[0][type]);
	      if (this.listenerMap[1] && this.listenerMap[1][type]) listenerList = listenerList.concat(this.listenerMap[1][type]);
	    break;
	    case 3: //Event.BUBBLING_PHASE:
	      listenerList = this.listenerMap[0][type];
	    break;
	  }

	  // Need to continuously check
	  // that the specific list is
	  // still populated in case one
	  // of the callbacks actually
	  // causes the list to be destroyed.
	  l = listenerList.length;
	  while (target && l) {
	    for (i = 0; i < l; i++) {
	      listener = listenerList[i];

	      // Bail from this loop if
	      // the length changed and
	      // no more listeners are
	      // defined between i and l.
	      if (!listener) {
	        break;
	      }

	      // Check for match and fire
	      // the event if there's one
	      //
	      // TODO:MCG:20120117: Need a way
	      // to check if event#stopImmediatePropagation
	      // was called. If so, break both loops.
	      if (listener.matcher.call(target, listener.matcherParam, target)) {
	        returned = this.fire(event, target, listener);
	      }

	      // Stop propagation to subsequent
	      // callbacks if the callback returned
	      // false
	      if (returned === false) {
	        event[EVENTIGNORE] = true;
	        event.preventDefault();
	        return;
	      }
	    }

	    // TODO:MCG:20120117: Need a way to
	    // check if event#stopPropagation
	    // was called. If so, break looping
	    // through the DOM. Stop if the
	    // delegation root has been reached
	    if (target === root) {
	      break;
	    }

	    l = listenerList.length;
	    target = target.parentElement;
	  }
	};

	/**
	 * Fire a listener on a target.
	 *
	 * @param {Event} event
	 * @param {Node} target
	 * @param {Object} listener
	 * @returns {boolean}
	 */
	Delegate.prototype.fire = function(event, target, listener) {
	  return listener.handler.call(target, event, target);
	};

	/**
	 * Check whether an element
	 * matches a generic selector.
	 *
	 * @type function()
	 * @param {string} selector A CSS selector
	 */
	var matches = (function(el) {
	  if (!el) return;
	  var p = el.prototype;
	  return (p.matches || p.matchesSelector || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector);
	}(Element));

	/**
	 * Check whether an element
	 * matches a tag selector.
	 *
	 * Tags are NOT case-sensitive,
	 * except in XML (and XML-based
	 * languages such as XHTML).
	 *
	 * @param {string} tagName The tag name to test against
	 * @param {Element} element The element to test with
	 * @returns boolean
	 */
	function matchesTag(tagName, element) {
	  return tagName.toLowerCase() === element.tagName.toLowerCase();
	}

	/**
	 * Check whether an element
	 * matches the root.
	 *
	 * @param {?String} selector In this case this is always passed through as null and not used
	 * @param {Element} element The element to test with
	 * @returns boolean
	 */
	function matchesRoot(selector, element) {
	  /*jshint validthis:true*/
	  if (this.rootElement === window) return element === document;
	  return this.rootElement === element;
	}

	/**
	 * Check whether the ID of
	 * the element in 'this'
	 * matches the given ID.
	 *
	 * IDs are case-sensitive.
	 *
	 * @param {string} id The ID to test against
	 * @param {Element} element The element to test with
	 * @returns boolean
	 */
	function matchesId(id, element) {
	  return id === element.id;
	}

	/**
	 * Short hand for off()
	 * and root(), ie both
	 * with no parameters
	 *
	 * @return void
	 */
	Delegate.prototype.destroy = function() {
	  this.off();
	  this.root();
	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

	Redistribution and use in source and binary forms, with or without modification,
	are permitted provided that the following conditions are met:

	  * Redistributions of source code must retain the above copyright notice, this
	    list of conditions and the following disclaimer.
	  * Redistributions in binary form must reproduce the above copyright notice,
	    this list of conditions and the following disclaimer in the documentation 
	    and/or other materials provided with the distribution.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
	ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
	WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
	DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
	ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
	ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

	/**
	 * @class 4x4 Matrix
	 * @name mat4
	 */
	var mat4 = {};

	var mat4Identity = new Float32Array([
	    1, 0, 0, 0,
	    0, 1, 0, 0,
	    0, 0, 1, 0,
	    0, 0, 0, 1
	]);

	/**
	 * Creates a new identity mat4
	 *
	 * @returns {mat4} a new 4x4 matrix
	 */
	mat4.create = function() {
	    var out = new GLMAT_ARRAY_TYPE(16);
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	};

	/**
	 * Creates a new mat4 initialized with values from an existing matrix
	 *
	 * @param {mat4} a matrix to clone
	 * @returns {mat4} a new 4x4 matrix
	 */
	mat4.clone = function(a) {
	    var out = new GLMAT_ARRAY_TYPE(16);
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    out[9] = a[9];
	    out[10] = a[10];
	    out[11] = a[11];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};

	/**
	 * Copy the values from one mat4 to another
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.copy = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[8] = a[8];
	    out[9] = a[9];
	    out[10] = a[10];
	    out[11] = a[11];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};

	/**
	 * Set a mat4 to the identity matrix
	 *
	 * @param {mat4} out the receiving matrix
	 * @returns {mat4} out
	 */
	mat4.identity = function(out) {
	    out[0] = 1;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = 1;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 1;
	    out[11] = 0;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;
	    return out;
	};

	/**
	 * Transpose the values of a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.transpose = function(out, a) {
	    // If we are transposing ourselves we can skip a few steps but have to cache some values
	    if (out === a) {
	        var a01 = a[1], a02 = a[2], a03 = a[3],
	            a12 = a[6], a13 = a[7],
	            a23 = a[11];

	        out[1] = a[4];
	        out[2] = a[8];
	        out[3] = a[12];
	        out[4] = a01;
	        out[6] = a[9];
	        out[7] = a[13];
	        out[8] = a02;
	        out[9] = a12;
	        out[11] = a[14];
	        out[12] = a03;
	        out[13] = a13;
	        out[14] = a23;
	    } else {
	        out[0] = a[0];
	        out[1] = a[4];
	        out[2] = a[8];
	        out[3] = a[12];
	        out[4] = a[1];
	        out[5] = a[5];
	        out[6] = a[9];
	        out[7] = a[13];
	        out[8] = a[2];
	        out[9] = a[6];
	        out[10] = a[10];
	        out[11] = a[14];
	        out[12] = a[3];
	        out[13] = a[7];
	        out[14] = a[11];
	        out[15] = a[15];
	    }
	    
	    return out;
	};

	/**
	 * Inverts a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.invert = function(out, a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

	        b00 = a00 * a11 - a01 * a10,
	        b01 = a00 * a12 - a02 * a10,
	        b02 = a00 * a13 - a03 * a10,
	        b03 = a01 * a12 - a02 * a11,
	        b04 = a01 * a13 - a03 * a11,
	        b05 = a02 * a13 - a03 * a12,
	        b06 = a20 * a31 - a21 * a30,
	        b07 = a20 * a32 - a22 * a30,
	        b08 = a20 * a33 - a23 * a30,
	        b09 = a21 * a32 - a22 * a31,
	        b10 = a21 * a33 - a23 * a31,
	        b11 = a22 * a33 - a23 * a32,

	        // Calculate the determinant
	        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

	    if (!det) { 
	        return null; 
	    }
	    det = 1.0 / det;

	    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
	    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
	    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
	    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
	    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
	    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
	    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
	    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
	    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
	    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

	    return out;
	};

	/**
	 * Calculates the adjugate of a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	mat4.adjoint = function(out, a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

	    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
	    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
	    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
	    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
	    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
	    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
	    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
	    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
	    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
	    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
	    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
	    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
	    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
	    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
	    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
	    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
	    return out;
	};

	/**
	 * Calculates the determinant of a mat4
	 *
	 * @param {mat4} a the source matrix
	 * @returns {Number} determinant of a
	 */
	mat4.determinant = function (a) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

	        b00 = a00 * a11 - a01 * a10,
	        b01 = a00 * a12 - a02 * a10,
	        b02 = a00 * a13 - a03 * a10,
	        b03 = a01 * a12 - a02 * a11,
	        b04 = a01 * a13 - a03 * a11,
	        b05 = a02 * a13 - a03 * a12,
	        b06 = a20 * a31 - a21 * a30,
	        b07 = a20 * a32 - a22 * a30,
	        b08 = a20 * a33 - a23 * a30,
	        b09 = a21 * a32 - a22 * a31,
	        b10 = a21 * a33 - a23 * a31,
	        b11 = a22 * a33 - a23 * a32;

	    // Calculate the determinant
	    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	};

	/**
	 * Multiplies two mat4's
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @returns {mat4} out
	 */
	mat4.multiply = function (out, a, b) {
	    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
	        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
	        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
	        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

	    // Cache only the current line of the second matrix
	    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
	    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

	    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
	    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

	    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
	    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

	    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
	    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
	    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
	    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
	    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
	    return out;
	};

	/**
	 * Alias for {@link mat4.multiply}
	 * @function
	 */
	mat4.mul = mat4.multiply;

	/**
	 * Translate a mat4 by the given vector
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to translate
	 * @param {vec3} v vector to translate by
	 * @returns {mat4} out
	 */
	mat4.translate = function (out, a, v) {
	    var x = v[0], y = v[1], z = v[2],
	        a00, a01, a02, a03,
	        a10, a11, a12, a13,
	        a20, a21, a22, a23;

	    if (a === out) {
	        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
	        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
	        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
	        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
	    } else {
	        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
	        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
	        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

	        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
	        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
	        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

	        out[12] = a00 * x + a10 * y + a20 * z + a[12];
	        out[13] = a01 * x + a11 * y + a21 * z + a[13];
	        out[14] = a02 * x + a12 * y + a22 * z + a[14];
	        out[15] = a03 * x + a13 * y + a23 * z + a[15];
	    }

	    return out;
	};

	/**
	 * Scales the mat4 by the dimensions in the given vec3
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to scale
	 * @param {vec3} v the vec3 to scale the matrix by
	 * @returns {mat4} out
	 **/
	mat4.scale = function(out, a, v) {
	    var x = v[0], y = v[1], z = v[2];

	    out[0] = a[0] * x;
	    out[1] = a[1] * x;
	    out[2] = a[2] * x;
	    out[3] = a[3] * x;
	    out[4] = a[4] * y;
	    out[5] = a[5] * y;
	    out[6] = a[6] * y;
	    out[7] = a[7] * y;
	    out[8] = a[8] * z;
	    out[9] = a[9] * z;
	    out[10] = a[10] * z;
	    out[11] = a[11] * z;
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	    return out;
	};

	/**
	 * Rotates a mat4 by the given angle
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @param {vec3} axis the axis to rotate around
	 * @returns {mat4} out
	 */
	mat4.rotate = function (out, a, rad, axis) {
	    var x = axis[0], y = axis[1], z = axis[2],
	        len = Math.sqrt(x * x + y * y + z * z),
	        s, c, t,
	        a00, a01, a02, a03,
	        a10, a11, a12, a13,
	        a20, a21, a22, a23,
	        b00, b01, b02,
	        b10, b11, b12,
	        b20, b21, b22;

	    if (Math.abs(len) < GLMAT_EPSILON) { return null; }
	    
	    len = 1 / len;
	    x *= len;
	    y *= len;
	    z *= len;

	    s = Math.sin(rad);
	    c = Math.cos(rad);
	    t = 1 - c;

	    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
	    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
	    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

	    // Construct the elements of the rotation matrix
	    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
	    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
	    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

	    // Perform rotation-specific matrix multiplication
	    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
	    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
	    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
	    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
	    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
	    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
	    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
	    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
	    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
	    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
	    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
	    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

	    if (a !== out) { // If the source and destination differ, copy the unchanged last row
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }
	    return out;
	};

	/**
	 * Rotates a matrix by the given angle around the X axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.rotateX = function (out, a, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a10 = a[4],
	        a11 = a[5],
	        a12 = a[6],
	        a13 = a[7],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11];

	    if (a !== out) { // If the source and destination differ, copy the unchanged rows
	        out[0]  = a[0];
	        out[1]  = a[1];
	        out[2]  = a[2];
	        out[3]  = a[3];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }

	    // Perform axis-specific matrix multiplication
	    out[4] = a10 * c + a20 * s;
	    out[5] = a11 * c + a21 * s;
	    out[6] = a12 * c + a22 * s;
	    out[7] = a13 * c + a23 * s;
	    out[8] = a20 * c - a10 * s;
	    out[9] = a21 * c - a11 * s;
	    out[10] = a22 * c - a12 * s;
	    out[11] = a23 * c - a13 * s;
	    return out;
	};

	/**
	 * Rotates a matrix by the given angle around the Y axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.rotateY = function (out, a, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a03 = a[3],
	        a20 = a[8],
	        a21 = a[9],
	        a22 = a[10],
	        a23 = a[11];

	    if (a !== out) { // If the source and destination differ, copy the unchanged rows
	        out[4]  = a[4];
	        out[5]  = a[5];
	        out[6]  = a[6];
	        out[7]  = a[7];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }

	    // Perform axis-specific matrix multiplication
	    out[0] = a00 * c - a20 * s;
	    out[1] = a01 * c - a21 * s;
	    out[2] = a02 * c - a22 * s;
	    out[3] = a03 * c - a23 * s;
	    out[8] = a00 * s + a20 * c;
	    out[9] = a01 * s + a21 * c;
	    out[10] = a02 * s + a22 * c;
	    out[11] = a03 * s + a23 * c;
	    return out;
	};

	/**
	 * Rotates a matrix by the given angle around the Z axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	mat4.rotateZ = function (out, a, rad) {
	    var s = Math.sin(rad),
	        c = Math.cos(rad),
	        a00 = a[0],
	        a01 = a[1],
	        a02 = a[2],
	        a03 = a[3],
	        a10 = a[4],
	        a11 = a[5],
	        a12 = a[6],
	        a13 = a[7];

	    if (a !== out) { // If the source and destination differ, copy the unchanged last row
	        out[8]  = a[8];
	        out[9]  = a[9];
	        out[10] = a[10];
	        out[11] = a[11];
	        out[12] = a[12];
	        out[13] = a[13];
	        out[14] = a[14];
	        out[15] = a[15];
	    }

	    // Perform axis-specific matrix multiplication
	    out[0] = a00 * c + a10 * s;
	    out[1] = a01 * c + a11 * s;
	    out[2] = a02 * c + a12 * s;
	    out[3] = a03 * c + a13 * s;
	    out[4] = a10 * c - a00 * s;
	    out[5] = a11 * c - a01 * s;
	    out[6] = a12 * c - a02 * s;
	    out[7] = a13 * c - a03 * s;
	    return out;
	};

	/**
	 * Creates a matrix from a quaternion rotation and vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     var quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @returns {mat4} out
	 */
	mat4.fromRotationTranslation = function (out, q, v) {
	    // Quaternion math
	    var x = q[0], y = q[1], z = q[2], w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,

	        xx = x * x2,
	        xy = x * y2,
	        xz = x * z2,
	        yy = y * y2,
	        yz = y * z2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;

	    out[0] = 1 - (yy + zz);
	    out[1] = xy + wz;
	    out[2] = xz - wy;
	    out[3] = 0;
	    out[4] = xy - wz;
	    out[5] = 1 - (xx + zz);
	    out[6] = yz + wx;
	    out[7] = 0;
	    out[8] = xz + wy;
	    out[9] = yz - wx;
	    out[10] = 1 - (xx + yy);
	    out[11] = 0;
	    out[12] = v[0];
	    out[13] = v[1];
	    out[14] = v[2];
	    out[15] = 1;
	    
	    return out;
	};

	/**
	* Calculates a 4x4 matrix from the given quaternion
	*
	* @param {mat4} out mat4 receiving operation result
	* @param {quat} q Quaternion to create matrix from
	*
	* @returns {mat4} out
	*/
	mat4.fromQuat = function (out, q) {
	    var x = q[0], y = q[1], z = q[2], w = q[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,

	        xx = x * x2,
	        xy = x * y2,
	        xz = x * z2,
	        yy = y * y2,
	        yz = y * z2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;

	    out[0] = 1 - (yy + zz);
	    out[1] = xy + wz;
	    out[2] = xz - wy;
	    out[3] = 0;

	    out[4] = xy - wz;
	    out[5] = 1 - (xx + zz);
	    out[6] = yz + wx;
	    out[7] = 0;

	    out[8] = xz + wy;
	    out[9] = yz - wx;
	    out[10] = 1 - (xx + yy);
	    out[11] = 0;

	    out[12] = 0;
	    out[13] = 0;
	    out[14] = 0;
	    out[15] = 1;

	    return out;
	};

	/**
	 * Generates a frustum matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {Number} left Left bound of the frustum
	 * @param {Number} right Right bound of the frustum
	 * @param {Number} bottom Bottom bound of the frustum
	 * @param {Number} top Top bound of the frustum
	 * @param {Number} near Near bound of the frustum
	 * @param {Number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	mat4.frustum = function (out, left, right, bottom, top, near, far) {
	    var rl = 1 / (right - left),
	        tb = 1 / (top - bottom),
	        nf = 1 / (near - far);
	    out[0] = (near * 2) * rl;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = (near * 2) * tb;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = (right + left) * rl;
	    out[9] = (top + bottom) * tb;
	    out[10] = (far + near) * nf;
	    out[11] = -1;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = (far * near * 2) * nf;
	    out[15] = 0;
	    return out;
	};

	/**
	 * Generates a perspective projection matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} fovy Vertical field of view in radians
	 * @param {number} aspect Aspect ratio. typically viewport width/height
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	mat4.perspective = function (out, fovy, aspect, near, far) {
	    var f = 1.0 / Math.tan(fovy / 2),
	        nf = 1 / (near - far);
	    out[0] = f / aspect;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = f;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = (far + near) * nf;
	    out[11] = -1;
	    out[12] = 0;
	    out[13] = 0;
	    out[14] = (2 * far * near) * nf;
	    out[15] = 0;
	    return out;
	};

	/**
	 * Generates a orthogonal projection matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} left Left bound of the frustum
	 * @param {number} right Right bound of the frustum
	 * @param {number} bottom Bottom bound of the frustum
	 * @param {number} top Top bound of the frustum
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	mat4.ortho = function (out, left, right, bottom, top, near, far) {
	    var lr = 1 / (left - right),
	        bt = 1 / (bottom - top),
	        nf = 1 / (near - far);
	    out[0] = -2 * lr;
	    out[1] = 0;
	    out[2] = 0;
	    out[3] = 0;
	    out[4] = 0;
	    out[5] = -2 * bt;
	    out[6] = 0;
	    out[7] = 0;
	    out[8] = 0;
	    out[9] = 0;
	    out[10] = 2 * nf;
	    out[11] = 0;
	    out[12] = (left + right) * lr;
	    out[13] = (top + bottom) * bt;
	    out[14] = (far + near) * nf;
	    out[15] = 1;
	    return out;
	};

	/**
	 * Generates a look-at matrix with the given eye position, focal point, and up axis
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {vec3} eye Position of the viewer
	 * @param {vec3} center Point the viewer is looking at
	 * @param {vec3} up vec3 pointing up
	 * @returns {mat4} out
	 */
	mat4.lookAt = function (out, eye, center, up) {
	    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
	        eyex = eye[0],
	        eyey = eye[1],
	        eyez = eye[2],
	        upx = up[0],
	        upy = up[1],
	        upz = up[2],
	        centerx = center[0],
	        centery = center[1],
	        centerz = center[2];

	    if (Math.abs(eyex - centerx) < GLMAT_EPSILON &&
	        Math.abs(eyey - centery) < GLMAT_EPSILON &&
	        Math.abs(eyez - centerz) < GLMAT_EPSILON) {
	        return mat4.identity(out);
	    }

	    z0 = eyex - centerx;
	    z1 = eyey - centery;
	    z2 = eyez - centerz;

	    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
	    z0 *= len;
	    z1 *= len;
	    z2 *= len;

	    x0 = upy * z2 - upz * z1;
	    x1 = upz * z0 - upx * z2;
	    x2 = upx * z1 - upy * z0;
	    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
	    if (!len) {
	        x0 = 0;
	        x1 = 0;
	        x2 = 0;
	    } else {
	        len = 1 / len;
	        x0 *= len;
	        x1 *= len;
	        x2 *= len;
	    }

	    y0 = z1 * x2 - z2 * x1;
	    y1 = z2 * x0 - z0 * x2;
	    y2 = z0 * x1 - z1 * x0;

	    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
	    if (!len) {
	        y0 = 0;
	        y1 = 0;
	        y2 = 0;
	    } else {
	        len = 1 / len;
	        y0 *= len;
	        y1 *= len;
	        y2 *= len;
	    }

	    out[0] = x0;
	    out[1] = y0;
	    out[2] = z0;
	    out[3] = 0;
	    out[4] = x1;
	    out[5] = y1;
	    out[6] = z1;
	    out[7] = 0;
	    out[8] = x2;
	    out[9] = y2;
	    out[10] = z2;
	    out[11] = 0;
	    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
	    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
	    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
	    out[15] = 1;

	    return out;
	};

	/**
	 * Returns a string representation of a mat4
	 *
	 * @param {mat4} mat matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	mat4.str = function (a) {
	    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
	                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
	                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
	                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
	};

	if(true) {
	    exports.mat4 = mat4;
	}


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var mat4 = __webpack_require__(19);
	var merge = __webpack_require__(5);
	var m = __webpack_require__(2);

	/**
	 * Every surface has an unique ID
	 * A parent is a special surface, also has an unique ID
	 *
	 * - When updating specs, we need to find Surface corresponding to ID.
	 * - When rendering, we need to find IDs that belong to surface
	 * 
	 * @type {Object}
	 */
	var SURFACES = [];
	var ID_TO_INDEX = {};

	/**
	 * Convert Surface ID to an index in the Container.
	 *
	 * If Surface ID does not exist, it will fetch a
	 * cached Surface. If there are no cached surfaces, 
	 * it will create a new one.
	 */
	function SurfaceIndex(id){
		var index = ID_TO_INDEX[id];
		if(typeof index === 'undefined') {
			index = SURFACES.length;
			new SurfaceController({id:id});
		}
		return index;
	}

	/**
	 * Return merged spec of a Surface.
	 * Create Surface if ID does not have an index yet.
	 */
	function SurfaceSpec(id){
		var index = SurfaceIndex(id);
		return merge.apply(null,getObjectValues(SURFACES[index].specs));
	}

	/**
	 * Update specification of a Surface
	 * Create Surface if ID does not have an index yet.
	 */
	function SurfaceUpdate(value){
		var index = SurfaceIndex(value.id);
		SURFACES[index].update(value);
	}


	// for width and height
	// we assume [0...1] are percentages
	// while all other value are pixels
	function getNumValue(val){		
		return val <= 1.0 && val >= 0.0? (val * 100)+'%': val+'px';
	}

	// object to array (to work with merge)
	function getObjectValues(obj){
		return Object.keys(obj).map(function(key){
			return obj[key];
		});
	}

	/**
	 * Mithril SurfaceController
	 *
	 * Keeps state of a single element.
	 *
	 * input: 
	 * 		this.specs: mapping from behavior => spec
	 *
	 * output:
	 * 		id:    	 element id + Mithril key
	 * 		show: 	 Visibility of element. When not shown, can be recycled by Container.
	 * 		element: Mithril Virtual DOM element string
	 * 		content: Mithril Virtual DOM content
	 *
	 * A Surface listens to multiple specs.
	 *
	 * Every spec is called an "behavior".
	 * All behaviors are merged into a single spec.
	 * (See merge.js for how merging logic)
	 *
	 * public api:
	 * 		.render(spec)
	 */
	function SurfaceController(options){
		options = options || {};
		this.matrix = mat4.create();
		this.specs = {
			'default':{
				id: options.id,
				show: options.show,
				parent: options.parent,
				element: options.element || '.supermove-surface',
				width: options.width || 0,
				height: options.height || 0,
				rotateX: options.rotateX || 0,
				rotateY: options.rotateY || 0,
				rotateZ: options.rotateZ || 0,
				x: options.x || 0,
				y: options.y || 0,
				z: options.z || 0,
				originX: options.originX || 0.5,
				originY: options.originY || 0.5,
				scaleX: options.scaleX || 1,
				scaleY: options.scaleY || 1,
				scaleZ: options.scaleZ || 1,
				opacity: options.opacity || 1,
				content: options.content
			}
		};
		
		this.spec = {};
		this.attr = {};
		
		// global register
		ID_TO_INDEX[options.id] = SURFACES.length;
		SURFACES.push(this);
		
		this.update();
	}

	SurfaceController.prototype.update = function SurfaceUpdate(spec){
		if(typeof spec === 'object') this.specs[spec.behavior || 'main'] = spec;

		// merge specs into final spec.
		this.spec = spec = merge.apply(null,getObjectValues(this.specs));

		// update state
		if(spec.id){
			this.attr.id = spec.id;
			this.attr.key = spec.id;
		} else {
			delete this.attr.id;
			delete this.attr.key;
		}

		// display: none if invisible
		if(spec.show !== true){
			this.attr.style = "display: none;";
			return;
		}

		// otherwise: calculate style
		if(spec.opacity >= 1) spec.opacity = 0.99999;
		else if(spec.opacity <= 0) spec.opacity = 0.00001; 
		// opacity is very low, otherwise Chrome will not render
		// which can unpredicted cause flickering / rendering lag
		// 
		// We're assuming you have good reason to draw the surface,
		// even when it's not visible.
		//  - i.e. fast access (at the cost of more memory)
		// 
		// If you want to cleanup the node, set `show` to false
		//  - i.e. slower acccess (at the cost of more free dom nodes and memory)
		this.attr.style = "opacity: "+spec.opacity+"; ";

		// matrix3d transform
		var m = this.matrix;
		mat4.identity(m);
		mat4.translate(m,m,[spec.x,spec.y,spec.z]);
		if(spec.rotateX) mat4.rotateX(m,m,spec.rotateX);
		if(spec.rotateY) mat4.rotateY(m,m,spec.rotateY);
		if(spec.rotateZ) mat4.rotateZ(m,m,spec.rotateZ);
		mat4.scale(m,m,[spec.scaleX,spec.scaleY,spec.scaleZ]);
		this.attr.style += mat4.str(m).replace('mat4','transform: matrix3d')+'; ';
		
		// matrix3d transform origin
		this.attr.style += 'transform-origin: '+getNumValue(spec.originX)+' '+getNumValue(spec.originY)+' 0px; ';
		
		// width and height
		if(spec.width){
			this.attr.style += 'width: '+getNumValue(spec.width)+'; ';
		}
		if(spec.height){
			this.attr.style += 'height: '+getNumValue(spec.height)+'; ';
		}
	};

	/**
	 * Mithril View to render a Surface
	 */
	function SurfaceView(ctrl){
		var content = (ctrl.spec.content || []).concat(SURFACES.filter(function(surface){
			    return surface.spec.id !== ctrl.attr.id && (surface.spec.parent || 'root') === ctrl.attr.id;
			}).map(SurfaceView));
		
		return m(ctrl.spec.element,ctrl.attr,content);
	}

	module.exports = window.Surface = {
		spec: SurfaceSpec,
		update: SurfaceUpdate,
		controller: SurfaceController,
		view: SurfaceView
	};

/***/ }
/******/ ]);
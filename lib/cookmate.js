/**
 * Cookmate is a pure Javascript Cookie handler library.
 * https://github.com/jqrony/cookmate
 * 
 * @license MIT license
 * @version 1.0.0
 * 
 * © Copyright 2024 Shahzada Modassir
 * https://github.com/jqrony/cookmate/blob/main/LICENSE
 * Released under the MIT license
 * 
 * @author Shahzada Modassir
 * date: 09 January 2024 14:29:53 GMT+0530 (India Time)
 */
(function(exports, global, factory) {

/**
 * Inject [use strict] Mode
 * ------------------------
 * Throw ReferenceError when pass undeclare variables
 */
"use strict";

// For CommonJS and CommonJS-like environments
// (such as Node.js) expose a factory as module.exports
// e.g. var cookmate=require("cookmate")(window);
exports ? (module.exports=global.document ?
	factory(global, true) : function(window) {
	if (window.document && window.cookieStore) {
		return factory(window);
	} else {
		throw new Error(
			"Cookmate requires a window with a document."
		);
	}
}) : factory(global);
})(typeof module==="object" && module.exports, this.window ? window : this, function(window, noGlobal) {

/**
 * Inject [use strict] Mode
 * ------------------------
 * Throw ReferenceError when pass undeclare variables
 */
"use strict";

var VERSION  = "1.0.0";
var arr      = [];
var slice    = arr.slice;

var push    = arr.push;
var isArray = Array.isArray;

var cookies = {};
var support = {};
var hasOwn  = support.hasOwnProperty;
var cookie  = window.document.cookie;

var curCookieLength = 0;
var isFunction = function(obj) {
	return typeof obj==="function"&&typeof obj.nodeType!=="number"&&
		typeof obj.items!=="function";
};

var encodeURI  = window.encodeURIComponent;
var expando    = "Cookmate" + 1 * Date.now();
var whitespace = "[\\x20\\t\\r\\n\\f]";
var rseparator = new RegExp(";" + whitespace + "*", "g");

each({
	cancelBubble: true,
	cancelable: true,
	isTrusted: true,
	bubbles: true,
	eventPhase: true,
	changed: true,
	deleted: true,
	composed: true,
	returnValue: true,
	defaultPrevented: true,
}, addProp);

/**
 * Create Cookmate public API
 */
function Cookmate() {
	return !(this instanceof Cookmate) && new Cookmate();
}

Cookmate.protoHooks = {
	has: function(name) {
		return hasOwn.call(cookies, decodeURI((name||"")+""));
	},
	serialize: function() {
		var name, params=[];
		for(name in cookies) add(name, cookies[name], params);
		return params.join("&");
	},
	toJson: function() {
		return JSON.stringify(cookies);
	},
	parse: function() {
		return cookies;
	},
	clear: function() {
		var name;
		for(name in cookies) {
			this.remove(name);
		}
		return this.getAll();
	},
	get: function(name) {
		return this.has(name) && cookies[name];
	},
	getAll: function() {
		cookies.__proto__=Object.assign({}, cookies);
		return cookies.__proto__[Symbol.toStringTag]="Cookies", cookies;
	}
};

Cookmate.load = function() {
	cookie = window.document.cookie||cookie;
	var structure,
		cookieArray = cookie && cookie.split(rseparator)||[];
	curCookieLength = cookieArray.length;
	each(cookieArray, function(_i, paire) {
		if ((structure=paire.split(/=.*?/)) && structure.length===2) {
			try {
				structure[1]=JSON.parse(structure[1]);
			} catch(e) {}
			cookies[structure[0]]=structure[1];
		}
	});
	return curCookieLength;
};

Cookmate.load();

Cookmate.prototype.__proto__ = {
	on: function(_type, callback) {
		var self = this;
		window.cookieStore.onchange=function(e) {
			fnCall(callback, self, Cookmate.CookieEvent(e, {
				changed: e.changed,
				deleted: e.deleted
			}));
		};
	}
};

Cookmate.protoHooks.set=function(name, value, expires, path, domain, secure, HttpOnly, sameSite, priority, raw) {
	path = path || window.location.pathname;
	var cookieData = [name+"="+value, "expires="+expires, "path="+path]
	if (typeof expires==="number") {
		cookieData[1]="max-age=" + expires;
	}
	if (domain) {
		push.call(cookieData, "domain=" + domain);
	}
	if (secure!=null) {
		push.call(cookieData, "secure="+secure);
	}
	if (HttpOnly) {
		cookieData.push("HttpOnly");
	}
	if (sameSite) {
		cookieData.push("SameSite=" + sameSite);
	}
	if (priority) {
		cookieData.push("Priority=" + priority);
	}
	if (raw) {
		cookieData.push("raw");
	}
	document.cookie=cookieData.join(";");
	return cookieData[0];
};

Cookmate.protoHooks.remove = function(key, path, domain) {
	path = path || window.location.pathname;
	var data = [key+"=", "expires="+new Date(0).toUTCString(), "path="+path];
	if (domain) {
		data.push("domain=" + domain);
	}
	window.document.cookie=data.join(";");
	return Object.assign({}, cookies);
};

each(("set remove clear has serialize toJson parse get getAll").split(" "),
	function(_i, method) {
	Cookmate.prototype[method]=function() {
		Cookmate.load();
		return Cookmate.protoHooks[method].apply(this, arguments);
	};
});

Cookmate.prototype.delete = Cookmate.prototype.remove;

/**
 * Create own custom Cookie Event
 */
function CookieEvent(src, props) {

	// Allow instantiation without the 'new' keyword
	if (!(this instanceof CookieEvent)) {
		return new CookieEvent(src, props);
	}

	// Assign and Collapse Event object in CookieEvent
	if (src && props) {
		this.delgateTarget = new Cookmate();
		this.type          = src.type;
		this.originalEvent = src;
		// Create target and srcElement properties
		this.srcElement    = src.srcElement;
		this.target        = src.target;
		this.currentTarget = src.currentTarget;
	// Add reference Event type if not passed props
	} else {
		this.type = src;
	}

	// Put explicitly properties onto the event
	if (props) {
		for(var name in props) this[name]=props[name];
	}

	// Mark it as fixed
	this[expando] = true;

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();
}

Cookmate.CookieEvent=CookieEvent;

function addProp(name) {
	Object.defineProperty(CookieEvent.prototype, name, {
		configurable: true,
		enumerable: true,
		get: function() {
			if (this.originalEvent) {
				return this.originalEvent[name];
			}
		},
		set: function(value) {
			Object.defineProperty(this, name, {
				enumerable: true,
				writable: true,
				value: value,
				configurable: true
			});
		}
	});
}

// Create each Instance method
// TODO: Need to change each other solution
function each(obj, callback) {
	return isArray(obj) ?
		each(Object.assign({}, obj), callback) :
		fnCall(function (name) {
			for (name in obj) {
				name = +name || name;
				if (fnCall(callback, obj[name], name, obj[name])===false) {
					break;
				}
			}
		}), obj;
};

function add(key, value, results) {
	value = JSON.stringify(value);
	results[results.length] = encodeURI(key) + "=" + encodeURI(value==null ? "" : value);
}

// Add props and define property with configure object
// TODO: inhance more code improvement
function defineProperty(property, value) {
	Object.defineProperty(Cookmate.prototype, property, {
		value: value,
		configurable: true
	});
}

function fnApply(callback, keyword, args) {
	return isFunction(callback) && callback.apply(keyword, args);
}

if (typeof Symbol==="function") {
	defineProperty(Symbol.toStringTag, Cookmate.name);
	defineProperty("VERSION", VERSION);
	defineProperty(Symbol.iterator, arr[Symbol.iterator]);
}

function fnCall(callback, keyword) {
	return fnApply(callback, keyword, slice.call(arguments, 2));
}

// Register as named AMD module, since Codecore can be concatenated with other
// files that may use define
if (typeof define==="function" && define.amd) {
	define("cookmate", [], function() {
		return Cookmate;
	});
}

// Attach or Extend Cookmate in `window` with Expose Cookmate Identifiers, AMD.
// CommonJS for browser emulators (trac-13566)
if (typeof noGlobal==="undefined") {
	window.Cookmate = Cookmate = window.__Cookie = Cookmate;
}



return Cookmate;
});
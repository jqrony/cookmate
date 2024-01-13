# Cookmate [![npm version](https://img.shields.io/npm/v/cookmate?style=flat-square)](https://www.npmjs.com/package/cookmate)

> A pure Javascript Cookie management controller Library.

## How to build Cookmate
Clone a copy of the main Cookmate git repo by running:
```bash
git clone git://github.com/jqrony/cookmate.git
```
In the `cookmate/lib` folder you will find build version of cookmate along with the minified copy and associated map file.

## npm install
```bash
# install locally (recomended)
npm install cookmate --save
```

## Including Cookmate
Below are some of the most common ways to include Cookmate
### Browser
#### Script tag
```html
<!--including Cookmate (recomended) HTML document in head section -->
<script src="https://cdn.jsdelivr.net/npm/cookmate/lib/cookmate.min.js"></script>
```

## API
```js
new Cookmate.set(
  String name,       // ex: token, first-name etc.  (required)
  Mixed value,       // Mixed ex: 4, foo, true etc. (required)
  Timestamp expires, // 3600, Thu, 13 Jan 2024      (required)
  String path,       // Allow: /path                (optional)
  String domain,     // Allow: example.com          (optional)
  Boolean secure,    // Allow: true/false           (optional)
  Boolean HttpOnly,  // Allow: true/false           (optional)
  String sameSite,   // Allow: Strict, Lax, None    (optional)
  String priority    // Allow: High, Medium, Low    (optional)
);
```

```js
/**
 * @param {key} required
 * @returns Boolean true/false
 */
new Cookmate.has(String key);
```

```js
/**
 * @param {key} required
 * @returns matched value
 */
new Cookmate.get(String key);
```

```js
/**
 * @param {key}    String        (required)
 * @param {path}   "/path"       (optional)
 * @param {domain} "example.com" (optional)
 */
new Cookmate.remove(String key, String path, String domain);
```

## Usage
#### Webpack / Browserify / Babel
There are several ways to use [Webpack](https://webpack.js.org/), [Browserify](https://browserify.org/) or [Babel](https://babeljs.io/). For more information on using these tools, please refer to the corresponding project's documentation. In the script, including Cookmate will usually look like this:
```js
import cookmate from "cookmate";
```

If you need to use Cookmate in a file that's not an ECMAScript module, you can use the CommonJS syntax:
```js
const cookmate = require("cookmate");
```

#### AMD (Asynchronous Module Definition)
AMD is a module format built for the browser. For more information, we recommend
```js
define(["cookmate"], function(cookmate) {

});
```
if include Cookmate library or CDN Link in document file. then you use pure javascript syntax:
```js
const cookmate = new Cookmate();
```

### How to switch cookie JSON Format
```js
cookmate.toJson();
// Output: {"id": 1, "user": "foo"}
```

### How to parse cookie
```js
cookmate.parse();
// Output: {id: 1, user: "foo"}
```

### How to serialize cookie
```js
cookmate.serialize();
// Output: id=1&user=foo
```

### How to get All cookie Data
```js
cookmate.getAll();
// Output: {...} returns all cookie data
```

### How to clear All cookie
```js
// Clearing all cookie on active location
cookmate.clear();
```

### How to set cookie
```js
cookmate.set("id", 1, 3600, "/");
cookmate.set("user", "foo", "Thu, 13 Jan 2024", "/");
```

### How to remove cookie
```js
cookmate.remove("id");
// if in case change path and domain then
cookmate.remove("key", "/root", "example.com");
```

### How to get cookie with specific key
```js
cookmate.get("user");
// Output: foo
```

### How to check exist or not-exist cookie
```js
cookmate.has("user");
// Output: true
```

## Event Listener
fire cookmate `change` event when cookie set, remove, clear
```js
cookmate.on("change", fucntion(event) {
  console.log(event.deleted, event.changed);
});
```

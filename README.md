# Introduction&#8291;&#8291;&#8291;

Twixly Extensions lets you extend Twixly in a powerful way. You can create any type of field or view. It's your imagination that stops you. This document describes the API that an extension can use to communicate with the Twixly Management App.

## Inclusion in your project

You will need to include the [twixly-extension-sdk](https://github.com/twixlyhq/extension-sdk) library in your HTML5 app:

```html
<script src="https://unpkg.com/twixly-extension-sdk"></script>
```

The SDK is also distributed as an [NPM package][package].

```bash
npm install --save twixly-extension-sdk
```

You can include it in your code base with

```javascript
var twixlyExtension = require('twixly-extension-sdk')
```

## Initialization

The SDK exposes the `twixlyExtension.init()` method. This is the main entry
point for all extension related code. If you require the script from the web
without any module system the item point is available as


```js
function appStart(extension) {
  var value = extension.field.getValue();
  extension.field.setValue('Hello world!');
}

twixlyExtension.init()
  .then(appStart)
  .catch(function (err) {
    console.log(err);
  });
```

If you use a CommonJS packager for the browser (e.g. [Browserify]) you need to
require the Extensions SDK.

```javascript
var twixlyExtension = require('twixly-extension-sdk')
twixlyExtension.init(function (extension) {
  /* ... */
})
```
## Basic template

Use this HTML template to quickly get up and running in creating your new and awesome Twixly extension:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Awesome Twixly Extension</title>
  <!-- Twixly Extension SDK CSS -->
  <link rel="stylesheet" href="https://unpkg.com/twixly-extension-sdk/index.css">
  <!-- Twixly Extension SDK JavaScript -->
  <script src="https://unpkg.com/twixly-extension-sdk"></script>  
</head>
<body>
  <div class="app-container">
    <!-- Start your awesome extension here -->
  </div>
</body>
</html>
```

[browserify]: http://browserify.org/
[package]: https://www.npmjs.com/package/twixly-extension-sdk

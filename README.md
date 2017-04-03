# Twixly Extension SDK

## Introduction&#8291;&#8291;&#8291;

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
# Extension API Reference

### `extension.itemType`

This API gives you access to data about the item type and the item. It has
the form as described under "item type properties" in our [api
documentation](http://docs.cloudpen.io/item-types.html).

### `extension.field`

This API gives you access to the value and metadata of the field the extension
is attached to.

| Name                                      | Arguments                         | Returns                                                    | Description                                  |
| ----------------------------------------- | --------------------------------- | ---------------------------------------------------------- | -------------------------------------------- |
| `extension.field.getValue()`              | none                              | Mixed value depending of [field type](http://docs.cloudpen.io/field-types.html)   | Gets the current value of the field          |
| `extension.field.setValue(value)`         | value: string                     | Promise:<void> Field                                       | Sets the value for the field                 |
| `extension.field.setInvalid(Boolean)`     | boolean: true/false               | undefined                                                  | Title for this extension                     |
| `extension.field.onChange(cb)`            | function                          | Field object                                               | URI to the extension                         |
| `extension.field.onValidate(cb)`          | function                          | Field object                                               | Extension type. `"field"` or `"view"`        |
| `extension.field.schema`                  | object                            |                                                            | The JSON Schema for this field               |

### `field.getValue(): mixed`

Gets the current value of the field and locale. In the example this would yield
`"My Post"`.

### `field.setValue(value): Promise<void>`

Sets the value for the field. The promise is resolved when the change
has been acknowledged. The type of the value must match the expected field type.
For example, if the extension is attached to a "String" field you must pass a
string.

### `field.setInvalid(Boolean): undefined`

Communicates to the twixly web application if the field is in a valid state
or not. This impacts the styling applied to the field container.

### `field.onChange(cb): function`

Calls the callback every time the value of the field is changed by an external
event (e.g. when multiple editors are working on the same item) or when
`setValue()` is called.

The method returns a function you can call to stop listening to changes.

### `field.onValidate(cb): function`

Calls the callback immediately with the current validation errors and whenever
the field is re-validated. The callback receives an array of error objects. An
empty array indicates no errors.

The errors are updated when the app validates an item. This happens when
loading an item or when the user tries to publish it.

The method returns a function that you can call to stop listening to changes.

### `field.id: string`

The ID of a field is defined in an item's item type. Yields `"title"` in the
example.

## `extension.item`

This object allows you to read and update the value of any field of the current
item and to get the item's metadata.

### `item.fields[id]: Field`

In addition to [`extension.field`](#extensionfield), a extension can also
control the values of all other fields in the current item. Fields are
referenced by their ID.

The `Field` API methods provide a similar interface to `extension.field`.

- `field.id: string`
- `field.getValue(): mixed`
- `field.setValue(value): Promise<void>`
- `field.onChange(cb): function`

#### Example

If the item has a "title" field, you can transform it to upper case with:

```javascript
var titleField = extension.item.fields.title
var oldTitle = titleField.getValue();
titleField.setValue(oldTitle.toUpperCase());
```

## `extension.bucket`

The `bucket` object exposes methods that allow the extension to read and
manipulate a wide range of objects in the bucket.

Allows operating on the current bucket's item types, items and media.

- `bucket.get([item-type, item, media], options): Promise<void>`
- `bucket.get([item-type, item, media]/[id], options): Promise<void>`
- `bucket.post([item-type, item, media], data): Promise<void>`
- `bucket.put([item-type, item, media], data): Promise<void>`
- `bucket.delete(id): Promise<void>`

## `extension.window`

The window object provides methods to update the size of the iframe the
extension is contained within. This prevents scrollbars inside the extension.

To prevent a flickering scrollbar during height updates, it is recommended to
set the extension's `body` to `overflow: hidden;`.

### `window.updateHeight()`

Calculates the body's `scrollHeight` and sets the containers height to this
value.

### `window.updateHeight(height)`

Sets the iframe height to the given value in pixels. `height` must be an
integer.

## `extension.dialogs`

This object provides methods for opening UI dialogs:

### `dialogs.selectSingleitem(options)`

Opens a dialog for selecting a single item. It returns a promise resolved with
the selected entity or `null` if a user closes the dialog without selecting
anything.

`options` is an optional object configuring the dialog.The available `options`
are:

- `locale`: The code of a locale you want to use to display proper titles and
descriptions. Defaults to the bucket's default locale.
- `itemTypes`: An array of item type IDs of items that you want to
display in the selector. By default items of all item types are displayed.

```javascript
// display a dialog for selecting a single item
dialogs.selectSingleitem().then((selecteditem) => {})

// select a single item of "blogpost" item type
// and display result in "de-DE" locale
dialogs.selectSingleitem({
  itemTypes: ['blogpost']
}).then((selecteditem) => {})
```

### dialogs.selectMultipleitems(options)

Works similarly to `selectSingleitem`, but allows to select multiple items
and the returned promise is resolved with an array of selected items.

Both `locale` and `itemTypes` options can be used. There are two additional
options:

- `min` and `max` - numeric values specifying an inclusive range in which the
number of selected entities must be contained

```javascript
// display a dialog for selecting multiple items
dialogs.selectMultipleitems().then((arrayOfSelecteditems) => {})

// select between 1 and 3 (inclusive) items
dialogs.selectMultipleitems({min: 1, max: 3})
.then((arrayOfSelecteditems) => {})
```

### `dialogs.selectSingleMedia(options)`

Counterpart of `selectSingleitem` for media. A `itemTypes` option is not
available.

### `dialogs.selectMultipleMedia(options)`

Counterpart of `selectMultipleitems` for media. A `itemTypes` option is
not available.

[browserify]: http://browserify.org/
[package]: https://www.npmjs.com/package/twixly-extension-sdk

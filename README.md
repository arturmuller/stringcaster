# dotenv-utils

[![npm](https://img.shields.io/npm/v/dotenv-utils.svg)](https://www.npmjs.com/package/dotenv-utils)

> Covert env var strings to other types

Alright, so you're using [`dotenv`](https://www.npmjs.com/package/dotenv). Everything is smooth sailing until you need to convert some of the strings it outputs into a different type.

It probably starts with something like `process.env.MINIFY === "true"` but as your app grows, other "types" might crop up. Ad-hoc solutions slowly become hard to read and maintain. If you have many apps, you might end up with many — subtly different — ways in which you convert vars into something that can be safely consumed.

This is where `dotenv-utils` comes into play. :tada:

You can use individual conversion functions (`boolean`, `number`, `array`, `object`) to convert vars one at a time, or create a new, squeaky clean config object based on a schema using the `conform` helper.

The output of `dotenv-utils` conversion functions is always of the specified type. That way, you can safely call whichever methods that type has without worrying about getting that `Uncaught Type Error: undefined is not a function` fun.

## Install

```sh
# Using `npm`
npm install --save dotenv-utils

# ...or using `yarn`
yarn add dotenv-utils
```

## API

### `boolean`

Converts a string representation of a boolean to an actual boolean. Note that only `"true"` will evaluate to `true` — everything else is `false`.

```js
const {boolean} = require("dotenv-utils")

boolean("true") // true
boolean("false") // false
boolean("foo") // false
boolean("") // false
boolean(undefined) // false
```

### `number`

Converts a string representation of a number to an actual number. Basically like `Number(x)`, but will return a `0` instead of `NaN` when string cannot be converted to a number.

```js
const {number} = require("dotenv-utils")

number("123") // 123
number("  123   ") // 123
number("foo") // 0
number(undefined) // 0
```

### `string`

Trims the supplied string. If provided a falsy value, returns `""`. This is mainly useful when used in conjunction with the `conform` helper.

```js
const {string} = require("dotenv-utils")

string("foo") // foo
string("  foo   ") // "foo"
string("") // ""
string(undefined) // ""
```

### `array`

Converts a string of comma-separated values (`"foo, bar, baz"`) to an array. Any extra whitespace will be trimmed and empty strings discarded.

```js
const {array} = require("dotenv-utils")

array("foo, bar, baz") // ["foo", "bar", "baz"]
array("foo,   bar,    baz") // ["foo", "bar", "baz"]
array(",,,") // []
array("") // []
array(undefined) // []
```

### `object`

Converts a string of comma-separated tuples (`"foo: bar, baz: quux"`) to an object. Any extra whitespace from either key or value will be discarded, as are tuples with falsy keys.

```js
const {object} = require("dotenv-utils")

object("foo: bar, baz: quux") // {foo: "bar", baz: "quux"}
object("foo:    bar   , baz:quux") // {foo: "bar", baz: "quux"}
object(":,foo:") // {foo: ""}
object("::,") // {}
object("") // {}
object(undefined) // {}
```

### `conform`

Provided a schema, `conform` picks keys from the supplied env object and converts them using the supplied functions.

Keys which are present in the `schema`, but not in you `process.env` will be present in the final object, having a value based on calling the conversion function with `undefined`.

Given this `.env`:
```
DEFAULT_LOCALE=en-GB
SUPPORTED_LOCALES=en-GB,cs-CZ,pl-PL
```

You can do this in your `config.js`:
```js
// Load your env vars
require('dotenv').config();

const {conform, boolean, array, string} = require("dotenv-utils")

// Specify a schema using the conversion functions
const schema = {
  MINIFY: boolean,
  DEFAULT_LOCALE: string,
  SUPPORTED_LOCALES: array,
}

// Drop `process.env` into `conform`
const config = conform(process.env, schema)

// `config` is now:
// {
//   MINIFY: false,
//   DEFAULT_LOCALE: "en-GB",
//   SUPPORTED_LOCALES: ["en-GB", "cs-CZ", "pl-PL"],
// }

module.exports = config
```

## License

MIT

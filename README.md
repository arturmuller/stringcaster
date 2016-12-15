# dotenv-utils

[![npm](https://img.shields.io/npm/v/dotenv-utils.svg)](https://www.npmjs.com/package/dotenv-utils)

> Covert env var strings to booleans, numbers, arrays, and objects.

**Context:** Environment variables are a great way to separate config from code. Tools like [`dotenv`](https://www.npmjs.com/package/dotenv) make this almost perfect but...

**The problem:** Environment variables are always strings. If you set a variable `MINIFY=false` and try to check it using `if (process.env.MINIFY) { ...some logic }`, then "...some logic" will actually be executed as non-empty strings are truthy.

The quick solution is to write `process.env.MINIFY === "true"` instead, but as you get more vars and more var "types", these ad-hoc solutions become tedious, unclear, and error-prone.

**The solution**: `dotenv-utils` provides several helpers to make sure you never have to worry about this again.

- [`boolean`](#boolean), [`number`](#number), [`array`](#array), [`object`](#object) convert vars one at a time.
- [`conform`](#conform) creates a new config object with the correct types based on a schema.

Conversion functions always return the right type. That way, you can safely call methods without worrying about getting that `Uncaught Type Error: undefined is not a function` fun.

## Install

```sh
# Using `npm`
npm install --save dotenv-utils

# ...or using `yarn`
yarn add dotenv-utils
```

Tested on Node.js v6.9.2, likely runs on earlier versions too.

## API

### `boolean`

Converts a string representation (case-insensitive) of a boolean to an actual boolean.

```js
const {boolean} = require("dotenv-utils")

boolean("true") // true
boolean("TRUE") // true
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

Trims the supplied string. If provided a falsy value, returns `""`. This is mainly useful when used in conjunction with the [`conform`](#conform) helper.

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
object("foo:    bar   ,baz:quux") // {foo: "bar", baz: "quux"}
object(":,foo:") // {foo: ""}
object("::,") // {}
object("") // {}
object(undefined) // {}
```

### `conform`

Provided a schema, `conform` picks keys from an env object and converts them using the supplied functions.

Keys which are present in the `schema`, but not in the supplied `env` object *will* be present in the final object, having a value/type based on calling the conversion function with `undefined`.

Given these env vars:
```
DEFAULT_LOCALE=en-GB
SUPPORTED_LOCALES=en-GB,cs-CZ,pl-PL
```

You can do this:
```js
// Make sure you have loaded the env vars somehow,
// either inline or using `dotenv`...

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

## Other Tools

- https://www.npmjs.com/package/getenv — Slightly different concept, very good solution.
- https://github.com/niftylettuce/dotenv-parse-variables — Very similar, mutates `process.env`.

## License

MIT

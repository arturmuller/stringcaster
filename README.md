# stringcaster

[![npm](https://img.shields.io/npm/v/stringcaster.svg)](https://www.npmjs.com/package/stringcaster)

> Covert env strings to booleans, numbers, arrays, and objects.

In JavaScript land, there are many places in which you can only be given strings, but what is need is all kinds of types. Environment variables and command line arguments are two common cases.

For example, if you set an env variable `MINIFY=false` and try to check it using `if (process.env.MINIFY) { ...some logic }`, then "...some logic" will actually be executed as non-empty strings are truthy.

The quick solution is to write checks like `process.env.MINIFY === "true"` everywhere, but as you get more vars and more var "types", these ad-hoc solutions become tedious, unclear, and error-prone.

`stringcaster` provides several helpers to make sure you never have to worry about this again.

- [`toBoolean`](#toBoolean), [`toNumber`](#toNumber), [`toArray`](#toArray), [`toObject`](#toObject) convert vars one at a time.
- [`conform`](#conform) takes an object and applies transformations based on a provided schema.

Conversion functions always return the right type. That way, you can safely call methods without worrying about getting that `Uncaught Type Error: undefined is not a function` fun.

## Install

```sh
# Using `npm`
npm install --save stringcaster

# ...or using `yarn`
yarn add stringcaster
```

Tested on Node.js v6.9.2, likely runs on earlier versions too.

## API

### `toBoolean`

Converts a string representation (case-insensitive) of a boolean to an actual boolean.

```js
const { toBoolean } = require("stringcaster")

toBoolean("true") // true
toBoolean("TRUE") // true
toBoolean("false") // false
toBoolean("foo") // false
toBoolean("") // false
toBoolean(undefined) // false
```

### `toNumber`

Converts a string representation of a number to an actual number. Basically like `Number(x)`, but will return a `0` instead of `NaN` when string cannot be converted to a number.

```js
const { toNumber } = require("stringcaster")

toNumber("123") // 123
toNumber("  123   ") // 123
toNumber("foo") // 0
toNumber(undefined) // 0
```

### `toString`

Trims the supplied string. If provided a falsy value, returns `""`. This is mainly useful when used in conjunction with the [`conform`](#conform) helper.

```js
const { toString } = require("stringcaster")

toString("foo") // foo
toString("  foo   ") // "foo"
toString("") // ""
toString(undefined) // ""
```

### `toArray`

Converts a string of comma-separated values (`"foo, bar, baz"`) to an array. Any extra whitespace will be trimmed and empty strings discarded.

```js
const { toArray } = require("stringcaster")

toArray("foo, bar, baz") // ["foo", "bar", "baz"]
toArray("foo,   bar,    baz") // ["foo", "bar", "baz"]
toArray(",,,") // []
toArray("") // []
toArray(undefined) // []
```

### `toObject`

Converts a string of comma-separated tuples (`"foo: bar, baz: quux"`) to an object. Any extra whitespace from either key or value will be discarded, as are tuples with falsy keys.

```js
const { toObject } = require("stringcaster")

toObject("foo: bar, baz: quux") // {foo: "bar", baz: "quux"}
toObject("foo:    bar   ,baz:quux") // {foo: "bar", baz: "quux"}
toObject(":,foo:") // {foo: ""}
toObject("::,") // {}
toObject("") // {}
toObject(undefined) // {}
```

### `conform`

Provided a schema, `conform` picks keys from an env object and converts them using the supplied functions.

Keys which are present in the `schema`, but not in the supplied `env` object *will* be present in the final object, having a value/type based on calling the conversion function with `undefined`.

For example, given these env vars:
```
DEFAULT_LOCALE=en-GB
SUPPORTED_LOCALES=en-GB,cs-CZ,pl-PL
```

You can do this:
```js
// Make sure you have loaded the env vars somehow,
// either inline or using `dotenv`...

const { conform, toBoolean, toArray, toString } = require("stringcaster")

// Specify a schema using the conversion functions
const schema = {
  MINIFY: toBoolean,
  DEFAULT_LOCALE: toString,
  SUPPORTED_LOCALES: toArray,
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

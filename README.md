# Stringcaster

[![npm](https://img.shields.io/npm/v/stringcaster.svg)](https://www.npmjs.com/package/stringcaster)

Stringcaster is a focused, light-weight, tested, zero-dependency lib that lets you cast strings into any kind of JavaScript primitive type.


## The Problem

There are many places in JavaScript land where you'll only ever be given strings as input: environment variables, command-line arguments, cookies, and many others.

Imagine that you have a script that enables a feature based on an env variable. A correct-looking check like this: `if (process.env.ENABLE_BUBBLES) { ...some logic }` will actually not fail when the script is run with `ENABLE_BUBBLES=false`, because env vars are strings and non-empty strings in JavaScript are truthy. Ugh.

The quick solution is to write more careful checks like so `process.env.ENABLE_BUBBLES === "true"`, but as you get more vars, more var "types", and a bigger team, these ad-hoc solutions become tedious, unclear, and error-prone.

Stringcaster solves this by providing a clean API for casting strings to any kind of JavaScript primitive type without hassle. It works. It's tested. No more bubbles!


## Install

```sh
# Using `npm`
npm install --save stringcaster

# ...or using `yarn`
yarn add stringcaster
```

Tested on Node.js v6.9.2, likely runs on earlier versions too.


## API

The core conversion functions in Stringcaster are:

- [`toBoolean`](#toBoolean)
- [`toNumber`](#toNumber)
- [`toString`](#toString)
- [`toArray`](#toArray)
- [`toObject`](#toObject)

All of these also contain a `withDefault` method that can be used to create a new conversion function with a custom fallback value.

Lastly, there is also the [`conform`](#conform) utility function, which takes an object and applies transformations based on a provided schema. Very useful for converting `process.env` variables!

Conversion functions **always return the right type**. That way, you can safely call methods without worrying about getting that _undefined-is-not-a-function_ fun.

### `toBoolean`

Converts a string representation (case-insensitive) of a boolean to an actual boolean.

```js
const cast = require("stringcaster")

cast.toBoolean("true") // true
cast.toBoolean("TRUE") // true
cast.toBoolean("false") // false
cast.toBoolean("foo") // false
cast.toBoolean("") // false
cast.toBoolean(undefined) // false

const castToBooleanDefaultTrue = cast.toBoolean.withDefault(true)
toBooleanDefaultTrue(undefined) // true
```

### `toNumber`

Converts a string representation of a number to an actual number. Basically like `Number(x)`, but will return a `0` instead of `NaN` when string cannot be converted to a number.

```js
const cast = require("stringcaster")

cast.toNumber("123") // 123
cast.toNumber("  123   ") // 123
cast.toNumber("foo") // 0
cast.toNumber(undefined) // 0

const castToNumberDefault42 = cast.toNumber.withDefault(42)
toBooleanDefaultTrue(undefined) // 42
```

### `toString`

Trims the supplied string. If provided a falsy value, returns `""`. This is mainly useful when used in conjunction with the [`conform`](#conform) helper.

```js
const cast = require("stringcaster")

cast.toString("foo") // foo
cast.toString("  foo   ") // "foo"
cast.toString("") // ""
cast.toString(undefined) // ""

const castToStringDefaultFoo = cast.toString.withDefault("foo")
castToStringDefaultFoo(undefined) // "foo"
```

### `toArray`

Converts a string of comma-separated values (`"foo, bar, baz"`) to an array of strings. Any extra whitespace will be trimmed and empty strings discarded.

```js
const cast = require("stringcaster")

cast.toArray("foo, bar, baz") // ["foo", "bar", "baz"]
cast.toArray("foo,   bar,    baz") // ["foo", "bar", "baz"]
cast.toArray(",,,") // []
cast.toArray("") // []
cast.toArray(undefined) // []

const castToArrayDefaultFooBar = cast.toArray.withDefault(["foo", "bar"])
castToArrayDefaultFooBar(undefined) // ["foo", "bar"]
```

### `toObject`

Converts a string of comma-separated tuples (`"foo: bar, baz: quux"`) to an object. Any extra whitespace from either key or value will be discarded, as are tuples with falsy keys.

```js
const cast = require("stringcaster")

cast.toObject("foo: bar, baz: quux") // {foo: "bar", baz: "quux"}
cast.toObject("foo:    bar   ,baz:quux") // {foo: "bar", baz: "quux"}
cast.toObject(":,foo:") // {foo: ""}
cast.toObject("::,") // {}
cast.toObject("") // {}
cast.toObject(undefined) // {}

const castToObjectDefaultFooBar = cast.toObject.withDefault({ foo: "bar" })
castToObjectDefaultFooBar(undefined) // { foo: "bar" }
```

### `conform`

Provided a schema, `conform` picks keys from an object and converts them using the supplied functions.

Keys which are present in the `schema`, but not in the supplied object *will* be present in the final object, having a value/type based on calling the conversion function with `undefined`.

For example, imagine this script:

```js
// Presume that the following env vars have been set:
// MINIFY=false
// SUPPORTED_LOCALES=en-GB,cs-CZ,pl-PL

const cast = require("stringcaster")

// Specify a schema using the conversion functions
const schema = {
  MINIFY: cast.toBoolean,
  DEFAULT_LOCALE: cast.toString.withDefault("en-GB"),
  SUPPORTED_LOCALES: cast.toArray,
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

# dotenv-utils

> Covert env var strings to other types

Alright, so you're using [`dotenv`](https://www.npmjs.com/package/dotenv). Everything is smooth sailing until you need to convert some of the strings it outputs into a different type.

It probably starts with something like `process.env.MINIFY === "true"` but as your app grows, other "types" might crop up. Ad-hoc solutions slowly become hard to read and maintain. If you have many apps, you might end up with many, subtly different, ways in which you convert your vars into something that can be safely consumed by your app.

This is where `dotenv-utils` comes into play. :tada:

Use individual conversion functions (`boolean`, `number`, `array`, `object`) to convert vars one at a time, or create a new, squeaky clean config object based on a schema using the `conform` helper.

## Install

```sh
npm install --save dotenv-utils
```

## API

### `boolean`

Converts a string representation of a boolean to an actual boolean. Note that only the `"true"` will evaluate to `true` — everything else is `false`.

```js
const {boolean} = require("dotenv-utils")

boolean("true") // true
boolean("false") // false
boolean("foo") // false
boolean("") // false
boolean(undefined) // false
```

### `number`

Converts a string representation of a number to an actual number. Basically like `Number(x)`, but will return a `0` instead of `NaN` when string cannot be cast to a number.

```js
const {number} = require("dotenv-utils")

number("123") // 123
number("  123   ") // 123
number("foo") // 0
number(undefined) // 0
```

### `string`

Trims the supplied string and, if provided falsy value, returns `""`. This is mainly useful when used in conjunction with the `conform` helper.

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

Converts a string of comma-separated tuples ("foo: bar, baz: quux") to an object. Any extra whitespace from either key or value will be discarded, as are tuples with falsy keys.

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

```js
// Load your env vars
require('dotenv').config();
const {conform, boolean, array} = require("dotenv-utils")

const schema = {
  MINIFY: boolean,
  SUPPORTED_LOCALES: array,
}

const config = conform(process.env, schema)

module.exports = config
```

## License

MIT

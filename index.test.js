const test = require('ava')
const {boolean, number, string, array, object, conform} = require("./index")

test("boolean", (t) => {
  t.true(boolean("true"))
  t.true(boolean("  true   "))
  t.false(boolean("false"))
  t.false(boolean(""))
  t.false(boolean(undefined))
})

test("number", (t) => {
  t.is(number("1"), 1)
  t.is(number("0"), 0)
  t.is(number(""), 0)
  t.is(number("foobar"), 0)
  t.is(number(undefined), 0)
})

test("string", (t) => {
  t.is(string("foo"), "foo")
  t.is(string("   bar   "), "bar")
  t.is(string(""), "")
  t.is(string(undefined), "")
})

test("array", (t) => {
  t.deepEqual(array("foo, bar, baz"), ["foo", "bar", "baz"])
  t.deepEqual(array("foo,   bar,baz"), ["foo", "bar", "baz"])
  t.deepEqual(array(",,"), [])
  t.deepEqual(array(""), [])
  t.deepEqual(array(undefined), [])
})

test("object", (t) => {
  t.deepEqual(object("foo: bar, baz: quux"), {foo: "bar", baz: "quux"})
  t.deepEqual(object("foo:    bar   , baz:quux"), {foo: "bar", baz: "quux"})
  t.deepEqual(object(":,foo:"), {foo: ""})
  t.deepEqual(object("::,"), {})
  t.deepEqual(object(""), {})
  t.deepEqual(object(undefined), {})
})

test("conform", (t) => {
  const schema = {
    STRING: string,
    BOOLEAN: boolean,
    NUMBER: number,
    ARRAY: array,
    OBJECT: object,
    MISSING: array,
  }

  const env = {
    STRING: "foo",
    BOOLEAN: "true",
    NUMBER: "123",
    ARRAY: "foo, bar, baz",
    OBJECT: "beep:boop, boom:bam",
  }

  const expected = {
    STRING: "foo",
    BOOLEAN: true,
    NUMBER: 123,
    ARRAY: ["foo", "bar", "baz"],
    OBJECT: {beep: "boop", boom: "bam"},
    MISSING: [],
  }

  const result = conform(env, schema)

  t.deepEqual(result, expected)

  const badSchema = {
    STRING: "not a function",
  }

  t.throws(() => conform(env, badSchema))
})

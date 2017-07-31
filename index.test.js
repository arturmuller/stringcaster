/* globals test expect */

const { boolean, number, string, array, object, conform } = require("./index");

test("boolean", () => {
  // Values should be correctly cast
  expect(boolean("true")).toBe(true);
  expect(boolean("TRUE")).toBe(true);
  expect(boolean("  true   ")).toBe(true);
  expect(boolean("false")).toBe(false);
  expect(boolean("xyz")).toBe(false);
  expect(boolean("")).toBe(false);
  expect(boolean(undefined)).toBe(false);
});

test("boolean.withDefault", () => {
  // Default should be respected if no value provided
  expect(boolean.withDefault(true)(undefined)).toBe(true);

  // Default should not override provided value
  expect(boolean.withDefault(true)("false")).toBe(false);

  // Default value of wrong type should throw
  expect(() => boolean.withDefault("not a boolean")).toThrow();
});

test("number", () => {
  expect(number("1")).toBe(1);
  expect(number("0")).toBe(0);
  expect(number("")).toBe(0);
  expect(number("foobar")).toBe(0);
  expect(number(undefined)).toBe(0);
});

test("number.withDefault", () => {
  // Default should be respected if no value provided
  expect(number.withDefault(9000)(undefined)).toBe(9000);

  // Default should not override provided value
  expect(number.withDefault(9000)(1)).toBe(1);

  // Default value of wrong type should throw
  expect(() => number.withDefault("not a number")).toThrow();
});

test("string", () => {
  expect(string("foo")).toBe("foo");
  expect(string("   bar   ")).toBe("bar");
  expect(string("")).toBe("");
  expect(string(undefined)).toBe("");
});

test("string.withDefault", () => {
  // Default should be respected if no value provided
  expect(string.withDefault("beep")(undefined)).toBe("beep");

  // Default should not override provided value
  expect(string.withDefault("beep")("BANG!")).toBe("BANG!");

  // Default value of wrong type should throw
  expect(() => string.withDefault(0)).toThrow();
});

test("array", () => {
  expect(array("foo, bar, baz")).toEqual(["foo", "bar", "baz"]);
  expect(array("foo,   bar,baz")).toEqual(["foo", "bar", "baz"]);
  expect(array(",,")).toEqual([]);
  expect(array("")).toEqual([]);
  expect(array(undefined)).toEqual([]);
});

test("array.withDefault", () => {
  // Default should be respected if no value provided
  expect(array.withDefault(["a", "b"])(undefined)).toEqual(["a", "b"]);

  // Default should not override provided value
  expect(array.withDefault(["a", "b"])("c, d")).toEqual(["c", "d"]);

  // Default value of wrong type should throw
  expect(() => array.withDefault("not array")).toThrow();
});

test("object", () => {
  expect(object("a: x, b: y")).toEqual({ a: "x", b: "y" });
  expect(object("a:    x   , b:y")).toEqual({ a: "x", b: "y" });
  expect(object(":,foo:")).toEqual({ foo: "" });
  expect(object("::,")).toEqual({});
  expect(object("")).toEqual({});
  expect(object(undefined)).toEqual({});
});

test("object.withDefault", () => {
  // Default should be respected if no value provided
  expect(object.withDefault({ foo: "bar" })(undefined)).toEqual({ foo: "bar" });

  // Default should not override provided value
  expect(object.withDefault({ foo: "bar" })("a: b")).toEqual({ a: "b" });

  // Default value of wrong type should throw
  expect(() => object.withDefault("not object")).toThrow();
});

test("conform", () => {
  const env = {
    STRING: "foo",
    BOOLEAN: "true",
    NUMBER: "123",
    ARRAY: "foo, bar, baz",
    OBJECT: "beep:boop, boom:bam",
  };

  // Env object values should be cast according to schema

  const schema = {
    STRING: string,
    BOOLEAN: boolean,
    NUMBER: number,
    ARRAY: array,
    OBJECT: object,
    MISSING_STRING: string.withDefault("string"),
    MISSING_BOOLEAN: boolean.withDefault(true),
    MISSING_NUMBER: number.withDefault(9000),
    MISSING_ARRAY: array.withDefault(["foo", "bar"]),
    MISSING_OBJECT: object.withDefault({ some: "object" }),
  };

  expect(conform(env, schema)).toEqual({
    STRING: "foo",
    BOOLEAN: true,
    NUMBER: 123,
    ARRAY: ["foo", "bar", "baz"],
    OBJECT: { beep: "boop", boom: "bam" },
    MISSING_STRING: "string",
    MISSING_BOOLEAN: true,
    MISSING_NUMBER: 9000,
    MISSING_ARRAY: ["foo", "bar"],
    MISSING_OBJECT: { some: "object" },
  });

  // Providing invalid schema should throw

  const badSchema = {
    STRING: "not a function",
  };

  expect(() => conform(env, badSchema)).toThrow();
});

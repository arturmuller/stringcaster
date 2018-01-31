/* eslint-env jest */

const {
  toBoolean,
  toString,
  toNumber,
  toArray,
  toObject,
  conform,
} = require("./index");

test("toBoolean", () => {
  // Values should be correctly cast
  expect(toBoolean("true")).toBe(true);
  expect(toBoolean("TRUE")).toBe(true);
  expect(toBoolean("  true   ")).toBe(true);
  expect(toBoolean("false")).toBe(false);
  expect(toBoolean("xyz")).toBe(false);
  expect(toBoolean("")).toBe(false);
  expect(toBoolean(undefined)).toBe(false);
});

test("toBoolean.withDefault", () => {
  // Default should be respected if no value provided
  expect(toBoolean.withDefault(true)(undefined)).toBe(true);

  // Default should not override provided value
  expect(toBoolean.withDefault(true)("false")).toBe(false);

  // Default value of wrong type should throw
  expect(() => toBoolean.withDefault("not a boolean")).toThrow();
});

test("toNumber", () => {
  expect(toNumber("1")).toBe(1);
  expect(toNumber("0")).toBe(0);
  expect(toNumber("")).toBe(0);
  expect(toNumber("foobar")).toBe(0);
  expect(toNumber(undefined)).toBe(0);
});

test("toNumber.withDefault", () => {
  // Default should be respected if no value provided
  expect(toNumber.withDefault(9000)(undefined)).toBe(9000);

  // Default should not override provided value
  expect(toNumber.withDefault(9000)(1)).toBe(1);

  // Default value of wrong type should throw
  expect(() => toNumber.withDefault("not a number")).toThrow();
});

test("toString", () => {
  expect(toString("foo")).toBe("foo");
  expect(toString("   bar   ")).toBe("bar");
  expect(toString("")).toBe("");
  expect(toString(undefined)).toBe("");
});

test("toString.withDefault", () => {
  // Default should be respected if no value provided
  expect(toString.withDefault("beep")(undefined)).toBe("beep");

  // Default should not override provided value
  expect(toString.withDefault("beep")("BANG!")).toBe("BANG!");

  // Default value of wrong type should throw
  expect(() => toString.withDefault(0)).toThrow();
});

test("toArray", () => {
  expect(toArray("foo, bar, baz")).toEqual(["foo", "bar", "baz"]);
  expect(toArray("foo,   bar,baz")).toEqual(["foo", "bar", "baz"]);
  expect(toArray(",,")).toEqual([]);
  expect(toArray("")).toEqual([]);
  expect(toArray(undefined)).toEqual([]);
});

test("toArray.withDefault", () => {
  // Default should be respected if no value provided
  expect(toArray.withDefault(["a", "b"])(undefined)).toEqual(["a", "b"]);

  // Default should not override provided value
  expect(toArray.withDefault(["a", "b"])("c, d")).toEqual(["c", "d"]);

  // Default value of wrong type should throw
  expect(() => toArray.withDefault("not array")).toThrow();
});

test("toObject", () => {
  expect(toObject("a: x, b: y")).toEqual({ a: "x", b: "y" });
  expect(toObject("a:    x   , b:y")).toEqual({ a: "x", b: "y" });
  expect(toObject(":,foo:")).toEqual({ foo: "" });
  expect(toObject("::,")).toEqual({});
  expect(toObject("")).toEqual({});
  expect(toObject(undefined)).toEqual({});
});

test("toObject.withDefault", () => {
  // Default should be respected if no value provided
  expect(toObject.withDefault({ foo: "bar" })(undefined)).toEqual({
    foo: "bar",
  });

  // Default should not override provided value
  expect(toObject.withDefault({ foo: "bar" })("a: b")).toEqual({ a: "b" });

  // Default value of wrong type should throw
  expect(() => toObject.withDefault("not object")).toThrow();
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
    STRING: toString,
    BOOLEAN: toBoolean,
    NUMBER: toNumber,
    ARRAY: toArray,
    OBJECT: toObject,
    MISSING_STRING: toString.withDefault("string"),
    MISSING_BOOLEAN: toBoolean.withDefault(true),
    MISSING_NUMBER: toNumber.withDefault(9000),
    MISSING_ARRAY: toArray.withDefault(["foo", "bar"]),
    MISSING_OBJECT: toObject.withDefault({ some: "object" }),
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

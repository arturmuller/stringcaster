// utils

const checkDefaultValueType = (type, defaultValue, test) => {
  const testDefaultValue = test || (dv => typeof dv === type);

  // prettier-ignore
  if (!testDefaultValue(defaultValue))
    throw new Error(`Invalid default value provided to "${type}.withDefault". Should be "${type}" but got "${typeof defaultValue}"`);
};

// boolean

const booleanWithDefault = (defaultValue = false) => {
  checkDefaultValueType("boolean", defaultValue);

  return string =>
    string ? string.toLowerCase().trim() === "true" : defaultValue;
};

const boolean = booleanWithDefault();
boolean.withDefault = booleanWithDefault;

// string

const stringWithDefault = (defaultValue = "") => {
  checkDefaultValueType("string", defaultValue);

  return string => string ? string.trim() : defaultValue;
};

const string = stringWithDefault();
string.withDefault = stringWithDefault;

// number

const numberWithDefault = (defaultValue = 0) => {
  checkDefaultValueType("number", defaultValue);
  return string => {
    if (!string) return defaultValue;
    const num = Number.parseInt(string);
    return Number.isNaN(num) ? defaultValue : num;
  };
};

const number = numberWithDefault();
number.withDefault = numberWithDefault;

const arrayWithDefault = (defaultValue = []) => {
  checkDefaultValueType("array", defaultValue, v => Array.isArray(v));

  return string =>
    string
      ? string.split(",").map(s => s.trim()).filter(Boolean)
      : defaultValue;
};

const array = arrayWithDefault();
array.withDefault = arrayWithDefault;

const objectWithDefault = (defaultValue = {}) => {
  checkDefaultValueType("object", defaultValue);

  return string =>
    string
      ? string.split(",").reduce((acc, v) => {
          const [key, value] = v.trim().split(":").map(s => s.trim());
          if (key) acc[key] = value;
          return acc;
        }, {})
      : defaultValue;
};

const object = objectWithDefault();
object.withDefault = objectWithDefault;

const conform = (env, schema) => {
  return Object.keys(schema).reduce((acc, key) => {
    const transform = schema[key];
    const type = typeof transform;

    if (type !== "function") {
      throw new Error(
        "Invalid schema. Conversion functions should be provided in " +
          `the schema object. Instead saw type "${type}" at the ` +
          `"${key}" key.`
      );
    }

    acc[key] = transform(env[key]);
    return acc;
  }, {});
};

module.exports = { boolean, string, number, array, object, conform };

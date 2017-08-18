// utils

const checkDefaultValueType = (type, defaultValue, test) => {
  const testDefaultValue = test || (dv => typeof dv === type);

  // prettier-ignore
  if (!testDefaultValue(defaultValue))
    throw new Error(`Invalid default value provided to "${type}.withDefault". Should be "${type}" but got "${typeof defaultValue}"`);
};

// boolean

const toBooleanWithDefault = (defaultValue = false) => {
  checkDefaultValueType("boolean", defaultValue);

  return string =>
    string ? string.toLowerCase().trim() === "true" : defaultValue;
};

const toBoolean = toBooleanWithDefault();
toBoolean.withDefault = toBooleanWithDefault;

// string

const toStringWithDefault = (defaultValue = "") => {
  checkDefaultValueType("string", defaultValue);

  return string => string ? string.trim() : defaultValue;
};

const toString = toStringWithDefault();
toString.withDefault = toStringWithDefault;

// number

const toNumberWithDefault = (defaultValue = 0) => {
  checkDefaultValueType("number", defaultValue);
  return string => {
    if (!string) return defaultValue;
    const num = Number.parseInt(string);
    return Number.isNaN(num) ? defaultValue : num;
  };
};

const toNumber = toNumberWithDefault();
toNumber.withDefault = toNumberWithDefault;

const toArrayWithDefault = (defaultValue = []) => {
  checkDefaultValueType("array", defaultValue, v => Array.isArray(v));

  return string =>
    string
      ? string.split(",").map(s => s.trim()).filter(Boolean)
      : defaultValue;
};

const toArray = toArrayWithDefault();
toArray.withDefault = toArrayWithDefault;

const toObjectWithDefault = (defaultValue = {}) => {
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

const toObject = toObjectWithDefault();
toObject.withDefault = toObjectWithDefault;

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

module.exports = { toBoolean, toString, toNumber, toArray, toObject, conform };

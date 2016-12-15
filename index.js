const boolean = (s) => s
  ? s.toLowerCase().trim() === "true"
  : false

const string = (s) => s
  ? s.trim()
  : ""

const number = (s) => Number(s) || 0

const array = (s) => s
  ? s.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : []

const object = (s) => s
  ? s.split(",").reduce((acc, v) => {
      const [key, value] = v.trim()
        .split(":")
        .map((s) => s.trim())

      if (key) {
        acc[key] = value
      }

      return acc
    }, {})
  : {}

const conform = (env, schema) => {
  return Object.keys(schema).reduce((acc, key) => {
    const transform = schema[key]
    const type = typeof transform

    if (type !== "function") {
      throw new Error(
        `Invalid schema. Conversion functions should be provided in ` +
        `the schema object. Instead saw type "${type}" at the ` +
        `"${key}" key.`
      )
    }

    acc[key] = transform(env[key])
    return acc
  }, {})
}

module.exports = {boolean, string, number, array, object, conform}

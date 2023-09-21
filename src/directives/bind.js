import { directive } from "../directive"

export const bind = directive("bind", (element, { attribute, value, effect }) => {
  const bindings = attribute().split(" ")
  bindings.forEach(binding => {
    const [attr, method] = binding.split(":")
    effect(() => {
      // Most of these are taken from alpine.js code
      switch (attr) {
        case "class":
          return bindClass(element, value(method))
        case "value":
          return bindProperty(element, "value", value(method))
        case "selected":
        case "checked":
          return bindAttributeAndProperty(element, attr, value(method))
        default:
          return bindAttribute(element, attr, value(method))
      }
    })
  })
})

function bindClass(element, value) {
  if (element._sr_undoClass) element._sr_undoClass()

  // TODO: handle array, object values
  let addedClasses = []
  const missingClasses = value.split(" ").filter(c => !element.classList.contains(c)).filter(Boolean)
  element.classList.add(...missingClasses)
  addedClasses = addedClasses.concat(missingClasses)

  element._sr_undoClass = () => element.classList.remove(...addedClasses)
}

function bindAttributeAndProperty(element, property, value) {
  bindAttribute(element, property, value)
  bindProperty(element, property, value)
}

function bindProperty(element, property, value) {
  setPropertyIfChanged(element, property, value)
}

function bindAttribute(element, attribute, value) {
  if ([null, undefined, false].includes(value) && attributeShouldntBePreservedIfFalsy(attribute)) {
    element.removeAttribute(attribute)
  } else {
    if (isBooleanAttribute(attribute)) value = attribute
    setAttributeIfChanged(element, attribute, value)
  }
}

function attributeShouldntBePreservedIfFalsy(name) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(name)
}

function isBooleanAttribute(attribute) {
  // As per HTML spec table https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute
  // Array roughly ordered by estimated usage
  const booleanAttributes = [
    "disabled", "checked", "required", "readonly", "hidden", "open", "selected",
    "autofocus", "itemscope", "multiple", "novalidate", "allowfullscreen",
    "allowpaymentrequest", "formnovalidate", "autoplay", "controls", "loop",
    "muted", "playsinline", "default", "ismap", "reversed", "async", "defer",
    "nomodule"
  ]

  return booleanAttributes.includes(attribute)
}

function setPropertyIfChanged(element, property, value) {
  if (element[property] !== value) element[property] = value
}

function setAttributeIfChanged(element, attribute, value) {
  if (element.getAttribute(attribute) != value) element.setAttribute(attribute, value)
}
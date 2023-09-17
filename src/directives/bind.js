import { BaseDirective } from "./base"
import { tryMethod } from "../utils"

export class BindDirective extends BaseDirective {
  static name = "bind"

  act(element) {
    const bindings = this.getAttribute(element).split(" ")

    bindings.forEach(binding => {
      const [attr, method] = binding.split(":")

      this.effect(() => {
        this.pauseObserver(() => {
          this.bind(element, attr, tryMethod(this.controller, method, element))
        })
      })
    })
  }

  bind(element, attribute, value) {
    // Most of these are taken from alpine.js code
    switch (attribute) {
      case "class":
        return this.bindClass(element, value)
      case "value":
        return this.bindProperty(element, attribute, value)
      case "selected":
      case "checked":
        return this.bindAttributeAndProperty(element, attribute, value)
      default:
        return this.bindAttribute(element, attribute, value)
    }
  }

  bindClass(element, value) {
    if (element._undoClass) element._undoClass()

    // TODO: handle array, object values
    let addedClasses = []
    const missingClasses = value.split(" ").filter(c => !element.classList.contains(c)).filter(Boolean)
    element.classList.add(...missingClasses)
    addedClasses = addedClasses.concat(missingClasses)

    element._undoClass = () => element.classList.remove(...addedClasses)
  }

  bindAttributeAndProperty(element, property, value) {
    this.bindAttribute(element, property, value)
    this.bindProperty(element, property, value)
  }

  bindProperty(element, property, value) {
    this.setPropertyIfChanged(element, property, value)
  }

  bindAttribute(element, attribute, value) {
    if ([null, undefined, false].includes(value) && this.attributeShouldntBePreservedIfFalsy(attribute)) {
      element.removeAttribute(attribute)
    } else {
      if (this.isBooleanAttribute(attribute)) value = attribute
      this.setAttributeIfChanged(element, attribute, value)
    }
  }

  attributeShouldntBePreservedIfFalsy(name) {
    return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(name)
  }

  isBooleanAttribute(attribute) {
    // As per HTML spec table https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute
    // Array roughly ordered by estimated usage
    const booleanAttributes = [
      "disabled", "checked", "required", "readonly", "hidden", "open", "selected",
      "autofocus", "itemscope", "multiple", "novalidate", "allowfullscreen",
      "allowpaymentrequest", "formnovalidate", "autoplay", "controls", "loop",
      "muted", "playsinline", "default", "ismap", "reversed", "async", "defer",
      "nomodule",
    ]

    return booleanAttributes.includes(attribute)
  }

  setPropertyIfChanged(element, property, value) {
    if (element[property] !== value) element[property] = value
  }

  setAttributeIfChanged(element, attribute, value) {
    if (element.getAttribute(attribute) != value) element.setAttribute(attribute, value)
  }
}
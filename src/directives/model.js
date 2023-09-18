import { BaseDirective } from "./base"

export class ModelDirective extends BaseDirective {
  static name = "model"

  act(element) {
    const accessor = this.getAttribute(element)

    if (element.tagName === "SELECT") {
      this.modelSelect(element, accessor)
    } else if (element.type === "checkbox") {
      this.modelCheckbox(element, accessor)
    } else if (element.type === "radio") {
      this.modelRadio(element, accessor)
    } else {
      this.modelInput(element, accessor)
    }
  }

  modelSelect(element, accessor) {
    // If element already has a predefined value from html, use that as initial value
    if (element.hasAttribute("value")) {
      this.controller[accessor] = element.value
    }

    this.effect(() => {
      element.value = this.controller[accessor]
    })

    const listener = () => {
      this.controller[accessor] = element.value
    }
    element.addEventListener("change", listener)
    this.cleanup(() => element.removeEventListener("change", listener))
  }

  modelRadio(element, accessor) {
    if (element.hasAttribute("checked")) this.controller[accessor] = element.value

    this.effect(() => {
      element.checked = element.value == this.controller[accessor]
    })

    const listener = () => {
      if (element.checked) this.controller[accessor] = element.value
    }
    element.addEventListener("change", listener)
    this.cleanup(() => element.removeEventListener("change", listener))
  }

  modelCheckbox(element, accessor) {
    if (element.hasAttribute("checked")) this.controller[accessor] = element.checked

    this.effect(() => {
      element.checked = this.controller[accessor]
    })

    const listener = () => {
      this.controller[accessor] = element.checked
    }
    element.addEventListener("change", listener)
    this.cleanup(() => element.removeEventListener("change", listener))
  }

  modelInput(element, accessor) {
    // If element already has a predefined value from html, use that as initial value
    if (element.hasAttribute("value")) {
      this.controller[accessor] = element.value
    }

    this.effect(() => {
      element.value = this.controller[accessor]
    })

    const listener = () => {
      this.controller[accessor] = element.value
    }
    element.addEventListener("input", listener)
    this.cleanup(() => element.removeEventListener("input", listener))
  }
}
import { directive } from "../directive"

export const model = directive("model", (element, context) => {
  if (element.tagName === "SELECT") {
    selectModel(element, context)
  } else if (element.type === "radio") {
    radioModel(element, context)
  } else if (element.type === "checkbox") {
    checkboxModel(element, context)
  } else {
    textModel(element, context)
  }
})

function selectModel(element, { assign, value, effect, cleanup }) {
  // If element already has a predefined selected from html, use that as initial value
  Array.from(element.options).forEach(option => {
    if (option.hasAttribute("selected")) assign(element.value)
  })

  effect(() => {
    element.value = value()
  })

  const listener = () => assign(element.value)
  element.addEventListener("change", listener)
  cleanup(() => element.removeEventListener("change", listener))
}

function radioModel(element, { assign, value, effect, cleanup }) {
  // If element is already checked from html, use that as initial value
  if (element.hasAttribute("checked")) assign(element.value)

  effect(() => {
    element.checked = element.value == value()
  })

  const listener = () => element.checked && assign(element.value)
  element.addEventListener("change", listener)
  cleanup(() => element.removeEventListener("change", listener))
}

function checkboxModel(element, { assign, value, effect, cleanup }) {
  // If element is already checked from html, use that as initial value
  if (element.hasAttribute("checked")) assign(element.checked)

  effect(() => {
    element.checked = value()
  })

  const listener = () => assign(element.checked)
  element.addEventListener("change", listener)
  cleanup(() => element.removeEventListener("change", listener))
}

function textModel(element, { assign, value, effect, cleanup }) {
  // If element already has a predefined value from html, use that as initial value
  if (element.hasAttribute("value")) assign(element.value)

  effect(() => {
    element.value = value()
  })

  const listener = () => assign(element.value)
  element.addEventListener("input", listener)
  cleanup(() => element.removeEventListener("input", listener))
}
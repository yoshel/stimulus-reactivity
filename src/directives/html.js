import { directive } from "../directive"

export const html = directive("html", (element, { effect, value }) => {
  effect(() => {
    element.innerHTML = value()
  })
})
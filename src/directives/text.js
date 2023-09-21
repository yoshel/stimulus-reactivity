import { directive } from "../directive"

export const text = directive("text", (element, { effect, value }) => {
  effect(() => {
    element.textContent = value()
  })
})
import { directive } from "../directive"

export const text = directive("text", (element, { effect, cleanup, value }) => {
  effect(() => {
    element.textContent = value()
  })
})
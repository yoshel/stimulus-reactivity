import { directive } from "../directive"

export const show = directive("show", (element, { effect, value }) => {
  const originalDisplay = element.style.display

  effect(() => {
    element.style.display = value() ? originalDisplay : "none"
  })
})
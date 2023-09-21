import { directive } from "../directive"

export const if_ = directive("if", (element, { effect, cleanup, value }) => {
  effect(() => {
    value() ? show(element) : hide(element)
  })

  cleanup(() => hide(element))
})

function show(template) {
  if (template._sr_undoIf) return // already shown

  const clone = template.content.cloneNode(true).firstElementChild
  template.after(clone)

  template._sr_undoIf = () => clone.remove()
}

function hide(template) {
  if (!template._sr_undoIf) return // already hidden

  template._sr_undoIf()
  delete template._sr_undoIf
}
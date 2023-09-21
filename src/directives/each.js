import { directive } from "../directive"

export const each = directive("each", (element, { effect, cleanup, value }) => {
  effect(() => {
    if (element._sr_undoEach) element._sr_undoEach()

    loop(element, value())
  })

  cleanup(() => element._sr_undoEach && element._sr_undoEach())
})

function loop(template, value) {
  const addedElements = []

  let lastElement = template
  value.forEach((item, index) => {
    const clone = template.content.cloneNode(true).firstElementChild
    clone.$item = item
    clone.$index = index

    lastElement.after(clone)

    addedElements.push(clone)
    lastElement = clone
  })

  template._sr_undoEach = () => addedElements.forEach(element => element.remove())
}
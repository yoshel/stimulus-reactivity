import { BaseDirective } from "./base"

export class EachDirective extends BaseDirective {
  static name = "each"

  act(element) {
    this.effect(() => {
      if (element._undoEach) element._undoEach()

      this.loop(element, this.getValue(element))
    })
    this.cleanup(() => element._undoEach && element._undoEach())
  }

  loop(template, iterable) {
    const addedElements = []

    let index = 0
    let lastElement = template
    for (const item of iterable) {
      const clone = template.content.cloneNode(true).firstElementChild
      clone.$item = item
      clone.$index = index

      this.pauseObserver(() => {
        lastElement.after(clone)
        this.traverseTree(clone)
      })

      addedElements.push(clone)
      lastElement = clone
      index++
    }

    template._undoEach = () => addedElements.forEach(element => element.remove())
  }
}
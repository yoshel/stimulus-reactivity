import { BaseDirective } from "./base"

export class IfDirective extends BaseDirective {
  static name = "if"

  act(element) {
    this.effect(() => {
      this.getValue(element) ? this.show(element) : this.hide(element)
    })
    this.cleanup(() => this.hide(element))
  }

  show(element) {
    if (element._undoIf) return // already shown

    const clone = element.content.cloneNode(true).firstElementChild

    this.observer.pause(() => {
      element.after(clone)
      this.traverseTree(clone)
    })

    element._undoIf = () => clone.remove()
  }

  hide(element) {
    if (!element._undoIf) return // already hidden

    element._undoIf()
    delete element._undoIf
  }
}
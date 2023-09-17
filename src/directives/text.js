import { BaseDirective } from "./base"

export class TextDirective extends BaseDirective {
  static name = "text"

  act(element) {
    this.effect(() => {
      this.pauseObserver(() => {
        element.textContent = this.getValue(element)
      })
    })
  }
}
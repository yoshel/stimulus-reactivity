import { BaseDirective } from "./base"

export class ShowDirective extends BaseDirective {
  static name = "show"

  act(element) {
    const originalDisplay = element.style.display

    this.effect(() => {
      this.pauseObserver(() => {
        element.style.display = this.getValue(element) ? originalDisplay : "none"
      })
    })
  }
}
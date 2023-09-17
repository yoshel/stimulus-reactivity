import { effect, stop } from "@vue/reactivity"
import { BaseDirective } from "./base"
import { tryMethod } from "../utils"

export class HtmlDirective extends BaseDirective {
  static name = "html"

  act(element) {
    this.effect(() => {
      this.pauseObserver(() => {
        element.innerHTML = this.getValue(element)
        this.traverseTree(element, false)
      })
    })
  }
}
import { BaseDirective } from "./base"

export class CloakDirective extends BaseDirective {
  get attributeName() {
    return "data-cloak"
  }

  get selector() {
    return `[data-cloak="${this.controller.identifier}"]`
  }

  act(element) {
    element.removeAttribute("data-cloak")
  }
}
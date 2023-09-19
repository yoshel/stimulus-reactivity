import { directive } from "../directive"

export const cloak = directive(
  "cloak",
  (element) => element.removeAttribute("data-cloak"),
  {
    attributeName: () => "data-cloak",
    selector: (context) => `[data-cloak="${context.controller.identifier}"]`
  }
)
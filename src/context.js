import { effectScope, reactive } from "@vue/reactivity"
import { createObserver } from "./observer"

export function createContext(controller) {
  const state = reactive(controller.constructor.state())
  const scope = effectScope()
  const observer = createObserver()
  const directives = []

  const addDirective = function (directive) {
    return directive(this)
  }

  const setup = element => {
    // Setup children first and wrap with Array.from so that it doesn't include any DOM changes made by directives.
    Array.from(element.children).forEach(child => setup(child, directives))
    directives.forEach(directive => directive.handle(element))
  }

  const teardown = (element) => {
    // Teardown children first and wrap with Array.from so that it doesn't include any DOM changes made by directives.
    Array.from(element.children).forEach(child => teardown(child, directives))
    directives.forEach(directive => directive.cleanup(element))
  }

  observer.onElementAdded(element => {
    setup(element, directives)
  })
  observer.onElementRemoved(element => {
    teardown(element, directives)
  })
  observer.onAttributeRemoved((element, attribute) => {
    directives.find(d => d.handles(attribute))?.cleanup(element)
  })
  observer.onAttributeAdded((element, attribute) => {
    directives.find(d => d.handles(attribute))?.handle(element)
  })

  const start = () => {
    observer.start(controller.element)
    setup(controller.element)
  }

  const stop = () => {
    observer.stop()
    scope.stop()
  }

  return { state, scope, observer, addDirective, start, stop }
}
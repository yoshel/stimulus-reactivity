import { effectScope, onScopeDispose, effect } from "@vue/reactivity"
import { tryMethod } from "../utils"

export class BaseDirective {
  static name // override this

  constructor(controller, observer) {
    this.controller = controller
    this.observer = observer
    this.scopesByElement = new WeakMap()
  }

  get attributeName() {
    return `data-${this.controller.identifier}-${this.constructor.name}`
  }

  get selector() {
    return `[${this.attributeName}]`
  }

  matchElement(element) {
    return element.matches(this.selector)
  }

  matchElementsInTree(tree) {
    return tree.querySelectorAll(this.selector)
  }

  elementAdded(element) {
    // HACK: cleanup previous effects first
    this.elementRemoved(element)

    const scope = effectScope()
    scope.run(() => this.act(element))
    this.scopesByElement.set(element, scope)
  }

  elementRemoved(element) {
    const scope = this.scopesByElement.get(element)
    if (scope) scope.stop()
  }


  act(element) {
    // Override this
  }

  // Below are helper methods to be used inside act
  getAttribute(element) {
    return element.getAttribute(this.attributeName)
  }

  getValue(element) {
    return tryMethod(this.controller, this.getAttribute(element), element)
  }

  pauseObserver(callback) {
    this.observer.pause(callback)
  }

  traverseTree(element, includeRoot = true) {
    this.observer.traverseTree(element, includeRoot)
  }

  effect(callback) {
    effect(callback)
  }

  cleanup(callback) {
    onScopeDispose(callback)
  }
}
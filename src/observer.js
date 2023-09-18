export class Observer {
  constructor(controller) {
    this.controller = controller
    this.observer = new MutationObserver(mutations => this.processMutations(mutations))
    this.observerOptions = { subtree: true, childList: true, attributes: true, attributeOldValue: true }
    this.directives = []
  }

  addDirective(Directive) {
    this.directives.push(new Directive(this.controller, this))
  }

  start() {
    this.observe()
    this.traverseTree(this.controller.element)
  }

  stop() {
    if (!this.started) return

    this.observer.disconnect()
    this.started = false
  }

  observe() {
    if (this.started) return

    this.observer.observe(this.controller.element, this.observerOptions)
    this.started = true
  }

  pause(callback) {
    this.stop()
    callback()
    this.observe()
  }

  processMutations(mutations) {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        this.processAttributeChanged(mutation)
      } else if (mutation.type === "childList") {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) this.processAddedElement(node)
        })

        mutation.removedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) this.processRemovedElement(node)
        })
      }
    }
  }

  traverseTree(tree, includeRoot = true) {
    this.directives.forEach(directive => {
      if (includeRoot && directive.matchElement(tree)) directive.elementAdded(tree)
      directive.matchElementsInTree(tree).forEach(element => directive.elementAdded(element))
    })
  }

  processAttributeChanged(mutation) {
    const { target, attributeName, oldValue } = mutation

    const attributeExists = target.hasAttribute(attributeName)
    const hasOldValue = oldValue != null

    if (attributeExists && !hasOldValue) {
      this.processAddedElement(target)
    } else if (hasOldValue && !attributeExists) {
      this.processRemovedElement(target)
    } else {
      this.processElementAttributeChanged(target, attributeName)
    }
  }

  processAddedElement(element) {
    this.directives.forEach(directive => directive.matchElement(element) && directive.elementAdded(element))
  }

  processRemovedElement(element) {
    this.directives.forEach(directive => directive.matchElement(element) && directive.elementRemoved(element))
  }

  processElementAttributeChanged(element, attribute) {
    this.directives.forEach(directive => {
      if (!directive.matchElement(element) || attribute !== directive.attributeName) return

      // HACK: treat attribute changed as the element being removed and re-added
      directive.elementRemoved(element)
      directibe.elementAdded(element)
    })
  }
}
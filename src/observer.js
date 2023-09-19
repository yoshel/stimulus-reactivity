export function createObserver() {
  const onElementAddeds = []
  const onElementRemoveds = []
  const onAttributeAddeds = []
  const onAttributeRemoveds = []

  const observer = new MutationObserver(mutations => {
    const addedElements = []
    const removedElements = []

    const addedAttributes = []
    const removedAttributes = []

    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(node => node.nodeType === Node.ELEMENT_NODE && addedElements.push(node))
        mutation.removedNodes.forEach(node => node.nodeType === Node.ELEMENT_NODE && removedElements.push(node))
      }
      if (mutation.type === "attributes") {
        const { target, attributeName, oldValue } = mutation
        const attributeExists = target.hasAttribute(attributeName)

        if (target.hasAttribute(attributeName) && oldValue == null) {
          addedAttributes.push([target, attributeName])
        } else if (target.hasAttribute(attributeName)) {
          removedAttributes.push([target, attributeName])
          addedAttributes.push([target, attributeName])
        } else {
          removedAttributes.push([target, attributeName])
        }
      }
    }

    removedAttributes.forEach(([element, attribute]) => {
      onAttributeRemoveds.forEach(callback => callback(element, attribute))
    })

    addedAttributes.forEach(([element, attribute]) => {
      onAttributeAddeds.forEach(callback => callback(element, attribute))
    })

    removedElements.forEach(element => {
      onElementRemoveds.forEach(callback => callback(element))
    })

    addedElements.forEach(element => {
      onElementAddeds.forEach(callback => callback(element))
    })
  })

  let observedElement
  let started = false
  const start = element => {
    if (started) return

    observer.observe(element, { subtree: true, childList: true, attributes: true, attributeOldValue: true })
    observedElement = element
    started = true
  }
  const stop = () => {
    if (!started) return

    observer.disconnect()
    started = false
  }

  const onElementAdded = (callback) => onElementAddeds.push(callback)
  const onElementRemoved = (callback) => onElementRemoveds.push(callback)
  const onAttributeAdded = (callback) => onAttributeAddeds.push(callback)
  const onAttributeRemoved = (callback) => onAttributeRemoveds.push(callback)

  return { start, stop, onElementAdded, onElementRemoved, onAttributeAdded, onAttributeRemoved }
}
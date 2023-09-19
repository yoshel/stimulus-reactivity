import { effect as _effect, effectScope, onScopeDispose } from "@vue/reactivity"

export function directive(name, callback, options = {}) {
  return (context) => {
    const { controller, parentScope } = context

    const scopesByElement = new WeakMap()
    const attributeName = options.attributeName ? options.attributeName(context) : `data-${controller.identifier}-${name}`
    const selector = options.selector ? options.selector(context) : `[${attributeName}]`

    const handles = (attribute) => attribute === attributeName

    const match = (element) => element.matches(selector)

    const handle = (element) => {
      if (!match(element)) return

      const scope = parentScope.run(() => effectScope())
      scopesByElement.set(element, scope)
      const effect = (callback) => scope.run(() => _effect(callback))
      const cleanup = (callback) => scope.run(() => onScopeDispose(callback))
      const attribute = () => element.getAttribute(attributeName)
      const value = (method = attribute()) => {
        const property = controller[method]
        return typeof property === "function" ? property.bind(controller)(element) : property
      }
      const assign = (value) => {
        controller[attribute()] = value
      }

      return callback(element, { effect, cleanup, attribute, value, assign })
    }

    const cleanup = (element) => {
      if (!scopesByElement.has(element)) return
      scopesByElement.get(element).stop()
    }

    return {
      name, handles, match, handle, cleanup
    }
  }
}
import { effect as _effect, effectScope, onScopeDispose } from "@vue/reactivity"

export function directive(name, callback, options = {}) {
  return (context) => {
    const { controller, scope: parentScope } = context

    const attributeName = options.attributeName ? options.attributeName(context) : `data-${controller.identifier}-${name}`
    const selector = options.selector ? options.selector(context) : `[${attributeName}]`

    const handles = (attribute) => attribute === attributeName

    const match = (element) => element.matches(selector)

    const handle = (element) => {
      if (!match(element)) return

      const scope = createDirectiveScope(element, name, parentScope)

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

    const cleanup = (element) => stopDirectiveScope(element, name)

    return {
      name, handles, match, handle, cleanup
    }
  }
}

function createDirectiveScope(element, directiveName, parentScope) {
  if (!element._sr_scopes) element.sr_scopes = {}
  element._sr_scopes[directiveName] = parentScope.run(() => effectScope())
  return element._sr_scopes[directiveName]
}

function stopDirectiveScope(element, directiveName) {
  if (!element._sr_scopes) return

  element._sr_scopes[directiveName]?.stop()
  delete element._sr_scopes[directiveName]

  if (Object.keys(element._sr_scopes).length === 0) delete element._sr_scopes
}
export function tryMethod(controller, method, ...args) {
  if (!(method in controller)) {
    throw new Error(`${controller.identifier} controller has no defined method or getter: "${method}"`)
  }

  const property = controller[method]
  return typeof property === "function" ? property.bind(controller)(...args) : property
}
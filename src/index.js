import { effectScope, effect, reactive, pauseTracking, enableTracking } from "@vue/reactivity"
import { createObserver } from "./observer"
import { bind } from "./directives/bind"
import { cloak } from "./directives/cloak"
import { each } from "./directives/each"
import { html } from "./directives/html"
import { if_ } from "./directives/if"
import { model } from "./directives/model"
import { show } from "./directives/show"
import { text } from "./directives/text"

export default function useReactivity(controller) {
  const state = reactive(controller.constructor.state())
  const parentScope = effectScope()
  const observer = createObserver()
  const context = { controller, observer, parentScope }

  const directives = [
    cloak(context),
    if_(context),
    each(context),
    model(context),
    bind(context),
    show(context),
    text(context),
    html(context)
  ]
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

  const watchEffect = callback => parentScope.run(() => effect(callback))
  const watch = (method, callback, immediate = false) => {
    let firstTime = true
    let previousValue
    watchEffect(() => {
      const value = controller[method]

      if (!firstTime || immediate) {
        pauseTracking()
        callback(value, previousValue)
        enableTracking()
      }

      previousValue = value
      firstTime = false
    })
  }

  const start = () => {
    observer.start(controller.element)
    setup(controller.element, directives)
  }

  const stop = () => {
    observer.stop()
    parentScope.stop()
  }

  const controllerDisconnect = controller.disconnect.bind(controller)
  const disconnect = () => {
    stop()
    controllerDisconnect()
  }

  Object.assign(controller, { state, watchEffect, watch, disconnect })
  defineStateAccessors(controller, state)

  start()
}

function setup(element, directives) {
  directives.forEach(directive => directive.handle(element))

  for (const child of element.children) {
    setup(child, directives)
  }
}

function teardown(element, directives) {
  directives.forEach(directive => directive.cleanup(element))

  for (const child of element.children) {
    teardown(child, directives)
  }
}

function defineStateAccessors(controller, state) {
  Object.keys(state).forEach(key => {
    Object.defineProperty(controller, key, {
      get() {
        return state[key]
      },
      set(value) {
        state[key] = value
      }
    })
  })
}
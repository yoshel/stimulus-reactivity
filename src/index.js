import { effect, enableTracking, pauseTracking } from "@vue/reactivity"
import { createContext } from "./context"
import { bind } from "./directives/bind"
import { cloak } from "./directives/cloak"
import { each } from "./directives/each"
import { html } from "./directives/html"
import { if_ } from "./directives/if"
import { model } from "./directives/model"
import { show } from "./directives/show"
import { text } from "./directives/text"

export default function useReactivity(controller) {
  const context = createContext(controller)

  context.addDirective(cloak)
  context.addDirective(if_)
  context.addDirective(each)
  context.addDirective(model)
  context.addDirective(bind)
  context.addDirective(show)
  context.addDirective(text)
  context.addDirective(html)

  const watchEffect = callback => context.scope.run(() => effect(callback))
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

  const controllerDisconnect = controller.disconnect.bind(controller)
  const disconnect = () => {
    context.stop()
    controllerDisconnect()
  }

  Object.assign(controller, { state, watchEffect, watch, disconnect })
  defineStateAccessors(controller, state)

  context.start()
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
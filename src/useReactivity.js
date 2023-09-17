import { reactive, effect, effectScope } from "@vue/reactivity"
import cloneDeep from "lodash.clonedeep"
import { tryMethod } from "./utils"
import { Observer } from "./observer"
import { BindDirective } from "./directives/bind"
import { ModelDirective } from "./directives/model"
import { TextDirective } from "./directives/text"
import { HtmlDirective } from "./directives/html"
import { CloakDirective } from "./directives/cloak"
import { IfDirective } from "./directives/if"
import { ShowDirective } from "./directives/show"
import { EachDirective } from "./directives/each"

class UseReactivity {
  constructor(controller) {
    this.controller = controller
    // Deeply clone static state so that every controller instance has a different proxy from the same static state
    this.state = reactive(cloneDeep(controller.constructor.state))
    this.effectScope = effectScope()
    this.observer = new Observer(controller)
    this.observer.addDirective(BindDirective)
    this.observer.addDirective(ModelDirective)
    this.observer.addDirective(TextDirective)
    this.observer.addDirective(HtmlDirective)
    this.observer.addDirective(ShowDirective)
    this.observer.addDirective(IfDirective)
    this.observer.addDirective(EachDirective)
    this.observer.addDirective(CloakDirective)

    this.enhanceController()
    this.start()
  }

  start() {
    this.effectScope.run(() => {
      this.observer.start()
    })
  }

  stop() {
    this.observer.stop()
    this.effectScope.stop()
  }

  enhanceController() {
    const controllerDisconnect = this.controller.disconnect.bind(this.controller)
    const disconnect = () => {
      this.stop()
      controllerDisconnect()
    }

    Object.assign(this.controller, {
      state: this.state,
      watchEffect: this.watchEffect.bind(this),
      watch: this.watch.bind(this),
      disconnect
    })
    this.assignStateAccessors()
  }

  assignStateAccessors() {
    Object.keys(this.controller.constructor.state).forEach(key => {
      Object.defineProperty(this.controller, key, {
        get() {
          return this.state[key]
        },
        set(value) {
          this.state[key] = value
        }
      })
    })
  }

  watchEffect(callback) {
    return this.effectScope.run(() => {
      return effect(callback)
    })
  }

  watch(method, callback) {
    let oldValue = tryMethod(this.controller, method)

    return this.watchEffect(() => {
      // This will also track the accessed state as a side effect
      const value = tryMethod(this.controller, method)

      // Use queueMicrotask so that any access of state inside callback won't be tracked
      queueMicrotask(() => {
        callback(value, oldValue)

        oldValue = value
      })
    })
  }
}

export function useReactivity(controller) {
  new UseReactivity(controller)
}
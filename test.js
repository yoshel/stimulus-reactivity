import { Application, Controller } from "@hotwired/stimulus"
import useReactivity from "./src"

window.Stimulus = Application.start()

class ReactiveController extends Controller {
  static state = () => ({
    name: "Marble",
    address: "",
    payment: "",
    fastDelivery: false,
    availment: false,
    coupon: "",
    pineapple: false,
    crust: "",
    size: "",
    open: false,
    toppings: ["pepperoni", "onions", "mushrooms", "pineapple"]
  })

  connect() {
    useReactivity(this)

    setTimeout(() => {
      this.name = "Garbage"
    }, 1000)
  }

  setName(event) {
    this.name = event.target.value
  }

  greeting() {
    return `Hello ${this.name || "_____"}`
  }

  toggleFastDelivery() {
    this.fastDelivery = !this.fastDelivery
  }

  buttonClass() {
    return this.fastDelivery ? "orange" : ""
  }

  addressPlaceholder() {
    return `Where do you live, ${this.name}?`
  }

  setAddress(event) {
    this.address = event.target.value
  }

  checkBox(event) {
    this.boxChecked = true
  }

  setPaymentCard() {
    this.payment = "credit_card"
  }

  toggleAvailmentLabel() {
    return this.availment ? "Don't avail me" : "Avail me"
  }

  toggleAvailment() {
    this.availment = !this.availment
  }

  removeCoupon() {
    this.coupon = ""
  }

  setSizeSmall() {
    this.size = "8\""
  }

  description() {
    return `
      <p>Hello, <em>${this.name}</em>!</p>
    `
  }

  toggleOpen() {
    this.open = !this.open
  }

  topping(element) {
    return element.$item
  }
}

Stimulus.register("reactive", ReactiveController)
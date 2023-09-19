# stimulus-reactivity
Reactivity mixin for Stimulus. Heavily inspired by Vue.js and Alpine.js and uses @vue/reactivity.

## Quick Example
```js
import { Controller } from "@hotwired/stimulus"
import useReactivity from "stimulus-reactivity"

// connects to data-controller="reactive"
export default class extends Controller {
  static state = () => ({
    name: ""
  })

  connect() {
    // Will also create getters and setters for all keys in static state
    useReactivity(this)

    this.watchEffect(() => {
      // Will run immediately and everytime `this.name` is updated
      console.log(this.greet())
    }) 
  }

  greeting() {
    return `Hello, ${this.name}`
  }
}
```
```html
<div data-controller="reactive">
  <!-- two-way bind this input to `message` state -->
  <input data-reactive-model="message">
  <!-- The value of `greeting()` will become the textContent of <p>  -->
  <p data-reactive-text="greeting"></p>
</div>
```

## Using

Import:
```
import useReactivity from "stimulus-reactivity"
```

Define reactive values in state:
```
export default class extends Controller {
  static state = () => ({
    name: "",
    ingredients: new Map(),
    instructions: []
  })
}
```

Call inside `connect` or `initialize`:
```
export default class extends Controller {
   // state ...

  initialize() {
    useReactivity(this)
  }
  // or
  connect() {
    useReactivity(this)
  }
}
```

Define methods that will be used in html:
```
export default class extends Controller {
  // state ...
  // initialization ...

  addIngredient() {
    this.ingredients.push(new Ingredient())
  }
}
```

The methods can accept the element that calls it as the first parameter.
```
  addIngredient(element) {
    if (element.disabled) {}
  }
```

Properties in state already has getters and setters so no need to define methods for them.
```
static state = () => ({
  name: "",
  ingredients: new Map(),
  instructions: []
})

connect() {
  useReactivity(this)

  console.log(this.name)
  console.log(this.ingredients)
  console.log(this.instructions)

  this.name = "A new name"
}
```


Use directives in html:
```html
<div data-controller="reactive">
  <input data-reactive-model="message">
  <p data-reactive-text="greeting"></p>
</div>
```

The data attribute of the directives references the method name in the controller. `data-reactive-text="greeting"` will call `greeting()` method in the controller and
use the returned value as the text content of the element. Expressions are not allowed and not evaluated.

Almost all of the data attributes are scoped by the controller identifier.

## Directives

### text
```
data-<identifier>-text
```
Updates the element's `textContent`.
Example:
```html
<div data-controller="reactive">
  <p>
    Hello <span data-reactive-text="name"></span>
  </p>
</div>
```

### html
```
data-<identifier>-html
```
Updates the element's `innerHTML`.
Example:
```html
<div data-controller="reactive">
  <p data-reactive-html="description"></p>
</div>
```

### show
```
data-<identifier>-show
```
Toggle the element's visibility based on the value.
Example:
```html
<div data-controller="reactive">
  <p data-reactive-show="allowed">
    My Contents
  </p>
</div>
```

### if
```
data-<identifier>-if
```
Render the content of a template based on the value. Works only on `<template>` tags and the template should only have one child element.
Example:
```html
<div data-controller="reactive">
  <template data-reactive-if="allowed">
    <p>My Contents</p>
  </template>
</div>
```

### each
```
data-<identifier>-each
```
Renders the content of a template multiple times based on the value. Works only on `<template>` tags and the template should only have one child element.
Access the item and index in each element by using `element.$item` and `element.$index`.

Example:
```html
<div data-controller="reactive">
  <ul>
    <template data-reactive-each="drinks">
      <li data-reactive-bind="class:drinkClass"></li>
    </template>
  </ul>
</div>
```

### bind
```
data-<identifier>-bind
```
Updates the value of an attribute or property of an element. Allows multiple bindings by separating them with spaces.
The syntax for the data attribute value is `<attribute>:<method>`.

Example:
```html
<div data-controller="reactive">
  <input type="checkbox" data-reactive-bind="checked:termsAccepted">
  <input type="text" data-reactive-bind="value:name placeholder:namePlaceholder class:nameClass">
</div>
```

### model
```
data-<identifier>-model
```
Creates a two-way binding on an form input, select, or textarea element.

Example:
```html
<div data-controller="reactive">
  <input type="text" data-reactive-model="name">
</div>
```

### cloak
```
data-cloak="<identifier>"
```
Hides the element until the controller is ready.

Add this selector to the css:
```css
[data-cloak] {
  display: none;
}
```

Example:
```html
<div data-controller="reactive">
  <p data-cloak="reactive">Hello</p>
</div>
```

## Additional Controller Methods

### watchEffect
Runs immediately and reruns everytime any state used inside it is changed.

Example:
```js
connect() {
  this.watchEffect(() => {
    console.log(`I have accessed ${this.name}`)
  })
}
```

### watch
Runs everytime the declared state is changed. Old value is accessible inside. There's an optional third argument
that accepts a boolean to run the callback immediately at first time.
Example:
```js
connect() {
  this.watch("amount", (value, oldValue) => {
    console.log(`Will only run when this.amount changes. Not even if I access ${this.name} here.`)

    const isLarger = value > oldValue
  })
  
  // Immediate, will run immediately
  this.watch("amount", () => console.log(this.name), true)
}
```


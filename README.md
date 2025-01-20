# A bad remake

Needed a JavaScript UI, couldn't find one. Either those don't exist or I can't google.
Decided to make this instead... 

Classic mistake of: "This won't take long..."

But ooh it did.

## Does it work?
Short answer, yes? It's really simple to use, literally a few lines to get it to show, but the spaghetti code is bound to break.

# Quick setup
Git clone the repo

```js
import { ImGui } from "./imgui.js"

const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");

let imgui = new ImGui(200, 250, 400, 100);
let checkbox = imgui.checkbox("Test", true);
let slider = imgui.slider(0, 100);
let btn = imgui.button("An example of a long text in a button", true);

imgui.init();

function animate() {
  ctx.clearRect(0, 0, c.width, c.height);

  imgui.draw();

  if (btn.state) {
    console.log("clicked")
    console.log(slider.state)
    console.log(checkbox.toggle)
  }
}

setInterval(animate, 10);
```

## Current options 
### (option = default)
* *ImGui*: (x = 150, y = 200, width = 400, height = 500)
* *Sliders*: (min = 0, max = 100, width = 2*this.width/3, init = min)
* *Button*: (text = "Placeholder")
* *Checkboxes*: (text = "Placeholder", toggle = false)

To access the *states* of the elements, just do element.*state*.

# TO DO
* ~~Sliders~~
* ~~Buttons~~
* ~~Checkboxes~~
* <u>Text</u> 
* * ~~Static Text~~
* * Dynamic Text <= Right now
* Sub-Sections
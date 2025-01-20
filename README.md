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

let imgui = new ImGui(200, 250, 400, 100, c);
let checkbox = imgui.checkbox("Test", true);
let slider = imgui.slider(0, 100);
let btn = imgui.button("An example of a long text in a button", true);
// Text could be a single line...
imgui.staticText("A single line.");
// Or multiple lines...
imgui.staticText("Multiple\nlines.");
// Or a different color...
imgui.staticText("A different color.", "red");
// You could change text via a click...
let changing_text = imgui.staticText("Change me!", "blue");


imgui.init();

function animate() {
  ctx.clearRect(0, 0, c.width, c.height);

  imgui.draw();

  if (btn.state) {
    console.log("clicked")
    console.log(slider.state)
    console.log(checkbox.toggle)
    changing_text.text = "Changed!"
    changing_text.color = "green"
  }
}

setInterval(animate, 10);
```

## Current options 
### (option = default)
* *ImGui*: (x = 150, y = 200, width = 400, height = 500, canvas = *REQUIRED*)
* * Canvas is required as a parameter for the ImGui constructor for it to be drawn on.
* *Sliders*: (min = 0, max = 100, width = this.width * 2/3, init = min)
* *Button*: (text = "Placeholder")
* *Checkboxes*: (text = "Placeholder", toggle = false)
* *Static Text*: (text = "Placeholder", color = "white")

To access the *states* or toggles of the elements, just do element.*state*.

# TO DO
* ~~Sliders~~
* ~~Buttons~~
* ~~Checkboxes~~
* Text
* * ~~Static Text~~
* * Dynamic Text
* Adjustable Window Size <= Right now
* Sub-Sections
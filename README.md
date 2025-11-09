# A bad remake

Needed a JavaScript UI, couldn't find one. Either those don't exist or I can't google.
Decided to make this instead... 

Classic mistake of: "This won't take long..."

## Does it work?
Short answer, yes? It's really simple to use, literally a few lines to get it to show, but the spaghetti code is bound to break.

# Quick setup
In the head of your HTML file, add this:
```html
<script src="https://cdn.jsdelivr.net/gh/TheUntitledGoose/imgui-js@main/imgui.js"></script>
```
ImGui will be available in the window object: `window.ImGui`, or you can just do `ImGui`.

## Example usage

```js
const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");

// Init ImGui. Canvas argument (c) is required.
let imgui = new ImGui(200, 250, 400, 100, c);

// Add some elements...
let checkbox = imgui.checkbox("Test", true);
let slider = imgui.slider(0, 100);
let button = imgui.button("An example of a long text in a button", true);
// You could change text via a click...
let changing_text = imgui.staticText("Change me! Click the button!", "yellow");
button.onClick(() => {
  console.log(`Clicked button` +
            `\nSlider 1 state: ${slider.state}` +
            `\nSlider with text state: ${slider_with_text.state}` +
            `\nCheckbox state: ${checkbox.state}`)

  changing_text.text = "Changed!"
  changing_text.color = "green"
})

// Text could be a single line...
imgui.staticText("A single line.");
// Or multiple lines...
imgui.staticText("Multiple\nlines.");
// Or a different color...
imgui.staticText("A different color.", "red");

// Initialize the UI. This sets the height of the UI to fit all elements.
imgui.init();

function animate() {
  ctx.clearRect(0, 0, c.width, c.height);

  imgui.draw();

  requestAnimationFrame(animate)
}

requestAnimationFrame(animate)
```

## Current options 
### (option = default)
* *ImGui*: (x = 150, y = 200, width = 400, height = 500, canvas = *REQUIRED*)
* * Canvas is required as a parameter for the ImGui constructor for it to be drawn on.
* *Sliders*: (min = 0, max = 100, width = this.width, init = min, options = {text: string, float: bool, font: string})
* * Sliders.options.text: (string) - Adds text to the slider.
* * Sliders.options.float: (bool) - Changes the slider to float.
* * Sliders.options.font: (string) - Changes the canvas context font.
* *Button*: (text = "Placeholder")
* * Button.color: (string) - Changes the color of the button.
* * Button.onClick: (function) - Adds a callback
* *Checkboxes*: (text = "Placeholder", toggle = false, color = "white")
* * Checkboxes.text: (string) - Adds text to the checkbox.
* * Checkboxes.toggle: (bool) - Changes the toggle state.
* * Checkboxes.color: (string) - Changes the color of the checkbox.
* * Checkboxes.state: (bool) - Returns the toggle state.
* *Static Text*: (text = "Placeholder", color = "white", center = false)
* * Static Text.text: (string) - Changes the text.
* * Static Text.color: (string) - Changes the color.
* * Static Text.center: (bool) - Centers the text based on the width.


To access the *states* or toggles of the elements, just do element.*state*.

The only exception to this is the *Button* element, which has a callback *onClick* that is triggered when the button is clicked.

# TO DO
* ~~Sliders~~
* ~~Buttons~~
* ~~Checkboxes~~
* Text
* * ~~Static Text~~
* * Dynamic Text
* Adjustable Window Size
* Sub-Sections
* Switch "options" to the `.options` like Slider.
* Scrollbar for long elements
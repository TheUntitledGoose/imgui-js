export { ImGui }

// const c = document.getElementById("myCanvas");
// const ctx = c.getContext("2d");
let c;
let ctx;

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

//---CONSTANTS---//
const TAB_COLOR_SEL = "#29477d";
// const TAB_COLOR_SEL = "#0d0d0d";
// const TAB_COLOR_SEL = "#242424";
const TAB_COLOR_UNSEL = "#302f30";
// const BACKGROUND = "#0e0e0e";
const BACKGROUND = "#151617";
const INTERACTABLE_BACKGROUND = "#141618";
const INTERACTABLE_SELECT = "#4295f9";
const INTERACTABLE_SELECT_MORE = "#336cae";
const BUTTON_BACKGROUND = "#254370";

const TAB_HEIGHT = 20;
const GAP = 10;
export const BUTTON_SIZE = 20;

const TRIG_OFFSET = 5;

//---------//
let curX = 0;
let curY = 0;

// c.height = windowHeight;
// c.width = windowWidth;

function rect(x, y, w, h, c) {
	ctx.beginPath();
	ctx.fillStyle = c;
	ctx.rect(x, y, w, h);
	ctx.fill();
}

function round_rect(x, y, w, h, c, r) {
	ctx.beginPath();
	ctx.fillStyle = c;
	ctx.roundRect(x, y, w, h, r);
	ctx.fill();
}

function clip_rect(x, y, w, h) {
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.clip();
}

function circ(x, y, r, c) {
	var f = ctx.fillStyle;
	ctx.beginPath();
	ctx.fillStyle = c;
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fill();
	ctx.fillStyle = f;
}

const between = (x, min, max) => {
	return x >= min && x <= max;
};

class ImGui {
	constructor(x = 150, y = 200, width = 400, height = 500, canvas) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.init_height = height;
		this.height = height;
		this.title = "ImGui JS"

		this.moving = false;
		this.hidden = false;
		this.selected = true;

		this.elements = [];

		// ctx_ passed context
		this.c = canvas;
		c = canvas;
		// c.height = windowHeight;
		// c.width = windowWidth;

		this.ctx = this.c.getContext('2d');
		ctx = this.ctx;

		this.c.addEventListener("mousedown", (e) => {
			if ((e.buttons == 1 || e.buttons == 2) && !this.hidden) this.checkClick(e.x, e.y, e);
			if (e.buttons == 1) {		
				if ( this.checkHide(e.x, e.y) ) {
					this.hidden = !this.hidden;
				}
			}
		
			if (this.checkMove(e.x, e.y)) {
				this.moving = true;

				this.offsetX = this.x - e.x;
				this.offsetY = this.y - e.y;
			} else {
				this.moving = false;
			}
		});
		
		this.c.addEventListener("mousemove", (e) => {
			// get offset of cursor from origin
			// instead of movementX/Y use offset from mouse
			// offset = origin - mouse
			// draw from mouse position using offset

			curX = e.x;
			curY = e.y;
			if (e.buttons == 1 && this.moving) {
				// this.update(this.x + e.movementX, this.y + e.movementY);
				this.update(e.x + this.offsetX, e.y + this.offsetY);
			} else if (e.buttons == 1) {
				this.checkClick(e.x, e.y, e);
			}
		});

		this.c.addEventListener("mouseup", (e) => {
			this.checkClick(e.x, e.y, e);
		});

	}

	static Flags = {
		"Float" : true,
	}

	static text(text, x, y, color = "white") {
		const f = ctx.fillStyle;
    ctx.fillStyle = color;
    ctx.font = "14px sans-serif";
    ctx.fillText(text, x, y);
		ctx.fillStyle = f;
  }

	checkMove(x, y) {
		var minX = this.x + TRIG_OFFSET * 5;
		var minY = this.y + 4;
		var maxX = this.x + 10 + this.width;
		var maxY = this.y + TAB_HEIGHT * 1.5;

		if (between(x, minX, maxX) && between(y, minY, maxY)) {
			this.selected = true
		} else this.selected = false
		if (between(x, minX, maxX) && between(y, minY, maxY)) return true;
		return false;
	}

	checkHide(x, y) {
		if (
			between(x, this.x, this.x + TRIG_OFFSET + 15) &&
			between(y, this.y, this.y + TRIG_OFFSET + 15)
		) {
			return true;
		} else {
			return false;
		}
	}

	checkClick(x, y, e) {
		for (var i = 0; i < this.elements.length; i++) {
			this.elements[i].check(x, y, e);
		}
	}

	checkHover(x, y) {
		var minX = this.x;
		var minY = this.y;
		var maxX = this.x + this.width;
		var maxY = this.y + this.height;

		if (between(x, minX, maxX) && between(y, minY, maxY)) return true;
		return false;
	}

	checkBounding(x, y) {
		var minX = this.x;
		var minY = this.y;
		var maxX = this.x + this.width;
		var maxY = this.y + (this.hidden ? TAB_HEIGHT : this.height);

		if (between(x, minX, maxX) && between(y, minY, maxY)) return true;
		return false;
	}

	/**
	* Adds a checkbox to the ImGui window.
	*
	* @param {string} text - The label of the checkbox.
	* @param {boolean} [toggle=false] - The initial state of the checkbox (checked or unchecked).
	* @param {string} [color="white"] - The color of text of the checkbox.
	* @returns {Checkbox} - The `Checkbox` object.
	*/
	checkbox(text = "Placeholder", toggle = false, color = "white") {
		var checkbox = new Checkbox(text, toggle, color);
		this.elements.push(checkbox);
		return checkbox;
	}
	
	/**
	 * Adds a button to the ImGui interface.
	 *
	 * @param {string} [text="Placeholder"] - The text displayed on the button.
	 * @returns {Button} - A `Button` object.
	 * @returns {Slider} The created slider element with a method:
 	 *   `.onClick(callback: function)` to register a click handler.
	 */
	button(text = "Placeholder") {
		var button = new Button(text);
		this.elements.push(button);
		return button;
	}

	/**
	 * Adds a static text element to the ImGui instance.
	 *
	 * @param {string} text - The text to display.
	 * @param {string} [color="white"] - The color of the text.
	 * @param {boolean} [center=false] - Whether to center the text within the ImGui window.
	 * @returns {StaticText} The `StaticText` element.
	 */
	staticText(text = "Placeholder", color = "white", center = false) {
		var staticText = new StaticText(text, color, center);
		this.elements.push(staticText);
		return staticText;
	}

	/**
	 * Creates a slider element.
	 *
	 * @param {number} [min=0] - The minimum value of the slider. Defaults to 0.
	 * @param {number} [max=100] - The maximum value of the slider. Defaults to 100.
	 * @param {number} [width=this.width] - The width of the slider. Defaults to the instance's width.
	 * @param {number} [init=min] - The initial value of the slider. Defaults to the `min` value.
	 * @param {Object} [options] - Additional configuration options for the slider (e.g., `{ float: true }` for floating-point values).
	 * @returns {Slider} The `Slider` element.
	 */
	slider(min = 0, max = 100, width = this.width, init = min, options) {
		var slider = new Slider(min, max, width, init, {...options})
		this.elements.push(slider);
		return slider;
  }

	number(min = 0, max = 100, init=min) {}

	update(x, y) {
		this.x = x;
		this.y = y;
	}

	init() {
		this.height = Math.max(this.init_height, TAB_HEIGHT + GAP + (this.elements.length * (BUTTON_SIZE + GAP)));
		// check all text elements for multi-line text and adjust height accordingly.
		for (var i = 0; i < this.elements.length; i++) {
			if (this.elements[i].text && this.elements[i].text.includes("\n")) {
				let lines = this.elements[i].text.split("\n");
				// Font size dependant
				this.height += (lines.length - 1) * 14;
			}
		}


		// loop through all elements and get the longest text to decide width of overall gui.
		let longest_text = ""
		let farthest_text = GAP
		let longest_width = GAP
		for (var i = 0; i < this.elements.length; i++) {
			// loop through buttons (Do: text areas in the future) TODO: CHECKBOXES
			if (this.elements[i].text && this.elements[i].text.length >= longest_text.length) {
				longest_text = this.elements[i].text;
				farthest_text = this.elements[i].text_x > farthest_text ? this.elements[i].text_x : farthest_text;
			}
			// loop through all sliders
			if (this.elements[i].width >= this.width || this.elements[i].width > longest_width) {
				longest_width = this.elements[i].width
			}
		}
		const longest_text_width = ctx.measureText(longest_text).width
		
		// console.log(farthest_text, longest_text_width)

		// console.log(longest_text, longest_text_width+farthest_text)
		if (
			(longest_text != "" 
			&& (longest_text_width >= this.width 
			|| longest_text_width+farthest_text >= longest_width))
		) {
			// this.width = longest_text_width + GAP*2 + farthest_text + longest_width;
		}
		else if (longest_width > this.width){
			// this.width = longest_text_width + GAP*2
		}
	}

	closeTrig() {
		ctx.beginPath();
		const cornerX = this.x + TRIG_OFFSET;
		const cornerY = this.y + TRIG_OFFSET;
		ctx.moveTo(cornerX, cornerY);
		ctx.lineTo(cornerX + 5, cornerY + 9);
		ctx.lineTo(cornerX + 10, cornerY);
		ctx.fillStyle = "white";
		ctx.fill();
	}

	openTrig() {
		ctx.beginPath();
		const cornerX = this.x + TRIG_OFFSET * 1.25;
		const cornerY = this.y + 4;
		ctx.moveTo(cornerX, cornerY);
		ctx.lineTo(cornerX + 9, cornerY + 5);
		ctx.lineTo(cornerX, 		cornerY + 10);
		ctx.fillStyle = "white";
		ctx.fill();
	}

	draw() {

		var color = this.selected ? TAB_COLOR_SEL : TAB_COLOR_UNSEL

		if (!this.hidden) {
			// rect(this.x, this.y, this.width, TAB_HEIGHT, color);
			ctx.save();
			clip_rect(this.x, this.y, this.width, this.height+TAB_HEIGHT)

			round_rect(this.x, this.y, this.width, TAB_HEIGHT, color, [5,5,0,0]);
		
			this.closeTrig();
			
			round_rect(this.x, this.y + TAB_HEIGHT, this.width, this.height-TAB_HEIGHT, BACKGROUND, [0,0,5,5]);
			

			for (var i = 0; i < this.elements.length; i++) {
				var x = this.x + GAP;
				// var y = this.y + TAB_HEIGHT + GAP + i * GAP * 3;
				var y = this.y + TAB_HEIGHT + GAP;
				// start of y with previous element
				if (i > 0) {
					y += this.elements[i-1].y - this.y;
				}
				
				// if multi-line text add more y offset for each line
				if (i > 0 && this.elements[i-1].text.includes("\n")) {
					// Once again, font size dependant.
					y += 14 * (this.elements[i-1].text.split("\n").length - 1);
				}

				// staticText requires this.width, later others might have the option too
				this.elements[i].draw(x, y, this.width);
			}
			
			ctx.restore();
		} else {
			// rect(this.x, this.y, this.width, TAB_HEIGHT, "#000");
			round_rect(this.x, this.y, this.width, TAB_HEIGHT, "#222", 5);
			
			this.openTrig();
		}
		
		ImGui.text(this.title, this.x + TRIG_OFFSET * 5, this.y + TRIG_OFFSET * 3);

		if ( this.checkHide(curX, curY) ) {
			circ(this.x + TRIG_OFFSET * 2, this.y + 9, 8, `rgba(66, 149, 249, 0.5)`);
		}

	}

	refresh() {
		// toggled refresh for all elements
		for (var i = 0; i < this.elements.length; i++) {
			this.elements[i].refresh();
		}
	}
}

class Slider {
  constructor(min, max, width, init, options) {
    this.x;
    this.y;
		
		this.init = init;

		this.state = init;
		this.validClick = false;

		this.float = options.float ? options.float : false;
		this.editing = false;
		this.input = init;

		this.text = options.text ? options.text : "";
		this.text_x = width + GAP * 2;

    this.min = min;
    this.max = max;
		ctx.font = "14px sans-serif";
		const text_width = this.text != "" ? (ctx.measureText(this.text).width+GAP) : 0
    this.width = width - text_width - GAP*2;

		document.addEventListener("keydown", (e) => this.handleInput(e));
  }

  draw(x, y) {
    this.x = x;
    this.y = y;

    // if( !this.slidex ) this.slidex = BUTTON_SIZE/8;
		
		// this.slideMin = this.x+BUTTON_SIZE;
		this.slideMin = this.x+16;
		this.slideMax = (this.width) + this.x;
		
		if ( !this.slidex && this.init != this.min ) {
			// this.slidex = (this.init/(this.max+this.min))*(this.slideMax-this.slideMin);
			// console.log("---------------")
			// console.log(this.init, this.min, this.max)

			this.slidex = (
				(this.init-this.min)
				/
				(Math.abs(this.max) - Math.abs(this.min))
				*
				(this.width-BUTTON_SIZE)
			);
			
			// console.log(this.x, this.slidex+this.x, ((this.slidex)/(this.max-BUTTON_SIZE*4)*this.slideMax))
			// console.log(this.slidex, this.width)
			// console.log("---------------")

		} else if (!this.slidex) {
			this.slidex = BUTTON_SIZE/8;
		}

		
    if ( this.checkClr(curX, curY) ) {
			rect(x, y, this.width, BUTTON_SIZE, INTERACTABLE_SELECT_MORE);
		} else {
			rect(x, y, this.width, BUTTON_SIZE, BUTTON_BACKGROUND);			
		}

		// var a = (this.init/(this.max-this.min));
		// console.log(a)
		// rect(x+this.width/2-5,y,10,10,"white")

		rect(this.slidex + x, y+BUTTON_SIZE/8, 3*BUTTON_SIZE/5, 6*BUTTON_SIZE/8, INTERACTABLE_SELECT);	

		// let number_percent = (this.slidex-2.5)/(this.width-BUTTON_SIZE)
		// if (number_percent >= 1) number_percent = 1;
		// if (number_percent <= 0.0125) number_percent = 0;
		
		// ((number_percent) *(this.max-this.min)+this.min)
		// this.state = this.editing ? this.input : this.state;
		this.state = Math.max(Math.min(this.state,this.max),this.min);
		
		const float_round = this.float == true ? 3 : 0;

		// console.log(number,this.float, float_round,parseFloat(number).toFixed(float_round) )

		const fixed_number = !this.editing ? parseFloat(this.state).toFixed(float_round) : this.input
		const fixed_number_width = ctx.measureText(fixed_number).width 

    ImGui.text(
			fixed_number,
    x + (this.width/2) - fixed_number_width / 2, this.y+3*BUTTON_SIZE/4);

		if (this.editing && Date.now() % 1000 <= 500) {
			rect(x + (this.width/2) + fixed_number_width / 2 + 2, this.y+BUTTON_SIZE/8, 2, 16, "white")
		}

		if (this.text != "") {
			ImGui.text(
				this.text,
				this.x+this.width+GAP,
				this.y+BUTTON_SIZE/4*3
			);
		}

  }

	checkClr(x, y) {
    if (
			between(x, this.x, this.slideMax ) &&
			between(y, this.y, this.y + BUTTON_SIZE)
		) {
			return true;
    }
		return false;
  }

	handleInput(e) {
		if (this.editing && e.type == "keydown") {
			if (e.key == "Enter") {
				this.editing = false;
				this.state = parseFloat(this.input || 0);
				this.refresh();
			} else if (e.key == "Escape") {
				this.editing = false;
				this.input = this.state;
				this.refresh();
			} else if (e.key == 'Backspace') {
				this.input = this.input.toString().slice(0, -1);
			} else if (e.key == '.' || parseInt(e.key) || e.key == '0' ) {
				this.input = this.input + e.key;
			}
		}
  }

  check(x, y, e) {
		// e.type = mousedown | mousemove
		// on mousedown set this.validClick = true
		// on mouseup set this.validClick = false
		// only if this.validClick is true change slide
    if (
			between(x, this.x, this.slideMax ) &&
			between(y, this.y, this.y + BUTTON_SIZE)
		) {
			if (e.buttons != 2 && e.type != "mouseup" && this.validClick) {
				this.slidex = 
				Math.min( 
					Math.max(x+BUTTON_SIZE/2, Math.floor(this.slideMin)),
					this.slideMax
				) - 3*BUTTON_SIZE/5-2-this.x;
			}

			if (e.type == "mousedown") {
				if (e.buttons == 2) {this.editing = true; 
					this.input = parseFloat(this.state);}
				else {
					this.slidex = 
					Math.min( 
						Math.max(x+BUTTON_SIZE/2, Math.floor(this.slideMin)),
						this.slideMax
					) - 3*BUTTON_SIZE/5-2-this.x;

					const number_percent = (this.slidex-2.5)/(this.width-BUTTON_SIZE)
					this.state = ((number_percent) *(this.max-this.min)+this.min)
				}
				this.validClick = true;
			}
			if (e.type == "mouseup") {
				return this.validClick = false;
			}

			if (e.buttons == 2) return
			
			if (e.type == "mousemove" && !this.validClick) return;
			else if (e.type == "mousemove" && e.buttons !== 2) {
				const number_percent = (this.slidex-2.5)/(this.width-BUTTON_SIZE)
				this.state = ((number_percent) *(this.max-this.min)+this.min)
			}
			
			return true;
    }
		this.validClick = false;
		this.editing = false;
		return false;
  }

	refresh() {
		// from state, refresh slider
		this.state = this.state > this.max ? this.max : this.state < this.min ? this.min : this.state;

		this.slidex = 
			(this.state-this.min)
			/
			(Math.abs(this.max) - Math.abs(this.min))
			*
			(this.width-BUTTON_SIZE)
	}
}

class Button {
	constructor(text) {
		this.x = 0;
		this.y = 0;
		this.text = text;
		this.width = ctx.measureText(this.text).width;

		this.callbacks = [];
		
		this.color = BUTTON_BACKGROUND;
	}

	check(x, y, e) {
		// console.log(x,y)
		// this.color based on if click or if on button

		if (
			between(x, this.x, this.x + ctx.measureText(this.text).width + GAP * 2 ) &&
			between(y, this.y, this.y + BUTTON_SIZE) 
		) {
			if (!e || ((e.movementX == 0 && e.movementY == 0) && e.type == "mousedown")){
				this.color = INTERACTABLE_SELECT;

				this.callbacks.forEach(callback => callback());
			
			}
			return true;
		}
		return false;
	}

	checkClr(x, y) {
		// console.log(x,y)
    if (
			between(x, this.x, this.x + ctx.measureText(this.text).width + GAP * 2 ) &&
			between(y, this.y, this.y + BUTTON_SIZE)
		) {
			if (this.color != INTERACTABLE_SELECT) this.color = INTERACTABLE_SELECT_MORE;
			else this.color = INTERACTABLE_SELECT_MORE
			return true;
    }
		return false;
  }

	onClick(callback) {
		if (typeof callback === 'function') {
			this.callbacks.push(callback);
		}
	}

	draw(x, y) {
		this.x = x;
		this.y = y;
		this.width = ctx.measureText(this.text).width;

		if ( this.checkClr(curX, curY) ) {
			rect(x, y, this.width + GAP * 2, BUTTON_SIZE, this.color);
		} else {
			rect(x, y, this.width + GAP * 2, BUTTON_SIZE, BUTTON_BACKGROUND);
		}
		
		var newX = x + BUTTON_SIZE * 4 + GAP;
		var newY = y + 5 + BUTTON_SIZE / 2;
		ImGui.text(this.text, 
			x + GAP, this.y+3*BUTTON_SIZE/4
		)
	}

	refresh() {
		// do nothing, automatically will refresh on next redraw
	}
}

class Checkbox {
	constructor(text, toggle, color = "white") {
		this.x = 0;
		this.y = 0;
		this.text = text;
		this.state = toggle;
		this.color = color;
	}

	checkmark(x, y) {
		ctx.beginPath();
		ctx.strokeStyle = INTERACTABLE_SELECT;
		ctx.lineWidth = 2;
		ctx.moveTo(x + BUTTON_SIZE / 4, y + BUTTON_SIZE / 2);
		ctx.lineTo(x + BUTTON_SIZE / 4 + 4, y + BUTTON_SIZE / 2 + 4);
		ctx.lineTo(x + (2 * BUTTON_SIZE) / 4 + 6, y + ((1 / 2) * BUTTON_SIZE) / 2);
		ctx.stroke();
	}

	check(x, y, e) {
		if (
			between(x, this.x + GAP, this.x + BUTTON_SIZE + GAP) &&
			between(y, this.y + GAP, this.y + BUTTON_SIZE + GAP) &&
      ((!e || (e.movementX == 0 && e.movementY == 0)) && e.type == "mousedown" && e.buttons == 1)
		) {
			this.state = !this.state;
			return true;
		}
		return false;
	}

	draw(x, y) {
		this.x = x;
		this.y = y;

		rect(x, y, BUTTON_SIZE, BUTTON_SIZE, BUTTON_BACKGROUND);
		
		var newX = x + BUTTON_SIZE + GAP;
		var newY = y + 5 + BUTTON_SIZE / 2;
		ImGui.text(this.text, newX, newY, this.color)
		
		if (this.state) {
			this.checkmark(x, y);
		}
	}

	refresh() {
		// do nothing, automatically will refresh on next redraw
	}
}

class StaticText {
	constructor(text, color, center) {
		this.x = 0;
		this.y = 0;
		this.text = text;
		this.color = color;
		this.center = center;
	}

	draw(x, y, width) {
		this.x = x;
		this.y = y;

		// seperate the text by '\n' and draw each line on a new line
		let lines = this.text.split('\n');
		for(let i=0; i<lines.length; i++) {
			// 14px is the height of the font used in ImGui.text()
			// will make fonts changable in the future
			if (this.center) {
				const textWidth = ctx.measureText(lines[i]).width;
				this.x -= GAP + textWidth
				this.x += (textWidth+width)/2
			}
			ImGui.text(lines[i], this.x, this.y + 14 * (i + 1), this.color);
			this.x = x; // reset x to the original value for the next line
		}
	}

	check(x, y, e) {
		return false;
	}

	refresh() {
		// do nothing
	}
}

window.ImGui = ImGui;

document.addEventListener("contextmenu", function (e) { 
  e.preventDefault(); 
});
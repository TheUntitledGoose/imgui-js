const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

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
const BUTTON_SIZE = 20;

const TRIG_OFFSET = 5;

//---------//
let curX = 0;
let curY = 0;

c.height = windowHeight;
c.width = windowWidth;

function rect(x, y, w, h, c) {
	ctx.beginPath();
	ctx.fillStyle = c;
	ctx.rect(x, y, w, h);
	ctx.fill();
}

function circ(x, y, r, c) {
	ctx.beginPath();
	ctx.fillStyle = c;
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fill();
}

const between = (x, min, max) => {
	return x >= min && x <= max;
};

class ImGui {
	constructor(x = 150, y = 200, width = 400, height = 500) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.moving = false;
		this.hidden = false;
		this.selected = true;

		this.elements = [];

		document.querySelector("canvas").addEventListener("mousedown", (e) => {
			if (e.buttons == 1) {
				this.checkClick(e.x, e.y, e);
		
				if ( this.checkHide(e.x, e.y) ) {
					this.hidden = !this.hidden;
				}
			}
		
			if (this.checkMove(e.x, e.y)) {
				this.moving = true;
			} else {
				this.moving = false;
			}
		});
		
		document.querySelector("canvas").addEventListener("mousemove", (e) => {
			curX = e.x;
			curY = e.y;
			if (e.buttons == 1 && this.moving) {
				this.update(this.x + e.movementX, this.y + e.movementY);
			} else if (e.buttons == 1) {
				this.checkClick(e.x, e.y, e);
			}
		});

	}

	text(text, x, y) {
    ctx.fillStyle = "white";
    ctx.font = "14px sans-serif";
    ctx.fillText(text, x, y);
  }

	checkMove(x, y) {
		var minX = this.x + TRIG_OFFSET * 5;
		var minY = this.y - 2;
		var maxX = this.x + 10 + this.width;
		var maxY = this.y + TAB_HEIGHT * 1.5;

		if (between(x, this.x, this.x + this.width) && between(y, this.y, this.y + this.height)) {
			this.selected = true
		} else this.selected = false
		if (between(x, minX, maxX) && between(y, minY, maxY)) return true;
		return false;
	}

	checkHide(x, y) {
		if (
			between(x, this.x, this.x + TRIG_OFFSET + 20) &&
			between(y, this.y + TRIG_OFFSET * 2, this.y + TRIG_OFFSET + 20)
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

	checkbox(text = "Placeholder", toggle = false) {
		this.elements.push(new Checkbox(text, toggle));
	}

	button(text = "Placeholder") {
		this.elements.push(new Button(text));
	}

	slider(min = 0, max = 100) {
		this.elements.push(new Slider(min, max, this.width));
  }

	number(min = 0, max = 100) {}

	update(x, y) {
		this.x = x;
		this.y = y;
	}

	init() {
		this.height = Math.max(this.height, TAB_HEIGHT + GAP + (this.elements.length * (BUTTON_SIZE + GAP)));
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
			rect(this.x, this.y, this.width, TAB_HEIGHT, color);
			
			this.closeTrig();
			
			rect(this.x, this.y + TAB_HEIGHT, this.width, this.height-TAB_HEIGHT, BACKGROUND);
			
			for (var i = 0; i < this.elements.length; i++) {
				var x = this.x + 10;
				var y = this.y + TAB_HEIGHT + GAP + i * GAP * 3;
				this.elements[i].draw(x, y);
			}
			
		} else {
			rect(this.x, this.y, this.width, TAB_HEIGHT, "#000");
			
			this.openTrig();
		}
		
		this.text("ImGui JS", this.x + TRIG_OFFSET * 5, this.y + TRIG_OFFSET * 3);

		if ( this.checkHide(curX, curY) ) {
			circ(this.x + TRIG_OFFSET * 2, this.y + 9, 8, `rgba(66, 149, 249, 0.5)`);
		}

	}

	move() {}
}

class Slider {
  constructor(min, max, width) {
    this.x;
    this.y;

    this.slidex = 0;

    this.min = min;
    this.max = max;
    this.width = width;
  }

  draw(x, y) {
    this.x = x;
    this.y = y;

    if( !this.slidex ) this.slidex = BUTTON_SIZE/8;

    this.slideMin = this.x+7*BUTTON_SIZE/8;
    this.slideMax = (2*this.width/3) + this.x;

		
    if ( this.checkClr(curX, curY) ) {
			rect(x, y, 2*this.width/3, BUTTON_SIZE, INTERACTABLE_SELECT_MORE);
		} else {
			rect(x, y, 2*this.width/3, BUTTON_SIZE, BUTTON_BACKGROUND);			
		}

		rect(this.slidex + x, y+BUTTON_SIZE/8, 3*BUTTON_SIZE/5, 6*BUTTON_SIZE/8, INTERACTABLE_SELECT);	

    imgui.text(
        ((this.slidex-BUTTON_SIZE/8)/(this.slideMax-this.x-((4*(BUTTON_SIZE/5))))*(this.max-this.min)+this.min)
        .toFixed(0),
    x + (this.width/3)-15, this.y+3*BUTTON_SIZE/4);
  }

	checkClr(x, y) {
    if (
			between(x, this.slidex + this.x + GAP, (this.slidex + this.x) + BUTTON_SIZE ) &&
			between(y, this.y, this.y + BUTTON_SIZE * 1.5)
		) {
			return true;
    }
		return false;
  }

  check(x, y, e) {
    if (
			between(x, this.x, this.slideMax ) &&
			between(y, this.y, this.y + BUTTON_SIZE * 1.5)
		) {
      this.slidex = 
      Math.min( 
        Math.max(x, this.slideMin),
        this.slideMax 
      ) - 3*BUTTON_SIZE/5-2-this.x;
			return true;
    }
		return false;
  }
}

class Button {
	constructor(text) {
		this.x = 0;
		this.y = 0;
		this.text = text;
	}

	check(x, y, e) {
		if (
			between(x, this.x + GAP/2, this.x + ctx.measureText(this.text).width + GAP * 3) &&
			between(y, this.y + GAP/2, this.y + BUTTON_SIZE * 1.5) &&
      (!e || (e.movementX == 0 && e.movementY == 0))
		) {
			return true;
		}
		return false;
	}

	draw(x, y) {
		this.x = x;
		this.y = y;

		if ( this.check(curX, curY) ) {
			rect(x, y, ctx.measureText(this.text).width + GAP * 2, BUTTON_SIZE, INTERACTABLE_SELECT);
		} else {
			rect(x, y, ctx.measureText(this.text).width + GAP * 2, BUTTON_SIZE, BUTTON_BACKGROUND);
		}
		
		var newX = x + BUTTON_SIZE * 4 + GAP;
		var newY = y + 5 + BUTTON_SIZE / 2;
		imgui.text(this.text, 
			x + GAP, this.y+3*BUTTON_SIZE/4
		)
		

	}
}

class Checkbox {
	constructor(text, toggle) {
		this.x = 0;
		this.y = 0;
		this.text = text;
		this.toggle = toggle;
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
			between(x, this.x, this.x + BUTTON_SIZE * 1.5) &&
			between(y, this.y, this.y + BUTTON_SIZE * 1.5) &&
      (!e || (e.movementX == 0 && e.movementY == 0))
		) {
			this.toggle = !this.toggle;
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
		imgui.text(this.text, newX, newY)
		
		if (this.toggle) {
			this.checkmark(x, y);
		}
	}
}

var imgui = new ImGui(200, 250, 400, 100);
imgui.checkbox("Test", true);
imgui.slider(0, 100);
imgui.button("this is a very long text", true);

var imgui2 = new ImGui(500, 850, 400, 100);
// imgui.slider(0, 100);
// imgui.slider(0, 100);
// imgui.slider(0, 100);
// imgui.slider(0, 100);
// imgui.slider(0, 100);
// imgui.slider(0, 100);
// imgui.slider(0, 100);
// imgui.slider(0, 100);
// imgui.slider(0, 100);
// imgui.slider(0, 100);
// imgui.slider(0, 100);
imgui.init();

function animate() {
	ctx.clearRect(0, 0, c.width, c.height);

	imgui.draw();
	imgui2.draw();
}

setInterval(animate, 10);

document.addEventListener("contextmenu", function (e) { 
	e.preventDefault(); 
})

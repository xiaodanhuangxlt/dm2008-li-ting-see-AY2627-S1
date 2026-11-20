// DM2008 — Activity 4a [Guided]
// Bake a Cookie (30 min)
//
// A class is a blueprint — Cookie describes what every cookie has and can do.
// Your job is to complete the class, then add movement and a flavor randomizer.
//
// Suggested order:
// 1. Add the missing properties to the constructor (sz, x, y)
// 2. Fix show() so it uses this.flavor, this.x, this.y, this.sz
// 3. Implement move() and randomFlavor()
// 4. Wire them up in keyPressed() and mousePressed()
//
// Stretch: add a second cookie with different starting values.

let cookie1, cookie2;

function setup() {
  createCanvas(400, 400);
  noStroke();

  cookie1 = new Cookie("chocolate", 80, width / 2, height / 2);
  cookie2 = new Cookie("vanilla", 80, 50, 50);
}

function draw() {
  background(230);

  cookie1.show();
  cookie2.show();
}

class Cookie {
  constructor(flavor, sz, x, y) {
    // this. binds each value to this specific cookie object
    // Add the missing properties below
    this.flavor = flavor;
    this.sz = sz;
    this.x = x;
    this.y = y;
  }

  show() {
    // Fix this method — it should use this.flavor, this.x, this.y, this.sz
    switch (this.flavor) {
      case "chocolate":
        fill(196, 146, 96);
        break;
      case "vanilla":
        fill(255, 223, 150);
        break;
      case "strawberry":
        fill(250, 80, 83);
        break;
      case "grape":
        fill(111, 45, 168);
        break;
      case "mango":
        fill(255, 191, 52);
        break;

      default:
        fill(220, 180, 120);
    }
    ellipse(this.x, this.y, this.sz);
  }

  // Add a move() method — update this.x or this.y based on which key is pressed
  move() {
    switch (key) {
      case "d":
        this.x += 50;
        break;
      case "a":
        this.x -= 50;
        break;
      case "w":
        this.y -= 50;
        break;
      case "s":
        this.y += 50;
        break;
    }
  }

  // Add a randomFlavor() method — set this.flavor to one of at least 3 options
  randomFlavor() {
    let flavors = ["chocolate", "vanilla", "strawberry", "mango", "grape"];
    this.flavor = random(flavors);
  }
}

// Call cookie.move() when an arrow key is pressed
function keyPressed() {
  cookie1.move();
  cookie2.move();
}

// Call cookie.randomFlavor() when the mouse is clicked
function mousePressed() {
  cookie1.randomFlavor();
  cookie2.randomFlavor();
}

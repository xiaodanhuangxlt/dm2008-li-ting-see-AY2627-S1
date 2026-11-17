// DM2008 — Activity 1b [Georg Nees]
// Learning By Making (30 min)

let x;
let y;
let w;

function setup() {
  createCanvas(800, 800)
  background(240);
  frameRate(30);
}

function draw() {
  
  x = random(width);
  y = random(height);
  w = random(10, 80);
  
  // background(240,40);
  let shapes = ["circle", "rectangle", "triangle"];
  let shape = random(shapes);

  stroke(random(0, 255), 0, random(0, 255));
  strokeWeight(random(0.5, 2));
  if(random(1)<0.5){
    noFill();
  }else{
    fill(random(0, 255), 0, random(0, 255));
  }

  if(shape == "circle"){
    circle(x,y,w);
  }else if(shape == "rectangle"){
    rect(x, y, w, w);
  }else{
    triangle(mouseX,mouseY,mouseX+50,mouseY, mouseX+25, mouseY-45);
  }
  
}

function keyPressed() {
    saveCanvas("activity1b-image", "jpg");
}
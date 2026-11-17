// DM2008 — Activity 1a
// Simple Creatures (20 min)

// Run the sketch, then click on the preview to enable keyboard
// Use the 'Option' ('Alt' on Windows) key to view or hide the grid
// Use the 'Shift' key to change overlays between black & white
// Write the code for your creature within the space provided

function setup() {
  createCanvas(400, 400);
  y = color(255,238,88); //yellow
  o = color(255,138,20); //orange
}

function draw() {
  background(228, 199, 255);
  
  fill(y);
  noStroke();
  ellipse(200,150,145,100);//Head
  quad(127, 148, 110, 270, 290, 270, 273, 148);//Body

  fill(o);
  stroke(222, 121, 20);
  strokeWeight(2);
  ellipse(200, 150, 70, 50);//Bill
  
  stroke(60);
  strokeWeight(3);
  line(175,150,225,150);//MouthLine
  
  fill(45);
  noStroke();
  ellipse(150, 150, 10, 20);
  ellipse(250, 150, 10, 20);// Eyes

  fill(y);
  noStroke();
  triangle(125, 187, 100, 225, 120, 225); //LWing
  triangle(275, 187, 280, 225, 300, 225);//RWing

  fill(o);
  noStroke();
  rect(150,285,25,15);
  quad(150, 300, 138, 320, 187, 320, 175, 300);//LFoot
  rect(225,285,25,15);
  quad(225, 300, 213, 320, 262, 320, 250, 300);//RFoot

  fill(y);
  noStroke();
  ellipse(200,270,180,50); //bottom oval
  
  helperGrid(); // do not edit or remove this line
}

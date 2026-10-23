let port; // Serial Communication port
let connectBtn;
let wasOpened = false; // tracks port state to update the button label

let sensorVal;
// let circleSize = 50;
let targetSize = 50; // used for Option 2
let marioImg, brickImg, shroomImg, bgImg;
let marioSize = 50; // current width of Mario (px)

async function setup() {
  createCanvas(windowWidth, windowHeight);
  port = createSerial(); // creates the Serial Port

  // Connection helpers
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(20, 20);
  connectBtn.mousePressed(connectBtnClick);
  brickImg = await loadImage("assets/brick.png");
  marioImg = await loadImage("assets/mario.png");
  shroomImg = await loadImage("assets/megamushroom.png");
  bgImg = await loadImage("assets/background.jpg");
}

function draw() {
  background(100);
  // ellipse(width / 2, height / 2, circleSize);
  if (marioImg) {
    imageMode(CENTER);
    image(bgImg, width / 2, height / 2, width, height);
    let h = marioImg.height * (marioSize / marioImg.width);
    image(brickImg, width / 2, height / 2 - 70, 40, 30);
    image(shroomImg, width / 2, height / 2 - 108, 50, 44);
    image(marioImg, width / 2, height / 2, marioSize, h);
  }

  updateConnectBtn();

  // Receive data from Arduino
  if (port.opened()) {
    sensorVal = port.readUntil("\n");
    // Only log data that has information, not empty signals
    if (sensorVal[0]) {
      // Once you verify data is coming in,
      // disable logging to improve performance
      console.log(sensorVal);

      // use float() to convert the data from string to number
      // (Arduino must send ONE number per line, e.g. Serial.println(distVal))
      let val = float(sensorVal);

      // Ignore anything that isn't a number (e.g. stray text or a partial line)
      if (!isNaN(val)) {
        // OPTION 1:
        // Update circle's size with sensor's data directly
        // Reduce delay() value in Arduino to get smoother changes
        // circleSize = val;

        // OPTION 2:
        // Update circle's size using lerp() to smoothly change values
        // This method even works with longer delay() values in Arduino

        // map distance (5-100cm) to mario size: further = bigger
        targetSize = map(val, 5, 100, 50, 400);
        // last value in lerp() controls speed of change
        marioSize = lerp(marioSize, targetSize, 0.1);
      }
    }
  }
}

// DO NOT REMOVE THIS FUNCTION
function connectBtnClick() {
  // If port is not already open, open on click,
  // otherwise close the port
  // (the button label is updated in updateConnectBtn())
  if (!port.opened()) {
    port.open(9600); // opens port with Baud Rate of 9600
  } else {
    port.close();
  }
}

// Keeps the button in sync with the real port state, since opening is
// asynchronous and can fail (picker cancelled, port busy, board unplugged)
function updateConnectBtn() {
  let isOpened = port.opened();
  if (isOpened === wasOpened) return;
  wasOpened = isOpened;

  connectBtn.html(isOpened ? "Disconnect Arduino" : "Connect to Arduino");
  if (isOpened) {
    connectBtn.addClass("connected");
  } else {
    connectBtn.removeClass("connected");
  }
}

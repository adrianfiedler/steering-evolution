
let vehicle;
let food = [];
let poison = [];


function setup() {
  createCanvas(640, 360);
  vehicle = new Vehicle(width / 2, height / 2);
  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height);
    food.push(createVector(x, y));
  }
  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height);
    poison.push(createVector(x, y));
  }
}

function mouseDragged() {

}

function draw() {
  background(51);

  let target = createVector(mouseX, mouseY);

  stroke(200);
  strokeWeight(2);

  for (let i = 0; i < food.length; i++) {
    fill(0, 255, 0);
    ellipse(food[i].x, food[i].y, 8, 8);
  }

  for (let i = 0; i < poison.length; i++) {
    fill(255, 0, 0);
    ellipse(poison[i].x, poison[i].y, 8, 8);
  }

  vehicle.behaviors(food, poison);
  // vehicle.seek(target);
  vehicle.update();
  vehicle.display();

}
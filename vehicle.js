// Daniel Shiffman
// The Coding Train
// Coding Challenge 69: Steering Evolution
// Part 1: https://youtu.be/flxOkx0yLrY
// Part 2: https://youtu.be/XaOVH8ZSRNA
// Part 3: https://youtu.be/vZUWTlK7D2Q
// Part 4: https://youtu.be/ykOcaInciBI
// Part 5: https://youtu.be/VnFF5V5DS8s

// https://editor.p5js.org/codingtrain/sketches/xgQNXkxx1

var mr = 0.01;

function Vehicle(x, y, dna) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, -2);
  this.position = createVector(x, y);
  this.r = 6;
  this.maxspeed = 5;
  this.maxforce = 0.5;

  this.dna = [];
  this.dna[0] = random(0, 1);
  this.dna[1] = random(-1, 0);

  // Method to update location
  this.update = function () {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  };

  this.applyForce = function (force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  };

  this.behaviors = function (good, bad) {
    var steerG = this.eat(good); //, 0.2, this.dna[2]);
    var steerB = this.eat(bad); //, -1, this.dna[3]);

    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    this.applyForce(steerB);
  };

  this.clone = function () {
    if (random(1) < 0.002) {
      return new Vehicle(this.position.x, this.position.y, this.dna);
    } else {
      return null;
    }
  };

  this.eat = function (list) {
    let record = Infinity;
    let closest = -1;
    for (let i = 0; i < list.length; i++) {
      let d = this.position.dist(list[i]);
      if (d < record) {
        record = d;
        closest = i;
      }
    }

    if (record < 5) {
      list.splice(closest, 1);
    } else if (closest > -1) {
      return this.seek(list[closest]);
    }

    return createVector(0, 0);
  };

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  this.seek = function (target) {
    var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    return steer;
    // this.applyForce(steer);
  };

  this.dead = function () {
    return this.health < 0;
  };

  this.display = function () {
    // Draw a triangle rotated in the direction of velocity
    var angle = this.velocity.heading() + PI / 2;

    push();
    translate(this.position.x, this.position.y);
    rotate(angle);

    /*     if (debug.checked()) {
          strokeWeight(3);
          stroke(0, 255, 0);
          noFill();
          line(0, 0, 0, -this.dna[0] * 25);
          strokeWeight(2);
          ellipse(0, 0, this.dna[2] * 2);
          stroke(255, 0, 0);
          line(0, 0, 0, -this.dna[1] * 25);
          ellipse(0, 0, this.dna[3] * 2);
        } */

    var gr = color(0, 255, 0);
    var rd = color(255, 0, 0);
    var col = lerpColor(rd, gr, this.health);

    fill(col);
    stroke(col);
    strokeWeight(1);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);

    pop();
  };

  this.boundaries = function () {
    var d = 25;

    var desired = null;

    if (this.position.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  };
}

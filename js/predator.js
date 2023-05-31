
/* Class for the predators */
class Predator {

    constructor(x, y) {
        this.position = createVector(x, y); // Position represented as a 2D vector
        this.velocity = createVector(random(-1, 1), random(-1, 1)); // Velocity represented as a 2D vector with random direction
        this.acceleration = createVector(0, 0); // Acceleration is initially set to zero
        this.normalSpeed = 0.8; // Normal speed of the Predator when not chasing prey (Yellow)
        this.maxSpeed = 3.25; // Maximum speed the Predator can reach while chasing (Red)
        this.energy = 125; // Current energy level of the Predator
        this.preyEaten = 0; // Number of preys eaten, resets after cool down time
        this.eatCooldown = 0; // Time of the last eaten prey
    }

    /*
    eat() function checks all preys in range and eats them if possible, also plays a sound effect when a prey is eaten
    */
    eat(preys) {
        // The Predator can eat only if it hasn't already eaten three preys in the current 'eating session'
        if (this.preyEaten < 3) {
            // Loop through all preys
            for (let i = preys.length - 1; i >= 0; i--) {
                // Calculate the distance to the current prey
                let distance = this.position.dist(preys[i].position);

                // If the prey is close enough, eat it
                if (distance < 35) {
                    // Remove the eaten prey from the Prey array
                    preys.splice(i, 1);

                    // Update eating-related properties
                    this.preyEaten++;
                    this.energy = min(this.energy + 50, 100);
                    this.velocity.mult(0.8);
                    this.eatCooldown = frameCount; // Starts a 5-second cooldown until the next 'eating session'

                    // Play eating sound effect
                    Tone.loaded().then(() => {
                        water.start();
                    });
                }
            }
        }
        // After a cooldown period, the Predator can start a new 'eating session'
        if (frameCount - this.eatCooldown > PREDATOR_COOLDOWN) {
            if (this.preyEaten > 0) {
                this.preyEaten = 0;
            }
        }
    }

    /*
    chase() function makes the Predator chase the closest Prey if it has enough energy.
    */
    chase(preys) {
        let closestPrey = null; // Initially, there is no closest Prey
        let closestDistance = Infinity; // And the distance to the closest Prey is infinite

        // Loop through all preys to find the closest one
        for (let prey of preys) {
            let distance = this.position.dist(prey.position);
            if (distance < closestDistance) {
                closestPrey = prey;
                closestDistance = distance;
            }
        }

        // If there is a Prey within range and the Predator has enough energy, chase the Prey
        if (closestPrey && closestDistance < PREDATOR_PERCEPTION_RANGE && this.energy > 0) {
            // Calculate the vector pointing from the Predator to the Prey
            let force = p5.Vector.sub(closestPrey.position, this.position);

            // Normalize the force vector (giving it a magnitude of 1), then multiply it by the Predator's maximum speed
            force.normalize();
            force.mult(this.maxSpeed);

            // Add the force vector to the Predator's acceleration
            this.acceleration.add(force);

            // Reduce the Predator's energy level
            this.energy -= 0.10;
        } else {
            // If there is no Prey within range or the Predator is out of energy, stop accelerating
            this.acceleration.mult(0);

            // Slowly replenish the Predator's energy
            this.energy = min(this.energy + 0.5, 100);
        }
    }



    /*
    update() function applies the eat() and chase() functions, updates the Predator's velocity and position, and checks if the Predator is out of bounds.
    */
    update() {
        // If the Predator hasn't eaten anything recently, it starts to chase
        this.preyEaten == 0 ? this.chase(preys) : null;

        // Regardless of whether it's eaten recently or not, the Predator tries to eat
        this.eat(preys);

        // Add the acceleration to the velocity, then limit the velocity based on the Predator's energy level and recent eating activity
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.energy > 0 && this.preyEaten == 0 ? this.maxSpeed : this.normalSpeed);

        // Add the velocity to the position to update the Predator's location
        this.position.add(this.velocity);

        // Reset the acceleration for the next frame
        this.acceleration.mult(0);

        // Check if the Predator is out of bounds and handle accordingly
        this.edges();
    }

    /*
    display() function draws the Predator's body, tail, and eye.
    */
    display() {
        push();
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading() + PI / 2); // + PI/2 is to make the triangle point upwards initially

        // Draw the tail of the Predator, changing color based on the Predator's eating state
        this.preyEaten <= 0 ? fill(207, 233, 255, 200) : fill(247, 236, 191, 200);
        this.drawTail();

        // Draw the body of the Predator, changing color based on the Predator's eating state
        this.preyEaten <= 0 ? fill(247, 97, 116) : fill(255, 196, 42);
        this.drawBody();

        // Draw the eye of the Predator
        this.drawEye();

        pop();
    }



    /*
    drawTail() function creates a shape that represents the Predator's tail.
    */
    drawTail() {
        // Starting a new shape for the tail
        beginShape();
        stroke(0);
        strokeWeight(0.4);

        // Adding vertices to the shape with a sin() function for dynamic tail movement
        let tailMovement = sin(frameCount * 0.1) * 3;
        vertex(0, 15 + tailMovement);
        vertex(9, 29 + tailMovement);
        curveVertex(0, 29 + tailMovement);
        vertex(-9, 29 + tailMovement);
        vertex(0, 15 + tailMovement);

        endShape(CLOSE);
    }

    /*
    drawBody() function creates a shape that represents the Predator's body.
    */
    drawBody() {
        // Starting a new shape for the body
        beginShape();
        stroke(0);
        strokeWeight(0.3);

        // Adding vertices to the shape to create a triangle for the body
        vertex(0, -20);    // Top vertex
        vertex(-17, 20);   // Bottom left vertex
        vertex(17, 20);    // Bottom right vertex

        endShape(CLOSE);
    }

    /*
    drawEye() function creates a shape that represents the Predator's eye.
    */
    drawEye() {
        // Calculate the center of the triangle to place the eye
        let eyeX1 = (0 + (-15) + 15) / 3;
        let eyeY1 = ((-20) + 20 + 20) / 3 - 9;

        // Draw the white of the eye
        stroke(0);
        strokeWeight(0.2);
        fill(255);
        ellipse(eyeX1, eyeY1, 6, 6);

        // Draw the pupil of the eye
        noStroke();
        fill(0);
        ellipse(eyeX1, eyeY1 - 1, 3.5, 3.5);
    }

    /*
    edges() function checks if the Predator has hit an edge of the sketch and makes it bounce back if it has.
    */
    edges() {
        // Check for collision with the left or right edge and reverse x direction if necessary
        if (this.position.x < 0 || this.position.x > width) {
            this.velocity.x *= -1;
        }

        // Check for collision with the top or bottom edge and reverse y direction if necessary
        if (this.position.y < 0 || this.position.y > height) {
            this.velocity.y *= -1;
        }
    }
}

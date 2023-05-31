
// Class for the preys that inherits the Boid behaviour.
class Prey extends Boid {
    // The Prey's constructor initializes additional state specific to Prey.
    constructor() {
        super();
        this.chased = false // Boolean to track if the Prey is currently being chased by a Predator.
    }

    // The avoid() function causes the Prey to steer away from any Predators within a certain distance.
    avoid() {
        let isCloseToAnyPredator = false // Boolean to track if a Predator is close.
        for (let predator of predators) {
            // Calculate the distance between this Prey and the Predator.
            let distance = this.position.dist(predator.position);

            // If the Predator is within a certain distance...
            if (distance < PREY_PREDATOR_PERCEPTION_RANGE) {
                isCloseToAnyPredator = true
                // Calculate the vector pointing away from the Predator.
                let force = p5.Vector.sub(this.position, predator.position);
                // Normalize the vector to have a magnitude of 1.
                force.normalize();
                // Scale the vector by this Prey's maximum speed.
                force.mult(this.maxSpeed);
                // Add the vector to this Prey's acceleration.
                this.acceleration.add(force);
                this.chased = true
            }
        }

        // If this Prey was being chased but no Predator is close anymore...
        if (this.chased && !isCloseToAnyPredator) {
            this.chased = false
        }
    }

    // The update() function applies the avoid() function, applies flocking behaviors, calls the parent class' update() function, and checks if this Prey is out of bounds.
    update() {
        this.avoid(predators); // Steer away from Predators.
        this.flock(preys); // Apply flocking behaviors.
        super.update(); // Call the parent class' update() function.
        this.edges(); // Check if this Prey is out of bounds.
    }



    //Draw Small fish
    display() {
        // The display() function draws this Prey as a small fish, using p5.js' drawing functions.
        // The fish's color changes based on whether it's being chased or not.
        push(); // Push a new drawing context.
        // Translate the drawing context to the fish's position, and rotate it based on the fish's velocity.
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading() + PI / 2); // + PI/2 is to make the triangle point upwards initially


        // Smaller tail
        // Change fill color for tail
        this.chased ? fill(153, 199, 211, 200) : fill(246, 220, 159, 200);
        beginShape();
        stroke(0);
        strokeWeight(0.3);
        // top vertex, half way up the body
        vertex(0, 4);
        // bottom left vertex, half way down and to the left of the body
        vertex(-4.5, 14);
        // bottom right vertex, half way down and to the right of the body
        vertex(4.5, 14);
        endShape(CLOSE);


        //Body
        beginShape();
        stroke(0);
        strokeWeight(0.3);
        this.chased ? fill(0, 255, 0, 200) : fill(213, 249, 228, 200);
        // top vertex
        vertex(0, -10);
        // bottom left vertex  
        vertex(-8, 10);
        // bottom right vertex   
        vertex(8, 10);

        endShape(CLOSE);

        // calculate the center of the triangle
        let eyeX2 = (0 + (-5) + 5) / 3;
        let eyeY2 = ((-10) + 10 + 10) / 3 - 2;


        stroke(0);
        strokeWeight(0.1);

        fill(255);
        // draw a circle at the center of the triangle
        ellipse(eyeX2, eyeY2 - 3, 3, 3);
        noStroke();
        // set the fill color to black
        fill(0);

        // draw a circle at the center of the triangle
        ellipse(eyeX2, eyeY2 - 3, 2, 2);
        pop();
    }

    // The edges() function makes a Prey "bounce" when it reaches the edge of the canvas.
    edges() {
        // If the Prey is out of bounds horizontally...
        if (this.position.x < 0 || this.position.x > width) {
            this.velocity.x *= -1;
        }
        // If the Prey is out of bounds vertically...
        if (this.position.y < height * 0.25 || this.position.y > height) {
            this.velocity.y *= -1;
        }
    }
}

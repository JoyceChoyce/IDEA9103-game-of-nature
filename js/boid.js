/* Base class for the boids - which will be the parent class of Prey */
/* REFERECNCE: https://editor.p5js.org/codingtrain/sketches/ry4XZ8OkN */
class Boid {
    constructor() {
        // Boid's position and velocity
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        // Boid's acceleration and force limiters
        this.acceleration = createVector();
        this.maxForce = 0.35;
        this.maxSpeed = 3.75;
    }

    // Align boid to the average heading of other boids in its perception range
    align(boids) {
        let perceptionRadius = 25;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total); // Average the steering direction
            steering.setMag(this.maxSpeed); // Set maximum speed for the boid
            steering.sub(this.velocity);
            steering.limit(this.maxForce); // Limit the steering force
        }
        return steering;
    }

    // Separate boid from other boids in its perception range to avoid crowding
    separation(boids) {
        let perceptionRadius = 24;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d * d);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total); // Average the steering direction
            steering.setMag(this.maxSpeed); // Set maximum speed for the boid
            steering.sub(this.velocity);
            steering.limit(this.maxForce); // Limit the steering force
        }
        return steering;
    }

    // Move boid towards the average position of other boids in its perception range (this gives a sense of cohesion)
    cohesion(boids) {
        let perceptionRadius = 50;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total); // Get average location
            steering.sub(this.position);
            steering.setMag(this.maxSpeed); // Set maximum speed for the boid
            steering.sub(this.velocity);
            steering.limit(this.maxForce); // Limit the steering force
        }
        return steering;
    }

    // Apply the flocking behaviors (alignment, cohesion, and separation) to the boid
    flock(boids) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);

        // Apply weights from sliders to corresponding behaviors
        alignment.mult(alignSlider.value());
        cohesion.mult(cohesionSlider.value());
        separation.mult(separationSlider.value());


        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }


    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }
}

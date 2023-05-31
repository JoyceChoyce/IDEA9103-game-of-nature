// draw wave
// [REFERENCE] Wave - Claire. (n.d.). https://openprocessing.org/sketch/1771004
function drawWaves() {
    // Set the line color, width, and endpoint style
    stroke(255, 255, 255, 150);
    strokeWeight(1.6);
    strokeCap(SQUARE);
    noFill();
    let i = 0

    // Loops over the height of the canvas, incrementing by height / NUM_STREAMS
    // This effectively creates multiple horizontal sections of the canvas
    for (let y = 0; y < height - (height / NUM_STREAMS); y += height / NUM_STREAMS) {
        let starwave = true;
        beginShape();
        let stream = streams[i];

        // Modifies the speed of the wave according to the mouse's x-position
        let speedMod = map(mouseX, 0, width, 1.5, 4);
        // Increments the time offset for each wave stream by its respective speed and the speed modifier
        t = ts[i];
        ts[i] += speeds[i] * round(speedMod);

        let shift = y / 500 + speedMod;
        let freq = map(mouseY, 0, height, height * 0.1, height * 0.1);
        // Function to calculate the y position of the wave at a given x position
        let getY = (xVal) => (sin(xVal / freq - frameCount / 1000 + shift) * height / NUM_STREAMS + y) * 1.2;

        // Loops over the width of the canvas
        for (let x = 0; x < width; x += 1) {
            // Gets the current value from the stream
            let val = stream[(x + t) % width];
            if (val && starwave) {
                vertex(x, getY(x));
            } else if (val && !starwave) {
                starwave = true;
                beginShape();
                vertex(x, getY(x));
            } else if (!val && starwave) {
                endShape();
                starwave = false;

                blendMode(BLEND);
            }
        }
        endShape();
        i += 1;
    }
}



class Cloud {
    constructor() {
        this.position = createVector(random(width), random(height * 0.25));
        this.velocity = createVector(random(0.5, 1.5), 0);
        this.size = random(30, 60);
    }


    update() {
        this.position.add(this.velocity);
        if (this.position.x > width + this.size / 2) {
            this.position.x = -this.size / 2;
        }
    }


    display() {
        fill(255, 255, 255, 200);
        ellipse(this.position.x, this.position.y, this.size);
    }
}


/* Class for the trash */
class Trash {
    // Initialize the position and size of the trash, and other parameters like number of sides and craters
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.radius = random(10, 20);
        this.phase = random(TWO_PI);
        this.sides = floor(random(3, 7));
        this.craters = floor(random(4, 8));
    }


    /*
    The update function modifies the y position based on a sine function to create a floating effect
    Also checks for collisions with 'predators', and removes any collided predator
    */
    update() {
        this.phase += 0.01; // Increment phase
        this.y += sin(this.phase) * 0.5; // Adjust y position for floating effect

        // Loop over all predators in reverse order
        for (let i = predators.length - 1; i >= 0; i--) {
            // Calculate distance between trash and current predator
            let distance = createVector(this.x, this.y).dist(predators[i].position);
            // If the distance is less than 25, remove the predator from the list
            if (distance < 25) {
                predators.splice(i, 1);
            }
        }
    }

    /* 
    The display function draws the trash with its irregular shape and craters
    Uses some transparency for aesthetic effects
    */
    display() {
        // Remove outline for the shape
        noStroke();

        // Set the fill color for the main body of the trash
        fill(102, 102, 153, 150);

        // Create the irregular shape of the trash
        beginShape();
        for (let i = 0; i < this.sides; i++) {
            // Calculate angle for current vertex
            let angle = map(i, 0, this.sides, 0, TWO_PI);
            // Calculate position for current vertex
            let px = this.x + this.radius * cos(angle + this.phase);
            let py = this.y + this.radius * sin(angle + this.phase);

            // Set the current vertex
            vertex(px, py);
        }
        // Close the shape
        endShape(CLOSE);

        // Create the craters on the trash
        for (let i = 0; i < this.craters; i++) {
            // Random position for the crater within the radius of the trash
            let craterX = this.x + random(-this.radius, this.radius);
            let craterY = this.y + random(-this.radius, this.radius);
            // Random size for the crater
            let craterRadius = random(2, this.radius / 3);

            // Random fill color for the crater from a gradient between two colors
            let trash_around_color1 = color(162, 162, 204, 100);
            let trash_around_color2 = color(55, 55, 87, 100);
            let randomColor2 = lerpColor(trash_around_color1, trash_around_color2, random());
            fill(randomColor2);

            ellipse(craterX, craterY, craterRadius);
        }

    }
}

/**
 * HELPER
 */

// create wave
function createWaves() {
    for (let i = 0; i < NUM_STREAMS; i++) {

        // Choose a random speed for the stream and add it to the speeds array
        let s = round(random(1.4, 2));
        speeds.push(s);

        // Initialize an accumulator array for this stream
        let waves = [];
        let randwave = random(0.6, 1);
        // Loop over the width of the canvas with steps of MIN_STREAK
        for (let x = 0; x < width; x += MIN_STREAK) {
            if (random() > randwave) {
                let gapLen = random(MIN_STREAK, GAP_MAX);

                for (let k = 0; k < gapLen; k++) {
                    waves.push(false);
                }
                x += gapLen;
            } else {
                for (let k = 0; k < MIN_STREAK; k++) {
                    waves.push(true);
                }
            }
        }
        streams.push(waves);
    }
}

// Create bubble
function createBubbles(numBubbles) {
    for (let i = 0; i < numBubbles; i++) {
        let x = random(width);
        let y = random(height);
        let radius = random(3, 10);
        // Create random speed for each bubble
        let speed = random(0.5, 2);
        let alpha = floor(random(70, 120));
        bubbles[i] = {
            x: x,
            y: y,
            r: radius,
            speed: speed,
            alpha: alpha
        };
    }
}

// Draw bubble
function drawBubbles() {
    for (let i = 0; i < bubbles.length; i++) {
        strokeWeight(2);
        let col = color(255, 255, 255);
        col.setAlpha(bubbles[i].alpha);
        stroke(col);
        noFill();
        ellipse(bubbles[i].x, bubbles[i].y, bubbles[i].r * 2);
    }
}

// move bubble
function moveBubbles() {
    for (let i = 0; i < bubbles.length; i++) {
        bubbles[i].x += random(-1, 1);
        // Bubble should move upward at its own speed
        bubbles[i].y -= bubbles[i].speed;
        // If the bubble reaches the top, let it start at the bottom again 
        if (bubbles[i].y < 0) {
            bubbles[i].y = height;
        }
    }
}
/* Set up Global variables */
let cvsTexture, mainGraphic
let alignSlider, cohesionSlider, separationSlider;

let c1, c2;
let a = 1;
let b = 1;


let predators = [];
let preys = [];
let clouds = [];
let trashes = [];

let isPlaying = false;
let isHidden = false
let bubbles = [];

let streams = [];
let speeds = [];

let NUM_STREAMS = 20;
let MIN_STREAK = 30;
let GAP_MAX = 5;

const PREY_PREDATOR_PERCEPTION_RANGE = 70;
const PREDATOR_PERCEPTION_RANGE = 140;

// Frame Cooldown
const PREDATOR_COOLDOWN = 150;

let ts = Array(NUM_STREAMS).fill(255);

//Music
const water = new Tone.Player({
    url: "water.wav",
    volume: -5,
}).toDestination();

/* REFERECNCE: Background Music*/
// Hans Zimmer - Epic Drama Orchestral Organ Beautiful Piano OST
//【Day One】
// Publisher - Warner Bros. Records & Sony Music Entertainment
const player = new Tone.Player({
    url: "./bgmusic.mp3",
    autostart: false,
    loop: true, 
}).toDestination();

/* Setup function */
function setup() {


    // frameRate(40)
    createCanvas(windowWidth, windowHeight);


    let controls = createDiv('');
    controls.id('controls');


    //Create Trash Button
    addTrashButton = createButton('TRASH').parent(controls);
    addTrashButton.mousePressed(addTrash);

    //Create Predator Button
    addPredatorButton = createButton('PREDATOR - big fish').parent(controls);
    addPredatorButton.mousePressed(addPredator);


    //Create Prey Button
    addPreyButton = createButton('PREY - small fish').parent(controls);
    addPreyButton.mousePressed(addPrey);



    //Create some slider to control prey steering behavior
    //Create Alignment slider
    let alignLabel = createDiv('alignment: ');
    alignLabel.parent(controls);
    alignSlider = createSlider(0, 2, 1.5, 0.1);
    alignSlider.parent(alignLabel);

    //Create Cohesion slider
    let cohesionLabel = createDiv('cohesion: ');
    cohesionLabel.parent(controls);
    cohesionSlider = createSlider(0, 2, 1, 0.1);
    cohesionSlider.parent(cohesionLabel);

    //Create Separation slider
    let separationLabel = createDiv('separation: ');
    separationLabel.parent(controls);
    separationSlider = createSlider(0, 2, 2, 0.1);
    separationSlider.parent(separationLabel);


    //Create Reset Button
    resetButton = createButton('RESET').parent(controls);
    resetButton.mousePressed(reset);

    // Create a play/stop button
    playStopButton = createButton('MUSIC [play / stop]').parent(controls);

    // Create a hide button
    hideButton = createButton('HIDE').parent(controls);
    // Create a show button
    showButton = createButton('SHOW').parent(controls);
    showButton.hide()

    // Plays or stop audio in the button's click event handler
    showButton.mousePressed(() => {
        addTrashButton.show()
        addPredatorButton.show()
        addPreyButton.show()
        alignLabel.show()
        cohesionLabel.show()
        separationLabel.show()
        resetButton.show()
        hideButton.show()
        showButton.hide()
        // refresh the playing music state
    });

    // Plays or stop audio in the button's click event handler
    hideButton.mousePressed(() => {
        addTrashButton.hide()
        addPredatorButton.hide()
        addPreyButton.hide()
        alignLabel.hide()
        cohesionLabel.hide()
        separationLabel.hide()
        resetButton.hide()
        hideButton.hide()
        showButton.show()
        // refresh the playing music state
    });




    // Plays or stop audio in the button's click event handler
    playStopButton.mousePressed(() => {
        if (isPlaying) {
            Tone.loaded().then(() => {
                player.stop();
            })
            console.log('background music stop');
        } else {
            Tone.loaded().then(() => {
                player.start();
            })
            console.log('background music star');
        }

        // refresh the playing music state
        isPlaying = !isPlaying;
    });

    //Sets the number and location of Predators, Prey, and Trash in the initial scene
    noStroke();
    for (let i = 0; i < 100; i++) {
        preys.push(new Prey(random(width), random(height)));
    }
    for (let i = 0; i < 7; i++) {
        predators.push(new Predator(random(width), random(height)));
    }
    for (let i = 0; i < 5; i++) {
        trashes.push(new Trash());
    }

    //Set up bubble
    createBubbles(20);

    //Set uo waves
    createWaves();
}


/* Functions for adding preys, predators and trash */

//Adding preys
function addPrey() {
    for (let i = 0; i < 10; i++) {
        preys.push(new Prey(random(width), random(height)));
    }
}
//Adding predator
function addPredator() {
    predators.push(new Predator(random(width), random(height)));
}


//Adding trash
function addTrash() {
    trashes.push(new Trash());
}


/* Function for resetting the game */
//Resetting all
function reset() {
    preys = [];
    clouds = [];
    trashes = [];
    for (let i = 0; i < 100; i++) {
        preys.push(new Prey(random(width), random(height)));
    }
    for (let i = 0; i < 5; i++) {
        predators.push(new Predator(random(width), random(height)));
    }
    for (let i = 0; i < 10; i++) {
        trashes.push(new Trash());
    }
}


// Handling and drawing the creatures and trash 
function drawCreatures() {

    noStroke();

    let black = color(0, 0, 0)
    c1 = color(145, 234, 228, 70);
    c1 = lerpColor(c1, black, trashes.length / 45);
    c2 = color(134, 168, 231, 70);
    c2 = lerpColor(c2, black, trashes.length / 50);

    for (let y = 0; y < height; y++) {
        n = map(y, 0, height, 0, 1);
        let newc = lerpColor(c1, c2, n);
        stroke(newc);
        let yOffset = sin(noise(frameCount) * noise(0.05)) * noise(30);
        // Adjust the frequency and amplitude as desired


        line(0, y + yOffset, width, y + yOffset);
    }


    noStroke()


    for (let trash of trashes) {
        trash.update(predators);
        trash.display();
    }
    for (let predator of predators) {
        predator.update(predators, preys);
        predator.display();
    }
    for (let prey of preys) {
        prey.update(predators, preys);
        prey.display();
    }
}

//Create bubble
function createBubbles(numBubbles) {
    for (let i = 0; i < numBubbles; i++) {
        let x = random(width);
        let y = random(height);
        let radius = random(3, 10);
        //Create random speed for each bubble
        let speed = random(0.5, 2);
        let alpha = floor(random(70, 120));
        bubbles[i] = { x: x, y: y, r: radius, speed: speed, alpha: alpha };
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

// create wave
function createWaves() {
    for (let i = 0; i < NUM_STREAMS; i++) {

        let s = round(random(1.3, 2));
        speeds.push(s);

        let acc = [];
        let randwave = random(0.6, 1);
        for (let x = 0; x < width; x += MIN_STREAK) {
            if (random() > randwave) {
                let gapLen = random(MIN_STREAK, GAP_MAX);

                for (let k = 0; k < gapLen; k++) {
                    acc.push(false);
                }
                x += gapLen;
            }
            else {
                for (let k = 0; k < MIN_STREAK; k++) {
                    acc.push(true);
                }
            }
        }
        streams.push(acc);
    }
}


//draw wave
function drawWaves() {
    stroke(255, 255, 255, 127);
    strokeWeight(1.6);
    strokeCap(SQUARE);
    noFill();
    let i = 0

    for (let y = 0; y < height - (height / NUM_STREAMS); y += height / NUM_STREAMS) {
        let begun = true;
        beginShape();
        let stream = streams[i];

        let speedMod = map(mouseX, 0, width, 1.5, 4);
        t = ts[i];
        ts[i] += speeds[i] * round(speedMod);

        let shift = y / 500 + speedMod;
        let freq = map(mouseY, 0, height, height * 0.1, height * 0.1);
        let getY = (xVal) => (sin(xVal / freq - frameCount / 1000 + shift) * height / NUM_STREAMS + y) * 1.2;

        for (let x = 0; x < width; x += 1) {
            let val = stream[(x + t) % width];
            if (val && begun) {
                vertex(x, getY(x));
            } else if (val && !begun) {
                begun = true;
                beginShape();
                vertex(x, getY(x));
            } else if (!val && begun) {
                endShape();
                begun = false;

                blendMode(BLEND);
            }
        }
        endShape();
        i += 1;
    }
}

/* Draw elements on canvas */
function draw() {
    drawWaves();
    drawBubbles();
    moveBubbles();
    drawCreatures();

}



/* Function for resizing the canvas */
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


/* Class for the predators */
//Set rules for Predator
class Predator {

    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = createVector(random(-1, 1), random(-1, 1));
        this.acceleration = createVector(0, 0);
        this.normalSpeed = 1;
        this.maxSpeed = 3.5;
        this.energy = 100;
        this.preyEaten = 0;
        this.eatCooldown = 0;
    }



    eat(preys) {
        if (this.preyEaten < 3) {
            for (let i = preys.length - 1; i >= 0; i--) {
                let distance = this.position.dist(preys[i].position);
                if (distance < 35) {
                    preys.splice(i, 1);
                    this.preyEaten++;
                    this.energy = min(this.energy + 50, 100);
                    this.velocity.mult(0.8);
                    this.eatCooldown = frameCount; // 5-second cooldown

                    const water = new Tone.Player({
                        url: "water.wav",
                        volume: -15
                    }).toDestination();

                    Tone.loaded().then(() => {
                        water.start();
                    });
                }
            }
        }


        if (frameCount - this.eatCooldown > 400) {
            if (this.preyEaten > 0) {
                this.preyEaten = 0;
            }
        }
    }


    chase(preys) {
        let closestPrey = null;
        let closestDistance = Infinity;


        for (let prey of preys) {
            let distance = this.position.dist(prey.position);
            if (distance < closestDistance) {
                closestPrey = prey;
                closestDistance = distance;
            }
        }


        if (closestPrey && closestDistance < 100 && this.energy > 0) {
            let force = p5.Vector.sub(closestPrey.position, this.position);
            force.normalize();
            force.mult(this.maxSpeed);
            this.acceleration.add(force);
            this.energy -= 0.10;
        } else {
            this.acceleration.mult(0);
            this.energy = min(this.energy + 0.5, 100);
        }
    }




    update(predators, preys) {
        this.preyEaten == 0 ? this.chase(preys) : null
        this.eat(preys)
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.energy > 0 && this.preyEaten == 0 ? this.maxSpeed : this.normalSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        this.edges();
    }


    display() {


        push();
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading() + PI / 2); // + PI/2 is to make the triangle point upwards initially




        // Smaller tail
        // Change fill color for tail
        this.preyEaten > 0 ? fill(207,233,255,200) : fill(247,236,191,200);
        beginShape();
        stroke(0);
        strokeWeight(0.4); 
        vertex(0, 15);
        vertex(9, 29);
        curveVertex(0, 29);
        vertex(-9, 29);
        vertex(0, 15);
        endShape(CLOSE);


        //Body
        beginShape();
        stroke(0);
        strokeWeight(0.3);
        this.preyEaten > 0 ? fill(247, 97, 116,200) : fill(255, 196, 42,200);
        // top vertex
        vertex(0, -20);
        // bottom left vertex  
        vertex(-17, 20);
        // bottom right vertex   
        vertex(17, 20);

        endShape(CLOSE);




        // calculate the center of the triangle
        let eyeX1 = (0 + (-15) + 15) / 3;
        let eyeY1 = ((-20) + 20 + 20) / 3 - 9;
        stroke(0);
        strokeWeight(0.2);
    
        
        fill(255);
        ellipse(eyeX1, eyeY1, 5.5, 5.5);
    
        noStroke();
        // set the fill color to black
        fill(0);

        // draw a circle at the center of the triangle
        ellipse(eyeX1, eyeY1, 3.5, 3.5);
        pop();



    }


    edges() {
        if (this.position.x < 0 || this.position.x > width) {
            this.velocity.x *= -1;
        }
        if (this.position.y < 0 || this.position.y > height) {
            this.velocity.y *= -1;
        }
    }
}


/* Base class for the boids */
/* REFERECNCE: https://editor.p5js.org/codingtrain/sketches/ry4XZ8OkN */
class Boid {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 5;
    }




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
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }


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
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }


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
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }


    flock(boids) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);


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




/* Class for the preys */
class Prey extends Boid {
    constructor(x, y) {
        super();
        this.chased = false
    }


    avoid(predator) {
        let isCloseToAnyPredator = false
        for (let predator of predators) {
            let distance = this.position.dist(predator.position);


            if (distance < 50) {
                isCloseToAnyPredator = true
                let force = p5.Vector.sub(this.position, predator.position);
                force.normalize();
                force.mult(this.maxSpeed);
                this.acceleration.add(force);
                this.chased = true
            }
        }


        if (this.chased && !isCloseToAnyPredator) {
            this.chased = false
        }
    }


    update(predators, preys) {
        this.avoid(predators);
        this.flock(preys);
        super.update();
        this.edges();
    }


    display() {

        push();
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading() + PI / 2); // + PI/2 is to make the triangle point upwards initially


        // Smaller tail
        // Change fill color for tail
        this.chased ? fill(153,199,211,200) : fill(246,220,159,200);
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
        this.chased ? fill(0,255,0,200) : fill(213,249,228,200);
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
        ellipse(eyeX2, eyeY2-3, 3, 3);
        noStroke();
        // set the fill color to black
        fill(0);

        // draw a circle at the center of the triangle
        ellipse(eyeX2, eyeY2-3, 2, 2);
        pop();
    }


    edges() {
        if (this.position.x < 0 || this.position.x > width) {
            this.velocity.x *= -1;
        }
        if (this.position.y < height * 0.25 || this.position.y > height) {
            this.velocity.y *= -1;
        }
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
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.radius = random(10, 20);
        this.phase = random(TWO_PI);
        this.sides = floor(random(3, 7));
        this.craters = floor(random(4, 8));
    }


    update(predators) {
        this.phase += 0.01;
        this.y += sin(this.phase) * 0.5;


        for (let i = predators.length - 1; i >= 0; i--) {
            let distance = createVector(this.x, this.y).dist(predators[i].position);
            if (distance < 25) {
                predators.splice(i, 1);
            }
        }
    }


    display() {
        noStroke();
        fill(102, 102, 153, 100);
        beginShape();
        for (let i = 0; i < this.sides; i++) {
            let angle = map(i, 0, this.sides, 0, TWO_PI);
            let px = this.x + this.radius * cos(angle + this.phase);
            let py = this.y + this.radius * sin(angle + this.phase);

            vertex(px, py);

        }
        endShape(CLOSE);

        for (let i = 0; i < this.craters; i++) {
            let craterX = this.x + random(-this.radius, this.radius);
            let craterY = this.y + random(-this.radius, this.radius);
            let craterRadius = random(2, this.radius / 3);

            let trash_around_color1 = color(162, 162, 204, 100);
            let trash_around_color2 = color(55, 55, 87, 100);

            let randomColor2 = lerpColor(trash_around_color1, trash_around_color2, random());

            fill(randomColor2);

            ellipse(craterX, craterY, craterRadius);
        }

    }
}


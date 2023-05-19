

/* Set up Global variables */
let cvsTexture, mainGraphic
let alignSlider, cohesionSlider, separationSlider;

let c1, c2;


let predators = [];
let preys = [];
let clouds = [];
let trashes = [];

let isPlaying = false;



/* Setup function */
function setup() {



 frameRate(40)
 createCanvas(windowWidth, windowHeight);

//  color1 = colors1;
// 	color2 = colors12;
// 	xOff = -500;
// 	yOff = 0;
// 	dir = 1;
// 	plus = 0.1;
// 	wave_h =50;
// 	t =0;
// 	filter = new makeFilter();



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

player = new Tone.Player({
    url: "mm.mp3",
    autostart: false,}).toDestination();

    // 创建一个播放/暂停按钮
  playPauseButton = createButton('MUSIC [play / stop]').parent(controls);

    // 在按钮的点击事件处理器中播放或暂停音频
    playPauseButton.mousePressed(() => {
        if (isPlaying) {
            player.stop();
            console.log('background music stop');
        } else {
            player.start();
            console.log('background music star');
        }

        // 更新播放状态
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
    for (let i = 0; i < 120; i++) {
        preys.push(new Prey(random(width), random(height)));
    }
    for (let i = 0; i < 5; i++) {
        predators.push(new Predator(random(width), random(height)));
    }
    for (let i = 0; i < 10; i++) {
        trashes.push(new Trash());
    }
}



   /* Draw function */
function draw() {

 noStroke();

    let black = color(0, 0, 0)
    c1 = color(145,234,228,70);
    c1 = lerpColor(c1, black, trashes.length / 45);
    c2 = color(134,168,231,70);
    c2 = lerpColor(c2, black, trashes.length / 50);
    // background(9, 9, 121)


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
    
//     randomSeed(seed);
 
//  let mountain_h = height / int(random(30, 40));
//  for (let n = 0; n < height; n += random(mountain_h/2,mountain_h)) {
//      push();
//      translate(0, height-n);
//      grad = drawingContext.createLinearGradient(0, -mountain_h, 0, mountain_h);
//      grad.addColorStop(0, random(color1));
//      grad.addColorStop(1, random(color2));
//      drawingContext.fillStyle = grad;
//      beginShape();
//      curveVertex(-n, n)
//      for (let i = xOff; i < width - xOff; i += 100) {
//          let p = random(-1, 1);
//          curveVertex(i, cos(i+t) * p * random(yOff))
//      }
//      curveVertex(width + n, n)
//      endShape(CLOSE);
//      pop();
//  }

//  if (dir == 1) {
//      if(yOff < wave_h){ dir = 1;}
//      else if(yOff >= wave_h){dir = -1;plus = random(0.1);}
//  } 
//  else if (dir == -1) {
//      if(yOff > 0){ dir = -1;}
//      else if(yOff <= 0){dir = 1;plus = random(0.1);}
//  } 
 
//  yOff += plus * dir;
//  t += 0.1;
//  image(overAllTexture, 0, 0);
// }

// function makeFilter() {
//  drawingContext.shadowColor = color(0, 0, 5, 95);
//  overAllTexture = createGraphics(width, height);
//  overAllTexture.loadPixels();
//  for (var i = 0; i < width; i++) {
//      for (var j = 0; j < height; j++) {
//          overAllTexture.set(
//              i,
//              j,
//              color(
//                  0,
//                  0,
//                  99,
//                  noise(i / 3, j / 3, (i * j) / 50) * random(5, 15)
//              )
//          );
//      }
//  }
//  overAllTexture.updatePixels();
// }



   
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
        


        // Smaller Triangle
        beginShape();
        fill(179,232,212); // Change fill color for smaller triangle
        vertex(0, 15);  // top vertex, half way up the larger triangle
        vertex(-7.5, 30);  // bottom left vertex, half way down and to the left of the larger triangle
        vertex(7.5, 30);  // bottom right vertex, half way down and to the right of the larger triangle
        endShape(CLOSE);

        beginShape();
        this.preyEaten > 0 ? fill(247,97,116) : fill(255,196,42);
        vertex(0, -20);  // top vertex
        vertex(-15, 20);  // bottom left vertex
        vertex(15, 20);  // bottom right vertex   
        endShape(CLOSE); 
    
               // calculate the center of the triangle
        let eyeX1 = (0 + (-15) + 15) / 3;
        let eyeY1 = ((-20) + 20 + 20) / 3-9;
    
        // set the fill color to black
        fill(0);
    
        // draw a circle at the center of the triangle
        ellipse(eyeX1, eyeY1, 5, 5);
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


        // Smaller Triangle
 fill(246,220,159); // Change fill color for smaller triangle
 beginShape();
 vertex(0, 5);  // top vertex, half way up the larger triangle
 vertex(-2.5, 15);  // bottom left vertex, half way down and to the left of the larger triangle
 vertex(2.5, 15);  // bottom right vertex, half way down and to the right of the larger triangle
 endShape(CLOSE);

 beginShape();
        this.chased ? fill(225, 255, 225) : fill(0,255,0);
        vertex(0, -10);  // top vertex
        vertex(-5, 10);  // bottom left vertex
        vertex(5, 10);  // bottom right vertex   
        
        endShape(CLOSE); 

        // calculate the center of the triangle
 let eyeX2 = (0 + (-5) + 5) / 3;
 let eyeY2 = ((-10) + 10 + 10) / 3-2;

 // set the fill color to black
 fill(0);

 // draw a circle at the center of the triangle
 ellipse(eyeX2, eyeY2, 2, 2);
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
        beginShape();
    for (let i = 0; i < this.sides; i++) {
        let angle = map(i, 0, this.sides, 0, TWO_PI);
        let px = this.x + this.radius * cos(angle + this.phase);
        let py = this.y + this.radius * sin(angle + this.phase);

        // 随机生成两个颜色
    let trashcolor1 = color(102,102,153,150);
    let trashcolor2 = color(182,182,182,150);
    
    // 在两个颜色之间进行插值，得到一个中间颜色
    let randomColor1 = lerpColor(trashcolor1, trashcolor2, random());

    // 设置填充颜色为随机颜色
    fill(randomColor1);  
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

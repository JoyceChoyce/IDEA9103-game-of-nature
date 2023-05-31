// Helper function to add preys
function addPrey() {
    for (let i = 0; i < 10; i++) {
        preys.push(new Prey(random(width), random(height)));
    }
}
// Helper function to add  predator
function addPredator() {
    predators.push(new Predator(random(width), random(height)));
}


// Helper function to add trash
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
        trash.update();
        trash.display();
    }
    for (let predator of predators) {
        predator.update();
        predator.display();
    }
    for (let prey of preys) {
        prey.update();
        prey.display();
    }
}
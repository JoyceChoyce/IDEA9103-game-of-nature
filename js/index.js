/* Setup function */
function setup() {
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
            console.log('background music start');
        }

        // Refresh the playing music state
        isPlaying = !isPlaying;
    });

    // Sets the initial number and location of Predators, Prey, and Trash in the initial scene
    noStroke();
    for (let i = 0; i < 110; i++) {
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








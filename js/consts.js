/* Set up Global variables */
let cvsTexture, mainGraphic
let alignSlider, cohesionSlider, separationSlider;

let c1, c2;
let a = 1;
let b = 1;

// Objects on canvas
let predators = [];
let preys = [];
let clouds = [];
let trashes = [];

let isPlaying = false;
let isHidden = false
let bubbles = [];

let streams = [];
let speeds = [];

// Waves
let NUM_STREAMS = 20;
let MIN_STREAK = 30;
let GAP_MAX = 5;

// Vision Range of a Prey
const PREY_PREDATOR_PERCEPTION_RANGE = 70;
// Vision Range of a Predator
const PREDATOR_PERCEPTION_RANGE = 140;

// Frame Cooldown for the Predator to be hungry and chasing again
const PREDATOR_COOLDOWN = 120;

let ts = Array(NUM_STREAMS).fill(255);

//Music
const water = new Tone.Player({
    url: "./static/water.wav",
    volume: -5,
}).toDestination();

/* REFERECNCE: Background Music*/
// Hans Zimmer - Epic Drama Orchestral Organ Beautiful Piano OST
//【Day One】
// Publisher - Warner Bros. Records & Sony Music Entertainment
const player = new Tone.Player({
    url: "./static/bgmusic.mp3",
    autostart: false,
    loop: true,
}).toDestination();

var panSpeed = 5; //8
var gravity = .3; // GRAVITY 3
var headwind = -.1;
// var wave;
var waveX = 0; // wave y velocity
var waveY = 0; // wave y velocity
var waveCycle = 0; // counter from 0 -360
var waveSize = 4; //4; // 5 in miles CHANGE THIS TO INCREASWE WAVE SWELL
var player;

var pipes;
var pipes2;
var ground;
var pauseBecauseDead;
var birdSprite;
var bestBirdSprite;
var topPipeSprite;
var bottomPipeSprite;
var backgroundSprite;
var groundSprite;

var dieOff = false;

//-------------------------------------------------------------------------------- neat globals

var nextConnectionNo = 1000;
var population;
var speed = 60; //speed = 60;

var superSpeed = 1;
var showBest = false; //true if only show the best of the previous generation
var runBest = false; //true if replaying the best ever game
var humanPlaying = false; //true if the user is playing

var humanPlayer;


var showBrain = false;
var showBestEachGen = false;
var upToGen = 0;
var genPlayerTemp; //player

var showNothing = false;

var randomPipeHeights = [];
var isChristmas = true;

var coral1;
var coralTop1;

function preload() {
  if (isChristmas) {
    //birdSprite = loadImage("images/christmasBerd.png");
    birdSprite = loadImage("images/BigFish.png");
    bestBirdSprite = loadImage("images/BigFishBestFish.png");
    coral1 = loadImage("images/Coral.png");
    coralTop1 = loadImage("images/CoralTop1.png");

  } else {
    birdSprite = loadImage("images/fatBird.png");
  }
  topPipeSprite = loadImage("images/full pipe top.png");
  bottomPipeSprite = loadImage("images/full pipe bottom.png");
  backgroundSprite = loadImage("images/backgroundOcean2.png");
  groundSprite = loadImage("images/groundPiece.png");

}

function setup() {
  window.canvas = createCanvas(1000, 800); //window.canvas = createCanvas(600, 800);

  player = new Player();
  // pipes = new PipePair(true);
  // pipes2 = new PipePair(false, pipes);
  // pipes2.setX(1.5 * canvas.width + pipes2.topPipe.width / 2);
  ground = new Ground();

  pauseBecauseDead = false;

  population = new Population(1000);
  humanPlayer = new Player();
}

function draw() {
  // background(135, 206, 250);

  // get wave details
  waveCycle += 1;
  if (waveCycle > 360) { waveCycle = 0}

  waveX = waveSize * Math.cos(waveCycle*Math.PI/180);
  waveY = waveSize * Math.sin(waveCycle*Math.PI/180);

  drawToScreen();

  // showHumanPlaying(); // force
  if (showBestEachGen) { //show the best of each gen
    showBestPlayersForEachGeneration();
  } else if (humanPlaying) { //if the user is controling the ship[
    showHumanPlaying();
  } else if (runBest) { // if replaying the best ever game
    showBestEverPlayer();
  } else { //if just evolving normally
    if (!population.done()) { //if any players are alive then update them
      population.updateAlive();
    } else { //all dead
      //genetic algorithm
      population.naturalSelection();
    }
  }
  writeInfo();
  drawBrain();
}
//-----------------------------------------------------------------------------------
function showBestPlayersForEachGeneration() {
  if (!genPlayerTemp.dead) { //if current gen player is not dead then update it

    genPlayerTemp.look();
    genPlayerTemp.think();
    genPlayerTemp.update();
    genPlayerTemp.show();
  } else { //if dead move on to the next generation
    upToGen++;
    if (upToGen >= population.genPlayers.length) { //if at the end then return to the start and stop doing it
      upToGen = 0;
      showBestEachGen = false;
    } else { //if not at the end then get the next generation
      genPlayerTemp = population.genPlayers[upToGen].cloneForReplay();
    }
  }
}
//-----------------------------------------------------------------------------------
function showHumanPlaying() {
  if (!humanPlayer.dead) { //if the player isnt dead then move and show the player based on input
    humanPlayer.look();
    humanPlayer.update();
    humanPlayer.show();
  } else { //once done return to ai
    humanPlaying = false;
  }
}
//-----------------------------------------------------------------------------------
function showBestEverPlayer() {
  if (!population.bestPlayer.dead) { //if best player is not dead
    population.bestPlayer.look();
    population.bestPlayer.think();
    population.bestPlayer.update();
    population.bestPlayer.show();
  } else { //once dead
    runBest = false; //stop replaying it
    population.bestPlayer = population.bestPlayer.cloneForReplay(); //reset the best player so it can play again
  }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------
//draws the display screen
function drawToScreen() {
  if (!showNothing) {
    //pretty stuff
    image(backgroundSprite, 0, 0, canvas.width, canvas.height);
    // showAll();
    // updateAll();
    // drawBrain();


  }
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function drawBrain() { //show the brain of whatever genome is currently showing
  var startX = canvas.width - 310; //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace DID IT
  var startY = 550;
  var w = 300;
  var h = 250;

  if (runBest) {
    population.bestPlayer.brain.drawGenome(startX, startY, w, h);
  } else
  if (humanPlaying) {
    showBrain = false;
  } else if (showBestEachGen) {
    genPlayerTemp.brain.drawGenome(startX, startY, w, h);
  } else {
   
    population.players[0].brain.drawGenomeDetail(startX, startY, w, h, population.getCurrentBest());
 
  }
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//writes info about the current player
function writeInfo() {
  fill(255);
  stroke(255);
  textAlign(LEFT);
  textSize(30);
  textSize(50);
  textAlign(CENTER);
  if (showBestEachGen) {
    text(genPlayerTemp.score, canvas.width / 2, 50); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    textAlign(LEFT);
    textSize(30);

    text("Gen: " + (genPlayerTemp.gen + 1), 20, 50);
  } else if (humanPlaying) {
    text(humanPlayer.score, canvas.width / 2, 50); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
  } else if (runBest) {
    text(population.bestPlayer.score, canvas.width / 2, 50); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    textSize(30);

    textAlign(LEFT);
    text("Gen: " + population.gen, 20, 50);
  } else if (showBest) {
    text(population.players[0].score, canvas.width / 2, 50); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    textAlign(LEFT);
    textSize(30);
    text("Gen: " + population.gen, 20, 50);

  } else {
    var bestCurrentPlayer = population.getCurrentBest();

    text(bestCurrentPlayer.score, canvas.width / 2, 50); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    textSize(26);
    textAlign(LEFT);
    //textFont('Berlin Sans FB Demi');
    textFont('Arial Black');
    text("GENERATION " + population.gen, 10, 755);

  }
}



function keyPressed() {
  switch (key) {
    case 'Q':
      //toggle showBest
      if (humanPlaying) {
        humanPlayer.flap();
      } else {
        showBest = !showBest;
      }
      break;

    case 'D':
      //toggle showBest
      if (humanPlaying) {
        humanPlayer.drop();
      } else {
        showBest = !showBest;
      }
      break; 

    case 'E':
      //toggle showBest
      if (humanPlaying) {
        humanPlayer.right();
      } else {
        showBest = !showBest;
      }
      break;

    case 'A':
      //toggle showBest
      if (humanPlaying) {
        humanPlayer.left();
      } else {
        showBest = !showBest;
      }
      break;

    case '=': //speed up frame rate
      speed += 10;
      frameRate(speed);
      print(speed);
      break;
    case '-': //slow down frame rate
      if (speed > 10) {
        speed -= 10;
        frameRate(speed);
        print(speed);
      }
      break;
    case 'B': //run the best
      runBest = !runBest;
      break;
    case 'G': //show generations
      showBestEachGen = !showBestEachGen;
      upToGen = 0;
      genPlayerTemp = population.genPlayers[upToGen].clone();
      break;
    case 'N': //show absolutely nothing in order to speed up computation
      showNothing = !showNothing;
      break;
    case 'P': //play
      humanPlaying = !humanPlaying;
      humanPlayer = new Player();
      break;
  }
  //any of the arrow keys
  switch (keyCode) {

    case RIGHT_ARROW: //right is used to move through the generations

      if (showBestEachGen) { //if showing the best player each generation then move on to the next generation
        upToGen++;
        if (upToGen >= population.genPlayers.length) { //if reached the current generation then exit out of the showing generations mode
          showBestEachGen = false;
        } else {
          genPlayerTemp = population.genPlayers[upToGen].cloneForReplay();
        }
      }
      break;
  }
}
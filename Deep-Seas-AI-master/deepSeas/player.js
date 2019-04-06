class Player {

  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.velY = 0;
    this.velX = panSpeed;
    this.intent = 0; // similar to y velocity
    this.size = 40; // width ? 
    this.dead = false;
    this.isOnGround = false;
    this.deadOnGroundCount = 0;
    this.fallRotation = -PI / 6;
    this.pipeRandomNo = 0;
    this.pipes1 = new PipePair(true);
    this.pipes2 = new PipePair(false, this.pipes1, this.pipeRandomNo);
    this.pipes3 = new PipePair(false, this.pipes2, this.pipeRandomNo);
    this.pipes4 = new PipePair(false, this.pipes3, this.pipeRandomNo);

    /* this.pipes1.setX(canvas.width - this.pipes2.topPipe.width);
    this.pipes2.setX(1.5 * canvas.width + this.pipes2.topPipe.width / 2);
    this.pipes3.setX(0 + this.pipes2.topPipe.width / 2);
    this.pipes4.setX(-.5 * canvas.width + this.pipes2.topPipe.width / 2); */

    this.pipes1.setX(850);
    this.pipes2.setX(1650);
    this.pipes3.setX(-100);
    this.pipes4.setX(-450);

    this.pipeRandomNo++;
    this.ground = new Ground();

    this.isBest = false;

    // genome PROJECT SPECIFIC HACK
    // Vision values
    this.vision0 = 0; // y velocity
    this.vision1 = 0; // x position
    this.vision2 = 0; // distance to Closest Pipe
    this.vision3 = 0; // height above Closest
    this.vision4 = 0; // height below Closest
    this.vision5 = 0; // distance to Furthest Pipe
    this.vision6 = 0; // height above Furthest
    this.vision7 = 0; // height below Furthest
    this.vision8 = 0; // wave cycle in degrees
    // Response values
    this.response0 = 0; // flap up left
    this.response1 = 0; // drop down right
    this.response2 = 0; // "right" up right
    this.response3 = 0; // "left" down left


    //-----------------------------------------------------------------------
    //neat stuff
    this.fitness = 0;
    this.vision = []; //the input array fed into the neuralNet
    this.decision = []; //the out put of the NN
    this.unadjustedFitness;
    this.lifespan = 0; //how long the player lived for this.fitness
    this.bestScore = 0; //stores the this.score achieved used for replay
    this.dead = false;
    this.score = -2; // 0  account for two new pipes to the left
    this.gen = 0;

    this.species = 0;

    this.genomeInputs = 10;
    this.genomeOutputs = 4;

    this.brain = new Genome(this.genomeInputs, this.genomeOutputs);
  }



  show() {

    this.pipes1.show();
    this.pipes2.show(); 
    this.pipes3.show();
    this.pipes4.show();

    push();
    translate(this.x - this.size / 2 - 8 + birdSprite.width / 2, this.y - this.size / 2 + birdSprite.height / 2);

    // this.intent

    // if (this.velY < -10) {
    if (this.intent < -10) {
      rotate(-PI / 6);
      this.fallRotation = -PI / 6;
    //} else if (this.velY <= 0) {
    } else if (this.intent <= 0) {
      this.fallRotation -= PI / 48.0;
      this.fallRotation = constrain(this.fallRotation, -PI / 6, PI / 3.5);
      rotate(this.fallRotation);
      
    //} else if (this.velY <= 15) {
    } else if (this.intent <= 15) {
      this.fallRotation += PI / 48.0;
      this.fallRotation = constrain(this.fallRotation, -PI / 6, PI / 3.5);
      rotate(this.fallRotation);
      
    }else if (this.intent == 0) {
      this.fallRotation = 0;
      rotate(this.fallRotation);
    } else {
      rotate(PI / 3.5);
    }

   
    // display bird
    if(this.isBest){
      image(bestBirdSprite, -76, -70, 114, 105);
    }
    else{

        // generations have different images
        // ** try fitness
        var genMOD = int(this.fitness) % 16;
        // var genMOD = this.species % 15;
        var chosenSprite = birdSprite;

        switch (genMOD)
        {
          case 0:
            chosenSprite = fishGen1Sprite;
            break;
          case 1:
            chosenSprite = fishGen2Sprite;
            break;
          case 2:
            chosenSprite = fishGen3Sprite;
            break;
          case 3:
            chosenSprite = fishGen4Sprite;
            break;
          case 4:
            chosenSprite = fishGen5Sprite;
            break;
          case 5:
            chosenSprite = fishGen6Sprite;
            break;
          case 6:
            chosenSprite = fishGen7Sprite;
            break;
          case 7:
            chosenSprite = fishGen8Sprite;
            break;
          case 8:
            chosenSprite = fishGen9Sprite;
            break;
          case 9:
            chosenSprite = fishGen10Sprite;
            break;
          case 10:
            chosenSprite = fishGen11Sprite;
            break;
          case 11:
            chosenSprite = fishGen12Sprite;
            break;
          case 12:
            chosenSprite = fishGen13Sprite;
            break;
          case 13:
            chosenSprite = fishGen14Sprite;
            break;
          case 14:
            chosenSprite = fishGen15Sprite;
            break;
        }


      image(chosenSprite, -76, -70, 114, 105);
      //image(birdSprite, -birdSprite.width / 2, -birdSprite.height / 2, 114, 105); // , 114, 105
    }
    
    pop();

  // display Best Fish metrics
    if(this.isBest){
      this.showBestMetrics();
    }

    this.ground.show();
  }


  

  showBestMetrics(){
    var bestBird = this;
    // overlay Vision Data
  
    push();
    translate(this.x, this.y);
  
    // Vision 1 x pos
    strokeWeight(1);
    stroke(50, 50, 50);
    line(0, 0, -bestBird.vision1, 0);
  
    // Vision 2 distance Ahead
    stroke(0,128,0);
    line(0, 1, 0 + bestBird.vision2, 0+1);
    line(0 + bestBird.vision2, -19, bestBird.vision2, 0+21);
  
  
    // Vision 3 closestOver
    stroke(24,100,50);
    line(0, 0, 0, 0 + bestBird.vision3);
    line(0, 0 + bestBird.vision3, 25, bestBird.vision3);
  
    // Vision 4 closestBelow (minus sign)
    stroke(40,128,68);
    line(0, 0, 0, 0 - bestBird.vision4);
    line(0, 0 - bestBird.vision4, 25, - bestBird.vision4);
  
    // Vision 5 distance Behind
    stroke(128,0,0);
    line(0, 1, 0 + bestBird.vision5, 0+1);
    line(0 + bestBird.vision5, -19, bestBird.vision5, 0+21);
  
    // Vision 6 Furthest Over
    stroke(255,80,132);
    line(-1, 0, -1, bestBird.vision6);
    line(-1, bestBird.vision6, -26, bestBird.vision6);
  
    // Vision 7  Furthest Below (minus sign)
    stroke(128,20,68);
    line(-1, 0, 0 - 1, -bestBird.vision7);
    line(-1, -bestBird.vision7, -26, -bestBird.vision7);
  
  
    // Vision 0 y velocity (here for layering's sake)
    strokeWeight(2);
    stroke(255, 255, 0);
    fill(255, 128, 0);
    line(0, 0, 0, 3*bestBird.vision0);
    ellipse(0, 3*bestBird.vision0, 4, 4);
  
    // Vision 8-9 Wave
    strokeWeight(2);
    stroke(255,255,255);
    fill(128, 128, 128);
    line(0, 0, 10* bestBird.vision8, 10* bestBird.vision9);
    ellipse(10* bestBird.vision8, 10* bestBird.vision9, 4, 4);

    // responses
    if (this.response0 >.6)
    {
      stroke(255,0,0);
      line(0, 0, -15, -15);
      ellipse(-15, -15, 4, 4);
    }
    if (this.response1 >.6)
    {
      stroke(255,0,0);
      line(0, 0, 15, 15);
      ellipse(15, 15, 4, 4);
    }
    if (this.response2 >.6)
    {
      stroke(255,0,0);
      line(0, 0, 15, -15);
      ellipse(15, -15, 4, 4);
    }
    if (this.response3 >.6)
    {
      stroke(255,0,0);
      line(0, 0, -15, 15);
      ellipse(-15, 15, 4, 4);
    }

    pop();
  }



  move() {
    this.velY += gravity + waveY;
    this.velX += headwind + waveX;

    if (!this.dead) {
      this.velY = constrain(this.velY, -1000, 25);
    } else {
      this.velY = constrain(this.velY, -1000, 40);
    }
    if (!this.isOnGround) {
      this.y += this.velY;
      this.x += this.velX;
    }

  }


  updatePipes() {
    this.pipes1.update();
    this.pipes2.update();
    this.pipes3.update();
    this.pipes4.update();

    this.ground.update();
    //if either pipe is off the screen then reset the pipe
    //  ** REDEFINED "offscreen" to mean 1000 px past each border
    if (this.pipes1.offScreen()) {
      this.pipes1 = new PipePair(false, this.pipes3, this.pipeRandomNo);
      this.pipeRandomNo++;

      if (this.pipes1.bottomPipe.x <= this.pipes3.bottomPipe.x + 500)
      {
        this.pipes1.bottomPipe.x = this.pipes3.bottomPipe.x + 600;
      }
    }
    if (this.pipes2.offScreen()) {
      this.pipes2 = new PipePair(false, this.pipes1, this.pipeRandomNo);
      this.pipeRandomNo++;

      if (this.pipes2.bottomPipe.x <= this.pipes1.bottomPipe.x + 500)
      {
        this.pipes2.bottomPipe.x = this.pipes1.bottomPipe.x + 600;
      }

    }
    if (this.pipes3.offScreen()) {
      this.pipes3 = new PipePair(false, this.pipes4, this.pipeRandomNo);
      this.pipeRandomNo++;

      if (this.pipes3.bottomPipe.x <= this.pipes1.bottomPipe.x + 500)
      {
        this.pipes3.bottomPipe.x = this.pipes1.bottomPipe.x + 600;
      }
    }

    if (this.pipes4.offScreen()) {
      this.pipes4 = new PipePair(false, this.pipes2, this.pipeRandomNo);
      this.pipeRandomNo++;

      if (this.pipes4.bottomPipe.x <= this.pipes2.bottomPipe.x + 500)
      {
        this.pipes14.bottomPipe.x = this.pipes2.bottomPipe.x + 600;
      }
    }
  }

  update() {
    this.lifespan++;
    this.updatePipes();

    //  intent leveling, adds notion of time to player choices
    if (this.intent < -4)
    {
      this.intent += 4;
    } else if (this.intent > 4)
    {
      this.intent -= 4;
    }


    this.move();

    var halfWay = this.x - this.size / 2;
    // cross passed pipe
    if (this.pipes1.playerPassed(halfWay) || this.pipes2.playerPassed(halfWay) || this.pipes3.playerPassed(halfWay) || this.pipes4.playerPassed(halfWay)) {
      this.score++;
    }

    // retreat back pipe
    if (this.pipes1.playerChickened(halfWay) || this.pipes2.playerChickened(halfWay) || this.pipes3.playerChickened(halfWay) || this.pipes4.playerChickened(halfWay)) {
      this.score--;
    }   

    if (this.isOnGround) {
      this.deadOnGroundCount++;
      if (this.deadOnGroundCount > 50) {
        // setup();
      }
    }
    if (!dieOff) {
      this.checkCollisions();
    }
  }

  checkCollisions() {
    if (!this.dead) {
      pauseBecauseDead = false;
    }
    
    if (this.pipes1.colided(this)) {
      this.dead = true;
      this.isBest = false;
      pauseBecauseDead = true;
    }
    if (this.pipes2.colided(this)) {
      pauseBecauseDead = true;
      this.isBest = false;
      this.dead = true;
    }
    if (this.pipes3.colided(this)) {
      this.dead = true;
      this.isBest = false;
      pauseBecauseDead = true;
    }
    if (this.pipes4.colided(this)) {
      pauseBecauseDead = true;
      this.isBest = false;
      this.dead = true;
    }

    if (this.ground.collided(this)) {
      this.dead = true;
      this.isBest = false;
      this.isOnGround = true;
      pauseBecauseDead = true;
    }

    // x boundary deaths
     if (this.x < 0)
     {
      this.dead = true;
      this.isBest = false;
      pauseBecauseDead = true;
     }

     if (this.x > canvas.width)
     {
      this.dead = true;
      this.isBest = false;
      pauseBecauseDead = true;
     }

     // a little padding over the top of the screen
     if (this.y < -30)
     {
      this.dead = true;
      this.isBest = false;
      pauseBecauseDead = true;
     }

    if (this.dead && this.velY < 0) {
      this.velY = 0;
    }

  }

  // ACTIONS

  flap() {
    if (!this.dead && !this.isOnGround) {
      this.velY = -4;
      this.velX = -4; // new up and left
      this.intent -= 1;
    }
  }

  drop() {
    if (!this.dead && !this.isOnGround) {
      this.velY = 4;
      this.velX = 4; // new drop right
      this.intent += 1;
    }

  }

  right(){
    if (!this.dead && !this.isOnGround) {
        this.velX = 4;
        this.velY = -4; // new right up
        this.intent -= 1;
    }
  }

  left(){
    if (!this.dead && !this.isOnGround) {
        this.velX = -4;
        this.velY = 4; // new left down
        this.intent += 1;
    }
  }

  //-------------------------------------------------------------------neat functions
  look() {
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    this.vision = [];
    this.vision[0] = map(this.velY, -5, 5, -1, 1); //bird can tell its current y velocity
    
    this.vision[1] = map(this.x, 0, canvas.width, 1, 0); // x POSITION 

    // this.vision[1] = map(this.velX, -7, 10, 1, 0); // x Velocity


// 4 pipe test

    var distanceToPipe1 = this.pipes1.bottomPipe.x - this.x;
    var distanceToPipe2 = this.pipes2.bottomPipe.x - this.x;
    var distanceToPipe3 = this.pipes3.bottomPipe.x - this.x;
    var distanceToPipe4 = this.pipes4.bottomPipe.x - this.x;

    var Ahead = [];
    var Behind = [];

    // presort
    if (distanceToPipe1 >= 0){
      Ahead.push(["pipes1", distanceToPipe1]);
    }
    else
    {
      Behind.push(["pipes1", distanceToPipe1]);
    }

    if (distanceToPipe2 >= 0){
      Ahead.push(["pipes2", distanceToPipe2]);
    }
    else
    {
      Behind.push(["pipes2", distanceToPipe2]);
    }

    if (distanceToPipe3 >= 0){
      Ahead.push(["pipes3", distanceToPipe3]);
    }
    else
    {
      Behind.push(["pipes3", distanceToPipe3]);
    }

    if (distanceToPipe4 >= 0){
      Ahead.push(["pipes4", distanceToPipe4]);
    }
    else
    {
      Behind.push(["pipes4", distanceToPipe4]);
    }


    // 
    // var closestPipeBehind = this.pipes1;
      var closestPipeBehind = Behind.sort(function(a,b){
        return b[1] - a[1];
      });

      var closestPipeAhead= Ahead.sort(function(a,b){
        return a[1] - b[1];
      });

    

    var closestAhead = Ahead[0];
    var closestAheadName;
    var distanceToClosestPipe;
    try{
      closestAheadName = closestAhead[0];
      distanceToClosestPipe = closestAhead[1];
    }
    catch(err){
    }

    var closestBehind = Behind[0];
    var closestBehindName;
    var distanceToFurthestPipe;
    try{
      closestBehindName = closestBehind[0];
      distanceToFurthestPipe = closestBehind[1];
    }
    catch(err){
    }


    var closestPipe = this.pipes1;
    var furthestPipe = this.pipes3;

    // find closest and furthest pipe, shuffle routine

    if (closestAheadName=="pipes2") {
      closestPipe = this.pipes2;
    } else if (closestAheadName=="pipes3") {
      closestPipe = this.pipes3;
    } else if (closestAheadName=="pipes4") {
      closestPipe = this.pipes4;
    }

    if (closestBehindName=="pipes1"){
      furthestPipe = this.pipes1;
    } else if (closestBehindName=="pipes2") {
      furthestPipe = this.pipes2;
    } else if (closestBehindName=="pipes3") {
      furthestPipe = this.pipes3;
    } else if (closestBehindName=="pipes4") {
      furthestPipe = this.pipes4;
    }   


    // Ahead
    // distance to next pipe Ahead
    this.vision[2] = map(distanceToClosestPipe, 0, canvas.width - this.x, 1, 0);

    var closestOver = max(0, closestPipe.bottomPipe.topY - this.y);
    this.vision[3] = map(closestOver, 0, 700, 0, 1); //height above bottomY
    var closestBelow  = max(0, this.y - closestPipe.topPipe.bottomY);
    this.vision[4] = map(closestBelow, 0, 700, 0, -1); //distance below topThing

    // Behind
    //  distance to Behind pipe
    this.vision[5] = map(distanceToFurthestPipe, this.x - canvas.width, canvas.width - this.x, 1, 0);

    var furthestOver = max(0, furthestPipe.bottomPipe.topY - this.y);
    this.vision[6] = map(furthestOver, 0, 700, 0, 1); //height above bottomY
    var furthestBelow = max(0, this.y - furthestPipe.topPipe.bottomY);
    this.vision[7] = map(furthestBelow, 0, 700, 0, -1); //distance below topThing

    // wave
    this.vision[8] = map(waveX, -waveSize, waveSize, 1, 0); // wave x pressure
    this.vision[9] = map(waveY, -waveSize, waveSize, 0, 1); // wave y pressure

    // set player object vision properties
    this.vision0 = this.velY;
    this.vision1 = this.x;
    this.vision2 = distanceToClosestPipe;
    this.vision3 = closestOver;
    this.vision4 = closestBelow;
    this.vision5 = distanceToFurthestPipe;
    this.vision6 = furthestOver;
    this.vision7 = furthestBelow;
    this.vision8 = waveX;
    this.vision9 = waveY;
  }


  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  //gets the output of the this.brain then converts them to actions
  think() {

      var max = 0;
      var maxIndex = 0;
      //get the output of the neural network
      this.decision = this.brain.feedForward(this.vision);

      if (this.decision[0] > 0.6) {
        this.flap();
      }

      if (this.decision[1] > 0.6) {
        this.drop();
      }

      if (this.decision[2] > 0.6) {
        this.right();
      }

      if (this.decision[3] > 0.6) {
        this.left();
      }

      this.response0 = this.decision[0];
      this.response1 = this.decision[1];
      this.response2 = this.decision[2];
      this.response3 = this.decision[3];


      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    //returns a clone of this player with the same brian
  clone() {
    var clone = new Player();
    clone.brain = this.brain.clone();
    clone.fitness = this.fitness;
    clone.brain.generateNetwork();
    clone.gen = this.gen;
    clone.bestScore = this.score;
    print("cloning done");
    return clone;
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //since there is some randomness in games sometimes when we want to replay the game we need to remove that randomness
  //this fuction does that

  cloneForReplay() {
    var clone = new Player();
    clone.brain = this.brain.clone();
    clone.fitness = this.fitness;
    clone.brain.generateNetwork();
    clone.gen = this.gen;
    clone.bestScore = this.score;

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    return clone;
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  //fot Genetic algorithm
  calculateFitness() {
    this.fitness = 1 + this.score * this.score + this.lifespan / 20.0;
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  crossover(parent2) {

    var child = new Player();
    child.brain = this.brain.crossover(parent2.brain);
    child.brain.generateNetwork();
    return child;
  }

}

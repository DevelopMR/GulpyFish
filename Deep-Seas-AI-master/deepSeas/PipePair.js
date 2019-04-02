class PipePair {
  constructor(firstPipe, previousPipe, upToRandNo) {
    var minDistFromEdge = 50;
    this.gap = 200 + random(60);
    //this.gap = 160;
    this.maxPipeDifference = 620; // 320// max difference between gaps between pairs
    this.passed = false;
    if (firstPipe) {
      this.topHeight = (canvas.height - 30) / 2 - this.gap / 2;
    } else {
      if (randomPipeHeights.length >= upToRandNo) {
        randomPipeHeights.push(floor(random(minDistFromEdge, canvas.height - minDistFromEdge - 30 - this.gap)));
      }
      this.topHeight = randomPipeHeights[upToRandNo]; //floor(random(minDistFromEdge, canvas.height - minDistFromEdge - 30 - this.gap));
      if (previousPipe) {
        while (abs(this.topHeight - previousPipe.topHeight) > this.maxPipeDifference) {
          randomPipeHeights[upToRandNo] = floor(random(minDistFromEdge, canvas.height - minDistFromEdge - 30 - this.gap));
          this.topHeight = randomPipeHeights[upToRandNo];
        }
      }
    }
    this.bottomHeight = canvas.height - this.topHeight - this.gap;
    var randMult = .90 + random(.20);
    this.bottomPipe = new Pipe(false, this.bottomHeight, randMult);
    this.topPipe = new Pipe(true, this.topHeight, randMult);
  }



  show() {
    this.bottomPipe.show();
    this.topPipe.show();

  }

  update() {
    this.bottomPipe.update();
    this.topPipe.update();

  }


  offScreen() {

    var leftBounds = -1400;
    if (this.bottomPipe.x + this.bottomPipe.width < leftBounds) {
      return true;
    }
    return false;

  }

  playerPassed(playerX) {
    if (!this.passed && playerX > this.bottomPipe.x + this.bottomPipe.width) {
      this.passed = true;
      return true;
    }
    return false;
  }

  playerChickened(playerX){
    if (this.passed && playerX < this.bottomPipe.x + this.bottomPipe.width) {
      this.passed = false;
      return true;
    }
    return false;

  }

  colided(p) {
    return this.bottomPipe.colided(p) || this.topPipe.colided(p);

  }

  setX(newX) {
    this.bottomPipe.x = newX;
    this.topPipe.x = newX;
  }
}

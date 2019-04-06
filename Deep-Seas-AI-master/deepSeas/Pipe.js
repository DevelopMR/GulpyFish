class Pipe {
  constructor(isTop, height, randMult) {
    this.width = 300;
    this.height = height;
    this.x = canvas.width * 1.5; // updated
    this.isTop = isTop;
    this.randomMultiplier = randMult;
    this.image = "";
    //this.randomMultiplier = random(5);
    if (isTop) {
      this.topY = 0;
      this.bottomY = this.height;
    } else {
      this.topY = canvas.height - this.height;
      this.bottomY = canvas.height;
    }
  }

  show() {

    if (this.isTop) {

      image(coralTop1, this.x, this.topY + this.height - 800);
      this.image = "coralTop1";  

/*        var whichPic = random(4);

       if (whichPic <=2){
        image(coralTop1, this.x, this.topY + this.height - 800);
        this.image = "coralTop1";        
       }
       else{
        image(coralTop2, this.x, this.topY + this.height - 450);
        this.image = "coralTop2";
       } */
      
    } else {
      image(coral1, this.x, this.topY);
      this.image = "coral1";
    }

  }

  update() {
    // add slight wave factor
    this.x -= panSpeed * this.randomMultiplier + waveX;
    this.topY -=  waveY/6;
    this.bottomY -= waveY/6;
  
  }

  colided(p) {

    if (p.x + p.size / 2 >= this.x && p.x - p.size / 2 <= this.x + this.width) {
      if (!this.isTop && p.y + p.size / 2 >= this.topY) {
        return true;
      }
      if (this.isTop && p.y - p.size / 2 <= this.bottomY) {
        return true;
      }

    }
    return false;
  }

}

// minesweeper game in OOP

// game manager

export default class GameManager {
  #badTileRate = 0.2;
  #bonusTileRate = 0.5;

  constructor(gameElement, tiles) {

    this.score = 0;
    this.lives = 3;
    this.tileCount =tiles;
    this.debug = true;
    this.gameElement = document.getElementById(gameElement);

   
    this.setupBoard();
    this.startGame();
  }


  setupBoard(){
    this.gameElement.innerHTML = "";
    this.gameInfo = document.createElement("div");
    this.gameInfo.id = "gameInfo";

    this.scoreElement = document.createElement("h2");
    this.LivesElement = document.createElement("h2");
    this.scoreElement.id = "score";
    this.LivesElement.id = "lives";

    this.gameInfo.appendChild(this.scoreElement);
    this.gameInfo.appendChild(this.LivesElement);
    this.gameElement.appendChild(this.gameInfo);

    this.element = document.createElement("div");
    this.element.id = "board";

    this.gameElement.appendChild(this.element);
  }


  startGame() {
    this.score = 0;
    this.lives = 3;
    this.updateScore();

    for (let index = 0; index < this.tileCount; index++) {
      if (Math.random() > this.#badTileRate) {
        new Tile(this.element, this);
        continue;
      }

      if (Math.random() < this.#bonusTileRate) {
        new BonusTile(this.element, this);
        continue;
      }

      new badTile(this.element, this);
    }
  }

  dead() {
    this.lives--;
    this.updateScore();
    //alert("You have " + this.lives + " lives left");
    if (this.lives <= 0) {
      this.endGame();
    }
  }

  updateScore() {
    this.scoreElement.innerText = `Score: ${this.score}`;
    this.LivesElement.innerText = `Lives: ${this.lives}`;
  }

  endGame() {
    
    this.gameInfo.innerHTML = `<h1>Game Over</h1><h2>Your score is: ${this.score}</h2>`;
    this.setupBoard();
    this.startGame();
  }
  
}

//_____________________________________________________________________________________________________________________

class Tile {
  constructor(parentElement, GameManager) {
    this.parentElement = parentElement;
    this.GameManager = GameManager;
    

    // bind til prop fordi ellers kan JS ikke finde ud af hvilken this der er tale om...
    this.tileClick = this.tileClick.bind(this);

    this.element = document.createElement("div");
    this.element.classList.add("tileBack");
this.loadAudio();

    if (this.GameManager.debug) {
      this.element.classList.add("tileGood");
    }

    this.parentElement.appendChild(this.element);
    this.element.addEventListener("click", this.tileClick);
  }

  loadAudio() {
    this.soundClip = new Audio("assets/audio/goodClick.mp3");
  }

  tileClick() {
    this.element.removeEventListener("click", this.tileClick);

    this.element.classList.remove("tileBack");
    this.element.classList.add("tileGood");
    this.soundClip.play();
    this.GameManager.score++;
    this.GameManager.updateScore();
  }
}

//_____________________________________________________________________________________________________________________

class badTile extends Tile {
  constructor(parentElement, GameManager) {
    super(parentElement, GameManager);

    if (this.GameManager.debug) {
      this.element.classList.add("tileBad");
    }
  }

  loadAudio() {
    this.soundClip = new Audio("assets/audio/badClick.mp3");
  }

  // polymorphism   denne class overwrites tileClick
  tileClick() {
    this.element.removeEventListener("click", this.tileClick);
    this.element.classList.remove("tileBack");
    this.element.classList.add("tileBad");
    this.soundClip.play();

    this.GameManager.dead();
  }
}

//_____________________________________________________________________________________________________________________

class BonusTile extends Tile {
  constructor(parentElement, GameManager) {
    super(parentElement, GameManager);

    if (this.GameManager.debug) {
      this.element.classList.add("tileBonus");
    }
  }

  loadAudio() {
    this.soundClip = new Audio("assets/audio/bonusClick.mp3");
  }


  // polymorphism   denne class overwrites tileClick
  tileClick() {
    this.element.removeEventListener("click", this.tileClick);
    this.element.classList.remove("tileBack");
    this.element.classList.add("tileBonus");
    this.soundClip.play();

    this.GameManager.score = this.GameManager.score + 10;
    this.GameManager.updateScore();
  }
}

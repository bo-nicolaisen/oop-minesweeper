// minesweeper game in OOP

// game manager
export default function  initializeGame(gameElement,tiles){

  new GameManager(gameElement, tiles);
}

//_____________________________________________________________________________________________________________________
// game manager class is the main class for the game
class GameManager {
  #badTileRate = 0.1;
  #bonusTileRate = 0.5;

  constructor(gameElement, tiles) {
    this.score = 0;
    this.lives = 3;
    this.clicks=0;
    this.tileCount = tiles * tiles;
    this.debug = false;
    this.gameElement = document.getElementById(gameElement);

    this.setupBoard();
    this.startGame();
  }

  // setup board setsup the dom structure for the game
  setupBoard() {
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

    this.element.style.gridTemplateColumns = `repeat(${Math.floor(
      Math.sqrt(this.tileCount)
    )},auto)`;

    // alert element
    this.alertElement = document.createElement("div");
    this.alertElement.classList.add("alertDown");

    this.gameElement.appendChild(this.alertElement);
  }

  // start game creates the tiles and bonus tiles
  startGame() {
    this.score = 0;
    this.lives = 3;
    this.updateScore();

    this.element.innerHTML = "";
    // this.alertElement.innerHTML = "";

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

  // dead method is called when a bad tile is clicked
  dead() {
    this.lives--;
    this.updateScore();
    //alert("You have " + this.lives + " lives left");
    if (this.lives <= 0) {
      this.endGame(`<h1>Game Over</h1><h2> Your score is: ${this.score}</h2>`);
    }
  }

  // update score updates the score and lives
  updateScore() {
    this.scoreElement.innerText = `Score: ${this.score}`;
    this.LivesElement.innerText = `Lives: ${this.lives}`;
    this.clicks++;
    if (this.clicks > this.tileCount) {
      this.endGame(`<h1>You beat the game!</h1><h2> Your score is: ${this.score}</h2>`);
    }
  }

  // end game is called when the game is over
  endGame(msg) {
    this.alertElement.innerHTML = msg;
    this.alertElement.classList.toggle("alertUp");

    setTimeout(() => {
      this.resetGame();
    }, 3000);
  }

  // reset game resets the game
  resetGame() {
    this.alertElement.classList.toggle("alertUp");
    this.startGame();
  }
}

//_____________________________________________________________________________________________________________________

// tile class is the base class for the tiles and the good tile :)
class Tile {
  constructor(parentElement, GameManager) {
    this.parentElement = parentElement;
    this.GameManager = GameManager;

    // bind til prop fordi ellers kan JS ikke finde ud af hvilken this der er tale om...
    this.tileClick = this.tileClick.bind(this);

    this.element = document.createElement("div");
    this.element.classList.add("tileBack");

    if (this.GameManager.debug) {
      this.element.classList.add("tileGood");
    }

    this.parentElement.appendChild(this.element);
    this.element.addEventListener("click", this.tileClick);
  }

  tileClick() {
    this.element.removeEventListener("click", this.tileClick);

    this.element.classList.remove("tileBack");
    this.element.classList.add("tileGood");

    this.GameManager.score++;
    this.GameManager.updateScore();
  }
}

//_____________________________________________________________________________________________________________________

// bad tile class is a subclass of tile for deadly tiles :)

class badTile extends Tile {
  constructor(parentElement, GameManager) {
    super(parentElement, GameManager);

    if (this.GameManager.debug) {
      this.element.classList.add("tileBad");
    }
  }

  // polymorphism   denne class overwrites tileClick
  tileClick() {
    this.element.removeEventListener("click", this.tileClick);
    this.element.classList.remove("tileBack");
    this.element.classList.add("tileBad");

    this.GameManager.dead();
  }
}

//_____________________________________________________________________________________________________________________

// bonus tile class is a subclass of tile for bonus tiles
class BonusTile extends Tile {
  constructor(parentElement, GameManager) {
    super(parentElement, GameManager);

    if (this.GameManager.debug) {
      this.element.classList.add("tileBonus");
    }
  }

  // polymorphism   denne class overwrites tileClick
  tileClick() {
    this.element.removeEventListener("click", this.tileClick);
    this.element.classList.remove("tileBack");
    this.element.classList.add("tileBonus");

    this.GameManager.score = this.GameManager.score + 10;
    this.GameManager.updateScore();
  }
}

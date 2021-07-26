class SnakeGame {
  constructor() {
    this.canvas = document.getElementById("game");
    this.context = this.canvas.getContext("2d");
    document.addEventListener("keydown", this.onKeyPress.bind(this));
    this.challenges = [
      {
        id: 0,
        name: "Duvarlara Çarpma !",
        time: 20,
      },
      {
        id: 1,
        name: "Zehirli Elmayı Yeme !",
        time: 20,
      },
      {
        id: 2,
        name: "Oyun Hızlandı !",
        time: 10,
      },
      {
        id: 3,
        name: "MIX !",
        time: 10,
      },
    ];
  }
  startMusic = () => {
    var bgmusic = document.getElementById("background-music");
    bgmusic.volume = 0.03;
    bgmusic.play();
  };
  playEatSound = () => {
    var eat = document.getElementById("eat-sound");
    eat.volume = 1;
    eat.play();
  };
  playGameOverSound() {
    var sound = document.getElementById("game-over-sound");
    sound.volume = 1;
    sound.play();
  }
  async endGame() {
    clearInterval(this.timer);
    clearInterval(this.nextChallengeTimer);
    clearInterval(this.currentChallengeTimer);
    // document.getElementById("score").innerHTML = "Şuan ki skorun : " + this.score
    try {
      document.getElementById("center").className = "fade";

      this.playGameOverSound();
      setTimeout(() => {
        window.location.href = "game-over.html";
      }, 1500);
      await localStorage.setItem("score", this.score);
    } catch (error) {
      console.log(error);
    }
  }
  startGame = () => {
    this.endGame();
    this.init();
  };
  init() {
    this.positionX = this.positionY = 10;
    this.appleX = this.appleY = 5;
    this.toxicAppleX = this.toxicAppleY = -100;
    this.speed = 10;
    this.tailSize = 10;
    this.trail = [{}];
    this.gridSize = 20;
    this.tileCount = 30;
    this.velocityX = this.velocityY = 0;
    this.timer = this.setSnakeSpeed(10);
    this.nextChallengeTimer = setInterval(
      this.tikNextChallengeTimer.bind(this),
      1000
    );
    this.nextChallengeTime = 2;
    this.currentChallenge = null;
    this.score = 0;
    this.apple = new Image();
    this.toxicApple = new Image();
    this.apple.onload = () => {
      this.context.imageSmoothingEnabled = false;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    this.toxicApple.onload = () => {
      this.context.imageSmoothingEnabled = false;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    this.apple.src = "../assets/golden.png";
    this.toxicApple.src = "../assets/toxic-apple.png";
  }
  tikNextChallengeTimer = () => {
    document.getElementById("time").innerHTML = this.nextChallengeTime;
    document.getElementById("challenge").innerHTML = "Sıradaki Görev İçin ";
    if (this.nextChallengeTime <= 0) {
      clearInterval(this.nextChallengeTimer);
      this.createChallenge();
    } else {
      this.nextChallengeTime--;
    }
  };
  update() {
    this.positionX += this.velocityX;
    this.positionY += this.velocityY;
    var challengeId = this.currentChallenge ? this.currentChallenge.id : null;
    if (this.positionX < 0) {
      this.positionX = this.tileCount - 1;
      if (challengeId === 0 || challengeId === 2 || challengeId === 3) {
        this.endGame();
      }
    }
    if (this.positionY < 0) {
      this.positionY = this.tileCount - 1;
      if (challengeId === 0 || challengeId === 2 || challengeId === 3) {
        this.endGame();
      }
    }
    if (this.positionX > this.tileCount - 1) {
      this.positionX = 0;
      if (challengeId === 0 || challengeId === 2 || challengeId === 3) {
        this.endGame();
      }
    }
    if (this.positionY > this.tileCount - 1) {
      this.positionY = 0;
      if (challengeId === 0 || challengeId === 2 || challengeId === 3) {
        this.endGame();
      }
    }
    this.trail.push({
      positionX: this.positionX,
      positionY: this.positionY,
    });
    while (this.trail.length > this.tailSize) {
      this.trail.shift();
    }
    if (this.appleX === this.positionX && this.appleY === this.positionY) {
      this.tailSize++;
      this.score += 5;
      this.appleX = Math.floor(Math.random() * this.tileCount);
      this.appleY = Math.floor(Math.random() * this.tileCount);
      this.playEatSound();
      if (this.currentChallenge) {
        if (this.currentChallenge.id === 1 || this.currentChallenge.id === 3) {
          var qus = Math.floor(Math.random() * 2);
          if (qus === 0) {
            this.toxicAppleX = this.appleX + Math.floor(Math.random() * 2) + 1;
            this.toxicAppleY = this.appleY + Math.floor(Math.random() * 2) + 1;
          } else {
            this.toxicAppleX = this.appleX - Math.floor(Math.random() * 2) + 1;
            this.toxicAppleY = this.appleY - Math.floor(Math.random() * 2) + 1;
          }
        } else {
          this.toxicAppleX = this.toxicAppleY = -100;
        }
      }
    }
    if (
      this.toxicAppleX === this.positionX &&
      this.toxicAppleY === this.positionY
    ) {
      if (this.currentChallenge) {
        if (this.currentChallenge.id === 1 || this.currentChallenge.id === 3) {
          this.endGame();
        }
      }
    }
  }
  loop() {
    this.update();
    this.draw();
  }
  canvasRadius(ctx, x, y, w, h, tl, tr, br, bl) {
    var r = x + w,
      b = y + h;
    ctx.arc(
      this.canvas.width / 2 - 50 / 2,
      this.canvas.height / 2,
      50,
      0,
      Math.PI * 2
    );
    ctx.beginPath();
    ctx.moveTo(x + tl, y);
    ctx.lineTo(r - tr, y);
    ctx.quadraticCurveTo(r, y, r, y + tr);
    ctx.lineTo(r, b - br);
    ctx.quadraticCurveTo(r, b, r - br, b);
    ctx.lineTo(x + bl, b);
    ctx.quadraticCurveTo(x, b, x, b - bl);
    ctx.lineTo(x, y + tl);
    ctx.quadraticCurveTo(x, y, x + tl, y);
    ctx.stroke();
    ctx.fill();
  }
  draw() {
    if (this.currentChallenge) {
      if (this.currentChallenge.id === 2 || this.currentChallenge.id === 3) {
        this.context.fillStyle = "rgba(39,39,39,0.5)";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      } else {
        this.context.fillStyle = "#272727";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
    } else {
      this.context.fillStyle = "#272727";
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.context.fillStyle = "white";
    this.context.font = "20px Arial";
    this.context.fillText(this.score, 20, 40);
    this.trail.forEach((t, index) => {
      if (index === this.trail.length - 1) {
        this.context.fillStyle = "yellow";
        this.canvasRadius(
          this.context,
          t.positionX * this.gridSize,
          t.positionY * this.gridSize,
          this.gridSize,
          this.gridSize,
          5,
          5,
          5,
          5
        );
        this.context.fillStyle = "white";
        this.canvasRadius(
          this.context,
          t.positionX * this.gridSize + 3,
          t.positionY * this.gridSize + 5,
          5,
          5,
          1,
          1,
          1,
          1
        );
        this.canvasRadius(
          this.context,
          t.positionX * this.gridSize + 12,
          t.positionY * this.gridSize + 5,
          5,
          5,
          1,
          1,
          1,
          1
        );
        this.context.fillStyle = "black";
        this.canvasRadius(
          this.context,
          t.positionX * this.gridSize + 15,
          t.positionY * this.gridSize + 5,
          2,
          2,
          1,
          1,
          1,
          1
        );
        this.canvasRadius(
          this.context,
          t.positionX * this.gridSize + 6,
          t.positionY * this.gridSize + 5,
          2,
          2,
          1,
          1,
          1,
          1
        );
      } else {
        this.context.fillStyle = "yellow";
        this.canvasRadius(
          this.context,
          t.positionX * this.gridSize,
          t.positionY * this.gridSize,
          this.gridSize,
          this.gridSize,
          5,
          5,
          5,
          5
        );
      }
    });
    this.context.fillStyle = "red";
    if (this.currentChallenge) {
      if (this.currentChallenge.id === 1 || this.currentChallenge.id === 3) {
        this.context.drawImage(
          this.toxicApple,
          this.toxicAppleX * this.gridSize,
          this.toxicAppleY * this.gridSize,
          this.gridSize,
          this.gridSize
        );
      }
    }
    this.trail.forEach((t) => {
      this.context.drawImage(
        this.apple,
        this.appleX * this.gridSize,
        this.appleY * this.gridSize,
        this.gridSize,
        this.gridSize
      );
    });
  }
  onKeyPress(e) {
    this.startMusic();
    if (e.keyCode === 37 && this.velocityX !== 1) {
      this.velocityX = -1;
      this.velocityY = 0;
    }
    if (e.keyCode === 38 && this.velocityY !== 1) {
      this.velocityX = 0;
      this.velocityY = -1;
    }
    if (e.keyCode === 39 && this.velocityX !== -1) {
      this.velocityX = 1;
      this.velocityY = 0;
    }
    if (e.keyCode === 40 && this.velocityY !== -1) {
      this.velocityX = 0;
      this.velocityY = 1;
    }
  }
  tikCurrentChallengeTimer = (e) => {
    document.getElementById("time").innerHTML = this.currentChallengeTime;
    document.getElementById(
      "challenge"
    ).innerHTML = `Görev : ${this.currentChallenge.name}`;
    console.log(this.currentChallengeTime);
    if (this.currentChallengeTime <= 0) {
      clearInterval(this.currentChallengeTimer);
      this.currentChallenge = null;
      this.nextChallengeTimer = setInterval(
        this.tikNextChallengeTimer.bind(this),
        1000
      );
      this.nextChallengeTime = 5;
      clearInterval(this.timer);
      document.getElementById("border").className = "gradient-border-success";
    } else {
      this.currentChallengeTime--;
    }
  };
  createChallenge = () => {
    var challenge = Math.floor(Math.random() * this.challenges.length);
    this.currentChallengeTimer = setInterval(
      this.tikCurrentChallengeTimer.bind(this),
      1000
    );
    document.getElementById("border").className = "gradient-border-danger";
    this.currentChallengeTime = this.challenges[challenge].time;
    this.currentChallenge = this.challenges[challenge];
    if (this.currentChallenge.id === 2 || this.currentChallenge.id === 3) {
      let sayi = 5;
      let interval = setInterval((x) => {
        sayi++;
        if (sayi <= 11) {
          this.setSnakeSpeed(sayi);
        } else {
          clearInterval(interval);
        }
      }, 1000);
    }
  };
  setSnakeSpeed = (speed) => {
    clearInterval(this.timer);
    this.timer = setInterval(this.loop.bind(this), Math.floor(1000 / speed));
  };
}
const game = new SnakeGame();
window.onload = () => game.init();

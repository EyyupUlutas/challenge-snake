function startGame() {
  var bgmusic = document.getElementById("start_music");
  bgmusic.remove();
  window.location.href = "game.html";
}

function setHtpVisibility(code = 0) {
  playClickSound();
  if (code === 0) {
    document.getElementById("htp-screen").style = "display: none";
    document.getElementById("start-screen").style = "display: flex";
  } else if (code === 1) {
    document.getElementById("htp-screen").style = "display: flex";
    document.getElementById("start-screen").style = "display: none";
  }
}

function setDeveloperVisibility(code = 0) {
  playClickSound();
  if (code === 0) {
    document.getElementById("developer-screen").style = "display: none";
    document.getElementById("start-screen").style = "display: flex";
  } else if (code === 1) {
    document.getElementById("developer-screen").style = "display: flex";
    document.getElementById("start-screen").style = "display: none";
  }
}

function playClickSound() {
  var sound = document.getElementById("click-sound");
  sound.volume = 0.1;
  sound.play();
}

function setAudioConfirmModalVisibility(code = 0) {
  if (code === 0) {
    document.getElementById("confirmAudioModal").style.display = "none";
  } else if (code === 1) {
    document.getElementById("confirmAudioModal").style.display = "block";
  }
}

function startMusic() {
  var bgmusic = document.getElementById("start_music");
  bgmusic.volume = 0.01;
  bgmusic
    .play()
    .then((x) => {
      setAudioConfirmModalVisibility(0);
    })
    .catch((error) => {
      console.log(error);
    });
}
window.onload = () => {
  this.setHtpVisibility(0);
  this.setDeveloperVisibility(0);
  setAudioConfirmModalVisibility(1);
};

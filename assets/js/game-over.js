async function getScore() {
  let score = await localStorage.getItem("score");
  document.getElementById("score").innerHTML = `Şuan Ki Skorun  : ${score}`;
}

window.onload = () => {
  getScore();
};

function retry() {
  playClickSound();
  window.location.href = "game.html";
}

function goStartPage() {
  window.location.href = "start-page.html";
}
function playClickSound() {
  var sound = document.getElementById("click-sound");
  sound.volume = 0.1;
  sound.play();
}

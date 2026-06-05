let senbei = Number(localStorage.getItem("senbei")) || 0;
let senbeiPerClick = 1;
const senbeiButton = document.querySelector(".senbei");
const clickSound = new Audio("./DONOTTOUCH/せんべい・スナック食べる03.mp3");
function clickSenbei(current, increment) {
  return current + increment;
}
senbeiButton.addEventListener("click", () => {
  senbei = clickSenbei(senbei, senbeiPerClick);
  localStorage.setItem("senbei", senbei);
  clickSound.currentTime = 0;
  clickSound.play();
  console.log(senbei);
});

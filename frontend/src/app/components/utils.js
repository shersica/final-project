export function displayDialogue(text, onDisplayEnd) {
  const dialogueUI = document.getElementById("textbox-container");
  const dialogue = document.getElementById("dialogue");
  console.log(dialogueUI)
  dialogueUI.style.display = "block";
  let index = 0;
  let currentText = "";
  const intervalRef = setInterval(() => {
    if (index < text.length) {
      currentText += text[index];
      dialogue.innerHTML = currentText;
      index++;
      return;
    }

    clearInterval(intervalRef);
  }, 1);

  const closeBtn = document.getElementById("close");

  function onCloseBtnClick() {
    onDisplayEnd();
    dialogueUI.style.display = "none";
    dialogue.innerHTML = "";
    clearInterval(intervalRef);
    closeBtn.removeEventListener("click", onCloseBtnClick);
  }

  closeBtn.addEventListener("click", onCloseBtnClick);

  addEventListener("keypress", (key) => {
    if (key.code === "Enter") {
      closeBtn.click();
    }
  });
}

export function setCamScale(k) {
  const resizeFactor = k.width() / k.height();
  if (resizeFactor < 1) {
    k.camScale(k.vec2(1));
  } else {
    k.camScale(k.vec2(1.5));
  }
}

export const dialogueData = {
  pc: `So many fun games to play on this PC!`,
  location: `Hmm... where is our office located? Scroll down to find out!`,
  "sofa-table": `Make friends and find out what games they are playing!`, 
  tv: "TV! Time to play some console games",
  bed: ` Gaming is fun, but remember to get some sleep!`,
  review: `Review games and find out what other gamers think!!`,
  projects: `Playpal is a community-powered game discovery platform to help you find the trending upcoming games!`,
  library: `Add games to your library to keep track of them!`,
  exit: `If you want to exit Playpal, just close the tab.`,
};

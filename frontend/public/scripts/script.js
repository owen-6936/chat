const chatContainer = document.querySelector(".chats");
let chatCounter = 0;
let chatCount = 5;
// creating custom events
const load_cards = new Event("cardLoaded");
const screenSize = "small";

// event handlers
window.addEventListener("resize", () => {
  if (!document.querySelector(".convo-header").classList.contains("d-none")) {
    if (window.innerWidth < 875) {
      document.querySelector(".chats").classList.add("d-none");
      document.querySelector(".conversation").classList.add("d-flex");
      document.querySelector(".arrow-back").classList.remove("d-none");
    } else {
      document.querySelector(".chats").classList.remove("d-none");
      document.querySelector(".arrow-back").classList.add("d-none");
    }
  } else {
    if (window.innerWidth < 875) {
      closeConvo();
    }
  }
});

document.querySelector(".logout-btn").addEventListener("click", (e) => {
  fetch("/logout", { method: "POST", redirect: "follow" }).then(() => {
    location.href = "/";
  });
});

chatContainer.addEventListener("cardLoaded", () => {
  console.log("chats loaded");
  chatContainer.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", (evt) => {
      const username = evt.currentTarget.children[1].children[0].textContent;
      openConvo(username);
    });
  });
});

document
  .querySelector(".arrow-back")
  .addEventListener("click", () => closeConvo());

// functions ...
function createCard({
  username = "unknown",
  textDetails = "",
  time = "00:00",
  imageUrl = "./assets/images/profile/default-profile-pic_128x128.jpg",
}) {
  const cardContainer = document.querySelector(".chats");
  const card = document.createElement("div");
  card.classList.add("card");
  const cardImage = document.createElement("img");
  cardImage.classList.add("card-image");
  cardImage.src = imageUrl;
  const cardDetails = document.createElement("div");
  cardDetails.classList.add("card-details");
  const cardTitle = document.createElement("span");
  cardTitle.textContent = username;
  cardTitle.classList.add("card-title");
  const cardText = document.createElement("span");
  cardText.textContent = textDetails;
  cardText.classList.add("card-text");
  const cardTime = document.createElement("h6");
  cardTime.classList.add("time", "pt-2");
  cardTime.textContent = time;
  document.querySelector(".temp-chats-txt").classList.add("d-none");
  cardDetails.append(...[cardTitle, cardText]);
  card.append(...[cardImage, cardDetails, cardTime]);
  cardContainer.appendChild(card);
  chatCounter++;
  if (chatCount === chatCounter) {
    cardContainer.dispatchEvent(load_cards);
  }
}

function openConvo(
  username = "unknown",
  imageSrc = "./assets/images/profile/default-profile-pic_128x128.jpg"
) {
  const convoContainer = document.querySelector(".conversation");
  convoContainer.querySelector(".temp-convo-txt").classList.add("d-none");
  const convoHeader = convoContainer.children[0];
  convoHeader.classList.remove("d-none");
  convoHeader.children[1].src = imageSrc;
  convoHeader.children[2].textContent = username;
  if (window.innerWidth < 875) {
    document.querySelector(".chats").classList.add("d-none");
    document.querySelector(".conversation").classList.add("d-flex");
  } else {
    document.querySelector(".arrow-back").classList.add("d-none");
  }
}

function closeConvo() {
  console.log("closing convo");
  document.querySelector(".chats").classList.remove("d-none");
  document.querySelector(".conversation").classList.replace("d-flex", "d-none");
}

createCard({
  username: "Jace",
  textDetails: "helo Owen how are you doing? where are you",
});
createCard({ username: "Jace" });
createCard({ username: "Owen" });
createCard({ username: "Clinton" });
createCard({ username: "Sam" });

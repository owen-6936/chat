document.querySelector(".logout-btn").addEventListener("click", (e) => {
  fetch("/logout", { method: "POST", redirect: "follow" }).then(() => {
    location.href = "/";
  });
});

function createCard({
  username = "unknown",
  textDetails = "",
  time = "00:00",
  imageUrl = "./assets/images/profile/default-profile-pic_128x128.jpg",
  uid,
}) {
  const cardContainer = document.querySelector(".chats");
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("uid", uid);
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
}

createCard({});

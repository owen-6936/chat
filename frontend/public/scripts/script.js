"use strict";
window.onload = () => {
  const socket = io("/", { autoConnect: false });
  const chatContainer = document.querySelector(".chats");
  let chatCounter = 0;
  let chatCount = 5;
  const username = sessionStorage.getItem("username");
  var onlineUsers = [];
  // creating custom events
  const load_cards = new Event("cardLoaded");
  const onlineUsersUpdated = new Event("onlineUsersUpdated");

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

  window.addEventListener("onlineUsersUpdated", () => {
    onlineUsers.map((user) => {
      createCard({ username: user.username });
    });
  });

  document.querySelector(".logout-btn").addEventListener("click", (e) => {
    fetch("/logout", { method: "POST", redirect: "follow" }).then(() => {
      sessionStorage.clear();
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

  document.querySelector(".message-bar").addEventListener("input", () => {
    handleLineBreak();
  });

  document.querySelector(".sendbtn").addEventListener("click", () => {
    const text = document.querySelector(".message-bar").value;
    document.querySelector(".message-bar").value = "";
    handleMyMesssage(text);
  });

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
    convoHeader.children[2].src = imageSrc;
    convoHeader.children[3].textContent = username;
    if (window.innerWidth < 875) {
      document.querySelector("header").classList.add("d-none");
      document.querySelector(".navbar").classList.add("d-none");
      document.querySelector(".chats").classList.add("d-none");
      document.querySelector(".conversation").classList.add("d-flex");
    } else {
      document.querySelector(".navbar").classList.remove("d-none");
      document.querySelector("header").classList.remove("d-none");
      document.querySelector(".arrow-back").classList.add("d-none");
    }
    document.querySelector(".cht-comp-cont").classList.remove("d-none");
  }

  function closeConvo() {
    console.log("closing convo");
    document.querySelector(".chats").classList.remove("d-none");
    document.querySelector("header").classList.remove("d-none");
    document
      .querySelector(".conversation")
      .classList.replace("d-flex", "d-none");
    document.querySelector(".cht-comp-cont").classList.add("d-none");
    document.querySelector(".navbar").classList.remove("d-none");
  }

  function handleLineBreak() {
    const hiddenDiv = document.querySelector(".hidden-div");
    const txtComp = document.querySelector(".message-bar");
    hiddenDiv.textContent = txtComp.value;
    hiddenDiv.style.width = txtComp.clientWidth + "px";
    const ht = txtComp.computedStyleMap().get("min-height")["value"];
    const lht = txtComp.computedStyleMap().get("line-height")["value"];
    const height = parseInt(ht) + parseInt(lht);
    const sht = hiddenDiv.clientHeight;
    const numberOfLineBreaks = sht !== height ? (sht - height) / 16 + 1 : 1;
    const setRows = numberOfLineBreaks;
    const rows = parseInt(txtComp.getAttribute("rows"));
    if (numberOfLineBreaks > 0 && numberOfLineBreaks < 5 && setRows !== rows) {
      console.log("set", setRows);
      txtComp.setAttribute("rows", setRows.toString());
    }
  }

  function handleMyMesssage(text) {
    const yourCard = document.createElement("div");
    const yourCardP = document.createElement("p");
    yourCard.className = "you";
    yourCardP.textContent = text;
    yourCard.appendChild(yourCardP);
    document.querySelector(".load-chats").appendChild(yourCard);
  }

  function handleTheirMesssage(text) {
    const theirCard = document.createElement("div");
    const theirCardP = document.createElement("p");
    theirCard.className = "other";
    theirCardP.textContent = text;
    theirCard.appendChild(theirCardP);
    document.querySelector(".load-chats").appendChild(theirCard);
  }

  socket.auth = { username };
  socket.connect();
  socket.on("user connected", (user) => {
    user.username !== username ? onlineUsers.push(user) : false;
    dispatchEvent(onlineUsersUpdated);
  });
  socket.on("users", (users) => {
    let newUsers = users.filter((user) => {
      return user.username !== username;
    });
    onlineUsers.push(...newUsers);
    dispatchEvent(onlineUsersUpdated);
  });
};

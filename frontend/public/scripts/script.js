"use strict";

import { uid } from "/uid/single/index.mjs";

window.onload = () => {
  const socket = io("/", { autoConnect: false });
  const chatContainer = document.querySelector(".chats");
  const savedUsers = JSON.parse(sessionStorage.getItem("savedUsers") || "[]");
  let chatCounter = 0;
  let chatCount = 5;
  const _username = sessionStorage.getItem("username")
    ? sessionStorage.getItem("username")
    : localStorage.getItem("username");
  var allUsers = [];
  allUsers.push(...savedUsers);
  var addedUsers = [];
  var selectedUser = {};

  // creating custom events start
  const load_cards = new Event("cardLoaded");
  const onlineUsersUpdated = new Event("onlineUsersUpdated");
  // creating custom events end

  // event handlers start

  // renders the app display differently based on screen size
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

  // handles when the list of users gets updated
  window.addEventListener("onlineUsersUpdated", () => {
    allUsers.map((user) => {
      const exits = addedUsers.some((usr) => {
        return usr.sid === user.sid;
      });
      if (!exits) {
        createCard({ username: user.username, online: true });
        addedUsers.push(user);
      }
    });
    chatContainer.dispatchEvent(load_cards);
  });

  // handles logging out of the application
  document.querySelector(".logout-btn").addEventListener("click", (e) => {
    fetch("/logout", { method: "POST", redirect: "follow" }).then(() => {
      sessionStorage.clear();
      localStorage.clear();
      location.href = "/";
    });
  });

  // this handles what happens when new chat are added to the screen
  chatContainer.addEventListener("cardLoaded", () => {
    chatContainer.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", (evt) => {
        const username = evt.currentTarget.children[1].children[0].textContent;
        openConvo(username);
        allUsers.map((user) => {
          user.username === username
            ? (selectedUser = Object.assign(
                { to: user.username, uid: user.uid, sid: user.sid },
                {}
              ))
            : false;
        });
        document.querySelector(".load-chats-cont").innerHTML = "";
        queryMessages(selectedUser.uid);
      });
    });
  });

  // handles returning back to chats list
  // only available on smaller screen
  document
    .querySelector(".arrow-back")
    .addEventListener("click", () => closeConvo());

  // handles line break while typing a message
  document.querySelector(".message-bar").addEventListener("input", () => {
    handleLineBreak();
  });

  // handles sending the message to the selected user
  document.querySelector(".sendbtn").addEventListener("click", () => {
    const messageBar = document.querySelector(".message-bar");
    const text = messageBar.value;
    if (text.match(/[^\s\r\n\t]/)) {
      const mid = uid(16);
      document.querySelector(".message-bar").value = "";
      selectedUser.message = text;
      messageBar.setAttribute("rows", "1");
      selectedUser.mid = mid;
      selectedUser.from = { _username, sid: socket.auth.sid };
      socket.emit("private message", selectedUser);
    }
    document.querySelector(".message-bar").value = "";
    messageBar.setAttribute("rows", "1");
  });

  // creating functions start

  // this func creates the chat object/element
  function createCard({
    username = "unknown",
    textDetails = "",
    time = "00:00",
    imageUrl = "./assets/images/profile/default-profile-pic_128x128.jpg",
    online,
  }) {
    const cardContainer = document.querySelector(".chats");
    const card = document.createElement("div");
    card.classList.add("card");
    const figure = document.createElement("figure");
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
    const activebar = document.createElement("div");
    activebar.className = online ? "online" : "offline";
    figure.append(...[cardImage, activebar]);
    card.append(...[figure, cardDetails, cardTime]);
    cardContainer.appendChild(card);
    chatCounter++;
    if (chatCount === chatCounter) {
      cardContainer.dispatchEvent(load_cards);
    }
  }

  // handles viewing specific conversations
  // varies depending on screen size
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
    // this code executes for smaller devices
    if (window.innerWidth < 875) {
      document.querySelector("header").classList.add("d-none");
      document.querySelector(".navbar").classList.add("d-none");
      document.querySelector(".chats").classList.add("d-none");
      document.querySelector(".conversation").classList.add("d-flex");
    }
    // the below code works for larger devices
    else {
      document.querySelector(".navbar").classList.remove("d-none");
      document.querySelector("header").classList.remove("d-none");
      document.querySelector(".arrow-back").classList.add("d-none");
    }
    document.querySelector(".cht-comp-cont").classList.remove("d-none");
  }

  // handles closing the conversation if necessary
  // applicable for smaller devices
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

  /* this function handles line break regulation when typing out a message */
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

  // handle messages sent by you
  // so this logic basically adds it to the screen
  function handleMyMesssage(text) {
    const yourCard = document.createElement("div");
    const yourCardP = document.createElement("p");
    yourCard.className = "you";
    const formatText = text.replace(/\n/g, "<br>");
    yourCardP.innerHTML = formatText;
    yourCard.appendChild(yourCardP);
    document.querySelector(".load-chats-cont").appendChild(yourCard);
  }

  // handle messages sent by the person you're chatting with
  // so this logic basically adds it to the screen
  function handleTheirMesssage(text) {
    const theirCard = document.createElement("div");
    const theirCardP = document.createElement("p");
    theirCard.className = "other";
    theirCardP.textContent = text;
    theirCard.appendChild(theirCardP);
    document.querySelector(".load-chats-cont").appendChild(theirCard);
  }

  // this function checks if a message is sent by you
  function messageFromYou(you, sender) {
    if (you.sid === sender.sid) {
      return true;
    } else {
      return false;
    }
  }

  // this func fetches the messages from the database to this app
  function queryMessages(uid) {
    fetch("/messages/" + uid + "/query-messages", {
      method: "POST",
      headers: { "Content-type": "application/json" },
    })
      .then(async (res) => {
        res = await res.json();
        const messages = res.messages || [];
        messages.map((message) => {
          message.sender
            ? handleMyMesssage(message.message)
            : handleTheirMesssage(message.message);
        });
      })
      .catch((err) => {
        console.error("Error loading your messages:", err);
      });
  }

  // this function connects your socket to the server
  async function socketConnect(socket) {
    if (!socket.connected) {
      socket.auth = { username: _username, sid: "" };
      await socket.connect();
      socket.on("error", (err) => {
        throw new Error(err);
      });
    } else {
      console.error("you already have an existing socket connection");
    }
  }

  // this function handles manual socket disconnections
  async function socketDisconnect(socket) {
    socket.connected
      ? socket.disconnect()
      : console.error("no existing socket connection");
  }

  // creating functions ends here...

  // socket.io utilization starts here
  socketConnect(socket);
  document.querySelector(".connect").addEventListener("click", () => {
    socketConnect(socket);
  });
  document.querySelector(".disconnect").addEventListener("click", () => {
    socketDisconnect(socket);
  });
  socket.on("users", (users) => {
    users.map((user) => {
      if (user.username === _username) {
        socket.auth.sid = user.sid;
        socket.online = true;
      } else {
        const exits = allUsers.some((usr) => {
          return usr.username === user.username;
        });
        if (!exits) {
          user.online = true;
          allUsers.push(user);
        }
      }
    });
    sessionStorage.setItem("savedUsers", JSON.stringify(allUsers));
    dispatchEvent(onlineUsersUpdated);
  });
  socket.on("user connected", (user) => {
    if (user.username === _username) {
      socket.auth.sid = user.sid;
      socket.online = true;
    } else {
      const exits = allUsers.some((usr) => {
        return usr.username === user.username;
      });
      if (!exits) {
        user.online = true;
        allUsers.push(user);
      } else {
        allUsers.forEach((usr) => {
          if (user.username === usr.username) {
            usr.online = true;
            chatContainer.querySelectorAll(".card").forEach((card) => {
              if (card.children[1].children[0].textContent === user.username) {
                card.children[0].children[1].className = "online";
              }
            });
          }
        });
      }
    }
    sessionStorage.setItem("savedUsers", JSON.stringify(allUsers));
    dispatchEvent(onlineUsersUpdated);
  });
  socket.on("user disconnected", (socket) => {
    console.log(`${socket.username} went offline!`);
    let disconnectedUser = allUsers.filter((user) => {
      if (socket.username === user.username) {
        user.online = false;
        return socket;
      }
    })[0];
    sessionStorage.setItem("savedUsers", JSON.stringify(allUsers));
    chatContainer.querySelectorAll(".card").forEach((card) => {
      if (
        card.children[1].children[0].textContent === disconnectedUser.username
      ) {
        card.children[0].children[1].className = "offline";
      }
    });
  });
  socket.on("new message", (selectedUser) => {
    socket.emit("new message", selectedUser);
    messageFromYou(socket.auth, selectedUser.from)
      ? handleMyMesssage(selectedUser.message)
      : handleTheirMesssage(selectedUser.message);
  });
};

// socket.io utilization ends here

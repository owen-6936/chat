document.querySelector(".logout-btn").addEventListener("click", (e) => {
  fetch("/logout", { method: "POST", redirect: "follow" }).then(() => {
    location.href = "/";
  });
});

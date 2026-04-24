const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  alert("Login realizado com sucesso!");

  window.location.replace("index.html");
});
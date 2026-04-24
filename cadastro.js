const cadastroForm = document.getElementById("cadastroForm");

cadastroForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  alert("Cadastro realizado com sucesso!");

  window.location.replace("login.html");
});
const form = document.getElementById("authForm");
const title = document.getElementById("auth-title");
const nomeField = document.getElementById("nomeField");
const nomeInput = document.getElementById("nome");
const senhaInput = document.getElementById("senha");
const senhaAjuda = document.getElementById("senhaAjuda");
const submitButton = document.getElementById("submitButton");
const notice = document.getElementById("authNotice");
const tabLogin = document.getElementById("tabLogin");
const tabCadastro = document.getElementById("tabCadastro");

function setMode(mode) {
  const cadastro = mode === "cadastro";

  title.textContent = cadastro ? "Crie sua conta" : "Que bom ter você por aqui";
  nomeField.hidden = !cadastro;
  nomeInput.required = cadastro;
  senhaInput.autocomplete = cadastro ? "new-password" : "current-password";
  senhaAjuda.hidden = !cadastro;
  submitButton.textContent = cadastro ? "Criar conta" : "Entrar";
  tabLogin.classList.toggle("is-active", !cadastro);
  tabCadastro.classList.toggle("is-active", cadastro);
  tabLogin.setAttribute("aria-pressed", String(!cadastro));
  tabCadastro.setAttribute("aria-pressed", String(cadastro));
  notice.textContent = "";
}

tabLogin.addEventListener("click", () => setMode("login"));
tabCadastro.addEventListener("click", () => setMode("cadastro"));

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) {
    return;
  }

  notice.textContent =
    "A tela está pronta, mas o acesso ainda precisa ser conectado ao sistema.";
});

setMode(new URLSearchParams(window.location.search).get("modo"));

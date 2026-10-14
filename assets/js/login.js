const form = document.getElementById("authForm") || document.getElementById("formLogin");
const notice = document.getElementById("authNotice");
const title = document.getElementById("auth-title");
const nomeField = document.getElementById("nomeField");
const nomeInput = document.getElementById("nome");
const senhaInput = document.getElementById("senha");
const senhaAjuda = document.getElementById("senhaAjuda");
const submitButton = document.getElementById("submitButton");
const tabLogin = document.getElementById("tabLogin");
const tabCadastro = document.getElementById("tabCadastro");

function setMode(mode) {
  if (!title || !nomeField || !nomeInput || !senhaInput || !senhaAjuda || !submitButton || !tabLogin || !tabCadastro) {
    return;
  }

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
  if (notice) {
    notice.textContent = "";
  }
}

if (form) {
  if (tabLogin && tabCadastro) {
    tabLogin.addEventListener("click", () => setMode("login"));
    tabCadastro.addEventListener("click", () => setMode("cadastro"));
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const emailInput = form.querySelector("#email");
    const senhaInputElement = form.querySelector("#senha");
    const nomeInputElement = form.querySelector("#nome");
    const confirmarSenhaInput = form.querySelector("#confirmarSenha");

    if (!emailInput || !senhaInputElement) {
      return;
    }

    const email = emailInput.value.trim().toLowerCase();
    const senha = senhaInputElement.value;

    const isCadastro = Boolean(nomeInputElement || confirmarSenhaInput);

    if (isCadastro) {
      const nome = nomeInputElement ? nomeInputElement.value.trim() : "";
      const confirmarSenha = confirmarSenhaInput ? confirmarSenhaInput.value : "";

      if (!nome) {
        if (notice) notice.textContent = "Informe seu nome para continuar.";
        return;
      }

      if (senha.length < 8) {
        if (notice) notice.textContent = "A senha deve ter pelo menos 8 caracteres.";
        return;
      }

      if (senha !== confirmarSenha) {
        if (notice) notice.textContent = "As senhas não coincidem.";
        return;
      }

      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
      if (usuarios.some((usuario) => usuario.email === email)) {
        if (notice) notice.textContent = "Este e-mail já está cadastrado.";
        return;
      }

      const novoUsuario = { nome, email, senha, trilhaAtiva: false };
      usuarios.push(novoUsuario);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));

      if (notice) notice.textContent = "Conta criada com sucesso!";
      window.location.href = "home.html";
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const usuarioEncontrado = usuarios.find((usuario) => usuario.email === email);

    if (!usuarioEncontrado) {
      if (notice) notice.textContent = "Nenhuma conta encontrada com este e-mail.";
      return;
    }

    if (usuarioEncontrado.senha !== senha) {
      if (notice) notice.textContent = "Senha incorreta. Tente novamente.";
      return;
    }

    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
    window.location.href = "home.html";
  });

  if (title && nomeField && nomeInput && senhaInput && senhaAjuda && submitButton && tabLogin && tabCadastro) {
    const params = new URLSearchParams(window.location.search);
    setMode(params.get("modo") === "cadastro" ? "cadastro" : "login");
  }
}

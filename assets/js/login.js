const formLogin = document.querySelector("#formLogin");

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();

  // 1. Captura as credenciais
  const email = document.querySelector("#email").value.trim().toLowerCase();
  const senha = document.querySelector("#senha").value;

  // 2. Busca a lista de contas salvas
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

  // 3. Procura o usuário cadastrado pelo e-mail
  const usuarioEncontrado = usuarios.find((u) => u.email === email);

  if (!usuarioEncontrado) {
    alert("Nenhuma conta encontrada com este e-mail.");
    return;
  }

  // 4. Valida a senha
  if (usuarioEncontrado.senha !== senha) {
    alert("Senha incorreta. Tente novamente.");
    return;
  }

  // 5. Ativa a sessão com todos os dados e estatísticas desse usuário
  localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));

  // 6. Redirecionamento inteligente:
  // Se o usuário já escolheu trilha antes, vai para a tela principal; senão, vai para a trilha
  if (usuarioEncontrado.trilhaAtiva) {
    window.location.href = "home.html";
  } else {
    window.location.href = "trilha-inicial.html";
  }
});
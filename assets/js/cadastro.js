const form = document.getElementById("authForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const senha = document.getElementById("senha").value;
  const csenha = document.getElementById("confirmarSenha").value;

  if (!nome || !email || !senha || !csenha) {
    alert("Preencha todos os campos!");
    return;
  }

  if (senha !== csenha) {
    alert("As senhas não coincidem!");
    return;
  }

  if (senha.length < 8) {
    alert("A senha deve ter pelo menos 8 caracteres.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const emailJaExiste = usuarios.some((user) => user.email === email);

  if (emailJaExiste) {
    alert("Este e-mail já está cadastrado!");
    return;
  }

  const novoUsuario = {
    nome: nome,
    email: email,
    senha: senha,
    trilhaAtiva: null,
    habitoAncora: null,

    geral: {
      tempoMin: 0,
      microAcoes: 0,
      melhorAncora: "—",
      sensacao: "—",
      diasBateriaFraca: 0,
    },

    modulos: {
      sono: { stauts: false,tempoMin: 0, microAcoes: 0, pausasMin: 0, sensacao: "—" },
      alimentacao: { stauts: false,tempoMin: 0, microAcoes: 0, pausasMin: 0, sensacao: "—" },
      saude_mental: { tstauts: false,empoMin: 0, microAcoes: 0, pausasMin: 0, sensacao: "—" },
    },
  };

  // 5. Salva na lista geral e na sessão ativa
  usuarios.push(novoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));

  // 6. Redireciona
  window.location.href = "../../pages/habito_ancora.html";
});
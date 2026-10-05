var botao = document.getElementById('botaoMeditar');
var popup = document.getElementById('popup');
var botaoFechar = document.getElementById('botaoFechar');
var botaoIniciar = document.getElementById('botaoIniciar');
var circulo = document.getElementById('circulo');
var instrucao = document.getElementById('instrucao');
var fases = [
  { nome: 'Inspire', classe: 'inspirar', seg: 4 },
  { nome: 'Segure',  classe: 'segurar',  seg: 4 },
  { nome: 'Expire',  classe: 'expirar',  seg: 6 }
];
var timer = null;
var rodando = false;
function rodarFase(i) {
  var f = fases[i % fases.length];
  circulo.className = 'circulo ' + f.classe;
  instrucao.textContent = f.nome;
  timer = setTimeout(function () {
    rodarFase(i + 1);
  }, f.seg * 1000);
}
function iniciar() {
  rodando = true;
  botaoIniciar.textContent = 'Parar';
  rodarFase(0);
}
function parar() {
  clearTimeout(timer);
  rodando = false;
  circulo.className = 'circulo';
  instrucao.textContent = 'Pronto?';
  botaoIniciar.textContent = 'Iniciar';
}
function fecharPopup() {
  popup.classList.remove('aberto');
  parar();
}
botao.addEventListener('click', function () {
  popup.classList.add('aberto');
});
botaoIniciar.addEventListener('click', function () {
  if (rodando) {
    parar();
  } else {
    iniciar();
  }
});
botaoFechar.addEventListener('click', fecharPopup);
popup.addEventListener('click', function (e) {
  if (e.target == popup) {
    fecharPopup();
  }
});
document.addEventListener('keydown', function (e) {
  if (e.key == 'Escape') {
    fecharPopup();
  }
});

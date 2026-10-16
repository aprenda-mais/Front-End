var botao = document.getElementById('botaoMeditar');
var popup = document.getElementById('popup');
var botoesFechar = document.querySelectorAll('[data-fechar]');
var botoesVoltar = document.querySelectorAll('[data-voltar]');
var botaoIniciar = document.getElementById('botaoIniciar');
var circulo = document.getElementById('circulo');
var instrucao = document.getElementById('instrucao');
var tempoRestante = document.getElementById('tempoRestante');
var etapas = {
  tempo: document.getElementById('etapaTempo'),
  som: document.getElementById('etapaSom'),
  respiracao: document.getElementById('etapaRespiracao')
};
var opcoesTempo = document.querySelectorAll('.opcao-tempo');
var opcoesSom = document.querySelectorAll('.opcao-som');
var campoVolume = document.getElementById('volume');
var sons = {
  chuva: { url: 'https://www.youtube.com/watch?v=ELY08moRqsw' },
  mar: { url: 'https://www.youtube.com/watch?v=4KlE5wN4n3E' },
  floresta: { url: 'https://www.youtube.com/watch?v=osE7bpaO6R4' },
  melodia: { url: 'https://www.youtube.com/watch?v=7hQq7pu-7DY' }
};
var minutosEscolhidos = 2;
var somEscolhido = 'chuva';
var volumeAtual = 50;
var fases = [
  { nome: 'Inspire', classe: 'inspirar', seg: 4 },
  { nome: 'Segure', classe: 'segurar', seg: 4 },
  { nome: 'Expire', classe: 'expirar', seg: 6 }
];
var timer = null;
var contador = null;
var segundosRestantes = 0;
var rodando = false;
var playerYoutube = null;
var apiYoutubePronta = false;

function mostrarEtapa(nome) {
  if (!etapas) return;
  for (var chave in etapas) {
    if (etapas[chave]) {
      etapas[chave].classList.toggle('ativa', chave == nome);
    }
  }
}

function selecionar(lista, escolhido) {
  for (var i = 0; i < lista.length; i++) {
    var marcado = lista[i] == escolhido;
    lista[i].classList.toggle('selecionado', marcado);
    lista[i].setAttribute('aria-checked', marcado ? 'true' : 'false');
  }
}

function formatarTempo(seg) {
  var m = Math.floor(seg / 60);
  var s = seg % 60;
  return m + ':' + (s < 10 ? '0' : '') + s;
}

function atualizarTempo() {
  segundosRestantes = minutosEscolhidos * 60;
  if (tempoRestante) {
    tempoRestante.textContent = formatarTempo(segundosRestantes);
  }
}

function atualizarPreenchimentoVolume() {
  if (campoVolume) {
    campoVolume.style.setProperty('--preenchimento', campoVolume.value + '%');
  }
}

function extrairIdYoutube(url) {
  var achou = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return achou ? achou[1] : '';
}

function carregarApiYoutube(depois) {
  if (apiYoutubePronta) {
    depois();
    return;
  }

  window.onYouTubeIframeAPIReady = function () {
    apiYoutubePronta = true;
    depois();
  };

  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

function tocarSom() {
  if (!sons || !somEscolhido || !sons[somEscolhido]) return;

  var id = extrairIdYoutube(sons[somEscolhido].url);
  if (!id) return;

  carregarApiYoutube(function () {
    if (!rodando || !window.YT) return;

    if (playerYoutube) {
      playerYoutube.setVolume(volumeAtual);
      playerYoutube.loadVideoById(id);
      return;
    }

    playerYoutube = new YT.Player('playerYoutube', {
      width: '1',
      height: '1',
      videoId: id,
      playerVars: { autoplay: 1, controls: 0, loop: 1, playlist: id },
      events: {
        onReady: function (e) {
          e.target.setVolume(volumeAtual);
          e.target.playVideo();
        }
      }
    });
  });
}

function pararSom() {
  if (playerYoutube && playerYoutube.stopVideo) {
    playerYoutube.stopVideo();
  }
}

function rodarFase(i) {
  var f = fases[i % fases.length];
  if (circulo) {
    circulo.className = 'circulo ' + f.classe;
  }
  if (instrucao) {
    instrucao.textContent = f.nome;
  }
  timer = setTimeout(function () {
    rodarFase(i + 1);
  }, f.seg * 1000);
}

function iniciar() {
  rodando = true;
  if (botaoIniciar) {
    botaoIniciar.textContent = 'Parar';
  }
  atualizarTempo();
  rodarFase(0);
  tocarSom();

  contador = setInterval(function () {
    segundosRestantes--;
    if (tempoRestante) {
      tempoRestante.textContent = formatarTempo(segundosRestantes);
    }
    if (segundosRestantes <= 0) {
      parar();
      if (instrucao) {
        instrucao.textContent = 'Concluído!';
      }
    }
  }, 1000);
}

function parar() {
  clearTimeout(timer);
  clearInterval(contador);
  rodando = false;
  if (circulo) {
    circulo.className = 'circulo';
  }
  if (instrucao) {
    instrucao.textContent = 'Pronto?';
  }
  if (botaoIniciar) {
    botaoIniciar.textContent = 'Iniciar';
  }
  atualizarTempo();
  pararSom();
}

function fecharPopup() {
  if (popup) {
    popup.classList.remove('aberto');
  }
  parar();
  mostrarEtapa('tempo');
}

if (botao && popup && botaoIniciar && circulo && instrucao) {
  botao.addEventListener('click', function () {
    mostrarEtapa('tempo');
    popup.classList.add('aberto');
  });

  botaoIniciar.addEventListener('click', function () {
    if (rodando) {
      parar();
    } else {
      iniciar();
    }
  });
}

if (botoesFechar && botoesFechar.length) {
  for (var i = 0; i < botoesFechar.length; i++) {
    botoesFechar[i].addEventListener('click', fecharPopup);
  }
}

if (botoesVoltar && botoesVoltar.length) {
  for (var j = 0; j < botoesVoltar.length; j++) {
    botoesVoltar[j].addEventListener('click', function () {
      parar();
      mostrarEtapa(this.getAttribute('data-voltar'));
    });
  }
}

if (popup) {
  popup.addEventListener('click', function (e) {
    if (e.target == popup) {
      fecharPopup();
    }
  });
}

if (document.getElementById('prosseguirTempo')) {
  document.getElementById('prosseguirTempo').addEventListener('click', function () {
    mostrarEtapa('som');
  });
}

if (document.getElementById('prosseguirSom')) {
  document.getElementById('prosseguirSom').addEventListener('click', function () {
    atualizarTempo();
    mostrarEtapa('respiracao');
  });
}

if (opcoesTempo && opcoesTempo.length) {
  for (var k = 0; k < opcoesTempo.length; k++) {
    opcoesTempo[k].addEventListener('click', function () {
      minutosEscolhidos = Number(this.getAttribute('data-minutos'));
      selecionar(opcoesTempo, this);
      atualizarTempo();
    });
  }
}

if (opcoesSom && opcoesSom.length) {
  for (var l = 0; l < opcoesSom.length; l++) {
    opcoesSom[l].addEventListener('click', function () {
      somEscolhido = this.getAttribute('data-som');
      selecionar(opcoesSom, this);
    });
  }
}

if (campoVolume) {
  campoVolume.addEventListener('input', function () {
    volumeAtual = Number(campoVolume.value);
    atualizarPreenchimentoVolume();
    if (playerYoutube && playerYoutube.setVolume) {
      playerYoutube.setVolume(volumeAtual);
    }
  });
}

document.addEventListener('keydown', function (e) {
  if (e.key == 'Escape') {
    fecharPopup();
  }
});

atualizarTempo();
atualizarPreenchimentoVolume();

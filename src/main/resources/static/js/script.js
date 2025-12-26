// ===============================
// CONFIGURAÇÕES (ESTADO VISUAL)
// ===============================
const REQUIRED_TIME = 30;
let elapsedTime = 0;
let timerInterval = null;
let isNumberRevealed = false;
let luckyNumber = null;
let player = null;

// ===============================
// ELEMENTOS DOM
// ===============================
let timerDisplay = null;
let timerMessage = null;
let luckyNumberDisplay = null;
let timerSection = null;

// ===============================
// UTILITÁRIOS VISUAIS
// ===============================
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

function normalizeNumbers(numbers) {
  // garante número, remove duplicados
  return [...new Set(numbers.map(n => Number(n)))];
}

function formatNumber(n) {
  return n.toString().padStart(2, "0");
}




// ===============================
// TIMER (APENAS VISUAL)
// ===============================
function updateTimer() {
  timerDisplay.textContent = formatTime(elapsedTime);

  if (elapsedTime < REQUIRED_TIME) {
    timerMessage.textContent =
      `Faltam ${formatTime(REQUIRED_TIME - elapsedTime)} para revelar`;
  } else if (!isNumberRevealed) {
    revealLuckyNumber();
  }
}

function startTimer() {
  if (timerInterval || isNumberRevealed) return;

  timerInterval = setInterval(() => {
    elapsedTime++;
    updateTimer();

    if (elapsedTime >= REQUIRED_TIME) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }, 1000);
}

function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// ===============================
// API – STATUS DO NÚMERO
// ===============================
async function checkLuckyNumberStatus() {
  try {
    const res = await fetch("/api/lucky-number/status");
    if (!res.ok) throw new Error();

    const data = await res.json();

    if (data.alreadyGenerated) {
      isNumberRevealed = true;

      luckyNumber = normalizeNumbers(data.numbers);

      renderNumbers(luckyNumber);

      timerSection.classList.add("success");
      timerMessage.textContent = "✅ Número já gerado";
      timerDisplay.textContent = "00:00";

      return true;
    }

  } catch {
    console.warn("Não foi possível verificar status do número");
  }

  return false;
}


function renderNumbers(numbers) {
  luckyNumberDisplay.innerHTML = "";

  numbers.forEach((num) => {
    const span = document.createElement("span");
    span.textContent = formatNumber(num); // 👈 sempre 01, 02...
    luckyNumberDisplay.appendChild(span);
  });
}


// ===============================
// API – GERAR NÚMEROS
// ===============================
async function revealLuckyNumber() {
  isNumberRevealed = true;
  luckyNumberDisplay.classList.add("locked");

  try {
    const res = await fetch("/api/generate-numbers");

    // 👇 lê a resposta mesmo quando é erro
    const data = await res.json();

    if (!res.ok) {
      // usa a mensagem do backend
      throw new Error(data.message || "Erro ao gerar os números");
    }

    luckyNumber = normalizeNumbers(data.numeros);
    renderNumbers(luckyNumber);

    luckyNumberDisplay.classList.remove("locked");
    timerMessage.textContent = "🎉 Boa sorte!";

  } catch (err) {
    console.error(err);
    alert(err.message); // 👈 agora mostra "O Sorteio já começou"
    isNumberRevealed = false;
  }
}



// ===============================
// YOUTUBE API
// ===============================
function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtube-player", {
    events: {
      onStateChange: onPlayerStateChange,
    },
  });
}

window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

function onPlayerStateChange(event) {
  if (isNumberRevealed) return;

  if (event.data === YT.PlayerState.PLAYING) {
    startTimer();
  }

  if (
    event.data === YT.PlayerState.PAUSED ||
    event.data === YT.PlayerState.ENDED
  ) {
    pauseTimer();
  }
}

function loadYouTubeAPI() {
  if (window.YT && window.YT.Player) {
    onYouTubeIframeAPIReady();
    return;
  }

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);
}

// ===============================
// INICIALIZAÇÃO
// ===============================
window.addEventListener("load", async () => {
  timerDisplay = document.getElementById("timer");
  timerMessage = document.getElementById("timer-message");
  luckyNumberDisplay = document.getElementById("lucky-number");
  timerSection = document.querySelector(".timer-section");

  timerDisplay.textContent = "00:00";

  const alreadyGenerated = await checkLuckyNumberStatus();
  if (alreadyGenerated) return;

  loadYouTubeAPI();

  timerMessage.textContent =
    "▶️ Clique no play do vídeo para iniciar a contagem";
});

// ===============================
// CONTROLE DE VISIBILIDADE (ANTI-ABUSO VISUAL)
// ===============================
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pauseTimer();
  } else if (
    player &&
    typeof player.getPlayerState === "function" &&
    player.getPlayerState() === YT.PlayerState.PLAYING
  ) {
    startTimer();
  }
});

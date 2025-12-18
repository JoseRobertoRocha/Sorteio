// ===============================
// Página de Resultado (BACKEND)
// ===============================

let currentNumbers = [];

// ===============================
// Buscar números do backend
// ===============================
async function fetchNumbers() {
    try {
        const response = await fetch("/admin/api/numbers", {
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar números");
        }

        const data = await response.json();
        const numbers = data.numbers || [];

        // Só atualiza se mudou
        if (!arraysEqual(numbers, currentNumbers)) {
            currentNumbers = numbers;
            renderNumeros();
            renderHistorico();
        }

    } catch (error) {
        console.error("Erro ao buscar números:", error);
    }
}

// ===============================
// Renderizar números sorteados
// ===============================
function renderNumeros() {
    const grid = document.getElementById("numeros-grid");
    if (!grid) return;

    if (currentNumbers.length === 0) {
        grid.innerHTML = `<p class="empty-state">Aguardando números...</p>`;
        return;
    }

    const sorted = [...currentNumbers].sort((a, b) => a - b);

    grid.innerHTML = sorted
        .map(num => `<div class="numero-ball">${num}</div>`)
        .join("");
}

// ===============================
// Histórico (usa os próprios números)
// ===============================
function renderHistorico() {
    const list = document.getElementById("historico-list");
    if (!list) return;

    if (currentNumbers.length === 0) {
        list.innerHTML = `<p class="empty-state">Nenhum número sorteado ainda</p>`;
        return;
    }

    const reversed = [...currentNumbers].reverse();

    list.innerHTML = reversed
        .map(num => `<div class="historico-numero">${num}</div>`)
        .join("");
}

// ===============================
// Utilitário
// ===============================
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    return [...a].sort().every((v, i) => v === [...b].sort()[i]);
}

// ===============================
// Inicialização
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    console.log("Resultado carregado");

    // Buscar imediatamente
    fetchNumbers();

    // 🔁 Atualizar a cada 5 segundos
    setInterval(fetchNumbers, 5000);
});

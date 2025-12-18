// =======================================
// Painel Administrativo
// =======================================

let users = [];
let drawnNumbers = [];
let userResponse = {};
let isWinner = false;

// ===============================
// API
// ===============================
const API = {
    NUMBERS: "/admin/api/numbers",
    USERS: "/admin/api/users"
};

// ===============================
// NUMBERS
// ===============================
async function fetchNumbers() {
    try {
        const res = await fetch(API.NUMBERS);
        const data = await res.json();

        drawnNumbers = data.numbers || [];
        userResponse = data.userResponse || {};
        isWinner = data.iswinner === true;

        renderDrawnNumbers();
        renderWinner();
        renderUserResponses();
        updateStats();

    } catch (e) {
        console.error("Erro ao buscar números", e);
    }
}

async function addDrawnNumber() {
    const input = document.getElementById("draw-number-input");
    const value = Number(input.value);

    if (isNaN(value) || value < 0 || value > 99) {
        Notify.warning("Digite um número entre 00 e 99");
        return;
    }

    const updated = [...drawnNumbers, value];

    await fetch(API.NUMBERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numbers: updated })
    });

    input.value = "";
}

// ===============================
// RENDER NUMBERS
// ===============================
function renderDrawnNumbers() {
    const el = document.getElementById("drawn-numbers-display");

    if (!drawnNumbers.length) {
        el.innerHTML = `<p class="empty-drawn">Nenhum número sorteado ainda</p>`;
        return;
    }

    el.innerHTML = drawnNumbers
        .map(n => `<span class="drawn-ball">${String(n).padStart(2, "0")}</span>`)
        .join("");
}

// ===============================
// WINNER
// ===============================
function renderWinner() {
    const el = document.getElementById("winner-display");

    if (!isWinner || Object.keys(userResponse).length === 0) {
        el.innerHTML = `<p class="no-winner">Aguardando ganhador...</p>`;
        return;
    }

    el.innerHTML = Object.entries(userResponse).map(([userId, numbers]) => `
        <div class="winner-card">
            <h3>🏆 Ganhador</h3>
            <p><strong>ID:</strong> ${userId}</p>
            <div class="winner-numbers">
                ${numbers.map(n => `<span class="drawn-ball">${String(n).padStart(2, "0")}</span>`).join("")}
            </div>
        </div>
    `).join("");
}

// ===============================
// USER RESPONSES
// ===============================
function renderUserResponses() {
    const grid = document.getElementById("numbers-grid");

    if (!Object.keys(userResponse).length) {
        grid.innerHTML = `
            <div class="empty-state">
                <p>Nenhum número revelado ainda</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = Object.entries(userResponse).map(([userId, numbers]) => `
        <div class="user-numbers-card">
            <h4>👤 ${userId}</h4>
            <div class="numbers">
                ${numbers.map(n => `<span class="drawn-ball">${String(n).padStart(2, "0")}</span>`).join("")}
            </div>
        </div>
    `).join("");
}

// ===============================
// USERS
// ===============================
async function fetchUsers() {
    try {
        const res = await fetch(API.USERS);
        const page = await res.json();
        users = page.content || [];
        renderUsers();
        updateStats();
    } catch (e) {
        console.error("Erro ao buscar usuários", e);
    }
}

function renderUsers() {
    const tbody = document.getElementById("users-tbody");

    if (!users.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <p>Nenhum usuário cadastrado ainda</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = users.map(u => `
        <tr>
            <td><strong>${u.name}</strong></td>
            <td>${u.email}</td>
            <td>${u.phone}</td>
            <td>${u.pix}</td>
            <td>${(u.luckyNumbers || []).join(" ")}</td>
            <td>${u.online ? "Online" : "Offline"}</td>
            <td>${u.createdAt}</td>
        </tr>
    `).join("");
}

// ===============================
// STATS
// ===============================
function updateStats() {
    document.getElementById("total-users").textContent = users.length;
    document.getElementById("total-numbers").textContent = drawnNumbers.length;

    const online = users.filter(u => u.online).length;
    document.getElementById("online-users").textContent = online;

    document.getElementById("waiting-users").textContent =
        users.length - Object.keys(userResponse).length;
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    fetchNumbers();
    fetchUsers();

    setInterval(() => {
        fetchNumbers();
        fetchUsers();
    }, 5000);
});

/**************************************
 * ESTADO GLOBAL
 **************************************/
let users = [];
let onlineEmails = new Set();

/**************************************
 * WEBSOCKET - STATUS ONLINE
 **************************************/
const socket = new SockJS("/ws");
const stompClient = Stomp.over(socket);

// evita logs excessivos
stompClient.debug = null;

stompClient.connect({}, () => {
    console.log("Admin conectado ao WebSocket");

    stompClient.subscribe("/topic/online-status", (msg) => {
        const emails = JSON.parse(msg.body || "[]");
        onlineEmails = new Set(emails);

        // atualiza status local
        users = users.map(u => ({
            ...u,
            status: onlineEmails.has(u.email) ? "online" : "offline"
        }));

        renderStats(users);
        renderUsers(users);
    });
});

/**************************************
 * UTILIDADES
 **************************************/
function setLoading(message) {
    const tbody = document.getElementById("users-tbody");
    if (!tbody) return;
    tbody.innerHTML = `<tr class="empty"><td colspan="8">${message}</td></tr>`;
}

function formatDate(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

function formatRelative(dateStr) {
    if (!dateStr) return "Nunca";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Nunca";

    const diff = Date.now() - d.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "agora";
    if (minutes === 1) return "há 1 minuto";
    if (minutes < 60) return `há ${minutes} minutos`;

    const hours = Math.floor(minutes / 60);
    if (hours === 1) return "há 1 hora";
    if (hours < 24) return `há ${hours} horas`;

    const days = Math.floor(hours / 24);
    if (days === 1) return "há 1 dia";
    return `há ${days} dias`;
}

/**************************************
 * RENDERIZAÇÃO
 **************************************/
function renderStats(list) {
    const totalEl = document.getElementById("stat-total");
    const onlineEl = document.getElementById("stat-online");
    const offlineEl = document.getElementById("stat-offline");

    const onlineCount = list.filter(u => u.status === "online").length;

    if (totalEl) totalEl.textContent = list.length;
    if (onlineEl) onlineEl.textContent = onlineCount;
    if (offlineEl) offlineEl.textContent = list.length - onlineCount;
}

function renderUsers(list) {
    const tbody = document.getElementById("users-tbody");
    if (!tbody) return;

    if (!list.length) {
        tbody.innerHTML = `<tr class="empty"><td colspan="8">Nenhum usuário encontrado</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(user => {
        const status = user.status === "online" ? "online" : "offline";
        const numbers = Array.isArray(user.luckyNumber) ? user.luckyNumber : [];

        const badges = numbers.length
            ? numbers.map(n => `<span class="badge">${String(n).padStart(2, "0")}</span>`).join("")
            : `<span class="badge">--</span>`;

        return `
            <tr>
                <td>${user.name || "-"}</td>
                <td>${user.email || "-"}</td>
                <td>${user.phone || "-"}</td>
                <td>${user.pix || "-"}</td>
                <td><div class="badge-list">${badges}</div></td>
                <td>
                    <span class="status-dot ${status}">
                        ${status === "online" ? "Online" : "Offline"}
                    </span>
                </td>
                <td>${formatRelative(user.lastOnline)}</td>
                <td>${formatDate(user.createdAt)}</td>
            </tr>
        `;
    }).join("");
}

/**************************************
 * API
 **************************************/
async function loadUsers() {
    setLoading("Carregando usuários...");
    try {
        const resp = await fetch("/admin/api/users");
        if (!resp.ok) throw new Error("Erro ao buscar usuários");

        const page = await resp.json();
        const content = Array.isArray(page.content) ? page.content : [];

        users = content.map(u => ({
            ...u,
            status: onlineEmails.has(u.email) ? "online" : "offline"
        }));

    

        renderStats(users);
        renderUsers(users);
    } catch (err) {
        console.error(err);
        setLoading("Não foi possível carregar os usuários.");
    }
}

/**************************************
 * BUSCA
 **************************************/
function setupSearch() {
    const input = document.getElementById("search-input");
    if (!input) return;

    input.addEventListener("input", () => {
        const term = input.value.toLowerCase().trim();

        if (!term) {
            renderStats(users);
            renderUsers(users);
            return;
        }

        const filtered = users.filter(u => {
            const fields = [u.name, u.email, u.phone, u.pix]
                .map(v => (v || "").toLowerCase());

            return fields.some(f => f.includes(term)) ||
                (Array.isArray(u.luckyNumber) && u.luckyNumber.join(" ").includes(term));
        });

        renderStats(filtered);
        renderUsers(filtered);
    });
}

/**************************************
 * REFRESH
 **************************************/
function setupRefresh() {
    const btn = document.getElementById("refresh-btn");
    if (!btn) return;
    btn.addEventListener("click", loadUsers);
}

/**************************************
 * INIT
 **************************************/
window.addEventListener("DOMContentLoaded", () => {
    setupSearch();
    setupRefresh();
    loadUsers();
});

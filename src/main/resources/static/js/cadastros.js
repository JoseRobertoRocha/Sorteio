// Página de cadastros - consome API para listar usuários
let users = [];

function setLoading(message) {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;
    tbody.innerHTML = `<tr class="empty"><td colspan="8">${message}</td></tr>`;
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

function formatRelative(dateStr) {
    if (!dateStr) return 'Nunca';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return 'Nunca';
    const diff = Date.now() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'agora';
    if (minutes === 1) return 'há 1 minuto';
    if (minutes < 60) return `há ${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return 'há 1 hora';
    if (hours < 24) return `há ${hours} horas`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'há 1 dia';
    return `há ${days} dias`;
}

function renderStats(list) {
    const totalEl = document.getElementById('stat-total');
    const onlineEl = document.getElementById('stat-online');
    const offlineEl = document.getElementById('stat-offline');
    const onlineCount = list.filter(u => u.status === 'online').length;
    if (totalEl) totalEl.textContent = list.length;
    if (onlineEl) onlineEl.textContent = onlineCount;
    if (offlineEl) offlineEl.textContent = Math.max(0, list.length - onlineCount);
}

function renderUsers(list) {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;

    if (!list.length) {
        tbody.innerHTML = '<tr class="empty"><td colspan="8">Nenhum usuário encontrado</td></tr>';
        return;
    }

    const rows = list.map(user => {
        const status = (user.status || '').toLowerCase() === 'online' ? 'online' : 'offline';
        const numbers = Array.isArray(user.luckyNumber) ? user.luckyNumber : [];
        const badgeNumbers = numbers.map(n => `<span class="badge">${String(n).padStart(2, '0')}</span>`).join('');
        return `
            <tr>
                <td>${user.name || '-'}</td>
                <td>${user.email || '-'}</td>
                <td>${user.phone || '-'}</td>
                <td>${user.pix || '-'}</td>
                <td><div class="badge-list">${badgeNumbers || '<span class="badge">--</span>'}</div></td>
                <td><span class="status-dot ${status}">${status === 'online' ? 'Online' : 'Offline'}</span></td>
                <td>${formatRelative(user.lastOnline)}</td>
                <td>${formatDate(user.createdAt)}</td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = rows;
}

async function loadUsers() {
    setLoading('Carregando usuários...');
    try {
        const resp = await fetch('/api/users');
        if (!resp.ok) throw new Error('Falha ao buscar usuários');
        const data = await resp.json();
        users = Array.isArray(data) ? data : [];
        renderStats(users);
        renderUsers(users);
    } catch (err) {
        console.error(err);
        setLoading('Não foi possível carregar os usuários. Tente novamente.');
    }
}

function setupSearch() {
    const input = document.getElementById('search-input');
    if (!input) return;
    input.addEventListener('input', () => {
        const term = input.value.toLowerCase().trim();
        if (!term) {
            renderUsers(users);
            renderStats(users);
            return;
        }
        const filtered = users.filter(u => {
            const fields = [u.name, u.email, u.phone, u.pix].map(v => (v || '').toLowerCase());
            return fields.some(f => f.includes(term)) || (Array.isArray(u.luckyNumber) && u.luckyNumber.join(' ').includes(term));
        });
        renderStats(filtered);
        renderUsers(filtered);
    });
}

function setupRefresh() {
    const btn = document.getElementById('refresh-btn');
    if (!btn) return;
    btn.addEventListener('click', loadUsers);
}

window.addEventListener('DOMContentLoaded', () => {
    setupSearch();
    setupRefresh();
    loadUsers();
});

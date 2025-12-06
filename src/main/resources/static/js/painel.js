// Painel Administrativo - Sistema de Sorteio com 10 Dezenas
let drawnNumbers = [];
let winner = null;
let allUsers = [];
let luckyNumbers = [];

// ========================================
// FUNÇÕES DE SORTEIO
// ========================================

// Carregar números já sorteados do localStorage
function loadDrawnNumbers() {
    const stored = localStorage.getItem('natalDaSorteDrawn');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            const normalized = Array.isArray(parsed)
                ? parsed.map(n => String(n).padStart(2, '0'))
                : [];
            // Evitar duplicados e garantir sempre strings com 2 dígitos
            drawnNumbers = Array.from(new Set(normalized));
            // Persistir normalizado para manter consistência entre abas
            localStorage.setItem('natalDaSorteDrawn', JSON.stringify(drawnNumbers));
            updateDrawnNumbersDisplay();
            checkForWinner();
        } catch (e) {
            drawnNumbers = [];
        }
    }
}

// Salvar números sorteados no localStorage
function saveDrawnNumbers() {
    localStorage.setItem('natalDaSorteDrawn', JSON.stringify(drawnNumbers));
    // Disparar evento para notificar usuários
    localStorage.setItem('natalDaSorteTrigger', Date.now().toString());
}

// Adicionar número sorteado
function addDrawnNumber() {
    const input = document.getElementById('draw-number-input');
    const number = input.value.trim().padStart(2, '0');
    
    if (!number) {
        alert('Digite um número válido de 00 a 99');
        return;
    }
    
    const num = parseInt(number);
    if (num < 0 || num > 99) {
        alert('Digite um número entre 00 e 99');
        return;
    }
    
    if (drawnNumbers.includes(number)) {
        alert('Este número já foi sorteado!');
        return;
    }
    
    drawnNumbers.push(number);
    saveDrawnNumbers();
    updateDrawnNumbersDisplay();
    checkForWinner();
    
    input.value = '';
    input.focus();
}

// Remover número sorteado individual
function removeDrawnNumber(numberToRemove) {
    const target = String(numberToRemove).padStart(2, '0');
    if (!confirm(`Tem certeza que deseja remover o número ${target}?`)) {
        return;
    }
    
    drawnNumbers = drawnNumbers.filter(num => num !== target);
    saveDrawnNumbers();
    updateDrawnNumbersDisplay();
    checkForWinner();
}

// Exibir números sorteados
function updateDrawnNumbersDisplay() {
    const container = document.getElementById('drawn-numbers-display');
    if (!container) return;
    
    if (drawnNumbers.length === 0) {
        container.innerHTML = '<p class="empty-drawn">Nenhum número sorteado ainda</p>';
        return;
    }
    
    container.innerHTML = drawnNumbers.map(num => `<div class="drawn-ball-wrapper"><span class="drawn-ball">${num}</span><button class="remove-btn" onclick="removeDrawnNumber('${num}')" title="Remover este número">×</button></div>`).join('');
}

// Verificar se há ganhador
function checkForWinner() {
    if (drawnNumbers.length === 0) {
        winner = null;
        updateWinnerDisplay();
        return;
    }
    
    const users = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('user_')) {
            try {
                const userData = JSON.parse(localStorage.getItem(key));
                if (userData.luckyNumber && Array.isArray(userData.luckyNumber)) {
                    users.push(userData);
                }
            } catch (e) {}
        }
    }
    
    // Verificar quantos números cada usuário acertou
    users.forEach(user => {
        const matches = user.luckyNumber.filter(dezena => drawnNumbers.includes(dezena));
        user.matchCount = matches.length;
    });
    
    // Encontrar usuário com mais acertos
    const maxMatches = Math.max(...users.map(u => u.matchCount || 0));
    
    if (maxMatches === 10) {
        // Ganhador encontrado (10 dezenas)
        const winners = users.filter(u => u.matchCount === 10);
        winner = winners[0]; // Primeiro a bater
        localStorage.setItem('natalDaSorteWinner', JSON.stringify(winner));
        updateWinnerDisplay();
    } else {
        winner = null;
        localStorage.removeItem('natalDaSorteWinner');
        updateWinnerDisplay();
    }
}

// Exibir ganhador
function updateWinnerDisplay() {
    const container = document.getElementById('winner-display');
    if (!container) return;
    
    if (!winner) {
        container.innerHTML = '<p class="no-winner">Aguardando ganhador...</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="winner-card">
            <div class="winner-icon">🏆</div>
            <h3>Ganhador Encontrado!</h3>
            <p><strong>Nome:</strong> ${winner.name || '-'}</p>
            <p><strong>E-mail:</strong> ${winner.email || '-'}</p>
            <p><strong>Telefone:</strong> ${winner.phone || '-'}</p>
            <p><strong>Chave PIX:</strong> ${winner.pix || '-'}</p>
            <div class="winner-numbers">
                ${winner.luckyNumber.map(n => `<span class="dezena matched">${n}</span>`).join('')}
            </div>
        </div>
    `;
}

// Limpar sorteio
function clearDraw() {
    if (!confirm('Tem certeza que deseja limpar o sorteio? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    drawnNumbers = [];
    winner = null;
    localStorage.removeItem('natalDaSorteDrawn');
    localStorage.removeItem('natalDaSorteWinner');
    localStorage.removeItem('natalDaSorteHistorico');
    localStorage.setItem('natalDaSorteTrigger', Date.now().toString());
    
    updateDrawnNumbersDisplay();
    updateWinnerDisplay();
}

// ========================================
// FUNÇÕES DE GERENCIAMENTO DE USUÁRIOS
// ========================================

// Carregar dados do localStorage
function loadData() {
    loadUsers();
    loadLuckyNumbers();
    updateStats();
}

// Carregar usuários
function loadUsers() {
    const users = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('user_')) {
            try {
                const userData = JSON.parse(localStorage.getItem(key));
                userData.id = key;
                users.push(userData);
            } catch (e) {
                console.error('Erro ao carregar usuário:', e);
            }
        }
    }

    allUsers = users;
    displayUsers(users);
}

// Exibir usuários na tabela
function displayUsers(users) {
    const tbody = document.getElementById('users-tbody');
    
    if (!tbody) {
        console.warn('Elemento users-tbody não encontrado');
        return;
    }
    
    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <p>Nenhum usuário cadastrado ainda</p>
                </td>
            </tr>
        `;
        return;
    }

    const now = new Date();
    tbody.innerHTML = users.map(user => {
        const hasNumber = user.luckyNumber && user.luckyNumber !== '0000';
        const status = hasNumber ? 'active' : 'waiting';
        const statusText = hasNumber ? 'Número Revelado' : 'Aguardando';
        const timestamp = user.timestamp ? new Date(user.timestamp).toLocaleString('pt-BR') : '-';
        
        // Verificar se está online: precisa da flag e ao menos 1 sessão ativa
        const uid = (user.email || '').replace(/[^a-zA-Z0-9]/g, '_');
        const sessions = parseInt(localStorage.getItem('activeSessions_user_' + uid) || '0', 10) || 0;
        const isOnline = (user.status_online === 'online') && sessions > 0;
        const onlineStatus = isOnline ? 'online' : 'offline';
        const onlineText = isOnline ? 'Online' : 'Offline';
        
        // Formatar número da sorte (array de 10 dezenas)
        let displayNumber = '-';
        if (user.luckyNumber) {
            if (Array.isArray(user.luckyNumber)) {
                // Formatar em grupos de 5 para melhor legibilidade
                const formatted = [];
                for (let i = 0; i < user.luckyNumber.length; i += 5) {
                    formatted.push(user.luckyNumber.slice(i, i + 5).join(' '));
                }
                displayNumber = formatted.join('<br>');
            } else {
                displayNumber = user.luckyNumber;
            }
        }

        return `
            <tr>
                <td><strong>${user.name || '-'}</strong></td>
                <td>${user.email || '-'}</td>
                <td>${user.phone || '-'}</td>
                <td>${user.pix || '-'}</td>
                <td><strong style="color: #c41e3a; font-size: 12px; line-height: 1.8;">${displayNumber}</strong></td>
                <td><span class="badge ${status}">${statusText}</span></td>
                <td>
                    <span class="status-indicator ${onlineStatus}">
                        <span class="status-dot ${onlineStatus}"></span>
                        ${onlineText}
                    </span>
                </td>
                <td style="white-space: nowrap;">${timestamp}</td>
            </tr>
        `;
    }).join('');
}

// Carregar números da sorte
function loadLuckyNumbers() {
    const numbers = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('luckyNumber_')) {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                numbers.push(data);
            } catch (e) {
                console.error('Erro ao carregar número:', e);
            }
        }
    }

    luckyNumbers = numbers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    displayLuckyNumbers(numbers);
}

// Exibir números da sorte
function displayLuckyNumbers(numbers) {
    const grid = document.getElementById('numbers-grid');
    
    if (!grid) {
        console.warn('Elemento numbers-grid não encontrado');
        return;
    }
    
    if (numbers.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <p>Nenhum número revelado ainda</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = numbers.map(item => {
        const date = new Date(item.timestamp).toLocaleString('pt-BR');
        
        // Formatar número (array de 10 dezenas)
        let displayNumber = '-';
        if (item.number) {
            if (Array.isArray(item.number)) {
                displayNumber = item.number.join(' ');
            } else {
                displayNumber = item.number;
            }
        }
        
        return `
            <div class="number-card">
                <div class="lucky-number">${displayNumber}</div>
                <div class="user-name">${item.userName}</div>
                <div class="timestamp">${date}</div>
            </div>
        `;
    }).join('');
}

// Atualizar estatísticas
function updateStats() {
    const now = new Date();
    const totalUsers = allUsers.length;
    const usersWithNumbers = allUsers.filter(u => u.luckyNumber && u.luckyNumber !== '0000').length;
    const waitingUsers = totalUsers - usersWithNumbers;
    
    // Contar usuários online pela flag e sessões ativas
    const onlineUsers = allUsers.filter(u => {
        const uid = (u.email || '').replace(/[^a-zA-Z0-9]/g, '_');
        const sessions = parseInt(localStorage.getItem('activeSessions_user_' + uid) || '0', 10) || 0;
        return u.status_online === 'online' && sessions > 0;
    }).length;

    const totalUsersEl = document.getElementById('total-users');
    const onlineUsersEl = document.getElementById('online-users');
    const totalNumbersEl = document.getElementById('total-numbers');
    const waitingUsersEl = document.getElementById('waiting-users');
    
    if (totalUsersEl) totalUsersEl.textContent = totalUsers;
    if (onlineUsersEl) onlineUsersEl.textContent = onlineUsers;
    if (totalNumbersEl) totalNumbersEl.textContent = usersWithNumbers;
    if (waitingUsersEl) waitingUsersEl.textContent = waitingUsers;
}

// Alternância de abas no painel
function setupTabs() {
    const links = document.querySelectorAll('.tab-link');
    if (!links.length) return;

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            if (!targetId) return;

            document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(content => {
                if (content.id === targetId) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
}

// Menu superior: atalhos para abas
function setupTopNav() {
    const inicioLink = document.querySelector('.top-nav__link[data-nav="inicio"]');
    const cadastrosLink = document.querySelector('.top-nav__link[data-nav="cadastros"]');

    if (inicioLink) {
        inicioLink.addEventListener('click', (e) => {
            e.preventDefault();
            const firstTab = document.querySelector('.tab-link[data-target="tab-painel"]');
            if (firstTab) firstTab.click();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (cadastrosLink) {
        cadastrosLink.addEventListener('click', (e) => {
            e.preventDefault();
            const usersTab = document.querySelector('.tab-link[data-target="tab-usuarios"]');
            if (usersTab) usersTab.click();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ========================================
// FUNÇÕES DE AUTENTICAÇÃO
// ========================================

// Sistema de autenticação
function checkAuth() {
    const username = document.getElementById('admin-user').value;
    const password = document.getElementById('admin-pass').value;
    const errorDiv = document.getElementById('auth-error');

    console.log('checkAuth chamado - usuário:', username, 'senha:', password);

    if (username === 'Roberto' && password === '2025') {
        console.log('Autenticação bem-sucedida!');
        sessionStorage.setItem('adminAuth', 'true');
        const authModal = document.getElementById('auth-modal');
        const adminContent = document.getElementById('admin-content');
        console.log('auth-modal:', authModal);
        console.log('admin-content:', adminContent);
        console.log('admin-content display antes:', adminContent ? window.getComputedStyle(adminContent).display : 'não encontrado');
        
        if (authModal) {
            authModal.style.display = 'none';
            console.log('Modal escondido');
        }
        if (adminContent) {
            adminContent.style.display = 'block';
            console.log('admin-content display depois:', window.getComputedStyle(adminContent).display);
        }
        if (errorDiv) errorDiv.style.display = 'none';
        
        // Carregar dados após autenticação
        console.log('Carregando dados...');
        loadData();
        loadDrawnNumbers();
    } else {
        console.log('Autenticação falhou!');
        if (errorDiv) {
            errorDiv.textContent = '❌ Usuário ou senha incorretos';
            errorDiv.style.display = 'block';
        }
    }
}

// ========================================
// FUNÇÕES DE LIMPEZA DE DADOS
// ========================================

// Limpar todos os dados
function clearAllData() {
    const confirmClear = confirm('Tem certeza que deseja apagar TODOS os dados (usuários, números, status)? Essa ação não pode ser desfeita.');
    if (!confirmClear) return;

    try {
        // Preservar autenticação do admin
        const adminAuth = sessionStorage.getItem('adminAuth');
        localStorage.clear();
        if (adminAuth) {
            sessionStorage.setItem('adminAuth', adminAuth);
        }
        // Feedback visual
        const tbody = document.getElementById('users-tbody');
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <p>Nenhum usuário cadastrado ainda</p>
                </td>
            </tr>
        `;
        const grid = document.getElementById('numbers-grid');
        grid.innerHTML = `
            <div class="empty-state">
                <p>Nenhum número revelado ainda</p>
            </div>
        `;
        document.getElementById('total-users').textContent = '0';
        const onlineEl = document.getElementById('online-users');
        if (onlineEl) onlineEl.textContent = '0';
        document.getElementById('total-numbers').textContent = '0';
        document.getElementById('waiting-users').textContent = '0';
        alert('Todos os dados foram apagados. Ambiente limpo!');
    } catch (e) {
        console.error('Erro ao limpar dados:', e);
        alert('Não foi possível apagar os dados. Veja o console para detalhes.');
    }
}

// ========================================
// INICIALIZAÇÃO E EVENT LISTENERS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação ao carregar a página
    if (sessionStorage.getItem('adminAuth') === 'true') {
        document.getElementById('auth-modal').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
        loadData();
    } else {
        document.getElementById('auth-modal').style.display = 'flex';
    }

    // Permitir Enter no input de sorteio
    const drawInput = document.getElementById('draw-number-input');
    if (drawInput) {
        drawInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addDrawnNumber();
            }
        });
    }

    // Permitir Enter no input de senha
    const passInput = document.getElementById('admin-pass');
    if (passInput) {
        passInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkAuth();
            }
        });
    }

    // Buscar usuários
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const search = e.target.value.toLowerCase();
            const filtered = allUsers.filter(user => 
                (user.luckyNumber || '').toLowerCase().includes(search) ||
                (user.name || '').toLowerCase().includes(search) ||
                (user.email || '').toLowerCase().includes(search) ||
                (user.phone || '').toLowerCase().includes(search)
            );
            displayUsers(filtered);
        });
    }

    // Botão: Limpar todos os dados
    const clearAllBtn = document.getElementById('clear-all-btn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllData);
    }

    // Carregar dados iniciais
    loadData();
    loadDrawnNumbers();

    // Inicializar abas
    setupTabs();

    // Inicializar menu superior
    setupTopNav();
});

// Monitorar mudanças no localStorage
window.addEventListener('storage', (e) => {
    if (e.key === 'natalDaSorteDrawn' || e.key === 'natalDaSorteWinner') {
        loadDrawnNumbers();
    } else if (e.key && (e.key.startsWith('user_') || e.key.startsWith('luckyNumber_'))) {
        loadData();
    }
});

// Atualizar automaticamente a cada 5 segundos
setInterval(() => {
    if (sessionStorage.getItem('adminAuth') === 'true') {
        loadData();
    }
}, 5000);


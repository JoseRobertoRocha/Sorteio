// ========================================
// Página de Resultado - Transmissão ao Vivo
// ========================================

let currentNumbers = [];
let winner = null;
let historico = [];

// Carregar números do localStorage ao iniciar
function loadInitialData() {
    // Carregar números sorteados
    const stored = localStorage.getItem('natalDaSorteDrawn');
    if (stored) {
        try {
            currentNumbers = JSON.parse(stored);
            renderNumeros();
        } catch (e) {
            console.error('Erro ao carregar números:', e);
            currentNumbers = [];
        }
    } else {
        // Se não há números, limpar tela
        currentNumbers = [];
        renderNumeros();
    }

    // Carregar ganhador
    const storedWinner = localStorage.getItem('natalDaSorteWinner');
    if (storedWinner) {
        try {
            winner = JSON.parse(storedWinner);
            if (winner) {
                displayWinner();
            }
        } catch (e) {
            console.error('Erro ao carregar ganhador:', e);
        }
    }

    // Carregar histórico
    const storedHistorico = localStorage.getItem('natalDaSorteHistorico');
    if (storedHistorico) {
        try {
            historico = JSON.parse(storedHistorico);
            renderHistorico();
        } catch (e) {
            console.error('Erro ao carregar histórico:', e);
            historico = [];
        }
    } else {
        // Se não há histórico, limpar
        historico = [];
        renderHistorico();
    }
}

// Monitorar mudanças no localStorage (sincronização em tempo real)
function setupStorageListener() {
    window.addEventListener('storage', function(e) {
        if (e.key === 'natalDaSorteDrawn') {
            // Números foram atualizados
            if (e.newValue) {
                try {
                    const newNumbers = JSON.parse(e.newValue);
                    currentNumbers = newNumbers;
                    renderNumeros();
                    
                    // Atualizar histórico
                    newNumbers.forEach(num => {
                        if (!historico.includes(num)) {
                            historico.push(num);
                        }
                    });
                    renderHistorico();
                } catch (err) {
                    console.error('Erro ao processar números:', err);
                }
            } else {
                // Números foram apagados (RemoveItem)
                currentNumbers = [];
                renderNumeros();
            }
        } else if (e.key === 'natalDaSorteWinner') {
            // Ganhador foi definido
            if (e.newValue) {
                try {
                    winner = JSON.parse(e.newValue);
                    if (winner) {
                        displayWinner();
                    }
                } catch (err) {
                    console.error('Erro ao processar ganhador:', err);
                }
            } else {
                // Ganhador foi removido
                winner = null;
                const section = document.getElementById('ganhador-section');
                if (section) {
                    section.style.opacity = '0';
                    section.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => {
                        section.style.display = 'none';
                    }, 300);
                }
            }
        } else if (e.key === 'natalDaSorteTrigger') {
            // Trigger para forçar atualização (quando adiciona um número ou limpa)
            loadInitialData();
        }
    });
}

// Renderizar números sorteados
function renderNumeros() {
    const grid = document.getElementById('numeros-grid');
    
    if (!grid) return;

    if (currentNumbers.length === 0) {
        // Se a grid tinha números e agora foi limpa, fazer fade out
        const existingBalls = grid.querySelectorAll('.numero-ball');
        if (existingBalls.length > 0) {
            // Fade out suave dos números
            grid.style.opacity = '0.3';
            grid.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                grid.innerHTML = '<p class="empty-state">Aguardando números...</p>';
                grid.style.opacity = '1';
                grid.style.transition = 'opacity 0.3s ease';
            }, 150);
        } else {
            grid.innerHTML = '<p class="empty-state">Aguardando números...</p>';
        }
        return;
    }

    // Ordenar números para exibição
    const sorted = [...currentNumbers].sort((a, b) => parseInt(a) - parseInt(b));
    
    const existingBalls = grid.querySelectorAll('.numero-ball');
    const newBallCount = sorted.length;
    const existingCount = existingBalls.length;

    // Se adicionou um número novo, adicionar com transição
    if (newBallCount > existingCount) {
        const newHTML = sorted.map(num => 
            `<div class="numero-ball" data-numero="${num}">${num}</div>`
        ).join('');
        grid.innerHTML = newHTML;
        
        // Trigger reflow para ativar animação
        grid.offsetHeight;
    } else if (newBallCount === existingCount) {
        // Se a quantidade é igual, atualizar em background (sem flickering)
        const newHTML = sorted.map(num => 
            `<div class="numero-ball" data-numero="${num}">${num}</div>`
        ).join('');
        grid.innerHTML = newHTML;
    } else {
        // Se removeu números (reset parcial), atualizar com fade
        grid.style.opacity = '0.7';
        grid.style.transition = 'opacity 0.2s ease';
        
        setTimeout(() => {
            grid.innerHTML = sorted.map(num => 
                `<div class="numero-ball" data-numero="${num}">${num}</div>`
            ).join('');
            grid.style.opacity = '1';
        }, 100);
    }
}

// Exibir ganhador com animação suave
function displayWinner() {
    const section = document.getElementById('ganhador-section');
    if (!section) return;

    if (!winner) {
        // Fade out suave
        section.style.opacity = '0';
        section.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            section.style.display = 'none';
        }, 300);
        return;
    }

    // Determinar status online/offline
    const isOnline = winner.status_online === 'online';
    const statusClass = isOnline ? 'online' : 'offline';
    const statusText = isOnline ? 'Online 🟢' : 'Offline 🔴';

    // Formatar informações do ganhador
    let prizeText = '';
    if (winner.matchCount) {
        const dezenas = ['1ª Dezena', '2ª Dezena', '3ª Dezena', '4ª Dezena', '5ª Dezena', 
                        '6ª Dezena', '7ª Dezena', '8ª Dezena', '9ª Dezena', '10ª Dezena'];
        prizeText = `${dezenas[winner.matchCount - 1]} acertada!`;
    }

    const winnerNameEl = document.getElementById('winner-name');
    const winnerStatusDot = document.getElementById('winner-status-dot');
    const winnerStatusText = document.getElementById('winner-status-text');
    const winnerEmail = document.getElementById('winner-email');
    const winnerPhone = document.getElementById('winner-phone');
    const winnerPix = document.getElementById('winner-pix');
    const winnerDetails = document.getElementById('winner-details');

    // Atualizar conteúdo com transição suave
    if (section.style.display === 'none') {
        section.style.display = 'block';
        section.style.opacity = '0';
        section.style.transition = 'opacity 0.4s ease';
        
        // Atualizar conteúdo
        if (winnerNameEl) winnerNameEl.textContent = winner.name || 'Ganhador';
        if (winnerStatusDot) {
            winnerStatusDot.className = `status-dot ${statusClass}`;
        }
        if (winnerStatusText) winnerStatusText.textContent = statusText;
        if (winnerEmail) winnerEmail.textContent = winner.email || '-';
        if (winnerPhone) winnerPhone.textContent = winner.phone || '-';
        if (winnerPix) winnerPix.textContent = winner.pix || '-';
        if (winnerDetails) winnerDetails.innerHTML = prizeText;
        
        // Trigger reflow e iniciar fade in
        section.offsetHeight;
        section.style.opacity = '1';
    } else {
        // Já está visível, apenas atualizar valores
        if (winnerNameEl) winnerNameEl.textContent = winner.name || 'Ganhador';
        if (winnerStatusDot) {
            winnerStatusDot.className = `status-dot ${statusClass}`;
        }
        if (winnerStatusText) winnerStatusText.textContent = statusText;
        if (winnerEmail) winnerEmail.textContent = winner.email || '-';
        if (winnerPhone) winnerPhone.textContent = winner.phone || '-';
        if (winnerPix) winnerPix.textContent = winner.pix || '-';
        if (winnerDetails) winnerDetails.innerHTML = prizeText;
    }

    // Efeito sonoro (opcional - comentado por padrão)
    // playWinnerSound();
}

// Renderizar histórico de números sorteados
function renderHistorico() {
    const list = document.getElementById('historico-list');
    
    if (!list) return;

    if (historico.length === 0) {
        list.innerHTML = '<p class="empty-state">Nenhum número sorteado ainda</p>';
        return;
    }

    // Mostrar em ordem inversa (último primeiro)
    const reversed = [...historico].reverse();
    
    // Verificar se há elementos novos para adicionar com animação
    const existingItems = list.querySelectorAll('.historico-numero');
    
    // Atualizar com fade suave
    list.style.opacity = '0.9';
    list.style.transition = 'opacity 0.2s ease';
    
    setTimeout(() => {
        list.innerHTML = reversed.map(num => 
            `<div class="historico-numero" title="Número ${num}">${num}</div>`
        ).join('');
        list.style.opacity = '1';
    }, 50);
}

// Limpar dados (para teste/reset)
function clearAllData() {
    if (confirm('Tem certeza que deseja limpar todos os dados?')) {
        currentNumbers = [];
        winner = null;
        historico = [];
        
        localStorage.removeItem('natalDaSorteDrawn');
        localStorage.removeItem('natalDaSorteWinner');
        localStorage.removeItem('natalDaSorteHistorico');
        
        renderNumeros();
        renderHistorico();
        
        const section = document.getElementById('ganhador-section');
        if (section) {
            section.style.display = 'none';
        }
    }
}

// Função auxiliar para reproduzir som (opcional)
function playWinnerSound() {
    // Implementar som de vitória se necessário
    // const audio = new Audio('/sounds/winner.mp3');
    // audio.play();
}

// Atualizar a cada 500ms para sincronizar com o painel
function setupPolling() {
    setInterval(() => {
        const stored = localStorage.getItem('natalDaSorteDrawn');
        
        // Verificar se os números foram limpos
        if (!stored || stored === '[]') {
            if (currentNumbers.length > 0) {
                currentNumbers = [];
                renderNumeros();
            }
        } else if (stored) {
            try {
                const newNumbers = JSON.parse(stored);
                // Comparar quantidade - se for diferente, atualizar
                if (newNumbers.length !== currentNumbers.length || 
                    JSON.stringify(newNumbers.sort()) !== JSON.stringify(currentNumbers.sort())) {
                    currentNumbers = newNumbers;
                    renderNumeros();
                }
            } catch (e) {}
        }

        // Verificar histórico
        const storedHistorico = localStorage.getItem('natalDaSorteHistorico');
        if (!storedHistorico) {
            // Histórico foi apagado
            if (historico.length > 0) {
                historico = [];
                renderHistorico();
            }
        } else {
            try {
                const newHistorico = JSON.parse(storedHistorico);
                if (JSON.stringify(newHistorico) !== JSON.stringify(historico)) {
                    historico = newHistorico;
                    renderHistorico();
                }
            } catch (e) {}
        }

        const storedWinner = localStorage.getItem('natalDaSorteWinner');
        if (storedWinner) {
            try {
                const newWinner = JSON.parse(storedWinner);
                if (JSON.stringify(newWinner) !== JSON.stringify(winner)) {
                    winner = newWinner;
                    if (winner) {
                        displayWinner();
                    }
                } else if (winner && newWinner) {
                    // Mesmo que não tenha mudança no ganhador, atualizar status (pode ter mudado online/offline)
                    const oldStatus = winner.status_online;
                    winner = newWinner;
                    if (oldStatus !== winner.status_online) {
                        displayWinner();
                    }
                }
            } catch (e) {}
        } else {
            // Ganhador foi removido
            if (winner) {
                winner = null;
                const section = document.getElementById('ganhador-section');
                if (section) {
                    section.style.opacity = '0';
                    section.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => {
                        section.style.display = 'none';
                    }, 300);
                }
            }
        }
    }, 500);
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de Resultado carregada');
    
    // Carregar dados iniciais
    loadInitialData();
    
    // Configurar listener de armazenamento
    setupStorageListener();
    
    // Configurar polling para sincronização contínua
    setupPolling();
    
    // Atualizar a cada segundo (visual)
    setInterval(() => {
        renderNumeros();
        renderHistorico();
    }, 1000);
});

// Permitir atualizar manualmente com F5 ou Ctrl+R
window.addEventListener('beforeunload', function() {
    // Nada a fazer, apenas manter dados no localStorage
});

// Exposição de funções globais para debug
window.resultado = {
    clearData: clearAllData,
    getCurrentNumbers: () => currentNumbers,
    getWinner: () => winner,
    getHistorico: () => historico,
    refresh: loadInitialData
};

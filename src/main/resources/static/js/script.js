 // Configurações
        const REQUIRED_TIME = 30; // 30 segundos
        let elapsedTime = 0;
        let timerInterval = null;
        let luckyNumber = null;
        let isNumberRevealed = false;

        // Elementos do DOM
        const timerDisplay = document.getElementById('timer');
        const timerMessage = document.getElementById('timer-message');
        const luckyNumberDisplay = document.getElementById('lucky-number');

        // Função para gerar número aleatório de 4 dígitos
        function generateLuckyNumber() {
            // Não gerar novo número se já existir para o usuário atual
            const currentUser = JSON.parse(localStorage.getItem('natalDaSorteUser') || '{}');
            if (currentUser && currentUser.luckyNumber) {
                return currentUser.luckyNumber;
            }
            return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        }

        // Função para formatar o tempo
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        // Função para atualizar o timer
        function updateTimer() {
            timerDisplay.textContent = formatTime(elapsedTime);
            
            // Calcular progresso
            const progress = (elapsedTime / REQUIRED_TIME) * 100;
            
            if (elapsedTime < REQUIRED_TIME) {
                const remaining = REQUIRED_TIME - elapsedTime;
                timerMessage.textContent = `Faltam ${formatTime(remaining)} para revelar seu número!`;
            } else if (!isNumberRevealed) {
                revealLuckyNumber();
            }
        }

        // Função para revelar o número da sorte
        function revealLuckyNumber() {
            isNumberRevealed = true;
            luckyNumber = generateLuckyNumber();
            
            // Animação de revelação
            let count = 0;
            const revealInterval = setInterval(() => {
                luckyNumberDisplay.textContent = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
                count++;
                
                if (count > 20) {
                    clearInterval(revealInterval);
                    luckyNumberDisplay.textContent = luckyNumber;
                    luckyNumberDisplay.classList.remove('locked');
                    
                    // Salvar número da sorte no localStorage (apenas se ainda não salvo)
                    saveLuckyNumber(luckyNumber);
                    
                    // Ocultar a seção do timer
                    const timerSection = document.querySelector('.timer-section');
                    if (timerSection) {
                        timerSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        timerSection.style.opacity = '0';
                        timerSection.style.transform = 'scale(0.9)';
                        
                        setTimeout(() => {
                            timerSection.style.display = 'none';
                        }, 500);
                    }
                }
            }, 100);
        }

        // Salvar número da sorte no localStorage
        function saveLuckyNumber(number) {
            const userData = JSON.parse(localStorage.getItem('natalDaSorteUser') || '{}');
            const timestamp = new Date().toISOString();
            
            // Atualizar dados do usuário com o número da sorte
            if (userData.email) {
                // Se já possui número, não sobrescrever
                if (userData.luckyNumber) {
                    luckyNumber = userData.luckyNumber;
                } else {
                    userData.luckyNumber = number;
                    userData.timestamp = timestamp;
                }
                localStorage.setItem('natalDaSorteUser', JSON.stringify(userData));
                
                // Salvar também em um registro separado para o painel admin
                const userId = 'user_' + userData.email.replace(/[^a-zA-Z0-9]/g, '_');
                localStorage.setItem(userId, JSON.stringify(userData));
                
                // Salvar número da sorte revelado somente uma vez por usuário
                const luckyPerUserKey = 'luckyNumber_user_' + userData.email.replace(/[^a-zA-Z0-9]/g, '_');
                const existingLucky = localStorage.getItem(luckyPerUserKey);
                if (!existingLucky) {
                    const luckyData = {
                        number: userData.luckyNumber,
                        userName: userData.name,
                        userEmail: userData.email,
                        timestamp: userData.timestamp || timestamp
                    };
                    localStorage.setItem(luckyPerUserKey, JSON.stringify(luckyData));
                }
            }
        }

        // Iniciar o timer quando a página carregar
        function startTimer() {
            if (timerInterval) return; // Evitar múltiplos timers
            
            timerInterval = setInterval(() => {
                elapsedTime++;
                updateTimer();
                
                if (elapsedTime >= REQUIRED_TIME && isNumberRevealed) {
                    // Continuar contando mas não fazer nada mais
                }
            }, 1000);
        }

        // Pausar o timer
        function pauseTimer() {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
        }

        // Retomar o timer
        function resumeTimer() {
            if (!timerInterval && !isNumberRevealed) {
                startTimer();
            }
        }

        // Criar flocos de neve
        function createSnowflakes() {
            const snowflakesContainer = document.getElementById('snowflakes');
            const snowflakeCount = 50;
            
            for (let i = 0; i < snowflakeCount; i++) {
                const snowflake = document.createElement('div');
                snowflake.classList.add('snowflake');
                snowflake.textContent = '❄';
                snowflake.style.left = Math.random() * 100 + '%';
                snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
                snowflake.style.animationDelay = Math.random() * 5 + 's';
                snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
                snowflakesContainer.appendChild(snowflake);
            }
        }

        // Menu: popular nome e controlar dropdown
        function setupMenu() {
            const user = JSON.parse(localStorage.getItem('natalDaSorteUser') || '{}');
            const nameEl = document.getElementById('menu-username');
            if (nameEl) {
                nameEl.textContent = user && user.name ? user.name : (user.email || 'Usuário');
            }
            // Atualiza o nome no brand do menu
            const brandEl = document.getElementById('menu-brand-name');
            if (brandEl) {
                brandEl.textContent = user && user.name ? user.name : (user.email || 'Usuário');
            }
            const toggle = document.getElementById('menu-toggle');
            const dropdown = document.getElementById('menu-dropdown');
            if (toggle && dropdown) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    dropdown.style.display = dropdown.style.display === 'none' || dropdown.style.display === '' ? 'block' : 'none';
                });
                // Fechar quando clicar fora
                document.addEventListener('click', (e) => {
                    if (!dropdown.contains(e.target) && e.target !== toggle) {
                        dropdown.style.display = 'none';
                    }
                });
            }

            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            }
        }

        function logout() {
            try {
                const user = JSON.parse(localStorage.getItem('natalDaSorteUser') || '{}');
                // Zerar contador de sessões ativas desse usuário
                if (user && user.email) {
                    const userKeyId = user.email.replace(/[^a-zA-Z0-9]/g, '_');
                    localStorage.setItem('activeSessions_user_' + userKeyId, '0');
                }
                // Mantém registros administrativos, apenas remove sessão atual
                localStorage.removeItem('natalDaSorteUser');
                localStorage.removeItem('natalDaSorteAgree');
                updateUserStatus('offline');
            } catch {}
            // Redireciona para tela de login
            window.location.href = 'index.html';
        }

        // Fechar popup e iniciar timer
        function closePopup() {
            const popup = document.getElementById('popup-overlay');
            if (popup) {
                // Remove do DOM para evitar qualquer reaparição
                popup.parentNode && popup.parentNode.removeChild(popup);
            }
            try { localStorage.setItem('natalDaSorteAgree', 'true'); } catch {}
            if (!timerInterval) {
                startTimer();
            }
        }

        function forceHidePopupAndStart() {
            const popup = document.getElementById('popup-overlay');
            if (popup) {
                popup.classList.add('hidden');
                popup.style.display = 'none';
            }
            if (!timerInterval) {
                startTimer();
            }
        }

        // Detectar interação com o vídeo (como simulação)
        // Nota: A API do YouTube requer configuração mais complexa para detecção real
        // Utilitários de sessão por usuário (evita offline se houver outras abas ativas)
        function getCurrentUser() {
            return JSON.parse(localStorage.getItem('natalDaSorteUser') || '{}');
        }

        function getUserId(user) {
            return user && user.email ? user.email.replace(/[^a-zA-Z0-9]/g, '_') : null;
        }

        function adjustSessionCount(delta) {
            const user = getCurrentUser();
            const uid = getUserId(user);
            if (!uid) return 0;
            const key = 'activeSessions_user_' + uid;
            const current = parseInt(localStorage.getItem(key) || '0', 10) || 0;
            const next = Math.max(0, current + delta);
            localStorage.setItem(key, String(next));
            return next;
        }

        function getSessionCount() {
            const user = getCurrentUser();
            const uid = getUserId(user);
            if (!uid) return 0;
            const key = 'activeSessions_user_' + uid;
            return parseInt(localStorage.getItem(key) || '0', 10) || 0;
        }

        window.addEventListener('load', () => {
            createSnowflakes();
            setupMenu();
            
            // Marcar como online imediatamente
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.email) {
                adjustSessionCount(+1);
                updateUserStatus('online');
            }
            
            // Se usuário já tem número, mostrar imediatamente e ocultar timer
            const existingUser = JSON.parse(localStorage.getItem('natalDaSorteUser') || '{}');
            if (existingUser && existingUser.luckyNumber) {
                luckyNumber = existingUser.luckyNumber;
                isNumberRevealed = true;
                if (luckyNumberDisplay) {
                    luckyNumberDisplay.textContent = luckyNumber;
                    luckyNumberDisplay.classList.remove('locked');
                }
                const timerSection = document.querySelector('.timer-section');
                if (timerSection) {
                    timerSection.style.display = 'none';
                }
                return;
            }

            // Popup removido: iniciar timer diretamente
            startTimer();
        });

        // Prevenir trapaças - Pausar quando sair da aba
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                pauseTimer();
            } else {
                resumeTimer();
            }
            // Atualizar status mesmo em alterações de visibilidade
            updateUserStatus('online');
        });

        // Pausar quando a janela perde o foco
        window.addEventListener('blur', () => {
            pauseTimer();
        });

        // Retomar quando a janela ganha o foco
        window.addEventListener('focus', () => {
            resumeTimer();
        });

        // Detectar quando o usuário minimiza ou sai da página
        document.addEventListener('pagehide', () => {
            pauseTimer();
            const remaining = adjustSessionCount(-1);
            if (remaining <= 0) {
                updateUserStatus('offline');
            }
        });

        document.addEventListener('pageshow', () => {
            resumeTimer();
            updateUserStatus('online');
        });

        // Atualizar status do usuário
        function updateUserStatus(status) {
            const userData = JSON.parse(localStorage.getItem('natalDaSorteUser') || '{}');
            
            if (userData.email) {
                // Atualizar campos de status preservando todos os outros dados
                userData.status_online = status;
                userData.lastSeen = new Date().toISOString();
                
                // Salvar nos dois lugares
                const userId = 'user_' + userData.email.replace(/[^a-zA-Z0-9]/g, '_');
                localStorage.setItem('natalDaSorteUser', JSON.stringify(userData));
                localStorage.setItem(userId, JSON.stringify(userData));
            }
        }

        // Enviar heartbeat a cada 10 segundos (mesmo em background)
        setInterval(() => {
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.email) {
                updateUserStatus('online');
            }
        }, 10000);

        // Marcar como offline ao fechar
        window.addEventListener('beforeunload', () => {
            const remaining = adjustSessionCount(-1);
            if (remaining <= 0) {
                updateUserStatus('offline');
            }

        });

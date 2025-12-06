 // Configurações
        const REQUIRED_TIME = 30; // 30 segundos
        let elapsedTime = 0;
        let timerInterval = null;
        let luckyNumber = null;
        let isNumberRevealed = false;
        let player = null;
        let videoStarted = false;

        // Elementos do DOM (serão capturados após o DOM estar pronto)
        let timerDisplay = null;
        let timerMessage = null;
        let luckyNumberDisplay = null;

        // Função para renderizar números como spans individuais
        function renderNumbers(numbers) {
            console.log('renderNumbers chamado com:', numbers);
            if (!luckyNumberDisplay) {
                console.error('luckyNumberDisplay não encontrado!');
                return;
            }
            luckyNumberDisplay.innerHTML = '';
            numbers.forEach(num => {
                const span = document.createElement('span');
                span.textContent = typeof num === 'string' ? num : num.toString().padStart(2, '0');
                luckyNumberDisplay.appendChild(span);
            });
            console.log('Números renderizados:', luckyNumberDisplay.innerHTML);
        }

        // Função para gerar 10 dezenas aleatórias (01-60)
        function generateLuckyNumber() {
            // Não gerar novo número se já existir para o usuário atual
            const currentUser = JSON.parse(localStorage.getItem('natalDaSorteUser') || '{}');
            if (currentUser && currentUser.luckyNumber) {
                return currentUser.luckyNumber;
            }
            const dezenas = [];
            while (dezenas.length < 10) {
                const num = Math.floor(Math.random() * 60) + 1;
                if (!dezenas.includes(num)) {
                    dezenas.push(num);
                }
            }
            return dezenas.sort((a, b) => a - b).map(n => n.toString().padStart(2, '0'));
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
                const tempDezenas = [];
                for (let i = 0; i < 10; i++) {
                    tempDezenas.push(Math.floor(Math.random() * 60) + 1);
                }
                renderNumbers(tempDezenas.map(n => n.toString().padStart(2, '0')));
                count++;
                
                if (count > 20) {
                    clearInterval(revealInterval);
                    renderNumbers(luckyNumber.map(n => n.toString().padStart(2, '0')));
                    luckyNumberDisplay.classList.remove('locked');
                    
                    // Salvar número da sorte no localStorage (apenas se ainda não salvo)
                    saveLuckyNumber(luckyNumber);
                    
                    // Verificar se há números já sorteados
                    checkDrawnNumbers();
                    
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
            console.log('startTimer chamado. timerInterval:', timerInterval);
            if (timerInterval) {
                console.log('Timer já existe, retornando');
                return; // Evitar múltiplos timers
            }
            
            console.log('Criando novo timer interval');
            timerInterval = setInterval(() => {
                elapsedTime++;
                console.log('Tempo decorrido:', elapsedTime);
                updateTimer();
                
                if (elapsedTime >= REQUIRED_TIME && isNumberRevealed) {
                    clearInterval(timerInterval);
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

        // Retomar o timer (não controla o player, apenas o relógio)
        function resumeTimer() {
            if (!timerInterval && !isNumberRevealed) {
                startTimer();
            }
        }

        // Inicializar YouTube Player API
        function onYouTubeIframeAPIReady() {
            console.log('onYouTubeIframeAPIReady chamado');
            // Aguardar o DOM estar pronto
            const iframe = document.getElementById('youtube-player');
            if (!iframe) {
                console.error('YouTube iframe não encontrado');
                return;
            }
            
            try {
                player = new YT.Player('youtube-player', {
                    events: {
                        'onStateChange': onPlayerStateChange,
                        'onReady': function(event) {
                            console.log('YouTube Player pronto e funcionando');
                            
                            // Polling a cada 500ms para detectar quando o vídeo começar
                            const checkInterval = setInterval(() => {
                                if (player && typeof player.getPlayerState === 'function') {
                                    const state = player.getPlayerState();
                                    
                                    // Se está tocando e timer não foi iniciado
                                    if (state === 1 && !timerInterval && !isNumberRevealed) {
                                        console.log('╔════════════════════════════════════════╗');
                                        console.log('║  VÍDEO TOCANDO - INICIANDO TIMER!     ║');
                                        console.log('╚════════════════════════════════════════╝');
                                        console.log('Chamando startTimer()...');
                                        startTimer();
                                        console.log('startTimer() chamado! timerInterval agora:', timerInterval);
                                        if (timerMessage) timerMessage.textContent = 'Timer iniciado! Continue assistindo...';
                                    }
                                    
                                    // Se pausou e timer está rodando
                                    if ((state === 2 || state === 0) && timerInterval && !isNumberRevealed) {
                                        console.log('VÍDEO PAUSADO DETECTADO VIA POLLING');
                                        pauseTimer();
                                        if (timerMessage) timerMessage.textContent = 'Vídeo pausado. Pressione Play para continuar.';
                                    }
                                }
                            }, 500);
                        },
                        'onError': function(event) {
                            console.error('Erro no YouTube Player:', event);
                        }
                    }
                });
                console.log('Player criado com sucesso');
            } catch (e) {
                console.error('Erro ao criar YouTube Player:', e);
            }
        }
        
        // Callback global para YouTube API
        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

        // Detectar mudanças de estado do player do YouTube
        function onPlayerStateChange(event) {
            console.log('===== onPlayerStateChange DISPARADO =====');
            console.log('Estado do player mudou:', event.data);
            if (!window.YT || !event) {
                console.error('YT ou event não disponível');
                return;
            }
            const state = event.data;
            console.log('Estado atual:', state);
            console.log('Estados YT:', {
                UNSTARTED: -1,
                ENDED: 0,
                PLAYING: 1,
                PAUSED: 2,
                BUFFERING: 3,
                CUED: 5
            });
            console.log('timerInterval atual:', timerInterval);
            console.log('isNumberRevealed:', isNumberRevealed);
            
            // PLAYING (1) - iniciar ou retomar timer
            if (state === 1 && !isNumberRevealed) {
                console.log('>>> VÍDEO TOCANDO (STATE = 1) <<<');
                if (!timerInterval) {
                    console.log('>>> INICIANDO TIMER PELA PRIMEIRA VEZ <<<');
                    startTimer();
                    if (timerMessage) timerMessage.textContent = 'Timer iniciado! Continue assistindo...';
                } else {
                    console.log('>>> RETOMANDO TIMER <<<');
                    resumeTimer();
                }
            }
            // PAUSED (2) ou ENDED (0)
            if ((state === 2 || state === 0) && !isNumberRevealed) {
                console.log('>>> VÍDEO PAUSADO/FINALIZADO (STATE =', state, ') <<<');
                pauseTimer();
                if (timerMessage) timerMessage.textContent = 'Vídeo pausado. Pressione Play para continuar.';
            }
        }

        // Carregar API do YouTube
        function loadYouTubeAPI() {
            // Verificar se já foi carregado
            if (window.YT && window.YT.Player) {
                console.log('YouTube API já carregada, inicializando player...');
                onYouTubeIframeAPIReady();
                return;
            }

            // Carregar script da API
            console.log('Carregando YouTube API...');
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
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
            window.location.href = '/';
        }

        // Removido código de popup antigo e handlers duplicados; uso de um único handler de load abaixo

        function getLocalUser() {
            try { return JSON.parse(localStorage.getItem('natalDaSorteUser') || '{}'); } catch { return {}; }
        }

        function getLocalUserId(user) {
            const email = user && user.email;
            return email ? email.replace(/[^a-zA-Z0-9]/g, '_') : null;
        }

        function adjustSessionCount(delta) {
            const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : getLocalUser();
            const uid = (typeof getUserId === 'function') ? getUserId(user) : getLocalUserId(user);
            if (!uid) return 0;
            const key = 'activeSessions_user_' + uid;
            const current = parseInt(localStorage.getItem(key) || '0', 10) || 0;
            const next = Math.max(0, current + delta);
            localStorage.setItem(key, String(next));
            return next;
        }

        function getSessionCount() {
            const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : getLocalUser();
            const uid = (typeof getUserId === 'function') ? getUserId(user) : getLocalUserId(user);
            if (!uid) return 0;
            const key = 'activeSessions_user_' + uid;
            return parseInt(localStorage.getItem(key) || '0', 10) || 0;
        }

        // Modal de regras do sorteio
        const RULES_KEY = 'natalDaSorteRulesAccepted';

        function initRulesModal() {
            const modal = document.getElementById('rules-modal');
            const acceptBtn = document.getElementById('rules-accept-btn');
            if (!modal || !acceptBtn) return;

            // Se já aceitou, não exibe novamente
            if (localStorage.getItem(RULES_KEY) === 'true') {
                modal.style.display = 'none';
                return;
            }

            modal.style.display = 'flex';
            acceptBtn.addEventListener('click', () => {
                localStorage.setItem(RULES_KEY, 'true');
                modal.style.display = 'none';
            });
        }

        window.addEventListener('load', () => {
            console.log('Página carregada - inicializando');
            
            // PRIMEIRO: Capturar elementos DOM
            timerDisplay = document.getElementById('timer');
            timerMessage = document.getElementById('timer-message');
            luckyNumberDisplay = document.getElementById('lucky-number');
            
            console.log('Elementos capturados:', {
                timerDisplay: !!timerDisplay,
                timerMessage: !!timerMessage,
                luckyNumberDisplay: !!luckyNumberDisplay
            });

            // Exibir regras do sorteio ao entrar
            initRulesModal();
            
            createSnowflakes();
            setupMenu();

            // Marcar como online imediatamente
            const currentUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : getLocalUser();
            if (currentUser && currentUser.email) {
                adjustSessionCount(+1);
                updateUserStatus('online');
            }

            // Mostrar 00:00 inicialmente
            updateTimer();

            // Se usuário já tem número, mostrar imediatamente e ocultar timer
            const existingUser = JSON.parse(localStorage.getItem('natalDaSorteUser') || '{}');
            if (existingUser && existingUser.luckyNumber) {
                luckyNumber = existingUser.luckyNumber;
                isNumberRevealed = true;
                
                // Exibir número salvo
                if (luckyNumberDisplay) {
                    renderNumbers(luckyNumber.map(n => n.toString().padStart(2, '0')));
                    luckyNumberDisplay.classList.remove('locked');
                }
                
                const timerSection = document.querySelector('.timer-section');
                if (timerSection) {
                    timerSection.style.display = 'none';
                }
                
                // Verificar números sorteados
                checkDrawnNumbers();
                return;
            }

            // Carregar API do YouTube e aguardar início do vídeo
            console.log('Carregando YouTube API...');
            loadYouTubeAPI();

            // Monitorar números sorteados do painel em tempo real
            monitorDrawnNumbers();

            // Mensagem inicial
            if (timerMessage) {
                timerMessage.textContent = '▶️ Clique no Play do vídeo para iniciar a contagem!';
            }
            
            // FALLBACK: Detectar clique no iframe como último recurso
            const iframe = document.getElementById('youtube-player');
            if (iframe) {
                console.log('Iframe encontrado, adicionando listener de clique');
                iframe.addEventListener('click', function() {
                    console.log('═══ IFRAME CLICADO ═══');
                    setTimeout(() => {
                        if (!timerInterval && !isNumberRevealed) {
                            console.log('Forçando início do timer via clique no iframe');
                            startTimer();
                            if (timerMessage) timerMessage.textContent = 'Timer iniciado! Continue assistindo...';
                        }
                    }, 1000);
                });
            }
        });

        // Prevenir trapaças - Pausar quando sair da aba
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                pauseTimer();
            } else {
                if (player && typeof player.getPlayerState === 'function' && window.YT && player.getPlayerState() === YT.PlayerState.PLAYING) {
                    resumeTimer();
                }
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
            if (player && typeof player.getPlayerState === 'function' && window.YT && player.getPlayerState() === YT.PlayerState.PLAYING) {
                resumeTimer();
            }
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
            if (player && typeof player.getPlayerState === 'function' && window.YT && player.getPlayerState() === YT.PlayerState.PLAYING) {
                resumeTimer();
            }
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

        // Verificar se os números do usuário foram sorteados
        function checkDrawnNumbers() {
            if (!isNumberRevealed || !luckyNumber || luckyNumber.length === 0) return;
            
            const stored = localStorage.getItem('natalDaSorteDrawn');
            if (!stored) return;
            
            try {
                const drawnNumbers = JSON.parse(stored);
                if (!Array.isArray(drawnNumbers) || drawnNumbers.length === 0) return;
                
                // Contar quantos números batem
                let matchCount = 0;
                luckyNumber.forEach(num => {
                    if (drawnNumbers.includes(num)) {
                        matchCount++;
                    }
                });
                
                // Verificar se é ganhador (10 dezenas marcadas)
                if (matchCount === 10) {
                    showWinnerModal();
                }
            } catch (e) {
                console.error('Erro ao verificar números sorteados:', e);
            }
        }

        // Exibir modal do ganhador
        function showWinnerModal() {
            const modal = document.getElementById('winner-modal');
            if (modal) {
                modal.style.display = 'flex';
            }
        }

        // Monitorar números sorteados do painel
        function monitorDrawnNumbers() {
            window.addEventListener('storage', (e) => {
                if (e.key === 'natalDaSorteDrawn') {
                    try {
                        const drawnNumbers = JSON.parse(e.newValue || '[]');
                        console.log('Números sorteados atualizados:', drawnNumbers);
                        highlightMatchedNumbers(drawnNumbers);
                        checkDrawnNumbers();
                    } catch (err) {
                        console.error('Erro ao processar números sorteados:', err);
                    }
                }
            });
        }

        // Destacar números que foram sorteados
        function highlightMatchedNumbers(drawnNumbers) {
            if (!luckyNumber) return;
            
            const numberDisplay = document.getElementById('lucky-number');
            if (!numberDisplay) return;
            
            const spans = numberDisplay.querySelectorAll('span');
            spans.forEach((span, index) => {
                const number = luckyNumber[index] ? luckyNumber[index].toString().padStart(2, '0') : '';
                if (drawnNumbers.includes(number)) {
                    // Mudar para cor vermelha/dourada para indicar que foi sorteado
                    span.style.background = 'linear-gradient(135deg, #c41e3a 0%, #8b1428 100%)';
                    span.style.boxShadow = '0 0 20px rgba(196, 30, 58, 0.6), inset 0 0 10px rgba(255, 255, 0, 0.3)';
                    span.style.border = '2px solid #f59e0b';
                    span.style.transform = 'scale(1.15)';
                } else {
                    // Cores normais
                    span.style.background = 'linear-gradient(135deg, #0b6b4a 0%, #074d35 100%)';
                    span.style.boxShadow = '0 4px 12px rgba(11, 107, 74, 0.3)';
                    span.style.border = '2px solid rgba(244, 211, 94, 0.5)';
                    span.style.transform = 'scale(1)';
                }
            });
        }

        // Monitorar mudanças para números sorteados
        window.addEventListener('storage', (e) => {
            if (e.key === 'natalDaSorteTrigger' || e.key === 'natalDaSorteDrawn') {
                if (isNumberRevealed && luckyNumber) {
                    checkDrawnNumbers();
                }
            }
        });

        // Event listener DOMContentLoaded removido - tudo consolidado no 'load' acima

        function getCurrentUser() {
            const stored = localStorage.getItem('natalDaSorteUser');
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch (e) {
                    return null;
                }
            }
            return null;
        }

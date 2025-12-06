/* ========================================
   SISTEMA DE AUTENTICAÇÃO
   ======================================== */

const Auth = {
    // Chave do usuário atual
    USER_KEY: 'natalDaSorteUser',
    
    // Obter usuário atual
    getCurrentUser() {
        return Storage.get(this.USER_KEY, null);
    },

    // Verificar se está logado
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    },

    // Fazer login
    login(email, password) {
        const userId = this.getUserKey(email);
        const storedUser = Storage.get(userId);

        if (!storedUser) {
            throw new Error('Usuário não encontrado');
        }

        if (storedUser.password !== password) {
            throw new Error('Senha incorreta');
        }

        // Atualizar status
        storedUser.status_online = 'online';
        storedUser.lastLogin = new Date().toISOString();

        // Salvar usuário atual
        Storage.set(this.USER_KEY, storedUser);
        Storage.set(userId, storedUser);

        // Incrementar sessões ativas
        this.adjustSessionCount(1);

        return storedUser;
    },

    // Fazer cadastro
    register(userData) {
        const { email, name, phone, pix, password } = userData;

        // Validações
        if (!Validate.email(email)) {
            throw new Error('E-mail inválido');
        }

        if (!Validate.phone(phone)) {
            throw new Error('Telefone inválido');
        }

        if (!Validate.password(password)) {
            throw new Error('Senha deve ter no mínimo 6 caracteres');
        }

        // Verificar se já existe
        const userId = this.getUserKey(email);
        if (Storage.get(userId)) {
            throw new Error('E-mail já cadastrado');
        }

        // Criar usuário
        const newUser = {
            name,
            email,
            phone: Format.phone(phone),
            pix,
            password,
            luckyNumber: null,
            status: 'Aguardando',
            status_online: 'online',
            timestamp: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        // Salvar
        Storage.set(userId, newUser);
        Storage.set(this.USER_KEY, newUser);

        // Incrementar sessões ativas
        this.adjustSessionCount(1);

        return newUser;
    },

    // Fazer logout
    logout() {
        const user = this.getCurrentUser();
        
        if (user && user.email) {
            // Decrementar sessões
            const remaining = this.adjustSessionCount(-1);
            
            // Só marcar offline se não há mais sessões
            if (remaining <= 0) {
                this.updateUserStatus('offline');
            }
        }

        // Remover usuário atual
        Storage.remove(this.USER_KEY);
        Storage.remove('natalDaSorteAgree');
    },

    // Atualizar dados do usuário
    updateUser(updates) {
        const user = this.getCurrentUser();
        
        if (!user) {
            throw new Error('Usuário não autenticado');
        }

        const updatedUser = { ...user, ...updates };
        const userId = this.getUserKey(user.email);

        Storage.set(this.USER_KEY, updatedUser);
        Storage.set(userId, updatedUser);

        return updatedUser;
    },

    // Atualizar status online/offline
    updateUserStatus(status) {
        const user = this.getCurrentUser();
        
        if (!user || !user.email) return;

        const updates = {
            status_online: status,
            lastSeen: new Date().toISOString()
        };

        this.updateUser(updates);
    },

    // Obter chave do usuário
    getUserKey(email) {
        return 'user_' + email.replace(/[^a-zA-Z0-9]/g, '_');
    },

    // Gerenciar contador de sessões ativas
    adjustSessionCount(delta) {
        const user = this.getCurrentUser();
        if (!user || !user.email) return 0;

        const key = 'activeSessions_' + this.getUserKey(user.email);
        const current = parseInt(Storage.get(key, 0), 10) || 0;
        const next = Math.max(0, current + delta);
        
        Storage.set(key, next);
        return next;
    },

    // Obter contador de sessões
    getSessionCount() {
        const user = this.getCurrentUser();
        if (!user || !user.email) return 0;

        const key = 'activeSessions_' + this.getUserKey(user.email);
        return parseInt(Storage.get(key, 0), 10) || 0;
    },

    // Verificar se precisa de autenticação
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/';
            return false;
        }
        return true;
    },

    // Inicializar heartbeat
    startHeartbeat(interval = 10000) {
        setInterval(() => {
            if (this.isAuthenticated()) {
                this.updateUserStatus('online');
            }
        }, interval);
    }
};

// Gerenciar eventos de página
window.addEventListener('load', () => {
    const user = Auth.getCurrentUser();
    if (user && user.email) {
        Auth.adjustSessionCount(1);
        Auth.updateUserStatus('online');
    }
});

window.addEventListener('beforeunload', () => {
    const remaining = Auth.adjustSessionCount(-1);
    if (remaining <= 0) {
        Auth.updateUserStatus('offline');
    }
});

// Heartbeat automático
Auth.startHeartbeat();

// Exportar para uso global
window.Auth = Auth;

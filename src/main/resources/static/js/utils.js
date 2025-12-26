/* ========================================
   UTILIDADES E FUNÇÕES AUXILIARES
   ======================================== */

// Gerenciamento de LocalStorage
const Storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Erro ao ler localStorage:', error);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            return false;
        }
    }
};

// Formatação de dados
const Format = {
    // Formatar telefone (00) 00000-0000
    phone(value) {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 11) {
            const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
            if (match) {
                let formatted = '';
                if (match[1]) formatted += `(${match[1]}`;
                if (match[2]) formatted += match[1].length === 2 ? `) ${match[2]}` : match[2];
                if (match[3]) formatted += `-${match[3]}`;
                return formatted;
            }
        }
        return value;
    },

    // Formatar CPF 000.000.000-00
    cpf(value) {
        const cleaned = value.replace(/\D/g, '');
        return cleaned
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    },

    // Formatar data/hora
    dateTime(date) {
        return new Date(date).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Formatar número com zeros à esquerda
    padNumber(num, size = 4) {
        return num.toString().padStart(size, '0');
    },

    // Formatar tempo MM:SS
    time(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${Format.padNumber(mins, 2)}:${Format.padNumber(secs, 2)}`;
    }
};

// Validações
const Validate = {
    email(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    phone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10 && cleaned.length <= 11;
    },

    cpf(cpf) {
        const cleaned = cpf.replace(/\D/g, '');
        if (cleaned.length !== 11) return false;
        
        // Validação básica de CPF
        let sum = 0;
        let remainder;
        
        if (cleaned.split('').every(char => char === cleaned[0])) return false;
        
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
        }
        
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cleaned.substring(9, 10))) return false;
        
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
        }
        
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cleaned.substring(10, 11))) return false;
        
        return true;
    },

    password(password) {
        return password.length >= 6;
    }
};

// Notificações e mensagens
const Notify = {
    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            animation: slideDown 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;
        
        // Cores baseadas no tipo
        const colors = {
            success: 'linear-gradient(135deg, #4caf50, #388e3c)',
            error: 'linear-gradient(135deg, #f44336, #d32f2f)',
            warning: 'linear-gradient(135deg, #ff9800, #f57c00)',
            info: 'linear-gradient(135deg, #2196f3, #1976d2)'
        };
        
        notification.style.background = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    },

    success(message, duration) {
        this.show(message, 'success', duration);
    },

    error(message, duration) {
        this.show(message, 'error', duration);
    },

    warning(message, duration) {
        this.show(message, 'warning', duration);
    },

    info(message, duration) {
        this.show(message, 'info', duration);
    }
};

// Geradores
// const Generate = {
//     // Gerar ID único
//     id() {
//         return Date.now().toString(36) + Math.random().toString(36).substr(2);
//     },

//     // Gerar número aleatório
//     randomNumber(min, max) {
//         return Math.floor(Math.random() * (max - min + 1)) + min;
//     },

//     // Gerar número da sorte (4 dígitos)
//     luckyNumber() {
//         return Format.padNumber(this.randomNumber(0, 9999), 4);
//     }
// };

// Utilitários DOM
const DOM = {
    // Selecionar elemento
    $(selector) {
        return document.querySelector(selector);
    },

    // Selecionar múltiplos elementos
    $$(selector) {
        return document.querySelectorAll(selector);
    },

    // Adicionar evento
    on(element, event, handler) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        if (element) {
            element.addEventListener(event, handler);
        }
    },

    // Criar elemento
    create(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'class') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else {
                element.setAttribute(key, value);
            }
        });
        
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        
        return element;
    },

    // Mostrar/Ocultar elemento
    show(element) {
        if (typeof element === 'string') element = this.$(element);
        if (element) element.style.display = 'block';
    },

    hide(element) {
        if (typeof element === 'string') element = this.$(element);
        if (element) element.style.display = 'none';
    },

    toggle(element) {
        if (typeof element === 'string') element = this.$(element);
        if (element) {
            element.style.display = element.style.display === 'none' ? 'block' : 'none';
        }
    }
};

// Debounce e Throttle
const Debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const Throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Exportar para uso global
window.Storage = Storage;
window.Format = Format;
window.Validate = Validate;
window.Notify = Notify;
window.Generate = Generate;
window.DOM = DOM;
window.Debounce = Debounce;
window.Throttle = Throttle;

/* ========================================
   LÓGICA DO SORTEIO (CENTRALIZADA)
   ======================================== */

const DrawUtils = {
    drawnNumbers: [],
    winnerFound: false,
    winners: [],

    addNumber(number, bets = []) {
        if (this.winnerFound) {
            Notify.warning("Sorteio já encerrado!");
            return this.drawnNumbers;
        }

        if (this.drawnNumbers.includes(number)) {
            return this.drawnNumbers;
        }

        this.drawnNumbers.push(number);
        this.checkWinner(bets);
        return this.drawnNumbers;
    },

    clear() {
        this.drawnNumbers = [];
        this.winnerFound = false;
        this.winners = [];
    },

    getNumbers() {
        return this.drawnNumbers;
    },

    betContainsAllNumbers(betNumbers = []) {
        return this.drawnNumbers.every(n => betNumbers.includes(n));
    },

    filterValidBets(bets = []) {
        return bets.filter(bet =>
            this.betContainsAllNumbers(bet.luckyNumbers || [])
        );
    },

    checkWinner(bets = []) {
        const possibleWinners = bets.filter(bet =>
            this.betContainsAllNumbers(bet.luckyNumbers || []) &&
            bet.luckyNumbers.length === this.drawnNumbers.length
        );

        if (possibleWinners.length) {
            this.winnerFound = true;
            this.winners = possibleWinners;
            Notify.success("🏆 Ganhador encontrado!");
        }
    }
};

window.DrawUtils = DrawUtils;


// Exporta globalmente
window.DrawUtils = DrawUtils;

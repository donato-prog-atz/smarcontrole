let usuarioAtual = "Usuário";
const THEME_KEY = "smartcontrol-theme";
const DEVICE_STORAGE_KEY = "smartcontrol-device-list";
const DEFAULT_DEVICES = [
    "Smart TV Samsung",
    "Robô aspirador de pó",
    "Ar condicionado Electrolux",
    "Persiana elétrica motorizada",
    "Lâmpada smart inteligente",
    "Interruptor inteligente",
    "Controle remoto inteligente",
    "Poltrona elétrica reclinável"
];

function getDevices() {
    const stored = localStorage.getItem(DEVICE_STORAGE_KEY);

    if (!stored) {
        localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(DEFAULT_DEVICES));
        return [...DEFAULT_DEVICES];
    }

    try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.filter(Boolean).map(item => String(item).trim());
        }
    } catch (error) {
        console.warn("Lista de dispositivos inválida. Recriando padrão.", error);
    }

    localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(DEFAULT_DEVICES));
    return [...DEFAULT_DEVICES];
}

function saveDevices(devices) {
    const sanitized = devices
        .map(item => String(item).trim())
        .filter(Boolean)
        .filter((item, index, list) => list.findIndex(entry => entry.toLowerCase() === item.toLowerCase()) === index);

    localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(sanitized));
    return sanitized;
}

function addDeviceToStorage(name) {
    const normalized = String(name || "").replace(/\s+/g, " ").trim();
    if (!normalized) {
        return false;
    }

    const list = getDevices();
    const exists = list.some(item => item.toLowerCase() === normalized.toLowerCase());
    if (exists) {
        return false;
    }

    const updated = saveDevices([...list, normalized]);
    if (typeof window.refreshRoomDeviceList === "function") {
        window.refreshRoomDeviceList(updated);
    }
    return true;
}

function removeDeviceFromStorage(name) {
    const target = String(name || "").trim();
    if (!target) {
        return getDevices();
    }

    const updated = saveDevices(getDevices().filter(item => item.toLowerCase() !== target.toLowerCase()));

    if (typeof window.refreshRoomDeviceList === "function") {
        window.refreshRoomDeviceList(updated);
    }

    return updated;
}

function setupDeviceManager() {
    const modal = document.getElementById("devicesModal");
    const form = document.getElementById("deviceForm");
    const input = document.getElementById("deviceName");
    const list = document.getElementById("deviceList");
    const openButtons = document.querySelectorAll('[data-action="manage-devices"]');
    const closeBtn = document.getElementById("devicesModalClose");

    if (!modal || !form || !input || !list) {
        return;
    }

    const renderList = () => {
        const devices = getDevices();
        list.innerHTML = "";

        if (!devices.length) {
            const empty = document.createElement("li");
            empty.className = "device-empty";
            empty.textContent = "Nenhum dispositivo cadastrado.";
            list.appendChild(empty);
            return;
        }

        devices.forEach(device => {
            const item = document.createElement("li");
            item.className = "device-item";

            const label = document.createElement("span");
            label.textContent = device;

            const button = document.createElement("button");
            button.type = "button";
            button.className = "device-remove-btn";
            button.dataset.remove = device;
            button.textContent = "Remover";

            item.appendChild(label);
            item.appendChild(button);
            list.appendChild(item);
        });
    };

    openButtons.forEach(button => {
        button.addEventListener("click", event => {
            const href = button.getAttribute("href");
            if (href) {
                return;
            }

            event.preventDefault();
            renderList();
            modal.classList.add("open");
            modal.setAttribute("aria-hidden", "false");
            input.focus();
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.classList.remove("open");
            modal.setAttribute("aria-hidden", "true");
        });
    }

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.classList.remove("open");
            modal.setAttribute("aria-hidden", "true");
        }
    });

    form.addEventListener("submit", event => {
        event.preventDefault();
        const value = input.value.trim();

        if (!value) {
            input.focus();
            return;
        }

        const inserted = addDeviceToStorage(value);
        if (!inserted) {
            input.setCustomValidity("Este dispositivo já existe.");
            input.reportValidity();
            return;
        }

        input.setCustomValidity("");
        input.value = "";
        renderList();
    });

    list.addEventListener("click", event => {
        const button = event.target.closest(".device-remove-btn");
        if (!button) return;

        removeDeviceFromStorage(button.dataset.remove);
        renderList();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && modal.classList.contains("open")) {
            modal.classList.remove("open");
            modal.setAttribute("aria-hidden", "true");
        }
    });

    renderList();
}

window.smartControlDevices = {
    getDevices,
    addDeviceToStorage,
    removeDeviceFromStorage,
    saveDevices
};

// Pega o nome do usuário da URL se existir
function getNomeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('user');
}

// Obtém nome do usuário da URL ou via prompt
function obterNomeCompleto() {
    // Primeiro tenta pegar da URL
    const nomeUrl = getNomeFromUrl();
    if (nomeUrl) {
        return decodeURIComponent(nomeUrl);
    }
    
    // Se não houver na URL, pede via prompt
    const nomeCompleto = prompt("Digite seu nome e sobrenome:");
    const nomeValido = nomeCompleto ? nomeCompleto.trim() : "";

    return nomeValido || "Usuário";
}

function formatarFusoHorario(offsetMinutos) {
    const sinal = offsetMinutos <= 0 ? "+" : "-";
    const valorAbsoluto = Math.abs(offsetMinutos);
    const horas = String(Math.floor(valorAbsoluto / 60)).padStart(2, "0");
    const minutos = String(valorAbsoluto % 60).padStart(2, "0");

    return `${sinal}${horas}:${minutos}`;
}

function formatarDataAtual() {
    const agora = new Date();
    const diasSemana = [
        "Domingo",
        "Segunda-Feira",
        "Terça-Feira",
        "Quarta-Feira",
        "Quinta-Feira",
        "Sexta-Feira",
        "Sábado"
    ];

    const diaSemana = diasSemana[agora.getDay()];
    const diaMes = agora.getDate();
    const mesAtual = String(agora.getMonth() + 1).padStart(2, "0");
    const anoAtual = agora.getFullYear();
    const horaAtual = String(agora.getHours()).padStart(2, "0");
    const minutoAtual = String(agora.getMinutes()).padStart(2, "0");
    const segundoAtual = String(agora.getSeconds()).padStart(2, "0");
    const fusoHorario = formatarFusoHorario(agora.getTimezoneOffset());

    return `${diaSemana}, ${diaMes}/${mesAtual}/${anoAtual} – ${horaAtual}:${minutoAtual}:${segundoAtual} (${fusoHorario})`;
}

function exibirMensagemBoasVindas() {
    const dataAtual = formatarDataAtual();
    const mensagemElemento = document.getElementById("mensagem");

    if (mensagemElemento) {
        mensagemElemento.textContent = `Olá, ${usuarioAtual}! Hoje é ${dataAtual}`;
    }
}

// Inicializa o relógio e exibe a mensagem de boas-vindas
function iniciarRelogio() {
    const mensagemElemento = document.getElementById("mensagem");

    if (!mensagemElemento) {
        return;
    }

    usuarioAtual = obterNomeCompleto();
    // Armazena o nome para usar quando voltar do room.html
    sessionStorage.setItem('usuarioAtual', usuarioAtual);
    exibirMensagemBoasVindas();
    setInterval(exibirMensagemBoasVindas, 1000);
}

function setupBuscaTabela() {
    const campo = document.getElementById('campoBusca');
    const tbody = document.querySelector('.tabela-acesso tbody');
    if (!campo || !tbody) return;

    function debounce(fn, wait) {
        let t;
        return function(...args) {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function normalizeForSearch(s) {
        return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    function highlightCell(cell, term) {
        const orig = cell.dataset.original || cell.textContent;
        if (!cell.dataset.original) cell.dataset.original = orig;
        if (!term) {
            cell.innerHTML = escapeHTML(orig);
            return;
        }

        const origChars = Array.from(orig);
        let norm = '';
        const map = [];
        for (let i = 0; i < origChars.length; i++) {
            const c = origChars[i];
            const cNorm = c.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            for (let j = 0; j < cNorm.length; j++) map.push(i);
            norm += cNorm;
        }

        const lowerNorm = norm.toLowerCase();
        const termNorm = normalizeForSearch(term);
        let lastOrigPos = 0;
        let pos = 0;
        let out = '';

        while (true) {
            const idx = lowerNorm.indexOf(termNorm, pos);
            if (idx === -1) break;
            const origStart = map[idx];
            const origEnd = map[idx + termNorm.length - 1] + 1;
            out += escapeHTML(orig.slice(lastOrigPos, origStart));
            out += '<mark>' + escapeHTML(orig.slice(origStart, origEnd)) + '</mark>';
            lastOrigPos = origEnd;
            pos = idx + termNorm.length;
        }
        out += escapeHTML(orig.slice(lastOrigPos));
        cell.innerHTML = out;
    }

    const clearBtn = document.getElementById('clearBusca');

    const handler = debounce((e) => {
        const termo = (e.target && typeof e.target.value === 'string') ? e.target.value.trim() : '';
        const termoNorm = normalizeForSearch(termo);
        const linhas = Array.from(tbody.querySelectorAll('tr'));
        linhas.forEach(row => {
            const texto = Array.from(row.querySelectorAll('td')).map(td => td.textContent).join(' ');
            const textoNorm = normalizeForSearch(texto.replace(/\s+/g, ' '));
            const mostrar = termo === '' || textoNorm.indexOf(termoNorm) !== -1;
            row.style.display = mostrar ? '' : 'none';
            Array.from(row.querySelectorAll('td')).forEach(td => {
                if (mostrar && termo !== '') highlightCell(td, termo);
                else highlightCell(td, '');
            });
        });
        if (clearBtn) clearBtn.style.display = termo ? 'inline-block' : 'none';
    }, 180);

    campo.addEventListener('input', handler);
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            campo.value = '';
            campo.focus();
            campo.dispatchEvent(new Event('input', { bubbles: true }));
        });
        clearBtn.style.display = campo.value ? 'inline-block' : 'none';
    }
}

function aplicarTema(tema) {
    const modoEscuro = tema === "dark";
    document.body.classList.toggle("dark-mode", modoEscuro);
    document.body.setAttribute("data-theme", tema);
    localStorage.setItem(THEME_KEY, tema);

    const botaoLampada = document.querySelector(".lampada-toggle");
    if (botaoLampada) {
        botaoLampada.setAttribute("aria-pressed", String(modoEscuro));
        botaoLampada.title = modoEscuro ? "Ativar modo claro" : "Ativar modo escuro";
    }
}

function inicializarTema() {
    const botaoLampada = document.querySelector(".lampada-toggle");
    if (!botaoLampada) {
        return;
    }

    const temaSalvo = localStorage.getItem(THEME_KEY) || "light";
    aplicarTema(temaSalvo);

    botaoLampada.addEventListener("click", () => {
        const temaAtual = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
        aplicarTema(temaAtual);
    });
}

inicializarTema();
iniciarRelogio();
// Inicializa a funcionalidade de busca na tabela de acessos
setupBuscaTabela();

// Setup da sidebar lateral ativada por clique no ícone de menu
function setupSidebar() {
    const bars = document.querySelector('.bars-icon');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const closeBtn = document.getElementById('sidebarClose');
    if (!bars || !sidebar || !overlay) return;

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('open');
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
    }

    bars.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sidebar.classList.contains('open')) closeSidebar();
        else openSidebar();
    });

    overlay.addEventListener('click', closeSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);

    // Fecha sidebar ao pressionar Escape
    document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && sidebar.classList.contains('open')) closeSidebar();
    });
}

setupSidebar();
setupDeviceManager();

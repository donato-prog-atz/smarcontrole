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

function normalizeDeviceName(value) {
    return String(value ?? "").replace(/\s+/g, " ").trim();
}

function sanitizeDevices(devices) {
    const cleaned = (Array.isArray(devices) ? devices : [])
        .map(item => normalizeDeviceName(item))
        .filter(Boolean);

    const unique = [];
    cleaned.forEach(item => {
        const alreadyExists = unique.some(existing => existing.toLowerCase() === item.toLowerCase());
        if (!alreadyExists) {
            unique.push(item);
        }
    });

    return unique;
}

function getDevices() {
    const stored = localStorage.getItem(DEVICE_STORAGE_KEY);

    if (!stored) {
        localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(DEFAULT_DEVICES));
        return [...DEFAULT_DEVICES];
    }

    try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return sanitizeDevices(parsed);
        }
    } catch (error) {
        console.warn("Lista de dispositivos inválida. Recriando padrão.", error);
    }

    localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(DEFAULT_DEVICES));
    return [...DEFAULT_DEVICES];
}

function saveDevices(devices) {
    const sanitized = sanitizeDevices(devices);
    localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(sanitized));
    return sanitized;
}

function addDeviceToStorage(name) {
    const normalized = normalizeDeviceName(name);
    if (!normalized) {
        return false;
    }

    const devices = getDevices();
    const exists = devices.some(item => item.toLowerCase() === normalized.toLowerCase());
    if (exists) {
        return false;
    }

    const updated = saveDevices([...devices, normalized]);
    if (typeof window.refreshRoomDeviceList === "function") {
        window.refreshRoomDeviceList(updated);
    }
    return true;
}

function removeDeviceFromStorage(name) {
    const target = normalizeDeviceName(name);
    if (!target) {
        return getDevices();
    }

    const updated = saveDevices(getDevices().filter(item => item.toLowerCase() !== target.toLowerCase()));

    if (typeof window.refreshRoomDeviceList === "function") {
        window.refreshRoomDeviceList(updated);
    }

    return updated;
}

function toggleModalState(modal, shouldOpen) {
    modal.classList.toggle("open", shouldOpen);
    modal.setAttribute("aria-hidden", String(!shouldOpen));
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
            const emptyItem = document.createElement("li");
            emptyItem.className = "device-empty";
            emptyItem.textContent = "Nenhum dispositivo cadastrado.";
            list.appendChild(emptyItem);
            return;
        }

        devices.forEach(device => {
            const item = document.createElement("li");
            item.className = "device-item";

            const label = document.createElement("span");
            label.textContent = device;

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "device-remove-btn";
            removeButton.dataset.remove = device;
            removeButton.textContent = "Remover";

            item.append(label, removeButton);
            list.appendChild(item);
        });
    };

    openButtons.forEach(button => {
        button.addEventListener("click", event => {
            if (button.getAttribute("href")) {
                return;
            }

            event.preventDefault();
            renderList();
            toggleModalState(modal, true);
            input.focus();
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => toggleModalState(modal, false));
    }

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            toggleModalState(modal, false);
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
        if (!button) {
            return;
        }

        removeDeviceFromStorage(button.dataset.remove);
        renderList();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && modal.classList.contains("open")) {
            toggleModalState(modal, false);
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

function getNomeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("user");
}

function obterNomeCompleto() {
    const nomeUrl = getNomeFromUrl();
    if (nomeUrl) {
        return decodeURIComponent(nomeUrl);
    }

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
    const mensagemElemento = document.getElementById("mensagem");
    if (!mensagemElemento) {
        return;
    }

    mensagemElemento.textContent = `Olá, ${usuarioAtual}! Hoje é ${formatarDataAtual()}`;
}

function iniciarRelogio() {
    const mensagemElemento = document.getElementById("mensagem");
    if (!mensagemElemento) {
        return;
    }

    usuarioAtual = obterNomeCompleto();
    sessionStorage.setItem("usuarioAtual", usuarioAtual);
    exibirMensagemBoasVindas();
    setInterval(exibirMensagemBoasVindas, 1000);
}

function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

function normalizeForSearch(value = "") {
    return String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function escapeHTML(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function highlightCell(cell, term) {
    const originalText = cell.dataset.original || cell.textContent;
    if (!cell.dataset.original) {
        cell.dataset.original = originalText;
    }

    if (!term) {
        cell.innerHTML = escapeHTML(originalText);
        return;
    }

    const chars = Array.from(originalText);
    let normalized = "";
    const map = [];

    chars.forEach(char => {
        const normalizedChar = char.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        for (let i = 0; i < normalizedChar.length; i += 1) {
            map.push(chars.indexOf(char));
        }
        normalized += normalizedChar;
    });

    const termNormalized = normalizeForSearch(term);
    const normalizedLower = normalized.toLowerCase();
    const matches = [];
    let start = 0;

    while (start < normalizedLower.length) {
        const index = normalizedLower.indexOf(termNormalized, start);
        if (index === -1) {
            break;
        }

        matches.push({ index, length: termNormalized.length });
        start = index + termNormalized.length;
    }

    if (!matches.length) {
        cell.innerHTML = escapeHTML(originalText);
        return;
    }

    let html = "";
    let lastIndex = 0;

    matches.forEach(match => {
        const startIndex = map[match.index] ?? 0;
        const endIndex = map[match.index + match.length - 1] ?? originalText.length;
        html += escapeHTML(originalText.slice(lastIndex, startIndex));
        html += `<mark>${escapeHTML(originalText.slice(startIndex, endIndex + 1))}</mark>`;
        lastIndex = endIndex + 1;
    });

    html += escapeHTML(originalText.slice(lastIndex));
    cell.innerHTML = html;
}

function setupBuscaTabela() {
    const campo = document.getElementById("campoBusca");
    const tbody = document.querySelector(".tabela-acesso tbody");
    if (!campo || !tbody) {
        return;
    }

    const clearBtn = document.getElementById("clearBusca");

    const applySearch = () => {
        const termo = campo.value.trim();
        const termoNorm = normalizeForSearch(termo);
        const linhas = Array.from(tbody.querySelectorAll("tr"));

        linhas.forEach(row => {
            const texto = Array.from(row.querySelectorAll("td"))
                .map(td => td.textContent)
                .join(" ");
            const textoNorm = normalizeForSearch(texto.replace(/\s+/g, " "));
            const mostrar = termo === "" || textoNorm.includes(termoNorm);

            row.style.display = mostrar ? "" : "none";
            Array.from(row.querySelectorAll("td")).forEach(td => {
                highlightCell(td, mostrar && termo ? termo : "");
            });
        });

        if (clearBtn) {
            clearBtn.style.display = termo ? "inline-block" : "none";
        }
    };

    campo.addEventListener("input", debounce(applySearch, 180));

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            campo.value = "";
            campo.focus();
            campo.dispatchEvent(new Event("input", { bubbles: true }));
        });
        clearBtn.style.display = campo.value ? "inline-block" : "none";
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

function setupSidebar() {
    const bars = document.querySelector(".bars-icon");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const closeBtn = document.getElementById("sidebarClose");
    if (!bars || !sidebar || !overlay) {
        return;
    }

    const openSidebar = () => {
        sidebar.classList.add("open");
        overlay.classList.add("open");
    };

    const closeSidebar = () => {
        sidebar.classList.remove("open");
        overlay.classList.remove("open");
    };

    bars.addEventListener("click", event => {
        event.stopPropagation();
        if (sidebar.classList.contains("open")) {
            closeSidebar();
            return;
        }

        openSidebar();
    });

    overlay.addEventListener("click", closeSidebar);
    if (closeBtn) {
        closeBtn.addEventListener("click", closeSidebar);
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && sidebar.classList.contains("open")) {
            closeSidebar();
        }
    });
}

inicializarTema();
iniciarRelogio();
setupBuscaTabela();
setupSidebar();
setupDeviceManager();

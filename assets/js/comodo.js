// Arquivo responsável por toda a lógica de dispositivos por cômodo.
// Ele salva os dados em localStorage, renderiza os cards do dashboard,
// atualiza a página do cômodo e controla o painel de gerenciamento.

const ROOM_KEY = "smartcontrol-room-devices";
const LEGACY_KEY = "smartcontrol-device-list";
const DEFAULT_STATE = {
    Sala: ["TV", "Lâmpada"],
    Cozinha: ["Lâmpada"],
    "Quarto principal": ["TV"],
    "Outros comodos": []
};

const text = value => String(value ?? "").replace(/\s+/g, " ").trim();
const roomName = value => text(value) || "Outros comodos";

const cleanList = list => {
    const seen = new Set();
    return (Array.isArray(list) ? list : [])
        .map(item => text(item))
        .filter(Boolean)
        .filter(item => {
            const key = item.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
};

const cleanState = state => {
    const out = {};
    if (!state || typeof state !== "object") return out;
    Object.keys(state).forEach(name => {
        out[roomName(name)] = cleanList(state[name]);
    });
    return out;
};

// Carrega o estado salvo em localStorage.
// Se não existir, tenta migrar os dados antigos e usa o estado padrão.
function loadState() {
    const saved = localStorage.getItem(ROOM_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            const clean = cleanState(parsed);
            if (Object.keys(clean).length) return clean;
        } catch (error) {
            console.warn("Estado salvo inválido, usando padrão.", error);
        }
    }

    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
        try {
            const parsed = JSON.parse(legacy);
            const migrated = { ...DEFAULT_STATE, Sala: cleanList(parsed).length ? cleanList(parsed) : DEFAULT_STATE.Sala };
            localStorage.setItem(ROOM_KEY, JSON.stringify(migrated));
            localStorage.removeItem(LEGACY_KEY);
            return migrated;
        } catch (error) {
            console.warn("Lista antiga inválida, usando padrão.", error);
        }
    }

    localStorage.setItem(ROOM_KEY, JSON.stringify(DEFAULT_STATE));
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

// Salva o estado atual já limpo e normalizado.
function saveState(state) {
    const clean = cleanState(state);
    localStorage.setItem(ROOM_KEY, JSON.stringify(clean));
    return clean;
}

function roomDevices(room) {
    const state = loadState();
    return [...(state[roomName(room)] || [])];
}

function roomNames() {
    return Object.keys(loadState());
}

// Adiciona um novo dispositivo ao cômodo informado.
// Evita duplicidade e atualiza todas as telas que dependem do estado.
function addDevice(room, device) {
    const targetRoom = roomName(room);
    const targetDevice = text(device);
    if (!targetRoom || !targetDevice) return false;

    const state = loadState();
    const current = state[targetRoom] || [];
    if (current.some(item => item.toLowerCase() === targetDevice.toLowerCase())) return false;

    state[targetRoom] = cleanList([...current, targetDevice]);
    saveState(state);
    renderDashboard();
    renderRoomPage();
    renderManagementPage();
    return true;
}

// Remove um dispositivo do cômodo informado e refaz a renderização.
function removeDevice(room, device) {
    const targetRoom = roomName(room);
    const targetDevice = text(device);
    if (!targetRoom || !targetDevice) return false;

    const state = loadState();
    state[targetRoom] = cleanList((state[targetRoom] || []).filter(item => item.toLowerCase() !== targetDevice.toLowerCase()));
    saveState(state);
    renderDashboard();
    renderRoomPage();
    renderManagementPage();
    return true;
}

// Renderiza a lista de dispositivos dentro de cada card do dashboard.
function renderDashboard() {
    document.querySelectorAll(".room-device-list").forEach(list => {
        list.innerHTML = "";
        list.style.display = "none";
    });
}

// Renderiza a página de detalhes do cômodo com seus dispositivos.
function renderRoomPage() {
    const grid = document.getElementById("deviceGrid");
    if (!grid) return;

    const room = roomName(new URLSearchParams(window.location.search).get("room") || "Sala");
    const devices = roomDevices(room);
    const title = document.getElementById("dados-titulo");

    if (title) title.textContent = `Dados de Uso - ${room}`;
    grid.innerHTML = "";

    if (!devices.length) {
        const empty = document.createElement("div");
        empty.className = "device-empty-state";
        empty.textContent = "Nenhum dispositivo cadastrado para este cômodo.";
        grid.appendChild(empty);
        return;
    }

    devices.forEach(device => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "device-card";
        button.textContent = device;
        grid.appendChild(button);
    });
}

function getManageElements() {
    return {
        panel: document.getElementById("managementPanel"),
        title: document.getElementById("managementPanelTitle"),
        roomSelect: document.getElementById("manageRoomSelect"),
        deviceInput: document.getElementById("manageDeviceInput"),
        deviceInputWrap: document.getElementById("manageDeviceInputWrapper"),
        deviceSelect: document.getElementById("manageDeviceSelect"),
        deviceSelectWrap: document.getElementById("manageDeviceSelectWrapper"),
        deviceLabel: document.getElementById("manageDeviceLabel"),
        confirm: document.getElementById("confirmManagementAction"),
        close: document.getElementById("closeManagementPanel"),
        addBtn: document.getElementById("openAddPanel"),
        removeBtn: document.getElementById("openRemovePanel")
    };
}

// Atualiza os elementos do painel de gerenciamento conforme o modo atual.
function renderManagementPage() {
    const elements = getManageElements();
    if (!elements.panel) return;

    const rooms = roomNames();
    if (!rooms.length) return;

    if (!elements.roomSelect.dataset.ready) {
        elements.roomSelect.innerHTML = rooms.map(room => `<option value="${room}">${room}</option>`).join("");
        elements.roomSelect.dataset.ready = "true";
    }

    const selectedRoom = elements.roomSelect.value || rooms[0];
    const devices = roomDevices(selectedRoom);
    const isAddMode = elements.deviceSelect.dataset.mode !== "remove";

    if (elements.deviceInputWrap) elements.deviceInputWrap.style.display = isAddMode ? "block" : "none";
    if (elements.deviceSelectWrap) elements.deviceSelectWrap.style.display = isAddMode ? "none" : "block";

    if (isAddMode) {
        elements.deviceLabel.textContent = "Digite o nome do dispositivo:";
        elements.title.textContent = "Cadastrar dispositivo";
        elements.confirm.textContent = "Adicionar dispositivo";
        elements.confirm.disabled = !text(elements.deviceInput?.value || "").length;
        return;
    }

    elements.deviceLabel.textContent = "Escolha o dispositivo:";
    elements.title.textContent = "Remover dispositivo";
    elements.confirm.textContent = "Remover dispositivo";

    elements.deviceSelect.innerHTML = devices.length
        ? devices.map(device => `<option value="${device}">${device}</option>`).join("")
        : '<option value="">Nenhum dispositivo disponível</option>';

    elements.deviceSelect.disabled = !devices.length;
    elements.confirm.disabled = !devices.length;
}

// Inicializa os eventos do painel de gerenciamento (abrir, fechar, adicionar, remover).
function setupManagementPage() {
    const elements = getManageElements();
    if (!elements.panel) return;

    const open = mode => {
        elements.deviceSelect.dataset.mode = mode;
        if (elements.deviceInput) elements.deviceInput.value = "";
        renderManagementPage();
        elements.panel.classList.add("open");
        elements.panel.setAttribute("aria-hidden", "false");
        if (mode === "add" && elements.deviceInput) elements.deviceInput.focus();
    };

    const close = () => {
        elements.panel.classList.remove("open");
        elements.panel.setAttribute("aria-hidden", "true");
    };

    elements.addBtn?.addEventListener("click", () => open("add"));
    elements.removeBtn?.addEventListener("click", () => open("remove"));
    elements.close?.addEventListener("click", close);
    elements.roomSelect?.addEventListener("change", renderManagementPage);

    elements.deviceInput?.addEventListener("input", () => {
        elements.confirm.disabled = !text(elements.deviceInput.value).length;
    });

    elements.confirm?.addEventListener("click", () => {
        const selectedRoom = elements.roomSelect.value;
        if (!selectedRoom) return;

        let updated = false;

        if (elements.deviceSelect.dataset.mode === "remove") {
            const selectedDevice = elements.deviceSelect.value;
            if (!selectedDevice) return;
            updated = removeDevice(selectedRoom, selectedDevice);
        } else {
            const typedDevice = text(elements.deviceInput.value);
            if (!typedDevice) return;
            updated = addDevice(selectedRoom, typedDevice);
        }

        if (updated) {
            close();
            window.location.href = "dashboard.html";
        }
    });

    elements.panel.addEventListener("click", event => {
        if (event.target === elements.panel) close();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && elements.panel.classList.contains("open")) close();
    });

    renderManagementPage();
}

window.smartControlDevices = { loadState, saveState, addDevice, removeDevice, roomDevices, roomNames };
window.refreshRoomDeviceList = () => {
    renderDashboard();
    renderRoomPage();
    renderManagementPage();
};

(function () {
    renderDashboard();
    renderRoomPage();
    setupManagementPage();
})();

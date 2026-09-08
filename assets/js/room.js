const DEVICE_STORAGE_KEY = "smartcontrol-device-list";
const ROOM_DEVICE_DEFAULTS = [
    "Smart TV Samsung",
    "Robô aspirador de pó",
    "Ar condicionado Electrolux",
    "Persiana elétrica motorizada",
    "Lâmpada smart inteligente",
    "Interruptor inteligente",
    "Controle remoto inteligente",
    "Poltrona elétrica reclinável"
];

function getRoomDevices() {
    const stored = localStorage.getItem(DEVICE_STORAGE_KEY);

    if (!stored) {
        localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(ROOM_DEVICE_DEFAULTS));
        return [...ROOM_DEVICE_DEFAULTS];
    }

    try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.filter(Boolean).map(item => String(item).trim());
        }
    } catch (error) {
        console.warn("Lista de dispositivos compartilhada inválida.", error);
    }

    localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(ROOM_DEVICE_DEFAULTS));
    return [...ROOM_DEVICE_DEFAULTS];
}

function setRoomTitle(name) {
    const title = document.getElementById("dados-titulo");
    if (!title) return;
    title.textContent = `Dados de Uso - ${name}`;
}

function removeSelectedDevice() {
    const selected = document.querySelector(".device-card.selected");
    if (!selected) return;

    const selectedName = selected.textContent.trim();
    const updated = getRoomDevices().filter(item => item.toLowerCase() !== selectedName.toLowerCase());
    localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(updated));
    renderRoomDevices();
}

function renderRoomDevices() {
    const grid = document.getElementById("deviceGrid");
    const removeButton = document.getElementById("removeDeviceButton");
    if (!grid) return;

    const devices = getRoomDevices();
    grid.innerHTML = "";

    if (!devices.length) {
        const empty = document.createElement("p");
        empty.className = "device-empty-state";
        empty.textContent = "Nenhum dispositivo cadastrado.";
        grid.appendChild(empty);
        if (removeButton) removeButton.disabled = true;
        setRoomTitle("Selecione um aparelho");
        return;
    }

    devices.forEach((device, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "device-card";
        button.textContent = device.toUpperCase();

        if (index === 0) {
            button.classList.add("selected");
            setRoomTitle(device);
        }

        button.addEventListener("click", () => {
            document.querySelectorAll(".device-card").forEach(card => {
                card.classList.toggle("selected", card === button);
            });
            setRoomTitle(button.textContent.trim());
        });

        grid.appendChild(button);
    });

    if (removeButton) {
        removeButton.disabled = false;
    }
}

function setupRoomDeviceManagement() {
    const removeButton = document.getElementById("removeDeviceButton");
    if (!removeButton) return;

    removeButton.addEventListener("click", removeSelectedDevice);
}

window.refreshRoomDeviceList = function (devices) {
    if (Array.isArray(devices)) {
        localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(devices));
    }
    renderRoomDevices();
};

renderRoomDevices();
setupRoomDeviceManagement();

// main.js
// Arquivo responsável pela UI geral da aplicação:
// - tema claro/escuro
// - saudação e relógio
// - busca na tabela
// - menu lateral

let usuarioAtual = "Usuário";
const THEME_KEY = "smartcontrol-theme";

// Formata o offset do fuso horário em um formato tipo +00:00.
function formatClock(offset) {
    const sign = offset <= 0 ? "+" : "-";
    const abs = Math.abs(offset);
    return `${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
}

// Monta a string da data e hora atual para exibir na saudação.
function currentDateText() {
    const now = new Date();
    const week = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
    return `${week[now.getDay()]}, ${now.getDate()}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} – ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")} (${formatClock(now.getTimezoneOffset())})`;
}

function boasVindas() {
    const el = document.getElementById("mensagem");
    if (!el) return;
    el.textContent = `Olá, ${usuarioAtual}! Hoje é ${currentDateText()}`;
}

function iniciarRelogio() {
    const el = document.getElementById("mensagem");
    if (!el) return;

    const nomeUrl = new URLSearchParams(window.location.search).get("user");
    usuarioAtual = nomeUrl ? decodeURIComponent(nomeUrl) : (prompt("Digite seu nome e sobrenome:") || "Usuário");
    sessionStorage.setItem("usuarioAtual", usuarioAtual);
    boasVindas();
    setInterval(boasVindas, 1000);
}

function aplicarTema(tema) {
    document.body.classList.toggle("dark-mode", tema === "dark");
    document.body.setAttribute("data-theme", tema);
    localStorage.setItem(THEME_KEY, tema);

    const lamp = document.querySelector(".lampada-toggle");
    if (lamp) {
        lamp.setAttribute("aria-pressed", String(tema === "dark"));
        lamp.title = tema === "dark" ? "Ativar modo claro" : "Ativar modo escuro";
    }
}

function inicializarTema() {
    const lamp = document.querySelector(".lampada-toggle");
    if (!lamp) return;

    const tema = localStorage.getItem(THEME_KEY) || "light";
    aplicarTema(tema);
    lamp.addEventListener("click", () => {
        aplicarTema(document.body.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
}

function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

function normalizeForSearch(value) {
    return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function highlightCell(cell, term) {
    const original = cell.dataset.original || cell.textContent;
    if (!cell.dataset.original) cell.dataset.original = original;

    if (!term) {
        cell.innerHTML = escapeHTML(original);
        return;
    }

    const chars = Array.from(original);
    const map = [];
    let normalized = "";
    chars.forEach(char => {
        const plain = char.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        for (let i = 0; i < plain.length; i++) map.push(chars.indexOf(char));
        normalized += plain;
    });

    const search = normalizeForSearch(term);
    const rows = [];
    let start = 0;

    while (start < normalized.length) {
        const index = normalized.indexOf(search, start);
        if (index === -1) break;
        rows.push({ index, length: search.length });
        start = index + search.length;
    }

    if (!rows.length) {
        cell.innerHTML = escapeHTML(original);
        return;
    }

    let html = "";
    let last = 0;

    rows.forEach(match => {
        const startIndex = map[match.index] ?? 0;
        const endIndex = map[match.index + match.length - 1] ?? original.length;
        html += escapeHTML(original.slice(last, startIndex));
        html += `<mark>${escapeHTML(original.slice(startIndex, endIndex + 1))}</mark>`;
        last = endIndex + 1;
    });

    html += escapeHTML(original.slice(last));
    cell.innerHTML = html;
}

// Configura a busca da tabela: filtra linhas e destaca o texto encontrado.
function setupBuscaTabela() {
    const input = document.getElementById("campoBusca");
    const tbody = document.querySelector(".tabela-acesso tbody");
    const clearBtn = document.getElementById("clearBusca");
    if (!input || !tbody) return;

    const apply = () => {
        const termo = input.value.trim();
        const termoNorm = normalizeForSearch(termo);
        const linhas = Array.from(tbody.querySelectorAll("tr"));

        linhas.forEach(row => {
            const text = Array.from(row.querySelectorAll("td")).map(td => td.textContent).join(" ");
            const show = !termo || normalizeForSearch(text).includes(termoNorm);
            row.style.display = show ? "" : "none";
            row.querySelectorAll("td").forEach(td => highlightCell(td, show ? termo : ""));
        });

        if (clearBtn) clearBtn.style.display = termo ? "inline-block" : "none";
    };

    input.addEventListener("input", debounce(apply, 180));

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            input.value = "";
            input.focus();
            input.dispatchEvent(new Event("input", { bubbles: true }));
        });
    }
}

// Controla a abertura e fechamento da sidebar do menu lateral.
function setupSidebar() {
    const bars = document.querySelector(".bars-icon");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const closeBtn = document.getElementById("sidebarClose");
    if (!bars || !sidebar || !overlay) return;

    const open = () => {
        sidebar.classList.add("open");
        overlay.classList.add("open");
    };

    const close = () => {
        sidebar.classList.remove("open");
        overlay.classList.remove("open");
    };

    bars.addEventListener("click", e => {
        e.stopPropagation();
        sidebar.classList.contains("open") ? close() : open();
    });

    overlay.addEventListener("click", close);
    closeBtn?.addEventListener("click", close);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && sidebar.classList.contains("open")) close();
    });
}

inicializarTema();
iniciarRelogio();
setupBuscaTabela();
setupSidebar();

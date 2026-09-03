let usuarioAtual = "Usuário";
const THEME_KEY = "smartcontrol-theme";

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

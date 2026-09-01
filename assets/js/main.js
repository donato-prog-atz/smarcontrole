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
    exibirMensagemBoasVindas();0
    setInterval(exibirMensagemBoasVindas, 1000);
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

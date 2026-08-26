function obterNomeCompleto() {
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
    const fusoHorario = formatarFusoHorario(agora.getTimezoneOffset());

    return `${diaSemana}, ${diaMes}/${mesAtual}/${anoAtual} – ${horaAtual}:${minutoAtual} (${fusoHorario})`;
}

function exibirMensagemBoasVindas() {
    const usuario = obterNomeCompleto();
    const dataAtual = formatarDataAtual();
    const mensagemElemento = document.getElementById("mensagem");

    if (mensagemElemento) {
        
        mensagemElemento.textContent = `Olá, ${usuario}! Hoje é ${dataAtual}`;
    }
}

exibirMensagemBoasVindas();







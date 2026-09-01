// // room.js - comportamento básico da tela de detalhes
// (function(){
//     function getRoomFromUrl() {
//         const params = new URLSearchParams(window.location.search);
//         return params.get('room') || 'Sala';
//     }

//     function setHeaderRoom(roomName) {
//         const title = document.getElementById('dados-titulo');
//         if (title) title.textContent = `Dados de Uso - ${roomName}`;
//     }

//     function selectDefaultDevice() {
//         const first = document.querySelector('.device-card');
//         if (first) first.classList.add('selected');
//     }

//     function attachDeviceHandlers(){
//         const cards = document.querySelectorAll('.device-card');
//         cards.forEach(card => {
//             card.addEventListener('click', () => {
//                 cards.forEach(c=>c.classList.remove('selected'));
//                 card.classList.add('selected');
//                 const nome = card.textContent.trim();
//                 setHeaderRoom(nome);
//                 renderChartsFor(nome);
//             });
//         });
//     }

//     function renderChartsFor(name){
//         // coloque aqui lógica real; por enquanto renderizamos exemplos estáticos
//         renderPie([30, 45, 25]);
//         renderBars('#bar-chart-1', [40,60,20,80,55]);
//         renderBars('#bar-chart-2', [10,70,45,60,30]);
//     }

//     function renderPie(values){
//         const container = document.getElementById('pie-chart');
//         if (!container) return;
//         container.innerHTML = '';
//         const total = values.reduce((a,b)=>a+b,0);
//         const colors = ['#57d27a','#f2c94c','#3bc3c4'];
//         const svgNS = 'http://www.w3.org/2000/svg';
//         const svg = document.createElementNS(svgNS,'svg');
//         svg.setAttribute('viewBox','0 0 32 32');
//         svg.setAttribute('width','140');
//         svg.setAttribute('height','140');

//         let start = 0;
//         values.forEach((v, i) => {
//             const slice = document.createElementNS(svgNS,'circle');
//             const value = v/total;
//             slice.setAttribute('r','16');
//             slice.setAttribute('cx','16');
//             slice.setAttribute('cy','16');
//             slice.setAttribute('fill','transparent');
//             slice.setAttribute('stroke', colors[i%colors.length]);
//             slice.setAttribute('stroke-width','32');
//             slice.setAttribute('stroke-dasharray', `${value*100} ${100 - value*100}`);
//             slice.setAttribute('transform', `rotate(${start*3.6} 16 16)`);
//             start += value*100;
//             svg.appendChild(slice);
//         });

//         container.appendChild(svg);
//     }

//     function renderBars(selector, values){
//         const container = document.querySelector(selector);
//         if (!container) return;
//         container.innerHTML = '';
//         const max = Math.max(...values, 1);
//         values.forEach(v => {
//             const bar = document.createElement('div');
//             bar.className = 'bar';
//             bar.style.height = `${(v / max) * 100}%`;
//             container.appendChild(bar);
//         });
//     }

//     // Inicialização
//     document.addEventListener('DOMContentLoaded', ()=>{
//         const roomName = decodeURIComponent(getRoomFromUrl());
//         // Atualiza título do cabeçalho (h1) para manter contexto se desejar
//         const pageTitle = document.querySelector('.cabecalho-direita h1');
//         if (pageTitle) pageTitle.textContent = 'Dashboard';

//         // Define o título dos dados com base no primeiro dispositivo por padrão
//         setHeaderRoom('Robô aspirador de pó');
//         attachDeviceHandlers();
//         selectDefaultDevice();
//         renderChartsFor();
//     });
// })();

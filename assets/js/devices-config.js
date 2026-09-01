// // devices-config.js - Configuração centralizada de todos os dispositivos
// // Define as características, comandos e dados iniciais de cada dispositivo

// const DEVICES_CONFIG = {
//   // ==================== SMART TV SAMSUNG ====================
//   'smart_tv_samsung': {
//     id: 'smart_tv_samsung',
//     name: 'Smart TV Samsung',
//     type: 'tv',
//     icon: 'fa-tv',
//     room: 'Sala',
//     state: {
//       power: false,
//       volume: 20,
//       channel: 1,
//       brightness: 100
//     },
//     commands: [
//       { id: 'power', label: 'Ligar/Desligar', type: 'toggle', icon: 'fa-power-off' },
//       { id: 'volume_up', label: 'Aumentar Volume', type: 'action', icon: 'fa-volume-up' },
//       { id: 'volume_down', label: 'Diminuir Volume', type: 'action', icon: 'fa-volume-down' },
//       { id: 'channel_up', label: 'Próximo Canal', type: 'action', icon: 'fa-arrow-right' },
//       { id: 'channel_down', label: 'Canal Anterior', type: 'action', icon: 'fa-arrow-left' },
//       { id: 'brightness', label: 'Brilho', type: 'slider', icon: 'fa-sun' }
//     ],
//     info: ['Volume: 20%', 'Canal: 1', 'Brilho: 100%'],
//     chartData: { pie: [40, 35, 25], bar1: [45, 30, 50, 25, 60], bar2: [15, 45, 35, 55, 20] }
//   },

//   // ==================== ROBÔ ASPIRADOR ====================
//   'robo_aspirador_po': {
//     id: 'robo_aspirador_po',
//     name: 'Robô Aspirador de Pó',
//     type: 'vacuum',
//     icon: 'fa-circle',
//     room: 'Sala',
//     state: {
//       power: false,
//       mode: 'normal',
//       battery: 85,
//       status: 'parado'
//     },
//     commands: [
//       { id: 'power', label: 'Ligar/Desligar', type: 'toggle', icon: 'fa-power-off' },
//       { id: 'start_clean', label: 'Iniciar Limpeza', type: 'action', icon: 'fa-play' },
//       { id: 'pause', label: 'Pausar', type: 'action', icon: 'fa-pause' },
//       { id: 'return_base', label: 'Retornar à Base', type: 'action', icon: 'fa-home' },
//       { id: 'mode', label: 'Modo: Normal', type: 'cycle', icon: 'fa-sliders' }
//     ],
//     info: ['Bateria: 85%', 'Status: Parado', 'Modo: Normal'],
//     chartData: { pie: [30, 45, 25], bar1: [40, 60, 20, 80, 55], bar2: [10, 70, 45, 60, 30] }
//   },

//   // ==================== AR CONDICIONADO ====================
//   'ar_condicionado_electrolux': {
//     id: 'ar_condicionado_electrolux',
//     name: 'Ar Condicionado Electrolux',
//     type: 'ac',
//     icon: 'fa-snowflake',
//     room: 'Sala',
//     state: {
//       power: false,
//       temperature: 22,
//       mode: 'cooling',
//       fan_speed: 'medium'
//     },
//     commands: [
//       { id: 'power', label: 'Ligar/Desligar', type: 'toggle', icon: 'fa-power-off' },
//       { id: 'temp_up', label: 'Aumentar Temperatura', type: 'action', icon: 'fa-arrow-up' },
//       { id: 'temp_down', label: 'Diminuir Temperatura', type: 'action', icon: 'fa-arrow-down' },
//       { id: 'mode', label: 'Modo: Refrigeração', type: 'cycle', icon: 'fa-wind' },
//       { id: 'fan_speed', label: 'Velocidade: Média', type: 'cycle', icon: 'fa-fan' }
//     ],
//     info: ['Temperatura: 22°C', 'Modo: Refrigeração', 'Ventilador: Médio'],
//     chartData: { pie: [35, 40, 25], bar1: [50, 75, 30, 70, 45], bar2: [20, 60, 50, 65, 25] }
//   },

//   // ==================== PERSIANA ELÉTRICA ====================
//   'persiana_eletrica_motorizada': {
//     id: 'persiana_eletrica_motorizada',
//     name: 'Persiana Elétrica Motorizada',
//     type: 'blind',
//     icon: 'fa-square',
//     room: 'Sala',
//     state: {
//       position: 100,
//       status: 'fechada'
//     },
//     commands: [
//       { id: 'open', label: 'Abrir', type: 'action', icon: 'fa-arrow-up' },
//       { id: 'close', label: 'Fechar', type: 'action', icon: 'fa-arrow-down' },
//       { id: 'stop', label: 'Parar', type: 'action', icon: 'fa-stop' },
//       { id: 'position', label: 'Posição: 100%', type: 'slider', icon: 'fa-percent' }
//     ],
//     info: ['Posição: Fechada (100%)', 'Status: Parada'],
//     chartData: { pie: [25, 50, 25], bar1: [30, 45, 60, 35, 50], bar2: [5, 30, 20, 40, 10] }
//   },

//   // ==================== LÂMPADA SMART ====================
//   'lampada_smart_inteligente': {
//     id: 'lampada_smart_inteligente',
//     name: 'Lâmpada Smart Inteligente',
//     type: 'light',
//     icon: 'fa-lightbulb',
//     room: 'Sala',
//     state: {
//       power: false,
//       brightness: 100,
//       colorTemp: 'warm',
//       color: '#ffffff'
//     },
//     commands: [
//       { id: 'power', label: 'Ligar/Desligar', type: 'toggle', icon: 'fa-power-off' },
//       { id: 'brightness', label: 'Brilho: 100%', type: 'slider', icon: 'fa-sun' },
//       { id: 'color_temp', label: 'Cor: Branca', type: 'cycle', icon: 'fa-palette' }
//     ],
//     info: ['Estado: Desligada', 'Brilho: 100%', 'Temperatura: Branca'],
//     chartData: { pie: [20, 30, 50], bar1: [25, 35, 45, 30, 40], bar2: [8, 25, 18, 35, 12] }
//   },

//   // ==================== INTERRUPTOR INTELIGENTE ====================
//   'interruptor_inteligente': {
//     id: 'interruptor_inteligente',
//     name: 'Interruptor Inteligente',
//     type: 'switch',
//     icon: 'fa-toggle-on',
//     room: 'Sala',
//     state: {
//       power: false,
//       usage_count: 0,
//       last_used: 'Nunca'
//     },
//     commands: [
//       { id: 'power', label: 'Ligar/Desligar', type: 'toggle', icon: 'fa-power-off' }
//     ],
//     info: ['Estado: Desligado', 'Utilizações: 0', 'Último uso: Nunca'],
//     chartData: { pie: [15, 35, 50], bar1: [20, 30, 40, 25, 35], bar2: [5, 20, 15, 30, 10] }
//   },

//   // ==================== CONTROLE REMOTO INTELIGENTE ====================
//   'controle_remoto_inteligente': {
//     id: 'controle_remoto_inteligente',
//     name: 'Controle Remoto Inteligente',
//     type: 'remote',
//     icon: 'fa-gamepad',
//     room: 'Sala',
//     state: {
//       battery: 90,
//       paired: true,
//       last_command: 'Nenhum'
//     },
//     commands: [
//       { id: 'learn', label: 'Modo Aprendizado', type: 'action', icon: 'fa-brain' },
//       { id: 'clear', label: 'Limpar Memória', type: 'action', icon: 'fa-trash' }
//     ],
//     info: ['Bateria: 90%', 'Pareado: Sim', 'Último comando: Nenhum'],
//     chartData: { pie: [40, 35, 25], bar1: [35, 45, 55, 40, 50], bar2: [12, 35, 28, 45, 18] }
//   },

//   // ==================== POLTRONA ELÉTRICA ====================
//   'poltrona_eletrica_reclinavel': {
//     id: 'poltrona_eletrica_reclinavel',
//     name: 'Poltrona Elétrica Reclinável',
//     type: 'recliner',
//     icon: 'fa-chair',
//     room: 'Sala',
//     state: {
//       power: false,
//       position: 0,
//       massage: false
//     },
//     commands: [
//       { id: 'power', label: 'Ligar/Desligar', type: 'toggle', icon: 'fa-power-off' },
//       { id: 'recline', label: 'Reclinar', type: 'action', icon: 'fa-arrow-down' },
//       { id: 'return', label: 'Retornar', type: 'action', icon: 'fa-arrow-up' },
//       { id: 'massage', label: 'Massagem', type: 'toggle', icon: 'fa-hand' },
//       { id: 'position', label: 'Posição: 0°', type: 'slider', icon: 'fa-ruler' }
//     ],
//     info: ['Estado: Desligada', 'Posição: Reta (0°)', 'Massagem: Desativada'],
//     chartData: { pie: [30, 40, 30], bar1: [40, 50, 35, 65, 50], bar2: [10, 40, 30, 50, 20] }
//   }
// };

// // ==================== FUNÇÃO AUXILIAR ====================
// // Retorna a configuração de um dispositivo pelo ID
// function getDeviceConfig(deviceId) {
//   return DEVICES_CONFIG[deviceId] || null;
// }

// // Retorna todas os IDs dos dispositivos
// function getAllDeviceIds() {
//   return Object.keys(DEVICES_CONFIG);
// }

// // Retorna todos os nomes dos dispositivos para popolar cards
// function getAllDevices() {
//   return Object.values(DEVICES_CONFIG).map(d => ({
//     id: d.id,
//     name: d.name,
//     type: d.type
//   }));
// }

(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const stage = $('#stage'), screen = $('#screen');

  /* ---------- Definición de nombres de componentes ---------- */
  const NAMES = {
    socket: 'Zócalo CPU AM4',
    dimm: 'Ranuras RAM DDR4',
    atx24: 'Alimentación 24 pines',
    eps: 'Alimentación CPU 8 pines',
    vrm: 'Disipador VRM',
    chipset: 'Chipset B550',
    pcie16: 'Ranura PCIe x16',
    pcie1: 'Ranura PCIe x1',
    m2: 'Ranura M.2 NVMe',
    sata: 'Puertos SATA',
    io: 'Panel trasero E/S',
    cmos: 'Pila CMOS',
    usb3: 'Cabezal USB 3.0',
    fpanel: 'Conector panel frontal',
    wifi: 'Módulo Wi-Fi',
    cpufan: 'Ventilador CPU',
    audio: 'Códec de audio',
    bios: 'Chip BIOS',
    faudio: 'Audio frontal'
  };

  /* ---------- Layouts y coordenadas exactas de cada placa ---------- */
  const LAYOUTS = {
    msi: {
      w: 320, h: 380, c: {
        io: [0, 14, 34, 160, 17, 94],
        vrm: [34, 14, 44, 120, 56, 74],
        eps: [126, 2, 38, 13, 145, 8],
        socket: [94, 60, 84, 84, 136, 102],
        dimm: [202, 18, 46, 146, 225, 91],
        atx24: [298, 36, 16, 72, 306, 72],
        usb3: [288, 158, 18, 30, 297, 173],
        m2: [86, 166, 96, 22, 134, 177],
        pcie16: [22, 198, 192, 16, 118, 206],
        pcie1: [22, 230, 72, 13, 58, 236],
        cmos: [118, 232, 26, 26, 131, 245],
        chipset: [214, 242, 72, 72, 250, 278],
        sata: [282, 252, 34, 52, 299, 278],
        fpanel: [262, 354, 50, 14, 287, 361]
      }
    },
    asus: {
      w: 376, h: 376, c: {
        io: [0, 14, 38, 146, 19, 70],
        wifi: [2, 120, 38, 32, 21, 136],
        vrm: [40, 20, 38, 106, 59, 73],
        eps: [110, 2, 38, 13, 129, 8],
        cpufan: [176, 4, 30, 14, 191, 11],
        socket: [92, 56, 84, 84, 134, 98],
        dimm: [206, 18, 48, 144, 230, 90],
        atx24: [348, 34, 16, 72, 356, 70],
        m2: [88, 160, 94, 16, 135, 168],
        pcie16: [24, 194, 188, 16, 118, 202],
        cmos: [124, 228, 26, 26, 137, 241],
        chipset: [244, 236, 68, 68, 278, 270],
        sata: [334, 278, 34, 40, 351, 298],
        audio: [8, 324, 42, 40, 28, 344]
      }
    },
    giga: {
      w: 376, h: 376, c: {
        io: [0, 14, 38, 146, 19, 87],
        vrm: [40, 16, 42, 112, 61, 72],
        eps: [112, 2, 38, 13, 131, 8],
        socket: [92, 56, 84, 84, 134, 98],
        dimm: [206, 18, 48, 144, 230, 90],
        atx24: [348, 34, 16, 72, 356, 70],
        m2: [88, 160, 94, 16, 135, 168],
        pcie16: [24, 194, 188, 16, 118, 202],
        pcie1: [24, 232, 68, 13, 58, 238],
        chipset: [244, 236, 68, 68, 278, 270],
        sata: [334, 276, 34, 40, 351, 296],
        bios: [198, 344, 34, 22, 215, 355],
        fpanel: [298, 350, 52, 16, 324, 358],
        faudio: [48, 352, 36, 14, 66, 359]
      }
    },
    asrock: {
      w: 376, h: 376, c: {
        io: [0, 14, 38, 146, 19, 87],
        vrm: [40, 16, 42, 112, 61, 72],
        eps: [136, 2, 38, 13, 155, 8],
        socket: [94, 56, 84, 84, 136, 98],
        dimm: [206, 18, 48, 144, 230, 90],
        atx24: [348, 34, 16, 72, 356, 70],
        usb3: [334, 166, 18, 32, 343, 182],
        m2: [88, 160, 98, 22, 137, 171],
        pcie16: [24, 196, 188, 16, 118, 204],
        cmos: [124, 228, 26, 26, 137, 241],
        chipset: [244, 236, 68, 68, 278, 270],
        sata: [332, 262, 36, 52, 350, 288],
        audio: [8, 322, 42, 40, 28, 342],
        bios: [202, 344, 28, 18, 217, 353]
      }
    }
  };

  const BOARDS = [
    {
      id: 'msi',
      name: 'MSI MPG B550 GAMING PLUS',
      sub: 'AM4 · B550 · ATX · DDR4',
      badge: 'ATX · MSI Gaming',
      desc: 'Formato ATX completo con disipador VRM extendido, M.2 Shield Frozr y PCIe con Steel Armor.',
      L: LAYOUTS.msi,
      keys: ['socket', 'dimm', 'atx24', 'eps', 'vrm', 'chipset', 'pcie16', 'pcie1', 'm2', 'sata', 'io', 'cmos', 'usb3', 'fpanel']
    },
    {
      id: 'asus',
      name: 'ASUS PRIME B550M-A WIFI II',
      sub: 'AM4 · B550 · Micro-ATX · Wi-Fi 6 · DDR4',
      badge: 'Micro-ATX · ASUS Prime',
      desc: 'Placa cuadrada Micro-ATX con diseño geométrico Cyber-Lines, Wi-Fi 6 integrado y ASUS SafeSlot Core.',
      L: LAYOUTS.asus,
      wifi: true,
      keys: ['socket', 'dimm', 'atx24', 'eps', 'vrm', 'chipset', 'pcie16', 'm2', 'sata', 'io', 'cmos', 'wifi', 'cpufan', 'audio']
    },
    {
      id: 'giga',
      name: 'Gigabyte B550M Aorus Elite',
      sub: 'AM4 · B550 · Micro-ATX · DDR4',
      badge: 'Micro-ATX · Aorus Elite',
      desc: 'Estética Aorus Falcon con VRM angular, PCIe Ultra Durable Armor y botón Q-Flash Plus en placa.',
      L: LAYOUTS.giga,
      keys: ['socket', 'dimm', 'atx24', 'eps', 'vrm', 'chipset', 'pcie16', 'pcie1', 'm2', 'sata', 'io', 'bios', 'fpanel', 'faudio']
    },
    {
      id: 'asrock',
      name: 'ASRock B550M Pro4',
      sub: 'AM4 · B550 · Micro-ATX · DDR4',
      badge: 'Micro-ATX · ASRock Super Alloy',
      desc: 'PCB Sapphire Black con franjas deportivas blancas, doble disipador XXL de aluminio y M.2 Armor.',
      L: LAYOUTS.asrock,
      keys: ['socket', 'dimm', 'atx24', 'eps', 'vrm', 'chipset', 'pcie16', 'm2', 'sata', 'io', 'cmos', 'usb3', 'audio', 'bios']
    }
  ];

  /* ---------- Gráficos SVG Ultra Realistas ---------- */
  function svgDefs() {
    return `
    <defs>
      <!-- Brushed Dark Metal (MSI / Gigabyte) -->
      <linearGradient id="g-alum-dark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2c2e35"/>
        <stop offset="25%" stop-color="#1b1c20"/>
        <stop offset="50%" stop-color="#383c47"/>
        <stop offset="75%" stop-color="#1e2025"/>
        <stop offset="100%" stop-color="#141518"/>
      </linearGradient>

      <!-- Brushed Silver Aluminum (ASUS / ASRock) -->
      <linearGradient id="g-alum-silver" x1="0%" y1="0%" x2="100%" y2="80%">
        <stop offset="0%" stop-color="#c8ced8"/>
        <stop offset="25%" stop-color="#edf2f8"/>
        <stop offset="50%" stop-color="#a4abb8"/>
        <stop offset="75%" stop-color="#f4f8fd"/>
        <stop offset="100%" stop-color="#939aa5"/>
      </linearGradient>

      <!-- Stainless Steel Armor (PCIe x16) -->
      <linearGradient id="g-steel" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#b2bac5"/>
        <stop offset="18%" stop-color="#ffffff"/>
        <stop offset="45%" stop-color="#8a93a0"/>
        <stop offset="68%" stop-color="#eef3f7"/>
        <stop offset="100%" stop-color="#646d79"/>
      </linearGradient>

      <!-- Gold Audio Capacitor -->
      <linearGradient id="g-gold-cap" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#b3820a"/>
        <stop offset="28%" stop-color="#ffe24d"/>
        <stop offset="55%" stop-color="#cf980f"/>
        <stop offset="80%" stop-color="#fff4a3"/>
        <stop offset="100%" stop-color="#8a5a02"/>
      </linearGradient>

      <!-- Solid Polymer Capacitor (Silver Can) -->
      <linearGradient id="g-cap-can" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#dce1e8"/>
        <stop offset="50%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#9aa0ac"/>
      </linearGradient>

      <!-- CMOS Coin Battery CR2032 -->
      <linearGradient id="g-cmos" x1="20%" y1="20%" x2="80%" y2="80%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="35%" stop-color="#d4dbe4"/>
        <stop offset="70%" stop-color="#f8fafc"/>
        <stop offset="100%" stop-color="#94a3b8"/>
      </linearGradient>

      <!-- AM4 Socket Cream Plastic -->
      <linearGradient id="g-am4-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#eff2f5"/>
        <stop offset="50%" stop-color="#dfe3e8"/>
        <stop offset="100%" stop-color="#cdd3da"/>
      </linearGradient>

      <!-- Lever Chrome -->
      <linearGradient id="g-lever" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#cbd5e1"/>
        <stop offset="50%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#94a3b8"/>
      </linearGradient>

      <!-- PCB subtle surface lighting -->
      <linearGradient id="g-pcb-light" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.04"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.25"/>
      </linearGradient>

      <!-- Drop Shadows for 3D realism -->
      <filter id="f-drop-sm" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0.8" dy="1.2" stdDeviation="0.8" flood-color="#000" flood-opacity="0.6"/>
      </filter>
      <filter id="f-drop-lg" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="1.5" dy="2.2" stdDeviation="1.8" flood-color="#000" flood-opacity="0.7"/>
      </filter>

      <!-- High density pin patterns -->
      <pattern id="pat-am4" width="3" height="3" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="0.75" fill="#475569"/>
      </pattern>
      <pattern id="pat-dimm" width="2" height="6" patternUnits="userSpaceOnUse">
        <rect x="0.5" y="1" width="1" height="4" fill="#d97706" opacity="0.85"/>
      </pattern>
    </defs>
    `;
  }

  const R = (x, y, w, h, f, s, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"${s ? ` stroke="${s}" stroke-width="1"` : ''} ${extra}/>`;
  const C = (x, y, r, f, s, sw = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"${s ? ` stroke="${s}" stroke-width="${sw}"` : ''}/>`;
  const T = (x, y, text, size, fill, weight = 'normal', anchor = 'start', extra = '') => `<text x="${x}" y="${y}" font-size="${size}" font-family="Arial, sans-serif" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" ${extra}>${text}</text>`;

  function drawMountHole(x, y) {
    let o = C(x, y, 6.5, '#737a85', '#2a2e35', 0.5);
    for (let a = 0; a < 360; a += 45) {
      const rad = a * Math.PI / 180;
      const x1 = x + Math.cos(rad) * 4.2, y1 = y + Math.sin(rad) * 4.2;
      const x2 = x + Math.cos(rad) * 6.5, y2 = y + Math.sin(rad) * 6.5;
      o += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#cbd5e1" stroke-width="1"/>`;
    }
    o += C(x, y, 3.5, '#0b0b0e', '#334155', 0.8);
    return o;
  }

  function drawCap(x, y, markColor = '#2563eb', d = 8) {
    const r = d / 2;
    let o = C(x, y, r, 'url(#g-cap-can)', '#475569', 0.5);
    o += `<path d="M ${x - r * 0.75} ${y} A ${r * 0.75} ${r * 0.75} 0 0 1 ${x + r * 0.75} ${y} Z" fill="${markColor}" opacity="0.85"/>`;
    o += `<line x1="${x - r + 1}" y1="${y}" x2="${x + r - 1}" y2="${y}" stroke="rgba(255,255,255,0.4)" stroke-width="0.5"/>`;
    return o;
  }

  function drawChoke(x, y, size = 9, label = 'R80') {
    let o = `<g filter="url(#f-drop-sm)">`;
    o += R(x, y, size, size, '#1e2025', '#333742', 'rx="1"');
    o += R(x + 1, y + 1, size - 2, size - 2, '#282b33', '#111317', 'rx="0.5"');
    if (size >= 8) {
      o += T(x + size / 2, y + size / 2 + 2, label, 3.2, '#94a3b8', 'bold', 'middle');
    }
    o += `</g>`;
    return o;
  }

  function drawAM4(x, y, w, h) {
    let o = `<g filter="url(#f-drop-lg)">`;
    o += R(x, y, w, h, 'url(#g-am4-body)', '#94a3b8', 'rx="3"');
    o += R(x + 2, y + 2, w - 4, h - 4, '#edf2f7', 'rgba(0,0,0,0.15)', 'rx="2"');

    // Retention brackets (top and bottom)
    o += R(x + 10, y - 6, w - 20, 9, '#18191c', '#0f1012', 'rx="1.5"');
    o += R(x + w / 2 - 10, y - 8, 20, 3, '#2a2c32', '#0f1012', 'rx="1"');
    o += C(x + 16, y - 1.5, 2.4, '#cbd5e1', '#475569', 0.5);
    o += `<path d="M ${x + 14.5} ${y - 1.5} h 3 M ${x + 16} ${y - 3} v 3" stroke="#475569" stroke-width="0.7"/>`;
    o += C(x + w - 16, y - 1.5, 2.4, '#cbd5e1', '#475569', 0.5);
    o += `<path d="M ${x + w - 17.5} ${y - 1.5} h 3 M ${x + w - 16} ${y - 3} v 3" stroke="#475569" stroke-width="0.7"/>`;

    o += R(x + 10, y + h - 3, w - 20, 9, '#18191c', '#0f1012', 'rx="1.5"');
    o += R(x + w / 2 - 10, y + h + 5, 20, 3, '#2a2c32', '#0f1012', 'rx="1"');
    o += C(x + 16, y + h + 1.5, 2.4, '#cbd5e1', '#475569', 0.5);
    o += `<path d="M ${x + 14.5} ${y + h + 1.5} h 3 M ${x + 16} ${y + h} v 3" stroke="#475569" stroke-width="0.7"/>`;
    o += C(x + w - 16, y + h + 1.5, 2.4, '#cbd5e1', '#475569', 0.5);
    o += `<path d="M ${x + w - 17.5} ${y + h + 1.5} h 3 M ${x + w - 16} ${y + h} v 3" stroke="#475569" stroke-width="0.7"/>`;

    // Pin matrix
    const pw = w - 18, ph = h - 18, px = x + 9, py = y + 9;
    o += R(px, py, pw, ph, '#cad1d8', '#8b939e');
    o += R(px, py, pw, ph, 'url(#pat-am4)');

    // AMD AM4 Central Voids
    o += R(px + pw / 2 - 10, py + ph / 2 - 12, 20, 24, '#d8dee6', '#9aa2ad');
    o += T(px + pw / 2, py + ph / 2 - 2, 'AMD', 6.5, '#475569', 'bold', 'middle');
    o += T(px + pw / 2, py + ph / 2 + 7, 'SOCKET AM4', 4.5, '#64748b', 'bold', 'middle');
    o += `<polygon points="${px + 2},${py + ph - 2} ${px + 7},${py + ph - 2} ${px + 2},${py + ph - 7}" fill="#f59e0b"/>`;

    // Chrome Lever
    o += R(x + w + 1, y + 4, 3, h - 8, 'url(#g-lever)', '#64748b', 'rx="1"');
    o += C(x + w + 2.5, y + 5, 3, '#94a3b8', '#475569');
    o += R(x + w + 1, y + h - 6, 7, 5, '#1e293b', '#0f172a', 'rx="1"');
    o += `</g>`;
    return o;
  }

  function drawDIMM(x, y, w, h, isAsus = false) {
    let o = `<g filter="url(#f-drop-sm)">`;
    const slotW = (w - 6) / 4;
    for (let i = 0; i < 4; i++) {
      const sx = x + i * (slotW + 2);
      const isGray = isAsus && (i === 1 || i === 3);
      const bodyColor = isGray ? '#6b7280' : '#1e2025';
      const latchColor = isGray ? '#9ca3af' : '#e2e8f0';

      o += R(sx, y, slotW, h, bodyColor, '#111317', 'rx="1"');
      const tw = slotW - 3;
      o += R(sx + 1.5, y + 8, tw, h - 16, '#090a0c', '#262930');
      o += R(sx + 2, y + 10, tw - 1, h - 20, 'url(#pat-dimm)');
      o += R(sx + 1, y + Math.round(h * 0.56), tw + 1, 3, bodyColor);

      o += R(sx - 0.5, y - 2, slotW + 1, 6, latchColor, '#334155', 'rx="1"');
      if (isAsus) {
        o += R(sx + 0.5, y + h - 4, slotW - 1, 4, bodyColor, '#111317');
      } else {
        o += R(sx - 0.5, y + h - 4, slotW + 1, 6, latchColor, '#334155', 'rx="1"');
      }
      o += T(sx + slotW / 2, y + h + 8, `DDR4_${i + 1}`, 3.2, '#94a3b8', 'bold', 'middle');
    }
    o += `</g>`;
    return o;
  }

  function drawPCIe16(x, y, w, h, isSteel = true) {
    let o = `<g filter="url(#f-drop-sm)">`;
    if (isSteel) {
      o += R(x, y, w, h, 'url(#g-steel)', '#475569', 'rx="1.5"');
      o += R(x + 12, y - 1, 6, 2, '#cbd5e1', '#334155');
      o += R(x + w - 24, y - 1, 6, 2, '#cbd5e1', '#334155');
      o += R(x + 12, y + h - 1, 6, 2, '#cbd5e1', '#334155');
      o += R(x + w - 24, y + h - 1, 6, 2, '#cbd5e1', '#334155');
      o += R(x + 4, y + 3, w - 22, h - 6, '#0f1115', '#2a2e36');
      o += R(x + 20, y + 2, 3, h - 4, '#475569');
    } else {
      o += R(x, y, w, h, '#18191d', '#333740', 'rx="1"');
      o += R(x + 4, y + 3, w - 22, h - 6, '#0b0c0e', '#22252c');
      o += R(x + 20, y + 2, 3, h - 4, '#18191d');
    }
    o += `<line x1="${x + 6}" y1="${y + h / 2}" x2="${x + 18}" y2="${y + h / 2}" stroke="#d97706" stroke-dasharray="1 1" stroke-width="2"/>`;
    o += `<line x1="${x + 24}" y1="${y + h / 2}" x2="${x + w - 20}" y2="${y + h / 2}" stroke="#d97706" stroke-dasharray="1 1" stroke-width="2"/>`;
    o += R(x + w - 16, y - 2, 16, h + 4, '#1e293b', '#0f172a', 'rx="1.5"');
    o += R(x + w - 12, y + 1, 10, h - 2, '#334155', '#1e293b', 'rx="1"');
    o += `</g>`;
    return o;
  }

  function drawPCIe1(x, y, w, h) {
    let o = `<g filter="url(#f-drop-sm)">`;
    o += R(x, y, w, h, '#18191d', '#374151', 'rx="1"');
    o += R(x + 3, y + 2.5, w - 12, h - 5, '#0b0c0e', '#1f2937');
    o += `<line x1="${x + 6}" y1="${y + h / 2}" x2="${x + w - 12}" y2="${y + h / 2}" stroke="#d97706" stroke-dasharray="1 1" stroke-width="1.8"/>`;
    o += R(x + w - 8, y - 1, 8, h + 2, '#334155', '#0f172a', 'rx="1"');
    o += `</g>`;
    return o;
  }

  function drawM2(x, y, w, h, boardId) {
    let o = `<g filter="url(#f-drop-sm)">`;
    if (boardId === 'msi') {
      o += R(x, y, w, h, 'url(#g-alum-dark)', '#475569', 'rx="2"');
      o += `<polygon points="${x + w - 14},${y} ${x + w},${y + 8} ${x + w},${y + h} ${x + w - 14},${y + h}" fill="#22252c"/>`;
      o += `<line x1="${x + 4}" y1="${y + 2}" x2="${x + w - 16}" y2="${y + 2}" stroke="#d32f2f" stroke-width="1.5"/>`;
      o += T(x + 12, y + h / 2 + 3, 'M.2 SHIELD FROZR', 5.5, '#e2e8f0', 'bold');
      o += C(x + w - 7, y + h / 2, 3.5, '#cbd5e1', '#334155', 0.8);
      o += `<path d="M ${x + w - 9} ${y + h / 2} h 4 M ${x + w - 7} ${y + h / 2 - 2} v 4" stroke="#475569" stroke-width="0.8"/>`;
    } else if (boardId === 'asrock') {
      o += R(x, y, w, h, 'url(#g-alum-silver)', '#64748b', 'rx="2"');
      o += `<line x1="${x + 4}" y1="${y + 3}" x2="${x + w - 16}" y2="${y + 3}" stroke="#ffffff" stroke-width="1"/>`;
      o += T(x + 12, y + h / 2 + 3, 'M.2 ARMOR · HYPER M.2', 5, '#1e293b', 'bold');
      o += C(x + w - 7, y + h / 2, 3.5, '#94a3b8', '#334155', 0.8);
      o += `<path d="M ${x + w - 9} ${y + h / 2} h 4 M ${x + w - 7} ${y + h / 2 - 2} v 4" stroke="#475569" stroke-width="0.8"/>`;
    } else {
      o += R(x, y + 2, 12, h - 4, '#18191c', '#3b4252', 'rx="1"');
      o += `<line x1="${x + 2}" y1="${y + h / 2}" x2="${x + 10}" y2="${y + h / 2}" stroke="#d97706" stroke-dasharray="1 1" stroke-width="2"/>`;
      o += R(x + 14, y + 3, w - 16, h - 6, 'rgba(15, 23, 42, 0.45)', '#334155', 'stroke-dasharray="2 2"');
      for (const sx of [x + 36, x + 56, x + w - 8]) {
        o += C(sx, y + h / 2, 3.2, '#eab308', '#78350f', 0.5);
        o += C(sx, y + h / 2, 1.8, '#cbd5e1', '#334155', 0.5);
      }
      o += T(x + 20, y + h / 2 + 2.5, 'PCIE 4.0 M.2', 4.5, '#64748b', 'bold');
    }
    o += `</g>`;
    return o;
  }

  function drawCMOS(x, y, w, h) {
    const cx = x + w / 2, cy = y + h / 2, r = w / 2;
    let o = `<g filter="url(#f-drop-sm)">`;
    o += C(cx, cy, r, '#141518', '#333741', 1);
    o += `<path d="M ${cx - 4} ${cy - r - 1} h 8 v 3 h -8 Z" fill="#94a3b8" stroke="#475569" stroke-width="0.5"/>`;
    o += C(cx, cy, r - 2.5, 'url(#g-cmos)', '#64748b', 0.8);
    o += T(cx, cy - 2.5, '+', 7, '#475569', 'bold', 'middle');
    o += T(cx, cy + 2.5, 'CR2032', 4, '#475569', 'bold', 'middle');
    o += T(cx, cy + 6.5, 'LITHIUM 3V', 2.8, '#64748b', 'normal', 'middle');
    o += `</g>`;
    return o;
  }

  function drawATX24(x, y, w, h) {
    let o = `<g filter="url(#f-drop-sm)">`;
    o += R(x, y, w, h, '#18191c', '#475569', 'rx="1"');
    o += R(x - 2, y + h / 2 - 10, 2.5, 20, '#334155', '#1e293b', 'rx="0.5"');
    const pinH = (h - 6) / 12;
    for (let r = 0; r < 12; r++) {
      const py = y + 3 + r * pinH;
      o += R(x + 2.5, py + 0.5, pinH - 1, pinH - 1, '#090a0c', '#334155');
      o += R(x + w / 2 + 0.5, py + 0.5, pinH - 1, pinH - 1, '#090a0c', '#334155');
      o += C(x + 2.5 + (pinH - 1) / 2, py + 0.5 + (pinH - 1) / 2, 0.8, '#f59e0b');
      o += C(x + w / 2 + 0.5 + (pinH - 1) / 2, py + 0.5 + (pinH - 1) / 2, 0.8, '#f59e0b');
    }
    o += `</g>`;
    return o;
  }

  function drawEPS8(x, y, w, h) {
    let o = `<g filter="url(#f-drop-sm)">`;
    o += R(x, y, w, h, '#18191c', '#475569', 'rx="1"');
    o += R(x + w / 2 - 8, y - 2, 16, 2.5, '#334155', '#1e293b', 'rx="0.5"');
    const pinW = (w - 6) / 4;
    for (let c = 0; c < 4; c++) {
      const px = x + 3 + c * pinW;
      o += R(px + 0.5, y + 2, pinW - 1, (h - 6) / 2, '#090a0c', '#334155');
      o += R(px + 0.5, y + h / 2 + 1, pinW - 1, (h - 6) / 2, '#090a0c', '#334155');
      o += C(px + pinW / 2, y + 2 + (h - 6) / 4, 0.8, '#f59e0b');
      o += C(px + pinW / 2, y + h / 2 + 1 + (h - 6) / 4, 0.8, '#f59e0b');
    }
    o += `</g>`;
    return o;
  }

  function drawSATA(x, y, w, h, count = 4) {
    let o = `<g filter="url(#f-drop-sm)">`;
    const rows = count <= 4 ? 2 : 3;
    const bh = (h - (rows - 1) * 3) / rows;
    for (let r = 0; r < rows; r++) {
      const py = y + r * (bh + 3);
      o += R(x, py, w, bh, '#111215', '#374151', 'rx="1"');
      const subW = (w - 5) / 2;
      for (let c = 0; c < 2; c++) {
        const px = x + 2 + c * (subW + 1);
        o += R(px, py + 1.5, subW, bh - 3, '#090a0c', '#1f242d');
        o += `<path d="M ${px + 2} ${py + 3} h 6 v 2 h -4 v ${bh - 8} h -2 Z" fill="#dc2626"/>`;
        o += `<line x1="${px + 4}" y1="${py + bh - 4}" x2="${px + subW - 3}" y2="${py + bh - 4}" stroke="#d97706" stroke-width="1"/>`;
      }
    }
    o += `</g>`;
    return o;
  }

  function drawRearIO(x, y, w, h, boardId) {
    let o = `<g filter="url(#f-drop-sm)">`;
    const isMsi = boardId === 'msi';
    const baseFill = isMsi ? '#141518' : '#cbd5e1';
    const stroke = isMsi ? '#2a2e37' : '#64748b';
    o += R(x, y, w, h, baseFill, stroke, 'rx="1.5"');

    let cy = y + 4;
    if (isMsi) {
      o += C(x + 8, cy + 4, 3, '#334155', '#94a3b8');
      o += C(x + w - 12, cy + 6, 5, '#8b5cf6', '#1e1b4b');
      o += R(x + 4, cy + 14, w - 8, 12, '#18191c', '#475569');
      cy += 30;
      o += R(x + 4, cy, w - 8, 14, '#94a3b8', '#334155');
      o += R(x + 6, cy + 2, w - 12, 10, '#0f172a');
      o += R(x + 4, cy + 18, w - 8, 13, '#94a3b8', '#334155');
      o += R(x + 6, cy + 20, w - 12, 9, '#0f172a');
      cy += 36;
      o += R(x + 4, cy, w - 8, 14, '#1e40af', '#1e3a8a');
      cy += 18;
      o += R(x + 4, cy, w - 8, 18, '#64748b', '#334155');
      o += R(x + 6, cy + 2, w - 12, 14, '#0f172a');
      o += C(x + 8, cy + 14, 1.2, '#22c55e');
      o += C(x + w - 8, cy + 14, 1.2, '#f97316');
      cy += 22;
      o += R(x + 4, cy, (w - 10) / 2, 12, '#dc2626', '#991b1b');
      o += R(x + (w - 10) / 2 + 6, cy + 2, (w - 10) / 2 - 2, 8, '#334155', '#64748b', 'rx="3"');
      cy += 16;
      o += R(x + 4, cy, 10, 10, '#000000', '#dc2626');
      o += C(x + 9, cy + 5, 2, '#ef4444');
      for (let i = 0; i < 5; i++) {
        const jx = x + 8 + (i % 2) * 16, jy = cy + 14 + Math.floor(i / 2) * 11;
        o += C(jx, jy, 4, '#1e293b', '#eab308', 1);
        o += C(jx, jy, 1.8, '#000000');
      }
    } else if (boardId === 'asus') {
      o += C(x + 12, cy + 7, 6, '#8b5cf6', '#1e1b4b');
      cy += 18;
      o += R(x + 4, cy, w - 8, 16, '#2563eb', '#1d4ed8');
      o += T(x + w / 2, cy + 11, 'VGA', 4, '#ffffff', 'bold', 'middle');
      cy += 20;
      o += R(x + 4, cy, w - 8, 16, '#e2e8f0', '#64748b');
      cy += 20;
      o += R(x + 4, cy, w - 8, 12, '#94a3b8', '#334155');
      cy += 16;
      o += R(x + 4, cy, w - 8, 14, '#0d9488', '#115e59');
      cy += 18;
      o += R(x + 4, cy, w - 8, 16, '#64748b', '#334155');
      cy += 20;
      o += C(x + 10, cy + 6, 4.5, '#eab308', '#78350f', 1);
      o += C(x + 10, cy + 6, 1.2, '#0f172a');
      o += C(x + w - 10, cy + 6, 4.5, '#eab308', '#78350f', 1);
      o += C(x + w - 10, cy + 6, 1.2, '#0f172a');
      cy += 16;
      const colors = ['#3b82f6', '#22c55e', '#ec4899'];
      for (let i = 0; i < 3; i++) {
        o += C(x + 7 + i * 11, cy + 6, 4.2, colors[i], '#1e293b', 1);
        o += C(x + 7 + i * 11, cy + 6, 1.8, '#0f172a');
      }
    } else if (boardId === 'giga') {
      o += C(x + 12, cy + 7, 6, '#8b5cf6', '#1e1b4b');
      cy += 18;
      o += R(x + 4, cy, w - 8, 16, '#e2e8f0', '#64748b');
      cy += 20;
      o += R(x + 4, cy, w - 8, 12, '#94a3b8', '#334155');
      cy += 16;
      o += R(x + 4, cy, w - 8, 14, '#1d4ed8', '#1e3a8a');
      cy += 18;
      o += R(x + 4, cy, w - 8, 16, '#64748b', '#334155');
      cy += 20;
      o += R(x + 4, cy, w - 8, 14, '#18191c', '#475569');
      cy += 18;
      const colors = ['#3b82f6', '#22c55e', '#ec4899'];
      for (let i = 0; i < 3; i++) {
        o += C(x + 7 + i * 11, cy + 6, 4.2, colors[i], '#1e293b', 1);
        o += C(x + 7 + i * 11, cy + 6, 1.8, '#0f172a');
      }
    } else {
      o += R(x + 4, cy, w - 8, 16, '#2563eb', '#1d4ed8');
      cy += 20;
      o += R(x + 4, cy, w - 8, 12, '#94a3b8', '#334155');
      cy += 16;
      o += R(x + 4, cy, w - 8, 13, '#64748b', '#334155');
      cy += 17;
      o += R(x + 4, cy, (w - 10) / 2, 12, '#dc2626', '#991b1b');
      o += R(x + (w - 10) / 2 + 6, cy + 2, (w - 10) / 2 - 2, 8, '#334155', '#64748b', 'rx="3"');
      cy += 16;
      o += R(x + 4, cy, w - 8, 16, '#64748b', '#334155');
      cy += 20;
      o += R(x + 4, cy, w - 8, 14, '#1d4ed8', '#1e3a8a');
      cy += 18;
      const colors = ['#3b82f6', '#22c55e', '#ec4899'];
      for (let i = 0; i < 3; i++) {
        o += C(x + 7 + i * 11, cy + 6, 4.2, colors[i], '#1e293b', 1);
        o += C(x + 7 + i * 11, cy + 6, 1.8, '#0f172a');
      }
    }
    o += `</g>`;
    return o;
  }

  function drawAudio(x, y, w, h, isElna = false) {
    let o = `<g>`;
    o += `<path d="M ${x - 4} ${y - 12} C ${x + w + 8} ${y - 12}, ${x + w + 8} ${y + h}, ${x + 6} ${y + h + 10}" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="8 2" opacity="0.85"/>`;
    o += R(x + 4, y + 4, 16, 16, '#18191d', '#475569', 'rx="1"');
    o += `<circle cx="${x + 7}" cy="${y + 7}" r="1" fill="#94a3b8"/>`;
    o += T(x + 12, y + 14, 'ALC', 4, '#94a3b8', 'bold', 'middle');

    const capGrad = isElna ? '#1e2025' : 'url(#g-gold-cap)';
    const stroke = isElna ? '#eab308' : '#854d0e';
    const caps = [
      [x + 26, y + 8, 7],
      [x + 35, y + 8, 7],
      [x + 26, y + 20, 7],
      [x + 35, y + 20, 7],
      [x + 12, y + 26, 6]
    ];
    for (const [cx, cy, d] of caps) {
      o += `<g filter="url(#f-drop-sm)">`;
      o += C(cx, cy, d / 2, capGrad, stroke, 0.8);
      o += `<path d="M ${cx - d / 4} ${cy - d / 2 + 0.5} A ${d / 2} ${d / 2} 0 0 1 ${cx + d / 4} ${cy - d / 2 + 0.5} Z" fill="#000000" opacity="0.6"/>`;
      o += `<path d="M ${cx - 1.5} ${cy} h 3 M ${cx} ${cy - 1.5} v 3" stroke="#eab308" stroke-width="0.5"/>`;
      o += `</g>`;
    }
    o += `</g>`;
    return o;
  }

  function drawFrontPanel(x, y, w, h) {
    let o = `<g filter="url(#f-drop-sm)">`;
    o += R(x, y, w, h, '#18191c', '#475569', 'rx="1"');
    const dx = (w - 6) / 5;
    for (let c = 0; c < 5; c++) {
      const px = x + 3 + c * dx + dx / 2;
      o += C(px, y + 3.5, 0.9, '#f59e0b');
      if (c !== 4) o += C(px, y + h - 3.5, 0.9, '#f59e0b');
    }
    o += T(x + w / 2, y + h + 6, 'JFP1 / PANEL', 3.5, '#94a3b8', 'bold', 'middle');
    o += `</g>`;
    return o;
  }

  function drawFrontAudio(x, y, w, h) {
    let o = `<g filter="url(#f-drop-sm)">`;
    o += R(x, y, w, h, '#18191c', '#475569', 'rx="1"');
    const dx = (w - 6) / 5;
    for (let c = 0; c < 5; c++) {
      const px = x + 3 + c * dx + dx / 2;
      if (c !== 3) o += C(px, y + 3.5, 0.9, '#f59e0b');
      o += C(px, y + h - 3.5, 0.9, '#f59e0b');
    }
    o += T(x + w / 2, y + h + 6, 'JAUD1 / AUDIO', 3.5, '#94a3b8', 'bold', 'middle');
    o += `</g>`;
    return o;
  }

  function drawUSB3(x, y, w, h) {
    let o = `<g filter="url(#f-drop-sm)">`;
    o += R(x, y, w, h, '#1d4ed8', '#1e3a8a', 'rx="1.5"');
    o += R(x + 2, y + 2, w - 4, h - 4, '#0f172a', '#1e293b');
    o += R(x, y + h / 2 - 3, 2.5, 6, '#0f172a');
    for (let r = 0; r < 9; r++) {
      const py = y + 4 + r * (h - 8) / 9;
      o += C(x + 5, py, 0.7, '#fbbf24');
      o += C(x + w - 5, py, 0.7, '#fbbf24');
    }
    o += T(x + w / 2, y - 3, 'USB 3.0', 3.5, '#93c5fd', 'bold', 'middle');
    o += `</g>`;
    return o;
  }

  function drawBIOS(x, y, w, h, hasButton = false) {
    let o = `<g filter="url(#f-drop-sm)">`;
    o += R(x, y, 14, 12, '#18191c', '#475569', 'rx="1"');
    o += C(x + 3, y + 3, 0.9, '#94a3b8');
    o += T(x + 7, y + 8, 'BIOS', 3.2, '#94a3b8', 'bold', 'middle');
    for (let i = 0; i < 4; i++) {
      o += `<line x1="${x - 1.5}" y1="${y + 2 + i * 2.8}" x2="${x}" y2="${y + 2 + i * 2.8}" stroke="#cbd5e1" stroke-width="0.8"/>`;
      o += `<line x1="${x + 14}" y1="${y + 2 + i * 2.8}" x2="${x + 15.5}" y2="${y + 2 + i * 2.8}" stroke="#cbd5e1" stroke-width="0.8"/>`;
    }
    if (hasButton) {
      o += R(x + 18, y, 12, 12, '#e2e8f0', '#64748b', 'rx="2"');
      o += C(x + 24, y + 6, 3.5, '#f97316', '#c2410c');
      o += T(x + 16, y + 18, 'Q-FLASH+', 3.2, '#f97316', 'bold', 'middle');
    }
    o += `</g>`;
    return o;
  }

  function drawCPUFan(x, y, w, h) {
    let o = `<g filter="url(#f-drop-sm)">`;
    o += R(x, y, w, h, '#f8fafc', '#94a3b8', 'rx="1"');
    o += R(x + 2, y, w - 4, 2, '#475569');
    const dx = (w - 4) / 4;
    for (let i = 0; i < 4; i++) {
      o += C(x + 2 + i * dx + dx / 2, y + h / 2 + 1, 0.9, '#475569');
    }
    o += T(x + w / 2, y + h + 6, 'CPU_FAN', 3.5, '#94a3b8', 'bold', 'middle');
    o += `</g>`;
    return o;
  }

  function drawWiFi(x, y, w, h) {
    let o = `<g filter="url(#f-drop-sm)">`;
    o += R(x, y, w, h, '#15803d', '#14532d', 'rx="1"');
    o += R(x + 2, y + 2, w - 12, h - 4, 'url(#g-steel)', '#64748b', 'rx="1"');
    o += T(x + (w - 12) / 2 + 2, y + h / 2 + 2, 'Wi-Fi 6', 4.5, '#1e293b', 'bold', 'middle');
    o += C(x + w - 5, y + 6, 3.5, '#eab308', '#78350f', 0.8);
    o += C(x + w - 5, y + h - 6, 3.5, '#eab308', '#78350f', 0.8);
    o += `</g>`;
    return o;
  }

  function drawMsiVRM(x, y, w, h) {
    let o = '<g filter="url(#f-drop-lg)">';
    o += R(x, y, 44, 120, 'url(#g-alum-dark)', '#475569', 'rx="2"');
    o += '<polygon points="' + (x + 30) + ',' + y + ' ' + (x + 44) + ',' + (y + 14) + ' ' + (x + 44) + ',' + (y + 120) + ' ' + x + ',' + (y + 120) + ' ' + x + ',' + y + '" fill="url(#g-alum-dark)"/>';
    o += '<line x1="' + (x + 3) + '" y1="' + (y + 20) + '" x2="' + (x + 36) + '" y2="' + (y + 20) + '" stroke="#d32f2f" stroke-width="2.5"/>';
    for (let i = 0; i < 6; i++) {
      o += '<line x1="' + (x + 4) + '" y1="' + (y + 36 + i * 12) + '" x2="' + (x + 38) + '" y2="' + (y + 36 + i * 12) + '" stroke="#0f1115" stroke-width="2"/>';
      o += '<line x1="' + (x + 4) + '" y1="' + (y + 37 + i * 12) + '" x2="' + (x + 38) + '" y2="' + (y + 37 + i * 12) + '" stroke="#475569" stroke-width="0.8"/>';
    }
    o += T(x + 20, y + 112, 'MPG', 8, '#e2e8f0', 'bold', 'middle');

    o += R(x + 46, y, 96, 26, 'url(#g-alum-dark)', '#475569', 'rx="2"');
    for (let i = 0; i < 3; i++) {
      o += '<line x1="' + (x + 50) + '" y1="' + (y + 6 + i * 7) + '" x2="' + (x + 138) + '" y2="' + (y + 6 + i * 7) + '" stroke="#0f1115" stroke-width="2"/>';
    }
    o += '</g>';

    for (let i = 0; i < 8; i++) {
      o += drawChoke(x + 46, y + 32 + i * 11, 8.5, 'R80');
      o += drawCap(x + 58, y + 36 + i * 11, '#dc2626', 7);
    }
    for (let i = 0; i < 4; i++) {
      o += drawChoke(x + 60 + i * 18, y + 28, 8.5, 'R80');
      o += drawCap(x + 64 + i * 18, y + 38, '#dc2626', 7);
    }
    return o;
  }

  function drawMsiChipset(x, y, w, h) {
    let o = '<g filter="url(#f-drop-lg)">';
    o += '<polygon points="' + x + ',' + y + ' ' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + h - 16) + ' ' + (x + w - 16) + ',' + (y + h) + ' ' + x + ',' + (y + h) + '" fill="url(#g-alum-dark)" stroke="#475569" stroke-width="1"/>';
    o += '<line x1="' + (x + 6) + '" y1="' + (y + h - 8) + '" x2="' + (x + w - 24) + '" y2="' + (y + 12) + '" stroke="#d32f2f" stroke-width="2"/>';
    o += '<line x1="' + (x + 14) + '" y1="' + (y + h - 6) + '" x2="' + (x + w - 16) + '" y2="' + (y + 20) + '" stroke="#333742" stroke-width="2"/>';
    o += T(x + w / 2 - 4, y + 26, 'MSI', 7.5, '#e2e8f0', 'bold', 'middle');
    o += T(x + w / 2 - 4, y + 36, 'B550', 5.5, '#94a3b8', 'bold', 'middle');
    o += C(x + 8, y + 8, 2, '#475569');
    o += C(x + w - 8, y + 8, 2, '#475569');
    o += '</g>';
    return o;
  }

  function drawAsusVRM(x, y, w, h) {
    let o = '<g filter="url(#f-drop-lg)">';
    o += R(x, y, 38, 106, 'url(#g-alum-silver)', '#64748b', 'rx="2"');
    for (let i = 0; i < 5; i++) {
      const gx = x + 6 + i * 6.5;
      o += '<line x1="' + gx + '" y1="' + (y + 6) + '" x2="' + gx + '" y2="' + (y + 98) + '" stroke="#475569" stroke-width="1.8"/>';
      o += '<line x1="' + (gx + 0.5) + '" y1="' + (y + 6) + '" x2="' + (gx + 0.5) + '" y2="' + (y + 98) + '" stroke="#ffffff" stroke-width="0.8"/>';
    }
    o += T(x + 19, y + 102, 'PRIME', 5, '#1e293b', 'bold', 'middle');
    o += '</g>';

    for (let i = 0; i < 7; i++) {
      o += drawChoke(x + 40, y + 8 + i * 14, 8.5, '1R0');
      o += drawCap(x + 50, y + 12 + i * 14, '#2563eb', 7.5);
    }
    for (let i = 0; i < 4; i++) {
      o += drawChoke(x + 44 + i * 18, y - 6, 8.5, '1R0');
      o += drawCap(x + 48 + i * 18, y + 4, '#2563eb', 7.5);
    }
    return o;
  }

  function drawAsusChipset(x, y, w, h) {
    const cx = x + w / 2, cy = y + h / 2, r = w / 2 - 2;
    let o = '<g filter="url(#f-drop-lg)">';
    o += C(cx, cy, r, 'url(#g-alum-silver)', '#64748b', 1);
    o += C(cx, cy, r - 5, 'url(#g-alum-silver)', '#cbd5e1', 0.8);
    o += C(cx, cy, r - 12, '#1e293b', '#0f172a', 1);
    o += T(cx, cy + 2.5, 'PRIME', 6, '#ffffff', 'bold', 'middle');
    o += T(cx, cy + 9, 'B550', 4, '#94a3b8', 'bold', 'middle');
    o += '</g>';
    return o;
  }

  function drawGigaVRM(x, y, w, h) {
    let o = '<g filter="url(#f-drop-lg)">';
    o += '<polygon points="' + x + ',' + y + ' ' + (x + 40) + ',' + y + ' ' + (x + 40) + ',' + (y + 110) + ' ' + (x + 6) + ',' + (y + 110) + ' ' + x + ',' + (y + 96) + '" fill="url(#g-alum-dark)" stroke="#475569" stroke-width="1"/>';
    o += '<line x1="' + (x + 4) + '" y1="' + (y + 4) + '" x2="' + (x + 36) + '" y2="' + (y + 4) + '" stroke="#cbd5e1" stroke-width="1.5"/>';
    o += '<line x1="' + (x + 4) + '" y1="' + (y + 8) + '" x2="' + (x + 36) + '" y2="' + (y + 8) + '" stroke="#f97316" stroke-width="2"/>';
    o += '<path d="M ' + (x + 20) + ' ' + (y + 24) + ' l 8 8 h -6 l -4 8 l -2 -6 l -6 2 Z" fill="#f97316"/>';
    o += T(x + 20, y + 54, 'AORUS', 6.5, '#e2e8f0', 'bold', 'middle');
    for (let i = 0; i < 4; i++) {
      o += '<line x1="' + (x + 4) + '" y1="' + (y + 64 + i * 11) + '" x2="' + (x + 36) + '" y2="' + (y + 64 + i * 11) + '" stroke="#0f1115" stroke-width="1.8"/>';
    }
    o += '</g>';

    for (let i = 0; i < 7; i++) {
      o += drawChoke(x + 42, y + 10 + i * 14, 8.5, 'LR22');
      o += drawCap(x + 52, y + 14 + i * 14, '#1e293b', 7.5);
    }
    for (let i = 0; i < 4; i++) {
      o += drawChoke(x + 46 + i * 18, y - 4, 8.5, 'LR22');
      o += drawCap(x + 50 + i * 18, y + 6, '#1e293b', 7.5);
    }
    return o;
  }

  function drawGigaChipset(x, y, w, h) {
    let o = '<g filter="url(#f-drop-lg)">';
    o += '<polygon points="' + x + ',' + (y + 12) + ' ' + (x + 14) + ',' + y + ' ' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + h) + ' ' + (x + 12) + ',' + (y + h) + ' ' + x + ',' + (y + h - 14) + '" fill="url(#g-alum-dark)" stroke="#475569" stroke-width="1"/>';
    o += '<line x1="' + (x + 14) + '" y1="' + (y + 2) + '" x2="' + (x + w - 4) + '" y2="' + (y + 2) + '" stroke="#cbd5e1" stroke-width="1"/>';
    const fx = x + w / 2, fy = y + h / 2 - 4;
    o += '<path d="M ' + fx + ' ' + (fy - 10) + ' l 10 10 h -7 l -5 10 l -3 -8 l -7 3 Z" fill="#f97316"/>';
    o += T(fx, fy + 18, 'AORUS', 6.5, '#ffffff', 'bold', 'middle');
    o += '</g>';
    return o;
  }

  function drawAsrockVRM(x, y, w, h) {
    let o = '<g filter="url(#f-drop-lg)">';
    o += R(x, y, 40, 112, 'url(#g-alum-silver)', '#64748b', 'rx="2"');
    for (let i = 0; i < 7; i++) {
      o += '<line x1="' + (x + 4) + '" y1="' + (y + 14 + i * 13) + '" x2="' + (x + 36) + '" y2="' + (y + 14 + i * 13) + '" stroke="#475569" stroke-width="2"/>';
      o += '<line x1="' + (x + 4) + '" y1="' + (y + 15 + i * 13) + '" x2="' + (x + 36) + '" y2="' + (y + 15 + i * 13) + '" stroke="#ffffff" stroke-width="0.8"/>';
    }
    o += T(x + 20, y + 106, 'ASRock', 5.5, '#1e293b', 'bold', 'middle');

    o += R(x + 42, y, 102, 28, 'url(#g-alum-silver)', '#64748b', 'rx="2"');
    for (let i = 0; i < 4; i++) {
      o += '<line x1="' + (x + 46) + '" y1="' + (y + 6 + i * 6) + '" x2="' + (x + 140) + '" y2="' + (y + 6 + i * 6) + '" stroke="#475569" stroke-width="1.8"/>';
      o += '<line x1="' + (x + 46) + '" y1="' + (y + 7 + i * 6) + '" x2="' + (x + 140) + '" y2="' + (y + 7 + i * 6) + '" stroke="#ffffff" stroke-width="0.8"/>';
    }
    o += '</g>';

    for (let i = 0; i < 7; i++) {
      o += drawChoke(x + 42, y + 32 + i * 11, 8.5, '50A');
      o += drawCap(x + 54, y + 36 + i * 11, '#090a0c', 7.5);
    }
    return o;
  }

  function drawAsrockChipset(x, y, w, h) {
    let o = '<g filter="url(#f-drop-lg)">';
    o += R(x, y, w, h, 'url(#g-alum-silver)', '#64748b', 'rx="2"');
    o += '<line x1="' + (x + 6) + '" y1="' + (y + 6) + '" x2="' + (x + w - 6) + '" y2="' + (y + 6) + '" stroke="#ffffff" stroke-width="1.5"/>';
    o += R(x + 8, y + 12, w - 16, h - 24, '#1e293b', '#0f172a', 'rx="1"');
    o += T(x + w / 2, y + 28, 'PRO 4', 7.5, '#ffffff', 'bold', 'middle');
    o += T(x + w / 2, y + 38, 'ASRock B550', 4.5, '#94a3b8', 'bold', 'middle');
    o += '</g>';
    return o;
  }

  function boardSVG(b) {
    const { w, h } = b.L, id = b.id;
    let o = `<svg class="board" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">`;
    o += svgDefs();

    if (id === 'msi') {
      o += R(1, 1, w - 2, h - 2, '#141518', '#000000', 'rx="4" stroke-width="2"');
      o += R(1, 1, w - 2, h - 2, 'url(#g-pcb-light)', null, 'rx="4"');
      o += '<line x1="0" y1="240" x2="140" y2="380" stroke="#d32f2f" stroke-width="1.5" opacity="0.45"/>';
      o += '<line x1="40" y1="210" x2="210" y2="380" stroke="#333742" stroke-width="2" opacity="0.6"/>';
      o += T(98, 156, 'MPG B550 GAMING PLUS', 6, '#cbd5e1', 'bold');
      o += T(98, 192, 'LIGHTNING GEN 4 M.2', 4, '#94a3b8', 'bold');
      o += T(206, 14, 'DDR4 BOOST', 4, '#94a3b8', 'bold');
      o += T(14, 320, 'AUDIO BOOST', 4, '#eab308', 'bold');

      for (const [mx, my] of [[12, 12], [160, 12], [308, 12], [12, 190], [160, 190], [308, 190], [12, 368], [160, 368], [308, 368]]) {
        o += drawMountHole(mx, my);
      }

      o += drawRearIO(0, 14, 34, 160, 'msi');
      o += drawMsiVRM(34, 14, 140, 120);
      o += drawEPS8(126, 2, 38, 13);
      o += drawAM4(94, 60, 84, 84);
      o += drawDIMM(202, 18, 46, 146, false);
      o += drawATX24(298, 36, 16, 72);
      o += drawUSB3(288, 158, 18, 30);
      o += drawM2(86, 166, 96, 22, 'msi');
      o += drawPCIe16(22, 198, 192, 16, true);
      o += drawPCIe1(22, 230, 72, 13);
      o += drawCMOS(118, 232, 26, 26);
      o += drawM2(98, 252, 88, 16, 'bare');
      o += drawPCIe16(22, 276, 192, 16, false);
      o += drawPCIe1(22, 306, 72, 13);
      o += drawMsiChipset(214, 242, 72, 72);
      o += drawSATA(282, 252, 34, 52, 6);
      o += drawAudio(8, 330, 42, 38, false);
      o += drawFrontPanel(262, 354, 50, 14);
    } else if (id === 'asus') {
      o += R(1, 1, w - 2, h - 2, '#18191c', '#000000', 'rx="4" stroke-width="2"');
      o += R(1, 1, w - 2, h - 2, 'url(#g-pcb-light)', null, 'rx="4"');
      o += '<path d="M 170 140 L 230 200 L 230 280 L 190 320 M 185 140 L 245 200 L 320 200 M 50 180 L 120 250 L 120 340 M 60 170 L 140 250 L 140 350" stroke="#e2e8f0" stroke-width="1.2" opacity="0.32" fill="none"/>';
      o += T(92, 152, 'PRIME B550M-A WIFI II', 6.5, '#f1f5f9', 'bold');
      o += T(208, 14, 'ASUS', 5.5, '#94a3b8', 'bold');

      for (const [mx, my] of [[12, 12], [188, 12], [364, 12], [12, 194], [364, 194], [12, 364], [188, 364], [364, 364]]) {
        o += drawMountHole(mx, my);
      }

      o += drawRearIO(0, 14, 38, 146, 'asus');
      o += drawWiFi(2, 120, 38, 32);
      o += drawAsusVRM(40, 20, 140, 110);
      o += drawEPS8(110, 2, 38, 13);
      o += drawCPUFan(176, 4, 30, 14);
      o += drawAM4(92, 56, 84, 84);
      o += drawDIMM(206, 18, 48, 144, true);
      o += drawATX24(348, 34, 16, 72);
      o += drawM2(88, 160, 94, 16, 'asus');
      o += drawPCIe16(24, 194, 188, 16, true);
      o += drawPCIe1(24, 230, 68, 13);
      o += drawPCIe1(24, 266, 68, 13);
      o += drawCMOS(124, 228, 26, 26);
      o += drawM2(88, 310, 88, 16, 'asus');
      o += drawAsusChipset(244, 236, 68, 68);
      o += drawSATA(334, 278, 34, 40, 4);
      o += drawAudio(8, 324, 42, 40, false);
      o += drawFrontPanel(298, 350, 52, 16);
    } else if (id === 'giga') {
      o += R(1, 1, w - 2, h - 2, '#15161a', '#000000', 'rx="4" stroke-width="2"');
      o += R(1, 1, w - 2, h - 2, 'url(#g-pcb-light)', null, 'rx="4"');
      o += '<path d="M 60 180 L 140 180 L 190 230 L 190 320 L 230 360 M 70 170 L 150 170 L 200 220 L 200 310" stroke="#f97316" stroke-width="1.2" opacity="0.38" fill="none"/>';
      o += T(92, 152, 'B550M AORUS ELITE', 6.5, '#f1f5f9', 'bold');
      o += T(208, 14, 'GIGABYTE', 5.5, '#94a3b8', 'bold');

      for (const [mx, my] of [[12, 12], [188, 12], [364, 12], [12, 194], [364, 194], [12, 364], [188, 364], [364, 364]]) {
        o += drawMountHole(mx, my);
      }

      o += drawRearIO(0, 14, 38, 146, 'giga');
      o += drawGigaVRM(40, 16, 140, 112);
      o += drawEPS8(112, 2, 38, 13);
      o += drawAM4(92, 56, 84, 84);
      o += drawDIMM(206, 18, 48, 144, false);
      o += drawATX24(348, 34, 16, 72);
      o += drawM2(88, 160, 94, 16, 'giga');
      o += drawPCIe16(24, 194, 188, 16, true);
      o += drawPCIe1(24, 232, 68, 13);
      o += drawPCIe16(24, 268, 188, 16, false);
      o += drawCMOS(124, 224, 26, 26);
      o += drawGigaChipset(244, 236, 68, 68);
      o += drawSATA(334, 276, 34, 40, 4);
      o += drawAudio(8, 322, 42, 40, false);
      o += drawFrontAudio(48, 352, 36, 14);
      o += drawBIOS(198, 344, 34, 22, true);
      o += drawFrontPanel(298, 350, 52, 16);
    } else {
      o += R(1, 1, w - 2, h - 2, '#17181c', '#000000', 'rx="4" stroke-width="2"');
      o += R(1, 1, w - 2, h - 2, 'url(#g-pcb-light)', null, 'rx="4"');
      o += '<path d="M 120 0 L 0 120 M 180 0 L 0 180 M 240 0 L 0 240 M 300 0 L 0 300 M 360 0 L 0 360 M 376 60 L 60 376 M 376 120 L 120 376" stroke="#ffffff" stroke-width="1.8" opacity="0.22" fill="none"/>';
      o += T(94, 152, 'B550M Pro4', 6.5, '#f1f5f9', 'bold');
      o += T(208, 14, 'ASRock', 5.5, '#94a3b8', 'bold');

      for (const [mx, my] of [[12, 12], [188, 12], [364, 12], [12, 194], [364, 194], [12, 364], [188, 364], [364, 364]]) {
        o += drawMountHole(mx, my);
      }

      o += drawRearIO(0, 14, 38, 146, 'asrock');
      o += drawAsrockVRM(40, 16, 146, 112);
      o += drawEPS8(136, 2, 38, 13);
      o += drawAM4(94, 56, 84, 84);
      o += drawDIMM(206, 18, 48, 144, false);
      o += drawATX24(348, 34, 16, 72);
      o += drawUSB3(334, 166, 18, 32);
      o += drawM2(88, 160, 98, 22, 'asrock');
      o += drawPCIe16(24, 196, 188, 16, true);
      o += drawPCIe1(24, 232, 68, 13);
      o += drawPCIe16(24, 268, 188, 16, false);
      o += drawCMOS(124, 228, 26, 26);
      o += drawAsrockChipset(244, 236, 68, 68);
      o += drawSATA(332, 262, 36, 52, 6);
      o += drawAudio(8, 322, 42, 40, true);
      o += drawBIOS(202, 344, 28, 18, false);
    }

    return o + '</svg>';
  }

  /* ---------- Utilidades ---------- */
  const el = (tag, cls, css, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (css) Object.assign(e.style, css);
    if (html != null) e.innerHTML = html;
    return e;
  };
  const px = (e, x, y) => { e.style.left = x + 'px'; e.style.top = y + 'px'; };
  const shuffle = a => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const esc = s => String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));

  let ac;
  function ding() {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const t = ac.currentTime;
      // High-tech dual harmonic chime
      const o1 = ac.createOscillator(), g1 = ac.createGain();
      o1.type = 'sine'; o1.frequency.setValueAtTime(880, t); o1.frequency.exponentialRampToValueAtTime(1760, t + 0.12);
      g1.gain.setValueAtTime(0.18, t); g1.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      o1.connect(g1); g1.connect(ac.destination);
      o1.start(t); o1.stop(t + 0.35);
    } catch (e) { /* sin audio */ }
  }

  function flash() {
    const f = $('#flash');
    if (!f) return;
    f.classList.add('on');
    setTimeout(() => f.classList.remove('on'), 300);
  }

  /* ---------- Estado y Pantallas ---------- */
  let player = '', scores = [], cur = 0, state = null;
  const header = (title, right) =>
    `<div class="head-left"><h1>${esc(title)}</h1></div><div class="head-right"><span class="badge-pill">${esc(right || '')}</span></div>`;

  function intro() {
    screen.innerHTML = '';
    screen.append(el('div', 'head', null, header('Placas Base AM4 B550', 'Test Interactivo')));
    const d = el('div', 'intro', null, `
      <div class="intro-card">
        <h2>Identificación de Componentes de Placas Base</h2>
        <p class="intro-desc">Detalles visuales realistas basados en modelos reales de PcComponentes: esquemas detallados de socket AM4, VRM con disipadores de aluminio, ranuras PCIe blindadas con Steel Armor, ranuras M.2 NVMe con Shield Frozr/Armor, códecs de audio aislados y puertos reales.</p>
        <div class="boards-grid">
          ${BOARDS.map((b, i) => `
            <div class="board-card">
              <span class="board-num">0${i + 1}</span>
              <div class="board-info">
                <strong>${esc(b.name)}</strong>
                <small>${esc(b.sub)}</small>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="player-input-wrap">
          <label for="pname">Nombre del participante</label>
          <input id="pname" maxlength="30" autocomplete="off" placeholder="Escribe tu nombre..." value="${esc(player)}">
        </div>
      </div>
    `);
    screen.append(d);

    const go = el('button', 'nbtn', { left: '250px', top: '422px', width: '140px', height: '38px' }, 'Comenzar Test');
    go.type = 'button';
    go.onclick = () => {
      player = $('#pname').value.trim();
      scores = [];
      cur = 0;
      showBoard();
    };
    screen.append(go);
    $('#pname').addEventListener('keydown', e => { if (e.key === 'Enter') go.click(); });
  }

  function showBoard() {
    const b = BOARDS[cur], L = b.L;
    screen.innerHTML = '';
    screen.append(el('div', 'head', null, header(b.name, `Placa ${cur + 1} / ${BOARDS.length}`)));
    const flashEl = el('div', '', null);
    flashEl.id = 'flash';
    screen.append(flashEl);

    const ox = 6 + Math.round((474 - L.w) / 2), oy = 48;
    const bd = el('div', 'board-wrap', { left: ox + 'px', top: oy + 'px', width: L.w + 'px', height: L.h + 'px' }, boardSVG(b));
    screen.append(bd);

    const sub = el('div', 'sub', null, `<b>${esc(b.name)}</b> · ${esc(b.sub)} · ${esc(b.desc)}`);
    screen.append(sub);

    const markers = b.keys.map(k => {
      const c = L.c[k];
      const cx = c[4] != null ? c[4] : c[0] + c[2] / 2;
      const cy = c[5] != null ? c[5] : c[1] + c[3] / 2;
      const m = {
        key: k,
        x: ox + cx,
        y: oy + cy,
        by: null,
        el: el('div', 'mk', { left: ox + cx - 11 + 'px', top: oy + cy - 11 + 'px' })
      };
      screen.append(m.el);
      return m;
    });

    const labels = shuffle(b.keys).map((k, i) => {
      const hx = 490, hy = 44 + i * 28;
      const l = el('div', 'label', null, esc(NAMES[k]));
      l.dataset.k = k;
      px(l, hx, hy);
      l._home = { x: hx, y: hy };
      l._pos = { x: hx, y: hy };
      l._m = null;
      screen.append(l);
      attach(l);
      return l;
    });

    const last = cur === BOARDS.length - 1;
    const nb = el('button', 'nbtn', { left: '490px', top: '440px', width: '144px', height: '32px' }, last ? 'Ver resultados' : 'Siguiente');
    nb.type = 'button';
    nb.onclick = finishBoard;
    screen.append(nb);

    state = { b, markers, labels, z: 10, ox, oy };

    function attach(l) {
      let d = null;
      l.addEventListener('pointerdown', e => {
        if (e.button > 0) return;
        l.setPointerCapture(e.pointerId);
        const k = stage.getBoundingClientRect().width / 640;
        d = { k, sx: e.clientX, sy: e.clientY, x: l._pos.x, y: l._pos.y, prev: { x: l._pos.x, y: l._pos.y, m: l._m } };
        l.classList.add('drag');
      });

      l.addEventListener('pointermove', e => {
        if (!d) return;
        const x = d.x + (e.clientX - d.sx) / d.k, y = d.y + (e.clientY - d.sy) / d.k;
        l._pos = { x, y };
        px(l, x, y);
      });

      const end = e => {
        if (!d) return;
        const r = stage.getBoundingClientRect(), k = d.k;
        const mx = (e.clientX - r.left) / k, my = (e.clientY - r.top) / k;
        l.classList.remove('drag');
        l.style.zIndex = ++state.z > 50 ? (state.z = 11) : state.z;

        let best = null, bd2 = 28 * 28;
        for (const m of markers) {
          const dd = (m.x - mx) ** 2 + (m.y - my) ** 2;
          if (dd < bd2 && (!m.by || m.by === l)) {
            bd2 = dd;
            best = m;
          }
        }
        const prev = d.prev;
        d = null;
        if (e.type === 'pointercancel') best = null;

        if (l._m) {
          l._m.by = null;
          l._m = null;
        }

        if (best) {
          best.by = l;
          l._m = best;
          const x = Math.max(0, Math.min(640 - 144, best.x - 72)), y = best.y - 12;
          l._pos = { x, y };
          px(l, x, y);
          l.classList.add('placed');
          const ok = best.key === l.dataset.k;
          if (ok && !(prev.m === best)) {
            ding();
            flash();
          }
        } else if (prev.m) {
          prev.m.by = l;
          l._m = prev.m;
          l._pos = { x: prev.x, y: prev.y };
          px(l, prev.x, prev.y);
        } else {
          l._pos = { x: prev.x, y: prev.y };
          px(l, prev.x, prev.y);
          l.classList.remove('placed');
        }
        if (!l._m) l.classList.remove('placed');
      };

      l.addEventListener('pointerup', end);
      l.addEventListener('pointercancel', end);
    }
  }

  function currentHits() {
    return state.markers.filter(m => m.by && m.by.dataset.k === m.key).length;
  }

  function finishBoard() {
    const total = state.markers.length;
    scores[cur] = currentHits() * 100 / total;
    if (cur < BOARDS.length - 1) {
      cur++;
      showBoard();
    } else {
      results();
    }
  }

  function results() {
    screen.innerHTML = '';
    screen.append(el('div', 'head', null, header('Resultados Finales', player || 'Evaluación')));
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / BOARDS.length);
    const tier = avg >= 90 ? 'Excelente · Experto en Hardware' : avg >= 70 ? 'Notable · Buen conocimiento' : avg >= 50 ? 'Aprobado · Requiere práctica' : 'Repaso recomendado';

    const rows = BOARDS.map((b, i) => `
      <tr>
        <td>
          <div class="res-board">
            <strong>${esc(b.name)}</strong>
            <small>${esc(b.sub)}</small>
          </div>
        </td>
        <td>
          <div class="bar-wrap"><div class="bar-fill" style="width: ${Math.round(scores[i])}%"></div></div>
        </td>
        <td class="res-score">${Math.round(scores[i])}%</td>
      </tr>
    `).join('');

    screen.append(el('div', 'res', null, `
      <div class="res-card">
        <h2>${player ? 'Resultados de ' + esc(player) : 'Resultados de la prueba'}</h2>
        <div class="res-badge">${tier}</div>
        <table>
          ${rows}
          <tr class="avg">
            <td><strong>Promedio Global</strong></td>
            <td><div class="bar-wrap"><div class="bar-fill avg-fill" style="width: ${avg}%"></div></div></td>
            <td class="res-score">${avg}%</td>
          </tr>
        </table>
      </div>
    `));

    const again = el('button', 'nbtn', { left: '260px', top: '426px', width: '120px', height: '36px' }, 'Reiniciar');
    again.type = 'button';
    again.onclick = intro;
    screen.append(again);
  }

  /* ---------- Ajuste responsive al escenario ---------- */
  function fit() {
    const k = Math.min(innerWidth / 640, innerHeight / 480);
    stage.style.transform = `translate(${(innerWidth - 640 * k) / 2}px, ${(innerHeight - 480 * k) / 2}px) scale(${k})`;
  }
  addEventListener('resize', fit);
  fit();

  window.__app = { BOARDS, get state() { return state; }, finishBoard, get scores() { return scores; }, intro };
  intro();
})();

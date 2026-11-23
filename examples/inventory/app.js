/* ==========================================================================
   PARTS DEPOT — household component inventory
   Vanilla JS + localStorage. No build step.
   ========================================================================== */
(() => {
  'use strict';

  /* ---------------------------------------------------------------- data -- */
  const KEY = 'parts-depot-v1';
  const PAGE_SIZE = 8;
  const HIST_SIZE = 10;
  const ACTOR = 'OWNER';

  const CATEGORIES = ['电阻', '电容', '二极管', '三极管', '集成电路', '连接器', '传感器', '开关', '耗材'];
  const VIEWS = ['overview', 'scan', 'album', 'inventory', 'pick', 'inbound', 'outbound', 'materials', 'solder', 'history'];
  const TITLES = {
    overview: 'Overview',
    scan: 'Scan In',
    album: 'Album',
    inventory: 'Inventory',
    pick: 'Pick',
    inbound: 'Inbound',
    outbound: 'Outbound',
    materials: 'Materials',
    solder: 'Solder',
    history: 'History'
  };
  const RELATED_NAV = { history: 'inventory', outbound: 'pick' };
  const WD = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const SEED_PARTS = [
    { id: 'R-10K', name: '金属膜电阻', category: '电阻', value: '10kΩ', pkg: '1/4W · 1%', qty: 12, min: 50, unit: '只', location: 'A1-01', supplier: '立创商城' },
    { id: 'R-1K', name: '金属膜电阻', category: '电阻', value: '1kΩ', pkg: '1/4W · 1%', qty: 220, min: 50, unit: '只', location: 'A1-02', supplier: '立创商城' },
    { id: 'R-220', name: '金属膜电阻', category: '电阻', value: '220Ω', pkg: '1/4W · 1%', qty: 96, min: 40, unit: '只', location: 'A1-03', supplier: '本地电子城' },
    { id: 'C-104', name: '陶瓷电容', category: '电容', value: '100nF', pkg: '50V · X7R', qty: 150, min: 40, unit: '只', location: 'A2-01', supplier: '立创商城' },
    { id: 'C-10U', name: '电解电容', category: '电容', value: '10µF', pkg: '25V', qty: 34, min: 20, unit: '只', location: 'A2-02', supplier: '淘宝' },
    { id: 'LED-5R', name: 'LED 5mm 红', category: '二极管', value: '20mA', pkg: '直插', qty: 80, min: 30, unit: '只', location: 'B1-01', supplier: '立创商城' },
    { id: 'LED-3G', name: 'LED 3mm 绿', category: '二极管', value: '20mA', pkg: '直插', qty: 18, min: 30, unit: '只', location: 'B1-02', supplier: '淘宝' },
    { id: 'D-4148', name: '开关二极管', category: '二极管', value: '1N4148', pkg: 'DO-35', qty: 140, min: 40, unit: '只', location: 'B2-01', supplier: '立创商城' },
    { id: 'D-4007', name: '整流二极管', category: '二极管', value: '1N4007', pkg: 'DO-41', qty: 55, min: 20, unit: '只', location: 'B2-02', supplier: '立创商城' },
    { id: 'Q-8050', name: 'NPN 三极管', category: '三极管', value: 'S8050', pkg: 'TO-92', qty: 24, min: 20, unit: '只', location: 'B3-01', supplier: '拆机' },
    { id: 'IC-555', name: '定时器', category: '集成电路', value: 'NE555', pkg: 'DIP-8', qty: 3, min: 5, unit: '只', location: 'C1-01', supplier: '立创商城' },
    { id: 'IC-358', name: '运放', category: '集成电路', value: 'LM358', pkg: 'DIP-8', qty: 9, min: 5, unit: '只', location: 'C1-02', supplier: '立创商城' },
    { id: 'CN-254', name: '排针 2.54mm', category: '连接器', value: '40P', pkg: '单排', qty: 6, min: 3, unit: '只', location: 'D1-01', supplier: '淘宝' },
    { id: 'CN-USBC', name: 'USB-C 母座', category: '连接器', value: '16P', pkg: '沉板', qty: 0, min: 3, unit: '只', location: 'D1-02', supplier: '淘宝' },
    { id: 'SN-DHT11', name: '温湿度传感器', category: '传感器', value: 'DHT11', pkg: '模块', qty: 4, min: 2, unit: '只', location: 'E1-01', supplier: '淘宝' },
    { id: 'SW-TACT', name: '轻触开关', category: '开关', value: '6×6×5', pkg: '4 脚', qty: 35, min: 20, unit: '只', location: 'D2-01', supplier: '立创商城' },
    { id: 'TL-SOLDER', name: '焊锡丝', category: '耗材', value: '0.8mm', pkg: '100g', qty: 2, min: 1, unit: '卷', location: 'F1-01', supplier: '本地电子城' },
    { id: 'WR-DUPONT', name: '杜邦线', category: '耗材', value: '20cm', pkg: '母对母 40P', qty: 1, min: 2, unit: '盒', location: 'F1-02', supplier: '淘宝' },
    { id: 'FL-FLUX', name: '助焊剂', category: '耗材', value: '10ml', pkg: '针管', qty: 2, min: 1, unit: '支', location: 'F2-01', supplier: '淘宝' },
    { id: 'TR-HEAT', name: '热缩管', category: '耗材', value: '2:1', pkg: '1m 混装', qty: 8, min: 5, unit: '包', location: 'F2-02', supplier: '立创商城' },
    { id: 'TP-HIGH', name: '高温胶带', category: '耗材', value: '10mm', pkg: '33m', qty: 3, min: 2, unit: '卷', location: 'F2-03', supplier: '淘宝' },
    { id: 'TL-WICK', name: '吸锡带', category: '耗材', value: '2.5mm', pkg: '1.5m', qty: 1, min: 2, unit: '卷', location: 'F2-04', supplier: '淘宝' }
  ];

  const SEED_TX = [
    [3, 'out', 'IC-555', 2, '555 呼吸灯', '做呼吸灯，先拿两片'],
    [6, 'in', 'R-1K', 50, '立创商城', '补货 · 1kΩ'],
    [180, 'out', 'LED-5R', 4, '桌面灯', '灯板打样'],
    [300, 'out', 'C-104', 10, '电源滤波', '拆机电源'],
    [1560, 'in', 'SN-DHT11', 2, '淘宝', '温湿度模块'],
    [1800, 'out', 'CN-USBC', 1, '键盘线', 'Type-C 改线'],
    [3000, 'in', 'D-4148', 100, '立创商城', '常用管补货'],
    [3240, 'out', 'R-10K', 20, '分压网络', '十套分压板'],
    [4500, 'in', 'Q-8050', 5, '拆机', '拆机件'],
    [5880, 'out', 'TL-SOLDER', 1, '维修', '焊台补锡'],
    [7200, 'in', 'R-220', 30, '本地电子城', '补货 · 220Ω'],
    [8700, 'out', 'IC-358', 2, '音频缓冲', '实验'],
    [9600, 'in', 'C-10U', 10, '淘宝', '电源电容'],
    [10200, 'out', 'LED-3G', 8, '指示灯', '面板灯']
  ];

  const SEED_PHOTOS = [
    ['R-10K', '10kΩ 带装，标签朝上', 2],
    ['IC-555', 'NE555 批次，DIP-8 原装', 6],
    ['CN-USBC', 'USB-C 沉板母座，16P', 18],
    ['SN-DHT11', 'DHT11 模块，带排针', 30],
    ['TL-SOLDER', '0.8mm 焊锡丝，100g', 48],
    ['Q-8050', '拆机 S8050，已测 hFE', 72]
  ];

  const SEED_BOMS = [
    {
      id: 'BOM-555', name: '555 呼吸灯', version: 'v1.2', project: '桌面灯',
      note: '单灯呼吸，5V 供电，10k 与 100nF 定频。',
      lines: [
        { partId: 'IC-555', qty: 2 }, { partId: 'R-10K', qty: 2 },
        { partId: 'C-104', qty: 2 }, { partId: 'LED-5R', qty: 1 }
      ]
    },
    {
      id: 'BOM-DESK', name: '桌面灯', version: 'v0.9', project: '桌面灯',
      note: '四颗红光 LED，轻触开关切换，杜邦线走线。',
      lines: [
        { partId: 'LED-5R', qty: 4 }, { partId: 'R-220', qty: 4 },
        { partId: 'SW-TACT', qty: 2 }, { partId: 'WR-DUPONT', qty: 1 }
      ]
    },
    {
      id: 'BOM-ENV', name: '温湿度节点', version: 'v1.0', project: '环境监测',
      note: 'DHT11 + LM358 缓冲，USB-C 供电。',
      lines: [
        { partId: 'CN-USBC', qty: 3 }, { partId: 'SN-DHT11', qty: 1 },
        { partId: 'IC-358', qty: 1 }, { partId: 'C-104', qty: 2 }
      ]
    }
  ];

  const SEED_PICKS = [
    {
      id: 'PK-1042', project: '555 呼吸灯', requested: 'OWNER', bomId: 'BOM-555', status: 'pending',
      at: 2, items: [{ partId: 'IC-555', qty: 2 }, { partId: 'R-10K', qty: 2 }, { partId: 'C-104', qty: 2 }, { partId: 'LED-5R', qty: 1 }]
    },
    {
      id: 'PK-1043', project: '温湿度节点', requested: 'OWNER', bomId: 'BOM-ENV', status: 'pending',
      at: 24, items: [{ partId: 'CN-USBC', qty: 3 }, { partId: 'SN-DHT11', qty: 1 }, { partId: 'IC-358', qty: 1 }, { partId: 'C-104', qty: 2 }]
    },
    {
      id: 'PK-1041', project: '桌面灯', requested: 'OWNER', bomId: 'BOM-DESK', status: 'done',
      at: 50, doneAt: 3, items: [{ partId: 'LED-5R', qty: 4 }, { partId: 'R-220', qty: 4 }, { partId: 'SW-TACT', qty: 2 }]
    }
  ];

  const SEED_PACKAGES = [
    { id: 'PKG-01', tracking: 'SF1234567890123', carrier: '顺丰', partId: 'IC-555', qty: 5, supplier: '立创商城', eta: '今天 18:00', note: '555 呼吸灯补料', status: 'pending' },
    { id: 'PKG-02', tracking: 'YT7612345678901', carrier: '圆通', partId: 'CN-USBC', qty: 3, supplier: '淘宝', eta: '明天 12:00', note: '温湿度节点外壳', status: 'pending' },
    { id: 'PKG-03', tracking: 'JD9988776655443', carrier: '京东', partId: 'R-10K', qty: 100, supplier: '立创商城', eta: '明天 18:00', note: '10kΩ 带装备料', status: 'pending' }
  ];

  const SEED_SOLDER = [
    { id: 'JOB-01', project: '555 呼吸灯', board: 'NE555 呼吸灯 v1.2', qty: 2, status: 'queued', note: '先焊 IC 座，再装 LED' },
    { id: 'JOB-02', project: '桌面灯', board: 'LED 灯板 v0.9', qty: 1, status: 'queued', note: '四灯并联，限流 220Ω' },
    { id: 'JOB-03', project: '温湿度节点', board: 'DHT11 节点 v1.0', qty: 1, status: 'done', note: '已测试，读数正常' }
  ];

  /* ------------------------------------------------------------- helpers -- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function esc(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  const numFmt = new Intl.NumberFormat('zh-CN');
  const dateFmt = new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
  });
  const topDateFmt = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const shortDateFmt = new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit' });

  function fmtNum(value) { return numFmt.format(Number(value) || 0); }
  function fmtDate(iso) { return dateFmt.format(new Date(iso)); }
  function fmtTopDate(date) { return topDateFmt.format(date).replaceAll('/', '.'); }
  function fmtShortDate(iso) { return shortDateFmt.format(new Date(iso)); }
  function fmtTime(iso) {
    return new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(iso));
  }
  function dayKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function sameDay(a, b) { return dayKey(a) === dayKey(b); }
  function isToday(iso) { return sameDay(new Date(iso), new Date()); }

  function statusOf(part) {
    if (part.qty <= 0) return { key: 'out', label: '缺货', cls: 'ep-badge--danger status-out' };
    if (part.qty <= part.min) return { key: 'low', label: '低库存', cls: 'status-low' };
    return { key: 'ok', label: '正常', cls: 'status-ok' };
  }

  function makeId(prefix) {
    let id;
    do {
      id = `${prefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    } while (state.parts.some((part) => part.id === id));
    return id;
  }

  function txId() {
    return `TX-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 99).toString().padStart(2, '0')}`;
  }

  function csvCell(value) {
    return `"${String(value ?? '').replaceAll('"', '""')}"`;
  }

  function download(name, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  /* --------------------------------------------------------------- state -- */
  function seedState() {
    const now = Date.now();
    const transactions = SEED_TX.map(([minutesAgo, type, partId, qty, party, note], index) => ({
      id: `tx-seed-${String(index + 1).padStart(2, '0')}`,
      type,
      partId,
      qty,
      unit: SEED_PARTS.find((part) => part.id === partId)?.unit || '只',
      actor: ACTOR,
      party,
      note,
      at: new Date(now - minutesAgo * 60000).toISOString()
    })).sort((a, b) => b.at.localeCompare(a.at));

    const parts = SEED_PARTS.map((part, index) => {
      const latest = transactions.find((tx) => tx.partId === part.id);
      return {
        ...part,
        updatedAt: latest ? latest.at : new Date(now - (index + 1) * 36e5).toISOString()
      };
    });

    const photos = SEED_PHOTOS.map(([partId, note, hoursAgo], index) => ({
      id: `PH-${String(index + 1).padStart(2, '0')}`,
      partId, note,
      at: new Date(now - hoursAgo * 36e5).toISOString()
    }));

    const boms = SEED_BOMS.map((bom) => ({ ...bom, lines: bom.lines.map((line) => ({ ...line })) }));
    const picks = SEED_PICKS.map((pick) => ({
      ...pick,
      at: new Date(now - pick.at * 36e5).toISOString(),
      doneAt: pick.doneAt ? new Date(now - pick.doneAt * 36e5).toISOString() : null,
      items: pick.items.map((item) => ({ ...item }))
    }));
    const packages = SEED_PACKAGES.map((pkg) => ({ ...pkg }));
    const solderJobs = SEED_SOLDER.map((job) => ({ ...job }));

    return {
      version: 2,
      savedAt: new Date(now).toISOString(),
      parts, transactions, photos, boms, picks, packages, solderJobs,
      stationOn: false
    };
  }

  let storageOk = true;
  function loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 2 && Array.isArray(parsed.parts) && Array.isArray(parsed.transactions)) {
        return parsed;
      }
    } catch (error) {
      storageOk = false;
    }
    return null;
  }

  let state = loadState() || seedState();

  function saveState() {
    state.savedAt = new Date().toISOString();
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      storageOk = true;
    } catch (error) {
      storageOk = false;
    }
    updateSaveStamp();
  }

  const ui = {
    view: 'scan',
    inv: { q: '', cat: 'all', status: 'all', page: 1 },
    hist: { q: '', type: 'all', page: 1 },
    album: { cat: 'all' },
    prefill: null,
    dialogPart: null,
    receiveId: null,
    bomId: null,
    pickId: null,
    albumId: null
  };

  const els = {};

  /* --------------------------------------------------------------- utils -- */
  function getPart(id) {
    return state.parts.find((part) => part.id === id);
  }

  function partLabel(part) {
    return `${part.name} ${part.value}`.trim();
  }

  function typeBadge(type) {
    return type === 'in'
      ? '<span class="ep-badge tx-in"><i class="ep-dot"></i>IN</span>'
      : '<span class="ep-badge ep-badge--ember">OUT</span>';
  }

  function miniRow(tx) {
    const part = getPart(tx.partId);
    return `<div class="mini-tx"><b>${esc(part ? partLabel(part) : '未知元件')}</b><span>${fmtDate(tx.at)} · ${tx.type === 'in' ? '+' : '-'}${fmtNum(tx.qty)} ${esc(tx.unit || part?.unit || '')}</span></div>`;
  }

  function focusTable(wrap) {
    if (!wrap || wrap.hidden) return;
    wrap.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------ rendering -- */
  function renderAll() {
    renderRail();
    renderOverview();
    renderScan();
    renderAlbum();
    renderBom();
    renderPick();
    renderMaterials();
    renderSolder();
    renderInventory();
    renderHistory();
    renderInbound();
    renderOutbound();
    updateSaveStamp();
  }

  function renderRail() {
    const low = state.parts.filter((part) => part.qty <= part.min);
    const packages = state.packages.filter((pkg) => pkg.status === 'pending');
    const picks = state.picks.filter((pick) => pick.status === 'pending');

    $$('[data-count="low"]').forEach((node) => { node.textContent = low.length; });
    $$('[data-count="packages"]').forEach((node) => { node.textContent = packages.length; });
    $$('[data-count="picks"]').forEach((node) => { node.textContent = picks.length; });
  }

  function renderOverview() {
    const low = state.parts
      .filter((part) => part.qty <= part.min)
      .sort((a, b) => (a.qty / Math.max(1, a.min)) - (b.qty / Math.max(1, b.min)));
    const out = low.filter((part) => part.qty <= 0);
    const today = state.transactions.filter((tx) => isToday(tx.at));
    const todayIn = today.filter((tx) => tx.type === 'in').length;
    const todayOut = today.filter((tx) => tx.type === 'out').length;
    const categories = new Set(state.parts.map((part) => part.category));
    const bins = new Set(state.parts.map((part) => part.location));
    const units = state.parts.reduce((sum, part) => sum + part.qty, 0);

    els.statSkus.textContent = fmtNum(state.parts.length);
    els.statSkusFoot.textContent = `${categories.size} CATEGORIES`;
    els.statUnits.textContent = fmtNum(units);
    els.statUnitsFoot.textContent = `ACROSS ${bins.size} BINS`;
    els.statLow.textContent = fmtNum(low.length);
    els.statLowFoot.textContent = `${out.length} OUT OF STOCK`;
    els.statToday.textContent = fmtNum(today.length);
    els.statTodayFoot.textContent = `IN ${todayIn} / OUT ${todayOut}`;

    els.overviewAlert.hidden = low.length === 0;
    els.alertCount.textContent = low.length;
    els.alertNames.textContent = low.length
      ? `${low.slice(0, 3).map((part) => part.name).join('、')}${low.length > 3 ? ' 等' : ''}`
      : '—';

    renderChart();
    renderRacks();

    if (!low.length) {
      els.lowList.innerHTML = '<div class="low-empty">库存健康，暂时没有需要补货的元件。</div>';
    } else {
      els.lowList.innerHTML = low.map((part) => {
        const fill = Math.max(0, Math.min(12, Math.round((part.qty / Math.max(1, part.min)) * 12)));
        return `<div class="low-item">
          <div class="low-item__name">${esc(part.name)}<span>${esc(part.value)}</span></div>
          <div class="low-item__stock">${fmtNum(part.qty)} / ${fmtNum(part.min)}</div>
          <div class="low-item__bar" aria-hidden="true">${Array.from({ length: 12 }, (_, i) => `<span class="${i < fill ? 'is-on' : ''}"></span>`).join('')}</div>
          <div class="low-item__foot"><span>${esc(part.location)} · ${esc(part.category)}</span><button class="ep-btn ep-btn--ghost ep-btn--sm" type="button" data-action="in" data-id="${esc(part.id)}">补货</button></div>
        </div>`;
      }).join('');
    }

    const recent = state.transactions.slice(0, 6);
    els.recentBody.innerHTML = recent.length
      ? recent.map((tx) => {
          const part = getPart(tx.partId);
          return `<tr>
            <td><span class="ep-num">${fmtDate(tx.at)}</span></td>
            <td>${typeBadge(tx.type)}</td>
            <td>${esc(part ? partLabel(part) : '未知元件')}</td>
            <td class="is-num ${tx.type === 'in' ? 'qty-in' : 'qty-out'}">${tx.type === 'in' ? '+' : '-'}${fmtNum(tx.qty)}</td>
            <td class="note-cell">${esc(tx.note || '—')}</td>
          </tr>`;
        }).join('')
      : '<tr><td colspan="5" class="is-dim">暂无流水。先入库一件。</td></tr>';
  }

  function renderChart() {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      return date;
    });

    const counts = days.map((date) => ({ date, inc: 0, out: 0 }));
    state.transactions.forEach((tx) => {
      const txDate = new Date(tx.at);
      const bucket = counts.find((entry) => sameDay(entry.date, txDate));
      if (!bucket) return;
      if (tx.type === 'in') bucket.inc += 1;
      else bucket.out += 1;
    });

    const max = Math.max(1, ...counts.flatMap((entry) => [entry.inc, entry.out]));
    els.chart.innerHTML = counts.map(({ date, inc, out }) => {
      const inHeight = inc ? Math.max(3, Math.round((inc / max) * 100)) : 3;
      const outHeight = out ? Math.max(3, Math.round((out / max) * 100)) : 3;
      return `<div class="chart-day">
        <div class="chart-bars" aria-hidden="true">
          <span class="chart-bar${inc ? '' : ' is-zero'}" style="height:${inHeight}%"></span>
          <span class="chart-bar chart-bar--out${out ? '' : ' is-zero'}" style="height:${outHeight}%"></span>
        </div>
        <span class="chart-label">${WD[date.getDay()]}<small>${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}</small></span>
      </div>`;
    }).join('');

    const inTotal = counts.reduce((sum, entry) => sum + entry.inc, 0);
    const outTotal = counts.reduce((sum, entry) => sum + entry.out, 0);
    els.chart.setAttribute('aria-label', `近 7 天：入库 ${inTotal} 次，出库 ${outTotal} 次`);
  }

  function renderRacks() {
    if (!els.rackList) return;
    const groups = new Map();
    state.parts.forEach((part) => {
      const key = (part.location || '?').charAt(0).toUpperCase();
      const entry = groups.get(key) || { skus: 0, units: 0, low: 0 };
      entry.skus += 1;
      entry.units += part.qty;
      if (part.qty <= part.min) entry.low += 1;
      groups.set(key, entry);
    });

    const rows = Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
    const max = Math.max(1, ...rows.map(([, entry]) => entry.units));
    els.rackCount.textContent = `${rows.length} RACKS`;

    els.rackList.innerHTML = rows.map(([key, entry]) => `
      <div class="rack-row">
        <span class="rack-code ${entry.low ? 'is-low' : ''}" title="${entry.low ? `${entry.low} 个低库存` : '库存正常'}">${esc(key)}</span>
        <span>${entry.skus} SKU</span>
        <span class="rack-bar" aria-hidden="true"><span style="width:${Math.max(2, Math.round((entry.units / max) * 100))}%"></span></span>
        <span class="rack-units">${fmtNum(entry.units)}</span>
      </div>`).join('');
  }

  function renderInventory() {
    const query = ui.inv.q.trim().toLowerCase();
    let list = state.parts.filter((part) => {
      if (ui.inv.cat !== 'all' && part.category !== ui.inv.cat) return false;
      if (ui.inv.status !== 'all' && statusOf(part).key !== ui.inv.status) return false;
      if (!query) return true;
      return [part.name, part.value, part.pkg, part.location, part.supplier, part.id]
        .join(' ').toLowerCase().includes(query);
    });

    const categoryOrder = (category) => {
      const index = CATEGORIES.indexOf(category);
      return index === -1 ? 99 : index;
    };
    list = list.sort((a, b) =>
      categoryOrder(a.category) - categoryOrder(b.category) ||
      a.name.localeCompare(b.name, 'zh-CN') ||
      a.value.localeCompare(b.value, 'zh-CN')
    );

    const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (ui.inv.page > pages) ui.inv.page = pages;
    if (ui.inv.page < 1) ui.inv.page = 1;
    const start = (ui.inv.page - 1) * PAGE_SIZE;
    const rows = list.slice(start, start + PAGE_SIZE);

    els.invCount.textContent = `${fmtNum(list.length)} PARTS`;
    els.invPageLabel.textContent = `PAGE ${ui.inv.page} / ${pages}`;
    els.invRange.textContent = list.length ? `${start + 1}–${start + rows.length} / ${list.length}` : '0 / 0';

    els.invBody.innerHTML = rows.map((part) => {
      const status = statusOf(part);
      return `<tr>
        <td><button class="part-link" type="button" data-action="detail" data-id="${esc(part.id)}">${esc(part.name)}<small>${esc(part.value)} · ${esc(part.pkg)}</small></button></td>
        <td>${esc(part.category)}</td>
        <td><span class="ep-num">${esc(part.location)}</span></td>
        <td class="is-num stock-cell">${fmtNum(part.qty)}<small> / ${fmtNum(part.min)} ${esc(part.unit)}</small></td>
        <td><span class="ep-badge ${status.cls}"><i class="ep-dot"></i>${status.label}</span></td>
        <td><span class="ep-num">${fmtShortDate(part.updatedAt)}</span></td>
        <td><div class="row-actions">
          <button class="ep-btn ep-btn--secondary ep-btn--sm" type="button" data-action="in" data-id="${esc(part.id)}">入库</button>
          <button class="ep-btn ep-btn--ghost ep-btn--sm" type="button" data-action="out" data-id="${esc(part.id)}">出库</button>
        </div></td>
      </tr>`;
    }).join('');

    els.invTableWrap.hidden = list.length === 0;
    els.inventoryEmpty.hidden = list.length !== 0;
    els.invPaginationRow.hidden = list.length === 0;
    renderPager(els.invPagination, pages, ui.inv.page, 'inv');
  }

  function renderHistory() {
    const list = filteredHistory();
    const pages = Math.max(1, Math.ceil(list.length / HIST_SIZE));
    if (ui.hist.page > pages) ui.hist.page = pages;
    if (ui.hist.page < 1) ui.hist.page = 1;
    const start = (ui.hist.page - 1) * HIST_SIZE;
    const rows = list.slice(start, start + HIST_SIZE);

    els.histCount.textContent = `${fmtNum(list.length)} MOVEMENTS`;
    els.histPageLabel.textContent = `PAGE ${ui.hist.page} / ${pages}`;
    els.histRange.textContent = list.length ? `${start + 1}–${start + rows.length} / ${list.length}` : '0 / 0';

    els.histBody.innerHTML = rows.map((tx) => {
      const part = getPart(tx.partId);
      return `<tr>
        <td><span class="ep-num">${fmtDate(tx.at)}</span></td>
        <td>${typeBadge(tx.type)}</td>
        <td><span class="part-history">${esc(part ? partLabel(part) : '未知元件')}<small>${esc(part ? `${part.category} · ${part.pkg}` : '')}</small></span></td>
        <td class="is-num ${tx.type === 'in' ? 'qty-in' : 'qty-out'}">${tx.type === 'in' ? '+' : '-'}${fmtNum(tx.qty)} ${esc(tx.unit || part?.unit || '')}</td>
        <td class="party-cell">${esc(tx.party || '—')}</td>
        <td class="note-cell">${esc(tx.note || '—')}</td>
      </tr>`;
    }).join('');

    els.histTableWrap.hidden = list.length === 0;
    els.historyEmpty.hidden = list.length !== 0;
    els.histPaginationRow.hidden = list.length === 0;
    renderPager(els.histPagination, pages, ui.hist.page, 'hist');
  }

  function filteredHistory() {
    const query = ui.hist.q.trim().toLowerCase();
    return state.transactions.filter((tx) => {
      if (ui.hist.type !== 'all' && tx.type !== ui.hist.type) return false;
      if (!query) return true;
      const part = getPart(tx.partId);
      return [part?.name, part?.value, tx.note, tx.party, tx.actor]
        .join(' ').toLowerCase().includes(query);
    }).sort((a, b) => b.at.localeCompare(a.at));
  }

  function bomStats(bom) {
    const lines = bom.lines.map((line) => {
      const part = getPart(line.partId);
      return { ...line, part, ok: Boolean(part) && part.qty >= line.qty };
    });
    const missing = lines.filter((line) => !line.ok).length;
    const coverage = lines.length ? Math.round(((lines.length - missing) / lines.length) * 100) : 0;
    return { lines, missing, coverage };
  }

  function renderBom() {
    if (!els.bomList) return;
    els.bomCount.textContent = `${state.boms.length} BOMS`;
    if (!state.boms.length) {
      els.bomList.innerHTML = '<div class="low-empty">还没有 BOM。先建一个项目，再把元件加进去。</div>';
      return;
    }
    els.bomList.innerHTML = state.boms.map((bom) => {
      const stats = bomStats(bom);
      return `<article class="bom-card">
        <div class="bom-card__head">
          <div>
            <span class="ep-ui">${esc(bom.id)} · ${esc(bom.version)}</span>
            <h3>${esc(bom.name)}</h3>
          </div>
          <span class="ep-badge ${stats.missing ? 'status-low' : 'status-ok'}"><i class="ep-dot"></i>${stats.missing ? `缺 ${stats.missing} 项` : '可齐套'}</span>
        </div>
        <p class="bom-card__meta">${esc(bom.project)} · ${bom.lines.length} LINES</p>
        <div class="bom-bar" aria-hidden="true"><span style="width:${stats.coverage}%"></span></div>
        <div class="bom-card__foot">
          <span class="ep-ui">${stats.coverage}% READY</span>
          <button class="ep-btn ep-btn--secondary ep-btn--sm" type="button" data-action="bom-view" data-id="${esc(bom.id)}">查看 BOM</button>
        </div>
      </article>`;
    }).join('');
  }

  function barcodeMarkup(seed) {
    const text = String(seed || 'PD');
    return Array.from({ length: 32 }, (_, index) => {
      const code = text.charCodeAt(index % text.length);
      const width = 2 + ((code + index) % 3);
      return `<span style="width:${width}px"></span>`;
    }).join('');
  }

  function renderAlbum() {
    if (!els.albumGrid) return;
    const list = state.photos
      .map((photo) => ({ ...photo, part: getPart(photo.partId) }))
      .filter((photo) => photo.part && (ui.album.cat === 'all' || photo.part.category === ui.album.cat))
      .sort((a, b) => b.at.localeCompare(a.at));

    els.albumCount.textContent = `${list.length} RECORDS`;
    els.albumGrid.hidden = list.length === 0;
    els.albumEmpty.hidden = list.length !== 0;
    els.albumGrid.innerHTML = list.map((photo) => `
      <button class="album-card" type="button" data-action="album-view" data-id="${esc(photo.id)}">
        <span class="album-thumb">
          <span class="album-bars" aria-hidden="true">${barcodeMarkup(photo.partId + photo.id)}</span>
          <span class="album-thumb__tag">${esc(photo.part.category)}</span>
        </span>
        <span class="album-meta">
          <strong>${esc(photo.part.name)} ${esc(photo.part.value)}</strong>
          <small>${esc(photo.part.location)} · ${fmtDate(photo.at)}</small>
        </span>
      </button>`).join('');
  }

  function renderScan() {
    if (!els.packageList) return;
    const pending = state.packages.filter((pkg) => pkg.status === 'pending');
    els.packageCount.textContent = `${pending.length} 个`;
    if (!pending.length) {
      els.packageList.innerHTML = '<div class="scan-empty"><span class="ep-ui">ALL CLEAR</span><p>在途包裹都收完了。</p><a class="ep-link" href="#inbound">手动入库</a></div>';
      return;
    }
    els.packageList.innerHTML = pending.map((pkg) => {
      const part = getPart(pkg.partId);
      return `<article class="package-card" data-package-id="${esc(pkg.id)}">
        <div class="package-card__top">
          <span class="package-carrier">${esc(pkg.carrier)}</span>
          <span class="ep-badge status-low"><i class="ep-dot"></i>待收货</span>
        </div>
        <div class="package-code">${esc(pkg.tracking)}</div>
        <div class="package-item">${esc(part ? partLabel(part) : '未知元件')} <span>×${fmtNum(pkg.qty)}</span></div>
        <div class="package-meta"><span>ETA ${esc(pkg.eta)}</span><span>${esc(pkg.supplier)}</span></div>
        <div class="package-card__foot">
          <span class="ep-ui">${esc(pkg.note)}</span>
          <button class="ep-btn ep-btn--secondary ep-btn--sm" type="button" data-action="receive-package" data-id="${esc(pkg.id)}">收货</button>
        </div>
      </article>`;
    }).join('');
  }

  function renderPick() {
    if (!els.pickList) return;
    const order = [...state.picks].sort((a, b) =>
      (a.status === 'pending' ? 0 : 1) - (b.status === 'pending' ? 0 : 1) ||
      b.at.localeCompare(a.at)
    );
    const pending = state.picks.filter((pick) => pick.status === 'pending');
    const blocked = pending.filter((pick) => bomStats({ lines: pick.items }).missing > 0);
    const doneToday = state.picks.filter((pick) => pick.status === 'done' && pick.doneAt && isToday(pick.doneAt));

    els.pickPending.textContent = fmtNum(pending.length);
    els.pickShort.textContent = fmtNum(blocked.length);
    els.pickDone.textContent = fmtNum(doneToday.length);
    els.pickCount.textContent = `${pending.length} OPEN`;

    els.pickList.innerHTML = order.map((pick) => {
      const stats = bomStats({ lines: pick.items });
      const done = pick.status === 'done';
      return `<article class="pick-card ${done ? 'is-done' : ''}">
        <div class="pick-card__head">
          <span class="ep-ui">${esc(pick.id)} · ${fmtDate(pick.at)}</span>
          <span class="ep-badge ${done ? 'status-ok' : stats.missing ? 'status-low' : ''}"><i class="ep-dot"></i>${done ? '已完成' : stats.missing ? `缺 ${stats.missing} 项` : '待取件'}</span>
        </div>
        <div class="pick-card__body">
          <h3>${esc(pick.project)}</h3>
          <p>${pick.items.length} ITEMS · ${esc(pick.requested)}</p>
          <ul class="pick-lines">${pick.items.map((item) => {
            const part = getPart(item.partId);
            return `<li><span>${esc(part ? partLabel(part) : '未知')}</span><b>×${fmtNum(item.qty)}</b></li>`;
          }).join('')}</ul>
        </div>
        <div class="pick-card__foot">
          <span class="ep-ui">${done ? 'CLOSED' : stats.missing ? 'WAITING FOR STOCK' : 'READY TO PICK'}</span>
          <button class="ep-btn ep-btn--secondary ep-btn--sm" type="button" data-action="pick-open" data-id="${esc(pick.id)}">${done ? '查看' : '开始取件'}</button>
        </div>
      </article>`;
    }).join('');
  }

  function renderMaterials() {
    if (!els.materialBody) return;
    const list = state.parts.filter((part) => part.category === '耗材');
    els.materialCount.textContent = `${list.length} SKUS`;
    els.materialBody.innerHTML = list.map((part) => {
      const status = statusOf(part);
      const lastOut = state.transactions.find((tx) => tx.partId === part.id && tx.type === 'out');
      return `<tr>
        <td><button class="part-link" type="button" data-action="detail" data-id="${esc(part.id)}">${esc(part.name)}<small>${esc(part.value)} · ${esc(part.pkg)}</small></button></td>
        <td><span class="ep-num">${esc(part.location)}</span></td>
        <td class="is-num stock-cell">${fmtNum(part.qty)}<small> / ${fmtNum(part.min)} ${esc(part.unit)}</small></td>
        <td><span class="ep-badge ${status.cls}"><i class="ep-dot"></i>${status.label}</span></td>
        <td><span class="ep-num">${lastOut ? fmtShortDate(lastOut.at) : '—'}</span></td>
        <td><div class="row-actions">
          <button class="ep-btn ep-btn--secondary ep-btn--sm" type="button" data-action="material-use" data-id="${esc(part.id)}">领用</button>
          <button class="ep-btn ep-btn--ghost ep-btn--sm" type="button" data-action="in" data-id="${esc(part.id)}">补货</button>
        </div></td>
      </tr>`;
    }).join('');

    const low = list.filter((part) => part.qty <= part.min);
    els.materialLowCount.textContent = `${low.length} LOW`;
    els.materialLow.innerHTML = low.length
      ? low.map((part) => `<div class="material-low-item"><div><strong>${esc(part.name)} ${esc(part.value)}</strong><span>${esc(part.location)} · 剩 ${fmtNum(part.qty)} / ${fmtNum(part.min)} ${esc(part.unit)}</span></div><button class="ep-btn ep-btn--ghost ep-btn--sm" type="button" data-action="in" data-id="${esc(part.id)}">补货</button></div>`).join('')
      : '<div class="low-empty">耗材库存健康。</div>';

    const log = state.transactions
      .filter((tx) => tx.type === 'out' && getPart(tx.partId)?.category === '耗材')
      .slice(0, 4);
    els.materialLog.innerHTML = log.length
      ? log.map(miniRow).join('')
      : '<div class="summary-empty">还没有领用记录。</div>';
  }

  function renderSolder() {
    if (!els.stationStatus) return;
    const on = Boolean(state.stationOn);
    els.stationStatus.className = `ep-badge${on ? ' status-low' : ''}`;
    els.stationStatus.innerHTML = `<i class="ep-dot"></i>${on ? 'READY' : 'IDLE'}`;
    els.stationTemp.textContent = on ? '320' : '28';
    els.stationPower.textContent = on ? '45' : '0';
    els.stationToggle.textContent = on ? '关闭工位' : '开启工位';
    els.stationToggle.setAttribute('aria-pressed', String(on));
    els.stationBars.innerHTML = Array.from({ length: 12 }, (_, index) =>
      `<span class="${index < (on ? 9 : 1) ? 'is-on' : ''}"></span>`
    ).join('');

    const open = state.solderJobs.filter((job) => job.status !== 'done');
    els.jobCount.textContent = `${open.length} JOBS`;
    els.solderJobs.innerHTML = state.solderJobs.map((job) => `
      <article class="job-card">
        <div class="job-card__head">
          <span class="ep-ui">${esc(job.id)}</span>
          <span class="ep-badge ${job.status === 'done' ? 'status-ok' : job.status === 'active' ? 'status-low' : ''}"><i class="ep-dot"></i>${job.status === 'done' ? '已完成' : job.status === 'active' ? '进行中' : '待焊接'}</span>
        </div>
        <h3>${esc(job.project)}</h3>
        <p>${esc(job.board)} · ${fmtNum(job.qty)} PCS</p>
        <span class="job-card__note">${esc(job.note)}</span>
        <div class="job-card__foot">
          <span class="ep-ui">${job.status === 'done' ? 'SOLDERED' : 'STATION 01'}</span>
          ${job.status === 'done'
            ? '<span class="ep-ui">DONE</span>'
            : `<button class="ep-btn ep-btn--secondary ep-btn--sm" type="button" data-action="${job.status === 'active' ? 'solder-done' : 'solder-start'}" data-id="${esc(job.id)}">${job.status === 'active' ? '记录完成' : '开始焊接'}</button>`}
        </div>
      </article>`).join('');
  }

  function renderPager(container, pages, current, target) {
    const buttons = Array.from({ length: pages }, (_, i) => i + 1).map((page) =>
      `<button class="ep-page" type="button" data-action="page" data-target="${target}" data-page="${page}"${page === current ? ' aria-current="page"' : ''}>${page}</button>`
    ).join('');
    container.innerHTML = `
      <button class="ep-page pager-prev" type="button" data-action="page" data-target="${target}" data-page="${current - 1}" aria-label="上一页"${current === 1 ? ' disabled' : ''}><svg class="ep-icon" aria-hidden="true"><use href="#i-arrow"></use></svg></button>
      ${buttons}
      <button class="ep-page" type="button" data-action="page" data-target="${target}" data-page="${current + 1}" aria-label="下一页"${current === pages ? ' disabled' : ''}><svg class="ep-icon" aria-hidden="true"><use href="#i-arrow"></use></svg></button>`;
  }

  /* --------------------------------------------------------------- forms -- */
  function partOptions(selectedId, includeNew) {
    const groups = new Map(CATEGORIES.map((category) => [category, []]));
    state.parts.forEach((part) => {
      if (!groups.has(part.category)) groups.set(part.category, []);
      groups.get(part.category).push(part);
    });

    let html = '';
    groups.forEach((list, category) => {
      if (!list.length) return;
      html += `<optgroup label="${esc(category)}">`;
      list.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN') || a.value.localeCompare(b.value, 'zh-CN'))
        .forEach((part) => {
          const stock = part.qty <= 0 ? ' · 缺货' : '';
          html += `<option value="${esc(part.id)}"${part.id === selectedId ? ' selected' : ''}>${esc(part.name)} ${esc(part.value)} · ${fmtNum(part.qty)} ${esc(part.unit)}${stock}</option>`;
        });
      html += '</optgroup>';
    });

    if (includeNew) {
      html += `<option value="__new"${selectedId === '__new' ? ' selected' : ''}>＋ 新建元件 / NEW PART</option>`;
    }
    return html;
  }

  function renderInbound(preferredId, forceNew) {
    if (!els.inPart) return;
    const current = els.inPart.value;
    let target = forceNew ? '__new' : (preferredId || current || (state.parts[0] && state.parts[0].id) || '__new');
    if (target !== '__new' && !getPart(target)) target = state.parts[0]?.id || '__new';

    els.inPart.innerHTML = partOptions(target, true);
    els.inPart.value = target;

    const selectedPart = getPart(target);
    if (selectedPart && (preferredId || !els.inLocation.value)) {
      els.inLocation.value = selectedPart.location;
      els.inSupplier.value = selectedPart.supplier;
    }

    toggleNewFields();
    updateInboundSummary();
    renderMini(els.inboundRecent, 'in');
  }

  function renderOutbound(preferredId) {
    if (!els.outPart) return;
    const current = els.outPart.value;
    let target = preferredId || current || (state.parts[0] && state.parts[0].id) || '';
    if (!getPart(target)) target = state.parts[0]?.id || '';

    els.outPart.innerHTML = partOptions(target, false);
    els.outPart.value = target;

    const selectedPart = getPart(target);
    if (selectedPart && (preferredId || !els.outLocation.value)) {
      els.outLocation.value = selectedPart.location;
    }

    updateOutboundSummary();
    renderMini(els.outboundRecent, 'out');
  }

  function renderMini(container, type) {
    if (!container) return;
    const rows = state.transactions.filter((tx) => tx.type === type).slice(0, 3);
    container.innerHTML = rows.length
      ? rows.map(miniRow).join('')
      : '<div class="summary-empty">还没有记录。</div>';
  }

  function toggleNewFields() {
    const isNew = els.inPart.value === '__new';
    els.newPart.hidden = !isNew;
  }

  function updateInboundSummary() {
    const part = getPart(els.inPart.value);
    const qty = Math.max(0, Math.floor(Number(els.inQty.value) || 0));

    if (els.inPart.value === '__new') {
      const name = els.newName.value.trim();
      const category = els.newCategory.value;
      const unit = els.newUnit.value;
      const min = Math.max(0, Math.floor(Number(els.newMin.value) || 0));
      const low = qty <= min;
      els.inboundSummary.innerHTML = `
        <div class="summary-name">${name ? esc(name) : '新元件'}<span class="ep-ui">NEW PART</span></div>
        <div class="summary-meta">${esc(category)} · 提交后建立档案</div>
        <div class="summary-stock"><strong>${fmtNum(qty)}<span>${esc(unit)}</span></strong><small>入库后<br>STOCK</small></div>
        <div class="summary-row"><span>安全库存</span><strong>${fmtNum(min)} ${esc(unit)}</strong></div>
        <div class="summary-row"><span>库位</span><strong>${esc(els.inLocation.value.trim() || '未分配')}</strong></div>
        ${low ? '<div class="summary-warning summary-warning--ok">入库后仍低于安全库存，记得设个补货阈值。</div>' : ''}`;
      return;
    }

    if (!part) {
      els.inboundSummary.innerHTML = '<div class="summary-empty">先选择一个元件，或者新建一个。</div>';
      return;
    }

    const after = part.qty + qty;
    const low = after <= part.min;
    els.inboundSummary.innerHTML = `
      <div class="summary-name">${esc(part.name)}<span class="ep-ui">${esc(part.value)}</span></div>
      <div class="summary-meta">${esc(part.category)} · ${esc(part.pkg)} · ${esc(part.location)}</div>
      <div class="summary-stock"><strong>${fmtNum(part.qty)}<span>${esc(part.unit)}</span></strong><small>CURRENT<br>STOCK</small></div>
      <div class="summary-row"><span>入库后</span><strong>${fmtNum(after)} ${esc(part.unit)}</strong></div>
      <div class="summary-row"><span>安全库存</span><strong>${fmtNum(part.min)} ${esc(part.unit)}</strong></div>
      <div class="summary-row"><span>供应商</span><strong>${esc(els.inSupplier.value.trim() || part.supplier)}</strong></div>
      ${low ? `<div class="summary-warning summary-warning--ok">入库后仍低于安全库存（${fmtNum(after)} / ${fmtNum(part.min)}），建议继续补货。</div>` : ''}`;
  }

  function updateOutboundSummary() {
    const part = getPart(els.outPart.value);
    const qty = Math.max(0, Math.floor(Number(els.outQty.value) || 0));

    if (!part) {
      els.outboundSummary.innerHTML = '<div class="summary-empty">先选择一个元件。</div>';
      return;
    }

    const after = part.qty - qty;
    const over = qty > part.qty;
    const wasLow = part.qty <= part.min;
    const low = !over && after <= part.min;
    els.outboundSummary.innerHTML = `
      <div class="summary-name">${esc(part.name)}<span class="ep-ui">${esc(part.value)}</span></div>
      <div class="summary-meta">${esc(part.category)} · ${esc(part.pkg)} · ${esc(part.location)}</div>
      <div class="summary-stock"><strong>${fmtNum(part.qty)}<span>${esc(part.unit)}</span></strong><small>AVAILABLE<br>STOCK</small></div>
      <div class="summary-row"><span>出库后</span><strong>${over ? '—' : `${fmtNum(after)} ${esc(part.unit)}`}</strong></div>
      <div class="summary-row"><span>安全库存</span><strong>${fmtNum(part.min)} ${esc(part.unit)}</strong></div>
      <div class="summary-row"><span>库位</span><strong>${esc(part.location)}</strong></div>
      ${over ? `<div class="summary-warning">库存不足：当前只有 ${fmtNum(part.qty)} ${esc(part.unit)}。请减少数量。</div>` : ''}
      ${low ? `<div class="summary-warning summary-warning--ok">出库后${wasLow ? '仍低于' : '进入'}低库存（${fmtNum(after)} / ${fmtNum(part.min)}）。</div>` : ''}`;
  }

  /* ----------------------------------------------------------- dialogs -- */
  function getPackage(id) {
    return state.packages.find((pkg) => pkg.id === id);
  }

  function openReceive(id) {
    const pkg = getPackage(id);
    if (!pkg) return;
    const part = getPart(pkg.partId);
    if (!part) return;
    ui.receiveId = id;
    els.receiveDialogTitle.textContent = `收货 / ${pkg.tracking}`;
    els.receiveDialogBody.innerHTML = `
      <div class="receive-summary">
        <span class="ep-ui">${esc(pkg.carrier)} · ${esc(pkg.eta)}</span>
        <strong>${esc(partLabel(part))} ×${fmtNum(pkg.qty)}</strong>
        <span>${esc(pkg.note)} · ${esc(pkg.supplier)}</span>
      </div>
      <div class="form-grid">
        <div class="ep-field">
          <label class="ep-field__label" for="receive-part">元件 <span>PART</span></label>
          <select class="ep-select" id="receive-part">${partOptions(part.id, false)}</select>
        </div>
        <div class="ep-field">
          <label class="ep-field__label" for="receive-qty">数量 <span>QTY</span></label>
          <input class="ep-input" id="receive-qty" type="number" min="1" step="1" value="${pkg.qty}">
        </div>
        <div class="ep-field">
          <label class="ep-field__label" for="receive-location">库位 <span>LOCATION</span></label>
          <input class="ep-input" id="receive-location" type="text" value="${esc(part.location)}">
        </div>
        <div class="ep-field">
          <label class="ep-field__label" for="receive-supplier">供应商 <span>SUPPLIER</span></label>
          <input class="ep-input" id="receive-supplier" type="text" value="${esc(pkg.supplier)}" list="suppliers">
        </div>
        <div class="ep-field form-full">
          <label class="ep-field__label" for="receive-note">备注 <span>NOTE</span></label>
          <input class="ep-input" id="receive-note" type="text" value="${esc(`扫码收货 · ${pkg.tracking}`)}">
        </div>
      </div>
      <p class="dialog-note">确认后写入入库流水，并把包裹标记为已收货。数量默认按包裹数量带出，可以改。</p>`;
    els.receiveDialogFoot.innerHTML = `
      <button class="ep-btn ep-btn--secondary ep-btn--sm" type="button" data-action="close-dialog">取消</button>
      <button class="ep-btn ep-btn--primary ep-btn--sm" type="button" data-action="confirm-receive" data-id="${esc(pkg.id)}">确认入库</button>`;
    const select = $('#receive-part', els.receiveDialogBody);
    select?.addEventListener('change', () => {
      const next = getPart(select.value);
      if (!next) return;
      const location = $('#receive-location', els.receiveDialogBody);
      const supplier = $('#receive-supplier', els.receiveDialogBody);
      if (location) location.value = next.location;
      if (supplier) supplier.value = next.supplier;
    });
    if (!els.receiveDialog.open) els.receiveDialog.showModal();
  }

  function confirmReceive(id) {
    const pkg = getPackage(id);
    if (!pkg || pkg.status !== 'pending') return;
    const select = $('#receive-part', els.receiveDialogBody);
    const qtyInput = $('#receive-qty', els.receiveDialogBody);
    const part = getPart(select?.value);
    const qty = Number(qtyInput?.value);
    if (!part) {
      toast('找不到元件', '包裹关联的元件可能已被删除。', 'danger');
      return;
    }
    if (!Number.isInteger(qty) || qty <= 0) {
      qtyInput?.focus();
      toast('数量无效', '请输入大于 0 的整数。', 'danger');
      return;
    }

    const now = new Date().toISOString();
    const location = $('#receive-location', els.receiveDialogBody)?.value.trim();
    const supplier = $('#receive-supplier', els.receiveDialogBody)?.value.trim();
    const note = $('#receive-note', els.receiveDialogBody)?.value.trim() || `扫码收货 · ${pkg.tracking}`;

    part.qty += qty;
    part.updatedAt = now;
    if (location) part.location = location;
    if (supplier) part.supplier = supplier;
    state.transactions.unshift({
      id: txId(), type: 'in', partId: part.id, qty, unit: part.unit,
      actor: ACTOR, party: supplier || pkg.supplier || '—', note, at: now
    });
    pkg.status = 'received';
    pkg.receivedAt = now;
    saveState();
    renderAll();
    closeDialogs();
    toast('收货完成', `${part.name} ${part.value} +${fmtNum(qty)} ${part.unit}`);
  }

  function simulateScan() {
    const pkg = state.packages.find((item) => item.status === 'pending');
    if (!pkg) {
      toast('没有待收包裹', '在途列表已经清空。');
      return;
    }
    openReceive(pkg.id);
    toast('已识别包裹', `${pkg.carrier} · ${pkg.tracking}`);
  }

  let scanStream = null;

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast('摄像头不可用', '当前浏览器不支持摄像头预览，用「模拟扫码」即可。', 'danger');
      return;
    }
    try {
      scanStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      if (els.scanVideo) {
        els.scanVideo.srcObject = scanStream;
        els.scanVideo.hidden = false;
        await els.scanVideo.play().catch(() => {});
      }
      if (els.scanPlaceholder) els.scanPlaceholder.hidden = true;
      $$('[data-action="stop-camera"]').forEach((button) => { button.hidden = false; });
    } catch (error) {
      toast('摄像头未开启', '没有拿到摄像头权限。可以继续用「模拟扫码」。', 'danger');
    }
  }

  function stopCamera(quiet = false) {
    if (scanStream) {
      scanStream.getTracks().forEach((track) => track.stop());
      scanStream = null;
    }
    if (els.scanVideo) {
      els.scanVideo.pause();
      els.scanVideo.srcObject = null;
      els.scanVideo.hidden = true;
    }
    if (els.scanPlaceholder) els.scanPlaceholder.hidden = false;
    $$('[data-action="stop-camera"]').forEach((button) => { button.hidden = true; });
    if (!quiet) toast('摄像头已关闭', '回到模拟扫码模式。');
  }

  function openBom(id) {
    const bom = state.boms.find((item) => item.id === id);
    if (!bom) return;
    const stats = bomStats(bom);
    ui.bomId = id;
    els.bomDialogTitle.textContent = `${bom.name} / ${bom.id}`;
    els.bomDialogBody.innerHTML = `
      <div class="bom-dialog__meta">
        <span class="ep-ui">${esc(bom.project)} · ${esc(bom.version)}</span>
        <p>${esc(bom.note)}</p>
      </div>
      <div class="ep-table-wrap" tabindex="0" role="region" aria-label="${esc(bom.name)} BOM 明细">
        <table class="ep-table">
          <thead><tr><th scope="col">Part</th><th scope="col" class="is-num">Need</th><th scope="col" class="is-num">Stock</th><th scope="col">Status</th></tr></thead>
          <tbody>${stats.lines.map((line) => `<tr>
            <td>${esc(line.part ? partLabel(line.part) : '未知元件')}</td>
            <td class="is-num">${fmtNum(line.qty)} ${esc(line.part?.unit || '')}</td>
            <td class="is-num ${line.ok ? '' : 'qty-out'}">${fmtNum(line.part?.qty || 0)}</td>
            <td><span class="ep-badge ${line.ok ? 'status-ok' : 'status-low'}"><i class="ep-dot"></i>${line.ok ? '齐套' : '缺料'}</span></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
      <div class="bom-dialog__foot">
        <span class="ep-ui">${stats.coverage}% READY · ${stats.missing} SHORT</span>
        ${stats.missing ? '<span class="ep-warn-text">还有缺料，生成取件单后会显示为缺料单。</span>' : ''}
      </div>`;
    els.bomDialogFoot.innerHTML = `
      <button class="ep-btn ep-btn--secondary ep-btn--sm" type="button" data-action="close-dialog">关闭</button>
      <button class="ep-btn ep-btn--primary ep-btn--sm" type="button" data-action="bom-pick" data-id="${esc(bom.id)}">生成取件单</button>`;
    if (!els.bomDialog.open) els.bomDialog.showModal();
  }

  function makePickId() {
    let number = 1044;
    while (state.picks.some((pick) => pick.id === `PK-${number}`)) number += 1;
    return `PK-${number}`;
  }

  function createPickFromBom(id) {
    const bom = state.boms.find((item) => item.id === id);
    if (!bom) return;
    const pick = {
      id: makePickId(), project: bom.name, requested: ACTOR, bomId: bom.id,
      status: 'pending', at: new Date().toISOString(), doneAt: null,
      items: bom.lines.map((line) => ({ ...line }))
    };
    state.picks.unshift(pick);
    saveState();
    renderAll();
    closeDialogs();
    navigate('pick');
    toast('取件单已生成', `${pick.id} · ${pick.project}`);
  }

  function openPick(id) {
    const pick = state.picks.find((item) => item.id === id);
    if (!pick) return;
    const stats = bomStats({ lines: pick.items });
    ui.pickId = id;
    els.pickDialogTitle.textContent = `${pick.id} / ${pick.project}`;
    els.pickDialogBody.innerHTML = `
      <div class="pick-dialog__meta">
        <span class="ep-ui">${esc(pick.requested)} · ${fmtDate(pick.at)} · ${pick.items.length} LINES</span>
        <p>${pick.status === 'done' ? '这张单已经完成。' : '确认后按清单一次性扣减库存，并写入出库流水。'}</p>
      </div>
      <div class="ep-table-wrap" tabindex="0" role="region" aria-label="${esc(pick.id)} 取件明细">
        <table class="ep-table">
          <thead><tr><th scope="col">Part</th><th scope="col" class="is-num">Need</th><th scope="col" class="is-num">Stock</th><th scope="col">Status</th></tr></thead>
          <tbody>${stats.lines.map((line) => `<tr>
            <td>${esc(line.part ? partLabel(line.part) : '未知元件')}</td>
            <td class="is-num">${fmtNum(line.qty)} ${esc(line.part?.unit || '')}</td>
            <td class="is-num ${line.ok ? '' : 'qty-out'}">${fmtNum(line.part?.qty || 0)}</td>
            <td><span class="ep-badge ${line.ok ? 'status-ok' : 'status-low'}"><i class="ep-dot"></i>${line.ok ? '够' : '缺'}</span></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
      ${stats.missing ? '<div class="summary-warning summary-warning--ok">有缺料，先补货再确认取件。可以去扫码收货或手动入库。</div>' : ''}`;
    els.pickDialogFoot.innerHTML = `
      <button class="ep-btn ep-btn--secondary ep-btn--sm" type="button" data-action="close-dialog">关闭</button>
      ${pick.status === 'done'
        ? '<span class="ep-badge status-ok"><i class="ep-dot"></i>已完成</span>'
        : `<button class="ep-btn ep-btn--primary ep-btn--sm" type="button" data-action="pick-confirm" data-id="${esc(pick.id)}"${stats.missing ? ' disabled' : ''}>确认取件</button>`}`;
    if (!els.pickDialog.open) els.pickDialog.showModal();
  }

  function confirmPick(id) {
    const pick = state.picks.find((item) => item.id === id);
    if (!pick || pick.status === 'done') return;
    const stats = bomStats({ lines: pick.items });
    if (stats.missing) {
      toast('还缺料', '先补货，再确认取件。', 'danger');
      return;
    }
    const now = new Date().toISOString();
    stats.lines.forEach((line) => {
      const part = line.part;
      part.qty -= line.qty;
      part.updatedAt = now;
      state.transactions.unshift({
        id: txId(), type: 'out', partId: part.id, qty: line.qty, unit: part.unit,
        actor: ACTOR, party: pick.project, note: `取件 ${pick.id}`, at: now
      });
    });
    pick.status = 'done';
    pick.doneAt = now;
    saveState();
    renderAll();
    closeDialogs();
    toast('取件完成', `${pick.id} · ${pick.project} 已出库`);
  }

  function openAlbumPhoto(id) {
    const photo = state.photos.find((item) => item.id === id);
    if (!photo) return;
    const part = getPart(photo.partId);
    if (!part) return;
    ui.albumId = id;
    els.albumDialogTitle.textContent = `档案 / ${photo.id}`;
    els.albumDialogBody.innerHTML = `
      <div class="album-detail">
        <div class="album-detail__art">
          <div class="album-bars album-bars--large" aria-hidden="true">${barcodeMarkup(part.id + photo.id)}</div>
          <span class="ep-ui">${esc(part.category)} · ${esc(part.location)}</span>
        </div>
        <div class="album-detail__meta">
          <h3>${esc(part.name)} ${esc(part.value)}</h3>
          <p>${esc(part.pkg)} · ${esc(part.supplier)}</p>
          <p class="album-note">${esc(photo.note)}</p>
          <span class="ep-ui">${fmtDate(photo.at)} · ${esc(photo.id)}</span>
        </div>
      </div>`;
    els.albumDialogFoot.innerHTML = `
      <button class="ep-btn ep-btn--secondary ep-btn--sm" type="button" data-action="close-dialog">关闭</button>
      <button class="ep-btn ep-btn--secondary ep-btn--sm" type="button" data-action="album-part" data-id="${esc(part.id)}">查看元件</button>`;
    if (!els.albumDialog.open) els.albumDialog.showModal();
  }

  function openAlbumAdd() {
    ui.albumId = null;
    els.albumDialogTitle.textContent = '新增档案';
    els.albumDialogBody.innerHTML = `
      <div class="form-grid">
        <div class="ep-field form-full">
          <label class="ep-field__label" for="album-part">元件 <span>PART</span></label>
          <select class="ep-select" id="album-part">${partOptions(state.parts[0]?.id, false)}</select>
        </div>
        <div class="ep-field form-full">
          <label class="ep-field__label" for="album-note">备注 <span>NOTE</span></label>
          <input class="ep-input" id="album-note" type="text" placeholder="批次 / 外观 / 位置">
        </div>
      </div>
      <p class="dialog-note">保存后生成一张扫描件档案，不需要上传真实照片。</p>`;
    els.albumDialogFoot.innerHTML = `
      <button class="ep-btn ep-btn--secondary ep-btn--sm" type="button" data-action="close-dialog">取消</button>
      <button class="ep-btn ep-btn--primary ep-btn--sm" type="button" data-action="album-save">保存档案</button>`;
    if (!els.albumDialog.open) els.albumDialog.showModal();
  }

  function saveAlbum() {
    const part = getPart($('#album-part', els.albumDialogBody)?.value);
    if (!part) return;
    const note = $('#album-note', els.albumDialogBody)?.value.trim() || '手动归档';
    const photo = {
      id: `PH-${Date.now().toString(36).toUpperCase()}`,
      partId: part.id, note, at: new Date().toISOString()
    };
    state.photos.unshift(photo);
    saveState();
    renderAll();
    closeDialogs();
    toast('档案已保存', `${part.name} ${part.value} · ${note}`);
  }

  function toggleStation() {
    state.stationOn = !state.stationOn;
    saveState();
    renderSolder();
    toast(state.stationOn ? '工位已开启' : '工位已关闭', state.stationOn ? '目标 320°C · 演示模式' : '温度回到待机。');
  }

  function startSolderJob(id) {
    const job = state.solderJobs.find((item) => item.id === id);
    if (!job) return;
    state.solderJobs.forEach((item) => {
      if (item.status === 'active' && item.id !== id) item.status = 'queued';
    });
    job.status = 'active';
    job.startedAt = new Date().toISOString();
    saveState();
    renderSolder();
    toast('开始焊接', `${job.id} · ${job.project}`);
  }

  function finishSolderJob(id) {
    const job = state.solderJobs.find((item) => item.id === id);
    if (!job) return;
    job.status = 'done';
    job.doneAt = new Date().toISOString();
    saveState();
    renderSolder();
    toast('工单完成', `${job.id} · ${job.project}`);
  }

  /* -------------------------------------------------------------- actions -- */
  function showError(input, errorEl, message) {
    input.setAttribute('aria-invalid', 'true');
    errorEl.textContent = message;
    errorEl.hidden = false;
    errorEl.setAttribute('role', 'alert');
    input.focus();
  }

  function clearError(input, errorEl) {
    input.removeAttribute('aria-invalid');
    errorEl.hidden = true;
    errorEl.textContent = '';
  }

  function clearInboundErrors() {
    clearError(els.inQty, els.inQtyError);
    clearError(els.newName, els.newNameError);
  }

  function clearOutboundErrors() {
    clearError(els.outQty, els.outQtyError);
  }

  function onInbound(event) {
    event.preventDefault();
    clearInboundErrors();

    const isNew = els.inPart.value === '__new';
    const qty = Number(els.inQty.value);
    if (!Number.isInteger(qty) || qty <= 0) {
      showError(els.inQty, els.inQtyError, '数量必须是大于 0 的整数。');
      return;
    }

    const now = new Date().toISOString();
    const supplierInput = els.inSupplier.value.trim();
    const locationInput = els.inLocation.value.trim();
    const note = els.inNote.value.trim() || '入库';
    let part;

    if (isNew) {
      const name = els.newName.value.trim();
      if (!name) {
        showError(els.newName, els.newNameError, '给新元件一个名字。');
        return;
      }
      part = {
        id: makeId('P'),
        name,
        category: els.newCategory.value,
        value: els.newValue.value.trim() || '—',
        pkg: els.newPkg.value.trim() || '—',
        qty,
        min: Math.max(0, Math.floor(Number(els.newMin.value) || 0)),
        unit: els.newUnit.value,
        location: locationInput || '未分配',
        supplier: supplierInput || '未记录',
        updatedAt: now
      };
      state.parts.push(part);
    } else {
      part = getPart(els.inPart.value);
      if (!part) {
        showError(els.inPart, els.inQtyError, '请选择一个有效元件。');
        return;
      }
      part.qty += qty;
      part.updatedAt = now;
      if (supplierInput) part.supplier = supplierInput;
      if (locationInput) part.location = locationInput;
    }

    state.transactions.unshift({
      id: txId(),
      type: 'in',
      partId: part.id,
      qty,
      unit: part.unit,
      actor: ACTOR,
      party: supplierInput || part.supplier || '—',
      note,
      at: now
    });

    saveState();
    renderAll();
    renderInbound(part.id);

    els.inQty.value = '1';
    els.inNote.value = '';
    els.newName.value = '';
    els.newValue.value = '';
    els.newPkg.value = '';
    els.newMin.value = '1';
    clearInboundErrors();
    updateInboundSummary();

    toast('入库完成', `${part.name} ${part.value} +${fmtNum(qty)} ${part.unit}`);
  }

  function onOutbound(event) {
    event.preventDefault();
    clearOutboundErrors();

    const part = getPart(els.outPart.value);
    const qty = Number(els.outQty.value);
    if (!part) {
      showError(els.outQty, els.outQtyError, '请选择一个有效元件。');
      return;
    }
    if (!Number.isInteger(qty) || qty <= 0) {
      showError(els.outQty, els.outQtyError, '数量必须是大于 0 的整数。');
      return;
    }
    if (qty > part.qty) {
      showError(els.outQty, els.outQtyError, `库存不足，仅剩 ${fmtNum(part.qty)} ${part.unit}。`);
      updateOutboundSummary();
      return;
    }

    const now = new Date().toISOString();
    const project = els.outProject.value.trim();
    const note = els.outNote.value.trim() || '出库';
    part.qty -= qty;
    part.updatedAt = now;

    state.transactions.unshift({
      id: txId(),
      type: 'out',
      partId: part.id,
      qty,
      unit: part.unit,
      actor: ACTOR,
      party: project || '—',
      note,
      at: now
    });

    saveState();
    renderAll();
    renderOutbound(part.id);

    els.outQty.value = '1';
    els.outProject.value = '';
    els.outNote.value = '';
    clearOutboundErrors();
    updateOutboundSummary();

    const suffix = part.qty <= 0 ? ' · 库存已清零' : (part.qty <= part.min ? ' · 已进入低库存' : '');
    toast('出库完成', `${part.name} ${part.value} -${fmtNum(qty)} ${part.unit}${suffix}`);
  }

  function resetData() {
    state = seedState();
    saveState();
    ui.inv = { q: '', cat: 'all', status: 'all', page: 1 };
    ui.hist = { q: '', type: 'all', page: 1 };
    ui.album = { cat: 'all' };
    ui.prefill = null;
    ui.dialogPart = null;
    ui.receiveId = null;
    ui.bomId = null;
    ui.pickId = null;
    ui.albumId = null;
    els.invSearch.value = '';
    els.invCat.value = 'all';
    els.invStatus.value = 'all';
    els.albumCat.value = 'all';
    els.histSearch.value = '';
    els.histType.value = 'all';
    els.inQty.value = '1';
    els.inNote.value = '';
    els.newName.value = '';
    els.newValue.value = '';
    els.newPkg.value = '';
    els.newMin.value = '1';
    els.outQty.value = '1';
    els.outProject.value = '';
    els.outNote.value = '';
    clearInboundErrors();
    clearOutboundErrors();
    stopCamera(true);
    closeDialogs();
    renderAll();
    if (location.hash === '#scan') route(false);
    else location.hash = '#scan';
    toast('演示数据已重置', `${state.parts.length} 个元件与 ${state.transactions.length} 条流水已恢复。`);
  }

  function exportJson() {
    download(
      `parts-depot-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(state, null, 2),
      'application/json;charset=utf-8'
    );
    toast('已导出', '完整数据已保存为 JSON。');
  }

  function exportCsv() {
    const list = filteredHistory();
    if (!list.length) {
      toast('没有可导出的流水', '当前筛选下为空。', 'danger');
      return;
    }
    const header = ['时间', '类型', '元件', '型号', '数量', '单位', '对方/项目', '备注'];
    const lines = [header.map(csvCell).join(',')];
    list.forEach((tx) => {
      const part = getPart(tx.partId);
      lines.push([
        fmtDate(tx.at),
        tx.type === 'in' ? '入库' : '出库',
        part?.name || '未知元件',
        part?.value || '',
        tx.qty,
        tx.unit || part?.unit || '',
        tx.party || '',
        tx.note || ''
      ].map(csvCell).join(','));
    });
    download(
      `parts-depot-history-${new Date().toISOString().slice(0, 10)}.csv`,
      `\ufeff${lines.join('\r\n')}`,
      'text/csv;charset=utf-8'
    );
    toast('已导出', `CSV 包含 ${list.length} 条流水。`);
  }

  function openPart(id) {
    const part = getPart(id);
    if (!part) return;
    ui.dialogPart = id;
    const status = statusOf(part);
    const recent = state.transactions.filter((tx) => tx.partId === id).slice(0, 4);

    els.partDialogTitle.textContent = `${part.name} ${part.value}`;
    els.partDialogBody.innerHTML = `
      <div class="part-detail">
        <div class="part-detail__top">
          <div>
            <span class="ep-ui">Current stock</span>
            <div class="part-detail__stock">${fmtNum(part.qty)}<span>${esc(part.unit)}</span></div>
          </div>
          <span class="ep-badge ${status.cls}"><i class="ep-dot"></i>${status.label}</span>
        </div>
        <div class="part-detail__grid">
          <div class="part-detail__row"><span>类别</span><strong>${esc(part.category)}</strong></div>
          <div class="part-detail__row"><span>封装</span><strong>${esc(part.pkg)}</strong></div>
          <div class="part-detail__row"><span>库位</span><strong>${esc(part.location)}</strong></div>
          <div class="part-detail__row"><span>安全库存</span><strong>${fmtNum(part.min)} ${esc(part.unit)}</strong></div>
          <div class="part-detail__row"><span>供应商</span><strong>${esc(part.supplier)}</strong></div>
          <div class="part-detail__row"><span>更新</span><strong>${fmtDate(part.updatedAt)}</strong></div>
        </div>
        <div>
          <span class="ep-ui">Recent movements</span>
          <div class="part-detail__log">${recent.length ? recent.map(miniRow).join('') : '<div class="summary-empty">还没有该元件的流水。</div>'}</div>
        </div>
      </div>`;
    els.partDialogFoot.innerHTML = `
      <button class="ep-btn ep-btn--ghost ep-btn--sm" type="button" data-action="close-dialog">关闭</button>
      <button class="ep-btn ep-btn--secondary ep-btn--sm" type="button" data-action="dialog-out" data-id="${esc(part.id)}">出库</button>
      <button class="ep-btn ep-btn--primary ep-btn--sm" type="button" data-action="dialog-in" data-id="${esc(part.id)}">入库</button>`;
    if (!els.partDialog.open) els.partDialog.showModal();
  }

  function closeDialogs() {
    $$('dialog[open]').forEach((dialog) => dialog.close());
  }

  function navigate(view, options = {}) {
    ui.prefill = options;
    if (location.hash === `#${view}`) route(false);
    else location.hash = `#${view}`;
  }

  function toast(title, body, variant = 'ok') {
    const el = document.createElement('div');
    el.className = `ep-toast${variant === 'danger' ? ' ep-toast--danger' : ''}`;
    el.setAttribute('role', 'status');
    el.innerHTML = '<div><div class="ep-toast__title"></div><div class="ep-toast__body"></div></div><button class="ep-toast__close" type="button" data-action="close-toast" aria-label="关闭提示">X</button>';
    el.querySelector('.ep-toast__title').textContent = title;
    el.querySelector('.ep-toast__body').textContent = body;
    els.toastStack.prepend(el);
    while (els.toastStack.children.length > 3) els.toastStack.lastElementChild.remove();
    el._timer = setTimeout(() => el.remove(), 5000);
  }

  function updateSaveStamp() {
    if (!els.saveStamp) return;
    const when = state.savedAt ? fmtTime(state.savedAt) : '--:--';
    els.saveStamp.textContent = when;
    els.storageLabel.textContent = storageOk ? 'LOCAL' : 'MEMORY';
  }

  /* --------------------------------------------------------------- route -- */
  function route(initial = false) {
    const hash = location.hash.replace('#', '');
    const view = VIEWS.includes(hash) ? hash : 'scan';
    ui.view = view;

    if (view !== 'scan') stopCamera(true);

    $$('.view').forEach((section) => {
      section.hidden = section.dataset.view !== view;
    });

    const activeNav = RELATED_NAV[view] || view;
    $$('[data-nav]').forEach((link) => {
      if (link.dataset.nav === activeNav) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    const home = $('[data-home]');
    if (home) {
      if (view === 'overview') home.setAttribute('aria-current', 'page');
      else home.removeAttribute('aria-current');
    }

    els.crumb.textContent = view === 'scan' ? 'SCAN' : TITLES[view].toUpperCase();
    els.sysState.textContent = view === 'scan' ? '入库定位中' : 'STOCK READY';
    document.title = `${TITLES[view]} — Parts Depot`;

    if (view === 'inbound') {
      const prefill = ui.prefill || {};
      renderInbound(prefill.partId, Boolean(prefill.isNew));
    }
    if (view === 'outbound') {
      const prefill = ui.prefill || {};
      renderOutbound(prefill.partId);
    }
    ui.prefill = null;

    if (!initial) {
      const heading = $(`#view-${view} h1`);
      if (heading) heading.focus({ preventScroll: true });
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }

  /* -------------------------------------------------------------- events -- */
  function bind() {
    window.addEventListener('hashchange', () => route(false));

    els.inPart.addEventListener('change', () => {
      const part = getPart(els.inPart.value);
      toggleNewFields();
      if (part) {
        els.inLocation.value = part.location;
        els.inSupplier.value = part.supplier;
      }
      updateInboundSummary();
    });
    els.inQty.addEventListener('input', () => {
      clearError(els.inQty, els.inQtyError);
      updateInboundSummary();
    });
    els.inSupplier.addEventListener('input', updateInboundSummary);
    els.inLocation.addEventListener('input', updateInboundSummary);
    els.newName.addEventListener('input', () => {
      clearError(els.newName, els.newNameError);
      updateInboundSummary();
    });
    els.newMin.addEventListener('input', updateInboundSummary);
    els.newCategory.addEventListener('change', updateInboundSummary);
    els.newUnit.addEventListener('change', updateInboundSummary);

    els.outPart.addEventListener('change', () => {
      const part = getPart(els.outPart.value);
      if (part) els.outLocation.value = part.location;
      updateOutboundSummary();
    });
    els.outQty.addEventListener('input', () => {
      clearError(els.outQty, els.outQtyError);
      updateOutboundSummary();
    });

    els.inboundForm.addEventListener('submit', onInbound);
    els.outboundForm.addEventListener('submit', onOutbound);

    els.invSearch.addEventListener('input', () => {
      ui.inv.q = els.invSearch.value;
      ui.inv.page = 1;
      renderInventory();
    });
    els.invCat.addEventListener('change', () => {
      ui.inv.cat = els.invCat.value;
      ui.inv.page = 1;
      renderInventory();
    });
    els.invStatus.addEventListener('change', () => {
      ui.inv.status = els.invStatus.value;
      ui.inv.page = 1;
      renderInventory();
    });

    els.histSearch.addEventListener('input', () => {
      ui.hist.q = els.histSearch.value;
      ui.hist.page = 1;
      renderHistory();
    });
    els.histType.addEventListener('change', () => {
      ui.hist.type = els.histType.value;
      ui.hist.page = 1;
      renderHistory();
    });

    els.albumCat.addEventListener('change', () => {
      ui.album.cat = els.albumCat.value;
      renderAlbum();
    });

    els.newPartBtn.addEventListener('click', () => {
      navigate('inbound', { isNew: true });
    });

    document.addEventListener('click', (event) => {
      $$('.ep-menu[open]').forEach((menu) => {
        if (!menu.contains(event.target)) menu.open = false;
      });

      const trigger = event.target.closest('[data-action]');
      if (!trigger) return;
      const action = trigger.dataset.action;

      if (action === 'close-toast') {
        const toastEl = trigger.closest('.ep-toast');
        if (toastEl) {
          clearTimeout(toastEl._timer);
          toastEl.remove();
        }
        return;
      }

      if (action === 'close-dialog') {
        trigger.closest('dialog')?.close();
        return;
      }

      if (action === 'reset-open') {
        closeMenus();
        if (!els.resetDialog.open) els.resetDialog.showModal();
        return;
      }

      if (action === 'confirm-reset') {
        resetData();
        return;
      }

      if (action === 'export-json') {
        closeMenus();
        exportJson();
        return;
      }

      if (action === 'export-csv') {
        exportCsv();
        return;
      }

      if (action === 'clear-filters') {
        ui.inv = { q: '', cat: 'all', status: 'all', page: 1 };
        els.invSearch.value = '';
        els.invCat.value = 'all';
        els.invStatus.value = 'all';
        renderInventory();
        return;
      }

      if (action === 'clear-history') {
        ui.hist = { q: '', type: 'all', page: 1 };
        els.histSearch.value = '';
        els.histType.value = 'all';
        renderHistory();
        return;
      }

      if (action === 'simulate-scan') {
        simulateScan();
        return;
      }

      if (action === 'start-camera') {
        startCamera();
        return;
      }

      if (action === 'stop-camera') {
        stopCamera();
        return;
      }

      if (action === 'sync-packages') {
        els.syncStamp.textContent = '刚刚同步';
        toast('同步完成', '在途包裹已经是最新状态。');
        return;
      }

      if (action === 'receive-package') {
        openReceive(trigger.dataset.id);
        return;
      }

      if (action === 'confirm-receive') {
        confirmReceive(trigger.dataset.id);
        return;
      }

      if (action === 'bom-view') {
        openBom(trigger.dataset.id);
        return;
      }

      if (action === 'bom-pick') {
        createPickFromBom(trigger.dataset.id);
        return;
      }

      if (action === 'pick-open') {
        openPick(trigger.dataset.id);
        return;
      }

      if (action === 'pick-confirm') {
        confirmPick(trigger.dataset.id);
        return;
      }

      if (action === 'album-add') {
        openAlbumAdd();
        return;
      }

      if (action === 'album-view') {
        openAlbumPhoto(trigger.dataset.id);
        return;
      }

      if (action === 'album-part') {
        const id = trigger.dataset.id;
        closeDialogs();
        openPart(id);
        return;
      }

      if (action === 'album-save') {
        saveAlbum();
        return;
      }

      if (action === 'material-use') {
        closeMenus();
        navigate('outbound', { partId: trigger.dataset.id });
        return;
      }

      if (action === 'station-toggle') {
        toggleStation();
        return;
      }

      if (action === 'solder-start') {
        startSolderJob(trigger.dataset.id);
        return;
      }

      if (action === 'solder-done') {
        finishSolderJob(trigger.dataset.id);
        return;
      }

      if (action === 'in' || action === 'out') {
        closeMenus();
        navigate(action === 'in' ? 'inbound' : 'outbound', { partId: trigger.dataset.id });
        return;
      }

      if (action === 'detail') {
        openPart(trigger.dataset.id);
        return;
      }

      if (action === 'dialog-in' || action === 'dialog-out') {
        const id = trigger.dataset.id;
        trigger.closest('dialog')?.close();
        navigate(action === 'dialog-in' ? 'inbound' : 'outbound', { partId: id });
        return;
      }

      if (action === 'page') {
        const target = trigger.dataset.target;
        const page = Number(trigger.dataset.page);
        if (target === 'inv') {
          ui.inv.page = page;
          renderInventory();
          focusTable(els.invTableWrap);
        } else {
          ui.hist.page = page;
          renderHistory();
          focusTable(els.histTableWrap);
        }
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const openMenu = $('.ep-menu[open]');
      if (openMenu) {
        openMenu.open = false;
        openMenu.querySelector('summary')?.focus();
      }
    });

    [els.partDialog, els.resetDialog, els.receiveDialog, els.bomDialog, els.pickDialog, els.albumDialog].forEach((dialog) => {
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
      });
    });
  }

  function closeMenus() {
    $$('.ep-menu[open]').forEach((menu) => { menu.open = false; });
  }

  /* ---------------------------------------------------------------- boot -- */
  function cache() {
    els.rail = $('.rail');
    els.crumb = $('#crumb');
    els.todayDate = $('#today-date');
    els.sysState = $('#sys-state');
    els.saveStamp = $('#save-stamp');
    els.storageLabel = $('#storage-label');
    els.overviewAlert = $('#overview-alert');
    els.alertCount = $('#alert-count');
    els.alertNames = $('#alert-names');
    els.statSkus = $('#stat-skus');
    els.statSkusFoot = $('#stat-skus-foot');
    els.statUnits = $('#stat-units');
    els.statUnitsFoot = $('#stat-units-foot');
    els.statLow = $('#stat-low');
    els.statLowFoot = $('#stat-low-foot');
    els.statToday = $('#stat-today');
    els.statTodayFoot = $('#stat-today-foot');
    els.chart = $('#activity-chart');
    els.rackList = $('#rack-list');
    els.rackCount = $('#rack-count');
    els.lowList = $('#low-list');
    els.recentBody = $('#recent-body');

    els.scanVideo = $('#scan-video');
    els.scanPlaceholder = $('#scan-placeholder');
    els.packageList = $('#package-list');
    els.packageCount = $('#package-count');
    els.syncStamp = $('#sync-stamp');

    els.albumCat = $('#album-cat');
    els.albumCount = $('#album-count');
    els.albumGrid = $('#album-grid');
    els.albumEmpty = $('#album-empty');

    els.bomList = $('#bom-list');
    els.bomCount = $('#bom-count');

    els.pickPending = $('#pick-pending');
    els.pickShort = $('#pick-short');
    els.pickDone = $('#pick-done');
    els.pickCount = $('#pick-count');
    els.pickList = $('#pick-list');

    els.materialCount = $('#material-count');
    els.materialBody = $('#material-body');
    els.materialLow = $('#material-low');
    els.materialLowCount = $('#material-low-count');
    els.materialLog = $('#material-log');

    els.stationStatus = $('#station-status');
    els.stationTemp = $('#station-temp');
    els.stationPower = $('#station-power');
    els.stationToggle = $('#station-toggle');
    els.stationBars = $('#station-bars');
    els.jobCount = $('#job-count');
    els.solderJobs = $('#solder-jobs');

    els.inboundForm = $('#inbound-form');
    els.inPart = $('#in-part');
    els.inQty = $('#in-qty');
    els.inQtyError = $('#in-qty-error');
    els.inSupplier = $('#in-supplier');
    els.inLocation = $('#in-location');
    els.inNote = $('#in-note');
    els.newPart = $('#new-part-fields');
    els.newName = $('#new-name');
    els.newNameError = $('#new-name-error');
    els.newCategory = $('#new-category');
    els.newValue = $('#new-value');
    els.newPkg = $('#new-pkg');
    els.newUnit = $('#new-unit');
    els.newMin = $('#new-min');
    els.inboundSummary = $('#inbound-summary');
    els.inboundRecent = $('#inbound-recent');

    els.outboundForm = $('#outbound-form');
    els.outPart = $('#out-part');
    els.outQty = $('#out-qty');
    els.outQtyError = $('#out-qty-error');
    els.outProject = $('#out-project');
    els.outLocation = $('#out-location');
    els.outNote = $('#out-note');
    els.outboundSummary = $('#outbound-summary');
    els.outboundRecent = $('#outbound-recent');

    els.invSearch = $('#inv-search');
    els.invCat = $('#inv-cat');
    els.invStatus = $('#inv-status');
    els.invCount = $('#inv-count');
    els.invPageLabel = $('#inv-page-label');
    els.invRange = $('#inv-range');
    els.invBody = $('#inventory-body');
    els.invTableWrap = $('#inv-table-wrap');
    els.inventoryEmpty = $('#inventory-empty');
    els.invPagination = $('#inventory-pagination');
    els.invPaginationRow = els.invPagination.closest('.pagination-row');
    els.newPartBtn = $('#new-part-btn');

    els.histSearch = $('#hist-search');
    els.histType = $('#hist-type');
    els.histCount = $('#hist-count');
    els.histPageLabel = $('#hist-page-label');
    els.histRange = $('#hist-range');
    els.histBody = $('#history-body');
    els.histTableWrap = $('#history-table-wrap');
    els.historyEmpty = $('#history-empty');
    els.histPagination = $('#history-pagination');
    els.histPaginationRow = els.histPagination.closest('.pagination-row');

    els.partDialog = $('#part-dialog');
    els.partDialogTitle = $('#part-dialog-title');
    els.partDialogBody = $('#part-dialog-body');
    els.partDialogFoot = $('#part-dialog-foot');

    els.receiveDialog = $('#receive-dialog');
    els.receiveDialogTitle = $('#receive-dialog-title');
    els.receiveDialogBody = $('#receive-dialog-body');
    els.receiveDialogFoot = $('#receive-dialog-foot');

    els.bomDialog = $('#bom-dialog');
    els.bomDialogTitle = $('#bom-dialog-title');
    els.bomDialogBody = $('#bom-dialog-body');
    els.bomDialogFoot = $('#bom-dialog-foot');

    els.pickDialog = $('#pick-dialog');
    els.pickDialogTitle = $('#pick-dialog-title');
    els.pickDialogBody = $('#pick-dialog-body');
    els.pickDialogFoot = $('#pick-dialog-foot');

    els.albumDialog = $('#album-dialog');
    els.albumDialogTitle = $('#album-dialog-title');
    els.albumDialogBody = $('#album-dialog-body');
    els.albumDialogFoot = $('#album-dialog-foot');

    els.resetDialog = $('#reset-dialog');
    els.toastStack = $('#toast-stack');
  }

  function populateCategories() {
    const filterOptions = ['<option value="all">全部</option>']
      .concat(CATEGORIES.map((category) => `<option value="${esc(category)}">${esc(category)}</option>`))
      .join('');
    els.invCat.innerHTML = filterOptions;
    els.albumCat.innerHTML = filterOptions;
    els.newCategory.innerHTML = CATEGORIES.map((category) => `<option value="${esc(category)}">${esc(category)}</option>`).join('');
    els.newCategory.value = CATEGORIES[0];
  }

  function init() {
    cache();
    populateCategories();
    bind();
    els.todayDate.textContent = fmtTopDate(new Date());
    if (!location.hash) history.replaceState(null, '', '#scan');
    saveState();
    renderAll();
    route(true);
    updateSaveStamp();
  }

  document.addEventListener('DOMContentLoaded', init);
})();

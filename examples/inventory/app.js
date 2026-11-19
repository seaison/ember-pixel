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
  const VIEWS = ['overview', 'inbound', 'outbound', 'inventory', 'history'];
  const TITLES = {
    overview: 'Overview',
    inbound: 'Inbound',
    outbound: 'Outbound',
    inventory: 'Inventory',
    history: 'History'
  };
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
    { id: 'WR-DUPONT', name: '杜邦线', category: '耗材', value: '20cm', pkg: '母对母 40P', qty: 1, min: 2, unit: '盒', location: 'F1-02', supplier: '淘宝' }
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

    return { version: 1, savedAt: new Date(now).toISOString(), parts, transactions };
  }

  let storageOk = true;
  function loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1 && Array.isArray(parsed.parts) && Array.isArray(parsed.transactions)) {
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
    view: 'overview',
    inv: { q: '', cat: 'all', status: 'all', page: 1 },
    hist: { q: '', type: 'all', page: 1 },
    prefill: null,
    dialogPart: null
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
    return `<div class="mini-tx"><b>${esc(part ? partLabel(part) : '未知元件')}</b><span>${fmtDate(tx.at)} · ${tx.type === 'in' ? '+' : '−'}${fmtNum(tx.qty)} ${esc(tx.unit || part?.unit || '')}</span></div>`;
  }

  function focusTable(wrap) {
    if (!wrap || wrap.hidden) return;
    wrap.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------ rendering -- */
  function renderAll() {
    renderRail();
    renderOverview();
    renderInventory();
    renderHistory();
    renderInbound();
    renderOutbound();
    updateSaveStamp();
  }

  function renderRail() {
    const low = state.parts.filter((part) => part.qty <= part.min);
    const healthy = state.parts.length - low.length;
    const pct = state.parts.length ? Math.round((healthy / state.parts.length) * 100) : 0;

    $$('[data-count="skus"]').forEach((node) => { node.textContent = state.parts.length; });
    $$('[data-count="low"]').forEach((node) => { node.textContent = low.length; });

    els.healthPct.textContent = `${pct}%`;
    els.healthOk.textContent = healthy;
    els.healthLow.textContent = low.length;

    const filled = Math.round((pct / 100) * 12);
    els.healthMeter.innerHTML = Array.from({ length: 12 }, (_, i) =>
      `<span class="${i < filled ? 'is-on' : ''}"></span>`
    ).join('');
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
            <td class="is-num ${tx.type === 'in' ? 'qty-in' : 'qty-out'}">${tx.type === 'in' ? '+' : '−'}${fmtNum(tx.qty)}</td>
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
        <td class="is-num ${tx.type === 'in' ? 'qty-in' : 'qty-out'}">${tx.type === 'in' ? '+' : '−'}${fmtNum(tx.qty)} ${esc(tx.unit || part?.unit || '')}</td>
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
    toast('出库完成', `${part.name} ${part.value} −${fmtNum(qty)} ${part.unit}${suffix}`);
  }

  function resetData() {
    state = seedState();
    saveState();
    ui.inv = { q: '', cat: 'all', status: 'all', page: 1 };
    ui.hist = { q: '', type: 'all', page: 1 };
    ui.prefill = null;
    ui.dialogPart = null;
    els.invSearch.value = '';
    els.invCat.value = 'all';
    els.invStatus.value = 'all';
    els.histSearch.value = '';
    els.histType.value = 'all';
    clearInboundErrors();
    clearOutboundErrors();
    closeDialogs();
    renderAll();
    if (location.hash === '#overview') route(false);
    else location.hash = '#overview';
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
    els.storageLabel.textContent = storageOk ? 'LOCAL STORAGE' : 'MEMORY ONLY';
  }

  /* --------------------------------------------------------------- route -- */
  function route(initial = false) {
    const hash = location.hash.replace('#', '');
    const view = VIEWS.includes(hash) ? hash : 'overview';
    ui.view = view;

    $$('.view').forEach((section) => {
      section.hidden = section.dataset.view !== view;
    });
    $$('[data-nav]').forEach((link) => {
      if (link.dataset.nav === view) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    els.crumb.textContent = view.toUpperCase();
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

    [els.partDialog, els.resetDialog].forEach((dialog) => {
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
    els.healthPct = $('#health-pct');
    els.healthOk = $('#health-ok');
    els.healthLow = $('#health-low');
    els.healthMeter = $('#health-meter');
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
    els.lowList = $('#low-list');
    els.recentBody = $('#recent-body');

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
    els.resetDialog = $('#reset-dialog');
    els.toastStack = $('#toast-stack');
  }

  function populateCategories() {
    const filterOptions = ['<option value="all">全部</option>']
      .concat(CATEGORIES.map((category) => `<option value="${esc(category)}">${esc(category)}</option>`))
      .join('');
    els.invCat.innerHTML = filterOptions;
    els.newCategory.innerHTML = CATEGORIES.map((category) => `<option value="${esc(category)}">${esc(category)}</option>`).join('');
    els.newCategory.value = CATEGORIES[0];
  }

  function init() {
    cache();
    populateCategories();
    bind();
    els.todayDate.textContent = fmtTopDate(new Date());
    if (!location.hash) history.replaceState(null, '', '#overview');
    saveState();
    renderAll();
    route(true);
    updateSaveStamp();
  }

  document.addEventListener('DOMContentLoaded', init);
})();

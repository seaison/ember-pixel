---
name: ember-pixel
description: 黑橙点阵 UI 设计系统（Ember Pixel）：黑底 #060606、主橙 #FC5C1E、Doto/Silkscreen/Fusion Pixel、0 圆角、8px 网格、steps 动效。用于黑橙 UI、点阵/像素风、深色终端感、dashboard、design tokens 与视觉规范。
---

# Ember Pixel

黑是画布，橙是信号，点阵是骨架。一套可以直接落地的深色像素化 UI 系统，色彩取自参考海报的 `#FC5C1E`。

这不是“复古游戏皮肤”。它是一套有明确约束的现代界面语言：黑色负责安静，橙色负责行动，像素字体负责识别度。

## 兼容性

这份 skill 是纯 Markdown + 相对路径资源，不依赖 DSH 专有 API：

- **SKILL.md / Agent Skills 标准**：DSH、Claude Code，以及任何支持 `SKILL.md` + YAML frontmatter 的工具。把整个目录放进对应的 skills 目录即可。
- **读取 AGENTS.md 的工具**：Codex、Cursor、Windsurf 等，使用仓库根目录的 `AGENTS.md`。
- **只能粘贴提示词的聊天工具**：使用 `prompt.md`。

规范本身与框架无关：HTML/CSS、React、Vue、Svelte 都可以；`assets/ember.css` 是纯 CSS，没有构建依赖。

## 先读这三个文件

| 文件 | 作用 |
| --- | --- |
| `assets/ember.css` | 完整的 token + 组件库。直接复制，不要另起一套 |
| `assets/styleguide.html` | 视觉基准。改任何东西之前先打开它 |
| `assets/fonts/` | Doto / Silkscreen / Fusion Pixel，全部 OFL，可商用 |

把 `ember.css` 和 `fonts/` 一起复制进项目。`ember.css` 用相对路径 `./fonts/` 引用字体；如果目录结构不同，改 `@font-face` 的 `src` 即可。

## 开工顺序

1. **先定“橙色时刻”**：这一页唯一的大面积橙色放在哪？Hero、CTA 区块或页脚，三选一。其余部分保持黑。
2. **再定字体层级**：一句 Doto 大标题（≥48px）、一组 Silkscreen 标签、Fusion 正文。不要给每个标题都用 Doto。
3. **最后填组件**：按钮、输入、卡片、表格从 `ember.css` 里取，不重新发明。
4. 如果用户没说清做什么界面，只问一句“要构建哪个页面/组件？”，然后直接做。

## 硬规则

1. **画布是 `#060606`，不是 `#111`，更不是蓝黑。** 面板 `#0B0B0A`，抬升面 `#131211`。
2. **橙色 `#FC5C1E` 是信号，不是主题色。** 单屏面积 ≤10%；一个视口只有一个橙色实心主按钮。
3. **奶油白永远不上橙底。** 对比度只有 2.8:1。橙底上只能用近黑字 `#0A0705`（6.4:1）。
4. **圆角为 0。** 没有 pill、没有圆形按钮。圆形只允许出现在状态点和头像上。
5. **1px 是结构线，2px 是强调线。** 不用柔和投影；要投影就 `4px 4px 0 0` 硬投影，或干脆不用。
6. **8px 是唯一间距单位。** 4 / 8 / 16 / 24 / 32 / 48 / 64 / 96；容器 1280，12 列，24 gutter。
7. **Doto 只做 ≥32px 的拉丁展示字。** 标题建议 48px 以上；不做正文、不做中文、不做 12px 标签。
8. **Silkscreen 只做 UI。** 全大写、字距 `+0.08em`；8/10 只用于元数据，12/16 用于控件与强调。中文自动落到 Fusion。
9. **Fusion Pixel 只在 12 / 24 / 36px 上渲染。** 正文 16px 是唯一例外；中文不用合成粗体。
10. **动效是继电器。** 只用 `steps(2/4/8)`、90/160/320ms，只动颜色、边框、位移、透明度。没有回弹、没有模糊、没有 `scale(1.1)`。
11. **Hover 只在 `(hover: hover)` 下生效。** 焦点环永远是 2px 橙圈、offset 3px；键盘顺序与视觉顺序一致。
12. **图标 16×16、2px 笔画、`shape-rendering: crispEdges`。** 不用渐变、毛玻璃、发光、颗粒噪点。

违反以上任意一条，风格就会从“终端海报”滑向“普通暗色 SaaS”。

## 颜色

| Token | Hex | 黑底对比度 | 用途 |
| --- | --- | --- | --- |
| `--ep-bg` | `#060606` | — | 画布，占 90% |
| `--ep-panel` | `#0B0B0A` | — | 卡片、输入框、表头 |
| `--ep-line` | `#2E2924` | — | 1px 分隔线 |
| `--ep-ember` | `#FC5C1E` | 6.45:1 | 主行动、当前项、关键数字 |
| `--ep-cream` | `#F7F1E7` | 18.0:1 | 正文与标题（代替纯白） |
| `--ep-muted` | `#B7AC9E` | 9.1:1 | 次级文本、标签 |
| `--ep-dim` | `#8A7F72` | 5.2:1 | 提示、占位符、非关键信息 |
| `--ep-danger` | `#FF3B24` | 5.7:1 | 只给破坏性操作和错误 |

**橙色配额**：主按钮、当前 tab / nav、LIVE 点、一个关键数字、一条 2px 指示线。产品界面的大面积橙色只允许整屏反白一次（hero 或 CTA）。长文档/海报页可以首尾各一次，中间保持黑。不要用橙色做卡片背景、正文、每个图标或所有边框。

**状态语义**：警告用 ember + `!` 文案/图标；成功用 cream + 对勾 + 文案；危险才用 `--ep-danger`。不要引入绿色成功色，那会破坏双色系统。

**反例**：橙底奶油字、橙色渐变按钮、两个橙色主按钮、橙色描边套橙色文字。

## 字体

| 角色 | 字体 | 尺寸 | 规则 |
| --- | --- | --- | --- |
| Display | Doto 900 | 32 / 48 / 64 / 96 / 160 / 240 | `ROND 100`，行高 0.85，字距 `-0.01em`，仅拉丁 |
| UI | Silkscreen 400 | 8 / 10 / 12 / 16 | 8/10 仅元数据；全大写，字距 `+0.08em`，行高 1 |
| Body | Fusion Pixel | 12 / 24 / 36 | 中文与正文；16px 是正文默认 |
| Data | Silkscreen | 10 / 12 | 数字等宽、右对齐、橙色 |

```css
/* 展示字：圆点阵，保留抗锯齿让点保持圆 */
.hero-title {
  font-family: var(--ep-font-display);
  font-weight: 900;
  font-variation-settings: "ROND" 100, "wght" 900;
  font-size: clamp(96px, 18vw, 260px);
  line-height: 0.78;
  letter-spacing: -0.025em;
}

/* UI 标签：关闭灰度抗锯齿，像素边缘才锐 */
.eyebrow {
  font-family: var(--ep-font-ui);
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  -webkit-font-smoothing: none;
}

/* 中文正文 */
.body {
  font-family: var(--ep-font-body);
  font-size: 16px;
  line-height: 1.75;
  font-synthesis: none;
}
```

**不要**把 12px 的像素字写成 13 / 14 / 15px；不要在中文上用 `font-weight: 700`（Fusion 只有 400，浏览器会合成假的粗体，直接糊掉）；不要把 Doto 用在正文或中文上。

中文标题用 Fusion 32px / 24px，靠字号和颜色建立层级，不靠加粗。

## 布局与表面

- 容器 1280px，左右 padding `clamp(20px, 4vw, 48px)`。
- 区块上下 96–112px，底部 1px 线收口；区块头 = 序号（橙）+ Doto 标题 + 中文标签 + 1px 长线。
- 卡片：`#0B0B0A` 底、1px `#2E2924` 边、24px padding、0 圆角。
- 点阵纹理：24px 间距、1px 点、透明度 ≤0.16；只用在 hero 或空状态，不叠加网格。
- 角标：16×2px 的橙色 L 形括号（`.ep-brackets`），用于强调一个面板，不要每个卡片都加。
- 硬投影：`4px 4px 0 0 #000`，只用于浮层/按钮，制造“贴纸”厚度。
- 响应式：900px 以下双栏改单栏；560px 以下按钮可全宽、统计卡堆叠。数据表用横向滚动容器，不要压缩列。

## 组件速查

所有类都在 `ember.css` 里。不要改类名，不要给组件加圆角。

### 按钮

```html
<button class="ep-btn ep-btn--primary">Deploy</button>
<button class="ep-btn ep-btn--secondary">Cancel</button>
<button class="ep-btn ep-btn--ghost">Skip</button>
<button class="ep-btn ep-btn--danger">Abort</button>
<button class="ep-btn ep-btn--primary ep-btn--sm">Small</button>
```

- 高度 48，2px 边框，Silkscreen 12，全大写。
- Hover 90ms `steps(2)` 反白；Active 位移 `2px, 2px`；禁用仅降透明度。
- 一屏一个 primary。次级动作用 secondary 或 ghost。

### 表单

```html
<div class="ep-field">
  <label class="ep-field__label" for="callsign">Callsign <span>Required</span></label>
  <input class="ep-input" id="callsign" type="text" value="NOVA-07">
  <span class="ep-field__hint">4–12 个字符，自动转为大写。</span>
</div>
```

- 输入框 48px 高，`#0B0B0A` 底，2px 边框，focus 加 2px 橙圈。
- 标签永远可见，不放进 placeholder。
- 错误 = 红边框 + 文案 + `aria-invalid="true"`，不靠颜色单独表意。
- 复选框/单选框是方的；开关是 52×28 的方块轨道，状态切换用 `steps(3)`。

### 卡片 / 表格 / 徽章

```html
<article class="ep-card ep-brackets">
  <div class="ep-card__label"><span>Node 07</span><span>Live</span></div>
  <div class="ep-stat__value">98.4<span>%</span></div>
</article>

<div class="ep-table-wrap" tabindex="0" role="region" aria-label="Node telemetry">
  <table class="ep-table">
    <thead><tr><th>Node</th><th>Status</th><th class="is-num">Ping</th></tr></thead>
    <tbody>
      <tr><td>ARCTURUS-01</td><td><span class="ep-badge ep-badge--live"><i class="ep-dot"></i>Live</span></td><td class="is-num">12 MS</td></tr>
    </tbody>
  </table>
</div>
```

- 数字用 `.is-num`：Silkscreen、右对齐、橙色。
- 状态徽章必须有文字；LIVE 点可以闪，但闪烁不是唯一线索。
- 横向滚动的 `.ep-table-wrap` 必须加 `tabindex="0" role="region" aria-label="…"`，否则键盘用户无法滚动表格。

### 反馈

```html
<div class="ep-alert"><div><div class="ep-alert__title">Heads up</div><p>…</p></div></div>

<div class="ep-toast">
  <div><div class="ep-toast__title">Transmission sent</div><div class="ep-toast__body">NOVA-07 · 12 ms</div></div>
</div>

<dialog class="ep-dialog">
  <div class="ep-dialog__head"><span class="ep-dialog__title">Abort?</span></div>
  <div class="ep-dialog__body">…</div>
  <div class="ep-dialog__foot">
    <button class="ep-btn ep-btn--secondary ep-btn--sm">Cancel</button>
    <button class="ep-btn ep-btn--danger ep-btn--sm">Abort</button>
  </div>
</dialog>
```

- Toast 固定右下，4px 橙色左边线；Dialog 顶部 4px 橙条。
- 空状态用虚线框 + 文案，不用插画。

### 导航

```html
<div class="ep-tabs" role="tablist">
  <button class="ep-tab" role="tab" aria-selected="true">Overview</button>
  <button class="ep-tab" role="tab" aria-selected="false">Signal</button>
</div>
```

- Tab 下划线 2px，当前项同时用颜色 + 边框。
- 顶部导航 72px，黑底 1px 下线；logo 是 32×32 橙方块 + 黑字。
- 移动端隐藏导航时，必须提供可访问的替代入口（菜单或页内锚点），不要直接消失。

### 菜单 / Tooltip / 分页 / 骨架

```html
<details class="ep-menu">
  <summary class="ep-btn ep-btn--secondary">Actions</summary>
  <div class="ep-menu__panel">
    <button type="button">Rename</button>
    <button type="button" class="is-danger">Delete</button>
  </div>
</details>

<span class="ep-tip">
  <button class="ep-iconbtn" type="button" aria-describedby="tip-1">?</button>
  <span class="ep-tip__bubble" id="tip-1" role="tooltip">AES-256 · 每 24h 轮换</span>
</span>

<nav class="ep-pagination" aria-label="Pagination">…</nav>

<div class="ep-skeleton ep-skeleton--blink" style="width:60%"></div>
```

- 菜单用原生 `<details>`，Escape / 点击外部关闭；分页 44×44；tooltip 同时支持 hover 与 focus，且不能承载唯一信息。
- 加载用 `.ep-skeleton` 分段闪烁，不用 spinner；骨架块要能看清，不要用比面板还暗的颜色。

## 页面配方

一个典型页面的顺序：

1. **Topbar**：72px，黑底，1px 下线，橙色方块 logo，Silkscreen 导航。
2. **一个橙色时刻**：整幅橙色 hero，黑色 Doto 160–260px，两行；底部 3 列 meta（PALETTE / TYPE / GRID），2px 黑上线。或者黑底 hero + 橙色 Doto，但橙色 CTA 仍只能有一个。
3. **Ticker**（可选）：黑底、橙色分隔点、10px Silkscreen，32s 线性滚动；`prefers-reduced-motion` 时停住。
4. **区块**：编号 + Doto 标题 + 中文标签 + 1px 线；96–112px 间距。
5. **一张“真实界面”**：侧栏 + 3 个指标 + 趋势图 + 日志表，证明系统能组合，而不只是组件堆。
6. **Footer**：橙色整块，黑色 Doto 大字（“STAY LOUD.”），加一个 2px 黑框的 EP 印章；或者黑底 + 橙色大字。

如果页面没有 hero，就把唯一的橙色时刻给主 CTA 区块或页脚。不要每屏都放橙色。

## 数据可视化

- 系列最多三个：ember（当前）、cream（对照）、muted（基线）；`--ep-danger` 只表示错误。
- 1px 网格、10px Silkscreen 轴标签、2px 线；无渐变、阴影、3D。
- 颜色必须配图例或直接标签，不能只靠颜色。
- 加载用 `.ep-skeleton` 分段闪烁；空状态用虚线框；数字用 Doto 或 Silkscreen。

## 动效

```css
--ep-t-fast: 90ms;   /* hover / press */
--ep-t-med: 160ms;   /* state / panel */
--ep-t-slow: 320ms;  /* overlay / route */
--ep-ease-step: steps(2, end);
--ep-ease-step-4: steps(4, end);
```

- Hover / focus：颜色两步切换；按下位移 2px；不做缩放。
- 面板出现：160ms `steps(4)`；overlay：320ms `steps(8)`。
- LIVE 点：1.2s `steps(2)` 闪烁；没有别的循环动画。
- 只动 `color / background-color / border-color / transform / opacity`；不动宽高、margin、filter。
- `prefers-reduced-motion: reduce` 时关闭 marquee、闪烁和过渡，状态仍然靠颜色/文字可读。

## 可访问性

- 正文对比度 ≥4.5:1：cream 18、muted 9.1、dim 5.2、ember 6.45、danger 5.7（均对 `#060606`）。
- 橙底只用近黑字；不要用 cream（2.8:1）。
- 可点击目标 ≥44×44；按钮默认 48 高。
- 焦点环 `2px solid #FC5C1E; outline-offset: 3px`，不要 `outline: none`。
- 状态不只靠颜色：徽章带文字，错误带文案，LIVE 带点 + 文字。
- Toast 用 `role="status"` / `aria-live="polite"`；Dialog 用原生 `<dialog>` 保留焦点陷阱。
- 关闭抗锯齿只影响字形，不影响可读性；不要在 12px 以下使用像素字。

## 交付前 QA

- [ ] 画布是 `#060606`，没有蓝黑/灰黑。
- [ ] 橙色面积 ≤10%，主按钮只有一个；hero 的橙色时刻只出现一次。
- [ ] 没有奶油白放在橙底上。
- [ ] 所有圆角都是 0。
- [ ] 字号来自系统刻度：8 / 10 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 160 / 240；没有 13、14、15。
- [ ] 中文没有用 Doto / Silkscreen，也没有合成粗体。
- [ ] 1px 结构线、2px 强调线；没有模糊投影。
- [ ] hover 只在有 hover 的设备上；focus-visible 清晰可见。
- [ ] 390px 宽没有横向溢出（数据表除外，且可滚动）。
- [ ] 动效是 steps，没有 bounce / blur / scale。
- [ ] `prefers-reduced-motion` 下可用。
- [ ] 键盘可以走完所有交互，Tab 顺序正确。

## 字体与许可

- **Doto** — Google Fonts / OFL 1.1，变量轴 `ROND` + `wght`，仅拉丁。
- **Silkscreen** — Google Fonts / OFL 1.1，仅拉丁。
- **Fusion Pixel 12px Proportional SC** — [TakWolf/fusion-pixel-font](https://github.com/TakWolf/fusion-pixel-font)，OFL 1.1，简体中文全覆盖，588KB。

代码与文档采用 MIT License（见仓库根目录 `LICENSE`）；字体保持各自的 OFL 1.1 许可，全文在 `assets/fonts/`。

如果项目只做英文，可以删掉 Fusion，把 body 换成 Silkscreen 16；如果中文站点只需要少量字符，用 `pyftsubset` 按字符集裁剪 Fusion，再保留 12/24 的整数倍尺寸。

不要用 Doto 排中文，也不要用系统黑体兜底中文——那会瞬间破坏点阵质感。中文用 Fusion；缺字时再回退到 `DotGothic16`，并接受个别字形差异。

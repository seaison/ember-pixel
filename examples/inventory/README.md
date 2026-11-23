# Parts Depot — 家庭元件仓

一个基于 **Ember Pixel** 的可交互示例：家用电子元器件出入库、扫码收货与工作坊管理。窄图标侧栏复刻参考图的工具导航。

**在线试用**：<https://seaison.github.io/ember-pixel/examples/inventory/>

## 可以做什么

- **扫码收货**：摄像头预览 / 模拟扫码，在途包裹列表，确认后直接入库
- **相册**：元件扫描件档案，按类别筛选，可添加档案、查看元件
- **库存/BOM**：库存搜索、筛选、分页；三套 BOM 齐套检查，一键生成取件单
- **取件**：取件队列、缺料拦截，确认后按清单一次性出库
- **入库 / 出库**：既有补货、现场建档，以及按项目单件出库
- **生产资料**：耗材清单、低库存提醒、最近领用
- **焊接**：工位开关、温度 / 功率状态、工单开始 / 完成
- **流水**：出入库流水、类型筛选、CSV 导出
- **Operator**：导出完整 JSON、重置演示数据

数据保存在浏览器的 `localStorage`（key：`parts-depot-v1`），没有后端，也没有多用户同步。点右上角 `OWNER` 菜单可以重置。

## 本地打开

这个示例复用仓库里的 `assets/ember.css` 与字体，必须和仓库一起打开。静态 UI 使用 18KB 的 Fusion Pixel 子集；用户输入的缺字回退系统字体，完整字体仍保留在 `assets/fonts/`。

```bash
cd ember-pixel
python3 -m http.server 8765
# http://127.0.0.1:8765/examples/inventory/
```

也可以直接打开 `examples/inventory/index.html`；如果浏览器限制了 `file://` 的 localStorage，页面会退化为内存模式（刷新即恢复种子数据）。

## 文件

```
index.html   # shell + 十个视图 + 六个 dialog
app.css      # 页面级布局，组件来自 ../../assets/ember.css
app.js       # 种子数据、localStorage、渲染与交互
fonts/       # 静态 UI 用的 18KB Fusion Pixel 子集
```

## 许可

代码与文档 MIT；字体遵循各自的 OFL 1.1。设计系统见仓库根目录 [`SKILL.md`](../../SKILL.md)。

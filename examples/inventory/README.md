# Parts Depot — 家庭元件仓

一个基于 **Ember Pixel** 的可交互示例：家用电子元器件出入库管理。

**在线试用**：<https://seaison.github.io/ember-pixel/examples/inventory/>

## 可以做什么

- **Overview**：库存总览、7 天流动、低库存清单、库位负载
- **Inbound**：既有元件补货，或现场建立新元件档案
- **Outbound**：按项目出库；库存不足会拦截并提示余量
- **Inventory**：搜索、类别 / 状态筛选、分页、元件详情
- **History**：出入库流水、类型筛选、CSV 导出
- **Operator**：导出完整 JSON、重置演示数据

数据保存在浏览器的 `localStorage`（key：`parts-depot-v1`），没有后端，也没有多用户同步。点右上角 `OWNER` 菜单可以重置。

## 本地打开

这个示例复用仓库里的 `assets/ember.css` 与字体，必须和仓库一起打开：

```bash
cd ember-pixel
python3 -m http.server 8765
# http://127.0.0.1:8765/examples/inventory/
```

也可以直接打开 `examples/inventory/index.html`；如果浏览器限制了 `file://` 的 localStorage，页面会退化为内存模式（刷新即恢复种子数据）。

## 文件

```
index.html   # shell + 五个视图 + 两个 dialog
app.css      # 页面级布局，组件来自 ../../assets/ember.css
app.js       # 种子数据、localStorage、渲染与交互
```

## 许可

代码与文档 MIT；字体遵循各自的 OFL 1.1。设计系统见仓库根目录 [`SKILL.md`](../../SKILL.md)。

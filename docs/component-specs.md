# 基础组件规范文档

本文档定义了 DEX 产品中所有基础组件的设计规范，确保所有业务组件都基于这些统一的基础组件构建。

---

## 组件清单

### 核心交互组件
1. **Button** - 按钮
2. **Input** - 输入框
3. **Select / Combobox** - 选择器
4. **Switch** - 开关
5. **Checkbox / Radio** - 复选框/单选框
6. **Slider** - 滑块

### 布局与容器组件
7. **Card** - 卡片
8. **Tabs** - 标签页
9. **Separator** - 分隔线
10. **Dialog / Drawer** - 对话框/抽屉

### 反馈组件
11. **Tooltip** - 提示框
12. **Toast / Notification** - 通知
13. **Progress** - 进度条
14. **Skeleton** - 骨架屏

### 信息展示组件
15. **Tag / Badge** - 标签/徽章

---

## 1. Button（按钮）

### 1.1 尺寸变体

| 尺寸 | 高度 | 内边距（水平） | 字号 | Tailwind 类名 | 使用场景 |
|------|------|---------------|------|--------------|----------|
| sm | 32px | 12px | 14px | `h-8 px-3 text-sm` | 紧凑空间、表格操作 |
| md | 40px | 16px | 16px | `h-10 px-4 text-base` | 标准按钮（默认） |
| lg | 48px | 20px | 18px | `h-12 px-5 text-lg` | 主要操作、CTA |

### 1.2 状态定义

| 状态 | 视觉表现 | 交互反馈 | Tailwind 类名 |
|------|---------|---------|--------------|
| Default | 正常样式 | - | - |
| Hover | 背景色加深/阴影出现 | 过渡 200ms | `hover:bg-*` / `hover:shadow-sm` |
| Active | 背景色更深/阴影消失 | 过渡 150ms | `active:bg-*` / `active:shadow-none` |
| Focus | 外圈聚焦环 | 2px 外圈，颜色 primary | `focus:ring-2 focus:ring-primary` |
| Disabled | 透明度 50%，不可点击 | 无交互 | `disabled:opacity-50 disabled:cursor-not-allowed` |
| Loading | 显示加载图标，文字隐藏或保留 | 旋转动画 | `animate-spin` |

### 1.3 变体类型（Variants）

#### Primary（主要按钮）

**使用场景**：最重要的操作，如"连接钱包"、"确认交易"、"Swap"。

**Light 模式**：
- 背景：`oklch(0.45 0.15 250)` (主色)
- 文字：`oklch(0.98 0 0)` (白色)
- 边框：无
- Hover：背景 `oklch(0.40 0.15 250)`，阴影 `shadow-sm`
- Active：背景 `oklch(0.35 0.15 250)`，无阴影
- Focus：外圈 `oklch(0.45 0.15 250)`，2px

**Dark 模式**：
- 背景：`oklch(0.55 0.15 250)` (主色)
- 文字：`oklch(0.05 0 0)` (深色)
- 边框：无
- Hover：背景 `oklch(0.60 0.15 250)`，阴影 `shadow-sm`
- Active：背景 `oklch(0.50 0.15 250)`，无阴影
- Focus：外圈 `oklch(0.55 0.15 250)`，2px

**交互动效**：
- 过渡时间：200ms
- 缓动函数：ease-in-out
- Hover 时轻微上浮（transform: translateY(-1px)）

---

#### Secondary（次要按钮）

**使用场景**：次要操作，如"取消"、"返回"、"查看详情"。

**Light 模式**：
- 背景：`oklch(0.97 0 0)` (浅灰)
- 文字：`oklch(0.15 0 0)` (深色)
- 边框：`oklch(0.90 0 0)`，1px
- Hover：背景 `oklch(0.95 0 0)`，边框 `oklch(0.85 0 0)`
- Active：背景 `oklch(0.93 0 0)`
- Focus：外圈 `oklch(0.45 0.15 250)`，2px

**Dark 模式**：
- 背景：`oklch(0.20 0 0)` (深灰)
- 文字：`oklch(0.95 0 0)` (浅色)
- 边框：`oklch(1 0 0 / 0.1)`，1px
- Hover：背景 `oklch(0.25 0 0)`，边框 `oklch(1 0 0 / 0.15)`
- Active：背景 `oklch(0.18 0 0)`
- Focus：外圈 `oklch(0.55 0.15 250)`，2px

**交互动效**：
- 过渡时间：200ms
- 缓动函数：ease-in-out

---

#### Ghost（幽灵按钮）

**使用场景**：不重要的操作，如"更多"、"设置"、图标按钮。

**Light 模式**：
- 背景：透明
- 文字：`oklch(0.45 0 0)` (中性灰)
- 边框：无
- Hover：背景 `oklch(0.97 0 0)`，文字 `oklch(0.15 0 0)`
- Active：背景 `oklch(0.95 0 0)`
- Focus：外圈 `oklch(0.45 0.15 250)`，2px

**Dark 模式**：
- 背景：透明
- 文字：`oklch(0.70 0 0)` (中性灰)
- 边框：无
- Hover：背景 `oklch(0.20 0 0)`，文字 `oklch(0.95 0 0)`
- Active：背景 `oklch(0.18 0 0)`
- Focus：外圈 `oklch(0.55 0.15 250)`，2px

**交互动效**：
- 过渡时间：150ms
- 缓动函数：ease-out

---

#### Outline（轮廓按钮）

**使用场景**：需要强调但不想过于突出，如"添加流动性"、"创建池子"。

**Light 模式**：
- 背景：透明
- 文字：`oklch(0.45 0.15 250)` (主色)
- 边框：`oklch(0.45 0.15 250)`，2px
- Hover：背景 `oklch(0.45 0.15 250)`，文字 `oklch(0.98 0 0)`，边框同背景
- Active：背景 `oklch(0.40 0.15 250)`
- Focus：外圈 `oklch(0.45 0.15 250)`，2px

**Dark 模式**：
- 背景：透明
- 文字：`oklch(0.55 0.15 250)` (主色)
- 边框：`oklch(0.55 0.15 250)`，2px
- Hover：背景 `oklch(0.55 0.15 250)`，文字 `oklch(0.05 0 0)`，边框同背景
- Active：背景 `oklch(0.50 0.15 250)`
- Focus：外圈 `oklch(0.55 0.15 250)`，2px

**交互动效**：
- 过渡时间：200ms
- 缓动函数：ease-in-out

---

#### Danger / Destructive（危险按钮）

**使用场景**：删除、取消交易、高风险操作。

**Light 模式**：
- 背景：`oklch(0.58 0.25 27)` (红色)
- 文字：`oklch(0.98 0 0)` (白色)
- 边框：无
- Hover：背景 `oklch(0.53 0.25 27)`，阴影 `shadow-sm`
- Active：背景 `oklch(0.48 0.25 27)`，无阴影
- Focus：外圈 `oklch(0.58 0.25 27)`，2px

**Dark 模式**：
- 背景：`oklch(0.70 0.19 22)` (红色)
- 文字：`oklch(0.05 0 0)` (深色)
- 边框：无
- Hover：背景 `oklch(0.75 0.19 22)`，阴影 `shadow-sm`
- Active：背景 `oklch(0.65 0.19 22)`，无阴影
- Focus：外圈 `oklch(0.70 0.19 22)`，2px

**交互动效**：
- 过渡时间：200ms
- 缓动函数：ease-in-out

---

### 1.4 Loading 状态

所有变体都支持 Loading 状态：

- **图标**：使用旋转的加载图标（spinner），位于文字左侧
- **动画**：`animate-spin`，1s 循环
- **文字处理**：保留文字或隐藏文字（根据按钮大小决定）
- **交互**：Loading 状态下禁用点击，cursor 为 `not-allowed`

---

## 2. Input（输入框）

### 2.1 尺寸变体

| 尺寸 | 高度 | 内边距（水平） | 字号 | Tailwind 类名 | 使用场景 |
|------|------|---------------|------|--------------|----------|
| sm | 36px | 12px | 14px | `h-9 px-3 text-sm` | 紧凑表单 |
| md | 44px | 16px | 16px | `h-11 px-4 text-base` | 标准输入框（默认） |
| lg | 52px | 20px | 18px | `h-13 px-5 text-lg` | 重要输入（金额输入） |

### 2.2 状态定义

| 状态 | 视觉表现 | Tailwind 类名 |
|------|---------|--------------|
| Default | 浅灰背景，灰色边框 | `bg-input border-border` |
| Hover | 边框颜色加深 | `hover:border-ring` |
| Focus | 边框变为主色，外圈聚焦环 | `focus:border-ring focus:ring-2 focus:ring-ring` |
| Error | 边框变为错误色，背景微红 | `border-destructive bg-destructive/5` |
| Disabled | 透明度 50%，背景变浅 | `disabled:opacity-50 disabled:bg-muted` |

### 2.3 变体类型

- **Default**：标准输入框，用于文本输入
- **Number**：数字输入，使用等宽字体（font-mono），右对齐
- **Search**：搜索框，左侧带搜索图标
- **Password**：密码输入，右侧带显示/隐藏切换

### 2.4 交互反馈

- 过渡时间：200ms
- 缓动函数：ease-in-out
- Focus 时外圈动画：从 0 到 2px，150ms

---

## 3. Select / Combobox（选择器）

### 3.1 尺寸变体

与 Input 保持一致：sm / md / lg

### 3.2 状态定义

与 Input 类似，但增加：
- **Open**：下拉菜单展开，输入框边框保持聚焦状态
- **Selected**：已选择项高亮显示

### 3.3 变体类型

- **Select**：标准下拉选择，点击展开
- **Combobox**：可搜索的下拉选择，支持输入过滤

### 3.4 下拉菜单规范

- 最大高度：300px，超出滚动
- 内边距：8px
- 选项高度：40px
- Hover 背景：`bg-muted`
- Selected 背景：`bg-primary/10`，文字 `text-primary`

---

## 4. Card（卡片）

### 4.1 尺寸变体

| 变体 | 内边距 | Tailwind 类名 | 使用场景 |
|------|--------|--------------|----------|
| Default | 24px | `p-6` | 标准卡片 |
| Compact | 16px | `p-4` | 紧凑卡片 |
| Spacious | 32px | `p-8` | 大卡片 |

### 4.2 状态定义

| 状态 | 视觉表现 | Tailwind 类名 |
|------|---------|--------------|
| Default | 白色/深色背景，圆角 12px，阴影 | `bg-card rounded-xl shadow` |
| Hover | 阴影加深 | `hover:shadow-md` |
| Interactive | 可点击，Hover 时上浮 | `cursor-pointer hover:-translate-y-1` |

### 4.3 变体类型

- **Default**：标准卡片，用于内容展示
- **Bordered**：带边框的卡片，`border border-border`
- **Elevated**：更强的阴影，`shadow-lg`
- **Flat**：无阴影，仅边框，`shadow-none border`

---

## 5. Dialog / Drawer（对话框/抽屉）

### 5.1 Dialog（对话框）

- **尺寸**：最大宽度 500px（移动端 100%）
- **圆角**：16px（`rounded-2xl`）
- **阴影**：`shadow-xl`
- **背景**：卡片背景 + 半透明遮罩层
- **动画**：淡入 + 缩放，300ms ease-out

### 5.2 Drawer（抽屉）

- **位置**：底部（移动端）或右侧（桌面端）
- **高度/宽度**：移动端 90% 高度，桌面端 400px 宽度
- **圆角**：顶部 16px（`rounded-t-2xl`）
- **阴影**：`shadow-2xl`
- **动画**：滑入动画，300ms ease-out

---

## 6. Tabs（标签页）

### 6.1 尺寸变体

| 尺寸 | 高度 | 内边距（水平） | 字号 | Tailwind 类名 |
|------|------|---------------|------|--------------|
| sm | 36px | 12px | 14px | `h-9 px-3 text-sm` |
| md | 44px | 16px | 16px | `h-11 px-4 text-base` |
| lg | 52px | 20px | 18px | `h-13 px-5 text-lg` |

### 6.2 状态定义

| 状态 | 视觉表现 | Tailwind 类名 |
|------|---------|--------------|
| Default | 文字颜色 `text-muted-foreground` | - |
| Active | 文字颜色 `text-foreground`，底部边框 2px 主色 | `text-foreground border-b-2 border-primary` |
| Hover | 背景 `bg-muted` | `hover:bg-muted` |

### 6.3 变体类型

- **Default**：标准标签页，底部边框指示
- **Pills**：圆角背景，Active 时背景为主色
- **Underline**：仅底部边框（默认）

---

## 7. Tooltip（提示框）

### 7.1 尺寸

- 最大宽度：200px
- 内边距：8px 12px
- 字号：14px

### 7.2 样式

- 背景：`oklch(0.15 0 0)` (深色，Light 模式) / `oklch(0.95 0 0)` (浅色，Dark 模式)
- 文字：`oklch(0.98 0 0)` (Light) / `oklch(0.05 0 0)` (Dark)
- 圆角：6px
- 阴影：`shadow-lg`
- 箭头：8px 三角形

### 7.3 动画

- 出现：淡入 + 轻微上移，200ms ease-out
- 消失：淡出，150ms ease-in

---

## 8. Toast / Notification（通知）

### 8.1 类型

| 类型 | 背景色 | 图标 | 使用场景 |
|------|--------|------|----------|
| Success | `bg-success/10` + `border-success` | ✓ | 成功操作 |
| Error | `bg-destructive/10` + `border-destructive` | ✕ | 错误提示 |
| Warning | `bg-warning/10` + `border-warning` | ⚠ | 警告信息 |
| Info | `bg-primary/10` + `border-primary` | ℹ | 一般信息 |

### 8.2 尺寸

- 最小宽度：300px
- 最大宽度：400px
- 内边距：16px
- 圆角：12px

### 8.3 动画

- 出现：从右侧滑入，300ms ease-out
- 消失：淡出 + 右移，200ms ease-in
- 自动消失：5 秒（可配置）

---

## 9. Tag / Badge（标签/徽章）

### 9.1 尺寸变体

| 尺寸 | 高度 | 内边距（水平） | 字号 | Tailwind 类名 |
|------|------|---------------|------|--------------|
| sm | 20px | 6px | 12px | `h-5 px-1.5 text-xs` |
| md | 24px | 8px | 14px | `h-6 px-2 text-sm` |
| lg | 28px | 10px | 16px | `h-7 px-2.5 text-base` |

### 9.2 变体类型

- **Default**：`bg-muted text-muted-foreground`
- **Primary**：`bg-primary/10 text-primary`
- **Success**：`bg-success/10 text-success`
- **Warning**：`bg-warning/10 text-warning`
- **Destructive**：`bg-destructive/10 text-destructive`

### 9.3 圆角

统一使用 `rounded-md` (6px)

---

## 10. Switch（开关）

### 10.1 尺寸

- 宽度：44px（sm: 36px, lg: 52px）
- 高度：24px（sm: 20px, lg: 28px）
- 滑块：20px（sm: 16px, lg: 24px）

### 10.2 状态

| 状态 | 背景色 | Tailwind 类名 |
|------|--------|--------------|
| Off | `bg-muted` | - |
| On | `bg-primary` | - |
| Disabled | `bg-muted opacity-50` | `disabled:opacity-50` |

### 10.3 动画

- 切换动画：200ms ease-in-out
- 滑块移动：使用 transform translateX

---

## 11. Checkbox / Radio（复选框/单选框）

### 11.1 尺寸

| 尺寸 | 大小 | Tailwind 类名 |
|------|------|--------------|
| sm | 16px | `w-4 h-4` |
| md | 20px | `w-5 h-5` |
| lg | 24px | `w-6 h-6` |

### 11.2 状态

| 状态 | 视觉表现 |
|------|---------|
| Unchecked | 边框 `border-border`，背景透明 |
| Checked | 背景 `bg-primary`，边框 `border-primary`，显示 ✓ |
| Indeterminate | 背景 `bg-primary`，显示 - |
| Disabled | 透明度 50% |

### 11.3 交互

- Focus：外圈聚焦环，2px
- 过渡：200ms ease-in-out

---

## 12. Slider（滑块）

### 12.1 尺寸

- 轨道高度：4px
- 滑块大小：20px（直径）

### 12.2 状态

| 状态 | 视觉表现 |
|------|---------|
| Default | 轨道 `bg-muted`，滑块 `bg-primary` |
| Active | 滑块放大至 24px，阴影 `shadow-md` |
| Disabled | 透明度 50% |

### 12.3 交互

- 拖拽时滑块放大
- 过渡：150ms ease-out

---

## 13. Progress（进度条）

### 13.1 尺寸

- 高度：8px（sm: 4px, lg: 12px）
- 圆角：4px（`rounded-sm`）

### 13.2 样式

- 背景：`bg-muted`
- 进度：`bg-primary`
- 动画：进度条填充动画，300ms ease-out

---

## 14. Skeleton（骨架屏）

### 14.1 样式

- 背景：`bg-muted`
- 动画：脉冲动画（`animate-pulse`）
- 圆角：与对应组件保持一致

### 14.2 变体

- **Text**：高度 16px，圆角 4px
- **Avatar**：圆形，尺寸可配置
- **Card**：矩形，圆角 12px

---

## 15. Separator（分隔线）

### 15.1 样式

- 颜色：`border-border`
- 宽度：1px（水平）或 高度：1px（垂直）
- 边距：16px（可配置）

---

## 组件使用原则

1. **一致性**：所有组件遵循相同的尺寸、间距、圆角规范
2. **可访问性**：确保足够的对比度，支持键盘导航和屏幕阅读器
3. **响应式**：组件在不同屏幕尺寸下自适应
4. **性能**：使用 CSS 过渡而非 JavaScript 动画，避免重排重绘
5. **可扩展**：组件设计支持主题定制和变体扩展

---

## 下一步

基于以上基础组件规范，将设计 DEX 业务组件：
- TokenInput（代币输入框）
- TokenSelect（代币选择器）
- SwapCard（交易卡片）
- LiquidityCard（流动性卡片）
- SlippageSelector（滑点选择器）
- 等等...


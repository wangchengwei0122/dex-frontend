# 🎨 Black & Gold DEX — Design System v1.0

基于现有 AppBadge / AppButton / AppCard / AppDivider / AppInput / AppPanel / AppSectionTitle 的完整规范

---

## 0. Brand Identity（品牌调性）

### 风格定位

- **深色金融风**：沉稳、专业的金融产品视觉风格
- **黑金主题（Black & Gold）**：以黑色为基底，金色为强调色
- **高对比、沉稳高端**：通过高对比度营造专业感
- **Glow（金色光晕）**：关键视觉元素，增强品牌识别度
- **统一体系**：所有组件以黑色背景 + 金色边线 / 玻璃风输入框形成统一视觉体系

---

## 1. Design Tokens（基础 Design Tokens）

### 1.1 Colors（核心配色）

#### Black 系列（主背景色）

| Token         | Value     | 用途                  |
| ------------- | --------- | --------------------- |
| `--black-900` | `#0A0A0C` | DEX 主面板 · 暗黑背景 |
| `--black-800` | `#0D0F12` | 按钮 hover / 卡片深色 |
| `--black-700` | `#111316` | 次级背景              |

#### Gold 系列（品牌色）

> 注：以下值来自 button/input/badge/panel 的真实实现

| Token            | Value                        | 用途           |
| ---------------- | ---------------------------- | -------------- |
| `--gold`         | `#C9A227`                    | 主品牌金色     |
| `--gold-soft`    | `rgba(201,162,39,0.35)`      | hover 高亮金色 |
| `--gold-border`  | `rgba(201,162,39,0.30–0.60)` | 按钮与卡片边框 |
| `--gold-glow`    | `rgba(201,162,39,0.28)`      | 按钮大外发光   |
| `--gold-divider` | `rgba(201,162,39,0.40)`      | 分割线         |

#### Neutral 系列

| Token        | Value     |
| ------------ | --------- |
| `--gray-50`  | `#F9FAFB` |
| `--gray-300` | `#D4D4D8` |
| `--gray-500` | `#71717A` |
| `--gray-700` | `#3F3F46` |
| `--gray-900` | `#18181B` |

---

### 1.2 Radii（圆角半径）

基于所有组件代码抽取出的统一规则：

| Token         | Value       | 用途               |
| ------------- | ----------- | ------------------ |
| `--radius-sm` | `8px`       | Badge, 小控件      |
| `--radius-md` | `12px`      | Button, TokenPill  |
| `--radius-lg` | `20px`      | Card               |
| `--radius-xl` | `24px–28px` | 面板 / Swap 主容器 |

> **注意**：所有输入框统一使用 `12px`，Panel 使用 `24–28px`，已形成统一体系。

---

### 1.3 Shadows（阴影）

#### Gold Glow（按钮主视觉元素）

```css
0 0 32px rgba(201,162,39,0.28)
```

#### Input 内阴影

```css
inset 0 1px 0 rgba(255,255,255,0.35),
0 2px 10px rgba(0,0,0,0.06)
```

#### Panel（深色）

```css
0 18px 45px rgba(0,0,0,0.6)
```

#### Elevated Panel

```css
0 22px 55px rgba(0,0,0,0.72)
```

> **规则**：所有 glow 使用金色，透明度统一在 `0.12–0.35` 之间。

### 1.4 Typography（字体系统）

#### 字体族

- 基础 Sans：`system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"SF Pro Text"`, `"SF Pro Display"`, `sans-serif`
- 等宽 Mono：`"SF Mono"`, `ui-monospace`, `Menlo`, `monospace`

> 实现上可以通过 CSS 变量统一，例如：
>
> - `--font-sans`
> - `--font-mono`

#### 标题层级（Headings）

| 级别 | 用途              | 字号 / 行高 | 字重 |
| ---- | ----------------- | ----------- | ---- |
| H1   | 页面主标题        | 32px / 1.2  | 700  |
| H2   | 模块主标题        | 24px / 1.3  | 600  |
| H3   | 卡片 / Panel 标题 | 20px / 1.4  | 600  |
| H4   | 小节标题          | 18px / 1.4  | 600  |
| H5   | 辅助小标题        | 16px / 1.5  | 600  |
| H6   | 标签标题          | 14px / 1.5  | 600  |

> 标题默认使用 Sans 字体，颜色使用 `--text-primary`。

#### 正文与辅助文本（Body & Caption）

| 类型       | 用途                 | 字号 / 行高 | 字重 | 说明               |
| ---------- | -------------------- | ----------- | ---- | ------------------ |
| Body       | 标准正文             | 16px / 1.5  | 400  | 默认文案、表单说明 |
| Body small | 次级信息             | 14px / 1.5  | 400  | 次要说明、引导文案 |
| Caption    | 说明 / 标签 / 时间戳 | 12px / 1.4  | 400  | 辅助信息、轻量提示 |

#### 数字与金额（Numeric）

重要的数值（余额、价格、收益等）应使用等宽字体，方便对齐：

- 大数字：`24–32px`，`font-semibold`，`font-mono`
- 标准数字：`16–18px`，`font-medium`，`font-mono`

颜色根据语义：

- 默认：`--text-primary`
- 盈利 / 正向：`--success-text`（如定义）
- 亏损 / 负向：`--error-text`

#### 文本颜色 Tokens

结合实际实现，推荐在全局 CSS 中约定以下文本变量：

- `--text-primary`：主文案色，接近 `#F9FAFB`，用于深色背景上的主要文字
- `--text-muted`：次级文案色，接近 `#A1A1AA`，用于说明文字
- `--text-soft`：弱提示 / 占位符文案色
- `--input-placeholder`：专用于 Input placeholder 的颜色

所有文字颜色在组件中尽量通过以上变量访问，而不是硬编码具体色值。

---

### 1.5 Spacing（间距系统）

基于 4px 网格，推荐使用以下间距刻度。与 Tailwind 的 `spacing` 配置对齐即可：

| Token      | 数值 | 典型用途                             |
| ---------- | ---- | ------------------------------------ |
| `space-1`  | 4px  | 图标与文字间距、非常紧凑的元素间距   |
| `space-2`  | 8px  | 按钮内部左右间距的最小值、小图标间距 |
| `space-3`  | 12px | 表单字段之间的垂直间距               |
| `space-4`  | 16px | 卡片内基础 padding、按钮默认内边距   |
| `space-5`  | 20px | 表单分组之间的间距                   |
| `space-6`  | 24px | 卡片与 Panel 内部的主要 padding      |
| `space-8`  | 32px | 大区块之间的间距                     |
| `space-10` | 40px | 页面 section 之间的垂直间距          |
| `space-12` | 48px | 首页 hero 区与下方内容的间距         |

使用建议：

- **组件内部**：优先使用 `12 / 16 / 20 / 24px`（`space-3` ~ `space-6`）。
- **卡片 / Panel 内边距**：使用 `24px` 或 `32px`，保持模块呼吸感。
- **页面布局**：顶部和底部大间距建议使用 `32 / 40 / 48px`。

面向实现时，可以通过 Tailwind class 或自定义 CSS 变量来描述这些间距，不需要再创造新的奇数值（例如 13px / 17px）。

---

## 2. Component Architecture（组件体系）

以下规范基于现有组件代码总结。

---

### 2.1 Badges（AppBadge）

#### Variants（变体）

- **default**：白底灰边
- **primary**：黑底金边（主要 DEX 样式）
- **outline**：透明底金边
- **success / warning / error**：友好色补充

#### Sizes（尺寸）

- `sm` / `md` / `lg`（统一 px 值）

#### Style Rules（样式规则）

- `rounded-full`：完全圆角
- `font-semibold`：半粗字体
- 金色 glow（primary 变体必须带）

---

### 2.2 Buttons（AppButton）

#### Variants（变体）

**primary（主按钮）**

- 黑底
- 金色边框透明度 `0.65`
- 背景金色渐变：`linear-gradient(120deg, rgba(201,162,39,0.5), rgba(201,162,39,0.05))`
- 大阴影 glow

**其他变体**

- `secondary`
- `ghost`
- `outline`
- `danger`（红色）

#### Sizes（尺寸）

- `sm` / `md` / `lg` — 已标准化

#### Rules（规则）

- 始终使用 `rounded-xl`
- 始终使用粗体文本
- primary 变体必须配 glow
- hover 状态金色变亮
- active 状态小幅 `translate-y-[0.5px]`

---

### 2.3 Card（AppCard）

Card 系列都属于亮色主题：

- **玻璃白背景**：`white/90`
- **金色边框**：透明度 `0.24–0.30`
- **阴影级别**：`default` / `elevated` / `flat`
- **圆角**：`rounded-3xl`

#### 使用场景

- 表单模块
- 子卡片
- 信息区块

---

### 2.4 Divider（AppDivider）

- **颜色**：金色 40% — `#C9A227 / 0.40`
- **方向**：支持水平 & 垂直
- **风格**：环境光照风格

---

### 2.5 Field Label（AppFieldLabel）

- **文本样式**：`uppercase` + `tracking-[0.08em]`
- **字体大小**：`text-xs` + 灰色文字
- **必填标识**：`required` 使用 `amber-400`

---

### 2.6 Input（AppInput）

这是 UI 体系中最核心的风格之一。

#### 默认状态

- **背景**：`bg-white/6`
- **玻璃毛玻璃风**：`backdrop-blur-xl`
- **内阴影**：`inset 0 1px 0 rgba(255,255,255,0.35)`
- **边框**：`zinc-200`
- **hover**：变为金色边框

#### Focus 状态

- 金色 ring
- 金色边框
- 更强的 inner shadow

#### Disabled 状态

- 白底 60%
- 文本灰色
- 不可交互

---

### 2.7 Panel（AppPanel）

支持 `dark` / `light` / `bordered` / `elevated` 变体。

#### Dark（默认 DEX 主 panel）

- **背景**：黑色 `#0A0A0C`
- **边框**：金色 30%
- **阴影**：大阴影（黑金融风）
- **Ring**：金色 ring
- **圆角**：`rounded-3xl`

#### Elevated

- 更强的黑色阴影（对比度更高）

#### Light / Glass

- 用于亮面板、子内容区域

---

### 2.8 Section Title（AppSectionTitle）

- **文本样式**：`uppercase`
- **字间距**：超大 `tracking-[0.22em]`
- **字体大小**：`text-[12px]`
- **颜色**：灰色文字
- **可选元素**：金色 divider

**使用场景**：模块标题 / 区块分隔

---

## 3. Rules for All Components（全组件统一规则）

AI 生成组件必须遵守以下硬规则：

1. **颜色规范**：所有颜色必须使用 Design Tokens 中的 Black / Gold / Neutral 系列，不允许使用任意新颜色。
2. **圆角规范**：圆角只能使用 `sm` / `md` / `lg` / `xl` 四类。
3. **背景规范**：所有深色组件使用主黑 `#0A0A0C` 背景。
4. **透明度规范**：所有金色相关元素透明度必须在 `0.20–0.65` 之间。
5. **边框规范**：所有边框必须为 `1px`。
6. **Glow 规范**：所有 glow 阴影必须使用金色 glow，不得使用其他颜色。
7. **Input 规范**：所有 Input 必须采用玻璃模糊风格。
8. **Panel 规范**：所有 Panel 必须有金色 ring（深色模式）。
9. **Hover 规范**：所有 hover 必须让金色变亮，不得更改为其他颜色。
10. **统一性**：遵循以上规则，确保所有 UI 保持完美统一。

---

## 4. Layout / Navigation / Page 结构基准

在未生成导航前，整体 Layout 必须遵循：

- **Navbar 高度**：`64px`
- **Panel 外层 padding**：`px-6 py-8`
- **Page container**：`max-w-screen-xl mx-auto px-4`
- **背景**：必须使用 `--black-900`
- **Hover 效果**：金色 hover 必须明显但不过亮

---

## 5. AI 使用提示

### 组件生成提示词

在每次生成组件时，请在 Prompt 前添加以下内容：

> 请严格遵循 `/docs/design-system.md` 中的 Black & Gold DEX UI 规范。  
> 所有颜色、阴影、透明度、圆角、边框风格必须完全按照规范执行，不得发明新风格。

这样可以确保 AI 生成的组件始终符合设计系统规范。

---

## 附录

### 相关组件

- `AppBadge` - 徽章组件
- `AppButton` - 按钮组件
- `AppCard` - 卡片组件
- `AppDivider` - 分割线组件
- `AppFieldLabel` - 字段标签组件
- `AppInput` - 输入框组件
- `AppPanel` - 面板组件
- `AppSectionTitle` - 区块标题组件

### 文档版本

- **版本**：v1.0
- **最后更新**：基于现有组件代码提取

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

| Token | Value | 用途 |
|-------|-------|------|
| `--black-900` | `#0A0A0C` | DEX 主面板 · 暗黑背景 |
| `--black-800` | `#0D0F12` | 按钮 hover / 卡片深色 |
| `--black-700` | `#111316` | 次级背景 |

#### Gold 系列（品牌色）

> 注：以下值来自 button/input/badge/panel 的真实实现

| Token | Value | 用途 |
|-------|-------|------|
| `--gold` | `#C9A227` | 主品牌金色 |
| `--gold-soft` | `rgba(201,162,39,0.35)` | hover 高亮金色 |
| `--gold-border` | `rgba(201,162,39,0.30–0.60)` | 按钮与卡片边框 |
| `--gold-glow` | `rgba(201,162,39,0.28)` | 按钮大外发光 |
| `--gold-divider` | `rgba(201,162,39,0.40)` | 分割线 |

#### Neutral 系列

| Token | Value |
|-------|-------|
| `--gray-50` | `#F9FAFB` |
| `--gray-300` | `#D4D4D8` |
| `--gray-500` | `#71717A` |
| `--gray-700` | `#3F3F46` |
| `--gray-900` | `#18181B` |

---

### 1.2 Radii（圆角半径）

基于所有组件代码抽取出的统一规则：

| Token | Value | 用途 |
|-------|-------|------|
| `--radius-sm` | `8px` | Badge, 小控件 |
| `--radius-md` | `12px` | Button, TokenPill |
| `--radius-lg` | `20px` | Card |
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

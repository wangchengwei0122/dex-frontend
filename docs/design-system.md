# DEX Design System 规范

## 1. 整体视觉风格定位

### 风格描述
**现代、轻量、数据优先的 DeFi 界面风格**

- **现代感**：采用简洁的几何形状、流畅的动画过渡，体现 Web3 的前沿感
- **轻量化**：减少视觉噪音，突出核心功能和数据展示
- **中性色为主**：以灰色系作为基础，通过强调色突出重点操作和信息
- **数据可读性优先**：数字、金额、状态信息清晰易读，使用等宽字体显示关键数据
- **专业可信**：通过一致的视觉语言和精细的细节处理，建立用户信任

### 设计原则

1. **清晰性（Clarity）**：每个元素都有明确的目的，信息层级清晰
2. **一致性（Consistency）**：所有组件遵循统一的视觉规范，降低学习成本
3. **可访问性（Accessibility）**：确保足够的对比度和可读性，支持键盘导航
4. **性能优先（Performance）**：轻量级动画，避免过度装饰影响性能
5. **响应式（Responsive）**：适配不同屏幕尺寸，移动端优先考虑

---

## 2. 颜色系统规范

### 2.1 主色（Primary）

用于主要操作按钮、链接、重要状态指示。

| 模式 | 颜色值 (oklch) | Tailwind 类名 | 使用场景 |
|------|---------------|--------------|----------|
| Light | `oklch(0.45 0.15 250)` | `bg-primary` | 主要按钮背景 |
| Light | `oklch(0.98 0 0)` | `text-primary-foreground` | 主要按钮文字 |
| Dark | `oklch(0.55 0.15 250)` | `bg-primary` | 主要按钮背景 |
| Dark | `oklch(0.05 0 0)` | `text-primary-foreground` | 主要按钮文字 |

**说明**：主色采用蓝紫色调（hue: 250），在 Light 模式下较深，Dark 模式下较亮，确保对比度。

### 2.2 强调色（Accent）

用于高亮显示、重要信息提示、链接悬停状态。

| 模式 | 颜色值 (oklch) | Tailwind 类名 | 使用场景 |
|------|---------------|--------------|----------|
| Light | `oklch(0.50 0.12 220)` | `bg-accent` | 次要按钮、标签背景 |
| Light | `oklch(0.15 0 0)` | `text-accent-foreground` | 强调色文字 |
| Dark | `oklch(0.60 0.12 220)` | `bg-accent` | 次要按钮、标签背景 |
| Dark | `oklch(0.95 0 0)` | `text-accent-foreground` | 强调色文字 |

**说明**：强调色采用青蓝色调（hue: 220），与主色形成互补，用于次要操作。

### 2.3 语义色（Semantic Colors）

#### 成功（Success）
| 模式 | 颜色值 (oklch) | Tailwind 类名 | 使用场景 |
|------|---------------|--------------|----------|
| Light | `oklch(0.55 0.15 140)` | `text-success` | 成功状态、盈利显示 |
| Dark | `oklch(0.65 0.15 140)` | `text-success` | 成功状态、盈利显示 |

#### 警告（Warning）
| 模式 | 颜色值 (oklch) | Tailwind 类名 | 使用场景 |
|------|---------------|--------------|----------|
| Light | `oklch(0.70 0.15 60)` | `text-warning` | 警告提示、注意信息 |
| Dark | `oklch(0.75 0.15 60)` | `text-warning` | 警告提示、注意信息 |

#### 错误（Error / Destructive）
| 模式 | 颜色值 (oklch) | Tailwind 类名 | 使用场景 |
|------|---------------|--------------|----------|
| Light | `oklch(0.58 0.25 27)` | `bg-destructive` / `text-destructive` | 错误状态、删除操作 |
| Dark | `oklch(0.70 0.19 22)` | `bg-destructive` / `text-destructive` | 错误状态、删除操作 |

### 2.4 背景层级（Background Layers）

| 层级 | Light 模式 | Dark 模式 | Tailwind 类名 | 使用场景 |
|------|-----------|----------|--------------|----------|
| Page | `oklch(0.99 0 0)` | `oklch(0.10 0 0)` | `bg-background` | 页面背景 |
| Card | `oklch(1 0 0)` | `oklch(0.15 0 0)` | `bg-card` | 卡片背景 |
| Input | `oklch(0.98 0 0)` | `oklch(0.20 0 0)` | `bg-input` | 输入框背景 |
| Overlay | `oklch(0.15 0 0 / 0.6)` | `oklch(0.05 0 0 / 0.8)` | `bg-overlay` | 遮罩层、Dialog 背景 |
| Muted | `oklch(0.97 0 0)` | `oklch(0.20 0 0)` | `bg-muted` | 次要背景区域 |

### 2.5 边框颜色（Border Colors）

| 层级 | Light 模式 | Dark 模式 | Tailwind 类名 | 使用场景 |
|------|-----------|----------|--------------|----------|
| Default | `oklch(0.90 0 0)` | `oklch(1 0 0 / 0.1)` | `border-border` | 默认边框 |
| Input | `oklch(0.88 0 0)` | `oklch(1 0 0 / 0.15)` | `border-input` | 输入框边框 |
| Focus | `oklch(0.45 0.15 250)` | `oklch(0.55 0.15 250)` | `border-ring` | 聚焦状态边框 |

### 2.6 文字颜色（Text Colors）

| 层级 | Light 模式 | Dark 模式 | Tailwind 类名 | 使用场景 |
|------|-----------|----------|--------------|----------|
| Primary | `oklch(0.15 0 0)` | `oklch(0.95 0 0)` | `text-foreground` | 主要文字 |
| Secondary | `oklch(0.45 0 0)` | `oklch(0.70 0 0)` | `text-muted-foreground` | 次要文字 |
| Disabled | `oklch(0.70 0 0)` | `oklch(0.50 0 0)` | `text-disabled` | 禁用状态文字 |
| Inverse | `oklch(0.98 0 0)` | `oklch(0.05 0 0)` | `text-inverse` | 反色文字（用于深色背景） |

---

## 3. 间距系统（Spacing Scale）

基于 4px 基准单位，形成 8 的倍数系统，确保视觉一致性。

| 数值 | Tailwind 类名 | 使用场景示例 |
|------|--------------|-------------|
| 4px | `space-1` / `p-1` / `m-1` | 图标与文字间距、紧密排列 |
| 8px | `space-2` / `p-2` / `m-2` | 小按钮内边距、标签间距 |
| 12px | `space-3` / `p-3` / `m-3` | 中等按钮内边距、卡片内元素间距 |
| 16px | `space-4` / `p-4` / `m-4` | 标准按钮内边距、卡片内边距 |
| 20px | `space-5` / `p-5` / `m-5` | 大按钮内边距、表单元素间距 |
| 24px | `space-6` / `p-6` / `m-6` | 卡片内边距、区块间距 |
| 32px | `space-8` / `p-8` / `m-8` | 大卡片内边距、页面区块间距 |
| 40px | `space-10` / `p-10` / `m-10` | 页面边距、大区块间距 |
| 48px | `space-12` / `p-12` / `m-12` | 页面容器边距 |
| 64px | `space-16` / `p-16` / `m-16` | 大页面容器边距、章节间距 |

**间距使用原则**：
- 垂直间距通常使用 `space-y-*` 或 `gap-*`
- 水平间距使用 `space-x-*` 或 `gap-*`
- 内边距使用 `p-*`、`px-*`、`py-*`
- 外边距使用 `m-*`、`mx-*`、`my-*`

---

## 4. 圆角系统（Border Radius）

统一的圆角规范，营造现代、友好的视觉感受。

| 圆角值 | Tailwind 类名 | 使用场景 |
|--------|--------------|----------|
| 4px | `rounded-sm` | 小标签、徽章 |
| 6px | `rounded-md` | 小按钮、输入框 |
| 8px | `rounded-lg` | 标准按钮、卡片（小） |
| 12px | `rounded-xl` | 标准卡片、对话框 |
| 16px | `rounded-2xl` | 大卡片、模态框 |
| 20px | `rounded-3xl` | 特殊卡片、大模态框 |
| 9999px | `rounded-full` | 圆形按钮、头像 |

**圆角使用规范**：
- **按钮**：sm 使用 `rounded-md` (6px)，md/lg 使用 `rounded-lg` (8px)
- **输入框**：统一使用 `rounded-lg` (8px)
- **卡片**：标准卡片使用 `rounded-xl` (12px)，大卡片使用 `rounded-2xl` (16px)
- **对话框**：使用 `rounded-2xl` (16px) 或 `rounded-3xl` (20px)

---

## 5. 字体系统（Typography）

### 5.1 字体族（Font Families）

| 字体 | CSS 变量 | Tailwind 类名 | 使用场景 |
|------|----------|--------------|----------|
| Sans | `--font-geist-sans` | `font-sans` | 正文、标题、UI 元素 |
| Mono | `--font-geist-mono` | `font-mono` | 地址、哈希、金额、代码 |

### 5.2 标题层级（Headings）

| 层级 | 字号 | 行高 | 字重 | Tailwind 类名 | 使用场景 |
|------|------|------|------|--------------|----------|
| H1 | 32px | 1.2 | 700 | `text-3xl font-bold` | 页面主标题 |
| H2 | 24px | 1.3 | 600 | `text-2xl font-semibold` | 区块标题 |
| H3 | 20px | 1.4 | 600 | `text-xl font-semibold` | 卡片标题 |
| H4 | 18px | 1.4 | 600 | `text-lg font-semibold` | 小节标题 |
| H5 | 16px | 1.5 | 600 | `text-base font-semibold` | 小标题 |
| H6 | 14px | 1.5 | 600 | `text-sm font-semibold` | 标签标题 |

### 5.3 正文（Body Text）

| 类型 | 字号 | 行高 | 字重 | Tailwind 类名 | 使用场景 |
|------|------|------|------|--------------|----------|
| Large | 18px | 1.6 | 400 | `text-lg` | 重要正文、引导文字 |
| Base | 16px | 1.5 | 400 | `text-base` | 标准正文 |
| Small | 14px | 1.5 | 400 | `text-sm` | 次要文字、说明 |
| XSmall | 12px | 1.4 | 400 | `text-xs` | 辅助信息、标签文字 |

### 5.4 数字/金额显示（Numbers）

| 类型 | 字号 | 字重 | 字体 | Tailwind 类名 | 使用场景 |
|------|------|------|------|--------------|----------|
| Large | 32px | 600 | Mono | `text-3xl font-semibold font-mono` | 大金额显示 |
| Medium | 24px | 600 | Mono | `text-2xl font-semibold font-mono` | 中等金额 |
| Base | 18px | 500 | Mono | `text-lg font-medium font-mono` | 标准金额 |
| Small | 16px | 500 | Mono | `text-base font-medium font-mono` | 小金额 |
| XSmall | 14px | 500 | Mono | `text-sm font-medium font-mono` | 辅助金额 |

**说明**：金额、地址、哈希等关键数据使用等宽字体（Mono），确保对齐和可读性。

---

## 6. 阴影系统（Shadows）

分层的阴影系统，营造深度感和层次感。

| 层级 | 阴影值 | Tailwind 类名 | 使用场景 |
|------|--------|--------------|----------|
| None | `none` | `shadow-none` | 无阴影 |
| Sm | `0 1px 2px 0 oklch(0 0 0 / 0.05)` | `shadow-sm` | 输入框、小卡片 |
| Base | `0 1px 3px 0 oklch(0 0 0 / 0.1), 0 1px 2px -1px oklch(0 0 0 / 0.1)` | `shadow` | 标准卡片 |
| Md | `0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1)` | `shadow-md` | 悬浮卡片、下拉菜单 |
| Lg | `0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.1)` | `shadow-lg` | 对话框、模态框 |
| Xl | `0 20px 25px -5px oklch(0 0 0 / 0.1), 0 8px 10px -6px oklch(0 0 0 / 0.1)` | `shadow-xl` | 大模态框、抽屉 |
| 2xl | `0 25px 50px -12px oklch(0 0 0 / 0.25)` | `shadow-2xl` | 特殊悬浮层 |

**Dark 模式调整**：
- Dark 模式下，阴影使用更低的透明度，或使用 `oklch(1 0 0 / 0.05)` 等浅色阴影
- 卡片在 Dark 模式下可配合边框使用，减少阴影依赖

**阴影使用规范**：
- **卡片**：默认 `shadow`，悬浮时 `shadow-md`
- **输入框**：聚焦时 `shadow-sm`
- **按钮**：悬浮时 `shadow-sm`，按下时无阴影
- **对话框**：`shadow-lg` 或 `shadow-xl`
- **下拉菜单**：`shadow-md`

---

## 7. 动画与过渡（Animation & Transitions）

### 7.1 过渡时长（Transition Duration）

| 时长 | Tailwind 类名 | 使用场景 |
|------|--------------|----------|
| 75ms | `duration-75` | 快速反馈（按钮点击） |
| 150ms | `duration-150` | 标准过渡（颜色、背景） |
| 200ms | `duration-200` | 标准过渡（默认） |
| 300ms | `duration-300` | 平滑过渡（尺寸变化） |
| 500ms | `duration-500` | 慢速过渡（页面切换） |

### 7.2 缓动函数（Easing Functions）

| 函数 | Tailwind 类名 | 使用场景 |
|------|--------------|----------|
| ease-in-out | `ease-in-out` | 标准过渡（默认） |
| ease-out | `ease-out` | 进入动画 |
| ease-in | `ease-in` | 退出动画 |

### 7.3 常用动画组合

| 场景 | Tailwind 类名组合 | 说明 |
|------|------------------|------|
| 按钮悬停 | `transition-colors duration-200` | 颜色过渡 |
| 卡片悬浮 | `transition-shadow duration-200` | 阴影过渡 |
| 模态框出现 | `transition-all duration-300 ease-out` | 全属性过渡 |
| 加载状态 | `animate-spin` | 旋转动画 |

---

## 8. Tailwind 配置映射建议

### 8.1 颜色扩展（在 `tailwind.config.ts` 中）

```typescript
colors: {
  primary: {
    DEFAULT: 'oklch(0.45 0.15 250)',
    foreground: 'oklch(0.98 0 0)',
  },
  accent: {
    DEFAULT: 'oklch(0.50 0.12 220)',
    foreground: 'oklch(0.15 0 0)',
  },
  success: 'oklch(0.55 0.15 140)',
  warning: 'oklch(0.70 0.15 60)',
  // ... 其他颜色
}
```

### 8.2 间距扩展

保持 Tailwind 默认间距系统（基于 4px），无需额外配置。

### 8.3 圆角扩展

保持 Tailwind 默认圆角系统，或根据需要扩展：
```typescript
borderRadius: {
  'xs': '2px',
  'sm': '4px',
  'md': '6px',
  'lg': '8px',
  'xl': '12px',
  '2xl': '16px',
  '3xl': '20px',
}
```

---

## 9. 总结

本 Design System 规范提供了：
- ✅ 完整的颜色系统（Light/Dark 模式）
- ✅ 统一的间距、圆角、字体规范
- ✅ 分层的阴影系统
- ✅ 清晰的 Tailwind 类名映射
- ✅ 可直接应用到项目中的 CSS 变量建议

所有规范都考虑了 DeFi/DEX 产品的特殊需求，特别是数据可读性和专业可信度。下一步将基于此规范设计基础组件系统。


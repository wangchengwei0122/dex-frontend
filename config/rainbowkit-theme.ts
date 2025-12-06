import { darkTheme, type Theme } from '@rainbow-me/rainbowkit';

/**
 * 黑金 DEX 主题配置
 * 符合 Black & Gold Design System
 */
export const blackGoldTheme: Theme = darkTheme({
  accentColor: '#C9A227', // 金色主色
  accentColorForeground: 'white',
  borderRadius: 'large',
  fontStack: 'system',
  overlayBlur: 'small',
});

// 覆盖默认样式以完全符合黑金主题
export const customBlackGoldTheme: Theme = {
  ...blackGoldTheme,
  colors: {
    ...blackGoldTheme.colors,
    // 模态框背景
    modalBackground: '#0A0A0C',
    // 连接按钮背景
    connectButtonBackground: '#0A0A0C',
    connectButtonBackgroundError: '#EF4444',
    // 连接按钮文字
    connectButtonText: '#C9A227',
    // 连接按钮边框
    connectButtonInnerBackground: '#0A0A0C',
    // 强调色
    accentColor: '#C9A227',
    accentColorForeground: 'white',
    // 动作按钮
    actionButtonBorder: 'rgba(201, 162, 39, 0.25)',
    actionButtonBorderMobile: 'rgba(201, 162, 39, 0.25)',
    actionButtonSecondaryBackground: '#111111',
    // 关闭按钮
    closeButton: 'rgba(201, 162, 39, 0.6)',
    closeButtonBackground: 'rgba(201, 162, 39, 0.1)',
    // 通用背景
    generalBorder: 'rgba(201, 162, 39, 0.25)',
    generalBorderDim: 'rgba(201, 162, 39, 0.1)',
    // 菜单项
    menuItemBackground: '#111111',
    // 模态框文字
    modalText: '#F9FAFB',
    modalTextDim: '#D4D4D8',
    modalTextSecondary: '#71717A',
    // 轮廓
    profileAction: '#111111',
    profileActionHover: 'rgba(201, 162, 39, 0.1)',
    profileForeground: '#0A0A0C',
    // 选择按钮
    selectedOptionBorder: '#C9A227',
    // 待定状态
    standby: '#71717A',
  },
  fonts: {
    ...blackGoldTheme.fonts,
  },
  radii: {
    ...blackGoldTheme.radii,
    actionButton: '12px', // rounded-xl
    connectButton: '12px', // rounded-xl
    menuButton: '12px',
    modal: '24px', // rounded-3xl
    modalMobile: '24px',
  },
  shadows: {
    ...blackGoldTheme.shadows,
    connectButton: '0 0 12px rgba(201, 162, 39, 0.4)', // 金色 glow
    dialog: '0 18px 45px rgba(0, 0, 0, 0.6)',
    profileDetailsAction: '0 0 12px rgba(201, 162, 39, 0.4)',
    selectedOption: '0 0 12px rgba(201, 162, 39, 0.4)',
    selectedWallet: '0 0 12px rgba(201, 162, 39, 0.4)',
    walletLogo: '0 0 12px rgba(201, 162, 39, 0.4)',
  },
};


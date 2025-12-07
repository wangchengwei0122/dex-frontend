import { AppButton } from "@/components/app/app-button"

export interface SwapActionButtonProps {
  isConnected: boolean;
  canSubmit: boolean;
  errorMessage?: string;
  loading?: boolean;
  buttonLabel?: string; // 自定义按钮文本
  onConnect: () => void;
  onReview: () => void;
}

export function SwapActionButton({
  isConnected,
  canSubmit,
  errorMessage,
  loading = false,
  buttonLabel,
  onConnect,
  onReview,
}: SwapActionButtonProps) {
  if (!isConnected) {
    return (
      <AppButton
        variant="primary"
        className="w-full py-3 text-base"
        onClick={onConnect}
      >
        Connect Wallet
      </AppButton>
    )
  }

  // 优先使用传入的 buttonLabel，否则使用 errorMessage，最后使用默认值
  const buttonText = buttonLabel || errorMessage || 'Review';
  const isDisabled = !canSubmit || !!errorMessage || loading;

  return (
    <AppButton
      variant="primary"
      className="w-full py-3 text-base"
      disabled={isDisabled}
      loading={loading}
      onClick={onReview}
    >
      {buttonText}
    </AppButton>
  )
}


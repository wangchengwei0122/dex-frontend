import { AppButton } from "@/components/app/app-button"

export interface SwapActionButtonProps {
  isConnected: boolean;
  canSubmit: boolean;
  errorMessage?: string;
  loading?: boolean;
  onConnect: () => void;
  onReview: () => void;
}

export function SwapActionButton({
  isConnected,
  canSubmit,
  errorMessage,
  loading = false,
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

  const buttonText = errorMessage || 'Review';
  const isDisabled = !canSubmit || !!errorMessage;

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


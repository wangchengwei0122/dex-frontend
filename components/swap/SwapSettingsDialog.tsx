"use client"

import { useState, useEffect } from "react"
import { AppDialog, AppDialogContent } from "@/components/app/app-dialog"
import { AppButton } from "@/components/app/app-button"
import { AppInput } from "@/components/app/app-input"
import { AppFieldLabel } from "@/components/app/app-field-label"
import { cn } from "@/lib/utils"
import type { SwapSettings } from "./types"

export interface SwapSettingsDialogProps {
  open: boolean;
  settings: SwapSettings;
  onChange: (settings: SwapSettings) => void;
  onClose: () => void;
}

export function SwapSettingsDialog({
  open,
  settings,
  onChange,
  onClose,
}: SwapSettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<SwapSettings>(settings);
  const [customSlippage, setCustomSlippage] = useState("");

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const presetSlippages = [
    { label: 'Auto', bps: 30 },
    { label: '0.1%', bps: 10 },
    { label: '0.5%', bps: 50 },
    { label: '1%', bps: 100 },
  ];

  const deadlineOptions = [
    { label: '20 min', value: 20 },
    { label: '30 min', value: 30 },
    { label: '60 min', value: 60 },
  ];

  const handleSlippagePreset = (bps: number) => {
    setLocalSettings({ ...localSettings, slippageBps: bps });
    setCustomSlippage("");
  };

  const handleCustomSlippage = (value: string) => {
    setCustomSlippage(value);
    if (value && !isNaN(Number(value))) {
      const bps = Math.round(Number(value) * 100);
      setLocalSettings({ ...localSettings, slippageBps: bps });
    }
  };

  const handleDeadline = (minutes: number) => {
    setLocalSettings({ ...localSettings, deadlineMinutes: minutes });
  };

  const handleOneClick = (enabled: boolean) => {
    setLocalSettings({ ...localSettings, oneClickEnabled: enabled });
  };

  const handleSave = () => {
    onChange(localSettings);
    onClose();
  };

  const currentSlippagePercent = localSettings.slippageBps / 100;
  const isPresetSlippage = presetSlippages.some(p => p.bps === localSettings.slippageBps);

  return (
    <AppDialog open={open} onOpenChange={onClose}>
      <AppDialogContent 
        title="Swap Settings" 
        size="md"
      >
        <div className="space-y-6">
          {/* Slippage */}
          <div className="space-y-3">
            <AppFieldLabel className="flex items-center gap-2">
              Max slippage
              <span className="text-xs text-zinc-500">ⓘ</span>
            </AppFieldLabel>
            
            <div className="flex items-center gap-2">
              {presetSlippages.map((preset) => (
                <AppButton
                  key={preset.label}
                  variant={localSettings.slippageBps === preset.bps && !customSlippage ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => handleSlippagePreset(preset.bps)}
                >
                  {preset.label}
                </AppButton>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <AppInput
                placeholder="Custom"
                value={customSlippage || (!isPresetSlippage ? currentSlippagePercent.toString() : '')}
                onChange={(e) => handleCustomSlippage(e.target.value)}
                className="flex-1"
              />
              <span className="text-sm text-zinc-400">%</span>
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-3">
            <AppFieldLabel className="flex items-center gap-2">
              Swap deadline
              <span className="text-xs text-zinc-500">ⓘ</span>
            </AppFieldLabel>
            
            <div className="flex items-center gap-2">
              {deadlineOptions.map((option) => (
                <AppButton
                  key={option.value}
                  variant={localSettings.deadlineMinutes === option.value ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => handleDeadline(option.value)}
                >
                  {option.label}
                </AppButton>
              ))}
            </div>
          </div>

          {/* 1-click swaps */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <AppFieldLabel className="flex items-center gap-2">
                1-click swaps
                <span className="text-xs text-zinc-500">ⓘ</span>
              </AppFieldLabel>
              <p className="text-xs text-zinc-500">
                Skip review step for faster swaps
              </p>
            </div>
            
            <button
              onClick={() => handleOneClick(!localSettings.oneClickEnabled)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                localSettings.oneClickEnabled ? "bg-[#C9A227]" : "bg-zinc-700"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  localSettings.oneClickEnabled ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>

          {/* Save Button */}
          <AppButton
            variant="primary"
            className="w-full"
            onClick={handleSave}
          >
            Save Settings
          </AppButton>
        </div>
      </AppDialogContent>
    </AppDialog>
  )
}


// src/components/SubmitButton.tsx
'use client'

type Props = {
  idleLabel: string
  loadingLabel: string
  isLoading: boolean
}

// 通用提交按钮：根据 isLoading 自动切换文案与样式
export function SubmitButton({ idleLabel, loadingLabel, isLoading }: Props) {
  return (
    <button
      type="submit"
      className={`w-full rounded-lg px-5 py-2.5 font-medium text-white transition ${
        isLoading
          ? 'cursor-wait bg-[var(--accent-hover)] opacity-80'
          : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)]'
      }`}
      disabled={isLoading}
    >
      {isLoading ? loadingLabel : idleLabel}
    </button>
  )
}

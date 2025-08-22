// components/BackButton.tsx
'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ReactNode } from 'react'

interface BackButtonProps {
  className?: string
  fallbackUrl?: string
  size?: number
  disabled?: boolean
  onClick?: () => void
}

export default function BackButton({
  className = '',
  fallbackUrl = '/',
  size = 20,
  disabled = false,
  onClick
}: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (disabled) return

    // Ejecutar callback personalizado si existe
    if (onClick) {
      onClick()
    }

    // Verificar si hay historial disponible
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      // Si no hay historial, ir a la URL de respaldo
      router.push(fallbackUrl)
    }
  }

  const baseClasses = 'inline-flex items-center justify-center transition-colors duration-200 hover:text-gray-600 focus:outline-none'
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer text-gray-800'

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${disabledClasses} ${className}`}
      disabled={disabled}
      type="button"
    >
      <ArrowLeft size={size} />
    </button>
  )
}

export function useBackNavigation(fallbackUrl: string = '/') {
  const router = useRouter()

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackUrl)
    }
  }

  const canGoBack = typeof window !== 'undefined' && window.history.length > 1

  return { goBack, canGoBack }
}

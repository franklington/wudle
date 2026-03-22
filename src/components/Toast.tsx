import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  duration?: number
  onDone?: () => void
}

export default function Toast({ message, duration = 1500, onDone }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      onDone?.()
    }, duration)
    return () => clearTimeout(t)
  }, [message])

  if (!visible) return null

  return (
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>
  )
}

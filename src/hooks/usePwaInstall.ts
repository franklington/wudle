import { useState, useEffect, useRef } from 'react'

const DISMISSED_KEY = 'wudle-pwa-dismissed'

export interface PwaInstallInfo {
  visible: boolean
  instruction: string
  /** Present when the browser exposes a native install prompt (Android Chrome/Edge) */
  onInstall: (() => void) | null
  onDismiss: () => void
}

/** Minimal type for the non-standard BeforeInstallPromptEvent */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/** Derive platform-specific install instructions. Returns empty string when no
 *  instructions are applicable (e.g. desktop Firefox / Safari which don't support PWA install). */
function getInstruction(ua: string): string {
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isAndroid = /Android/.test(ua)

  if (isIOS) {
    // Chrome/Firefox/Edge on iOS cannot install PWAs — user must use Safari
    if (/CriOS|FxiOS|EdgiOS/.test(ua)) {
      return 'Open this page in Safari, then tap Share (□↑) → Add to Home Screen'
    }
    // Safari on iOS
    return 'Tap the Share button (□↑) then Add to Home Screen'
  }

  if (isAndroid) {
    if (/SamsungBrowser/.test(ua)) {
      return 'Tap ☰ → Add page to → Home Screen'
    }
    if (/Firefox/.test(ua)) {
      return 'Tap ⋮ → Install'
    }
    // Chrome, Edge, and other Chromium-based Android browsers
    return 'Tap ⋮ → Add to Home Screen'
  }

  // Desktop: rely on beforeinstallprompt to determine support; show a generic
  // Chromium-family instruction now — the banner hides itself on non-supporting browsers
  // because beforeinstallprompt never fires (and the instruction text stays hidden
  // until we get the event). For iOS-on-desktop we fall through to '' below.
  //
  // Show the instruction for any non-Firefox, non-Safari desktop UA so that
  // Chromium-family browsers (Chrome, Edge, Brave, Vivaldi, Arc, …) all benefit.
  if (!/Firefox\//.test(ua) && !/Safari\//.test(ua)) {
    return 'Click the install icon (⊕) in the address bar'
  }
  // Catch Chrome/Chromium explicitly (their UA contains "Safari" too)
  if (/Chrome\//.test(ua) || /Edg\//.test(ua) || /Chromium\//.test(ua)) {
    return 'Click the install icon (⊕) in the address bar'
  }

  // Desktop Firefox, Safari — no install support; hide banner
  return ''
}

export function usePwaInstall(): PwaInstallInfo {
  const [visible, setVisible] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [hasNativePrompt, setHasNativePrompt] = useState(false)
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Don't show when already running as an installed PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true

    if (isStandalone) return
    if (localStorage.getItem(DISMISSED_KEY) === '1') return

    const text = getInstruction(navigator.userAgent)
    if (!text) return

    setInstruction(text)
    setVisible(true)

    // Capture the native install prompt on Android Chrome/Edge
    const handler = (e: Event) => {
      e.preventDefault()
      deferredPrompt.current = e as BeforeInstallPromptEvent
      setHasNativePrompt(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // Hide banner automatically if the app gets installed another way
    const installed = () => setVisible(false)
    window.addEventListener('appinstalled', installed)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installed)
    }
  }, [])

  const onDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1')
    setVisible(false)
  }

  const onInstall = hasNativePrompt
    ? () => {
        const prompt = deferredPrompt.current
        if (!prompt) return
        prompt.prompt()
        prompt.userChoice.then(({ outcome }) => {
          deferredPrompt.current = null
          setHasNativePrompt(false)
          if (outcome === 'accepted') {
            setVisible(false)
          }
        }).catch(() => {
          deferredPrompt.current = null
          setHasNativePrompt(false)
        })
      }
    : null

  return { visible, instruction, onInstall, onDismiss }
}


import { usePwaInstall } from '../hooks/usePwaInstall'

export default function PwaBanner() {
  const { visible, instruction, onInstall, onDismiss } = usePwaInstall()

  if (!visible) return null

  return (
    <div className="pwa-banner" role="region" aria-label="Install wUDle as an app">
      <span className="pwa-banner-icon" aria-hidden="true">📲</span>
      <p className="pwa-banner-text">{instruction}</p>
      {onInstall && (
        <button className="pwa-banner-install-btn" onClick={onInstall}>
          Install
        </button>
      )}
      <button
        className="pwa-banner-close"
        onClick={onDismiss}
        aria-label="Dismiss install prompt"
      >
        ✕
      </button>
    </div>
  )
}

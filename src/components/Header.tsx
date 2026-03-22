interface HeaderProps {
  onStatsClick: () => void
  onHelpClick: () => void
}

export default function Header({ onStatsClick, onHelpClick }: HeaderProps) {
  return (
    <header className="header">
      <button className="header-btn" onClick={onHelpClick} aria-label="How to play">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </button>
      <h1 className="header-title">
        w<span className="header-ud">UD</span>le
      </h1>
      <button className="header-btn" onClick={onStatsClick} aria-label="Statistics">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6"  y1="20" x2="6"  y2="14"/>
        </svg>
      </button>
    </header>
  )
}

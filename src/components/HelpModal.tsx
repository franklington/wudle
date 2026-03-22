interface HelpModalProps {
  onClose: () => void
}

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <h2 className="modal-title">How To Play</h2>
        <p className="help-text">Guess the <strong>WUDLE</strong> in 6 tries.</p>
        <ul className="help-list">
          <li>The hidden word is urban slang from Urban Dictionary.</li>
          <li>Each guess must be <strong>5 letters</strong>. Hit ENTER to submit.</li>
          <li>The color of the tiles will change to show how close your guess was.</li>
        </ul>
        <div className="help-examples">
          <div className="help-row">
            <div className="tile tile-correct ex-tile">S</div>
            <div className="tile tile-empty ex-tile">A</div>
            <div className="tile tile-empty ex-tile">L</div>
            <div className="tile tile-empty ex-tile">T</div>
            <div className="tile tile-empty ex-tile">Y</div>
          </div>
          <p className="help-example-text"><strong>S</strong> is in the word and in the correct spot.</p>
          <div className="help-row">
            <div className="tile tile-empty ex-tile">V</div>
            <div className="tile tile-present ex-tile">I</div>
            <div className="tile tile-empty ex-tile">B</div>
            <div className="tile tile-empty ex-tile">E</div>
            <div className="tile tile-empty ex-tile">S</div>
          </div>
          <p className="help-example-text"><strong>I</strong> is in the word but in the wrong spot.</p>
          <div className="help-row">
            <div className="tile tile-empty ex-tile">T</div>
            <div className="tile tile-empty ex-tile">H</div>
            <div className="tile tile-absent ex-tile">I</div>
            <div className="tile tile-empty ex-tile">C</div>
            <div className="tile tile-empty ex-tile">C</div>
          </div>
          <p className="help-example-text"><strong>I</strong> is not in the word at all.</p>
        </div>
        <p className="help-footer">A new word drops every day. The definition is revealed at the end. 🏙️</p>
      </div>
    </div>
  )
}

export function DemoHint({text, children}) {
  return <div aria-label={text}>{children}</div>;
}

export function PlayingCardContents({rank, suit, faceDown}) {
  const symbols = {hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠'};
  return <div style={{padding: '1em', textAlign: 'center'}}>
    {faceDown ? '◆' : `${rank} ${symbols[suit] || ''}`}
  </div>;
}

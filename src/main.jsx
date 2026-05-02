import React from 'react'
import ReactDOM from 'react-dom/client'
import HarpersBedtimeApp from './App.jsx'

// One-time backfill: credit Harper with the 10 stickers she earned before
// the app moved to GitHub Pages (different origin = empty localStorage).
const SEED_KEY = 'harper-seed-v1'
if (!localStorage.getItem(SEED_KEY)) {
  try {
    const existing = JSON.parse(localStorage.getItem('harper-stickers') || '[]')
    const seeded = ['🐳', '🐙', '💖', '🌸', '🦄', '🦋', '⭐', '🍭', '🌈', '🌟']
    localStorage.setItem('harper-stickers', JSON.stringify([...seeded, ...existing]))
    localStorage.setItem(SEED_KEY, '1')
  } catch {}
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HarpersBedtimeApp />
  </React.StrictMode>,
)

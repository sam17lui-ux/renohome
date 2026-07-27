'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // No monitoring service wired up yet — this is the one place a crash
    // is guaranteed to be visible during development.
    console.error(error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 32,
        textAlign: 'center',
        background: '#F7F3E8',
        color: '#2C2A26',
        fontFamily: 'Geist, system-ui, sans-serif',
      }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily: "'Newsreader', Georgia, serif",
          fontSize: 32,
          fontWeight: 500,
        }}
      >
        Something went wrong.
      </h1>
      <p style={{ margin: 0, maxWidth: 420, color: '#5B5347', lineHeight: 1.5 }}>
        This screen hit an unexpected error. Your saved projects are untouched — try
        again, or reload the page.
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          marginTop: 8,
          border: 'none',
          borderRadius: '15px 12px 16px 13px',
          padding: '12px 24px',
          fontSize: 14,
          cursor: 'pointer',
          background: '#a96e4f',
          color: '#F7F3E8',
        }}
      >
        Try again
      </button>
    </div>
  )
}

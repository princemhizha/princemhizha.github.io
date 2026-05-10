import { useEffect, useMemo, useState } from 'react'

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function SystemStatusBar({ activeSection, runtimeMode, viewedProjects, throughput, engineeringMode }) {
  const [now, setNow] = useState(Date.now())
  const [startedAt] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const localTime = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(now),
    [now],
  )

  return (
    <aside className="pointer-events-none fixed left-1/2 top-2 z-[110] w-[min(980px,96vw)] -translate-x-1/2">
      <div className="status-bar pointer-events-auto grid gap-2 rounded-xl border border-accent-cyan/35 bg-black/60 px-3 py-2 backdrop-blur-xl sm:grid-cols-5 sm:items-center sm:gap-4 sm:px-4">
        <div className="status-item">
          <span className="status-dot" />
          <span>SYSTEM STATUS: ONLINE</span>
        </div>
        <div className="status-item">ACTIVE NODE: {activeSection.toUpperCase()}</div>
        <div className="status-item">CURRENT MODE: {(engineeringMode ? 'ENGINEERING' : runtimeMode).toUpperCase()}</div>
        <div className="status-item">UPTIME: {formatDuration(now - startedAt)}</div>
        <div className="status-item">LIVE: {Math.round(throughput * 100)}% | PROJECTS: {viewedProjects}</div>
      </div>
      <div className="mt-1 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-accent-cyan/65">LOCAL TIME {localTime}</div>
    </aside>
  )
}

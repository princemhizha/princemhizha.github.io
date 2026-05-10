import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const aiPersonality = [
  'Welcome to the PKM AI OS Terminal.',
  'Type a command. I am always listening.',
  'System context loaded. Awaiting input.',
]

const systemCommands = {
  whoami:
    'Prince Kudzai Mhizha\nFrontend Systems Engineer\nUI/UX Infrastructure Designer\nStatus: Identity verified',
  stack:
    'React, TypeScript, TailwindCSS, Framer Motion\nInteraction Systems, Product UX, Fintech Interfaces\nFocus: Performance-driven immersive UI',
  projects:
    'Pfuma Pamwe\nHackathon Achievement: Top 5\nMedilink Experience\nSmart Panic Bracelet',
  mission:
    'Build intelligent digital systems that feel cinematic, human, and operationally precise.',
  contact:
    'GitHub: github.com/princemhizha\nLinkedIn: /in/prince-kudzai-mhizha-952977258\nEmail: princemhizha58@gmail.com',
  'explain projects': 'Analyzing portfolio projects...\nPfuma Pamwe: Fintech credit empowerment and AI fraud intelligence.\nHackathon Achievement: Top 5 MVP.\nMedilink Experience: HealthTech system design.\nSmart Panic Bracelet: IoT-based safety concept.',
  'open architecture': 'Opening architecture schematic...\n[Engineering schematic overlay activated.]',
  'analyze portfolio': 'Running deep analysis...\nAll systems optimal. UI/UX, AI, and GPU layers operational.',
  'activate engineering mode': 'Engineering mode engaged. Advanced diagnostics and controls enabled.',
  'activate focus mode': 'Focus mode engaged. Distractions minimized.',
  'show telemetry': 'Displaying real-time system telemetry.',
  help:
    'Available commands: whoami, stack, projects, mission, contact, explain projects, open architecture, analyze portfolio, activate engineering mode, activate focus mode, show telemetry, help',
}

function parseCommand(input, setSystemState) {
  const cmd = input.trim().toLowerCase()
  if (cmd in systemCommands) {
    if (cmd === 'activate engineering mode') setSystemState('engineering')
    if (cmd === 'activate focus mode') setSystemState('focus')
    return systemCommands[cmd]
  }
  if (cmd.startsWith('go to ')) {
    const section = cmd.replace('go to ', '').trim()
    return `Navigating to section: ${section}`
  }
  if (cmd.startsWith('explain ')) {
    return `Explaining: ${cmd.replace('explain ', '')}... [AI OS response simulated]`
  }
  return `Unknown command: ${input}`
}

export default function TerminalAssistant({ visible = true, onNavigate, onSetMode }) {
  const [open, setOpen] = useState(visible)
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [systemState, setSystemState] = useState('normal')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [commandHistory, setCommandHistory] = useState([])
  const inputRef = useRef(null)
  const commandSuggestions = useMemo(() => Object.keys(systemCommands), [])

  useEffect(() => {
    let cancelled = false
    let i = 0

    const step = () => {
      if (cancelled || i >= aiPersonality.length) return
      setHistory((lines) => [...lines, aiPersonality[i]])
      i += 1
      setTimeout(step, 420)
    }

    step()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  const handleCommand = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setCommandHistory((current) => [...current, input])
    setHistoryIndex(-1)

    const response = parseCommand(input, (mode) => {
      setSystemState(mode)
      if (onSetMode) onSetMode(mode)
    })
    setHistory((h) => [...h, `> ${input}`, response])
    setInput('')
    if (response.startsWith('Navigating to section:') && onNavigate) {
      const section = input.replace(/go to /i, '').trim()
      onNavigate(section)
    }
  }

  const handleInputKeyDown = (event) => {
    if (!commandHistory.length) return

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const nextIndex = historyIndex < 0 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setInput(commandHistory[nextIndex])
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (historyIndex < 0) return
      const nextIndex = historyIndex + 1
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1)
        setInput('')
        return
      }
      setHistoryIndex(nextIndex)
      setInput(commandHistory[nextIndex])
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      const match = commandSuggestions.find((command) => command.startsWith(input.toLowerCase()))
      if (match) setInput(match)
    }
  }

  const filteredSuggestions = commandSuggestions.filter((command) =>
    command.toLowerCase().includes(input.toLowerCase()) && input.trim().length > 0,
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-terminal
          className="fixed bottom-6 right-6 z-[120] w-[420px] max-w-[98vw] rounded-xl border border-accent-cyan/40 bg-black/90 shadow-neon backdrop-blur-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.28 }}
        >
          <div className="p-4 font-mono text-xs text-accent-cyan/90">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-bold tracking-widest">AI OS TERMINAL</span>
              <button className="text-accent-cyan/70 hover:text-accent-cyan" onClick={() => setOpen(false)} aria-label="Close terminal">✕</button>
            </div>
            <div className="h-40 overflow-y-auto whitespace-pre-line rounded bg-black/60 p-2 text-accent-cyan/80" style={{ fontFamily: 'inherit' }}>
              {history.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
            <form className="mt-2 flex" onSubmit={handleCommand} autoComplete="off">
              <span className="mr-2 text-accent-cyan/60">{systemState === 'engineering' ? 'ENG>' : systemState === 'focus' ? 'FOC>' : 'AI>'}</span>
              <input
                ref={inputRef}
                className="flex-1 rounded bg-black/70 px-2 py-1 text-accent-cyan outline-none placeholder:text-accent-cyan/40"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type a command..."
                spellCheck={false}
              />
            </form>

            {filteredSuggestions.length > 0 && (
              <div className="mt-2 rounded border border-accent-cyan/25 bg-black/45 p-2">
                <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.15em] text-accent-cyan/65">suggestions</p>
                <div className="flex flex-wrap gap-1.5">
                  {filteredSuggestions.slice(0, 4).map((item) => (
                    <button
                      type="button"
                      key={item}
                      className="rounded border border-accent-cyan/30 bg-accent-cyan/10 px-2 py-0.5 font-mono text-[10px] text-accent-cyan/85"
                      onClick={() => setInput(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

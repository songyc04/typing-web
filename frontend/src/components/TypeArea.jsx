import { useState, useRef, useEffect, useMemo } from 'react'
import cSnippets from '@data/c.json'
import javaSnippets from '@data/java.json'
import pythonSnippets from '@data/python.json'
import cppSnippets from '@data/cpp.json'
import javascriptSnippets from '@data/javascript.json'
import typescriptSnippets from '@data/typescript.json'
import sqlSnippets from '@data/sql.json'

const SNIPPETS = {
  c: cSnippets,
  java: javaSnippets,
  python: pythonSnippets,
  cpp: cppSnippets,
  javascript: javascriptSnippets,
  typescript: typescriptSnippets,
  sql: sqlSnippets,
}

const buildKeyMap = () => {
  const map = {}
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i)
    map[`Key${letter}`] = letter.toLowerCase()
  }
  for (let i = 0; i < 10; i++) {
    map[`Digit${i}`] = String(i)
  }
  map.Space = ' '
  map.Minus = '-'
  map.Equal = '='
  map.BracketLeft = '['
  map.BracketRight = ']'
  map.Backslash = '\\'
  map.Semicolon = ';'
  map.Quote = "'"
  map.Comma = ','
  map.Period = '.'
  map.Slash = '/'
  map.Backquote = '`'
  return map
}

const buildShiftKeyMap = () => {
  const map = {}
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i)
    map[`Key${letter}`] = letter
  }
  const shiftNums = [')', '!', '@', '#', '$', '%', '^', '&', '*', '(']
  for (let i = 0; i < 10; i++) {
    map[`Digit${i}`] = shiftNums[i]
  }
  map.Minus = '_'
  map.Equal = '+'
  map.BracketLeft = '{'
  map.BracketRight = '}'
  map.Backslash = '|'
  map.Semicolon = ':'
  map.Quote = '"'
  map.Comma = '<'
  map.Period = '>'
  map.Slash = '?'
  map.Backquote = '~'
  return map
}

const KEY_MAP = buildKeyMap()
const SHIFT_KEY_MAP = buildShiftKeyMap()

const resolveChar = (e) => {
  const { code, shiftKey } = e
  const base = shiftKey ? SHIFT_KEY_MAP[code] : KEY_MAP[code]
  if (base === undefined) return null
  const capsLock = e.getModifierState?.('CapsLock')
  if (capsLock && /^[a-zA-Z]$/.test(base)) {
    return shiftKey ? base.toLowerCase() : base.toUpperCase()
  }
  return base
}

const TypeArea = ({ language }) => {
  const [typed, setTyped] = useState('')
  const inputRef = useRef(null)
  const lastKeyRef = useRef({ code: '', time: 0 })

  const snippet = useMemo(() => {
    const list = SNIPPETS[language]
    if (!list || list.length === 0) return undefined
    return list[Math.floor(Math.random() * list.length)]
  }, [language])

  useEffect(() => {
    setTyped('')
    inputRef.current?.focus()
  }, [language])

  if (!snippet) {
    return <div className="p-4">No snippet available.</div>
  }

  const target = snippet.code
  const targetLines = target.split('\n')

  const lineStartIndices = (() => {
    const indices = []
    let idx = 0
    for (const line of targetLines) {
      indices.push(idx)
      idx += line.length + 1
    }
    return indices
  })()

  const handleKeyDown = (e) => {
    const now = performance.now()
    if (lastKeyRef.current.code === e.code && now - lastKeyRef.current.time < 50) {
      return
    }
    lastKeyRef.current = { code: e.code, time: now }

    if (e.code === 'Backspace') {
      e.preventDefault()
      e.target.value = ''
      setTyped((prev) => prev.slice(0, -1))
      return
    }

    if (e.code === 'Enter') {
      e.preventDefault()
      e.target.value = ''
      setTyped((prev) => (prev.length >= target.length ? prev : prev + '\n'))
      return
    }

    if (e.code === 'Tab') {
      e.preventDefault()
      e.target.value = ''
      setTyped((prev) => (prev.length >= target.length ? prev : prev + '    '))
      return
    }

    const char = resolveChar(e)
    if (char !== null) {
      e.preventDefault()
      e.target.value = ''
      setTyped((prev) => (prev.length >= target.length ? prev : prev + char))
    }
  }

  const handleCompositionStart = (e) => {
    e.preventDefault()
  }

  return (
    <div className="p-4" onClick={() => inputRef.current?.focus()}>
      <h2 className="text-2xl font-bold mb-4">{snippet.title}</h2>
      <input
        ref={inputRef}
        type="text"
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        className="absolute opacity-0 pointer-events-none"
        autoFocus
        lang="en"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        style={{ imeMode: 'disabled' }}
      />
      <div className="font-ibm-plex-mono text-xs bg-gray-100 p-4 rounded">
        {targetLines.map((line, lineIdx) => {
          const startIdx = lineStartIndices[lineIdx]
          const cursorAtLineEnd =
            lineIdx < targetLines.length - 1 &&
            startIdx + line.length === typed.length
          return (
            <div key={lineIdx} className="flex">
              <span className="w-8 text-right pr-3 text-gray-500 select-none">
                {lineIdx + 1}
              </span>
              <span className="whitespace-pre relative">
                {line.split('').map((char, i) => {
                  const globalIdx = startIdx + i
                  let className = 'text-gray-400'
                  if (globalIdx < typed.length) {
                    className =
                      typed[globalIdx] === char
                        ? 'text-gray-900'
                        : 'text-red-500 bg-red-50'
                  }
                  return <span key={i} className={className}>{char}</span>
                })}
                {cursorAtLineEnd && (
                  <span className="bg-blue-300">&nbsp;</span>
                )}
                {(() => {
                  const cursorCol = typed.length - startIdx
                  if (cursorCol < 0 || cursorCol > line.length) return null
                  if (cursorAtLineEnd) return null
                  return (
                    <span
                      className="absolute top-0 bottom-0 w-0.5 bg-blue-500 pointer-events-none"
                      style={{ left: `${cursorCol}ch` }}
                    />
                  )
                })()}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TypeArea

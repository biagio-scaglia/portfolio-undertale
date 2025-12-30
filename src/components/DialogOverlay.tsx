import { useState, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { playCardClose } from '../utils/audioManager'
import { CARD_COLORS } from '../constants/gameConstants'

type Props = {
    title: string
    lines: string[]
    iconClass?: string
    onClose: () => void
    typewriterSpeed?: number
    skipText?: string
    closeText?: string
    cardId?: string
}

const DEFAULT_TYPEWRITER_SPEED = 20

export function DialogOverlay({ 
    title, 
    lines, 
    iconClass, 
    onClose,
    typewriterSpeed = DEFAULT_TYPEWRITER_SPEED,
    skipText = '[Z] or [X] to SKIP',
    closeText = '[Z] or [ESC] to CLOSE',
    cardId
}: Props) {
    const textColor = cardId && CARD_COLORS[cardId] ? CARD_COLORS[cardId] : '#ffffff'
    const [displayedLines, setDisplayedLines] = useState<string[]>([])
    const [currentLineIndex, setCurrentLineIndex] = useState(0)
    const [charIndex, setCharIndex] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const dialogRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if ((e.key.toLowerCase() === 'z' || e.key.toLowerCase() === 'x') && !isComplete) {
                e.preventDefault()
                setDisplayedLines(lines)
                setCurrentLineIndex(lines.length)
                setCharIndex(0)
                setIsComplete(true)
                return
            }
            
            if ((e.key === 'Escape' || e.key.toLowerCase() === 'z') && isComplete) {
                e.preventDefault()
                playCardClose()
                onClose()
            }
        }
        window.addEventListener('keydown', handleKey)
        
        if (dialogRef.current) {
            dialogRef.current.focus()
        }
        
        return () => window.removeEventListener('keydown', handleKey)
    }, [onClose, isComplete, lines])

    useEffect(() => {
        if (currentLineIndex >= lines.length) {
            setIsComplete(true)
            return
        }

        const timer = setTimeout(() => {
            setDisplayedLines(prev => {
                const newLines = [...prev]
                if (!newLines[currentLineIndex]) {
                    newLines[currentLineIndex] = ''
                }

                const targetLine = lines[currentLineIndex]
                newLines[currentLineIndex] = targetLine.substring(0, charIndex + 1)
                return newLines
            })

            if (charIndex + 1 < lines[currentLineIndex].length) {
                setCharIndex(c => c + 1)
            } else {
                setCurrentLineIndex(i => i + 1)
                setCharIndex(0)
            }
        }, typewriterSpeed)

        return () => clearTimeout(timer)
    }, [charIndex, currentLineIndex, lines, typewriterSpeed])

    useEffect(() => {
        setDisplayedLines([])
        setCurrentLineIndex(0)
        setCharIndex(0)
        setIsComplete(false)
    }, [lines])

    const renderLine = (text: string): ReactNode => {
        if (!text) return ''
        
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|github\.com\/[^\s]+|linkedin\.com\/[^\s]+|instagram\.com\/[^\s]+|[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
        const parts: string[] = []
        const matches: Array<{ text: string; index: number }> = []
        let lastIndex = 0
        let match

        while ((match = urlRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index))
            }
            matches.push({ text: match[0], index: parts.length })
            parts.push(match[0])
            lastIndex = match.index + match[0].length
        }

        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex))
        }

        if (matches.length === 0) {
            return text
        }

        return parts.map((part, i) => {
            const isLink = matches.some(m => m.text === part && m.index === i)
            if (isLink) {
                const href = part.includes('@') 
                    ? `mailto:${part}` 
                    : part.startsWith('http') 
                        ? part 
                        : `https://${part}`
                return (
                    <a
                        key={i}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dialog-link"
                    >
                        {part}
                    </a>
                )
            }
            return <span key={i}>{part}</span>
        })
    }

    return (
        <div 
            className="dialog-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    playCardClose()
                    onClose()
                }
            }}
        >
            <div 
                className="dialog-box"
                ref={dialogRef}
                tabIndex={-1}
            >
                <div className="dialog-title">
                    {iconClass && <i className={iconClass}></i>}
                    {title}
                </div>
                <div className="dialog-content">
                    {displayedLines.map((line, i) => (
                        <div key={i} className="dialog-line" style={{ color: textColor }}>
                            {renderLine(line)}
                        </div>
                    ))}
                    {!isComplete && <span className="dialog-cursor">█</span>}
                </div>
                <div className="dialog-footer">
                    {!isComplete ? skipText : closeText}
                </div>
            </div>
        </div>
    )
}


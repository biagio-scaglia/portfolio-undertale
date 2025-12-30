import { useState, useEffect, useRef } from 'react'
import { playMenuSelect, playMenuConfirm } from '../utils/audioManager'

type Props = {
    title: string
    lines: string[]
    iconClass?: string
    options: string[]
    onSelect: (choice: number) => void
    onClose?: () => void
    soundFile?: string
    skipText?: string
    selectText?: string
    confirmText?: string
}

export function ChoiceDialog({ 
    title, 
    lines, 
    iconClass, 
    options,
    onSelect,
    onClose,
    soundFile,
    skipText = '[Z] or [X] to SKIP',
    selectText = '[↑↓] SELECT',
    confirmText = '[Z] CONFIRM'
}: Props) {
    const [selected, setSelected] = useState(0)
    const [displayedLines, setDisplayedLines] = useState<string[]>([])
    const [currentLineIndex, setCurrentLineIndex] = useState(0)
    const [charIndex, setCharIndex] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const dialogRef = useRef<HTMLDivElement>(null)
    const soundRef = useRef<HTMLAudioElement | null>(null)

    // Play sound if provided
    useEffect(() => {
        if (soundFile && !soundRef.current) {
            const audio = new Audio(soundFile)
            audio.volume = 0.5
            audio.play().catch(err => {
                console.debug('Audio play prevented:', err)
            })
            soundRef.current = audio
        }
        return () => {
            if (soundRef.current) {
                soundRef.current.pause()
                soundRef.current = null
            }
        }
    }, [soundFile])

    // Keyboard handling
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            // Instant-complete typewriter on Z or X
            if ((e.key.toLowerCase() === 'z' || e.key.toLowerCase() === 'x') && !isComplete) {
                e.preventDefault()
                setDisplayedLines(lines)
                setCurrentLineIndex(lines.length)
                setCharIndex(0)
                setIsComplete(true)
                return
            }
            
            if (!isComplete) return // Wait for text to complete
            
            if (e.key === 'ArrowUp') {
                setSelected(prev => {
                    const newSelected = prev > 0 ? prev - 1 : options.length - 1
                    playMenuSelect()
                    return newSelected
                })
            }
            if (e.key === 'ArrowDown') {
                setSelected(prev => {
                    const newSelected = prev < options.length - 1 ? prev + 1 : 0
                    playMenuSelect()
                    return newSelected
                })
            }
            if (e.key === 'Enter' || e.key.toLowerCase() === 'z') {
                playMenuConfirm()
                onSelect(selected)
            }
            if (e.key === 'Escape' && onClose) {
                onClose()
            }
        }
        window.addEventListener('keydown', handleKey)
        
        if (dialogRef.current) {
            dialogRef.current.focus()
        }
        
        return () => window.removeEventListener('keydown', handleKey)
    }, [selected, options.length, isComplete, onSelect, onClose, lines])

    // Typewriter effect
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
        }, 20) // Consistent typewriter speed (20ms per character)

        return () => clearTimeout(timer)
    }, [charIndex, currentLineIndex, lines])

    // Reset when lines change
    useEffect(() => {
        setDisplayedLines([])
        setCurrentLineIndex(0)
        setCharIndex(0)
        setIsComplete(false)
        setSelected(0)
    }, [lines])

    return (
        <div 
            className="dialog-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget && onClose) {
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
                        <div key={i} className="dialog-line">
                            {line}
                        </div>
                    ))}
                    {!isComplete && <span className="dialog-cursor">█</span>}
                </div>
                {isComplete && (
                    <div className="dialog-choices">
                        {options.map((opt, i) => (
                            <div
                                key={i}
                                className={`dialog-choice ${selected === i ? 'selected' : ''}`}
                                onClick={() => {
                                    playMenuConfirm()
                                    onSelect(i)
                                }}
                                onMouseEnter={() => {
                                    if (selected !== i) {
                                        setSelected(i)
                                        playMenuSelect()
                                    }
                                }}
                            >
                                {selected === i ? '▶ ' : '  '}
                                {opt}
                            </div>
                        ))}
                    </div>
                )}
                <div className="dialog-footer">
                    {!isComplete ? skipText : `${selectText}  ${confirmText}`}
                </div>
            </div>
        </div>
    )
}


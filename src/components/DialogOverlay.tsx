import { useState, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { playCardClose } from '../utils/audioManager'

type Props = {
    title: string
    lines: string[]
    iconClass?: string
    onClose: () => void
    typewriterSpeed?: number // milliseconds per character
    skipText?: string
    closeText?: string
    cardId?: string // For color theming
}

// Typewriter effect: 20ms per character for consistent pacing
const DEFAULT_TYPEWRITER_SPEED = 20

// Card text colors - matching Explore.tsx, optimized for readability
const CARD_COLORS: Record<string, string> = {
    profile: '#ffd93d',      // Warm golden yellow (personal, inviting)
    experience: '#6bcfd4',    // Soft cyan (professional, calm)
    skills: '#a8d8ea',        // Sky blue (growth, clarity)
    projects: '#ff9a9e',      // Soft coral (creativity, warmth)
    education: '#c7a8e8',     // Soft purple (knowledge, wisdom)
    contact: '#a8e6cf'        // Mint green (friendly, fresh)
}

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
                    {displayedLines.map((line, i) => {
                        let lineColor = textColor
                        
                        if (cardId) {
                            if (cardId === 'skills') {
                                if (line.includes('Programming Languages:') || line.includes('Linguaggi di Programmazione:') || line.includes('Lenguajes de Programación:')) {
                                    lineColor = '#6bcfd4'
                                } else if (line.includes('Framework') || line.includes('Tecnologie:') || line.includes('Tecnologías:')) {
                                    lineColor = '#ff9a9e'
                                } else if (line.includes('Database:') || line.includes('Database') || line.includes('Base de Datos:')) {
                                    lineColor = '#a8d8ea'
                                } else if (line.includes('Other:') || line.includes('Altro:') || line.includes('Otros:')) {
                                    lineColor = '#a8e6cf'
                                } else if (line.trim() && !line.includes(':')) {
                                    lineColor = textColor
                                }
                            } else if (cardId === 'projects') {
                                const projectIndicators = ['Ruby Pulse', 'Monster Hunter', 'Nintendo AI', 'Game Price', 'Japan Atlas']
                                const isProjectStart = projectIndicators.some(indicator => line.includes(indicator))
                                const projectIndex = projectIndicators.findIndex(indicator => line.includes(indicator))
                                
                                if (isProjectStart) {
                                    const projectColors = ['#ffd93d', '#6bcfd4', '#ff9a9e', '#a8d8ea', '#a8e6cf']
                                    lineColor = projectColors[projectIndex] || textColor
                                } else if (line.includes('Tech:') || line.includes('GitHub:')) {
                                    lineColor = textColor
                                } else if (line.trim() && !line.includes('–') && !line.includes('-')) {
                                    let nearestProjectIndex = -1
                                    for (let j = i - 1; j >= 0; j--) {
                                        const checkIndex = projectIndicators.findIndex(indicator => displayedLines[j]?.includes(indicator))
                                        if (checkIndex !== -1) {
                                            nearestProjectIndex = checkIndex
                                            break
                                        }
                                    }
                                    if (nearestProjectIndex !== -1) {
                                        const projectColors = ['#ffd93d', '#6bcfd4', '#ff9a9e', '#a8d8ea', '#a8e6cf']
                                        lineColor = projectColors[nearestProjectIndex] || textColor
                                    }
                                }
                            } else if (cardId === 'experience') {
                                const companies = ['Yumeverse Games', 'sgamapp']
                                const isCompanyStart = companies.some(company => line.includes(company))
                                const companyIndex = companies.findIndex(company => line.includes(company))
                                
                                if (isCompanyStart) {
                                    const companyColors = ['#6bcfd4', '#ff9a9e']
                                    lineColor = companyColors[companyIndex] || textColor
                                } else if (line.includes('·') && line.includes('Developer')) {
                                    let nearestCompanyIndex = -1
                                    for (let j = i - 1; j >= 0; j--) {
                                        const checkIndex = companies.findIndex(company => displayedLines[j]?.includes(company))
                                        if (checkIndex !== -1) {
                                            nearestCompanyIndex = checkIndex
                                            break
                                        }
                                    }
                                    if (nearestCompanyIndex !== -1) {
                                        const companyColors = ['#6bcfd4', '#ff9a9e']
                                        lineColor = companyColors[nearestCompanyIndex] || textColor
                                    }
                                } else if (line.trim() && !line.includes('·')) {
                                    let nearestCompanyIndex = -1
                                    for (let j = i - 1; j >= 0; j--) {
                                        const checkIndex = companies.findIndex(company => displayedLines[j]?.includes(company))
                                        if (checkIndex !== -1) {
                                            nearestCompanyIndex = checkIndex
                                            break
                                        }
                                    }
                                    if (nearestCompanyIndex !== -1) {
                                        const companyColors = ['#6bcfd4', '#ff9a9e']
                                        lineColor = companyColors[nearestCompanyIndex] || textColor
                                    }
                                }
                            } else if (cardId === 'profile') {
                                if (line.includes('Biagio Scaglia')) {
                                    lineColor = '#ffd93d'
                                } else if (line.includes('Developer') || line.includes('Product-Oriented')) {
                                    lineColor = '#6bcfd4'
                                } else {
                                    lineColor = textColor
                                }
                            } else if (cardId === 'education') {
                                if (line.includes('ITS Apulia') || line.includes('ITC Tommaso')) {
                                    lineColor = '#c7a8e8'
                                } else if (line.includes('Web Developer') || line.includes('Sistemi Informativi') || line.includes('Business Information') || line.includes('Sistemas de Información')) {
                                    lineColor = '#b894e3'
                                } else {
                                    lineColor = textColor
                                }
                            }
                        }
                        
                        return (
                            <div key={i} className="dialog-line" style={{ color: lineColor }}>
                                {renderLine(line)}
                            </div>
                        )
                    })}
                    {!isComplete && <span className="dialog-cursor">█</span>}
                </div>
                <div className="dialog-footer">
                    {!isComplete ? skipText : closeText}
                </div>
            </div>
        </div>
    )
}


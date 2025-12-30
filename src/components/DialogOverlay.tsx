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
    // Get card color or default to white
    const textColor = cardId && CARD_COLORS[cardId] ? CARD_COLORS[cardId] : '#ffffff'
    const [displayedLines, setDisplayedLines] = useState<string[]>([])
    const [currentLineIndex, setCurrentLineIndex] = useState(0)
    const [charIndex, setCharIndex] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const dialogRef = useRef<HTMLDivElement>(null)

    // Keyboard handling: ESC or Z to close, Z/X to skip typewriter
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            // Instant-complete typewriter on Z or X
            if ((e.key.toLowerCase() === 'z' || e.key.toLowerCase() === 'x') && !isComplete) {
                e.preventDefault()
                // Complete all remaining text instantly
                setDisplayedLines(lines)
                setCurrentLineIndex(lines.length)
                setCharIndex(0)
                setIsComplete(true)
                return
            }
            
            // Close dialog when complete
            if ((e.key === 'Escape' || e.key.toLowerCase() === 'z') && isComplete) {
                e.preventDefault()
                playCardClose()
                onClose()
            }
        }
        window.addEventListener('keydown', handleKey)
        
        // Focus the dialog for accessibility
        if (dialogRef.current) {
            dialogRef.current.focus()
        }
        
        return () => window.removeEventListener('keydown', handleKey)
    }, [onClose, isComplete, lines])

    // Typewriter effect: character by character, line by line
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
                // Move to next line
                setCurrentLineIndex(i => i + 1)
                setCharIndex(0)
            }
        }, typewriterSpeed)

        return () => clearTimeout(timer)
    }, [charIndex, currentLineIndex, lines, typewriterSpeed])

    // Reset when lines change
    useEffect(() => {
        setDisplayedLines([])
        setCurrentLineIndex(0)
        setCharIndex(0)
        setIsComplete(false)
    }, [lines])

    // Helper to detect and render links, emails, and URLs
    const renderLine = (text: string): ReactNode => {
        if (!text) return ''
        
        // Match URLs, emails, and GitHub/LinkedIn patterns
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|github\.com\/[^\s]+|linkedin\.com\/[^\s]+|instagram\.com\/[^\s]+|[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
        const parts: string[] = []
        const matches: Array<{ text: string; index: number }> = []
        let lastIndex = 0
        let match

        // Find all matches with their positions
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

        // Render parts with links
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
                // Close on overlay click (but not on dialog box click)
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
                        // Determine color for each line based on content and card type
                        let lineColor = textColor
                        
                        if (cardId) {
                            if (cardId === 'skills') {
                                // Skills: different colors for different sections - softer, more readable
                                if (line.includes('Programming Languages:') || line.includes('Linguaggi di Programmazione:') || line.includes('Lenguajes de Programación:')) {
                                    lineColor = '#6bcfd4' // Soft cyan for section headers
                                } else if (line.includes('Framework') || line.includes('Tecnologie:') || line.includes('Tecnologías:')) {
                                    lineColor = '#ff9a9e' // Soft coral for frameworks
                                } else if (line.includes('Database:') || line.includes('Database') || line.includes('Base de Datos:')) {
                                    lineColor = '#a8d8ea' // Sky blue for databases
                                } else if (line.includes('Other:') || line.includes('Altro:') || line.includes('Otros:')) {
                                    lineColor = '#a8e6cf' // Mint for other
                                } else if (line.trim() && !line.includes(':')) {
                                    // Content lines use the card color
                                    lineColor = textColor
                                }
                            } else if (cardId === 'projects') {
                                // Projects: alternate colors for each project - softer palette
                                const projectIndicators = ['Ruby Pulse', 'Monster Hunter', 'Nintendo AI', 'Game Price', 'Japan Atlas']
                                const isProjectStart = projectIndicators.some(indicator => line.includes(indicator))
                                const projectIndex = projectIndicators.findIndex(indicator => line.includes(indicator))
                                
                                if (isProjectStart) {
                                    // Each project gets a different color - softer, more readable
                                    const projectColors = ['#ffd93d', '#6bcfd4', '#ff9a9e', '#a8d8ea', '#a8e6cf']
                                    lineColor = projectColors[projectIndex] || textColor
                                } else if (line.includes('Tech:') || line.includes('GitHub:')) {
                                    // Tech and GitHub lines use a lighter variant
                                    lineColor = textColor
                                } else if (line.trim() && !line.includes('–') && !line.includes('-')) {
                                    // Project description lines - use same color as project start
                                    // Find the nearest project start above this line
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
                                // Experience: different color for each company - softer tones
                                const companies = ['Yumeverse Games', 'sgamapp']
                                const isCompanyStart = companies.some(company => line.includes(company))
                                const companyIndex = companies.findIndex(company => line.includes(company))
                                
                                if (isCompanyStart) {
                                    const companyColors = ['#6bcfd4', '#ff9a9e'] // Soft cyan and coral
                                    lineColor = companyColors[companyIndex] || textColor
                                } else if (line.includes('·') && line.includes('Developer')) {
                                    // Role line - use company color
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
                                    // Description lines - use same color as company
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
                                // Profile: name in golden yellow, title in soft cyan, description in card color
                                if (line.includes('Biagio Scaglia')) {
                                    lineColor = '#ffd93d' // Warm golden yellow for name
                                } else if (line.includes('Developer') || line.includes('Product-Oriented')) {
                                    lineColor = '#6bcfd4' // Soft cyan for title/subtitle
                                } else {
                                    lineColor = textColor // Card color for description
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


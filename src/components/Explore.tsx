import { useEffect, useRef, useState } from 'react'
import { DialogOverlay } from './DialogOverlay'
import { ChoiceDialog } from './ChoiceDialog'
import { AudioControl } from './AudioControl'
import { SaveButton } from './SaveButton'
import { CharacterButton } from './CharacterButton'
import { getCardPreviewLines, getDialogContent, type CardData, type Language } from '../data/portfolioData'
import { portfolioTranslations } from '../data/portfolioTranslations'
import { getTranslations } from '../utils/i18n'
import { playCardOpen } from '../utils/audioManager'
import { loadGame, type SaveData } from '../utils/saveSystem'
import { audioManager } from '../utils/audioManager'

const PLAYER_SPEED = 2
const PLAYER_WIDTH = 32
const PLAYER_HEIGHT = 48
const CARD_WIDTH = 350
const CARD_HEIGHT = 220
const CARD_SPACING = 50
const CARD_COLLISION_PADDING = 10
const NPC_INTERACTION_DISTANCE = 100
const NPC_COLLISION_PADDING = 20
const ANIMATION_FRAME_RATE = 20
const SANS_ANIMATION_FRAMES = 4
const SCROLL_THROTTLE_MS = 16
const SCROLL_THRESHOLD = 5
const SCROLL_SMOOTHING = 0.3
const COLOR_ACTIVE = '#f7d51d'
const COLOR_INACTIVE = '#ffffff'
const COLOR_TEXT = '#ffffff'

const CARD_COLORS: Record<string, string> = {
    profile: '#ffd93d',
    experience: '#6bcfd4',
    skills: '#a8d8ea',
    projects: '#ff9a9e',
    education: '#c7a8e8',
    contact: '#a8e6cf'
}

function calculateCardPositions(canvasWidth: number, _canvasHeight: number, language: Language): CardData[] {
    const portfolioData = portfolioTranslations[language]
    const t = getTranslations(language)
    const cardsPerRow = 2
    const totalWidth = cardsPerRow * CARD_WIDTH + (cardsPerRow - 1) * CARD_SPACING
    const startX = (canvasWidth - totalWidth) / 2
    // Add space for title (80px for title + 40px spacing)
    const TITLE_HEIGHT = 80
    const TITLE_SPACING = 40
    const startY = TITLE_HEIGHT + TITLE_SPACING
    const cards: CardData[] = []
    cards.push({
        id: 'profile',
        x: startX,
        y: startY,
        w: CARD_WIDTH,
        h: CARD_HEIGHT,
        title: t.cards.profile,
        lines: getCardPreviewLines(portfolioData, 'profile', t.labels, t.cardSummaries.profile),
        iconClass: 'fa-solid fa-user'
    })
    cards.push({
        id: 'experience',
        x: startX + CARD_WIDTH + CARD_SPACING,
        y: startY,
        w: CARD_WIDTH,
        h: CARD_HEIGHT - 20,
        title: t.cards.experience,
        lines: getCardPreviewLines(portfolioData, 'experience', t.labels, t.cardSummaries.experience),
        iconClass: 'fa-solid fa-briefcase'
    })
    cards.push({
        id: 'skills',
        x: startX,
        y: startY + CARD_HEIGHT + CARD_SPACING,
        w: CARD_WIDTH,
        h: CARD_HEIGHT - 20,
        title: t.cards.skills,
        lines: getCardPreviewLines(portfolioData, 'skills', t.labels, t.cardSummaries.skills),
        iconClass: 'fa-solid fa-code'
    })
    cards.push({
        id: 'projects',
        x: startX + CARD_WIDTH + CARD_SPACING,
        y: startY + CARD_HEIGHT + CARD_SPACING,
        w: CARD_WIDTH,
        h: CARD_HEIGHT,
        title: t.cards.projects,
        lines: getCardPreviewLines(portfolioData, 'projects', t.labels, t.cardSummaries.projects),
        iconClass: 'fa-solid fa-rocket'
    })
    cards.push({
        id: 'education',
        x: startX,
        y: startY + (CARD_HEIGHT + CARD_SPACING) * 2,
        w: CARD_WIDTH,
        h: CARD_HEIGHT - 20,
        title: t.cards.education,
        lines: getCardPreviewLines(portfolioData, 'education', t.labels, t.cardSummaries.education),
        iconClass: 'fa-solid fa-graduation-cap'
    })
    cards.push({
        id: 'contact',
        x: startX + CARD_WIDTH + CARD_SPACING,
        y: startY + (CARD_HEIGHT + CARD_SPACING) * 2,
        w: CARD_WIDTH,
        h: CARD_HEIGHT - 40,
        title: t.cards.contact,
        lines: getCardPreviewLines(portfolioData, 'contact', t.labels, t.cardSummaries.contact),
        iconClass: 'fa-solid fa-envelope'
    })
    
    return cards
}

type CharacterType = 'frisk' | 'sans'

type Props = {
    language: Language
}

export function Explore({ language }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const cardsRef = useRef<CardData[]>([])
    const playerImgRef = useRef<HTMLImageElement>(null)
    const sansNPCImgRef = useRef<HTMLImageElement>(null)

    const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
    const [playerPos, setPlayerPos] = useState<{ x: number; y: number; dir: string; frame: number } | null>(null)
    const [sansNPCPos, setSansNPCPos] = useState<{ x: number; y: number; dir: string; frame: number } | null>(null)
    const [currentCharacter, setCurrentCharacter] = useState<CharacterType>('frisk')
    const [showSansDialog, setShowSansDialog] = useState(false)
    const [showSaveConfirmDialog, setShowSaveConfirmDialog] = useState(false)
    const [showLoadDialog, setShowLoadDialog] = useState(false)
    const [visitedCards, setVisitedCards] = useState<string[]>([])

    const selectedCardIdRef = useRef<string | null>(null)
    const currentCharacterRef = useRef<CharacterType>('frisk')
    const showSansDialogRef = useRef(false)
    const visitedCardsRef = useRef<string[]>([])
    const playerPositionRef = useRef<{ x: number; y: number } | null>(null)

    useEffect(() => {
        selectedCardIdRef.current = selectedCardId
        currentCharacterRef.current = currentCharacter
        showSansDialogRef.current = showSansDialog
        visitedCardsRef.current = visitedCards
    }, [selectedCardId, currentCharacter, showSansDialog, visitedCards])
    
    useEffect(() => {
        if (selectedCardId) {
            setVisitedCards(prev => {
                if (!prev.includes(selectedCardId!)) {
                    return [...prev, selectedCardId]
                }
                return prev
            })
        }
    }, [selectedCardId])
    
    // Load game state on mount
    const savedGameRef = useRef<SaveData | null>(null)
    useEffect(() => {
        const saved = loadGame()
        if (saved) {
            savedGameRef.current = saved
            setCurrentCharacter(saved.currentCharacter)
            setVisitedCards(saved.visitedCards || [])
            audioManager.setEnabled(saved.audioEnabled !== false)
            setShowLoadDialog(true)
            setTimeout(() => {
                setShowLoadDialog(false)
            }, 2000)
        }
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = window.innerWidth
        // Add space for title at the top
        const TITLE_HEIGHT = 80
        const TITLE_SPACING = 40
        const minHeight = TITLE_HEIGHT + TITLE_SPACING + (CARD_HEIGHT + CARD_SPACING) * 3 + CARD_SPACING
        canvas.height = Math.max(window.innerHeight, minHeight)
        ctx.imageSmoothingEnabled = false
        
        cardsRef.current = calculateCardPositions(canvas.width, canvas.height, language)
        const CARDS = cardsRef.current
        const t = getTranslations(language)

        const contactCard = CARDS.find(c => c.id === 'contact')
        // Spawn player position
        const spawnX = contactCard ? contactCard.x + contactCard.w + CARD_SPACING : canvas.width / 2 + 200
        const spawnY = contactCard ? contactCard.y + (contactCard.h / 2) - PLAYER_HEIGHT / 2 : canvas.height / 2 - PLAYER_HEIGHT / 2
        
        // Handle window resize
        const handleResize = () => {
            if (!canvas) return
            const oldWidth = canvas.width
            const oldHeight = canvas.height
            
            canvas.width = window.innerWidth
            const TITLE_HEIGHT = 80
            const TITLE_SPACING = 40
            const newMinHeight = TITLE_HEIGHT + TITLE_SPACING + (CARD_HEIGHT + CARD_SPACING) * 3 + CARD_SPACING
            canvas.height = Math.max(window.innerHeight, newMinHeight)
            
            // Recalculate card positions
            cardsRef.current = calculateCardPositions(canvas.width, canvas.height, language)
            
            // Scale player position proportionally if needed
            if (playerPos) {
                const scaleX = canvas.width / oldWidth
                const scaleY = canvas.height / oldHeight
                setPlayerPos({
                    ...playerPos,
                    x: Math.min(playerPos.x * scaleX, canvas.width - PLAYER_WIDTH),
                    y: Math.min(playerPos.y * scaleY, canvas.height - PLAYER_HEIGHT)
                })
            }
            
            // Scale Sans NPC position proportionally if needed
            if (sansNPCPos) {
                const scaleX = canvas.width / oldWidth
                const scaleY = canvas.height / oldHeight
                setSansNPCPos({
                    ...sansNPCPos,
                    x: Math.min(sansNPCPos.x * scaleX, canvas.width - PLAYER_WIDTH),
                    y: Math.min(sansNPCPos.y * scaleY, canvas.height - PLAYER_HEIGHT)
                })
            }
        }
        
        window.addEventListener('resize', handleResize)

        // Use saved position if available, otherwise use spawn position
        const saved = savedGameRef.current
        const initialX = saved ? saved.playerX : spawnX
        const initialY = saved ? saved.playerY : spawnY
        
        // Set character from saved game
        if (saved) {
            currentCharacterRef.current = saved.currentCharacter
        }

        const player = {
            x: initialX,
            y: initialY,
            w: PLAYER_WIDTH,
            h: PLAYER_HEIGHT,
            dir: 'avanti',
            frame: 0,
            animationFrame: 0
        }
        
        playerPositionRef.current = { x: player.x, y: player.y }

        // NPC positions: if loading from save, NPC should be at saved player position
        // Otherwise, NPC is at spawn position
        const npcX = saved ? initialX : spawnX
        const npcY = saved ? initialY : spawnY
        
        const sansNPCBaseX = npcX
        const sansNPCBaseY = npcY
        const sansNPC = {
            x: sansNPCBaseX,
            y: sansNPCBaseY,
            w: PLAYER_WIDTH,
            h: PLAYER_HEIGHT,
            dir: 'avanti',
            frame: 0,
            animationFrame: 0
        }
        
        // If loading from save, set NPC positions based on current character
        if (saved) {
            if (saved.currentCharacter === 'sans') {
                // Player is Sans, so Sans NPC should be at spawn
                sansNPC.x = spawnX
                sansNPC.y = spawnY
            } else {
                // Player is Frisk, so Sans NPC should be at spawn position
                sansNPC.x = spawnX
                sansNPC.y = spawnY
            }
        } else {
            // Initial setup: Frisk is player, Sans is NPC at spawn
            sansNPC.x = spawnX
            sansNPC.y = spawnY
        }
        
        // Initialize NPC positions for img rendering (player appears only when moving)
        setSansNPCPos({
            x: sansNPC.x,
            y: sansNPC.y,
            dir: sansNPC.dir,
            frame: sansNPC.frame
        })

        const friskSprites: Record<string, HTMLImageElement> = {
            avanti: new Image(),
            dietro: new Image(),
            sinistra: new Image(),
            destra: new Image(),
            corsa: new Image()
        }
        friskSprites.avanti.src = '/assets/sprites/frisk/avanti.png'
        friskSprites.dietro.src = '/assets/sprites/frisk/dietro.png'
        friskSprites.sinistra.src = '/assets/sprites/frisk/sinistra.png'
        friskSprites.destra.src = '/assets/sprites/frisk/destra.png'
        friskSprites.corsa.src = '/assets/sprites/frisk/corsa.gif'

        const sansSprites: Record<string, HTMLImageElement[]> = {
            avanti: [],
            dietro: [],
            sinistra: [],
            destra: []
        }
        const sansDirections = ['avanti', 'dietro', 'sinistra', 'destra']
        sansDirections.forEach(dir => {
            for (let i = 1; i <= 4; i++) {
                const img = new Image()
                img.src = `/assets/sprites/sans/sans-${dir}-${i}.png`
                sansSprites[dir].push(img)
            }
        })

        // Save point now uses HTML img element for GIF animation

        const keys: Record<string, boolean> = {}
        
        const handleKeyDown = (e: KeyboardEvent) => {
            keys[e.key] = true
            if ((e.key.toLowerCase() === 'z' || e.key === 'Enter') && !selectedCardIdRef.current && !showSansDialogRef.current) {
                checkCollisions()
                
                if (currentCharacterRef.current === 'frisk' && activeSansCollisionRef.current) {
                    e.preventDefault()
                    window.dispatchEvent(new CustomEvent('interact-sans'))
                    return
                }
                if (activeCollisionRef.current) {
                    e.preventDefault()
                    playCardOpen()
                    window.dispatchEvent(new CustomEvent('open-card', { detail: activeCollisionRef.current }))
                }
            }
        }
        const handleKeyUp = (e: KeyboardEvent) => { keys[e.key] = false }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        const handleCharacterSwitch = (e: any) => {
            const newCharacter = e.detail.newCharacter
            // Only swap positions if this is a manual switch, not on load
            // On load, positions are already set correctly
            if (!saved) {
                if (newCharacter === 'frisk') {
                    // Player becomes Frisk, keep player position, move Sans to spawn position
                    sansNPC.x = spawnX
                    sansNPC.y = spawnY
                }
            } else {
                // On load, positions are already set correctly
                if (newCharacter === 'frisk') {
                    sansNPC.x = spawnX
                    sansNPC.y = spawnY
                }
            }
        }
        window.addEventListener('character-switch', handleCharacterSwitch)

        const handleInteractSans = () => {
            if (currentCharacterRef.current === 'frisk') {
                setShowSansDialog(true)
            }
        }
        window.addEventListener('interact-sans', handleInteractSans)

        let animationId: number
        const activeCollisionRef = { current: null as string | null }
        const activeSansCollisionRef = { current: false }

        function checkCollisions() {
            activeCollisionRef.current = null
            activeSansCollisionRef.current = false
            
            for (const card of CARDS) {
                if (
                    player.x < card.x + card.w + CARD_COLLISION_PADDING &&
                    player.x + player.w > card.x - CARD_COLLISION_PADDING &&
                    player.y < card.y + card.h + CARD_COLLISION_PADDING &&
                    player.y + player.h > card.y - CARD_COLLISION_PADDING
                ) {
                    activeCollisionRef.current = card.id
                    break
                }
            }
            
            if (currentCharacterRef.current === 'frisk') {
                const playerCenterX = player.x + player.w / 2
                const playerCenterY = player.y + player.h / 2
                const sansCenterX = sansNPC.x + sansNPC.w / 2
                const sansCenterY = sansNPC.y + sansNPC.h / 2
                const distance = Math.sqrt(
                    Math.pow(playerCenterX - sansCenterX, 2) + 
                    Math.pow(playerCenterY - sansCenterY, 2)
                )
                if (distance < NPC_INTERACTION_DISTANCE) {
                    activeSansCollisionRef.current = true
                }
            }
            
        }

        function update() {
            if (!canvas) return

            if (selectedCardIdRef.current) {
                return
            }

            if (currentCharacterRef.current === 'sans') {
                player.animationFrame++
                if (player.animationFrame >= ANIMATION_FRAME_RATE) {
                    player.frame = (player.frame + 1) % SANS_ANIMATION_FRAMES
                    player.animationFrame = 0
                }
            }
            
            sansNPC.animationFrame++
            if (sansNPC.animationFrame >= ANIMATION_FRAME_RATE) {
                sansNPC.frame = (sansNPC.frame + 1) % SANS_ANIMATION_FRAMES
                sansNPC.animationFrame = 0
            }

            if (keys['ArrowUp']) {
                player.y -= PLAYER_SPEED
                player.dir = 'dietro'
            }
            if (keys['ArrowDown']) {
                player.y += PLAYER_SPEED
                player.dir = 'avanti'
            }
            if (keys['ArrowLeft']) {
                player.x -= PLAYER_SPEED
                player.dir = 'sinistra'
            }
            if (keys['ArrowRight']) {
                player.x += PLAYER_SPEED
                player.dir = 'destra'
            }

            // Keep player within canvas bounds
            player.x = Math.max(0, Math.min(player.x, canvas.width - player.w))
            player.y = Math.max(0, Math.min(player.y, canvas.height - player.h))

            playerPositionRef.current = { x: player.x, y: player.y }
            
            // Check if player is moving
            const isMoving = keys['ArrowUp'] || keys['ArrowDown'] || keys['ArrowLeft'] || keys['ArrowRight']
            
            // Update player position state for img rendering only when moving
            if (isMoving) {
                setPlayerPos({
                    x: player.x,
                    y: player.y,
                    dir: player.dir,
                    frame: player.frame
                })
            }
            
            // Update NPC positions
            setSansNPCPos({
                x: sansNPC.x,
                y: sansNPC.y,
                dir: sansNPC.dir,
                frame: sansNPC.frame
            })
            
            checkCollisions()
            
            if (isMoving) {
                scrollToFollowPlayer(player, canvas)
            }
        }
        
        let lastScrollTime = 0
        
        function scrollToFollowPlayer(player: { x: number; y: number; w: number; h: number }, canvas: HTMLCanvasElement) {
            const now = Date.now()
            if (now - lastScrollTime < SCROLL_THROTTLE_MS) {
                return
            }
            lastScrollTime = now
            
            const viewportHeight = window.innerHeight
            const viewportWidth = window.innerWidth
            const canvasRect = canvas.getBoundingClientRect()
            const playerCanvasY = player.y + player.h / 2
            const playerCanvasX = player.x + player.w / 2
            const playerAbsoluteY = canvasRect.top + playerCanvasY
            const playerAbsoluteX = canvasRect.left + playerCanvasX
            const viewportCenterY = window.scrollY + viewportHeight / 2
            const viewportCenterX = window.scrollX + viewportWidth / 2
            const scrollDeltaY = playerAbsoluteY - viewportCenterY
            const scrollDeltaX = playerAbsoluteX - viewportCenterX
            
            if (Math.abs(scrollDeltaY) < SCROLL_THRESHOLD && Math.abs(scrollDeltaX) < SCROLL_THRESHOLD) {
                return
            }
            
            const newScrollY = window.scrollY + scrollDeltaY * SCROLL_SMOOTHING
            const newScrollX = window.scrollX + scrollDeltaX * SCROLL_SMOOTHING
            const maxScrollY = Math.max(0, document.documentElement.scrollHeight - viewportHeight)
            const maxScrollX = Math.max(0, document.documentElement.scrollWidth - viewportWidth)
            
            window.scrollTo({
                top: Math.max(0, Math.min(newScrollY, maxScrollY)),
                left: Math.max(0, Math.min(newScrollX, maxScrollX)),
                behavior: 'auto'
            })
        }

        function drawCard(card: CardData) {
            if (!ctx) return
            const isActive = card.id === activeCollisionRef.current

            ctx.fillStyle = 'black'
            ctx.fillRect(card.x, card.y, card.w, card.h)
            ctx.strokeStyle = isActive ? COLOR_ACTIVE : COLOR_INACTIVE
            ctx.lineWidth = isActive ? 3 : 2
            ctx.strokeRect(card.x, card.y, card.w, card.h)

            if (isActive) {
                ctx.strokeStyle = COLOR_ACTIVE
                ctx.lineWidth = 1
                ctx.strokeRect(card.x + 4, card.y + 4, card.w - 8, card.h - 8)
            }

            ctx.fillStyle = isActive ? COLOR_ACTIVE : COLOR_INACTIVE
            ctx.font = 'bold 24px "VT323", monospace'
            const titleX = card.x + CARD_COLLISION_PADDING
            const titleY = card.y + 35
            ctx.fillText(card.title, titleX, titleY)

            const cardTextColor = CARD_COLORS[card.id] || COLOR_TEXT
            ctx.fillStyle = cardTextColor
            ctx.font = '18px "VT323", monospace'
            const textPadding = CARD_COLLISION_PADDING
            const maxTextWidth = card.w - textPadding * 2
            let textY = card.y + 65
            
            card.lines.forEach((line) => {
                if (line.trim()) {
                    if (line.includes('---') || line.includes('------------------')) {
                        ctx.fillStyle = cardTextColor
                    } else {
                        ctx.fillStyle = cardTextColor
                    }
                    
                    const metrics = ctx.measureText(line)
                    
                    if (metrics.width <= maxTextWidth) {
                        ctx.fillText(line, card.x + textPadding, textY)
                        textY += 22
                    } else {
                        const words = line.split(' ')
                        let currentLine = ''
                        
                        words.forEach((word, i) => {
                            const testLine = currentLine + (currentLine ? ' ' : '') + word
                            const testMetrics = ctx.measureText(testLine)
                            
                            if (testMetrics.width > maxTextWidth && currentLine) {
                                ctx.fillText(currentLine, card.x + textPadding, textY)
                                textY += 22
                                currentLine = word
                            } else {
                                currentLine = testLine
                            }
                            
                            if (i === words.length - 1) {
                                ctx.fillText(currentLine, card.x + textPadding, textY)
                                textY += 22
                            }
                        })
                    }
                    
                    if (textY > card.y + card.h - 30) {
                        return
                    }
                }
            })

            if (isActive) {
                ctx.fillStyle = COLOR_ACTIVE
                ctx.font = '16px "VT323", monospace'
                const hintText = t.ui.readDetails
                const hintX = card.x + card.w - CARD_COLLISION_PADDING
                const hintY = card.y + card.h - 15
                const textWidth = ctx.measureText(hintText).width
                ctx.fillText(hintText, hintX - textWidth, hintY)
                
                const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7
                ctx.globalAlpha = pulse
                ctx.fillStyle = COLOR_ACTIVE
                ctx.fillRect(card.x + 5, card.y + 5, 10, 10)
                ctx.globalAlpha = 1.0
            }
        }

        function drawTitle() {
            if (!ctx || !canvas) return
            const titleText = 'Portfolio di Biagio'
            ctx.fillStyle = COLOR_TEXT
            ctx.font = 'bold 48px "VT323", monospace'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'top'
            const titleX = canvas.width / 2
            const titleY = 20
            ctx.fillText(titleText, titleX, titleY)
            ctx.textAlign = 'left'
            ctx.textBaseline = 'alphabetic'
        }

        function draw() {
            if (!ctx || !canvas) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            
            drawTitle()
            CARDS.forEach(card => drawCard(card))
            
            // Draw interaction hints on canvas (for Sans, Frisk)
            if (currentCharacterRef.current === 'frisk' && activeSansCollisionRef.current) {
                const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7
                ctx.globalAlpha = pulse
                ctx.fillStyle = COLOR_ACTIVE
                ctx.font = '16px "VT323", monospace'
                const hintText = t.ui.talk
                const textWidth = ctx.measureText(hintText).width
                ctx.fillText(hintText, sansNPC.x + sansNPC.w / 2 - textWidth / 2, sansNPC.y - 10)
                ctx.globalAlpha = 1.0
            }
            
        }

        function loop() {
            update()
            draw()
            animationId = requestAnimationFrame(loop)
        }
        loop()

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            window.removeEventListener('character-switch', handleCharacterSwitch)
            window.removeEventListener('interact-sans', handleInteractSans)
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(animationId)
        }
    }, [language])

    useEffect(() => {
        const onOpen = (e: any) => setSelectedCardId(e.detail)
        window.addEventListener('open-card', onOpen)
        return () => window.removeEventListener('open-card', onOpen)
    }, [])

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current
            cardsRef.current = calculateCardPositions(canvas.width, canvas.height, language)
        }
    }, [language])

    useEffect(() => {
        // Only dispatch character switch if not loading from save initially
        // The save load already sets positions correctly in the canvas useEffect
        if (savedGameRef.current === null || savedGameRef.current === undefined) {
            const handleCharacterSwitch = () => {
                // Dispatch event to canvas to handle position swap
                window.dispatchEvent(new CustomEvent('character-switch', { 
                    detail: { newCharacter: currentCharacter } 
                }))
            }
            handleCharacterSwitch()
        } else {
            // Mark that we've processed the initial load
            savedGameRef.current = null
        }
    }, [currentCharacter])

    const selectedCard = cardsRef.current.find(c => c.id === selectedCardId)
    const portfolioData = portfolioTranslations[language]
    const t = getTranslations(language)

    const handleCharacterSwitch = () => {
        const newCharacter = currentCharacter === 'frisk' ? 'sans' : 'frisk'
        setCurrentCharacter(newCharacter)
        window.dispatchEvent(new CustomEvent('character-switch', { 
            detail: { newCharacter } 
        }))
    }

    return (
        <>
            <div className="control-buttons">
                <AudioControl />
                <SaveButton
                    language={language}
                    playerX={playerPositionRef.current?.x || 0}
                    playerY={playerPositionRef.current?.y || 0}
                    currentCharacter={currentCharacter}
                    visitedCards={visitedCards}
                    onSaveComplete={() => {
                        setShowSaveConfirmDialog(true)
                        setTimeout(() => {
                            setShowSaveConfirmDialog(false)
                        }, 1500)
                    }}
                />
                <CharacterButton
                    language={language}
                    currentCharacter={currentCharacter}
                    onSwitch={handleCharacterSwitch}
                />
            </div>
            <canvas ref={canvasRef} style={{ display: 'block', imageRendering: 'pixelated' }} />
            {/* Player character as img */}
            {playerPos && (
                <img
                    ref={playerImgRef}
                    src={currentCharacter === 'frisk' 
                        ? `/assets/sprites/frisk/${playerPos.dir}.png`
                        : `/assets/sprites/sans/sans-${playerPos.dir}-${(playerPos.frame % 4) + 1}.png`
                    }
                    alt={currentCharacter === 'frisk' ? 'Frisk' : 'Sans'}
                    style={{
                        position: 'absolute',
                        left: `${playerPos.x}px`,
                        top: `${playerPos.y}px`,
                        width: `${PLAYER_WIDTH}px`,
                        height: `${PLAYER_HEIGHT}px`,
                        imageRendering: 'pixelated',
                        pointerEvents: 'none',
                        zIndex: 10,
                        willChange: 'transform'
                    }}
                    onError={(e) => {
                        // Fallback if image fails to load
                        console.warn('Failed to load player sprite:', e)
                    }}
                />
            )}
            {/* Sans NPC as img */}
            {sansNPCPos && currentCharacter === 'frisk' && (
                <img
                    ref={sansNPCImgRef}
                    src={`/assets/sprites/sans/sans-${sansNPCPos.dir}-${(sansNPCPos.frame % 4) + 1}.png`}
                    alt="Sans NPC"
                    style={{
                        position: 'absolute',
                        left: `${sansNPCPos.x}px`,
                        top: `${sansNPCPos.y}px`,
                        width: `${PLAYER_WIDTH}px`,
                        height: `${PLAYER_HEIGHT}px`,
                        imageRendering: 'pixelated',
                        pointerEvents: 'none',
                        zIndex: 10,
                        willChange: 'transform'
                    }}
                    onError={(e) => {
                        console.warn('Failed to load Sans NPC sprite:', e)
                    }}
                />
            )}
            {selectedCard && (
                <DialogOverlay
                    title={selectedCard.title}
                    lines={getDialogContent(portfolioData, selectedCard.id, t.labels)}
                    iconClass={selectedCard.iconClass}
                    onClose={() => setSelectedCardId(null)}
                    skipText={t.ui.skip}
                    closeText={t.ui.close}
                    cardId={selectedCard.id}
                />
            )}
            {showSansDialog && (
                <ChoiceDialog
                    title="SANS"
                    lines={t.dialogues.sans.greeting}
                    options={t.dialogues.sans.options}
                    soundFile="/assets/audio/sans-parla.mp3"
                    onSelect={(choice) => {
                        setShowSansDialog(false)
                        if (choice === 0) {
                            setCurrentCharacter('sans')
                        }
                    }}
                    onClose={() => setShowSansDialog(false)}
                    skipText={t.ui.skip}
                    selectText={t.ui.select}
                    confirmText={t.ui.confirm}
                />
            )}
            {showSaveConfirmDialog && (
                <DialogOverlay
                    title="*"
                    lines={t.save.saved}
                    onClose={() => setShowSaveConfirmDialog(false)}
                    skipText=""
                    closeText=""
                />
            )}
            {showLoadDialog && (
                <DialogOverlay
                    title="*"
                    lines={t.save.journeyContinues}
                    onClose={() => {}}
                    skipText=""
                    closeText=""
                />
            )}
        </>
    )
}

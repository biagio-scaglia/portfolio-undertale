import { useEffect, useRef, useState } from 'react'
import { DialogOverlay } from './DialogOverlay'
import { ChoiceDialog } from './ChoiceDialog'
import { AudioControl } from './AudioControl'
import { getCardPreviewLines, getDialogContent, type CardData, type Language } from '../data/portfolioData'
import { portfolioTranslations } from '../data/portfolioTranslations'
import { getTranslations } from '../utils/i18n'
import { playCardOpen, playSave } from '../utils/audioManager'
import { saveGame, loadGame, type SaveData } from '../utils/saveSystem'
import { audioManager } from '../utils/audioManager'

// ===== GAME CONSTANTS =====
// Movement & Physics
const PLAYER_SPEED = 2
const PLAYER_WIDTH = 32
const PLAYER_HEIGHT = 48

// Card Dimensions
const CARD_WIDTH = 350
const CARD_HEIGHT = 220
const CARD_SPACING = 50
const CARD_COLLISION_PADDING = 10

// NPC Interaction
const NPC_INTERACTION_DISTANCE = 100
const NPC_COLLISION_PADDING = 20

// Animation Timing
const ANIMATION_FRAME_RATE = 20 // Frames per animation change
const SANS_ANIMATION_FRAMES = 4

// Camera & Scroll
const SCROLL_THROTTLE_MS = 16 // ~60fps
const SCROLL_THRESHOLD = 5 // pixels
const SCROLL_SMOOTHING = 0.3

// Colors (matching CSS variables)
const COLOR_ACTIVE = '#f7d51d'
const COLOR_INACTIVE = '#ffffff'
const COLOR_TEXT = '#ffffff'

// Card text colors - varied palette for better visual hierarchy and readability
const CARD_COLORS: Record<string, string> = {
    profile: '#ffd93d',      // Warm golden yellow (personal, inviting)
    experience: '#6bcfd4',    // Soft cyan (professional, calm)
    skills: '#a8d8ea',        // Sky blue (growth, clarity)
    projects: '#ff9a9e',      // Soft coral (creativity, warmth)
    contact: '#a8e6cf'        // Mint green (friendly, fresh)
}

// Helper to center cards on canvas
function calculateCardPositions(canvasWidth: number, canvasHeight: number, language: Language): CardData[] {
    const portfolioData = portfolioTranslations[language]
    const t = getTranslations(language)
    const cardsPerRow = 2
    const totalCards = 5
    const rows = Math.ceil(totalCards / cardsPerRow)
    
    // Calculate total width and height needed
    const totalWidth = cardsPerRow * CARD_WIDTH + (cardsPerRow - 1) * CARD_SPACING
    const totalHeight = rows * CARD_HEIGHT + (rows - 1) * CARD_SPACING
    
    // Center the grid
    const startX = (canvasWidth - totalWidth) / 2
    const startY = (canvasHeight - totalHeight) / 2
    
    const cards: CardData[] = []
    
    // Profile and Experience (row 1)
    cards.push({
        id: 'profile',
        x: startX,
        y: startY,
        w: CARD_WIDTH,
        h: CARD_HEIGHT,
        title: t.cards.profile,
        lines: getCardPreviewLines(portfolioData, 'profile', t.labels),
        iconClass: 'fa-solid fa-user'
    })
    cards.push({
        id: 'experience',
        x: startX + CARD_WIDTH + CARD_SPACING,
        y: startY,
        w: CARD_WIDTH,
        h: CARD_HEIGHT - 20,
        title: t.cards.experience,
        lines: getCardPreviewLines(portfolioData, 'experience', t.labels),
        iconClass: 'fa-solid fa-briefcase'
    })
    
    // Skills and Projects (row 2)
    cards.push({
        id: 'skills',
        x: startX,
        y: startY + CARD_HEIGHT + CARD_SPACING,
        w: CARD_WIDTH,
        h: CARD_HEIGHT - 20,
        title: t.cards.skills,
        lines: getCardPreviewLines(portfolioData, 'skills', t.labels),
        iconClass: 'fa-solid fa-code'
    })
    cards.push({
        id: 'projects',
        x: startX + CARD_WIDTH + CARD_SPACING,
        y: startY + CARD_HEIGHT + CARD_SPACING,
        w: CARD_WIDTH,
        h: CARD_HEIGHT,
        title: t.cards.projects,
        lines: getCardPreviewLines(portfolioData, 'projects', t.labels),
        iconClass: 'fa-solid fa-rocket'
    })
    
    // Contact (row 3, centered)
    cards.push({
        id: 'contact',
        x: startX + (CARD_WIDTH + CARD_SPACING) / 2,
        y: startY + (CARD_HEIGHT + CARD_SPACING) * 2,
        w: CARD_WIDTH,
        h: CARD_HEIGHT - 40,
        title: t.cards.contact,
        lines: getCardPreviewLines(portfolioData, 'contact', t.labels),
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

    // State for the active conversation
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
    
    // State for character swap
    const [currentCharacter, setCurrentCharacter] = useState<CharacterType>('frisk')
    const [showSansDialog, setShowSansDialog] = useState(false)
    const [showFriskSwapDialog, setShowFriskSwapDialog] = useState(false)
    
    // State for save system
    const [showSaveDialog, setShowSaveDialog] = useState(false)
    const [showSaveConfirmDialog, setShowSaveConfirmDialog] = useState(false)
    const [showLoadDialog, setShowLoadDialog] = useState(false)
    const [visitedCards, setVisitedCards] = useState<string[]>([])

    // We need a ref to access state inside the event listener/loop closure effectively
    // Or just rely on React re-renders which might re-bind listeners?
    // Better to use a ref for the selection state inside the loop if we want to pause update()
    const selectedCardIdRef = useRef<string | null>(null)
    const currentCharacterRef = useRef<CharacterType>('frisk')
    const showSansDialogRef = useRef(false)
    const showFriskSwapDialogRef = useRef(false)
    const showSaveDialogRef = useRef(false)
    const visitedCardsRef = useRef<string[]>([])
    const playerPositionRef = useRef<{ x: number; y: number } | null>(null)

    // Sync state to refs
    useEffect(() => {
        selectedCardIdRef.current = selectedCardId
        currentCharacterRef.current = currentCharacter
        showSansDialogRef.current = showSansDialog
        showFriskSwapDialogRef.current = showFriskSwapDialog
        showSaveDialogRef.current = showSaveDialog
        visitedCardsRef.current = visitedCards
    }, [selectedCardId, currentCharacter, showSansDialog, showFriskSwapDialog, showSaveDialog, visitedCards])
    
    // Track visited cards
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
    
    // Load game on mount
    useEffect(() => {
        const saved = loadGame()
        if (saved) {
            setShowLoadDialog(true)
            // Restore state after a brief delay to show the message
            setTimeout(() => {
                setCurrentCharacter(saved.currentCharacter)
                setVisitedCards(saved.visitedCards || [])
                audioManager.setEnabled(saved.audioEnabled !== false)
                setShowLoadDialog(false)
            }, 2000)
        }
    }, [])

    useEffect(() => {
        // ... canvas setup
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // ... setup
        canvas.width = window.innerWidth
        
        // Calculate minimum height needed for all cards
        const minHeight = (CARD_HEIGHT + CARD_SPACING) * 3 + CARD_SPACING
        canvas.height = Math.max(window.innerHeight, minHeight)
        
        ctx.imageSmoothingEnabled = false
        
        // Calculate centered card positions
        cardsRef.current = calculateCardPositions(canvas.width, canvas.height, language)
        const CARDS = cardsRef.current
        const t = getTranslations(language)

        // Find contact card position for initial spawn
        const contactCard = CARDS.find(c => c.id === 'contact')
        const spawnX = contactCard ? contactCard.x + contactCard.w + CARD_SPACING : canvas.width / 2 + 200
        const spawnY = contactCard ? contactCard.y + (contactCard.h / 2) - PLAYER_HEIGHT / 2 : canvas.height / 2 - PLAYER_HEIGHT / 2
        
        // Save Point position (yellow star) - left side of contact card
        const savePoint = {
            x: contactCard ? contactCard.x - 60 : canvas.width / 2 - 100,
            y: contactCard ? contactCard.y + (contactCard.h / 2) - 15 : canvas.height / 2 - 15,
            w: 30,
            h: 30
        }

        // Load saved position if available
        const saved = loadGame()
        const initialX = saved ? saved.playerX : spawnX
        const initialY = saved ? saved.playerY : spawnY

        // Player character (can be Frisk or Sans) - spawns near contact card or saved position
        const player = {
            x: initialX,
            y: initialY,
            w: PLAYER_WIDTH,
            h: PLAYER_HEIGHT,
            dir: 'avanti',
            frame: 0,
            animationFrame: 0
        }
        
        // Update player position ref for save system
        playerPositionRef.current = { x: player.x, y: player.y }

        // Sans NPC position (only visible when playing as Frisk)
        // Position Sans next to CONTACT card (right side, vertically centered)
        const sansNPCBaseX = spawnX
        const sansNPCBaseY = spawnY
        const sansNPC = {
            x: sansNPCBaseX,
            y: sansNPCBaseY,
            w: PLAYER_WIDTH,
            h: PLAYER_HEIGHT,
            dir: 'avanti',
            frame: 0,
            animationFrame: 0
        }

        // Frisk NPC position (only visible when playing as Sans)
        // Position Frisk in the same position as Sans NPC (next to CONTACT card)
        const friskNPC = {
            x: sansNPCBaseX,
            y: sansNPCBaseY,
            w: PLAYER_WIDTH,
            h: PLAYER_HEIGHT,
            dir: 'avanti'
        }

        // Load Frisk sprites
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

        // Load Sans sprites (animated 1-4 for each direction)
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

        // Load Save Point sprite
        const savePointSprite = new Image()
        savePointSprite.src = '/assets/sprites/savepoint.gif'

        const keys: Record<string, boolean> = {}
        
        const handleKeyDown = (e: KeyboardEvent) => {
            keys[e.key] = true
            // Dialog Interaction Trigger
            if ((e.key.toLowerCase() === 'z' || e.key === 'Enter') && !selectedCardIdRef.current && !showSansDialogRef.current && !showFriskSwapDialogRef.current && !showSaveDialogRef.current) {
                // Check collisions first to ensure they're up to date
                checkCollisions()
                
                // Check for Save Point interaction (priority)
                if (activeSavePointRef.current) {
                    e.preventDefault()
                    window.dispatchEvent(new CustomEvent('interact-save'))
                    return
                }
                // Check for Sans interaction (only when playing as Frisk)
                if (currentCharacterRef.current === 'frisk' && activeSansCollisionRef.current) {
                    e.preventDefault()
                    window.dispatchEvent(new CustomEvent('interact-sans'))
                    return
                }
                // Check for Frisk NPC interaction (only when playing as Sans)
                if (currentCharacterRef.current === 'sans' && activeFriskCollisionRef.current) {
                    e.preventDefault()
                    window.dispatchEvent(new CustomEvent('interact-frisk'))
                    return
                }
                // Check for card interaction
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

        // Listen for character switch to preserve positions
        const handleCharacterSwitch = (e: any) => {
            const newCharacter = e.detail.newCharacter
            // When switching, both characters should be in the same position (near contacts)
            if (newCharacter === 'sans') {
                // Switching from Frisk to Sans: 
                // Sans (player) goes to Sans NPC position (near contacts)
                // Frisk NPC goes to the same position (near contacts)
                player.x = sansNPCBaseX
                player.y = sansNPCBaseY
                friskNPC.x = sansNPCBaseX
                friskNPC.y = sansNPCBaseY
            } else if (newCharacter === 'frisk') {
                // Switching from Sans to Frisk:
                // Frisk (player) goes to Sans NPC position (near contacts)
                // Sans NPC goes back to its base position (near contacts)
                player.x = sansNPCBaseX
                player.y = sansNPCBaseY
                sansNPC.x = sansNPCBaseX
                sansNPC.y = sansNPCBaseY
            }
        }
        window.addEventListener('character-switch', handleCharacterSwitch)

        // Listen for Sans interaction
        const handleInteractSans = () => {
            if (currentCharacterRef.current === 'frisk') {
                setShowSansDialog(true)
            }
        }
        window.addEventListener('interact-sans', handleInteractSans)

        // Listen for Frisk NPC interaction
        const handleInteractFrisk = () => {
            if (currentCharacterRef.current === 'sans') {
                setShowFriskSwapDialog(true)
            }
        }
        window.addEventListener('interact-frisk', handleInteractFrisk)
        
        // Listen for Save Point interaction
        const handleInteractSave = () => {
            setShowSaveDialog(true)
        }
        window.addEventListener('interact-save', handleInteractSave)

        let animationId: number
        const activeCollisionRef = { current: null as string | null }
        const activeSansCollisionRef = { current: false }
        const activeFriskCollisionRef = { current: false }
        const activeSavePointRef = { current: false }

        function checkCollisions() {
            activeCollisionRef.current = null
            activeSansCollisionRef.current = false
            activeFriskCollisionRef.current = false
            activeSavePointRef.current = false
            
            // Check card collisions
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
            
            // Check Sans NPC collision (only when playing as Frisk)
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
            
            // Check Frisk NPC collision (only when playing as Sans)
            if (currentCharacterRef.current === 'sans') {
                if (
                    player.x < friskNPC.x + friskNPC.w + NPC_COLLISION_PADDING &&
                    player.x + player.w > friskNPC.x - NPC_COLLISION_PADDING &&
                    player.y < friskNPC.y + friskNPC.h + NPC_COLLISION_PADDING &&
                    player.y + player.h > friskNPC.y - NPC_COLLISION_PADDING
                ) {
                    activeFriskCollisionRef.current = true
                }
            }
            
            // Check Save Point collision
            const playerCenterX = player.x + player.w / 2
            const playerCenterY = player.y + player.h / 2
            const saveCenterX = savePoint.x + savePoint.w / 2
            const saveCenterY = savePoint.y + savePoint.h / 2
            const distance = Math.sqrt(
                Math.pow(playerCenterX - saveCenterX, 2) + 
                Math.pow(playerCenterY - saveCenterY, 2)
            )
            if (distance < NPC_INTERACTION_DISTANCE) {
                activeSavePointRef.current = true
            }
        }

        function update() {
            if (!canvas) return

            // PAUSE IF DIALOG OPEN
            if (selectedCardIdRef.current) {
                // Don't move
                return
            }

            // Update animation frame for Sans
            if (currentCharacterRef.current === 'sans') {
                player.animationFrame++
                if (player.animationFrame >= ANIMATION_FRAME_RATE) {
                    player.frame = (player.frame + 1) % SANS_ANIMATION_FRAMES
                    player.animationFrame = 0
                }
            }
            
            // Update Sans NPC animation
            sansNPC.animationFrame++
            if (sansNPC.animationFrame >= ANIMATION_FRAME_RATE) {
                sansNPC.frame = (sansNPC.frame + 1) % SANS_ANIMATION_FRAMES
                sansNPC.animationFrame = 0
            }
            
            // Save Point animation is handled by the GIF itself

            // Movement input handling
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

            // Bounds
            if (player.x < 0) player.x = 0
            if (player.y < 0) player.y = 0
            if (player.x > canvas.width - player.w) player.x = canvas.width - player.w
            if (player.y > canvas.height - player.h) player.y = canvas.height - player.h

            // Update player position ref for save system
            playerPositionRef.current = { x: player.x, y: player.y }

            checkCollisions()
            
            // Auto-scroll to follow player (only if moving to reduce jitter)
            const isMoving = keys['ArrowUp'] || keys['ArrowDown'] || keys['ArrowLeft'] || keys['ArrowRight']
            if (isMoving) {
                scrollToFollowPlayer(player, canvas)
            }
        }
        
        let lastScrollTime = 0
        
        function scrollToFollowPlayer(player: { x: number; y: number; w: number; h: number }, canvas: HTMLCanvasElement) {
            const now = Date.now()
            if (now - lastScrollTime < SCROLL_THROTTLE_MS) {
                return // Throttle scroll updates
            }
            lastScrollTime = now
            
            const viewportHeight = window.innerHeight
            const viewportWidth = window.innerWidth
            
            // Get canvas position relative to viewport
            const canvasRect = canvas.getBoundingClientRect()
            const playerCanvasY = player.y + player.h / 2
            const playerCanvasX = player.x + player.w / 2
            
            // Calculate absolute position of player on page
            const playerAbsoluteY = canvasRect.top + playerCanvasY
            const playerAbsoluteX = canvasRect.left + playerCanvasX
            
            // Target: keep player centered in viewport
            const viewportCenterY = window.scrollY + viewportHeight / 2
            const viewportCenterX = window.scrollX + viewportWidth / 2
            
            // Calculate how much to scroll to center the player
            const scrollDeltaY = playerAbsoluteY - viewportCenterY
            const scrollDeltaX = playerAbsoluteX - viewportCenterX
            
            // Only scroll if player is significantly off-center (reduce jitter)
            if (Math.abs(scrollDeltaY) < SCROLL_THRESHOLD && Math.abs(scrollDeltaX) < SCROLL_THRESHOLD) {
                return // Don't scroll if already centered
            }
            
            // Apply scroll with smoothing factor to reduce jitter
            const newScrollY = window.scrollY + scrollDeltaY * SCROLL_SMOOTHING
            const newScrollX = window.scrollX + scrollDeltaX * SCROLL_SMOOTHING
            
            // Clamp to document bounds
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

            // Draw card background
            ctx.fillStyle = 'black'
            ctx.fillRect(card.x, card.y, card.w, card.h)

            // Draw border with active state
            ctx.strokeStyle = isActive ? COLOR_ACTIVE : COLOR_INACTIVE
            ctx.lineWidth = isActive ? 3 : 2
            ctx.strokeRect(card.x, card.y, card.w, card.h)

            // Draw inner border for active state (double border effect)
            if (isActive) {
                ctx.strokeStyle = COLOR_ACTIVE
                ctx.lineWidth = 1
                ctx.strokeRect(card.x + 4, card.y + 4, card.w - 8, card.h - 8)
            }

            // Draw title with icon
            ctx.fillStyle = isActive ? COLOR_ACTIVE : COLOR_INACTIVE
            ctx.font = 'bold 24px "VT323", monospace'
            const titleX = card.x + CARD_COLLISION_PADDING
            const titleY = card.y + 35
            ctx.fillText(card.title, titleX, titleY)

            // Draw content lines with text wrapping
            // Use card-specific color or fallback to white
            const cardTextColor = CARD_COLORS[card.id] || COLOR_TEXT
            ctx.fillStyle = cardTextColor
            ctx.font = '18px "VT323", monospace'
            const textPadding = CARD_COLLISION_PADDING
            const maxTextWidth = card.w - textPadding * 2
            let textY = card.y + 65
            
            card.lines.forEach((line) => {
                if (line.trim()) {
                    // Alternate between card color and a slightly lighter/darker variant for visual interest
                    // Skip separator lines (keep them in card color)
                    if (line.includes('---') || line.includes('------------------')) {
                        ctx.fillStyle = cardTextColor
                    } else {
                        // Use card color for most lines, but add subtle variation
                        ctx.fillStyle = cardTextColor
                    }
                    
                    // Measure text width
                    const metrics = ctx.measureText(line)
                    
                    // If text fits, draw it normally
                    if (metrics.width <= maxTextWidth) {
                        ctx.fillText(line, card.x + textPadding, textY)
                        textY += 22
                    } else {
                        // Text wrapping: split into words and wrap
                        const words = line.split(' ')
                        let currentLine = ''
                        
                        words.forEach((word, i) => {
                            const testLine = currentLine + (currentLine ? ' ' : '') + word
                            const testMetrics = ctx.measureText(testLine)
                            
                            if (testMetrics.width > maxTextWidth && currentLine) {
                                // Draw current line and start new one
                                ctx.fillText(currentLine, card.x + textPadding, textY)
                                textY += 22
                                currentLine = word
                            } else {
                                currentLine = testLine
                            }
                            
                            // Draw last word/line
                            if (i === words.length - 1) {
                                ctx.fillText(currentLine, card.x + textPadding, textY)
                                textY += 22
                            }
                        })
                    }
                    
                    // Stop if we've run out of vertical space
                    if (textY > card.y + card.h - 30) {
                        return
                    }
                }
            })

            // Draw interaction hint with better visual feedback
            if (isActive) {
                ctx.fillStyle = COLOR_ACTIVE
                ctx.font = '16px "VT323", monospace'
                const hintText = t.ui.readDetails
                const hintX = card.x + card.w - CARD_COLLISION_PADDING
                const hintY = card.y + card.h - 15
                // Measure text for right alignment
                const textWidth = ctx.measureText(hintText).width
                ctx.fillText(hintText, hintX - textWidth, hintY)
                
                // Draw pulsing indicator (more visible)
                const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7
                ctx.globalAlpha = pulse
                ctx.fillStyle = COLOR_ACTIVE
                ctx.fillRect(card.x + 5, card.y + 5, 10, 10)
                ctx.globalAlpha = 1.0
            }
        }

        function drawSavePoint() {
            if (!ctx) return
            
            // Draw Save Point sprite (animated GIF)
            if (savePointSprite.complete && savePointSprite.naturalWidth > 0) {
                ctx.drawImage(savePointSprite, savePoint.x, savePoint.y, savePoint.w, savePoint.h)
            }
            
            // Draw interaction hint
            if (activeSavePointRef.current) {
                const centerX = savePoint.x + savePoint.w / 2
                const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7
                ctx.globalAlpha = pulse
                ctx.fillStyle = COLOR_ACTIVE
                ctx.font = '16px "VT323", monospace'
                const hintText = t.ui.talk
                const textWidth = ctx.measureText(hintText).width
                ctx.fillText(hintText, centerX - textWidth / 2, savePoint.y - 10)
                ctx.globalAlpha = 1.0
            }
        }

        function draw() {
            if (!ctx || !canvas) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            
            // Draw cards
            CARDS.forEach(card => drawCard(card))
            
            // Draw Save Point
            drawSavePoint()
            
            // Draw player character
            if (currentCharacterRef.current === 'frisk') {
                const sprite = friskSprites[player.dir]
                ctx.drawImage(sprite, player.x, player.y, player.w, player.h)
            } else {
                // Draw Sans with animation
                const sansSprite = sansSprites[player.dir][player.frame]
                if (sansSprite.complete) {
                    ctx.drawImage(sansSprite, player.x, player.y, player.w, player.h)
                }
            }
            
            // Draw Sans NPC (only when playing as Frisk)
            if (currentCharacterRef.current === 'frisk') {
                const sansSprite = sansSprites[sansNPC.dir][sansNPC.frame]
                if (sansSprite.complete) {
                    ctx.drawImage(sansSprite, sansNPC.x, sansNPC.y, sansNPC.w, sansNPC.h)
                }
                
                // Draw interaction hint for Sans with pulsing effect
                if (activeSansCollisionRef.current) {
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
            
            // Draw Frisk NPC (only when playing as Sans)
            if (currentCharacterRef.current === 'sans') {
                const friskSprite = friskSprites.avanti
                ctx.drawImage(friskSprite, friskNPC.x, friskNPC.y, friskNPC.w, friskNPC.h)
                
                // Draw interaction hint for Frisk NPC with pulsing effect
                if (activeFriskCollisionRef.current) {
                    const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7
                    ctx.globalAlpha = pulse
                    ctx.fillStyle = COLOR_ACTIVE
                    ctx.font = '16px "VT323", monospace'
                    const hintText = t.ui.talk
                    const textWidth = ctx.measureText(hintText).width
                    ctx.fillText(hintText, friskNPC.x + friskNPC.w / 2 - textWidth / 2, friskNPC.y - 10)
                    ctx.globalAlpha = 1.0
                }
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
            window.removeEventListener('interact-frisk', handleInteractFrisk)
            window.removeEventListener('interact-save', handleInteractSave)
            cancelAnimationFrame(animationId)
        }
    }, [language]) // Re-run when language changes

    // Listen for the custom event to trigger state change safely
    useEffect(() => {
        const onOpen = (e: any) => setSelectedCardId(e.detail)
        window.addEventListener('open-card', onOpen)
        return () => window.removeEventListener('open-card', onOpen)
    }, [])

    // Recalculate cards when language changes
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current
            cardsRef.current = calculateCardPositions(canvas.width, canvas.height, language)
        }
    }, [language])

    // Listen for character switch and handle position preservation
    useEffect(() => {
        const handleCharacterSwitch = () => {
            // Dispatch event to canvas to handle position swap
            window.dispatchEvent(new CustomEvent('character-switch', { 
                detail: { newCharacter: currentCharacter } 
            }))
        }
        handleCharacterSwitch()
    }, [currentCharacter])

    const selectedCard = cardsRef.current.find(c => c.id === selectedCardId)
    const portfolioData = portfolioTranslations[language]
    const t = getTranslations(language)

    return (
        <>
            <AudioControl />
            <canvas ref={canvasRef} style={{ display: 'block', imageRendering: 'pixelated' }} />
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
                            // Yes - switch to Sans
                            setCurrentCharacter('sans')
                        }
                    }}
                    onClose={() => setShowSansDialog(false)}
                    skipText={t.ui.skip}
                    selectText={t.ui.select}
                    confirmText={t.ui.confirm}
                />
            )}
            {showFriskSwapDialog && (
                <ChoiceDialog
                    title="FRISK"
                    lines={t.dialogues.frisk.swap}
                    options={t.dialogues.frisk.options}
                    onSelect={(choice) => {
                        setShowFriskSwapDialog(false)
                        if (choice === 0) {
                            // Switch back to Frisk
                            setCurrentCharacter('frisk')
                        }
                    }}
                    onClose={() => setShowFriskSwapDialog(false)}
                    skipText={t.ui.skip}
                    selectText={t.ui.select}
                    confirmText={t.ui.confirm}
                />
            )}
            {showSaveDialog && (
                <ChoiceDialog
                    title="*"
                    lines={t.save.determination}
                    options={[t.save.saveOption, t.save.returnOption]}
                    onSelect={(choice) => {
                        setShowSaveDialog(false)
                        if (choice === 0) {
                            // Save game
                            const pos = playerPositionRef.current || { x: 0, y: 0 }
                            const saveData: SaveData = {
                                playerX: pos.x,
                                playerY: pos.y,
                                currentCharacter: currentCharacter,
                                visitedCards: visitedCards,
                                audioEnabled: audioManager.isEnabled(),
                                language: language,
                                timestamp: Date.now()
                            }
                            saveGame(saveData)
                            playSave()
                            setShowSaveConfirmDialog(true)
                            setTimeout(() => {
                                setShowSaveConfirmDialog(false)
                            }, 1500)
                        }
                    }}
                    onClose={() => setShowSaveDialog(false)}
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

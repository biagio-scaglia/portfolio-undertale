import { useEffect, useRef, useState } from 'react'
import { DialogOverlay } from './DialogOverlay'
import { ChoiceDialog } from './ChoiceDialog'
import { AudioControl } from './AudioControl'
import { SaveButton } from './SaveButton'
import { CharacterButton } from './CharacterButton'
import { getDialogContent, type CardData, type Language } from '../data/portfolioData'
import { portfolioTranslations } from '../data/portfolioTranslations'
import { getTranslations } from '../utils/i18n'
import { playCardOpen } from '../utils/audioManager'
import { loadGame, type SaveData } from '../utils/saveSystem'
import { audioManager } from '../utils/audioManager'
import { 
    PLAYER_SPEED, 
    PLAYER_WIDTH, 
    PLAYER_HEIGHT, 
    CARD_HEIGHT, 
    CARD_SPACING, 
    TITLE_HEIGHT, 
    TITLE_SPACING,
    ANIMATION_FRAME_RATE,
    SANS_ANIMATION_FRAMES
} from '../constants/gameConstants'
import { calculateCardPositions } from '../utils/cardUtils'
import { scrollToFollowPlayer } from '../utils/scrollUtils'
import { checkCardCollision, checkNPCCollision } from '../utils/collisionUtils'
import { drawCard, drawTitle, drawInteractionHint } from '../utils/canvasUtils'

type CharacterType = 'frisk' | 'sans'

type Props = {
    language: Language
}

export function Explore({ language }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const cardsRef = useRef<CardData[]>([])

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

        // NPC always starts at spawn position
        const sansNPC = {
            x: spawnX,
            y: spawnY,
            w: PLAYER_WIDTH,
            h: PLAYER_HEIGHT,
            dir: 'avanti' as const,
            frame: 0,
            animationFrame: 0
        }
        
        // Initialize NPC positions for img rendering
        setSansNPCPos({
            x: sansNPC.x,
            y: sansNPC.y,
            dir: sansNPC.dir,
            frame: sansNPC.frame
        })

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

        const handleCharacterSwitch = () => {
            // NPC always stays at spawn position
            sansNPC.x = spawnX
            sansNPC.y = spawnY
        }
        window.addEventListener('character-switch', () => handleCharacterSwitch())

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
            activeCollisionRef.current = checkCardCollision(player, CARDS)
            
            if (currentCharacterRef.current === 'frisk') {
                activeSansCollisionRef.current = checkNPCCollision(player, sansNPC)
            } else {
                activeSansCollisionRef.current = false
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
        
        function draw() {
            if (!ctx || !canvas) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            
            drawTitle(ctx, canvas)
            CARDS.forEach(card => {
                drawCard(ctx, card, card.id === activeCollisionRef.current, t)
            })
            
            if (currentCharacterRef.current === 'frisk' && activeSansCollisionRef.current) {
                drawInteractionHint(ctx, sansNPC.x + sansNPC.w / 2, sansNPC.y, t.ui.talk)
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
                />
            )}
            {sansNPCPos && currentCharacter === 'frisk' && (
                <img
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

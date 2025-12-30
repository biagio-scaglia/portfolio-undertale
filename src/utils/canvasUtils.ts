import type { CardData } from '../data/portfolioData'
import { 
    CARD_COLLISION_PADDING, 
    COLOR_ACTIVE, 
    COLOR_INACTIVE, 
    COLOR_TEXT,
    CARD_COLORS
} from '../constants/gameConstants'
import type { Translations } from '../utils/i18n'

export function drawCard(
    ctx: CanvasRenderingContext2D,
    card: CardData,
    isActive: boolean,
    translations: Translations
): void {
    // Draw card background
    ctx.fillStyle = 'black'
    ctx.fillRect(card.x, card.y, card.w, card.h)
    
    // Draw card border
    ctx.strokeStyle = isActive ? COLOR_ACTIVE : COLOR_INACTIVE
    ctx.lineWidth = isActive ? 3 : 2
    ctx.strokeRect(card.x, card.y, card.w, card.h)

    // Draw active border highlight
    if (isActive) {
        ctx.strokeStyle = COLOR_ACTIVE
        ctx.lineWidth = 1
        ctx.strokeRect(card.x + 4, card.y + 4, card.w - 8, card.h - 8)
    }

    // Draw card title
    ctx.fillStyle = isActive ? COLOR_ACTIVE : COLOR_INACTIVE
    ctx.font = 'bold 24px "VT323", monospace'
    const titleX = card.x + CARD_COLLISION_PADDING
    const titleY = card.y + 35
    ctx.fillText(card.title, titleX, titleY)

    // Draw card text
    const cardTextColor = CARD_COLORS[card.id] || COLOR_TEXT
    ctx.fillStyle = cardTextColor
    ctx.font = '18px "VT323", monospace'
    const textPadding = CARD_COLLISION_PADDING
    const maxTextWidth = card.w - textPadding * 2
    let textY = card.y + 65
    
    card.lines.forEach((line) => {
        if (!line.trim()) return
        
        const metrics = ctx.measureText(line)
        
        if (metrics.width <= maxTextWidth) {
            ctx.fillText(line, card.x + textPadding, textY)
            textY += 22
        } else {
            // Word wrap for long lines
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
    })

    // Draw active hint
    if (isActive) {
        ctx.fillStyle = COLOR_ACTIVE
        ctx.font = '16px "VT323", monospace'
        const hintText = translations.ui.readDetails
        const hintX = card.x + card.w - CARD_COLLISION_PADDING
        const hintY = card.y + card.h - 15
        const textWidth = ctx.measureText(hintText).width
        ctx.fillText(hintText, hintX - textWidth, hintY)
        
        // Draw pulse effect
        const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7
        ctx.globalAlpha = pulse
        ctx.fillStyle = COLOR_ACTIVE
        ctx.fillRect(card.x + 5, card.y + 5, 10, 10)
        ctx.globalAlpha = 1.0
    }
}

export function drawTitle(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
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

export function drawInteractionHint(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string
): void {
    const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7
    ctx.globalAlpha = pulse
    ctx.fillStyle = COLOR_ACTIVE
    ctx.font = '16px "VT323", monospace'
    const textWidth = ctx.measureText(text).width
    ctx.fillText(text, x - textWidth / 2, y - 10)
    ctx.globalAlpha = 1.0
}


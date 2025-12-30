import { SCROLL_THROTTLE_MS, SCROLL_THRESHOLD, SCROLL_SMOOTHING } from '../constants/gameConstants'

let lastScrollTime = 0

export function scrollToFollowPlayer(
    player: { x: number; y: number; w: number; h: number },
    canvas: HTMLCanvasElement
): void {
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


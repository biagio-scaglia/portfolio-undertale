import type { CardData } from '../data/portfolioData'
import { CARD_COLLISION_PADDING, NPC_INTERACTION_DISTANCE } from '../constants/gameConstants'

export function checkCardCollision(
    player: { x: number; y: number; w: number; h: number },
    cards: CardData[]
): string | null {
    for (const card of cards) {
        if (
            player.x < card.x + card.w + CARD_COLLISION_PADDING &&
            player.x + player.w > card.x - CARD_COLLISION_PADDING &&
            player.y < card.y + card.h + CARD_COLLISION_PADDING &&
            player.y + player.h > card.y - CARD_COLLISION_PADDING
        ) {
            return card.id
        }
    }
    return null
}

export function checkNPCCollision(
    player: { x: number; y: number; w: number; h: number },
    npc: { x: number; y: number; w: number; h: number }
): boolean {
    const playerCenterX = player.x + player.w / 2
    const playerCenterY = player.y + player.h / 2
    const npcCenterX = npc.x + npc.w / 2
    const npcCenterY = npc.y + npc.h / 2
    const distance = Math.sqrt(
        Math.pow(playerCenterX - npcCenterX, 2) + 
        Math.pow(playerCenterY - npcCenterY, 2)
    )
    return distance < NPC_INTERACTION_DISTANCE
}


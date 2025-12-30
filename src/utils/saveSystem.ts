export interface SaveData {
    playerX: number
    playerY: number
    currentCharacter: 'frisk' | 'sans'
    visitedCards: string[]
    audioEnabled: boolean
    language: 'it' | 'en' | 'es'
    timestamp: number
}

const SAVE_KEY = 'undertale_portfolio_save'

export function saveGame(data: SaveData): void {
    try {
        const saveData = {
            ...data,
            timestamp: Date.now()
        }
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData))
    } catch (err) {
        console.warn('Failed to save game:', err)
    }
}

export function loadGame(): SaveData | null {
    try {
        const saved = localStorage.getItem(SAVE_KEY)
        if (!saved) return null
        
        const data = JSON.parse(saved) as SaveData
        return data
    } catch (err) {
        console.warn('Failed to load game:', err)
        return null
    }
}

export function hasSave(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null
}

export function deleteSave(): void {
    try {
        localStorage.removeItem(SAVE_KEY)
    } catch (err) {
        console.warn('Failed to delete save:', err)
    }
}


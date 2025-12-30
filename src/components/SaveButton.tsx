import { getTranslations, type Language } from '../utils/i18n'
import { saveGame, type SaveData } from '../utils/saveSystem'
import { playSave } from '../utils/audioManager'
import { audioManager } from '../utils/audioManager'

type Props = {
    language: Language
    playerX: number
    playerY: number
    currentCharacter: 'frisk' | 'sans'
    visitedCards: string[]
    onSaveComplete?: () => void
}

export function SaveButton({ language, playerX, playerY, currentCharacter, visitedCards, onSaveComplete }: Props) {
    const t = getTranslations(language)

    const handleSave = () => {
        const saveData: SaveData = {
            playerX,
            playerY,
            currentCharacter,
            visitedCards,
            audioEnabled: audioManager.isEnabled(),
            language,
            timestamp: Date.now()
        }
        saveGame(saveData)
        playSave()
        if (onSaveComplete) {
            onSaveComplete()
        }
    }

    return (
        <button
            className="control-button"
            onClick={handleSave}
            aria-label={t.ui.save}
            title={t.ui.save}
        >
            💾 {t.ui.save}
        </button>
    )
}


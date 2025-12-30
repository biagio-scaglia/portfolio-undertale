import { getTranslations, type Language } from '../utils/i18n'

type Props = {
    language: Language
    currentCharacter: 'frisk' | 'sans'
    onSwitch: () => void
}

export function CharacterButton({ language, currentCharacter, onSwitch }: Props) {
    const t = getTranslations(language)

    return (
        <button
            className="control-button"
            onClick={onSwitch}
            aria-label={t.ui.character}
            title={t.ui.character}
        >
            {currentCharacter === 'frisk' ? '👤 FRISK' : '💀 SANS'}
        </button>
    )
}


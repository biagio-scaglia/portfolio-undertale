import { useState, useEffect } from 'react'
import { playMenuSelect, playMenuConfirm, playMenuQuit } from '../utils/audioManager'
import { getTranslations, getLanguageName, type Language } from '../utils/i18n'

type Props = {
    onExplore: (language: Language) => void
    onQuit: () => void
}

export function StartScreen({ onExplore, onQuit }: Props) {
    const [mode, setMode] = useState<'language' | 'main'>('language')
    const [selectedLanguage, setSelectedLanguage] = useState<Language>('it')
    const [selectedMain, setSelectedMain] = useState(0)
    
    const languages: Language[] = ['it', 'en', 'es']
    const t = getTranslations(selectedLanguage)
    const mainOptions = [t.startScreen.explore, t.startScreen.quit]

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (mode === 'language') {
                if (e.key === 'ArrowUp') {
                    const currentIndex = languages.indexOf(selectedLanguage)
                    const newIndex = currentIndex > 0 ? currentIndex - 1 : languages.length - 1
                    setSelectedLanguage(languages[newIndex])
                    playMenuSelect()
                }
                if (e.key === 'ArrowDown') {
                    const currentIndex = languages.indexOf(selectedLanguage)
                    const newIndex = currentIndex < languages.length - 1 ? currentIndex + 1 : 0
                    setSelectedLanguage(languages[newIndex])
                    playMenuSelect()
                }
                if (e.key === 'Enter' || e.key.toLowerCase() === 'z') {
                    playMenuConfirm()
                    setMode('main')
                }
            } else {
                if (e.key === 'ArrowUp') {
                    setSelectedMain(0)
                    playMenuSelect()
                }
                if (e.key === 'ArrowDown') {
                    setSelectedMain(1)
                    playMenuSelect()
                }
                if (e.key === 'Enter' || e.key.toLowerCase() === 'z') {
                    if (selectedMain === 0) {
                        playMenuConfirm()
                        onExplore(selectedLanguage)
                    } else {
                        playMenuQuit()
                        onQuit()
                    }
                }
                if (e.key === 'Escape') {
                    setMode('language')
                }
            }
        }

        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [mode, selectedLanguage, selectedMain, onExplore, onQuit])

    return (
        <div className="start-screen">
            <div className="title">{t.startScreen.title}</div>

            {mode === 'language' ? (
                <div className="menu">
                    <div style={{ marginBottom: '20px', fontSize: '18px', color: '#ffffff' }}>
                        {t.startScreen.language}
                    </div>
                    {languages.map((lang) => (
                        <div
                            key={lang}
                            className={`menu-item ${selectedLanguage === lang ? 'selected' : ''}`}
                            onClick={() => {
                                setSelectedLanguage(lang)
                                playMenuSelect()
                            }}
                            onMouseEnter={() => {
                                if (selectedLanguage !== lang) {
                                    setSelectedLanguage(lang)
                                    playMenuSelect()
                                }
                            }}
                            tabIndex={0}
                            role="button"
                            aria-label={getLanguageName(lang)}
                        >
                            {selectedLanguage === lang ? '▶ ' : '  '}
                            {getLanguageName(lang)}
                        </div>
                    ))}
                    <div style={{ marginTop: '20px', fontSize: '14px', color: '#888' }}>
                        [↑↓] SELECT  [Z] CONFIRM
                    </div>
                </div>
            ) : (
                <div className="menu">
                    {mainOptions.map((opt, i) => (
                        <div
                            key={opt}
                            className={`menu-item ${selectedMain === i ? 'selected' : ''}`}
                            onClick={() => {
                                if (i === 0) {
                                    playMenuConfirm()
                                    onExplore(selectedLanguage)
                                } else {
                                    playMenuQuit()
                                    onQuit()
                                }
                            }}
                            onMouseEnter={() => {
                                if (selectedMain !== i) {
                                    setSelectedMain(i)
                                    playMenuSelect()
                                }
                            }}
                            tabIndex={0}
                            role="button"
                            aria-label={opt}
                        >
                            {selectedMain === i ? '▶ ' : '  '}
                            {opt}
                        </div>
                    ))}
                    <div style={{ marginTop: '20px', fontSize: '14px', color: '#888' }}>
                        [ESC] BACK
                    </div>
                </div>
            )}
        </div>
    )
}

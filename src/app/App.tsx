import { useState } from 'react'
import { StartScreen } from '../components/StartScreen'
import { Explore } from '../components/Explore'
import type { Language } from '../data/portfolioData'
import { getTranslations } from '../utils/i18n'

type GameMode = 'start' | 'explore' | 'quit'

function App() {
    const [mode, setMode] = useState<GameMode>('start')
    const [language, setLanguage] = useState<Language>('it')

    if (mode === 'start') {
        return (
            <StartScreen
                onExplore={(lang) => {
                    setLanguage(lang)
                    setMode('explore')
                }}
                onQuit={() => setMode('quit')}
            />
        )
    }

    if (mode === 'quit') {
        const t = getTranslations(language)
        return (
            <div className="start-screen">
                <div className="title" style={{ fontSize: '24px' }}>
                    {t.startScreen.goodbye}
                </div>
                <div style={{ marginTop: '20px', fontSize: '18px', color: '#666' }}>
                    {t.startScreen.refreshToRestart}
                </div>
            </div>
        )
    }

    return <Explore language={language} />
}

export default App

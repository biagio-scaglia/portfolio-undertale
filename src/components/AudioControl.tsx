import { useState, useEffect } from 'react'
import { audioManager } from '../utils/audioManager'

export function AudioControl() {
    const [isMuted, setIsMuted] = useState(!audioManager.isEnabled())

    useEffect(() => {
        // Sync with audio manager state
        setIsMuted(!audioManager.isEnabled())
    }, [])

    const toggleMute = () => {
        const newMuted = !isMuted
        setIsMuted(newMuted)
        audioManager.setEnabled(!newMuted)
    }

    // Keyboard shortcut: M to toggle mute
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                // Only toggle if not typing in an input
                const target = e.target as HTMLElement
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    e.preventDefault()
                    toggleMute()
                }
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [isMuted])

    return (
        <button
            className={`audio-control ${isMuted ? 'muted' : ''}`}
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            title={`${isMuted ? 'Unmute' : 'Mute'} audio (M)`}
        >
            {isMuted ? '🔇 MUTE' : '🔊 SOUND'}
        </button>
    )
}

